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

export class Agenda extends Component {
    constructor(props){
        super(props)
        this.state = {
            Agendas: [],
            log: [],
            loading: true,
            show: "d-none",
        }
    }

    //viewing of logs
    handleViewHistory = (id) => {
        const data = {
            aa_id: id
        }
        axios.post('/api/getAgendaHistory', data).then(response => {
            this.setState({
                log: response.data,
                show: "d-block"
            })
        })
    }

    handleClose = (e) => {
        e.preventDefault()
        this.setState({
            show: "d-none",
            log: []
        })
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        try {
            //Getting all GAD Agendas with added Annex A
            const response = await axios.get('/api/getAgendasWithAnnexA')
            this.setState({
                Agendas: response.data,
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
        const { Agendas, loading, log, show } = this.state
        if (loading) {
            return(
                <Layout title={"/ GAD Agenda"}>
                    <Loader />
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD Agenda"}>
                {role == 'admin' ?
                    <Link className="back-btn text-decoration-none" to="/GAD-agenda/New(Annex_A)">
                        <i className="far fa-plus p-1 rounded-circle"></i>
                        <span className="tooltip-text text-sm ms-1">Add new</span>
                    </Link> : ""
                }
                <div className="text-center text-3xl"> GAD Agenda </div>
                <div className="card-body p-5">
                    <div className="d-flex flex-wrap justify-content-center">
                        {Agendas.map((val,i) => 
                            <div className="row col-12 mb-5" key={i}>
                                <div className="accordion accordion-flush p-0 text-lg border shadow" id="accordionFlush">
                                    <div className="accordion-item">
                                        <div className="accordion-header relative">
                                            <div className="absolute top-0 -start-10 py-2">
                                                <div className="bg-warning p-1 text-xl border rounded-lg" onClick={() => this.handleViewHistory(val.aa_id) }>
                                                    <i className="fas fa-history"></i>
                                                </div>
                                                <div className={show}>
                                                    <div className="z-999 absolute border bg-white w-72 h-96 overflow-auto">
                                                        <div className="text-2xl text-center border border-dark p-2"> 
                                                            Logs <i className="ms-1 fas fa-history fa-pulse"></i>
                                                        </div>
                                                        <button className="bg-danger text-white p-1 absolute top-0 right-0 z-998" onClick={this.handleClose}>
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
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flushcollapse${i}`} >
                                                GAD Agenda {val.start_year} - {val.end_year} 
                                            </button>
                                        </div>
                                        <div id={`flushcollapse${i}`} className="accordion-collapse collapse visible" data-bs-parent="#accordionFlush">
                                            <div className="d-flex p-2 text-base">
                                                <div className="w-50 row align-items-center m-0">
                                                    {val.goals.length != 0 ?
                                                        <div className="d-flex p-0">
                                                            <Link className="w-75 mobile-lg:!p-1 text-decoration-none p-3 text-dark hover:bg-slate-200" 
                                                                to={`/GAD-agenda/AnnexA/${val.aa_id}`} state={{ id: `${val.aa_id}` }}
                                                            >
                                                                <span>
                                                                    Annex A
                                                                </span>
                                                            </Link>
                                                            <div className="w-25 p-3 mobile-lg:!p-1">
                                                                <span>
                                                                    <i className="fas fa-check-circle text-success"></i>
                                                                </span>
                                                            </div>
                                                        </div> : 
                                                        <div className="d-flex p-0">
                                                            <div  className="w-75 p-3 mobile-lg:!p-1">
                                                                <span>
                                                                    Annex A
                                                                </span>
                                                            </div>
                                                            <div className="w-25 p-3 mobile-lg:!p-1">
                                                                <span>
                                                                    <i className="fas fa-check-circle"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="w-50 row align-items-center m-0">
                                                    {val.annex_b.goals.length == val.goals.length ?
                                                        <div className="d-flex p-0">
                                                            <Link className="w-75 mobile-lg:!p-1 text-decoration-none p-3 text-dark hover:bg-slate-200" 
                                                                to={`/GAD-agenda/AnnexB/${val.annex_b.ab_id}`} state={{ id: `${val.annex_b.ab_id}` }}   
                                                            >
                                                                <span>
                                                                    Annex B
                                                                </span>
                                                            </Link>
                                                            <div className="w-25 p-3 mobile-lg:!p-1">
                                                                <span>
                                                                    <i className="fas fa-check-circle text-success"></i>
                                                                </span>
                                                            </div>
                                                        </div> 
                                                        :
                                                        <div className="d-flex row align-items-center p-0">
                                                            <Link className="w-25 p-3 mobile-lg:!p-1 text-decoration-none text-dark hover:bg-slate-200" 
                                                                to={`/GAD-agenda/AnnexB/${val.annex_b.ab_id}`} state={{ id: `${val.annex_b.ab_id}` }}   
                                                            >
                                                                <span>
                                                                    Annex B
                                                                </span>
                                                            </Link>
                                                            <div className="w-75 mobile-lg:!p-1 text-sm text-info">
                                                                <i className="CurrStat me-2 far fa-info-circle"> <span className="CurrTooltiptext"> Current Status of Annex B <i className="fad fa-chevron-double-right"></i> Suggested next step </span> </i>
                                                                {val.annex_b.goals.length == 0 ?
                                                                    <span>
                                                                        Added GAD Strategic Plan on {val.annex_b.goals.length} Goals <i className="fad fa-chevron-double-right"></i> Add GAD Strategic Plan
                                                                    </span> :
                                                                    <span>
                                                                        Added GAD Strategic Plan on {val.annex_b.goals.length} of {val.goals.length} Goals <i className="fad fa-chevron-double-right"></i> Add Annual T-A-B
                                                                    </span>
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                {val.annex_b.goals.length == val.goals.length ?
                                                    <div className="p-1">
                                                        <Link className="text-decoration-none text-dark" to={`/GAD-agenda/${val.aa_id}`} state={{ id: `${val.aa_id}` }}>
                                                            <button className="btn text-lg bg-success">
                                                                <i className="fas fa-eye text-white"></i>
                                                            </button>
                                                        </Link>
                                                    </div> :
                                                    <div className="d-none"></div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Agenda