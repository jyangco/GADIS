import React, { Component, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { NumericFormat } from 'react-number-format'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

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

export class SinglePPA extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            show: false,
            editMode: false,
            PPA: "",
            gad_responsible_unit: [],
            act_titles: [],
            gad_mandate: "",
            gad_cause: "",
            gad_objective: "",
            gad_org: "", 
            proponents: [ 
                "GFPS/GAD TWG", 
                "OD", 
                "STSD", 
                "SEID", 
                "STMERPD", 
                "FAD", 
                "CODI"
            ]
        }
    }

    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        setTimeout(() => {
            this.fetchData()
        }, 5)
    }

    //fetching data
    fetchData = async() => {
        try {
            const act_id = window.name
            const response = await axios.get(`/api/getPPADetails/${act_id}`)
            this.setState({
                PPA: response.data.data,
                gad_responsible_unit: response.data.org,
                gad_mandate: response.data.data.act_gad_mandate,
                gad_cause: response.data.data.act_cause_of_issue,
                gad_objective: response.data.data.act_gad_objective,
                gad_org: response.data.data.act_relevant_org, 
                loading: false
            })
            for (let index = 0; index < response.data.data.act_atitles.length; index++) {
                [response.data.data.act_atitles].forEach((element, idx) => {
                    this.setState(
                        state => ({
                            act_titles: [ ...state.act_titles, { id: element[idx+index].act_id, act_titles: element[idx+index].act_title }]
                        })
                    )
                })
            }
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    //changing input fields
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
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChange(i, e) {
        let act_titles = this.state.act_titles;
        act_titles[i][e.target.name] = e.target.value;
        this.setState({ act_titles });
    }

    //handling checkbox
    handleChecked = (e, val) => {
        if (e.target.checked) {
            this.setState({
                gad_responsible_unit: [...this.state.gad_responsible_unit, val]
            })
        } else {
            const tempData = this.state.gad_responsible_unit.filter((item) => item !== val)
            this.setState({
                gad_responsible_unit: tempData
            })
        }
    }

    //update function
    handleUpdatePPA = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('act_id', this.state.PPA.act_id)
            newFormData.append('gad_responsible_unit', this.state.gad_responsible_unit.join(', '))
            newFormData.append('gad_mandate', this.state.gad_mandate)
            newFormData.append('gad_cause', this.state.gad_cause)
            newFormData.append('gad_objective', this.state.gad_objective)
            newFormData.append('gad_org', this.state.gad_org)
            for(let i = 0; i < this.state.act_titles.length; i++) {
                newFormData.append('act_titles[]', [
                    this.state.act_titles.act_titles = this.state.act_titles[i].act_titles +"<br/>",
                    this.state.act_titles.id = this.state.act_titles[i].id   ,
                ])
            }
        axios.post('/api/updatePPADetails',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    editMode: false,
                    act_titles: []
                })
                this.fetchData()
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

    render() {
        const { loading, PPA, editMode, proponents } = this.state
        const result = Array.isArray(this.state.gad_responsible_unit) ? this.state.gad_responsible_unit.join(', ') : ""
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
        return (
            <AdminHeader>
                <div className="hidden">
                    <ForID></ForID>
                </div>
                <Link className="back-btn text-decoration-none" to='/Admin/PPAs' >
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm">back</span>
                </Link>
                    <div className="px-5">
                        <div className="p-1 h-fit">
                            <div className="flex justify-content-end">
                                {editMode == false ?
                                    <button onClick={this.handleChangeMode} className="text-base hover:cursor-pointer outline-none"> Edit Mode <i className="fas fa-toggle-off fa-lg"></i> </button> :
                                    <button onClick={this.handleDefaultMode} className="text-base hover:cursor-pointer outline-none"> Edit Mode <i className="fas fa-toggle-on fa-lg text-success"></i> </button>
                                }
                            </div>
                            <div className="text-center text-3xl fw-bold mobile-lg:text-lg"> PPA Details </div>
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
                            {editMode == false ?
                                <div className="card-body fw-normal">
                                    <div className="m-0 text-3xl"> <span className='fw-bold'> Gender Issue: </span> 
                                        <div className="ms-5"> {PPA.act_gad_mandate} </div> 
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl"> <span className='fw-bold'> Cause of Gender Issue: </span> 
                                        <div className="ms-5"> {PPA.act_cause_of_issue} </div> 
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl"> <span className='fw-bold'> GAD Objective: </span> 
                                        <div className="ms-5"> {PPA.act_gad_objective} </div> 
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl"> <span className='fw-bold'> Relevant Organization: </span> 
                                        {PPA.act_relevant_org == "PAP" ?
                                            <div className="ms-5">
                                                <div> PAP: Development and administration of Science and Technology Scholarship </div>
                                                <div> PAP: Research, Promotion and Development of Science and Technology </div>
                                            </div> : 
                                            <div className="ms-5"> MFO: Science and Technology Human Resource Development Services </div>
                                        }
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl"> <strong> Responsible Unit: </strong>
                                        <div className="ms-5"> {PPA.act_responsible_unit} </div> 
                                    </div> 
                                    <br/>
                                    <div className="m-0 text-3xl"> <strong> GAD Activity: </strong>
                                        {PPA.act_atitles.length > 1 ?
                                            <ol className="ms-5">
                                                {PPA.act_atitles.map((titles,index) => (
                                                    <li key={index}> {titles.act_title} </li>
                                                ))}
                                            </ol> : 
                                            PPA.act_atitles.map((titles,index) => (
                                                <div className="ms-5" key={index}> {titles.act_title} </div>
                                            ))
                                        }
                                    </div>
                                </div> : 
                                <form className="createForms" onSubmit={this.handleUpdatePPA}>
                                    <div className="card-body fw-normal">
                                        <div className="m-0 text-3xl"> <span className='fw-bold'> Gender Issue: </span> 
                                            <textarea 
                                                className="bg-white text-2xl border border-dark resize-none w-100 p-2"
                                                name= "gad_mandate"
                                                rows="5"
                                                value={this.state.gad_mandate}
                                                onChange={this.handleFieldChange}
                                            />
                                        </div> 
                                        <br/>
                                        <div className="m-0 text-3xl"> <span className='fw-bold'> Cause of Gender Issue: </span> 
                                            <textarea 
                                                className="bg-white text-2xl border border-dark resize-none w-100 p-2"
                                                name= "gad_cause"
                                                rows="5"
                                                value={this.state.gad_cause}
                                                onChange={this.handleFieldChange}
                                            />
                                        </div> 
                                        <br/>
                                        <div className="m-0 text-3xl"> <span className='fw-bold'> GAD Objective: </span> 
                                            <textarea 
                                                className="bg-white text-2xl border border-dark resize-none w-100 p-2"
                                                name= "gad_objective"
                                                rows="5"
                                                value={this.state.gad_objective}
                                                onChange={this.handleFieldChange}
                                            />
                                        </div> 
                                        <br/>
                                        <div className="m-0 text-3xl"> <span className='fw-bold'> Relevant Organization: </span> 
                                            <select
                                                name="gad_org" 
                                                className="custom-select w-25 ms-2 text-2xl border border-dark outline-none"
                                                value={this.state.gad_org}
                                                onChange={this.handleFieldChange}
                                            >
                                                <option className="text-center" value={"MFO"}> MFO </option>
                                                <option className="text-center" value={"PAP"}> PAP </option>
                                            </select>
                                        </div> 
                                        <br/>
                                        <div className="m-0 text-3xl"> <strong> Responsible Unit: </strong>
                                            {proponents.map((val, i) => 
                                                <div className="inline ms-3 text-xl" key={i}>
                                                    <input className="mt-2"
                                                        onChange={(e) => this.handleChecked(e, val)}
                                                        value={val}
                                                        checked={this.state.gad_responsible_unit.includes(val)}
                                                        type="checkbox"
                                                    />
                                                    <label className="mx-0"> {val} </label>
                                                </div>
                                            )}
                                            <textarea 
                                                // disabled
                                                className="w-100 text-2xl m-0 p-2 border border-dark"
                                                rows="2"
                                                name="gad_responsible_unit"
                                                value={result}
                                                onChange={this.handleFieldChange}
                                            />
                                        </div> 
                                        <br/>
                                        <div className="m-0 text-3xl"> <strong> GAD Activity: </strong>
                                            {this.state.act_titles.length > 1 ?
                                                <ol className="ms-5">
                                                    {this.state.act_titles.map((title, id) => 
                                                        <textarea key={id}
                                                            className="bg-white text-2xl border border-dark resize-none w-100 p-2"
                                                            name="act_titles"
                                                            value={title.act_titles} 
                                                            onChange={e => this.handleChange(id, e)}
                                                        />
                                                    )}
                                                </ol> : 
                                                this.state.act_titles.map((title, id) => 
                                                    <textarea key={id}
                                                        className="bg-white text-2xl border border-dark resize-none w-100 p-2"
                                                        name="act_titles"
                                                        value={title.act_titles} 
                                                        onChange={e => this.handleChange(id, e)}
                                                    />
                                                )
                                            }
                                        </div>
                                        <br/>
                                        <div className="d-flex justify-content-center">
                                            <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl fw-semibold" type="submit" value="SAVE"/>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                    <div className="d-flex mt-5">
                        <div className="w-50 px-5 h-fit p-1">
                            <div className="bg-lightpurple rounded-full text-white">
                                <div className="text-3xl p-2 text-center"> Beneficiary Details </div>
                            </div>
                            <div className="card-body p-3 fw-normal">
                                {PPA.act_abens.map((bens, i) => 
                                    <div className="text-3xl" key={i}>
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
                        <div className="vr"/>
                        <div className="w-50 px-5 h-fit p-1">
                            <div className="bg-lightpurple rounded-full text-white">
                                <div className="text-3xl p-2 text-center"> Budgetary Details </div>
                            </div>
                            <div className="card-body p-3 fw-normal">
                                <div className="mb-3 text-3xl"> <strong> Activity Budget: </strong> <br/>
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
                                <div className="d-flex flex-wrap">
                                    <div className="w-100">
                                        <div className="m-0 text-3xl"> <strong> Actual Cost:  </strong> <br/>
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
                                        <div className="m-0 text-3xl"> <strong> % Utilization:  </strong> <br/>
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
            </AdminHeader>
        )
    }
}

export default SinglePPA