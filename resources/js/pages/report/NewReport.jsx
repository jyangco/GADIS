import React, { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { NumericFormat } from 'react-number-format'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class NewReport extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            years: [],
            ReportYears: [],
            PPA: [],
            user_title: "",
            report_year: "",
            report_type: "",
            total_budget: "",
            activity_list: {ids: []},
            status: "Draft",
            action_by: JSON.parse(localStorage.getItem('auth')).name,
            submitted: false,
            disabled: true
        }
    }

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleChangeYear = (event) => {
        this.setState({
            report_year: event.target.value
        })
        setTimeout(() => {
            if (this.state.report_type == "GAR") {
                const ids = this.state.PPA.filter(yr => yr.act_year == this.state.report_year && yr.status == "Done").map((c) => c.act_id)
                this.setState({
                    activity_list: { ids: ids }
                })
            }
        }, 5)
    }

    //CHECKBOX CHECKING AND GETTING VALUE
    handleCheckAllChange = (e) => {
        if (e.target.checked) {
            if (this.state.report_type == "GAR") {
                const ids = this.state.PPA.filter(yr => yr.act_year == this.state.report_year && yr.status == "Done").map((c) => c.act_id)
                this.setState({
                    activity_list: { ids: ids }
                })
            } else {
                const ids = this.state.PPA.filter(yr => yr.act_year == this.state.report_year).map((c) => c.act_id)
                this.setState({
                    activity_list: { ids: ids }
                })
            }
        } else {
            this.setState({
                activity_list: { ids: [] }
            })
        }
    }
    handleChecked = (e, act) => {
        if (e.target.checked) {
            this.setState({
                activity_list: { ids: [...this.state.activity_list.ids, act.act_id] }
            })
        } else {
            const tempData = this.state.activity_list.ids.filter((item) => item !== act.act_id)
            this.setState({
                activity_list: { ids: tempData }
            })
        }
    }

    handleSubmitForm = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
        newFormData.append('report_type', this.state.report_type)
        newFormData.append('report_year', this.state.report_year)
        newFormData.append('total_budget', (this.state.total_budget).replace(/,/g, ""))
        newFormData.append('status', this.state.status)
        newFormData.append('activity_list', JSON.stringify(this.state.activity_list))
        newFormData.append('action_by', this.state.action_by)
        axios.post('/api/newGPB',(newFormData))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.setState({
                submitted: true
            })
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

    //get years per report type
    handleSetType = (e) => {
        e.preventDefault()
        const data = {
            report_type: this.state.report_type
        }
        axios.post('/api/getYearforReports', data).then(response => {
            this.setState({
                ReportYears: response.data,
                disabled: false
            })
        })
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        // getting all activities with complete details
        try {
            const res = await axios.get('/api/getTitle')
            this.setState({
                user_title: res.data,
            })
            const response = await axios.get('/api/getAllDetails')
            this.setState({
                PPA: response.data.direct,
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
        const { user_title, PPA, submitted, years, ReportYears, loading, disabled } = this.state
        if (submitted) {
            return(
                <Navigate to={"/Reports"}/>
            )
        }
        if (loading) {
            return (
                <Layout title={"/ Report / New"}>
                    <Loader/>
                </Layout>
            )
        }
        return (
            <Layout title={"/ Report / New"}>
                <Link className="back-btn text-decoration-none" to="/Reports">
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="text-center text-3xl mobile-lg:text-lg"> New GAD Report </div>
                <div className="p-5">
                    <form className="createForms text-lg" onSubmit={this.handleSubmitForm}>
                        <div className="d-flex justify-content-center">
                            {disabled == true ?
                                <div className="text-danger text-base fw-bold">
                                    <p> *This Field is Required First </p>
                                </div> : 
                                <div className="text-base fw-bold">
                                    <p> (<span className="text-danger">*</span>) <span className="text-danger"> Required Fields </span> </p>
                                </div>
                            }
                        </div>
                        <div className="d-flex justify-content-center">
                            <div className="form-group my-3">
                                <label> Report Type: </label>
                                <select
                                    name="report_type" 
                                    className="custom-select ms-2 border border-dark outline-none"
                                    value={this.state.report_type}
                                    onChange={this.handleFieldChange}
                                >
                                    <option className="text-center" > -- Select Value -- </option>
                                    <option className="text-center" value="GPB" > GPB </option>
                                    <option className="text-center" value="GAR" > GAR </option>
                                </select>
                                <button 
                                    disabled={ this.state.report_type.length == 0 ? true : false } 
                                    className={ this.state.report_type.length == 0 ? "bg-secondary opacity-50 px-2 py-1 fs-4 ms-3" : "bg-success px-2 py-1 fs-4 ms-3" } 
                                    onClick={this.handleSetType}
                                >
                                    <i className="fas fa-sync text-white"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-50">
                                <div className="form-group my-3">
                                    <label> Year: </label>
                                    <select disabled={disabled}
                                        name="report_year" 
                                        className={disabled ? "opacity-50 custom-select ms-2 border border-dark outline-none" : "custom-select ms-2 border border-dark outline-none"}
                                        value={this.state.report_year}
                                        onChange={this.handleChangeYear}
                                    >
                                        <option className="text-center" > -- Select Value -- </option>
                                        {years.map((val,i) => 
                                            <option className="text-center" value={val} key={i}> {val} </option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="w-50">
                                <div className="form-group mb-3">
                                    <label> Report Status: </label>
                                    <input 
                                        className='ms-2 bg-transparent border-transparent border-2 border-b-slate-950'
                                        type='text'
                                        disabled
                                        defaultValue={this.state.status}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-50">
                                <div className="form-group mb-3">
                                    <label> Total GAA of Organization: </label>
                                    <span> ₱  </span>
                                    <NumericFormat
                                        disabled={disabled}
                                        name='total_budget'
                                        className="opacity-50 outline-none bg-transparent border-transparent border-2 border-b-slate-950"
                                        placeholder={disabled ? "Input field disabled" : "0.00"}
                                        displayType="input"
                                        thousandSeparator={true}
                                        thousandsGroupStyle="thousand"
                                        value={this.state.total_budget}
                                        onChange={this.handleFieldChange}
                                    />
                                </div>
                            </div>
                        </div>
                        {ReportYears.includes(Number(this.state.report_year)) ?
                            <div className="text-center text-3xl fw-bold mt-5"> {this.state.report_type} for {this.state.report_year} is already made </div> 
                            :
                            <div>
                                <div className={this.state.report_type.length == 0 ? "d-none" : "text-lg fw-bold"}> Select Activities to include on the {this.state.report_type} for year {this.state.report_year}  </div>
                                <div className={this.state.report_year.length == 0 ? "d-none" : "my-2"}> <strong> GAD Activities for FY {this.state.report_year} </strong> </div>
                                {this.state.report_year.length != 0 ?
                                    <div className="flex border p-1">
                                        <div className="px-1">
                                            <input className="text-lg"
                                                onChange={this.handleCheckAllChange}
                                                checked={
                                                    this.state.report_type == "GAR" ?
                                                    PPA.filter(yr => yr.act_year == this.state.report_year && yr.status == "Done").length === this.state.activity_list.ids.length :
                                                    PPA.filter(yr => yr.act_year == this.state.report_year).length === this.state.activity_list.ids.length
                                                }
                                                type="checkbox"
                                            />
                                        </div>
                                        <label className="mx-0 text-lg ms-2"> Select All </label>
                                    </div> : ""
                                }
                                {this.state.report_type == "GAR" ? 
                                    PPA.filter(yr => yr.act_year == this.state.report_year && yr.status == "Done").map((act, i) =>
                                        <div className="flex border p-1" key={i}>
                                            <div className="px-1">
                                                <input className="text-lg"
                                                    onChange={(e) => this.handleChecked(e, act)}
                                                    value={act.act_id}
                                                    checked={this.state.activity_list.ids.includes(act.act_id)}
                                                    type="checkbox"
                                                />
                                            </div>
                                            <label className="mx-0 text-lg">
                                                {act.act_atitles.length > 1 ?
                                                    <ol className="ms-2">
                                                        {act.act_atitles.map((titles,index) => (
                                                            <li key={index}> {titles.act_title} </li>
                                                        ))}
                                                    </ol> : 
                                                    act.act_atitles.map((titles,index) => (
                                                        <div className="ms-2" key={index}> {titles.act_title} </div>
                                                    ))
                                                }
                                            </label>
                                        </div>
                                    ) : 
                                    PPA.filter(yr => yr.act_year == this.state.report_year).map((act, i) =>
                                        <div className="flex border p-1" key={i}>
                                            <div className="px-1">
                                                <input className="text-lg"
                                                    onChange={(e) => this.handleChecked(e, act)}
                                                    value={act.act_id}
                                                    checked={this.state.activity_list.ids.includes(act.act_id)}
                                                    type="checkbox"
                                                />
                                            </div>
                                            <label className="mx-0 text-lg">
                                                {act.act_atitles.length > 1 ?
                                                    <ol className="ms-2">
                                                        {act.act_atitles.map((titles,index) => (
                                                            <li key={index}> {titles.act_title} </li>
                                                        ))}
                                                    </ol> : 
                                                    act.act_atitles.map((titles,index) => (
                                                        <div className="ms-2" key={index}> {titles.act_title} </div>
                                                    ))
                                                }
                                            </label>
                                        </div>
                                    )
                                }
                                {this.state.report_year.length != 0 && user_title.position_name == "GAD Secretariat" ?
                                    <div className="d-flex justify-content-center mt-5">
                                        <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                                    </div> : ""
                                }   
                            </div>
                        }
                    </form>
                </div>
            </Layout>
        )
    }
}

export default NewReport