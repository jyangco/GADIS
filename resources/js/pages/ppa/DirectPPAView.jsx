import React, { Component, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import axios from 'axios'
import Swal from 'sweetalert2'

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

export class DirectPPAView extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            show: false,
            isReady: "",
            PPA: "",
            ppa_id: "",
            status: "",
            action_by: JSON.parse(localStorage.getItem('auth')).name
        }
    }

    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //Show PPA details on load
    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        const fetchData = async() => {
            try {
                const act_id = window.name
                const res = await axios.get(`/api/readyToBeMarked/${act_id}`)
                this.setState({
                    isReady: res.data
                })
                const response = await axios.get(`/api/showDirectPPA/${act_id}`)
                this.setState({
                    PPA: response.data,
                    ppa_id: response.data.act_id,
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
        setTimeout(() => {
            fetchData()
        }, 5)
    }

    //Adding new status for PPA
    updateStatus() {
        const data = {
            ppa_id: this.state.ppa_id,
            action_by: this.state.action_by
        }
        axios.post('/api/newDirectPPAStatus', (data))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
        })
        this.componentDidMount()
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }
    //Adding completed status for PPA
    addCompletedStatus() {
        const data = {
            ppa_id: this.state.ppa_id,
            action_by: this.state.action_by
        }
        axios.post('/api/newDirectCompletedStatus', (data))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.setState({
                loading: true
            })
            this.componentDidMount()
        })
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }
    //Adding incomplete status for PPA
    addIncompleteStatus() {
        const data = {
            ppa_id: this.state.ppa_id,
            status: this.state.status,
            action_by: this.state.action_by
        }
        axios.post('/api/newDirectIncompleteStatus', (data))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.setState({
                loading: true
            })
            this.componentDidMount()
        })
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    //Accept Modal
    openModal = (e) => {
        e.preventDefault()
        Swal.fire({
            allowOutsideClick: false,
            title: "You are about to IMPLEMENT this PPA",
            text: "Do you wish to proceed?",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Yes',
        })
        .then((result) => {
            if (result.isConfirmed) {
                this.updateStatus()
                // if (this.state.PPA.act_category == "Training") {
                //     this.props.history.push(`/admin/${this.state.ppa_id}/Trainings/New`)
                // }
            } else if (result.isDenied) {
                Swal.fire('Process Cancelled', '', 'info')
            }
        })
    }
    openModal1 = (e) => {
        e.preventDefault()
        if (this.state.isReady == "yes") {
            Swal.fire({
                allowOutsideClick: false,
                showCancelButton: false,
                showDenyButton: true,
                denyButtonText: 'Cancel',
                confirmButtonText: 'Yes',
                title: "You are about to mark this PPA as COMPLETED",
                text: "Do you wish to proceed?",
                icon: "warning",
            },
            )
            .then((result) => {
                if (result.isConfirmed) {
                    this.addCompletedStatus()
                } else if (result.isDenied) {
                    Swal.fire('Process Cancelled', '', 'info')
                }
            })
        } else if (this.state.isReady == "yes(no budget)") {
            Swal.fire({
                allowOutsideClick: false,
                showCancelButton: false,
                showDenyButton: true,
                denyButtonText: 'Cancel',
                confirmButtonText: 'Yes',
                title: "You are about to mark this PPA as COMPLETED without an ACTUAL COST",
                text: "Do you wish to proceed?",
                icon: "warning",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this.addCompletedStatus()
                } else if (result.isDenied) {
                    Swal.fire('Process Cancelled', '', 'info')
                }
            })
        } else {
            Swal.fire({
                // input: 'text',
                // inputAttributes: {
                //     autocapitalize: 'off'
                // },
                allowOutsideClick: false,
                showCancelButton: false,
                showDenyButton: true,
                denyButtonText: 'Cancel',
                confirmButtonText: 'Yes',
                title: "You are about to mark this PPA as COMPLETED without ACTUAL COST and BENEFICIARIES",
                text: "It will be marked as NOT DONE, Do you wish to proceed",
                icon: "warning",
                })
            .then((result) => {
                if (result.isConfirmed) {
                    this.addIncompleteStatus()
                } else if (result.isDenied) {
                    Swal.fire('Process Cancelled', '', 'info')
                }
            })
        }
    }

    render() {
        const { PPA, isReady, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ GAD PPAs / Direct"}>
                    <Loader />
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD PPAs / Direct / " + PPA.act_id}>
                <div className="hidden">
                    <ForID></ForID>
                </div>
                {PPA.status == "For Implementation" ?
                    <div className="m-0">
                        <Link className="back-btn text-decoration-none" to={"/PPA"} >
                            <i className="far fa-arrow-left rounded-circle p-1"></i>
                            <span className="tooltip-text text-sm ms-1">back</span>
                        </Link>
                        <div className="flex mobile-lg:!flex-wrap fw-normal">
                            <div className="mobile-lg:!w-[100%] mobile-lg:!px-2 w-75 px-5">
                                <div className="p-2 h-fit">
                                    <div className="text-center text-3xl fw-bold"> Direct PPA Details </div>
                                    <div className="card-body">
                                        <div className="text-center m-0 text-xl font-semibold"> FY {PPA.act_year} </div>
                                        <div className="text-end m-0 text-xl font-semibold"> Status:
                                            {PPA.status == "For Implementation" ? 
                                                <span className="text-primary"> {PPA.status} </span> : 
                                            PPA.status == "Ongoing" ?
                                                <span className="text-warning"> {PPA.status} </span> : 
                                            PPA.status == "Done" ?
                                                <span className="text-success"> {PPA.status} </span> : ""
                                            } 
                                        </div>
                                        <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> Gender Issue: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_gad_mandate} </div> </div> 
                                        <br/>
                                        <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> Cause of Gender Issue: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_cause_of_issue} </div> </div> 
                                        <br/>
                                        <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> GAD Objective: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_gad_objective} </div> </div> 
                                        <br/>
                                        <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> Relevant Organization: </span> 
                                            {PPA.act_relevant_org == "PAP" ?
                                                <div className="ms-5 mobile-lg:!ms-4">
                                                    <span> PAP: Development and administration of Science and Technology Scholarship </span> <br/>
                                                    <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                                </div> : 
                                                <div className="ms-5 mobile-lg:!ms-4"> MFO: Science and Technology Human Resource Development Services </div>
                                            }
                                        </div> 
                                        <br/>
                                        <div className="m-0 text-3xl mobile-lg:!text-xl"> <strong> Responsible Unit: </strong> <br/> <span className="ms-5 mobile-lg:!ms-4"> {PPA.act_responsible_unit} </span> </div> 
                                        <br/>
                                        <div className="m-0 text-3xl mobile-lg:!text-xl"> <strong> GAD Activity: </strong> <br/> 
                                            {PPA.act_atitles.length > 1 ?
                                                <ol className="ms-5 mobile-lg:!ms-4">
                                                    {PPA.act_atitles.map((titles,index) => (
                                                        <li key={index}> {titles.act_title} </li>
                                                    ))}
                                                </ol> : 
                                                PPA.act_atitles.map((titles,index) => (
                                                    <div className="ms-5 mobile-lg:!ms-4" key={index}> {titles.act_title} </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="vr mx-1 mobile-lg:hidden"/>
                            <div className="mobile-lg:!w-[100%] w-25 p-3">
                                <div className="p-2 h-fit" >
                                    <div className="bg-lightpurple text-white rounded-full">
                                        <div className="text-3xl p-2 text-center mobile-lg:!text-2xl"> Budgetary Details </div>
                                    </div>
                                    <div className="p-1">
                                        <div className="m-0 text-2xl mobile-lg:!text-xl"> <span className='fw-bold'> Activity Budget: </span> <br/> <div className="text-right"> 
                                            {PPA.act_abudgets.planned_budget % 1 != 0?
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={PPA.act_abudgets.planned_budget}
                                                /> : 
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    suffix='.00'
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={PPA.act_abudgets.planned_budget}
                                                /> 
                                            }
                                        </div> </div> 
                                        <br/>
                                        <div className="m-0 text-2xl mobile-lg:!text-xl"> <span className='fw-bold'> Budget Source: </span> <br/> <span className="ms-5 mobile-lg:!ms-4"> {PPA.act_source} </span> </div> 
                                        <br/>
                                        <div className="m-0 text-2xl mobile-lg:!text-xl"> <span className='fw-bold'> Budget Expense Class: </span> <br/> <span className="ms-5 mobile-lg:!ms-4"> {PPA.act_expense_class} </span> </div> 
                                    </div>
                                </div>
                                <hr className="my-2" />
                                <div className="p-2 h-fit">
                                    <div className="bg-lightpurple text-white rounded-full">
                                        <div className="text-3xl p-2 text-center mobile-lg:!text-2xl"> Beneficiary Details </div>
                                    </div>
                                    <div className="p-1">
                                        {PPA.act_abens.length > 1 ?
                                            <ol className="text-2xl mobile-lg:!text-xl">
                                                {PPA.act_abens.map((bens,index) => (
                                                    <li key={index}> 
                                                        <span className='fw-bold'> Performance Indicator: </span> <br/> {bens.act_target}
                                                        <hr/>
                                                        <span className='fw-bold'> Target: </span> <br/> {bens.p_beneficiary_value} {bens.p_beneficiary_target} 
                                                    </li>
                                                ))}
                                            </ol> : 
                                            PPA.act_abens.map((bens,index) => (
                                                <div className="text-2xl mobile-lg:!text-xl" key={index}>
                                                    <span className='fw-bold'> Performance Indicator: </span> <br/> <div className="ms-5 mobile-lg:!ms-4"> {bens.act_target} </div>
                                                    <hr className='m-2'/>
                                                    <span className='fw-bold'> Target: </span> <br/> <div className="ms-5 mobile-lg:!ms-4"> {bens.p_beneficiary_value} {bens.p_beneficiary_target} </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-5 p-4">
                            <button className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" id="btn" onClick={this.openModal} >
                                Implement this Activity
                            </button>
                        </div>
                    </div> : PPA.status == "Ongoing" ?
                    //ONGOING PART
                    <div className="m-0">
                        <Link className="back-btn text-decoration-none" to={"/PPA"} >
                            <i className="far fa-arrow-left rounded-circle p-1"></i>
                            <span className="tooltip-text text-sm ms-1">back</span>
                        </Link>
                        <div className="px-5 mobile-lg:!px-2">
                            <div className="p-1 h-fit">
                                <div className="text-center text-3xl fw-bold"> Direct PPA Details </div>
                                <div className="card-body fw-normal">
                                    <div className="text-center m-0 text-xl font-semibold"> FY {PPA.act_year} </div>
                                    <div className="text-end m-0 text-xl font-semibold"> Status:
                                        {PPA.status == "For Implementation" ? 
                                            <span className="text-primary"> {PPA.status} </span> : 
                                        PPA.status == "Ongoing" ?
                                            <span className="text-warning"> {PPA.status} </span> : 
                                        PPA.status == "Done" ?
                                            <span className="text-success"> {PPA.status} </span> : ""
                                        } 
                                    </div>
                                    <div className="m-0 text-3xl mobile-lg:text-lg"> <span className='fw-bold'> Gender Issue: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_gad_mandate} </div> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:text-lg"> <span className='fw-bold'> Cause of Gender Issue: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_cause_of_issue} </div> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:text-lg"> <span className='fw-bold'> GAD Objective: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_gad_objective} </div> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:text-lg"> <span className='fw-bold'> Relevant Organization: </span> 
                                        {PPA.act_relevant_org == "PAP" ?
                                            <div className="ms-5 mobile-lg:!ms-4">
                                                <span> PAP: Development and administration of Science and Technology Scholarship </span> <br/>
                                                <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                            </div> : 
                                            <span> MFO: Science and Technology Human Resource Development Services </span>
                                        }
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:text-lg"> <strong> Responsible Unit: </strong> <br/> <span className="ms-5 mobile-lg:!ms-4"> {PPA.act_responsible_unit} </span> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:text-lg"> <strong> GAD Activity: </strong> <br/> 
                                        {PPA.act_atitles.length > 1 ?
                                            <ol className="ms-5 mobile-lg:!ms-4">
                                                {PPA.act_atitles.map((titles,index) => (
                                                    <li key={index}> {titles.act_title} </li>
                                                ))}
                                            </ol> : 
                                            PPA.act_atitles.map((titles,index) => (
                                                <div className="ms-5 mobile-lg:!ms-4" key={index}> {titles.act_title} </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form className="createForms">
                            <div className="flex flex-wrap mt-5">
                                <div className="mobile-lg:!w-[100%] mobile-lg:!px-2 w-50 px-5">
                                    <div className="p-1 h-fit">
                                        <div className="bg-lightpurple rounded-full text-white">
                                            <div className="text-3xl p-2 text-center mobile-lg:!text-2xl"> Beneficiary Details </div>
                                        </div>
                                        <div className="card_body p-3">
                                            {PPA.act_abens.length > 1 ?
                                                <ol className="text-2xl mobile-lg:!text-xl">
                                                    {PPA.act_abens.map((bens,index) => (
                                                        <li key={index}> 
                                                            <div className="fw-bold"> Performance Indicator: </div> {bens.act_target}
                                                            <div className="fw-bold"> Target: </div> {bens.p_beneficiary_value} {bens.p_beneficiary_target} 
                                                        </li>
                                                    ))}
                                                </ol> : 
                                                PPA.act_abens.map((bens,index) => (
                                                    <div className="text-2xl mobile-lg:!text-xl" key={index}>
                                                        <div className="fw-bold"> Performance Indicator: </div> <div className="ms-5 mobile-lg:!ms-4"> {bens.act_target} </div>
                                                        <div className="fw-bold"> Target: </div> <div className="ms-5 mobile-lg:!ms-4"> {bens.p_beneficiary_value} {bens.p_beneficiary_target} </div>
                                                        <div className="fw-bold"> Outcome: </div> <div className="ms-5 mobile-lg:!ms-4"> {bens.a_beneficiary_value} {bens.a_beneficiary_target} </div>
                                                    </div>
                                                ))
                                            }
                                            {/* {PPA.act_category == "Others" ? 
                                                <Link to={`/admin/PPA/${PPA.act_id}/Direct/New/Beneficiary`} className="text-dark text-decoration-none d-flex justify-content-center my-3">
                                                    <input className="w-75" type="button" value="Add Beneficiaries" />
                                                </Link> :
                                                ""
                                            } */}
                                            <Link className="d-flex justify-content-center m-3 text-decoration-none text-black" to={`/PPA/Direct/${PPA.act_id}/New-beneficiaries`} state={{ id: `${PPA.act_id}` }} >
                                                <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="button" value="Add Beneficiaries" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="mobile-lg:!w-[100%] mobile-lg:!px-2 w-50 px-5">
                                    <div className="p-1 h-fit">
                                        <div className="bg-lightpurple rounded-full text-white">
                                            <div className="text-3xl p-2 text-center mobile-lg:!text-2xl"> Budgetary Details </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <div className="m-0 text-2xl mobile-lg:!text-xl"> <strong> Agency Approved Budget: </strong> <br/> 
                                            <div className="text-right"> 
                                                {PPA.act_abudgets.planned_budget % 1 != 0?
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={PPA.act_abudgets.planned_budget}
                                                    /> : 
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        suffix='.00'
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={PPA.act_abudgets.planned_budget}
                                                    /> 
                                                }
                                            </div> </div> 
                                            <br/>
                                            <div className="m-0 text-2xl mobile-lg:!text-xl"> <strong>  Actual Cost: </strong> <br/> 
                                            <div className="text-right p-2 bg-[#d4ebf2]"> 
                                                {PPA.act_abudgets.actual_budget % 1 != 0?
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={PPA.act_abudgets.actual_budget}
                                                    /> : 
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        suffix='.00'
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={PPA.act_abudgets.actual_budget}
                                                    /> 
                                                }
                                            </div> </div> 
                                            <Link className="d-flex justify-content-center m-3 text-decoration-none text-black" to={`/PPA/Direct/${PPA.act_id}/New-budgets`} state={{ id: `${PPA.act_id}` }} >
                                                <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="button" value="Add Budget" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center mt-5 p-4">
                            {
                                isReady == "yes" ?
                                    <button className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" id="btn" onClick={this.openModal1} >
                                        Mark Activity as Completed
                                    </button> :
                                isReady == "yes(no budget)" ?
                                    <button className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" id="btn" onClick={this.openModal1} >
                                        Mark Activity as Completed
                                    </button> :
                                isReady == "no" ? 
                                    <button className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" id="btn" onClick={this.openModal1}>
                                        Mark Activity as Completed
                                    </button> : 
                                ""
                            }
                        </div>
                    </div> : 
                    //COMPLETED PART
                    <div className="m-0">
                        <Link className="back-btn text-decoration-none" to={"/PPA"} >
                            <i className="far fa-arrow-left rounded-circle p-1"></i>
                            <span className="tooltip-text text-sm ms-1">back</span>
                        </Link>
                        <div className="px-5 mobile-lg:!px-2">
                            <div className="p-1 h-fit">
                                <div className="text-center text-3xl fw-bold"> Direct PPA Details </div>
                                <div className="card-body fw-normal">
                                    <div className="text-center m-0 text-xl font-semibold"> FY {PPA.act_year} </div>
                                    <div className="text-end m-0 text-xl font-semibold"> Status:
                                        {PPA.status == "For Implementation" ? 
                                            <span className="text-primary"> {PPA.status} </span> : 
                                        PPA.status == "Ongoing" ?
                                            <span className="text-warning"> {PPA.status} </span> : 
                                        PPA.status == "Done" ?
                                            <span className="text-success"> {PPA.status} </span> : ""
                                        } 
                                    </div>
                                    <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> Gender Issue: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_gad_mandate} </div> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> Cause of Gender Issue: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_cause_of_issue} </div> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> GAD Objective: </span> <div className="ms-5 mobile-lg:!ms-4"> {PPA.act_gad_objective} </div> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:!text-xl"> <span className='fw-bold'> Relevant Organization: </span> 
                                        {PPA.act_relevant_org == "PAP" ?
                                            <div className="ms-5 mobile-lg:!ms-4">
                                                <span> PAP: Development and administration of Science and Technology Scholarship </span> <br/>
                                                <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                            </div> : 
                                            <span> MFO: Science and Technology Human Resource Development Services </span>
                                        }
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:!text-xl"> <strong> Responsible Unit: </strong> <br/> <span className="ms-5 mobile-lg:!ms-4"> {PPA.act_responsible_unit} </span> </div> 
                                    <br/>
                                    <div className="m-0 text-3xl mobile-lg:!text-xl"> <strong> GAD Activity: </strong> <br/> 
                                        {PPA.act_atitles.length > 1 ?
                                            <ol className="ms-5 mobile-lg:!ms-4">
                                                {PPA.act_atitles.map((titles,index) => (
                                                    <li key={index}> {titles.act_title} </li>
                                                ))}
                                            </ol> : 
                                            PPA.act_atitles.map((titles,index) => (
                                                <div className="ms-5 mobile-lg:!ms-4" key={index}> {titles.act_title} </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-5 my-1">
                            <div className="w-50 px-5 h-fit mobile-lg:!w-[100%] mobile-lg:!px-2">
                                <div className="bg-lightpurple rounded-full text-white">
                                    <div className="mobile-lg:!text-2xl text-3xl p-2 text-center"> Beneficiary Details </div>
                                </div>
                                <div className="card-body p-3 fw-normal">
                                    {PPA.act_abens.map((bens, i) => 
                                        <div className="text-3xl mobile-lg:!text-xl" key={i}>
                                            <div className="mb-3"> <div className="fw-bold"> Performance Indicator: </div>
                                                <div className="ps-4"> {bens.act_target} </div>
                                            </div>
                                            <div className="mb-3"> <div className="fw-bold"> Target/s: </div> 
                                                <div className="ps-4">
                                                    {bens.p_beneficiary_value} - {bens.p_beneficiary_target}
                                                </div>
                                            </div>
                                            <div className="mb-3"> <div className="fw-bold"> Actual Result: </div>
                                                <div className="ps-4">
                                                    {bens.a_beneficiary_value} - {bens.a_beneficiary_target}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-center text-base">
                                                {i + 1}
                                            </div>
                                            <hr/>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mobile-lg:!w-[100%] mobile-lg:!px-2 w-50 px-5 h-fit">
                                <div className="bg-lightpurple rounded-full text-white">
                                    <div className="text-3xl mobile-lg:!text-2xl p-2 text-center"> Budgetary Details </div>
                                </div>
                                <div className="card-body p-3 fw-normal">
                                    <div className="mb-3 text-3xl mobile-lg:!text-xl"> <strong> Activity Budget: </strong> <br/>
                                        <div className="d-flex flex-wrap">
                                            <div className="w-100 text-right">
                                                {PPA.act_abudgets.planned_budget % 1 != 0?
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={PPA.act_abudgets.planned_budget}
                                                    /> : 
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        suffix='.00'
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={PPA.act_abudgets.planned_budget}
                                                    /> 
                                                }
                                            </div>
                                            <div className="w-100 text-right">
                                                {PPA.act_expense_class} - {PPA.act_source}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <div className="w-100">
                                            <div className="m-0 text-3xl mobile-lg:!text-xl"> <strong> Actual Cost:  </strong> <br/>
                                                <div className="text-right">
                                                    {PPA.act_abudgets.actual_budget % 1 != 0?
                                                        <NumericFormat 
                                                            type="text" 
                                                            displayType="text"
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={PPA.act_abudgets.actual_budget}
                                                        /> : 
                                                        <NumericFormat 
                                                            type="text" 
                                                            displayType="text"
                                                            suffix='.00'
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={PPA.act_abudgets.actual_budget}
                                                        /> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-100">
                                            <div className="m-0 text-3xl mobile-lg:!text-xl"> <strong> % Utilization:  </strong> <br/>
                                                <div className="text-right">
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        suffix='%'
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={
                                                            ((PPA.act_abudgets.actual_budget /
                                                            PPA.act_abudgets.planned_budget) * 100).toFixed(2)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Layout>
        )
    }
}

export default DirectPPAView