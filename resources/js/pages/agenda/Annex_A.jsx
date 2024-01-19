import React, { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class Annex_A extends Component {
    constructor(props){
        super(props)
        this.state = {
            years: [],
            error_list: "",
            formPart: "one",
            start_year: "",
            end_year: "",
            GAD_vision: "",
            GAD_mission: "",
            action_by: JSON.parse(localStorage.getItem('auth')).name ,
            formValues: [{ GAD_goal: "" }],
            loading: true,
            submitted: false
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        //Getting the years on the selection
        try {
            const response = await axios.get('/api/inclusiveYears')
            this.setState({
                years: response.data,
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

    //Change form parts
    handleChangePartOne = (e) => {
        e.preventDefault()
        this.setState({
            formPart: "two"
        })
    }
    handleChangePartTwo = (e) => {
        e.preventDefault()
        this.setState({
            formPart: "one"
        })
    }

    //Change field of inputs
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChange(i, e) {
        let formValues = this.state.formValues;
        formValues[i][e.target.name] = e.target.value;
        this.setState({ formValues });
    }

    //Add and remove button for dynamic fields
    addFormFields(){
        this.setState({
            formValues: [...this.state.formValues, { GAD_goal: "" }]
        })
    }   
    removeFormFields(i) {
        let formValues = this.state.formValues
        formValues.splice(i, 1)
        this.setState({ formValues })
    }

    //Submit forms
    onFormSubmit = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('start_year', this.state.start_year)
            newFormData.append('end_year', this.state.end_year)
            newFormData.append('GAD_vision', this.state.GAD_vision)
            newFormData.append('GAD_mission', this.state.GAD_mission)
            newFormData.append('action_by', this.state.action_by)
            for(let i = 0; i < this.state.formValues.length; i++) {
                newFormData.append('formValues[]', this.state.formValues[i].GAD_goal)
            }
        axios.post('/api/newAnnexA',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    submitted: true
                })
            } else {
                this.setState({
                    error_list: "This field is required",
                    formPart: "one",
                })
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
        const { formPart, years, formValues, loading, submitted } = this.state
        if (submitted) {
            return(
                <Navigate to={"/GAD-agenda"}/>
            )
        }
        if (loading) {
            return(
                <Layout title={"/ GAD Agenda / New Annex A"}>
                    <Loader />
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD Agenda / New Annex A"}>
                <Link className="back-btn text-decoration-none" to="/GAD-agenda">
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="text-center text-3xl mobile-lg:text-lg"> New GAD Agenda (Annex A)  </div>
                <div className="p-5 mobile-lg:!p-2">
                    <div className="text-base fw-bold">
                        <p> (<span className="text-danger">*</span>) <span className="text-danger"> Required Fields </span> </p>
                    </div>
                    <div className="flex shadow text-lg container col-10 justify-evenly rounded rounded-pill p-4 my-3 bg-[#FBE7C6]">
                        <div className="form-group m-0">
                            {this.state.start_year.length == 0 ?
                                <div className="text-xs text-danger"> { this.state.error_list } </div> :
                                ""
                            }
                            <label htmlFor="start_year" className='m-0'> Start Year: </label>
                            <select 
                                name="start_year"
                                className="max-w-full custom-select mobile-lg:text-base"
                                value={this.state.start_year}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center'> -- Select Value -- </option>
                                {years.map((val,i) => 
                                    <option className='text-center' key={i} value={val}> {val} </option>
                                )}
                            </select>
                            {this.state.start_year.length == 0 ?
                                <span className="text-xl text-danger"> * </span> :
                                ""
                            }
                        </div>
                        <div className="form-group m-0">
                            {this.state.end_year.length == 0 ?
                                <div className="text-xs text-danger"> { this.state.error_list } </div> :
                                ""
                            }
                            <label htmlFor="end_year" className='m-0'> End Year: </label>
                            <select 
                                name="end_year"
                                className="max-w-full custom-select mobile-lg:text-base"
                                value={this.state.end_year}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center'> -- Select Value -- </option>
                                {years.map((val,i) => (
                                    <option className='text-center' key={i} value={val}> {val} </option>
                                ))}
                            </select>
                            {this.state.end_year.length == 0 ?
                                <span className="text-xl text-danger"> * </span> :
                                ""
                            }
                        </div>
                    </div>
                    <div className='text-lg text-primary mobile-lg:text-base'> I. <span className="ms-5"> GAD Strategic Framework </span>  </div>
                    <form className="text-lg" onSubmit={this.onFormSubmit}>
                        <table className="table border shadow">
                            <tbody>
                                <tr>
                                    <td className='px-5 py-3'> <strong> Agency: </strong>  Department of Science and Technology – Science Education Institute </td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td className='px-5 py-3'> <strong> Mandate: </strong> 
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
                        <div className="bg-transparent" style={{height:"35px"}}></div>
                        {formPart === "one" ? 
                            <div className="fisrtPart">
                                <table className="table border shadow">
                                    <thead>
                                        <tr>
                                            <th className="text-center text-base"> Area </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='px-5 py-3'>
                                                <strong>
                                                    GAD Vision: 
                                                    {this.state.GAD_vision.length == 0 ?
                                                        <span className="text-xl text-danger"> * </span> :
                                                        ""
                                                    } 
                                                </strong>
                                                {this.state.GAD_vision.length == 0 ?
                                                    <span className="text-xs text-danger"> { this.state.error_list } </span> :
                                                    ""
                                                }
                                                <textarea className='w-100 m-0 p-2 border resize-none'
                                                    name="GAD_vision"
                                                    rows="5"
                                                    value={this.state.GAD_vision}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td className='px-5 py-3'> 
                                                <strong>
                                                    GAD Mission: 
                                                    {this.state.GAD_mission.length == 0 ?
                                                        <span className="text-xl text-danger"> * </span> :
                                                        ""
                                                    }
                                                </strong>
                                                {this.state.GAD_mission.length == 0 ?
                                                    <span className="text-xs text-danger"> { this.state.error_list } </span> :
                                                    ""
                                                }
                                                <textarea className='w-100 m-0 p-2 border resize-none'
                                                    name="GAD_mission"
                                                    rows="5"
                                                    value={this.state.GAD_mission}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex justify-end">
                                    <button className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" onClick={this.handleChangePartOne} >
                                        Next
                                    </button>
                                </div>
                            </div> : 
                            <div className="lastPart">
                                <table className="table border shadow">
                                    <thead>
                                        <tr>
                                            <th className="text-center"> Area </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='px-5 py-3'> 
                                                <strong> GAD Goals: </strong>
                                                {formValues.map((element, index) => 
                                                    <div className="d-flex" key={index}>
                                                        <textarea className='w-100 mb-3 me-3 p-2 border resize-none'
                                                            name="GAD_goal"
                                                            rows="3"
                                                            value={element.GAD_goal}
                                                            onChange={e => this.handleChange(index, e)}
                                                        />
                                                    {index ? 
                                                            <button type="button"  className="focus:outline-none pb-3" onClick={() => this.removeFormFields(index)}>
                                                                <i className="text-3xl fas fa-trash-alt text-danger"></i>
                                                            </button> 
                                                        : null
                                                    }
                                                    </div>
                                                )}
                                                <div className="button-section">
                                                    <button className="bg-transparent focus:outline-none" type="button" onClick={() => this.addFormFields()}>
                                                        <i className="text-3xl fas fa-plus-circle text-success"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-between">
                                    <input className="bg-red-300 px-5 py-2 hover:bg-red-500 hover:text-white hover:shadow-2xl" type="button" value="Back" onClick={this.handleChangePartTwo} />
                                    <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                                </div>
                            </div>
                        }
                    </form> 
                </div>
            </Layout>
        )
    }
}

export default Annex_A