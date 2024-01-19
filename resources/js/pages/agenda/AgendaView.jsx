import React, { Component, useEffect } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'
import ReactToPrint from 'react-to-print'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

window.name

const ForID = () => {
    const location = useLocation()
    useEffect(() => {
        window.name = location.state.id
        return() => {
            window.name
        }
    }, [])
}

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}

export class AgendaView extends Component {
    constructor(props){
        super(props)
        this.state = {
            Agenda: "",
            user_title: "",
            signatories: "",
            years: [],
            loading: true,
            notif_title: "GAD Agenda",
            notif_body: "",
            id_number: "",
            error_list: "",
            path: "/GAD-agenda/",
            submitted: false,
        }
    }

    handleFieldChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentDidMount(){
        setTimeout(() => {
            window.scrollTo({top: 0, behavior: 'smooth'})
            try {
                const aa_id = window.name
                axios.get('/api/getSignatories').then(signatories => {
                    this.setState({
                        signatories: signatories.data,
                    })
                })
                axios.get('/api/getTitle').then(res => {
                    this.setState({
                        user_title: res.data,
                    })
                })
                axios.get(`/api/getIndividualAnnexA/${aa_id}`).then(response => {
                    for (let index = Number(response.data.start_year); index < (Number(response.data.end_year)+1); index++) {
                        this.state.years.push(index)
                    }
                    this.setState({
                        Agenda: response.data,
                        id_number: response.data.aa_id,
                        loading: false
                    })
                })
            } catch (error) {
                Swal.fire({
                    title: (error.code),
                    text: (error.message),
                    icon: "warning",
                })
            }
        }, 100);
    }

