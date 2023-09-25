import React, { Component, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'
import Modal from '../../../components/Modal'

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

export class AnnexB extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            show: false,
            editMode: false,
            AnnexB: "",
            ab_goal_id: "",
            years: [],
            AnnexBData: [],
            id: "",
            value: "",
            type: "",
            category: ""
        }
    }

    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        const fetchData = async() => {
            try {
                const aa_id = window.name
                const response = await axios.get(`/api/getAgendaAnnexB/${aa_id}`)
                for (let index = Number(response.data.start_year); index < (Number(response.data.end_year)+1); index++) {
                    this.state.years.push(index)
                }
                this.setState({
                    AnnexB: response.data,
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

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        setTimeout(() => {
            this.handleChangeData()
        }, 5)
    }
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //Change displayed data
    handleChangeData = () => {
        const data = {
            ab_goal_id: this.state.ab_goal_id
        }
        axios.post('/api/getAnnexBDetails', data).then(response => {
            this.setState({
                AnnexBData: response.data,
            })
        })
    }

    //edit mode and show modal
    handleEditmode = ( id, value, type, category ) => {
        this.setState({
            show: true, 
            id: id, 
            value: value, 
            type: type,
            category: category
        })
    }
    handleCloseModal = (e) => {
        e.preventDefault()
        this.setState({
            show: false,
            id: "", 
            value: "", 
            type: "",
            category: ""
        })
    }
    handleChangeMode = (e) => {
        e.preventDefault()
        this.setState({
            editMode: true,
        })
    }
    handleDefaultMode = (e) => {
        e.preventDefault()
        this.setState({
            editMode: false,
        })
    }

    //update agenda contents
    handleUpdateContents = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('id', this.state.id)
            newFormData.append('type', this.state.type)
            newFormData.append('value', this.state.value)
            newFormData.append('category', this.state.category)
        axios.post('/api/updateAnnexB',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.handleChangeData()
                this.setState({
                    editMode: false,
                    show: false,
                    id: "", 
                    value: "", 
                    type: ""
                })
            } else {
                Swal.fire({
                    icon: "error",
                    text: (response.data.validation_errors),
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
        const { AnnexB, AnnexBData, years, loading, show, editMode } = this.state
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader />
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </AdminHeader>
            )
        }
        return(
            <AdminHeader>
                <Modal show={show} handleClose={this.handleCloseModal}>
                    <form className="createForms min-h-[20vh] min-w-[70vw]" onSubmit={this.handleUpdateContents}>
                        <div className="text-center text-3xl my-3"> Edit Value: </div>
                        <div className="form-group px-4 pt-4">
                            <textarea 
                                className="caret-black bg-white border border-dark resize-none w-100 p-2 text-xl"
                                name= "value"
                                rows="5"
                                value={this.state.value}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="p-4">
                            <div className="d-flex justify-content-center">
                                <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="SAVE"/>
                            </div>
                        </div>
                    </form>
                </Modal>
                <div className="hidden">
                    <ForID></ForID>
                </div>
                <Link className="back-btn text-decoration-none" to='/Admin/Agenda' >
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm">back</span>
                </Link>
                <div className="text-center text-3xl "> GAD Agenda </div>
                <div className="text-right text-lg "> ANNEX B </div>
                    <div className="fw-bold">
                        <div className="text-center text-xl "> DOST - SCIENCE EDUCATION INSTITUTE </div>
                        <div className="text-center text-xl "> GAD AGENDA </div>
                        <div className="text-center text-xl "> {AnnexB.start_year} - {AnnexB.end_year} </div>
                    </div>
                <div className="flex justify-content-between">
                    <div className="text-bases text-primary "> II. GAD Strategic Plan </div>
                    {editMode == false ?
                        <button onClick={this.handleChangeMode} className="text-base hover:cursor-pointer outline-none"> Edit Mode <i className="fas fa-toggle-off fa-lg"></i> </button> :
                        <button onClick={this.handleDefaultMode} className="text-base hover:cursor-pointer outline-none"> Edit Mode <i className="fas fa-toggle-on fa-lg text-success"></i> </button>
                    }
                </div>
                <form className="createForms min-h-[50vh] ">
                    <table className="table mt-3 mb-5">
                        <tbody>
                            <tr>
                                <td className="border" colSpan={5}>
                                    <strong> Agency: </strong> DOST - Science Education Institute
                                </td>
                            </tr>
                            <tr>
                                {AnnexB.length != 0 ?
                                    <td className="border" colSpan={5}>
                                        <strong> 
                                            Goal {AnnexB.goals.filter(val => val.ab_goal_id == this.state.ab_goal_id).map((val, idx) =>
                                                <span key={idx}> {val.goal_index}: </span>
                                            )}
                                        </strong>
                                        <select 
                                            name="ab_goal_id"
                                            className="w-100 p-1 m-0 custom-select mobile-lg:text-base bg-transparent outline-none border"
                                            value={this.state.ab_goal_id}
                                            onChange={this.handleFieldChange}
                                        >
                                            <option className='text-center' value={""}> -- Select Value -- </option>
                                            {AnnexB.goals.map((val,i) => 
                                                <option className='text-left' key={i} value={val.ab_goal_id}> {val.GAD_goal} </option>
                                            )}
                                        </select>
                                    </td> : ""
                                }
                            </tr>
                            <tr>
                                <th className="border text-center align-top w-[20%]"> GENDER ISSUE </th>
                                <th className="border text-center align-top w-[20%]"> GAD OUTCOME/ RESULT/STATEMENT </th>
                                <th className="border text-center align-top w-[20%]"> INDICATOR </th>
                                <th className="border text-center align-top w-[20%]"> BASELINE </th>
                                <th className="border text-center align-top w-[20%]"> RESPONSIBLE UNIT/OFFICE </th>
                            </tr>
                            {AnnexBData.length != 0 ?
                                AnnexBData.contents.map((val, idx) =>
                                    editMode == false ?
                                    <tr key={idx}>
                                        <td className="border cursor-default "> {val.gender_issue} </td>
                                        <td className="border cursor-default "> {val.result} </td>
                                        <td className="border cursor-default "> {val.indicator} </td>
                                        <td className="border cursor-default "> {val.baseline} </td>
                                        <td className="border cursor-default "> {val.responsible_office} </td>
                                    </tr> 
                                    :
                                    <tr key={idx}>
                                        <td className="border text-primary hover:cursor-pointer hover:bg-slate-200" onClick={() => this.handleEditmode( val.ac_id, val.gender_issue, 'gender_issue', 'content' )}>
                                            <div className="flex justify-content-between">
                                                {val.gender_issue} <i className="fas fa-comment-edit py-1"></i>
                                            </div>
                                        </td>
                                        <td className="border text-primary hover:cursor-pointer hover:bg-slate-200" onClick={() => this.handleEditmode( val.ac_id, val.result, 'result', 'content' )}>
                                            <div className="flex justify-content-between">
                                                {val.result} <i className="fas fa-comment-edit py-1"></i>
                                            </div>
                                        </td>
                                        <td className="border text-primary hover:cursor-pointer hover:bg-slate-200" onClick={() => this.handleEditmode( val.ac_id, val.indicator, 'indicator', 'content' )}>
                                            <div className="flex justify-content-between">
                                                {val.indicator} <i className="fas fa-comment-edit py-1"></i>
                                            </div>
                                        </td>
                                        <td className="border text-primary hover:cursor-pointer hover:bg-slate-200" onClick={() => this.handleEditmode( val.ac_id, val.baseline, 'baseline', 'content' )}>
                                            <div className="flex justify-content-between">
                                                {val.baseline} <i className="fas fa-comment-edit py-1"></i>
                                            </div>
                                        </td>
                                        <td className="border text-primary hover:cursor-pointer hover:bg-slate-200"  onClick={() => this.handleEditmode( val.ac_id, val.responsible_office, 'responsible_office', 'content' )}>
                                            <div className="flex justify-content-between">
                                                {val.responsible_office} <i className="fas fa-comment-edit py-1"></i>
                                            </div>
                                        </td>
                                    </tr>
                                ) : ""
                            }
                        </tbody>
                    </table>
                    {AnnexBData.length != 0 ?
                        <div className="contents">
                            <div className="text-left text-base">
                                Goal {AnnexB.goals.filter(val => val.ab_goal_id == this.state.ab_goal_id).map((val, idx) =>
                                    <span key={idx}> {val.goal_index} </span>
                                )} Annual Targets, Activities and Budget:
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        {years.map((yr,i) => 
                                            <th className="text-center border" key={i}> {yr} </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {AnnexBData.agenda.map((agendas,index) => 
                                        <tr key={index}>
                                            {agendas.agenda_contents.map((a_conts,ind) => 
                                                <td key={ind} className="text-start border h-[1px] w-auto">
                                                    {editMode == false ?
                                                        <div className="d-flex flex-col h-fit">
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
                                                            <div className="break-words h-max self-start"> 
                                                                <span className="fw-bold"> Budget: </span>
                                                                {a_conts.agenda_budget} {a_conts.agenda_budget_for}
                                                            </div>
                                                        </div> :
                                                        <div className="d-flex flex-col h-fit">
                                                            <div className="mb-3 h-fit text-primary hover:cursor-pointer hover:bg-slate-200" onClick={() => this.handleEditmode( a_conts.agenda_id, a_conts.agenda_target, 'agenda_target', 'agenda' )}> 
                                                                <div className="flex justify-content-between">
                                                                    <div className="text-left">
                                                                        <span className="fw-bold"> Targets: </span>
                                                                        {a_conts.agenda_target}
                                                                    </div> <i className="fas fa-comment-edit py-1"></i>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3 p-1 h-auto self-start"> 
                                                                <span className="fw-bold text-primary"> Activities: </span>
                                                                <ol className="ms-2 list-decimal text-primary" >
                                                                    {a_conts.agenda_activities.map((a_acts, idx) => 
                                                                        <div className="flex justify-content-between hover:cursor-pointer hover:bg-slate-200" key={idx} onClick={() => this.handleEditmode( a_acts.aact_id, a_acts.activity_title, 'activity_title', 'activity' )}>
                                                                            <li className="mb-2 break-words">
                                                                                {a_acts.activity_title}
                                                                            </li> <i className="fas fa-comment-edit py-1"></i>
                                                                        </div>
                                                                    )}
                                                                </ol>
                                                            </div>
                                                            <div className="break-words h-max text-primary hover:cursor-pointer hover:bg-slate-200" onClick={() => this.handleEditmode( a_conts.agenda_id, a_conts.agenda_budget, 'agenda_budget', 'agenda' )}> 
                                                                <div className="flex justify-content-between">
                                                                    <div className="text-left">
                                                                        <span className="fw-bold"> Budget: </span>
                                                                        {a_conts.agenda_budget} {a_conts.agenda_budget_for}
                                                                    </div> <i className="fas fa-comment-edit py-1"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </td>   
                                            )}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div> : ""
                    }
                </form>
            </AdminHeader>
        )
    }
}

export default AnnexB