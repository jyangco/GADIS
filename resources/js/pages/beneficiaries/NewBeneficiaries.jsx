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

export class NewBeneficiaries extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            act_id: "",
            act_category: "",
            TitleData: [],
            BeneficiaryData: [],
            TrainingData: [],
            ben_id: "",
            a_beneficiary_value: "",
            a_beneficiary_target: "",
            action_by: JSON.parse(localStorage.getItem('auth')).name
        }
    }

    //change input fields
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //updating actual outcome
    handleUpdateOutcome = (e) => {
        e.preventDefault()
        const data = {
            ben_id: this.state.ben_id,
            a_beneficiary_value: (this.state.a_beneficiary_value).replace(/,/g, ""),
            a_beneficiary_target: this.state.a_beneficiary_target,
            action_by: this.state.action_by,
            act_id: this.state.act_id
        }
        axios.post('/api/newBeneficiary', (data))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.resetInputs()
            this.componentDidMount()
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

    //reset User input fields
    resetInputs(){
        this.setState({
            ben_id: "",
            a_beneficiary_value: "",
            a_beneficiary_target: "",
        })
    }

    async componentDidMount(){
        try {
            //get single beneficiary details
            const act_id = window.name
            const response = await axios.get(`/api/getIndividualBeneficiaries/${act_id}`)
            if (response.data.act_category == "Training") {
                this.setState({
                    act_id: response.data.act_id,
                    act_category: response.data.act_category,
                    TitleData: response.data.act_atitles,
                    BeneficiaryData: response.data.act_abens,
                    TrainingData: response.data.act_atrainings.days,
                    loading: false
                })
            } else {
                this.setState({
                    act_id: response.data.act_id,
                    act_category: response.data.act_category,
                    TitleData: response.data.act_atitles,
                    BeneficiaryData: response.data.act_abens,
                    loading: false
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

    render() {
        const { BeneficiaryData, TitleData, TrainingData, act_id, act_category, loading } = this.state
        const personnels = []
        TrainingData.forEach(element => {
            personnels.push(element.personnels.length)
        })
        if (act_category == "Training") {
            this.state.a_beneficiary_value = (personnels.reduce((a,b) =>  a = a + b , 0 ))
        }
        if (loading) {
            return(
                <Layout title={"/ GAD PPAs / New Beneficiaries"}>
                    <Loader />
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        if (BeneficiaryData == "" ) {
            return(
                <Layout title={"/ GAD PPAs / New Beneficiaries"}>
                    <div className="p-5 mobile-lg:!p-2">
                        <div className="hidden">
                            <ForID></ForID>
                        </div>
                        <Link className="back-btn text-decoration-none" to={`/PPA/Direct/${act_id}`} state={{ id: `${act_id}` }} >
                            <i className="far fa-arrow-left rounded-circle p-1"></i>
                            <span className="tooltip-text text-sm ms-1">back</span>
                        </Link>
                        <div className="text-center text-3xl my-3">New Beneficiary</div>
                        <div className="p-2">
                            <div className="px-5 mx-5 text-xl mobile-lg:!p-0">
                                <i className="fas fa-exclamation-circle"></i>
                                <span> Actual Beneficiaries have already been added to this Activity. </span><br/>
                                <span className="px-5 mobile-lg:!px-3"> Proceed to: </span> <br/>
                                <span className="px-5 mobile-lg:!px-3"> 1. Add additional Budget, or </span> <br/>
                                <span className="px-5 mobile-lg:!px-3"> 2. Mark the Activity as Complete </span>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD PPAs / New Beneficiaries"}>
                <div className="p-5 mobile-lg:!p-2">
                    <Link className="back-btn text-decoration-none" to={`/PPA/Direct/${act_id}`} state={{ id: `${act_id}` }} >
                        <i className="far fa-arrow-left rounded-circle p-1"></i>
                        <span className="tooltip-text text-sm ms-1">back</span>
                    </Link>
                    <div className="text-center text-3xl my-3">New Beneficiary</div>
                    <div className="p-2">
                        {TitleData.length > 1 ?
                            <div className="text-2xl text-start px-5 mobile-lg:!px-3 mobile-lg:!text-xl">  GAD Activity:
                                <ol className="ms-5">
                                    {TitleData.map((titles,index) => <li key={index}> {titles.act_title} </li> )}
                                </ol> 
                            </div> : 
                            TitleData.map((titles,index) => 
                                <div className="text-2xl text-start px-5 mobile-lg:!px-3 mobile-lg:!text-xl" key={index}> GAD Activity:
                                    <div className="ms-5 fw-normal"> {titles.act_title} </div> 
                                </div>
                            )
                        }
                        <div className="mt-5 p-4 mobile-lg:!mt-3 mobile-lg:!p-2">
                        <div className={act_category == "Training" && this.state.a_beneficiary_value.length == 0 ? "text-xl text-info mb-5" : "d-none"}>
                            <i className="fas fa-exclamation-circle"></i>
                            <span> This is an activity under "TRAINING" Category, You can add "Actual Outcome" by following the steps: </span><br/>
                            <span> 1. Navigate to "GAD Trainings" Module. </span> <br/>
                            <span> 2. Select the specific training. </span> <br/>
                            <span> 3. Click the "View Personnel Here" text on the desired day. </span> <br/>
                            <span> 4. Select the name of Employees then Submit. </span>
                        </div>
                            <form className="createForms" onSubmit={this.handleUpdateOutcome}>
                                <div className="form-group">
                                    <label className="text-xl mb-2" htmlFor="target"> Activity Target: 
                                        <span className={this.state.ben_id.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                                    </label> <br/>
                                    <select 
                                        className="custom-select text-xl border border-dark"
                                        name="ben_id"
                                        value={this.state.ben_id}
                                        onChange={this.handleFieldChange}
                                    >
                                        <option className='text-center' value={""}> -- Select Value -- </option>
                                        {BeneficiaryData.map((val, i) =>
                                            <option className="text-center" key={i} value={val.ben_id}> {val.act_target} </option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="text-xl" htmlFor="outcome"> Actual Outcome:
                                        <span className={this.state.a_beneficiary_value.length == 0 || this.state.a_beneficiary_target.length == 0 ? "text-xl text-danger fw-bold" : "d-none" }> * </span>
                                    </label>
                                    <div className="d-flex">
                                        <div className="w-25 position-relative">
                                            {act_category == "Training" ?
                                                <input readOnly
                                                    className="w-75 m-0 position-absolute start-50 translate-middle-x"
                                                    type="text" 
                                                    name="a_beneficiary_value"
                                                    value={this.state.a_beneficiary_value}
                                                /> :
                                                <NumericFormat 
                                                    className="w-75 text-xl m-0 position-absolute start-50 translate-middle-x outline-none border-transparent border-2 border-b-slate-950"
                                                    placeholder="0"
                                                    type="text" 
                                                    name="a_beneficiary_value"
                                                    decimalSeparator="."
                                                    displayType="input"
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={this.state.a_beneficiary_value}
                                                    onChange={this.handleFieldChange}
                                                />
                                            }
                                        </div>
                                        <div className="w-75 px-4">
                                            <textarea 
                                                className="w-100 m-0 p-2 text-xl border border-dark resize-none"
                                                placeholder="Input Here..."
                                                rows="5"
                                                name="a_beneficiary_target"
                                                value={this.state.a_beneficiary_target}
                                                onChange={this.handleFieldChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-5">
                                    <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default NewBeneficiaries