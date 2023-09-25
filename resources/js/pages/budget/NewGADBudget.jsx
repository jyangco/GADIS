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

export class NewGADBudget extends Component {
    constructor(props){
        super(props)
        this.state = {
            action_by: JSON.parse(localStorage.getItem('auth')).name,
            loading: true,
            accumulated_budget: "",
            item: "",
            item_cost: "",
            act_id: "",
            budget_id: "",
            BudgetData: "",
            TitleData: []
        }
    }

    //field change for both cost and item
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleItemCostChange = (event) => {
        const item_cost = parseFloat(event.target.value.replace(/,/g, ""))
        this.setState(prevState => ({
            item_cost,
            accumulated_budget: item_cost + parseFloat(prevState.BudgetData.actual_budget)
        }))
    }

    //reset User input fields
    resetInputs(){
        this.setState({
            item: "",
            item_cost: "",
        })
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        //getting single budgetary detail
        try {
            const act_id = window.name
            const response = await axios.get(`/api/getIndividualBudget/${act_id}`)
            this.setState({
                act_id: response.data.act_id,
                budget_id: response.data.act_abudgets.budget_id,
                BudgetData: response.data.act_abudgets,
                TitleData: response.data.act_atitles,
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

    //add new breakdowns and update total cost
    handleNewBudget = (e) => {
        e.preventDefault()
        const data = {
            budget_id: this.state.budget_id,
            accumulated_budget: this.state.accumulated_budget,
            item: this.state.item,
            item_cost: this.state.item_cost,
            action_by: this.state.action_by,
            act_id: this.state.act_id
        }
        axios.post('/api/newBudget', (data))
        .then(response => {
            Swal.fire("Success", response.data.message, "success")
            this.componentDidMount()
            this.resetInputs()
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

    render() {
        const { BudgetData, TitleData, act_id, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ GAD PPAs / New GAD Budget"}>
                    <Loader />
                    <div className="hidden">
                        <ForID></ForID>
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
                    <div className="text-center text-3xl my-3"> New GAD Budget </div>
                    <div className="p-2">
                        {TitleData.length > 1 ?
                            <div className="text-2xl text-start px-5 mobile-lg:!px-3 mobile-lg:!text-xl"> GAD Activity: 
                                <ol className="ms-5">
                                    {TitleData.map((titles,index) => <li key={index}> {titles.act_title} </li> )}
                                </ol> 
                            </div> : 
                            TitleData.map((titles,index) => 
                                <div className="text-2xl text-start px-5 mobile-lg:!px-3 mobile-lg:!text-xl" key={index}> GAD Activity:
                                    <div className="ms-5"> {titles.act_title} </div> 
                                </div>
                            )
                        }
                        <div className="d-flex flex-wrap mt-5 p-4 mobile-lg:!mt-3 mobile-lg:!p-2">
                            <div className="w-50 mobile-lg:!w-[100%] px-3 mobile-lg:!px-0">
                                <div className="p-1 h-fit" >
                                    <div className="card-body p-3 mobile-lg:!p-1">
                                        <div className="text-3xl p-2 text-center mobile-lg:!text-2xl"> Add New Budget </div>
                                        <hr className="my-2"/>
                                        <form className="createForms text-xl" onSubmit={this.handleNewBudget}>
                                            <div className="form-group">
                                                <label htmlFor="item"> Budget For: 
                                                <span className={this.state.item.length == 0 ? "fs-4 text-danger fw-bold" : "d-none" }> * </span>
                                                </label>
                                                <input className="m-0 p-0 w-100 border-transparent border-2 border-b-slate-950 outline-none"
                                                    type="text" 
                                                    name="item" 
                                                    value={this.state.item}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="item_cost"> Cost: 
                                                <span className={this.state.item_cost.length == 0 || isNaN(this.state.item_cost) ? "fs-4 text-danger fw-bold" : "d-none" }> * </span>
                                                </label>
                                                <NumericFormat 
                                                    className="text-right w-100 m-0 p-0 border-transparent border-2 border-b-slate-950 outline-none"
                                                    placeholder="0.00"
                                                    type="text" 
                                                    name="item_cost"
                                                    displayType="input"
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={this.state.item_cost}
                                                    onChange={this.handleItemCostChange}
                                                />
                                            </div>
                                            <div className="form-group mt-2">
                                                <label htmlFor="actual_budget"> Accumulated Budget:  </label>
                                                {this.state.accumulated_budget % 1 != 0?
                                                    <NumericFormat className="float-end"
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={this.state.accumulated_budget}
                                                    /> : 
                                                    <NumericFormat className="float-end"
                                                        type="text" 
                                                        displayType="text"
                                                        suffix='.00'
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={this.state.accumulated_budget}
                                                    /> 
                                                }
                                            </div>
                                            <div className="d-flex justify-content-center mt-5 mobile-lg:!mt-4">
                                                <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="vr mobile-lg:!hidden" />
                            <div className="w-50 mobile-lg:!w-[100%] px-3 mobile-lg:!px-0">
                                <div className="p-1 h-fit" >
                                    <div className="card-body p-3 mobile-lg:!p-1">
                                        <div className="text-3xl p-2 text-center mobile-lg:!text-2xl"> Budgetary Details </div>
                                        <hr className="my-2"/>
                                        <div className="d-flex text-xl px-4 mobile-lg:!px-2">
                                            <div className="w-50">
                                                <div className="mb-2"> Total Agency Approved Budget: </div>
                                                <div className="border-transparent border-2 text-right border-b-slate-950">
                                                    {BudgetData.planned_budget % 1 != 0?
                                                        <NumericFormat
                                                            type="text" 
                                                            displayType="text"
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={BudgetData.planned_budget}
                                                        /> : 
                                                        <NumericFormat
                                                            type="text" 
                                                            displayType="text"
                                                            suffix='.00'
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={BudgetData.planned_budget}
                                                        /> 
                                                    }
                                                </div>
                                            </div>
                                            <div className="vr mx-3"/>
                                            <div className="w-50">
                                                <div className="mb-2"> Actual Cost: </div>
                                                <div className="border-transparent border-2 text-right border-b-slate-950">
                                                    {BudgetData.actual_budget % 1 != 0?
                                                        <NumericFormat
                                                            type="text" 
                                                            displayType="text"
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={BudgetData.actual_budget}
                                                        /> : 
                                                        <NumericFormat
                                                            type="text" 
                                                            displayType="text"
                                                            suffix='.00'
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={BudgetData.actual_budget}
                                                        /> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-2"/>
                                        <div className="text-xl text-start"> Budget Breakdown: </div>
                                        <table className="table">
                                            <thead>
                                                <tr className="text-lg">
                                                    <th className="border text-center"> # </th>
                                                    <th className="border text-center w-50"> Item </th>
                                                    <th className="border text-center w-50"> Item Cost </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {BudgetData.act_abreakdowns.map((bb, ndx) => 
                                                    <tr className="text-lg" key={ndx}>
                                                        <td className="border"> {ndx + 1} </td>
                                                        <td className="border"> {bb.item} </td>
                                                        <td className="border text-right">
                                                            {bb.item_cost % 1 != 0?
                                                                <NumericFormat
                                                                    type="text" 
                                                                    displayType="text"
                                                                    prefix='₱ '
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={bb.item_cost}
                                                                /> : 
                                                                <NumericFormat
                                                                    type="text" 
                                                                    displayType="text"
                                                                    suffix='.00'
                                                                    prefix='₱ '
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={bb.item_cost}
                                                                /> 
                                                            }
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default NewGADBudget