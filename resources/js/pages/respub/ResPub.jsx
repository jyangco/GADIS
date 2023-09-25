import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Internal from './Internal'
import External from './External'
import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

import CryptoJS from 'crypto-js'
if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}
export class ResPub extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            view: "",
            respubs: []
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        try {
            const response = await axios.get('/api/getAllResPub')
            this.setState({
                respubs: response.data,
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
    handleSelectInternal = (e) => {
        e.preventDefault()
        this.setState({
            view: "Internal"
        })
    }
    //select External View
    handleSelectExternal = (e) => {
        e.preventDefault()
        this.setState({
            view: "External"
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
        const { view, respubs, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ Resources and Publications"}>
                    <Loader />
                </Layout>
            )
        }
        if (view == "") {
            return(
                <Layout title={"/ Resources and Publications"}>
                    <div className="col-10 m-auto p-3">
                        <div className="border shadow-lg">
                            <div className="text-center fs-1 py-5"> Choose what files to view </div>
                            <div className="d-flex justify-content-between fs-2 pb-5">
                                <div className="w-50 text-center">
                                    <button className="border-dark p-3 hover:bg-slate-100"
                                        onClick={this.handleSelectInternal}
                                    > 
                                        Internal 
                                    </button>
                                </div>
                                <div className="w-50 text-center">
                                    <button className="border-dark p-3 hover:bg-slate-100"
                                        onClick={this.handleSelectExternal}
                                    > 
                                        External 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        var viewToShow = ""
        if (view == "External") {
            viewToShow = (
                <External files={respubs} />
            )
        } else if (view == "Internal") {
            viewToShow = (
                <Internal files={respubs} />
            )
        }
        return (
            <Layout title={"/ Resources and Publications"}>
                <div className="card-header">
                    <div className="back-btn text-decoration-none">
                        <button className="button" onClick={this.handleClearView}>
                            <i className="far fa-redo-alt text-dark"></i>
                            <span className="tooltip-text text-sm ms-1"> Back to selection menu </span>
                        </button>
                    </div>
                    <div className="text-center text-3xl mobile-lg:text-laders"> Resources and Publications </div>
                </div>
                <div className="card-body">
                    <Link className={role == 'admin' ? "text-lg text-decoration-none text-dark" : "display-none"} to="/Resources-and-Publications/New">
                        <button className="text-decoration-none text-lg p-1 mb-2 text-white fw-normal bg-blue-500 hover:bg-slate-500"> 
                            <i className="fal fa-file-plus"> Add Files </i>
                        </button>
                    </Link>
                    {viewToShow}
                </div>
            </Layout>
        )
    }
}

export default ResPub