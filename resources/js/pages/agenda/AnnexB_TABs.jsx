import React, { Component, useEffect } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import {NumericFormat}  from 'react-number-format'

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

export class AnnexB_TABs extends Component {
    constructor(props){
        super(props)
        this.state = {
            AnnexB: "",
            loading: true,
            year: [],
            formValues: [],
            actValues: [],
            action_by: JSON.parse(localStorage.getItem('auth')).name ,
        } 
    }

    //For knowing the number of input fields
    addFormFields(){
        for (let index = 0; index < this.state.year.length; index++) {
            if (index == this.state.year.length-1) {
                [this.state.year].forEach((el,i) => {
                    this.setState(
                        state => ({
                            formValues: [...state.formValues,{
                                ag_index: index,
                                agenda_year: el[i+index],
                                agenda_target: "",
                                agenda_budget: "",
                                agenda_budget_for: "",
                            }],
                            actValues: [...state.actValues,{
                                a_index: index,
                                activity_title: ""
                            }]
                        })
                    )
                })
            }
        }
    }

    //Remove button for dynamic fields 
    removeFormFields(i) {
        let actValues = this.state.actValues;
        actValues.splice(i, 1);
        this.setState({ actValues });
    }

    onFormSubmit = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('ab_goal_id', this.state.AnnexB.ab_goal_id)
            newFormData.append('aa_id', this.state.AnnexB.aa_id)
            newFormData.append('action_by', this.state.action_by)
            for(let i = 0; i < this.state.formValues.length; i++) {
                newFormData.append('formValues[]' ,[
                    this.state.formValues.ag_index = this.state.formValues[i].ag_index +"<br/>",
                    this.state.formValues.agenda_year = this.state.formValues[i].agenda_year +"<br/>",
                    this.state.formValues.agenda_target = this.state.formValues[i].agenda_target +"<br/>",
                    this.state.formValues.agenda_budget = this.state.formValues[i].agenda_budget +"<br/>",
                    this.state.formValues.agenda_budget_for = this.state.formValues[i].agenda_budget_for,
                ])
            }
            for (let i = 0; i < this.state.actValues.length; i++) {
                newFormData.append('actValues[]' ,[
                    this.state.actValues.a_index = this.state.actValues[i].a_index +"<br/>",
                    this.state.actValues.activity_title = this.state.actValues[i].activity_title
                ])
            }
        axios.post('/api/newAnnexBp2',(newFormData))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.setState({
                formValues: [],
                actValues: []
            })
            this.componentDidMount()
        })
        .catch(error => {
            Swal.fire("Error", "Something went wrong", "error")
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    //Getting specific AnnexB entry
    componentDidMount(){
        setTimeout(() => {
            window.scrollTo({top: 0, behavior: 'smooth'})
            try {
                const ab_id = window.name
                axios.get(`/api/getAnnexBp1/${ab_id}`).then(response => {
                    for (let index = Number(response.data.start_year); index < (Number(response.data.end_year)+1); index++) {
                        this.state.year.push(index)
                        this.addFormFields()
                    }
                    this.setState({
                        AnnexB: response.data,
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

    //change field of input
    handleChange(i, e) {
        let formValues = this.state.formValues
        formValues[i][e.target.name] = e.target.value
        this.setState({ formValues })
    }
    handleActChange(i, e) {
        let actValues = this.state.actValues
        actValues[i][e.target.name] = e.target.value
        this.setState({ actValues })
    }

    render() {
        const { loading, AnnexB, formValues, actValues } = this.state
        if (loading) {
            return(
                <Layout title={"/ GAD Agenda / Annex B / Annual Targets, Activities and Budgets"}>
                    <Loader />
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD Agenda / Annex B / Annual Targets, Activities and Budgets"}>
                <Link className="back-btn text-decoration-none" to={`/GAD-agenda/AnnexB/${AnnexB.ab_id}`} state={{id: `${AnnexB.ab_id}` }} >
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="text-center text-3xl"> New GAD Agenda (Annex B) </div>
                <div className="text-center text-3xl"> for GAD Agenda {AnnexB.start_year} - {AnnexB.end_year} </div>
                <div className="text-center text-xl"> GOAL {AnnexB.goal_index} Annual Targets, Activities and Budget </div>
                <div className="p-5">
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                    <div className="scrollmenu">
                        <form className="text-lg" onSubmit={this.onFormSubmit} id="userInputForm">
                            <table className="table border ">
                                <thead>
                                    <tr className="text-center">
                                        {formValues.map((val,index) => 
                                            <th key={index} className="border border-dark p-1">
                                                {val.agenda_year}
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {formValues.map((val,index) => 
                                            <td key={index} className="border border-dark p-1">
                                                <div className="form-group">
                                                    <label htmlFor="agenda_target" className='m-0'><u>TARGET: </u></label>
                                                    <textarea rows="7" className='w-100 m-0 p-2 text-base border resize-none'
                                                        name={'agenda_target'}
                                                        value={val.agenda_target}
                                                        onChange={e => this.handleChange(index, e)}
                                                    ></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="activity_title" className="m-0"><u>Activities: </u></label>
                                                    {actValues.map((element, i) => (
                                                        element.a_index === val.ag_index ? 
                                                        <div key={i} className="position-relative">
                                                            <textarea rows="12" className="w-100 mx-0 mb-2 p-2 pe-4 text-base border resize-none" 
                                                                // type="text" 
                                                                name='activity_title'
                                                                value={element.activity_title}
                                                                onChange={e => this.handleActChange(i, e)}
                                                            />
                                                            {i ? 
                                                            <button type="button" className="absolute top-0 end-0 px-2 bg-danger text-white" onClick={() => this.removeFormFields(i)}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                            : <button type="button" className="absolute top-0 end-0 px-2 bg-danger text-white" onClick={() => this.removeFormFields(i)}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                            } 
                                                        </div> : ""
                                                    ))}
                                                    <div className="button-section w-100">
                                                        <button className="w-100 bg-success" type="button" 
                                                            //Add input field
                                                            onClick={() => 
                                                                this.setState(
                                                                    state => ({
                                                                        actValues: [...state.actValues, { a_index: index , activity_title: "" }]
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            <i className="p-3 fas fa-plus-circle bg-success text-white"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="agenda_budget" className="m-0"><u>Budget: </u></label> <br/>
                                                    <label htmlFor="agenda_budget" className="m-0"><u> -Amount: </u></label>
                                                    <NumericFormat className="w-100 text-base m-0 border-b-2 border-slate-900 outline-none"
                                                        type="text" 
                                                        name="agenda_budget"
                                                        decimalSeparator="."
                                                        displayType="input"
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        prefix="Php "
                                                        placeholder="0.00"
                                                        value={val.agenda_budget}
                                                        onChange={e => this.handleChange(index, e)}
                                                    />
                                                    <label htmlFor="agenda_budget" className="m-0"><u> -For: </u></label>
                                                    <textarea rows="5" className="w-100 mx-0 mb-2 p-2 p-1 text-base border resize-none" 
                                                        // type="text" 
                                                        name="agenda_budget_for"
                                                        placeholder="Optional"
                                                        value={val.agenda_budget_for}
                                                        onChange={e => this.handleChange(index, e)}
                                                    />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center mt-5">
                                <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default AnnexB_TABs