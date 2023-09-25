import React, { Component } from 'react'
import { NumericFormat } from 'react-number-format'
import Swal from 'sweetalert2'
import axios from 'axios'

export class AttributedPPA extends Component {
    constructor(props){
        super(props)
        this.state = {
            isNew: false,
            disable: true,
            years: [],
            attrib_PPAs: [],
            attrib_year: "",
            attrib_title: "",
            attrib_responsible_unit: "",
            attrib_budget: "",
            attrib_class: "",
            attrib_source: "",
            attrib_source_code: "",
            action_by: JSON.parse(localStorage.getItem('auth')).name
        }
    }

    //CHANGE INPUT FIELDS
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //Change input field for new Activity
    handleNewActivity = (e) => {
        e.preventDefault()
        this.setState(prevState => ({
            isNew: !prevState.isNew
        }))
    }

    //RESET INPUT
    resetInputs(){
        this.setState({
            isNew: false,
            disable: true,
            attrib_year: "",
            attrib_title: "",
            attrib_responsible_unit: "",
            attrib_budget: "",
            attrib_class: "",
            attrib_source: "",
            attrib_source_code: "",
        })
    }

    //change disable state
    handleDisableState = (e) => {
        e.preventDefault()
        this.setState({
            attrib_year: e.target.value,
            disable: false
        })
    }

