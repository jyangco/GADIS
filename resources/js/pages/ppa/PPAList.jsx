import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'
import moment from 'moment'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}

export class PPAList extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            show: "",
            PPA: [],
            Attribs: [],
            years: [],
            log: [],
            filterYear: new Date().getFullYear()
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        //getting all GPB entries
        try {
            const response = await axios.get('/api/showAllActivities')
            this.setState({
                PPA: response.data.direct,
                Attribs: response.data.attrib,
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

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        setTimeout(() => {
            this.handleChangeData()
        }, 5)
    }

    //Change displayed data
    handleChangeData = () => {
        const data = {
            filterYear: this.state.filterYear
        }
        axios.post('/api/filterPPA', data).then(response => {
            this.setState({
                PPA: response.data,
            })
        })
    }

    //viewing of logs
    handleViewHistory = (id) => {
        const data = {
            act_id: id
        }
        axios.post('/api/getPPAHistory', data).then(response => {
            this.setState({
                log: response.data,
                show: data.act_id
            })
        })
    }

    handleClose = (e) => {
        e.preventDefault()
        this.setState({
            show: "",
            log: []
        })
    }

    render() {
        const { PPA, Attribs, years, log, loading, show } = this.state
        if (loading) {
            return(
                <Layout title={"/ GAD PPAs"}>
                    <Loader/>  
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD PPAs"}>
                {role == 'admin' ?
                    <Link className="back-btn text-decoration-none" to="/PPA/New">
                        <i className="far fa-plus p-1 rounded-circle"></i>
                        <span className="tooltip-text text-sm ms-1">Add new</span>
                    </Link> : ""
                }
                <div className="text-center text-3xl"> GAD PPAs </div>
                <div className="p-5 mobile-lg:!p-2">
                    <form className="createForms">
                        <div className="form-group my-3 text-lg">
                            <label> Filter by Year <i className="far fa-filter mx-1"></i> </label>
                            <select
                                name="filterYear" 
                                className="custom-select ms-2 border border-dark outline-none"
                                value={this.state.filterYear}
                                onChange={this.handleFieldChange}
                            >
                                <option className="text-center"> -- Select Value -- </option>
                                <option className="text-center" value={"all"} > All </option>
                                {years.map((val,i) => (
                                    <option className="text-center" value={val} key={i}> {val} </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-2xl fw-bold text-primary mt-3 ms-3">
                            Direct PPAs
                        </div>
                        <div className="flex flex-wrap my-3">
                            {PPA.length == 0 ? "" :
                                PPA.map((act,i) => 
                                    <div className="mobile-lg:!w-[100%] w-50 text-xl p-3" key={i}>
                                        <div id="ppaContainer" className="position-relative p-3">
                                            <div className="absolute top-0 start-0">
                                                <div className="bg-warning p-1 border rounded-lg" onClick={() => this.handleViewHistory(act.act_id)}>
                                                    <i className="fas fa-history"></i>
                                                </div>
                                                <div className={show == act.act_id ? "d-block" : "d-none"}>
                                                    <div className="z-997 absolute border bg-white w-72 h-96 overflow-auto">
                                                        <div className="text-2xl text-center border border-dark p-2"> 
                                                            Logs <i className="ms-1 fas fa-history fa-pulse"></i>
                                                        </div>
                                                        <button className="bg-danger text-white p-1 absolute top-0 right-0 z-998" onClick={this.handleClose} >
                                                            <i className="far fa-times"></i>
                                                        </button>
                                                        {log.map((val, idx) => 
                                                            <div className="p-2 px-3 border border-dark text-base" key={idx}>
                                                                <p className="fw-bold"> {moment(val.date).format("LL")} </p>
                                                                <p> <span className="fw-bold"> action: </span> {val.action} </p>
                                                                <p> <span className="fw-bold"> by: </span> {val.action_by} </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link 
                                                className={show == act.act_id ?
                                                    "text-dark text-decoration-none opacity-50" : "text-dark text-decoration-none"
                                                }
                                                to={`/PPA/Direct/${act.act_id}`} state={{ id: `${act.act_id}` }}
                                            >
                                                <div className="pill position-absolute top-0 start-100 translate-middle p-2 text-base rounded-pill border"> {i + 1} </div>
                                                <div className="text-center m-0 text-3xl"> FY {act.act_year} </div>
                                                <div className="text-end m-0 text-lg"> Status:
                                                    {act.status == "For Implementation" ? 
                                                        <span className="text-primary"> {act.status} </span> : 
                                                    act.status == "Ongoing" ?
                                                        <span className="text-warning"> {act.status} </span> : 
                                                    act.status == "Done" ?
                                                        <span className="text-success"> {act.status} </span> : ""
                                                    } 
                                                </div>
                                                <hr/>
                                                <div className="m-0"> <strong> Gender Issue: </strong> <div className="ms-5 mobile-lg:!ms-4"> {act.act_gad_mandate} </div> </div> 
                                                <hr/>
                                                <div className="m-0"> <strong> Cause of Gender Issue: </strong> <div className="ms-5 mobile-lg:!ms-4"> {act.act_cause_of_issue} </div> </div> 
                                                <hr/>
                                                <div className="m-0"> <strong> GAD Objective: </strong> <div className="ms-5 mobile-lg:!ms-4"> {act.act_gad_objective} </div> </div> 
                                                <hr/>
                                                <div className="m-0"> <strong> GAD Activity: </strong> 
                                                    {act.act_atitles.length > 1 ?
                                                        <ol className="ms-5 mobile-lg:!ms-4">
                                                            {act.act_atitles.map((titles,index) => (
                                                                <li key={index}> {titles.act_title} </li>
                                                            ))}
                                                        </ol> : 
                                                        act.act_atitles.map((titles,index) => (
                                                            <div className="ms-5 mobile-lg:!ms-4" key={index}> {titles.act_title} </div>
                                                        ))
                                                    }
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="text-2xl fw-bold text-primary mt-3 ms-3">
                            Attributed PPAs
                        </div>
                        <div className="d-flex flex-wrap justify-content-between my-3">
                            {Attribs.map((act,i) => 
                                <div className="mobile-lg:!w-[100%] w-50 text-xl p-3" key={i}>
                                    <div id="ppaContainer" className="position-relative p-3">
                                        <Link to={`/PPA/Attributed/${act.attrib_title_id}`} state={{ id: `${act.attrib_title_id}` }} className="text-dark text-decoration-none">
                                            <div className="pill position-absolute top-0 start-100 translate-middle p-2 text-base rounded-pill border"> {i + 1} </div>
                                            <div className="m-0"> <strong> GAD Activity: </strong> <br/> <span className="ms-5 mobile-lg:!ms-4"> {act.attrib_title} </span> </div> 
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </Layout>
        )
    }
}

export default PPAList