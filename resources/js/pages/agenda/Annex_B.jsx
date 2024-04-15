import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

function Annex_B() {
    const [AnnexA, setAnnexA] = useState("")
    const [AnnexB, setAnnexB] = useState("")
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [ab_id, setABID] = useState("")
    const [goal_id, setGoalID] = useState("")
    const [formValues, setFormValues] = useState([{
        gender_issue: "",
        result: "",
        indicator: "",
        baseline: "",
        responsible_office: "",
    }])
    const history = useNavigate()
    const location = useLocation()
    const action_by = JSON.parse(localStorage.getItem('auth')).name

    const fetchData = async() =>{
        window.scrollTo({top: 0, behavior: 'smooth'})
        if (location.state == null) {
            Swal.fire({
                title: "ERROR in opening Annex A",
                text: "Annex A can't be opened, either deleted or corrupted",
                icon: "error",
            })
            history("/GAD-agenda")
        } else {
            const { id } = location.state 
            try {
                const response = await axios.get(`/api/getIndividualAnnexA/${id}`)
                setAnnexA(response.data),
                setAnnexB(response.data.annex_b),
                setGoals(response.data.goals),
                setABID(response.data.annex_b.ab_id),
                setLoading(false)
            } catch (error) {
                Swal.fire({
                    title: (error.code),
                    text: (error.message),
                    icon: "warning",
                })
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleChange = (i, e) => {
        let newFormValues = [...formValues]
        newFormValues[i][e.target.name] = e.target.value
        setFormValues(newFormValues)
    }

    //Add and remove button for dynamic fields
    const addFormFields = () => {
        setFormValues([...formValues, {
            gender_issue: "",
            result: "",
            indicator: "",
            baseline: "",
            responsible_office: "",
        }])
    }
    const removeFormFields = (i) => {
        let newFormValues = [...formValues]
        newFormValues.splice(i, 1)
        setFormValues(newFormValues)
    }

    //Submit Forms
    const onFormSubmit = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('ab_id', ab_id)
            newFormData.append('goal_id', goal_id)
            newFormData.append('aa_id', AnnexB.aa_id)
            newFormData.append('action_by', action_by)
            for(let i = 0; i < formValues.length; i++) {
                newFormData.append('formValues[]' ,[
                    formValues.gender_issue = formValues[i].gender_issue +"<br/>",
                    formValues.result = formValues[i].result +"<br/>",
                    formValues.indicator = formValues[i].indicator +"<br/>",
                    formValues.baseline = formValues[i].baseline +"<br/>",
                    formValues.responsible_office = formValues[i].responsible_office,
                ])
            }
        axios.post('/api/newAnnexBp1',(newFormData))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            fetchData()
            setFormValues([{
                gender_issue: "",
                result: "",
                indicator: "",
                baseline: "",
                responsible_office: "",
            }])
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
    if (loading) {
        return(
            <Layout title={"/ GAD Agenda / New Annex B"}>
                <Loader />
            </Layout>
        )
    }
    return (
        <Layout title={"/ GAD Agenda / New Annex B"}>
            <Link className="back-btn text-decoration-none" to="/GAD-agenda">
                <i className="far fa-arrow-left rounded-circle p-1"></i>
                <span className="tooltip-text text-sm ms-1">back</span>
            </Link>
            <div className="text-center text-3xl"> New GAD Agenda (Annex B) </div>
            <div className=" mb-2 mx-5 text-center"> {AnnexA.start_year} - {AnnexA.end_year} </div>
            <div className="p-5 mobile-lg:!p-2">
            <div className='text-lg text-primary mobile-lg:text-base'> II. <span className="ms-5"> GAD Strategic Plan </span>  </div>
                <form className="overflow-auto" onSubmit={onFormSubmit}>
                    <table className="table border">
                        <thead>
                            <tr>
                                <th colSpan="5"> Agency: DOST - Science Education Institute </th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th colSpan="5">
                                    {goal_id === "" ?
                                        <span className='text-danger '> *This Field is Required </span> : ""
                                    }
                                    <br/>
                                    Goal
                                    <select
                                        name="goal_id"
                                        className="custom-select border p-1 overflow-hidden w-[100%] whitespace-pre text-ellipsis"
                                        value={goal_id}
                                        onChange={e => setGoalID(e.target.value)}
                                    >
                                        <option className='text-center' value=""> -- Select Value -- </option>
                                        {goals.map((val,i) => (
                                            <option key={i} value={val.goal_id}> {val.goal_index}: {val.GAD_goal} </option>
                                        ))}
                                    </select>
                                </th>
                            </tr>
                        </thead>
                    </table>
                    {goal_id !== "" ?
                        <table className="table border ">
                            <thead>
                                <tr>
                                    <th className="border text-center align-top w-[5%]"> # </th>
                                    <th className="border text-center align-top w-[19%]"> GENDER ISSUE  </th>
                                    <th className="border text-center align-top w-[19%]"> GAD OUTCOME/ RESULT/ STATEMENT </th>
                                    <th className="border text-center align-top w-[19%]"> INDICATOR </th>
                                    <th className="border text-center align-top w-[19%]"> BASELINE </th>
                                    <th className="border text-center align-top w-[19%]"> RESPONSIBLE UNIT/OFFICE </th>
                                </tr>
                            </thead>
                            {goals.filter(goal => goal.goal_id == goal_id).map((val,i) => (
                                val.annex_b_goals !== null ?
                                <tbody key={i}>
                                    {val.annex_b_goals.contents.map((goalList,i) => (
                                        <tr key={i}>
                                            <td className="border text-center"> { i + 1 } </td>
                                            <td className="border"> {goalList.gender_issue} </td>
                                            <td className="border"> {goalList.result} </td>
                                            <td className="border"> {goalList.indicator} </td>
                                            <td className="border"> {goalList.baseline} </td>
                                            <td className="border"> {goalList.responsible_office} </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="6" className="py-3">
                                            <div className="button-section d-flex justify-content-center">
                                                <Link to={`/GAD-agenda/AnnexB/${ab_id}/Annual_T-A-B/${goal_id}`} state={{id: `${goal_id}` }}>
                                                    <input className='bg-green-300 px-5 py-2 me-2 hover:bg-green-500 hover:text-white hover:shadow-2xl' type="button" value="Add Annual Targets, Activities and Budget"/>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className="border text-center ">
                                            Goal {val.goal_index} Annual Targets, Activities and Budget
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="border text-center" style={{width:'5%', verticalAlign:'top'}}> # </th>
                                        <th className="border text-center" > TARGET  </th>
                                        <th className="border text-center" colSpan={3}> ACTIVITIES </th>
                                        <th className="border text-center" > BUDGET </th>
                                    </tr>
                                    {val.annex_b_goals.agenda.map((contents, i) => (
                                        <tr key={i}>
                                            <td className="border text-center"> { i + 1 } </td>
                                            <td className="border text-start" >
                                                <ol>
                                                    {contents.agenda_contents.map((agendas,index) => (
                                                        <li key={index} className="mb-3">
                                                            {agendas.agenda_year}: <br/> -{agendas.agenda_target}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </td>
                                            <td className="border text-start" colSpan={3}>
                                                <ol>
                                                    {contents.agenda_contents.map((agendas,index) => (
                                                        <li key={index} className="mb-3">
                                                            {agendas.agenda_year}: <br/> 
                                                            <ol className="text-start">
                                                                {agendas.agenda_activities.map((acts, ind) => (
                                                                    <li key={ind} className="" >
                                                                        {acts.activity_title}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </td>
                                            <td className="border text-start">
                                                <ol>
                                                    {contents.agenda_contents.map((agendas,index) => (
                                                        <li key={index} className="mb-3">
                                                            {agendas.agenda_year}: <br/> -{agendas.agenda_budget} <br/> {agendas.agenda_budget_for}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody> 
                                : 
                                <tbody key={i}>
                                    {formValues.map((element, index) => (
                                        <tr key={index} >
                                            <td className="border text-center">
                                                { index + 1 }
                                                {index ? 
                                                        <button type="button"  className="button " onClick={() => removeFormFields(index)}>
                                                            <i className="text-3xl fas fa-trash-alt text-danger"></i>
                                                        </button> 
                                                    : null
                                                }
                                            </td>
                                            <td className="border">
                                                <textarea className='w-100 p-1 m-0 border'
                                                    name="gender_issue"
                                                    rows="7"
                                                    value={element.gender_issue}
                                                    onChange={e => handleChange(index, e)}
                                                />
                                            </td>
                                            <td className="border">
                                                <textarea className='w-100 p-1 m-0 border'
                                                    name="result"
                                                    rows="7"
                                                    value={element.result}
                                                    onChange={e => handleChange(index, e)}
                                                />
                                            </td>
                                            <td className="border">
                                                <textarea className='w-100 p-1 m-0 border'
                                                    name="indicator"
                                                    rows="7"
                                                    value={element.indicator}
                                                    onChange={e => handleChange(index, e)}
                                                />
                                            </td>
                                            <td className="border">
                                                <textarea className='w-100 p-1 m-0 border'
                                                    name="baseline"
                                                    rows="7"
                                                    value={element.baseline}
                                                    onChange={e => handleChange(index, e)}
                                                />
                                            </td>
                                            <td className="border">
                                                <textarea className='w-100 p-1 m-0 border'
                                                    name="responsible_office"
                                                    rows="7"
                                                    value={element.responsible_office}
                                                    onChange={e => handleChange(index, e)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="6" className="py-3">
                                            <div className="button-section d-flex justify-content-between">
                                                <button className="button add" type="button" onClick={() => addFormFields()}>
                                                    <i className="text-3xl fas fa-plus-circle text-success"></i>
                                                </button>
                                                <input className="bg-green-300 px-5 py-2 me-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                        : <div className='text-center p-3 border shadow-sm bg-[#FBE7C6]'> "SELECT A GOAL TO ADD DETAILS" </div>
                        }
                </form>
            </div>
        </Layout>
    )
}

export default Annex_B