    //HandleSubmit
    handleSubmitAttrib = (e) => {
        e.preventDefault()
        const data = {
            attrib_title: this.state.attrib_title,
            attrib_year: this.state.attrib_year,
            attrib_responsible_unit: this.state.attrib_responsible_unit,
            attrib_budget: (this.state.attrib_budget).replace(/,/g, ""),
            attrib_class: this.state.attrib_class,
            attrib_source: this.state.attrib_source,
            attrib_source_code: this.state.attrib_source_code,
            action_by: this.state.action_by
        }
        axios.post(`/api/newAttrib`, (data))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.resetInputs()
            } else if (response.data.status == 400) {
                Swal.fire("Warning", "Please complete the required fields before submitting", "warning")
            }
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

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        try {
            const res = await axios ('/api/getAttrib')
            this.setState({
                attrib_PPAs: res.data
            })
            const response = await axios.get('/api/getYears')
            this.setState({
                years: response.data,
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
        const { isNew, attrib_PPAs, disable, years } = this.state
        const proponents = ["GFPS/GAD TWG", "OD", "STSD", "SEID", "STMERPD", "FAD", "CODI"]
        return (
            <div className="card-body">
                <form className="createForms" onSubmit={this.handleSubmitAttrib}>
                    <div className="text-2xl fw-bold text-primary mb-3 ms-5 mobile-lg:!ms-3">
                        I. Activity Details:
                    </div>
                    <div className="form-group text-xl mb-2">
                        {disable == true ?
                            <div className="text-danger text-base fw-bold">
                                <p> *This Field is Required First </p>
                            </div> : 
                            <div className="text-base fw-bold">
                                <p> (<span className="text-danger">*</span>) <span className="text-danger"> Required Fields </span> </p>
                            </div>
                        }
                        <label htmlFor="attrib_year" className='m-0'> Year: </label>
                        <select
                            name="attrib_year" 
                            className="custom-select ms-2 border border-dark"
                            value={this.state.attrib_year}
                            onChange={this.handleDisableState}
                        >
                            <option value={""}> -- Select Value -- </option>
                            {years.map((val,i) => (
                                <option className='text-center' key={i} value={val}> {val} </option>
                            ))}
                        </select>
                        {/* <button 
                            disabled={ this.state.attrib_year.length == 0 ? true : false } 
                            className={ this.state.attrib_year.length == 0 ? "bg-secondary opacity-50 px-2 py-1 fs-4 ms-3" : "bg-success px-2 py-1 fs-4 ms-3" } 
                            onClick={this.handleDisableState}
                        >
                            <i className="fas fa-sync text-white"></i>
                        </button> */}
                    </div>
                    <div className="form-group text-xl mb-2">
                        <label htmlFor="attrib_title" className='m-0'> GAD Activity:
                        <span className={ disable == false && this.state.attrib_title.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </label>
                        <div className="d-flex">
                            <div className="inputFields w-75">
                                {isNew ? 
                                    <input 
                                        disabled={disable}
                                        className={disable ? "opacity-50 w-100 border-2 border-transparent border-b-slate-950" : "w-100 border-2 border-transparent border-b-slate-950 outline-none"}
                                        type="text"
                                        name="attrib_title" 
                                        placeholder="Input Activity"
                                        value={this.state.attrib_title}
                                        onChange={this.handleFieldChange}
                                    /> :
                                    <select
                                        disabled={disable}
                                        name="attrib_title" 
                                        className={disable ? "opacity-50 custom-select ms-2 w-100 border border-dark" : "custom-select ms-2 w-100 border border-dark"}
                                        value={this.state.attrib_title}
                                        onChange={this.handleFieldChange}
                                    >
                                        <option className="text-center" value={""}> -- Select Value -- </option>
                                        {attrib_PPAs.map((val,i) => (
                                            <option value={val.attrib_title} key={i}> {val.attrib_title} </option>
                                        ))}
                                    </select>
                                }
                            </div>
                            <button 
                                disabled={disable}
                                className={ disable ? "bg-secondary opacity-50 px-2 text-lg ms-3" : "bg-success px-2 fs-4 ms-3" } 
                                onClick={this.handleNewActivity}
                            >
                                <i className="fas fa-exchange text-white"></i>
                            </button>
                        </div>
                    </div>
                    <div className="form-group text-xl">
                        <label htmlFor="attrib_responsible_unit" className='m-0'> Responsible Unit: </label>
                        <select
                            disabled={disable}
                            name="attrib_responsible_unit" 
                            className={disable ? "opacity-50 custom-select ms-2 border border-dark" : "custom-select ms-2 border border-dark"}
                            value={this.state.attrib_responsible_unit}
                            onChange={this.handleFieldChange}
                        >
                            <option className='text-center' value={""}> -- Select Value -- </option>
                            {proponents.map((val, i) => (
                                <option className='text-center' value={val} key={i}> {val} </option>
                            ))}
                        </select>
                        <span className={ disable == false && this.state.attrib_responsible_unit.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                    </div>
                    <div className="text-2xl fw-bold text-primary m-3 ms-5 mobile-lg:!ms-3">
                        II. Activity Budgetary Details
                    </div>
                    <div className="d-flex flex-wrap">
                        <div className="form-group w-50 mobile-lg:!w-[100%] position-relative text-xl p-2">
                            <label htmlFor="attrib_budget" className="m-0"> GAD Budget: <span> ₱ </span> </label>
                            <NumericFormat 
                                disabled={disable}
                                className={disable ? "w-50 m-0 border-2 border-transparent border-b-slate-950 mobile-lg:!w-[90%]" :  "mobile-lg:!w-[90%] w-50 m-0 text-right outline-none border-2 border-transparent border-b-slate-950"}
                                placeholder={disable ? "Input Field Disabled" : "0.00"}
                                type="text" 
                                name="attrib_budget"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator={true}
                                thousandsGroupStyle="thousand"
                                value={this.state.attrib_budget}
                                onChange={this.handleFieldChange}
                            />
                            <span className={ disable == false && this.state.attrib_budget.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </div>
                        <div className="form-group w-50 mobile-lg:!w-[100%] position-relative text-xl p-2">
                            <label htmlFor="attrib_source" className='m-0'> Budget Source: </label>
                            <select
                                disabled={disable}
                                name="attrib_source" 
                                className={disable ? "opacity-50 custom-select m-0 w-50 border border-dark mobile-lg:!w-[90%]" : "mobile-lg:!w-[90%] custom-select m-0 w-50 border border-dark"}
                                value={this.state.attrib_source}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center' value={""}> -- Select Value -- </option>
                                <option className='text-center' value="GAA"> GAA </option>
                                <option className='text-center' value="Others"> Others </option>
                                <option className='text-center' value="N/A"> N/A </option>
                            </select>
                            <span className={ disable == false && this.state.attrib_source.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </div>
                        <div className="form-group w-50 mobile-lg:!w-[100%] position-relative text-xl p-2">
                            <label htmlFor="attrib_class" className='m-0'> Expense Class: </label>
                            <select
                                disabled={disable}
                                name="attrib_class" 
                                className={disable ? "opacity-50 custom-select m-0 w-50 border border-dark mobile-lg:!w-[90%]" : "mobile-lg:!w-[90%] custom-select m-0 w-50 border border-dark"}
                                value={this.state.attrib_class}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center' value={""}> -- Select Value -- </option>
                                <option className='text-center' value="MOOE"> MOOE </option>
                                <option className='text-center' value="PS"> PS </option>
                                <option className='text-center' value="CO"> CO </option>
                                <option className='text-center' value="PAP"> PAP </option>
                                <option className='text-center' value="Others"> Others </option>
                                <option className='text-center' value="N/A"> N/A </option>
                            </select>
                            <span className={ disable == false && this.state.attrib_class.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </div>
                        <div className="form-group w-50 mobile-lg:!w-[100%] position-relative text-xl p-2">
                            <label htmlFor="attrib_source_code" className='m-0'> Bugdet Source Code: </label>
                            <select
                                disabled={disable}
                                name="attrib_source_code" 
                                className={disable ? "opacity-50 custom-select m-0 w-50 border border-dark mobile-lg:!w-[90%]" : "mobile-lg:!w-[90%] custom-select m-0 w-50 border border-dark"}
                                value={this.state.attrib_source_code}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center' value={""}> -- Select Value -- </option>
                                <option className='text-center' value="2A1"> 2A1 </option>
                                <option className='text-center' value="2A2"> 2A2 </option>
                                <option className='text-center' value="2A1-AC"> 2A1-AC </option>
                                <option className='text-center' value="MITHI"> MITHI </option>
                                <option className='text-center' value="Others"> Others </option>
                                <option className='text-center' value="N/A"> N/A </option>
                            </select>
                            <span className={ disable == false && this.state.attrib_source_code.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default AttributedPPA