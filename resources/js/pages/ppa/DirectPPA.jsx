import React, { Component } from 'react'
import axios from 'axios'
import { NumericFormat } from 'react-number-format'
import Swal from 'sweetalert2'

import Modal from '../../components/Modal'
import CopyToClipboard from '../../components/CopyToClipboard'

export class DirectPPA extends Component {
    constructor(props){
        super(props)
        this.state = {
            show: false,
            modalFor: "",
            disable: true,
            mandates: [],
            causes: [],
            objectives: [],
            years: [],
            filteredData: [],
            actValues: [],
            beneficiaryValues: [],
            gad_responsible_unit: [],
            ppa_category: "",
            ppa_type: "",
            gad_mandate: "",
            gad_cause: "",
            gad_objective: "",
            gad_org: "",
            gad_budget: "",
            gad_class: "",
            gad_source: "",
            gad_source_code: "2A1-AC",
            year: "",
            action_by: JSON.parse(localStorage.getItem('auth')).name,
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

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        try {
            const res = await axios.get('/api/getYears')
            this.setState({
                years: res.data,
            })
            const responses = await axios.get('/api/getDuplicateData')
            this.setState({
                mandates: responses.data.mandate,
                objectives: responses.data.objective,
                causes: responses.data.cause,
            })
            this.handleAddActivities()
            this.handleAddBeneficiaries()
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    //ADD NEW PPAs
    handleSubmitPPA = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('gad_responsible_unit', this.state.gad_responsible_unit.join(', '))
            newFormData.append('ppa_category', this.state.ppa_category)
            newFormData.append('ppa_type', this.state.ppa_type)
            newFormData.append('gad_mandate', this.state.gad_mandate)
            newFormData.append('gad_cause', this.state.gad_cause)
            newFormData.append('gad_objective', this.state.gad_objective)
            newFormData.append('gad_org', this.state.gad_org)
            newFormData.append('gad_budget', (this.state.gad_budget).replace(/,/g, ""))
            newFormData.append('gad_class', this.state.gad_class)
            newFormData.append('gad_source', this.state.gad_source)
            newFormData.append('gad_source_code', this.state.gad_source_code)
            newFormData.append('action_by', this.state.action_by)
            newFormData.append('year', this.state.year)
            for(let i = 0; i < this.state.actValues.length; i++) {
                newFormData.append('actValues[]', this.state.actValues[i].act_title)
            }
            for(let i = 0; i < this.state.beneficiaryValues.length; i++) {
                newFormData.append('beneficiaryValues[]', [
                    this.state.beneficiaryValues.act_target = this.state.beneficiaryValues[i].act_target +"<br/>",
                    this.state.beneficiaryValues.p_beneficiary_value = (this.state.beneficiaryValues[i].p_beneficiary_value).replace(/,/g, "") +"<br/>",
                    this.state.beneficiaryValues.p_beneficiary_target = this.state.beneficiaryValues[i].p_beneficiary_target,
                ])
            }
        axios.post('/api/newPPA',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.resetInputs()
                this.componentDidMount()
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else if (response.data.status == 400) {
                Swal.fire("Warning", "Please complete the required fields before submitting", "warning")
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

    //RESET FORMS
    resetInputs(){
        this.setState({
            show: false,
            disable: true,
            filteredData: [],
            actValues: [],
            beneficiaryValues: [],
            gad_responsible_unit: [],
            ppa_category: "",
            ppa_type: "",
            gad_mandate: "",
            gad_cause: "",
            gad_objective: "",
            gad_org: "",
            gad_budget: "",
            gad_class: "",
            gad_source: "",
            gad_source_code: "2A1-AC",
            year: ""
        })
    }

    //CLOSE MODAL
    forceClose = (e) => {
        e.preventDefault()
        this.setState({
            show: false,
            modalFor: ""
        })
    }
    //OPEN MODAL
    openModal = (e) => {
        this.setState({
            show: true,
            modalFor: e
        })
    }

    //CHANGE INPUT FIELDS
    handleYearChange = (event) => {
        this.setState({
            year: event.target.value
        })
        setTimeout(() => {
            this.handleFilter()
        }, 5);
    }
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleActChange(i, e) {
        let actValues = this.state.actValues;
        actValues[i][e.target.name] = e.target.value;
        this.setState({ actValues });
    }
    handleBenChange(i, e) {
        let beneficiaryValues = this.state.beneficiaryValues;
        beneficiaryValues[i][e.target.name] = e.target.value;
        this.setState({ beneficiaryValues });
    }

    //FILTER METHOD
    handleFilter = () => {
        const data = {
            year: this.state.year
        }
        axios.post('/api/getFilteredData', data).then(response => {
            this.setState({
                filteredData: response.data,
                disable: false,
            })
        })
    }

    //ADD FORM FIELDS
    handleAddActivities(){
        this.setState(({
            actValues: [...this.state.actValues, { act_title: "" }]
        }))
    }
    handleAddBeneficiaries(){
        this.setState(({
            beneficiaryValues: [...this.state.beneficiaryValues, { act_target: "", p_beneficiary_value: "" , p_beneficiary_target: "" }]
        }))
    }

    //REMOVE FORM FIELDS
    removeActFields(i) {
        let actValues = this.state.actValues;
        actValues.splice(i, 1);
        this.setState({ actValues });
    }
    removeBenFields(i) {
        let beneficiaryValues = this.state.beneficiaryValues;
        beneficiaryValues.splice(i, 1);
        this.setState({ beneficiaryValues });
    }

    //CHECKBOX CHECKING AND GETTING VALUE
    handleCheckAllChange = (e) => {
        if (e.target.checked) {
            const ids = this.state.proponents.map((val) => val)
            this.setState({
                gad_responsible_unit: ids
            })
        } else {
            this.setState({
                gad_responsible_unit: ""
            })
        }
    }
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

    render() {
        const { years, proponents, filteredData, show, actValues, beneficiaryValues, disable, causes, mandates, objectives } = this.state
        const result = Array.isArray(this.state.gad_responsible_unit) ? this.state.gad_responsible_unit.join(', ') : ""
        return (
            <div className="card-body">
                <Modal show={show} handleClose={this.forceClose}>
                    {/* <div className="text-2xl text-center p-3 fw-bold"> List of Activities for FY {this.state.year} listed on GAD Agenda </div>
                    {filteredData.map(val => 
                        val.agenda_activities.map((acts,i) => 
                            <div className="d-flex text-xl p-1 border hover:bg-slate-100" key={i}>
                                <div className="w-screen">
                                    {acts.activity_title}
                                </div>
                                <CopyToClipboard text={acts.activity_title} />
                            </div>
                        )
                    )} */}
                    {this.state.modalFor == "mandates" ?
                        <div className="content">
                            <div className="text-2xl text-center p-3 fw-bold"> List of past GAD Mandates</div>
                            {mandates.map((val,i) => 
                                <div className="d-flex text-xl p-1 border hover:bg-slate-100 hover:cursor-pointer" key={i}
                                    onClick={() => this.setState({gad_mandate: val.act_gad_mandate, show: false, modalFor: ""})}
                                >
                                    <div className="w-screen">
                                        {val.act_gad_mandate}
                                    </div>
                                </div>
                            )}
                        </div> : this.state.modalFor == "objectives" ?
                        <div className="content">
                            <div className="text-2xl text-center p-3 fw-bold"> List of past GAD Objectives</div>
                            {objectives.map((val,i) => 
                                <div className="d-flex text-xl p-1 border hover:bg-slate-100 hover:cursor-pointer" key={i}
                                    onClick={() => this.setState({gad_objective: val.act_gad_objective, show: false, modalFor: ""})}
                                >
                                <div className="w-screen">
                                        {val.act_gad_objective}
                                    </div>
                                </div>
                            )}
                        </div> : this.state.modalFor == "causes" ?
                        <div className="content">
                            <div className="text-2xl text-center p-3 fw-bold"> List of past GAD Causes of Issue</div>
                            {causes.map((val,i) => 
                                <div className="d-flex text-xl p-1 border hover:bg-slate-100 hover:cursor-pointer" key={i}
                                    onClick={() => this.setState({gad_cause: val.act_cause_of_issue, show: false, modalFor: ""})}
                                >   
                                <div className="w-screen">
                                        {val.act_cause_of_issue}
                                    </div>
                                </div>
                            )}
                        </div> : ""
                    }
                </Modal>
                <form className="createForms" onSubmit={this.handleSubmitPPA}>
                    <div className="text-2xl fw-bold text-primary mb-3 ms-5 mobile-lg:!ms-3">
                        I. Activity Details:
                    </div>
                    <div className="form-group mb-2 text-xl">
                        {disable == true ?
                            <div className="text-danger text-base fw-bold">
                                <p> *This Field is Required First </p>
                            </div> : 
                            <div className="text-base fw-bold">
                                <p> (<span className="text-danger">*</span>) <span className="text-danger"> Required Fields </span> </p>
                            </div>
                        }
                        <label htmlFor="year" className='m-0'> Year: </label>
                        <select
                            name="year" 
                            className="custom-select ms-2 border border-dark"
                            value={this.state.year}
                            onChange={this.handleYearChange}
                        >
                            <option value={""}> -- Select Value -- </option>
                            {years.map((val,i) => 
                                <option className='text-center' key={i} value={val}> {val} </option>
                            )}
                        </select>
                        {/* <button 
                            disabled={ this.state.year.length == 0 ? true : false } 
                            className={ this.state.year.length == 0 ? "bg-secondary opacity-50 px-2 py-1 fs-4 ms-3" : "bg-success px-2 py-1 fs-4 ms-3" } 
                            onClick={this.handleFilter}
                        >
                            <i className="fas fa-sync text-white"></i>
                        </button> */}
                    </div>
                    <div className="form-group mb-2 text-xl">
                        <label htmlFor="ppa_category" className='m-0'> PPA Category: </label>
                        <select 
                            disabled={disable}
                            name="ppa_category" 
                            className={disable ? "opacity-50 custom-select ms-2 border border-dark" : "custom-select ms-2 border border-dark"}
                            value={this.state.ppa_category}
                            onChange={this.handleFieldChange}
                        >
                            <option className='text-center' value={""}> -- Select Value -- </option>
                            <option className='text-center' value="Workshop"> Workshop </option>
                            <option className='text-center' value="Meeting"> Meeting </option>
                            <option className='text-center' value="Training"> Training </option>
                            <option className='text-center' value="Consultation"> Consultation </option>
                            <option className='text-center' value="NWMC"> Women's Month </option>
                            <option className='text-center' value="VAWC"> VAWC </option>
                            <option className='text-center' value="Others"> Others </option>
                        </select>
                        <span className={ disable == false && this.state.ppa_category.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                    </div>
                    <div className="form-group mb-2 text-xl">
                        <label htmlFor="ppa_type" className='m-0'> PPA Type: </label>
                        <select
                            disabled={disable}
                            name="ppa_type" 
                            className={disable ? "opacity-50 custom-select ms-2 border border-dark" : "custom-select ms-2 border border-dark"}
                            value={this.state.ppa_type}
                            onChange={this.handleFieldChange}
                        >
                            <option className='text-center' value={""}> -- Select Value -- </option>
                            <option className='text-center' value="Client Focused"> Client Focused </option>
                            <option className='text-center' value="Organization Focused"> Organization Focused </option>
                        </select>
                        <span className={ disable == false && this.state.ppa_type.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                    </div>
                    <div className="form-group text-xl">
                        <label htmlFor="gad_mandate" className='m-0'> Gender Issue/ GAD Mandate:
                        <span className={ disable == false && this.state.gad_mandate.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </label>
                        <div onClick={() => this.openModal('mandates')}
                            disabled={disable}
                            className={disable ? "opacity-50 float-right bg-secondary px-2 py-1 text-base mb-1" : "float-right bg-success px-2 py-1 text-base mb-1"}>
                            <i className="fas fa-database text-white"></i>
                        </div>
                        <textarea
                            disabled={disable}
                            className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark"}
                            placeholder={disable ? "Input Field Disabled" : "Input Here..."}
                            name="gad_mandate"
                            rows="3"
                            value={this.state.gad_mandate}
                            onChange={this.handleFieldChange}
                        />
                    </div>
                    <div className="form-group text-xl">
                        <label htmlFor="gad_cause" className='m-0'> Cause of Gender Issue: 
                        <span className={ disable == false && this.state.gad_cause.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </label>
                        <div onClick={() => this.openModal('causes')}
                            disabled={disable}
                            className={disable ? "opacity-50 float-right bg-secondary px-2 py-1 text-base mb-1" : "float-right bg-success px-2 py-1 text-base mb-1"}>
                            <i className="fas fa-database text-white"></i>
                        </div>
                        <textarea
                            disabled={disable}
                            className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark"}
                            placeholder={disable ? "Input Field Disabled" : "Input Here..."}
                            name="gad_cause"
                            rows="3"
                            value={this.state.gad_cause}
                            onChange={this.handleFieldChange}
                        />
                    </div>
                    <div className="form-group text-xl mb-2">
                        <label htmlFor="gad_objective" className='m-0'> GAD Result Statement/ GAD Objective: 
                        <span className={ disable == false && this.state.gad_objective.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        </label>
                        <div onClick={() => this.openModal('objectives')}
                            disabled={disable}
                            className={disable ? "opacity-50 float-right bg-secondary px-2 py-1 text-base mb-1" : "float-right bg-success px-2 py-1 text-base mb-1"}>
                            <i className="fas fa-database text-white"></i>
                        </div>
                        <textarea
                            disabled={disable}
                            className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark"}
                            placeholder={disable ? "Input Field Disabled" : "Input Here..."}
                            name="gad_objective"
                            rows="3"
                            value={this.state.gad_objective}
                            onChange={this.handleFieldChange}
                        />
                    </div>
                    <div className="form-group text-xl mb-2">
                        <label htmlFor="gad_org" className='m-0'> Revelevant Organization: </label>
                        <select
                            disabled={disable}
                            name="gad_org" 
                            className={disable ? "opacity-50 custom-select ms-2 border border-dark" : "custom-select ms-2 border border-dark"}
                            value={this.state.gad_org}
                            onChange={this.handleFieldChange}
                        >
                            <option className='text-center' value={""}> -- Select Value -- </option>
                            <option className='text-center' value="MFO"> MFO </option>
                            <option className='text-center' value="PAP"> PAP </option>
                        </select>
                        <span className={ disable == false && this.state.gad_org.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                    </div>
                    <div className="flex flex-wrap justify-content-between text-xl mb-3">
                        <div className="form-group w-25 px-1 mobile-lg:!w-[100%]">
                            <div className="m-0"> GAD Budget:
                            <span className={ disable == false && this.state.gad_budget.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                            <span> ₱ </span> </div>
                            <NumericFormat 
                                className={disable ? "opacity-50 w-100 m-0 border-2 border-transparent border-b-slate-950" : "w-100 text-right m-0 border-2 border-transparent border-b-slate-950 outline-none"}
                                placeholder={disable ? "Input Field Disabled" : "0.00"}
                                disabled={disable}
                                type="text" 
                                name="gad_budget"
                                decimalSeparator="."
                                displayType="input" 
                                thousandSeparator={true}
                                thousandsGroupStyle="thousand"
                                value={this.state.gad_budget}
                                onChange={this.handleFieldChange}
                            />
                        </div>
                        <div className="form-group w-25 px-1 mobile-lg:!w-[100%]">
                            <div className='m-0'> Expense Class:
                            <span className={ disable == false && this.state.gad_class.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                            </div>
                            <select
                                disabled={disable}
                                name="gad_class" 
                                className={disable ? "opacity-50 custom-select w-100 border border-dark" : "custom-select w-100 border border-dark"}
                                value={this.state.gad_class}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center' value={""}> -- Select Value -- </option>
                                <option className='text-center' value="MOOE"> MOOE </option>
                                <option className='text-center' value="PS"> PS </option>
                                <option className='text-center' value="CO"> CO </option>
                                <option className='text-center' value="PAP"> PAP </option>
                                <option className='text-center' value="Others"> Others </option>
                                <option className='text-center' value="N/A"> N/A </option>
                            </select>
                        </div>
                        <div className="form-group w-25 px-1 mobile-lg:!w-[100%]">
                            <div className='m-0'> Budget Source:
                            <span className={ disable == false && this.state.gad_source.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                            </div>
                            <select
                                disabled={disable}
                                name="gad_source" 
                                className={disable ? "opacity-50 custom-select w-100 border border-dark" : "custom-select w-100 border border-dark"}
                                value={this.state.gad_source}
                                onChange={this.handleFieldChange}
                            >
                                <option className='text-center' value={""}> -- Select Value -- </option>
                                <option className='text-center' val="GAA"> GAA </option>
                                <option className='text-center' val="Others"> Others </option>
                                <option className='text-center' val="N/A"> N/A </option>
                            </select>
                        </div>
                        <div className="form-group w-25 px-1 mobile-lg:!w-[100%]">
                            <label htmlFor="gad_source_code" className='m-0'> Bugdet Source Code: </label>
                            <input
                                type="text"
                                disabled
                                name="gad_source_code" 
                                className="custom-select w-100 border-2 border-transparent border-b-slate-950"
                                value={this.state.gad_source_code}
                                onChange={this.handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group text-xl">
                        <div className='m-0'> Responsible Unit: </div>
                            <div className="inline ms-3">
                                <input className="mt-2"
                                    disabled={disable}
                                    onChange={this.handleCheckAllChange}
                                    checked={proponents.length === this.state.gad_responsible_unit.length}
                                    type="checkbox"
                                />
                                <label className="mx-0"> SELECT ALL </label>
                            </div>
                            {proponents.map((val, i) => 
                                <div className="inline ms-3 mobile-lg:!flex" key={i}>
                                    <input className="mt-2"
                                        disabled={disable}
                                        onChange={(e) => this.handleChecked(e, val)}
                                        value={val}
                                        checked={this.state.gad_responsible_unit.includes(val)}
                                        type="checkbox"
                                    />
                                    <label className="mx-0"> {val} </label>
                                </div>
                            )}
                        <span className={ disable == false && this.state.gad_responsible_unit.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                        <textarea 
                            disabled
                            className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark"}
                            placeholder={disable ? "Input Field Disabled" : ""}
                            rows="2"
                            name="gad_responsible_unit"
                            value={result}
                            onChange={this.handleFieldChange}
                        />
                    </div>
                    <div className="text-2xl fw-bold text-primary m-3 ms-5 mobile-lg:!ms-3">
                        II. Activity Title and Beneficiaries:
                    </div>
                    <div className="form-group">
                        <table className="table">
                            <thead>
                                <tr className="text-xl text-center">
                                    <th className="w-50 border"> GAD Activity </th>
                                    <th className="w-50 border"> Target Beneficiaries </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-xl">
                                    <td className="border">
                                        {actValues.map((element, index) => (
                                            <div className="d-flex" key={index}>
                                                <div className="form-group w-100">
                                                    <label htmlFor="act_title" className='m-0'> Activity:
                                                    <span className={ disable == false && element.act_title.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                                                    </label>
                                                    {/* <button onClick={this.openModal}
                                                        disabled={disable}
                                                        className={disable ? "opacity-50 float-right bg-secondary px-2 py-1 text-base mb-1" : "float-right bg-success px-2 py-1 text-base mb-1"}>
                                                        <i className="fas fa-database text-white"></i>
                                                    </button> */}
                                                    <textarea 
                                                        disabled={disable}
                                                        className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark mobile-lg:!text-sm"}
                                                        placeholder={disable ? "Input Field Disabled" : "Input Here..."}
                                                        rows="5"
                                                        name="act_title"
                                                        value={element.act_title}
                                                        onChange={ e => this.handleActChange(index, e)}
                                                    />
                                                </div>
                                                {index ? 
                                                    <button type="button"  className="button remove" onClick={() => this.removeActFields(index)}>
                                                        <i className="mx-1 p-3 fas fa-trash-alt bg-danger text-white"></i>
                                                    </button> 
                                                : null
                                                }
                                            </div>
                                        ))}
                                        <button disabled={disable} className="button add" type="button" onClick={() => this.handleAddActivities()}>
                                            {disable ? 
                                                <i className="p-3 fas fa-plus-circle bg-secondary opacity-50 text-white"></i> : 
                                                <i className="p-3 fas fa-plus-circle bg-success text-white"></i>
                                            }
                                        </button>
                                    </td>
                                    <td className="border">
                                        {beneficiaryValues.map((val, index) => (
                                            <div className="d-flex" key={index}>
                                                <div className="form-group w-100">
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="w-100">
                                                            <label htmlFor="act_target" className='m-0'> Target: 
                                                            <span className={ disable == false && val.act_target.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                                                            </label>
                                                            <textarea 
                                                                disabled={disable}
                                                                className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark mobile-lg:!text-sm"}
                                                                placeholder={disable ? "Input Field Disabled" : "Input Here..."}
                                                                rows="4"
                                                                name="act_target"
                                                                value={val.act_target}
                                                                onChange={ e => this.handleBenChange(index, e)}
                                                            />
                                                        </div>
                                                        <div className="w-100">
                                                            <label htmlFor="p_beneficiaries" className='m-0'> Beneficiaries:
                                                            <span className={ disable == false && (val.p_beneficiary_target == 0 || val.p_beneficiary_value.length == 0) ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                                                            </label>
                                                        </div>
                                                        <div className="w-25 mobile-lg:!w-[100%] position-relative">
                                                            <NumericFormat 
                                                                className={disable ? "opacity-50 w-75 m-0 position-absolute start-50 translate-middle-x border-2 border-transparent border-b-slate-950 mobile-lg:!relative mobile-lg:!mb-2" : "mobile-lg:!relative mobile-lg:!mb-2 w-75 m-0 position-absolute start-50 translate-middle-x border-2 border-transparent border-b-slate-950 outline-none"}
                                                                placeholder={disable ? "Disabled" : "0"}
                                                                disabled={disable}
                                                                type="text" 
                                                                name="p_beneficiary_value"
                                                                decimalSeparator="."
                                                                displayType="input"
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={val.p_beneficiary_value}
                                                                onChange={ e => this.handleBenChange(index, e) }
                                                            />
                                                        </div>
                                                        <div className="w-75 mobile-lg:!w-[100%]">
                                                            <textarea 
                                                                disabled={disable}
                                                                className={disable ? "opacity-50 w-100 m-0 p-2 border border-dark" : "w-100 m-0 p-2 border border-dark mobile-lg:!text-sm"}
                                                                placeholder={disable ? "Input Field Disabled" : "Input Here..."}
                                                                rows="5"
                                                                name="p_beneficiary_target"
                                                                value={val.p_beneficiary_target}
                                                                onChange={ e => this.handleBenChange(index, e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {index ? 
                                                    <button type="button"  className="button remove" onClick={() => this.removeBenFields(index)}>
                                                        <i className="mx-1 p-3 fas fa-trash-alt bg-danger text-white"></i>
                                                    </button> 
                                                : null
                                                }
                                            </div>
                                        ))}
                                        <button disabled={disable} className="button add" type="button" onClick={() => this.handleAddBeneficiaries()}>
                                            {disable ? 
                                                <i className="p-3 fas fa-plus-circle bg-secondary opacity-50 text-white"></i> : 
                                                <i className="p-3 fas fa-plus-circle bg-success text-white"></i>
                                            }
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default DirectPPA