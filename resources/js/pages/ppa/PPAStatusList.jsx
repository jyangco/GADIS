import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class PPAStatusList extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            filterYear: new Date().getFullYear(),
            filterStatus: "all",
            years: "",
            PPA: [],
            Attrib: []
        }
    }

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //Change year and data
    handleYearFilter = (event) => {
        this.setState({
            filterYear: event.target.value
        })
        setTimeout(() => {
            this.handleChangeData()
        }, 50)
    }

    //Change displayed data
    handleChangeData = () => {
        const data = {
            filterYear: this.state.filterYear
        }
        axios.post('/api/filterStatus', data).then(response => {
            this.setState({
                PPA: response.data.direct,
                Attrib: response.data.attrib
            })
        })
    }

    //getting all data for the current year
    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        try {
            const response = await axios.get('/api/getPPAStatus')
            this.setState({
                PPA: response.data.direct,
                Attrib: response.data.attrib,
            })
            const years = await axios.get('/api/getYears')
            this.setState({
                years: years.data,
                loading: false
            })
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    render() {
        const { PPA, Attrib, years, filterYear, filterStatus, loading } = this.state
        if (loading){
            return (
                <Layout title={"/ GAD PPA Status"}>
                    <Loader/>
                </Layout>
            )
        }
        var view = ""
        if (filterStatus == "all") {
            view = (
                PPA.map((data, ndx) => 
                    <tr key={ndx} className="ppaDetails">
                        <td className="border"> {data.act_year} </td>
                        <td className="border"> 
                            {data.act_atitles.length > 1 ?
                                <ol className="m-0">
                                    {data.act_atitles.map((titles,index) => (
                                        <li key={index}> {titles.act_title} </li>
                                    ))}
                                </ol> : 
                                data.act_atitles.map((titles,index) => (
                                    <div className="m-0" key={index}> {titles.act_title} </div>
                                ))
                            }
                        </td>
                        <td className="border"> {data.status} </td>
                    </tr>
                )
            )
        } else {
            view = (
                PPA.filter(act => act.status == filterStatus).map((data, ndx) => 
                    <tr key={ndx} className="ppaDetails">
                        <td className="border"> {data.act_year} </td>
                        <td className="border"> 
                            {data.act_atitles.length > 1 ?
                                <ol className="m-0">
                                    {data.act_atitles.map((titles,index) => (
                                        <li key={index}> {titles.act_title} </li>
                                    ))}
                                </ol> : 
                                data.act_atitles.map((titles,index) => (
                                    <div className="m-0" key={index}> {titles.act_title} </div>
                                ))
                            }
                        </td>
                        <td className="border"> {data.status} </td>
                    </tr>
                )
            )
        }
        return (
            <Layout title={"/ GAD PPA Status"}>
                <div className="card-header">
                    <div className="text-center text-3xl"> GAD PPA Status </div>
                </div>
                <div className="card-body p-5 mobile-lg:!p-2">
                    <form className="createForms">
                        <div className="form-group my-3 text-lg inline-block w-100">
                            <div className="contents mobile-lg:flex mobile-lg:flex-wrap">
                                <label> Filter by Year <i className="far fa-filter mx-1"></i> </label>
                                <select
                                    name="filterYear" 
                                    className="custom-select ms-2 border border-dark outline-none mobile-lg:!w-[100%]"
                                    value={this.state.filterYear}
                                    onChange={this.handleYearFilter}
                                >
                                    <option className="text-center"> -- Select Value -- </option>
                                    <option className="text-center" value={"all"} > All </option>
                                    {years.map((val,i) => 
                                        <option className="text-center" value={val} key={i}> {val} </option>
                                    )}
                                </select>
                            </div>
                            {/* <button 
                                disabled={ filterYear.length == 0 ? true : false } 
                                className={ filterYear.length == 0 ? "bg-secondary opacity-50 px-2 py-1 fs-4 ms-3" : "bg-success px-2 py-1 fs-4 ms-3" } 
                                onClick={this.handleChangeData}
                            >
                                <i className="fas fa-sync text-white"></i>
                            </button> */}
                            <div className="vr mx-5 mobile-lg:!hidden"></div>
                            <div className="contents mobile-lg:flex mobile-lg:flex-wrap">
                                <label> Filter by Status <i className="far fa-filter mx-1"></i> </label>
                                <select
                                    name="filterStatus" 
                                    className="custom-select ms-2 border border-dark outline-none mobile-lg:!w-[100%]"
                                    value={this.state.filterStatus}
                                    onChange={this.handleFieldChange}
                                >
                                    <option className="text-center" value={"all"} > All </option>
                                    <option className="text-center" value={"For Implementation"} > For Implementation </option>
                                    <option className="text-center" value={"Ongoing"} > Ongoing </option>
                                    <option className="text-center" value={"Done"} > Done </option>
                                </select>
                            </div>
                        </div>
                        <table className="table text-xl border mobile-xs:!text-xs">
                            <thead>
                                <tr>
                                    <th className="border"> Year </th>
                                    <th className="border w-75"> GAD Activity </th>
                                    <th className="border w-25"> Status </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={2} className="fw-bold text-center text-primary ms-5">
                                        Direct PPAs
                                    </td>
                                </tr>
                                {view}
                            </tbody>
                        </table>
                    </form>
                </div>
            </Layout>
        )
    }
}

export default PPAStatusList