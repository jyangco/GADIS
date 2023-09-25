import React, { Component } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Link } from 'react-router-dom'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

export class Agenda extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            editMode: false,
            years: [],
            agendaYears: [],
            aa_id: "",
            Agenda: "",
            GAD_mission: "",
            GAD_vision: "",
            GAD_goals: []
        }
    }

    async componentDidMount(){
        try {
            const response = await axios.get('/api/gettingGADAgendas')
            this.setState({
                years: response.data,
            })
            setTimeout(() => {
                this.onLoad()
            }, 100)
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    onLoad = () => {
        const data = {
            aa_id: this.state.years[0].aa_id
        }
        axios.post('/api/getGADAgenda', data).then(response => {
            for (let index = Number(response.data.start_year); index < (Number(response.data.end_year)+1); index++) {
                this.state.agendaYears.push(index)
            }
            this.setState({
                Agenda: response.data,
                aa_id: response.data.aa_id,
                GAD_mission: response.data.GAD_mission,
                GAD_vision: response.data.GAD_vision,
                loading: false
            })
            for (let index = 0; index < response.data.goals.length; index++) {
                [response.data.goals].forEach((element, idx) => {
                    this.setState(
                        state => ({
                            GAD_goals: [ ...state.GAD_goals, { id: idx+index+1, GAD_goal: element[idx+index].GAD_goal }]
                        })
                    )
                })
            }
        })
    }

    //update everything
    handleUpdatgeAll = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('aa_id', this.state.aa_id)
            newFormData.append('GAD_vision', this.state.GAD_vision)
            newFormData.append('GAD_mission', this.state.GAD_mission)
            for(let i = 0; i < this.state.GAD_goals.length; i++) {
                newFormData.append('GAD_goals[]', [
                    this.state.GAD_goals.GAD_goal = this.state.GAD_goals[i].GAD_goal +"<br/>",
                    this.state.GAD_goals.id = this.state.GAD_goals[i].id   ,
                ])
            }
        axios.post('/api/updateAnnexA',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    editMode: false,
                    GAD_goals: []
                })
                this.onLoad()
                window.scrollTo({top: 0, behavior: 'smooth'})
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

    //Changing of year for filter
    handleYearChange = (event) => {
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
            aa_id: this.state.aa_id
        }
        axios.post('/api/getGADAgenda', data).then(response => {
            for (let index = Number(response.data.start_year); index < (Number(response.data.end_year)+1); index++) {
                this.state.agendaYears.push(index)
            }
            this.setState({
                Agenda: response.data,
            })
        })
    }

    //change to edit mode
    handleChangeToEditMode = (e) => {
        e.preventDefault()
        this.setState({
            editMode: true
        })
    }
    handleChangeToViewMode = (e) => {
        e.preventDefault()
        this.setState({
            editMode: false
        })
    }

    //field change
    handleFieldChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChange(i, e) {
        let GAD_goals = this.state.GAD_goals;
        GAD_goals[i][e.target.name] = e.target.value;
        this.setState({ GAD_goals });
    }

    render() {
        const { loading, years, Agenda, editMode } = this.state
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader/>
                </AdminHeader>
            )
        }
        return (
            <AdminHeader>
                <div className="text-center text-3xl"> GAD Agenda </div>
                <form className="createForms min-h-[50vh]" onSubmit={this.handleUpdatgeAll}>
                    <div className="form-group my-3 text-lg">
                        <label> Select Year <i className="far fa-filter mx-1"></i> </label>
                        <select
                            name="aa_id" 
                            className="custom-select ms-2 border border-dark outline-none"
                            value={this.state.aa_id}
                            onChange={this.handleYearChange}
                        >
                            <option className="text-center" value={""} > -- Select Value -- </option>
                            {years.map((val,i) => 
                                <option className="text-center" value={val.aa_id} key={i}> {val.start_year} - {val.end_year} </option>
                            )}
                        </select>
                    </div>
                    {Agenda.length == 0 ? "" :
                        <div className="content">
                            <div className="text-right text-lg"> ANNEX A </div>
                            <div className="fw-bold">
                                <div className="text-center text-xl"> DOST - SCIENCE EDUCATION INSTITUTE </div>
                                <div className="text-center text-xl"> GAD AGENDA </div>
                                <div className="text-center text-xl"> {Agenda.start_year} - {Agenda.end_year} </div>
                            </div>
                            <div className="text-left text-base text-primary"> I. GAD Strategic Framework </div>
                            <table className="table border my-3">
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
                                {editMode == false ?
                                    <tbody>
                                        <tr>
                                            <td className="text-center px-5 py-3 fw-bold text-sm"> 
                                                Area 
                                                <button onClick={this.handleChangeToEditMode} className="float-right text-base hover:cursor-pointer outline-none"> Edit Mode <i className="fas fa-toggle-off fa-lg"></i> </button>
                                            </td>
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
                                                        <li key={i} className="mb-2 ms-5">
                                                            <span>
                                                                {goal.GAD_goal}
                                                            </span>
                                                        </li>
                                                    )}
                                                </ol>
                                            </td>
                                        </tr>
                                    </tbody> :
                                    <tbody>
                                        <tr>
                                            <td className="text-center px-5 py-3 fw-bold text-sm"> 
                                                Area
                                                <button onClick={this.handleChangeToViewMode} className="float-right text-base hover:cursor-pointer outline-none"> Edit Mode <i className="fas fa-toggle-on fa-lg text-success"></i> </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='p-3'> <strong> GAD Vision: </strong>
                                                <textarea 
                                                    className="bg-white border border-dark resize-none w-100 p-2"
                                                    name= "GAD_vision"
                                                    rows="5"
                                                    value={this.state.GAD_vision}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='p-3'> <strong> GAD Mission: </strong>
                                                <textarea 
                                                    className="bg-white border border-dark resize-none w-100 p-2"
                                                    name= "GAD_mission"
                                                    rows="5"
                                                    value={this.state.GAD_mission}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='p-3'> <strong> GAD Goals: </strong>
                                                <ol className="list-decimal">
                                                    {this.state.GAD_goals.map((goal, id) => 
                                                        <textarea key={id}
                                                            className="bg-white border border-dark resize-none w-100 p-2"
                                                            name="GAD_goal"
                                                            value={goal.GAD_goal} 
                                                            onChange={e => this.handleChange(id, e)}
                                                        />
                                                    )}
                                                </ol>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">
                                                <div className="d-flex justify-content-center">
                                                    <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="SAVE"/>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                }
                            </table>
                            <div className="d-flex justify-content-end">
                                <Link to={`/Admin/Agenda/${this.state.aa_id}/AnnexB`} state={{ id: `${this.state.aa_id}` }} className="text-decoration-none bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl">
                                    Visit Annex B
                                </Link>
                            </div>
                        </div>
                    }
                </form>
            </AdminHeader>
        )
    } 
}

export default Agenda