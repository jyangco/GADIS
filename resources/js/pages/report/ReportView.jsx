import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'

import GPB from './GPB'
import GAR from './GAR'
import SDD from './SDD'
import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}

export class ReportView extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            GPBYears: [],
            GARYears: [],
            PPA: [],
            Attrib: [],
            Directbudgets: [],
            Attribbudgets: [],
            signatories: "",
            user_title: "",
            view: ""
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        // getting all activities with complete details
        try {
            const signatories = await axios.get('/api/getSignatories')
            this.setState({
                signatories: signatories.data,
            })
            const budget = await axios.get('/api/BudgetList')
            this.setState({
                Directbudgets: budget.data.direct,
                Attribbudgets: budget.data.attrib
            })
            const years = await axios.get('/api/getAllYearsForReports')
            this.setState({
                GPBYears: years.data.GPBYears,
                GARYears: years.data.GARYears
            })
            const res = await axios.get('/api/getTitle')
            this.setState({
                user_title: res.data,
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

    //select Internal View
    handleSelectGPB = (e) => {
        e.preventDefault()
        this.setState({
            view: "GPB"
        })
    }
    //select External View
    handleSelectGAR = (e) => {
        e.preventDefault()
        this.setState({
            view: "GAR"
        })
    }
    //select SDD View
    handleSelectSDD = (e) => {
        e.preventDefault()
        this.setState({
            view: "SDD"
        })
    }
    //select MAR View
    handleSelectMAR = (e) => {
        e.preventDefault()
        this.setState({
            view: "MAR"
        })
    }
    //clear view
    handleClearView = (e) => {
        e.preventDefault()
        this.setState({
            view: ""
        })
    }

    render() {
        const { view, signatories, user_title, PPA, Attrib, Directbudgets, Attribbudgets, GARYears, GPBYears, loading } = this.state
        if (loading) {
            return (
                <Layout title={"/ Reports"}>
                    <Loader />
                </Layout>
            )
        }
        if (view == "") {
            return(
                <Layout title={"/ Reports"}>
                    <div className="col-10 m-auto p-3">
                        <div className="border shadow-lg">
                            <div className="text-center fs-1 py-5"> Reports </div>
                            <div className="d-flex justify-content-between fs-2 pb-5">
                                <div className="w-25 text-center">
                                    <button className="border-dark p-3 hover:bg-slate-100 hover:rounded"
                                        onClick={this.handleSelectGPB}
                                    > 
                                        GPB 
                                    </button>
                                </div>
                                <div className="w-25 text-center">
                                    <button className="border-dark p-3 hover:bg-slate-100 hover:rounded"
                                        onClick={this.handleSelectGAR}
                                    > 
                                        GAR 
                                    </button>
                                </div>
                                {user_title.isTWG == true ?
                                    <div className="w-25 text-center">
                                        <button className="border-dark p-3 hover:bg-slate-100 hover:rounded"
                                            onClick={this.handleSelectSDD}
                                        > 
                                            SDD 
                                        </button>
                                    </div> : ""
                                }
                                {/* {user_title.position_name == 'GAD Secretariat' ? 
                                    <div className="w-25 text-center">
                                        <button className="border-dark p-3 hover:bg-slate-100 hover:rounded"
                                            onClick={this.handleSelectMAR}
                                        > 
                                            MAR
                                        </button>
                                    </div> : ""
                                } */}
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        var viewToShow = ""
        if (view == "GPB") {
            viewToShow = (
                <GPB
                    years = {GPBYears}
                    PPA = {PPA}
                    Attrib = {Attrib}
                    Directbudgets = {Directbudgets}
                    Attribbudgets = {Attribbudgets}
                    signatories = {signatories}
                    user_title = {user_title}
                />
            )
        } else if (view == "GAR") {
            viewToShow = (
                <GAR
                    years = {GARYears}
                    PPA = {PPA}
                    Attrib = {Attrib}
                    Directbudgets = {Directbudgets}
                    Attribbudgets = {Attribbudgets}
                    signatories = {signatories}
                    user_title = {user_title}
                />
            )
        } else if (view == "SDD") {
            viewToShow = (
                <SDD/>
            )
        }
        return (
            <Layout title={"/ Reports"}>
                <div className="card-header">
                    <div className="back-btn text-decoration-none">
                        <button className="button" onClick={this.handleClearView}>
                            <i className="far fa-redo-alt text-dark"></i>
                            <span className="tooltip-text text-sm ms-1"> Back to selection menu </span>
                        </button>
                    </div>
                    <div className="text-center text-3xl mobile-lg:text-laders"> GAD Reports </div>
                </div>
                <div className="card-body p-0 m-0">
                    {role == 'admin' && user_title.position_name == "GAD Secretariat" && view != "SDD" ?
                        <Link className="text-decoration-none text-lg p-1 mb-2 text-white fw-normal bg-blue-500 hover:bg-slate-500" to="/Reports/New">
                            <i className="far fa-plus p-1"> Add new </i>
                        </Link> : ""
                    }
                    <div className="mt-3">
                        {viewToShow}
                    </div>
                </div>
            </Layout>
        )
    }
}

export default ReportView