    handleReject = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/sendReject',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    submitted: true
                })
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
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

    handleRejectByExeCom = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/rejectByExeCom',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    submitted: true
                })
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
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

    handleSubmitForReview = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/sendForReview',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    submitted: true
                })
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
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

    handleSubmitForApproval = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/sendForApproval',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    submitted: true
                })
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
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

    handleApproved = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/markAsApproved',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    submitted: true
                })
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
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

    render() {
        const { Agenda, years, user_title, signatories, loading, submitted } = this.state
        if (submitted) {
            return(
                <Navigate to={"/GAD-agenda"}/>
            )
        }
        if (loading) {
            return(
                <Layout title={"/ GAD Agenda"}>
                    <Loader />
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD Agenda / " + Agenda.aa_id}>
                <Link className="back-btn text-decoration-none" to={"/GAD-agenda"} >
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="text-end text-lg"> Status: <span className="text-primary"> {Agenda.status} </span> </div>
                <div ref={ el => (this.componentRef=el) }>
                    <div className="text-center text-3xl"> GAD Agenda </div>
                    <div className="m-3 text-lg">
                        <div className="hidden">
                            <ForID></ForID>
                        </div>
                        <div className="p-2">
                            <div className="text-end text-sm">
                                <p className="m-0 ">
                                    ANNEX A
                                </p>
                            </div>
                            <div className="text-center fw-bold mb-5">
                                <div className="m-0 ">
                                    DOST-SCIENCE EDUCATION INSTITUTE
                                </div>
                                <div className="m-0 ">
                                    GAD AGENDA 
                                </div>
                                <div className="m-0 ">
                                    {Agenda.start_year} - {Agenda.end_year} 
                                </div>
                            </div>
                            <div className="text-start px-3">
                                <p className="m-0  text-primary">
                                    <span className="p-0 me-4"> I. </span> GAD Strategic Framework
                                </p>
                            </div>
                            <table className="table border mb-5">
                                <tbody>
                                    <tr>
                                        <td className='p-3'> <strong> Agency: </strong>  Department of Science and Technology – Science Education Institute </td>
                                    </tr>
                                    <tr>
                                        <td className='p-3'> <strong> Mandate: </strong> 
                                            <ul className='ms-5 list-disc'>
                                                <li> Undertake science education and training; </li>
                                                <li> Administer scholarships, awards and grants; </li>
                                                <li> Undertake science and technology manpower development; and </li>
                                                <li> Formulate plans and establish programs and projects for the promotion and development of S&T education and training in coordination with DepEd, CHED and other institutions of learning. </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table border mb-5">
                                <tbody>
                                    <tr>
                                        <td className="text-center px-5 py-3 fw-bold text-sm"> Area </td>
                                    </tr>
                                    <tr>
                                        <td className='p-3'> <strong> GAD Vision: </strong>
                                            <div className="ms-5">
                                                {Agenda.GAD_vision}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='p-3'> <strong> GAD Mission: </strong>
                                            <div className="ms-5">
                                                {Agenda.GAD_mission}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='p-3'> <strong> GAD Goals: </strong>
                                            <ol className="list-decimal">
                                                {Agenda.goals.map((goal,i) => 
                                                    <li key={i} className="mb-3 ms-5">
                                                        <span>
                                                            {goal.GAD_goal}
                                                        </span>
                                                    </li>
                                                )}
                                            </ol>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr />
                    <div className="m-3 text-lg break-before-page">
                        <div className="px-2">
                            <div className="text-end text-sm">
                                <p className="m-0 ">
                                    ANNEX B
                                </p>
                            </div>
                            <div className="text-center fw-bold mb-5">
                                <div className="m-0 ">
                                    DOST-SCIENCE EDUCATION INSTITUTE
                                </div>
                                <div className="m-0 ">
                                    GAD AGENDA 
                                </div>
                                <div className="m-0 ">
                                    {Agenda.start_year} - {Agenda.end_year} 
                                </div>
                            </div>
                            <div className="text-start px-3">
                                <p className="m-0  text-primary">
                                    <span className="p-0 me-4"> II. </span> GAD Strategic Plan
                                </p>
                            </div>
                            {Agenda.goals.map((goal,i) => 
                                <div key={i} className="mb-5 overflow-auto">
                                    <table className="table border  m-0">
                                        <tbody>
                                            <tr>
                                                <td className='p-3 fw-bold'> 
                                                    <span> Agency: DOST – Science Education Institute </span> 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='p-3 fw-bold'> 
                                                    Goal {goal.goal_index}: {goal.GAD_goal}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="table border  m-0">
                                        <thead>
                                            <tr>
                                                <th className="text-center border" style={{width:'20%', verticalAlign:'top'}} > GENDER ISSUE </th>
                                                <th className="text-center border" style={{width:'20%', verticalAlign:'top'}} > GAD OUTCOME/ RESULT/STATEMENT </th>
                                                <th className="text-center border" style={{width:'20%', verticalAlign:'top'}} > INDICATOR </th>
                                                <th className="text-center border" style={{width:'20%', verticalAlign:'top'}} > BASELINE </th>
                                                <th className="text-center border" style={{width:'20%', verticalAlign:'top'}} > RESPONSIBLE UNIT/OFFICE </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {goal.annex_b_goals.contents.map((contents,index) => 
                                                <tr key={index}>
                                                    <td className="text-start border"> {contents.gender_issue} </td>
                                                    <td className="text-start border"> {contents.result} </td>
                                                    <td className="text-start border"> {contents.indicator} </td>
                                                    <td className="text-start border"> {contents.baseline} </td>
                                                    <td className="text-start border"> {contents.responsible_office} </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="d-flex mt-4 mb-2 justify-content-between">
                                        <p className="px-4  fw-bold"> GOAL {goal.goal_index} Annual Targets, Activities and Budget: </p>
                                        {role == 'admin' && Agenda.status != "Approved" ?
                                            <Link to={`/GAD-agenda/AnnexB/${goal.annex_b_goals.ab_id}/Annual_T-A-B/${goal.goal_id}`} state={{ id: `${goal.goal_id}` }}>
                                                <i className="far fa-plus-circle bg-success text-white p-2 "></i>
                                            </Link> : ""
                                        }
                                    </div>
                                    <table className="table border  m-0">
                                        <thead >
                                            <tr>
                                                {years.map((yr,i) => 
                                                    <th className="text-center border" key={i}> {yr} </th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {goal.annex_b_goals.agenda.map((agendas,index) => 
                                                <tr key={index}>
                                                    {agendas.agenda_contents.map((a_conts,ind) => 
                                                        <td key={ind} className="text-start border h-[1px] w-auto">
                                                            <div className="flex flex-wrap h-full">
                                                                <div className="mb-3 h-fit"> 
                                                                    <span className="fw-bold"> Targets: </span>
                                                                    {a_conts.agenda_target}
                                                                </div>
                                                                <div className="mb-3 p-1 h-auto self-start"> 
                                                                    <span className="fw-bold"> Activities: </span>
                                                                    <ol className="ms-2 list-decimal">
                                                                        {a_conts.agenda_activities.map((a_acts, idx) => 
                                                                            <li className="mb-2 break-words" key={idx}>
                                                                                {a_acts.activity_title}
                                                                            </li>
                                                                        )}
                                                                    </ol>
                                                                </div>
                                                                <div className="break-words h-max self-end"> 
                                                                    <span className="fw-bold"> Budget: </span>
                                                                    {a_conts.agenda_budget} {a_conts.agenda_budget_for}
                                                            </div>
                                                            </div>
                                                        </td>   
                                                    )}
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="text-center  mt-2"> {goal.goal_index} </div>
                                    <hr className="my-5 w-100"/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="section text-xl">
                        <div className="flex justify-content-start">
                            Prepared by:
                        </div>
                        <div className="flex justify-content-evenly">
                            <div className="w-25 mt-5">
                                {signatories.GAD_Secretariat}
                                <div className="text-base"> GAD Secretariat </div>
                            </div>
                            <div className="w-25 mt-5">
                                {signatories.TWG_Chairperson}
                                <div className="text-base"> GAD TWG Chairperson </div>
                            </div>
                        </div>
                        <div className="bg-transparent h-20"></div>
                        <div className="flex justify-content-center">
                            Approved by:
                        </div>
                        <div className="flex justify-content-center mt-5">
                            <div>
                                {signatories.Executive_Committee_Chairperson}
                                <div className="text-base"> Director, DOST-SEI </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-transparent h-20"></div>
                {Agenda.status == "Draft" || Agenda.status == "For Revision"  && user_title.position_name == "GAD Secretariat" ? 
                    <form className="block" onSubmit={this.handleSubmitForReview}>
                        <div className="text-xl">
                            <div className="form-group">
                                <label htmlFor="title"> Subject: </label>
                                <input className='border-b-2 w-100 outline-none'
                                    type="text" 
                                    name="notif_title" 
                                    value={this.state.notif_title}
                                    onChange={this.handleFieldChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="body"> Content: <span className="text-danger"> *{this.state.error_list} </span> </label>
                                <textarea className='border w-100 outline-none resize-none p-1'
                                    name="notif_body" 
                                    value={this.state.notif_body}
                                    onChange={this.handleFieldChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-content-center mt-3">
                            <input className=" bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"
                                value="Submit For Review"
                                type='submit'
                            />
                        </div>
                    </form> : 
                Agenda.status == "For Review" && user_title.position_name == "TWG Chair" ? 
                    <div className="block">
                        <div className="text-xl">
                            <div className="form-group">
                                <label htmlFor="title"> Subject: </label>
                                <input className='border-b-2 w-100 outline-none'
                                    type="text" 
                                    name="notif_title" 
                                    value={this.state.notif_title}
                                    onChange={this.handleFieldChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="body"> Content: <span className="text-danger"> *{this.state.error_list} </span> </label>
                                <textarea className='border w-100 outline-none resize-none p-1'
                                    name="notif_body" 
                                    value={this.state.notif_body}
                                    onChange={this.handleFieldChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-content-between mt-3">
                            <button className=" bg-red-300 px-5 py-2 hover:bg-red-500 hover:text-white hover:shadow-2xl"
                                onClick={this.handleReject}
                            > 
                                Reject
                            </button>
                            <button className=" bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"
                                onClick={this.handleSubmitForApproval}
                            >
                                Submit For Approval
                            </button>
                        </div>
                    </div> : 
                Agenda.status == "For Approval" && user_title.position_name == "Executive Committee Chair" ? 
                    <div className="block">
                        <div className="text-xl">
                            <div className="form-group">
                                <label htmlFor="title"> Subject: </label>
                                <input className='border-b-2 w-100 outline-none'
                                    type="text" 
                                    name="notif_title" 
                                    value={this.state.notif_title}
                                    onChange={this.handleFieldChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="body"> Content: <span className="text-danger"> *{this.state.error_list} </span> </label>
                                <textarea className='border w-100 outline-none resize-none p-1'
                                    name="notif_body" 
                                    value={this.state.notif_body}
                                    onChange={this.handleFieldChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-content-between mt-3">
                            <button className=" bg-red-300 px-5 py-2 hover:bg-red-500 hover:text-white hover:shadow-2xl"
                                onClick={this.handleRejectByExeCom}
                            > 
                                Reject
                            </button>
                            <button className=" bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"
                                onClick={this.handleApproved}
                            >
                                Approve
                            </button>
                        </div>
                    </div> : 
                Agenda.status == "Approved" && role == "admin" ? 
                    <div className="block">
                        <div className="flex justify-content-center mt-3">
                            <ReactToPrint
                                trigger={ () => {
                                    return (
                                    <button className="text-xl bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"> 
                                        Download/Print! 
                                    </button>
                                )}}
                                content={()=>this.componentRef}
                                pageStyle='@page {
                                    margin: 8mm;
                                    size: landscape;
                                }'
                            />
                        </div>
                    </div> : ""
                }
            </Layout>
        )
    }
}

export default AgendaView