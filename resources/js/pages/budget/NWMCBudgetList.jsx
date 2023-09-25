import React, { Component } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'

export class NWMCBudgetList extends Component {
    constructor(props){
        super(props)
        this.state ={
            modalShow: false,
            loading: true,
            actView: false,
            act_data: [],
            PPA: [],
            budget_data: [],
            budget_per_year: [],
            bb: []
        }
    }

    async componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})
        //get NWMC Budgets
        try {
            const response = await axios.get('/api/budgetForNWMC')
            this.setState({
                act_data: response.data.act_data,
                budget_data: response.data.budget_data,
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

    //Changing views
    handleChangeData = (year) => {
        const data = {
            year: year
        }
        axios.post('/api/budgetPerYearNWMC', data).then(response => {
            this.setState({
                PPA: response.data.act_data,
                budget_per_year: response.data.budget_data,
                actView: true
            })
        })
    }
    handleChangeView = (e) => {
        e.preventDefault()
        this.setState({
            actView:false
        })
    }

    //open and close modal
    handleOpenModal = (e) => {
        axios.get(`/api/getBreakdowns/${e}`).then(response => {
            this.setState({
                bb: response.data.act_abreakdowns,
                modalShow: true
            })
        })
    }
    handleCloseModal = (e) => {
        e.preventDefault()
        this.setState({
            modalShow: false
        })
    }

    render() {
        const { PPA, act_data, budget_data, bb, budget_per_year, loading, actView, modalShow } = this.state 
        if (loading){
            return(
                <Layout title={"/ Budget / NWMC"}>
                    <Loader/>
                </Layout>
            )
        }
        if (actView) {
            return(
                <Layout title={"/ Budget / NWMC"}>
                    <Modal show={modalShow} handleClose={this.handleCloseModal}>
                        <div className='card' style={{minWidth:"60vw"}}>
                            <div className="card-header">
                                <div className="text-center text-3xl mobile-lg:text-lg"> Budget Breakdown </div>
                            </div>
                            <div className="card-body">
                                {bb.length == 0 ?
                                    <div className="text-center text-2xl">
                                        <span className="px-5">
                                            No data to show
                                        </span>
                                    </div> :
                                    <table className="table text-xl">
                                        <thead>
                                            <tr>
                                                <th className="border text-center"> Item </th>
                                                <th className="border text-center"> Cost </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bb.map((value,ndx) => 
                                                <tr key={ndx}>
                                                    <td className="border">
                                                        {value.item}
                                                    </td>
                                                    <td className="border">
                                                        <NumericFormat 
                                                            type="text" 
                                                            displayType="text"
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={value.item_cost}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                    </Modal>
                    <div className="card-header">
                        <div className="back-btn text-decoration-none" onClick={this.handleChangeView}>
                            <button className="button">
                                <i className="far fa-arrow-left"></i>
                            </button>
                            <span className="tooltip-text text-sm ms-1">back</span>
                        </div>
                        <div className="text-center text-3xl mobile-lg:text-lg"> GAD Budget </div>
                    </div>
                    <div className="card-body p-5">
                        <div className="text-2xl fw-bold text-center text-primary m-3">
                            Budget Documentary for NWMC PPAs for FY {PPA[0].act_year}
                        </div>
                        <div className="text-2xl fw-bold text-primary m-3">
                            Budget Summary
                        </div>
                        <table id="ppaContainer" className="table text-xl">
                            <tbody>
                                <tr>
                                    <td className="border text-center" style={{width:'33%'}}> Total Agency Approved Budget </td>
                                    <td className="border text-center" style={{width:'33%'}}> Actual Cost </td>
                                    <td className="border text-center" style={{width:'33%'}}> % Utilization of Budget </td>
                                </tr>
                                <tr>
                                    <td className="border text-center">
                                        <NumericFormat 
                                            type="text" 
                                            displayType="text"
                                            prefix='₱ '
                                            thousandSeparator={true}
                                            thousandsGroupStyle="thousand"
                                            value={budget_per_year[0].planned_sum}
                                        />
                                    </td>
                                    <td className="border text-center">
                                        <NumericFormat 
                                            type="text" 
                                            displayType="text"
                                            prefix='₱ '
                                            thousandSeparator={true}
                                            thousandsGroupStyle="thousand"
                                            value={budget_per_year[0].direct_sum}
                                        />
                                    </td>
                                    <td className="border text-center"> 
                                        <NumericFormat 
                                            type="text" 
                                            displayType="text"
                                            suffix='%'
                                            thousandSeparator={true}
                                            thousandsGroupStyle="thousand"
                                            value={
                                                ((budget_per_year[0].direct_sum /
                                                    budget_per_year[0].planned_sum ) * 100).toFixed(2)
                                            }
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-2xl fw-bold text-primary m-3">
                            Activities
                        </div>
                        <div className="d-flex flex-wrap text-xl">
                            {PPA.map((act, ndx) => 
                                <div className="w-50 p-3" key={ndx} onClick={() => this.handleOpenModal(act.budget_id)}>
                                    <div id="ppaContainer" className="p-3" style={{height:'100%'}}>
                                        <label> Agency Approved Budget: </label>
                                        <div className="ms-5"> 
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={act.planned_budget} 
                                            />
                                        </div>
                                        <hr/>
                                        <label> Actual Cost: </label>
                                        <div className="ms-5"> 
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={act.actual_budget}
                                            />
                                        </div>
                                        <hr/>
                                        <label> GAD Activity: </label>
                                        {act.act_atitles.length > 1 ?
                                            <ol className="ms-5">
                                                {act.act_atitles.map((titles,index) => (
                                                    <li key={index}> {titles.act_title} </li>
                                                ))}
                                            </ol> : 
                                            act.act_atitles.map((titles,index) => (
                                                <div className="ms-5" key={index}> {titles.act_title} </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Layout>
            )
        }
        return(
            <Layout title={"/ Budget / NWMC"}>
                <div className="card-header">
                    <Link className="back-btn text-decoration-none" to="/Budget">
                        <i className="far fa-arrow-left rounded-circle p-1"></i>
                        <span className="tooltip-text text-sm ms-1">back</span>
                    </Link>
                    <div className="text-center text-3xl mobile-lg:text-lg"> GAD Budget </div>
                </div>
                <div className="card-body p-5">
                    <div className="text-2xl fw-bold text-center text-primary m-3">
                        Budget Documentary for NWMC Activities
                    </div>
                    <div className="text-2xl fw-bold text-primary m-3">
                        Budget Summary
                    </div>
                    <table id="ppaContainer" className="table text-xl">
                        <tbody>
                            <tr>
                                <td className="border text-center" style={{width:'33%'}}> Total Agency Approved Budget </td>
                                <td className="border text-center" style={{width:'33%'}}> Actual Cost </td>
                                <td className="border text-center" style={{width:'33%'}}> % Utilization of Budget </td>
                            </tr>
                            <tr>
                                <td className="border text-center">
                                    <NumericFormat 
                                        type="text" 
                                        displayType="text"
                                        prefix='₱ '
                                        thousandSeparator={true}
                                        thousandsGroupStyle="thousand"
                                        value={budget_data[0].planned_sum}
                                    />
                                </td>
                                <td className="border text-center">
                                    <NumericFormat 
                                        type="text" 
                                        displayType="text"
                                        prefix='₱ '
                                        thousandSeparator={true}
                                        thousandsGroupStyle="thousand"
                                        value={budget_data[0].direct_sum}
                                    />
                                </td>
                                <td className="border text-center"> 
                                    <NumericFormat 
                                        type="text" 
                                        displayType="text"
                                        suffix='%'
                                        thousandSeparator={true}
                                        thousandsGroupStyle="thousand"
                                        value={
                                            ((budget_data[0].direct_sum /
                                                budget_data[0].planned_sum ) * 100).toFixed(2)
                                        }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-2xl fw-bold text-primary m-3">
                        Budget Per Year
                    </div>
                    <div className="d-flex flex-wrap mb-4">
                        {act_data.map((nwmc, ndx) => 
                            <div className="w-50 text-xl p-3" key={ndx} onClick={() => this.handleChangeData(nwmc.act_year) }>
                                <div id="ppaContainer" className="card p-3">
                                    <div className="d-flex">
                                        <div className="w-25 px-4 mb-3"> Year </div>
                                        <div className="w-25 px-4 mb-3"> : </div>
                                        <div className="w-50 px-4 mb-3"> {nwmc.act_year} </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="w-25 px-4 mb-3"> Budget </div>
                                        <div className="w-25 px-4 mb-3"> : </div>
                                        <div className="w-50 px-4 mb-3">
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={nwmc.direct_sum}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end text-sm text-info">
                                        <i className="far fa-info-circle p-1"></i> click for more info
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        )
    }
}

export default NWMCBudgetList