import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import { ProvincialMAP } from '../GISmap/phProvinceMAP'

export class SDD extends Component {
    constructor(props){
        super(props)
        this.state = {
            year: "",
            region: "",
            province: "",
            type: "",
            male: "",
            female: "",
            total: "",
            action_by: JSON.parse(localStorage.getItem('auth')).name,
        }
    }

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleMaleChange = (event) => {
        const male = Number(event.target.value)
        this.setState(prevState => ({
            male,
            total: male + prevState.female
        }))
    }
        
    handleFemaleChange = (event) => {
        const female = Number(event.target.value)
        this.setState(prevState => ({
            female,
            total: prevState.male + female
        }))
    }

    //add SDD
    handleSubmitForm = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
        newFormData.append('male', this.state.male)
        newFormData.append('female', this.state.female)
        newFormData.append('total', this.state.total)
        newFormData.append('year', this.state.year)
        newFormData.append('province', this.state.province)
        newFormData.append('region', this.state.region)
        newFormData.append('type', this.state.type)
        newFormData.append('action_by', this.state.action_by)
        axios.post('/api/newSDD',(newFormData))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.formReset()
        })
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "error",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    formReset = () =>{
        this.setState({
            year: "",
            region: "",
            province: "",
            type: "",
            male: "",
            female: "",
            total: "",
        })
    }

    render() {
        const regions = [
            'Region I (Ilocos Region)',
            'Region II (Cagayan Valley)',
            'Region III (Central Luzon)',
            'Region IV-A (CALABARZON)',
            'Region IV-B (MIMAROPA)',
            'Region V (Bicol Region)',
            'Region VI (Western Visayas)',
            'Region VII (Central Visayas)',
            'Region VIII (Eastern Visayas)',
            'Region IX (Zamboanga Peninsula)',
            'Region X (Northern Mindanao)',
            'Region XI (Davao Region)',
            'Region XII (SOCCSKSARGEN)',
            'Region XIII (Caraga)',
            'National Capital Region (NCR)',
            'Cordillera Administrative Region (CAR)',
            'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'
        ]
        const years = []
        for (let index = 2015; index <= new Date().getFullYear() + 1; index++) {
            years.push(index)
        }
        return (
            <div className='p-5'>
                <div className="text-center text-3xl"> Sex Disaggregated Data </div>
                <div className="card-body">
                    <form className="createForms text-lg" onSubmit={this.handleSubmitForm}>
                        <div className="form-group my-2">
                            <label>Year: </label>
                            <select
                                name="year" 
                                className="custom-select ms-2 border border-dark outline-none"
                                value={this.state.year}
                                onChange={this.handleFieldChange}
                            >
                                <option className="text-center" value={""}> -- Select Value -- </option>
                                {years.map((val,i) => 
                                    <option className="text-center" value={val} key={i}> {val} </option>
                                )}
                            </select>
                        </div>
                        <div className="form-group my-2">
                            <label>Region: </label>
                            <select
                                name="region" 
                                className="custom-select ms-2 border border-dark outline-none"
                                value={this.state.region}
                                onChange={this.handleFieldChange}
                            >
                                <option className="text-center" value={""}> -- Select Value -- </option>
                                {regions.map((val,i) => 
                                    <option value={val} key={i}> {val} </option>
                                )}
                            </select>
                        </div>
                        <div className="form-group my-2">
                            <label>Province: </label>
                            <select
                                name="province" 
                                className="custom-select ms-2 border border-dark outline-none"
                                value={this.state.province}
                                onChange={this.handleFieldChange}
                            >
                                <option className="text-center" value={""}> -- Select Value -- </option>
                                {ProvincialMAP.features.filter(el => el.properties.REGION == this.state.region).map((value, idx) =>
                                    <option key={idx} value={value.properties.PROVINCE}> {value.properties.PROVINCE} </option>
                                )}
                            </select>
                        </div>
                        <div className="form-group my-2">
                            <label>Type: </label>
                            <select
                                name="type" 
                                className="custom-select ms-2 border border-dark outline-none"
                                value={this.state.type}
                                onChange={this.handleFieldChange}
                            >
                                <option className="text-center" value={""}> -- Select Value -- </option>
                                <option value="Graduate"> Graduate </option>
                                <option value="Undergraduate"> Undergraduate </option>
                            </select>
                        </div>
                        <table className="table table-bordered my-3">
                            <thead>
                                <tr>
                                    <th className="text-center"> Male </th>
                                    <th className="text-center"> Female </th>
                                    <th className="text-center"> Total </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input className="remove-arrow w-100 border-b-2 border-dark outline-none"
                                            type="number" 
                                            placeholder="Male ..." 
                                            name='male'
                                            onChange={this.handleMaleChange}
                                            value={this.state.male}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input className="remove-arrow w-100 border-b-2 border-dark outline-none"
                                            type="number" 
                                            placeholder="Female ..." 
                                            name='female'
                                            onChange={this.handleFemaleChange}
                                            value={this.state.female}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input className="remove-arrow w-100 border-b-2 border-dark outline-none"
                                            type="number" 
                                            placeholder="Total ..." 
                                            name='total'
                                            onChange={this.handleFieldChange}
                                            value={this.state.total}
                                            required
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center mt-5">
                            <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SDD