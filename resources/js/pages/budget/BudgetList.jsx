import React, { Component } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'

export class BudgetList extends Component {
    constructor(props){
        super(props)
        this.state = {
            modalShow: false,
            directView: false,
            attribView: false,
            loading: true,
            budget_data: [],
            PPA: [],
            direct: [],
            attrib: [],
            nwmc: [],
            bb: []
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        //get budget per year
        try {
            const response = await axios.get('/api/BudgetList')
            this.setState({
                direct: response.data.direct,
                attrib: response.data.attrib,
                nwmc: response.data.nwmc,
                loading: false,
            })
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
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

    //set PPA view as false
    handleChangeView = (e) => {
        e.preventDefault()
        this.setState({
            directView: false
        })
    }
    handleChangeViewAttrib = (e) => {
        e.preventDefault()
        this.setState({
            attribView: false
        })
    }

    //get budget per activity based on selected year
    handleChangeData = (year) => {
        const data = {
            year: year
        }
        axios.post('/api/budgetPerYear', data).then(response => {
            this.setState({
                PPA: response.data.act_data,
                budget_data: response.data.budget_data,
                directView: true
            })
        })
    }
    handleChangeDataForAttrib = (year) => {
        const data = {
            year: year
        }
        axios.post('/api/budgetPerYearAttrib', data).then(response => {
            this.setState({
                PPA: response.data.act_data,
                budget_data: response.data.budget_data,
                attribView: true
            })
        })
    }

    render() {
        const { PPA, direct, attrib, nwmc, budget_data, loading, directView, attribView,  modalShow, bb } = this.state
        if (loading) {
            return(
                <Layout title={"/ Budget"}>
                    <Loader />
                </Layout>
            )
        }
        //Direct PPA View
        if (directView) {
            return(
                <Layout title={"/ Budget"}>
                    <Modal show={modalShow} handleClose={this.handleCloseModal}>
                        <div className='min-w-[60vw]'>
                            <div className="card-header">
                                <div className="text-center text-3xl mobile-lg:text-laders"> Budget Breakdown </div>
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
                                                        {value.item_cost % 1 != 0?
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={(((value.item_cost)*100)/100).toFixed(2)} 
                                                            /> : 
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                suffix='.00'
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={value.item_cost} 
                                                            />
                                                        }
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
                                <i className="far fa-arrow-left rounded-circle p-1"></i>
                            </button>
                            <span className="tooltip-text text-sm ms-1"> Back </span>
                        </div>
                        <div className="text-center text-3xl"> GAD Budget </div>
                    </div>
                    <div className="card-body p-5 mobile-lg:!p-2">
                        <div className="text-2xl fw-bold text-center text-primary m-3">
                            Budget Documentary for Direct PPAs for FY {PPA[0].act_year}
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
                                        {budget_data[0].planned_sum % 1 != 0?
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={(((budget_data[0].planned_sum)*100)/100).toFixed(2)} 
                                            /> : 
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                suffix='.00'
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={budget_data[0].planned_sum} 
                                            />
                                        }
                                    </td>
                                    <td className="border text-center">
                                        {budget_data[0].direct_sum % 1 != 0?
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={(((budget_data[0].direct_sum)*100)/100).toFixed(2)} 
                                            /> : 
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                suffix='.00'
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={budget_data[0].direct_sum} 
                                            />
                                        }
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
                            Activities
                        </div>
                        <div className="d-flex flex-wrap text-xl">
                            {PPA.map((act, ndx) => 
                                <div className="w-50 p-3 mobile-lg:!w-[100%]" key={ndx} onClick={() => this.handleOpenModal(act.budget_id)}>
                                    <div id="ppaContainer" className="p-3" style={{height:'100%'}}>
                                        <div classname="font-bold"> Agency Approved Budget: </div>
                                        <div className="ms-5 mobile-lg:!ms-4"> 
                                            {act.planned_budget % 1 != 0?
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={(((act.planned_budget)*100)/100).toFixed(2)} 
                                                /> : 
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    suffix='.00'
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={act.planned_budget} 
                                                />
                                            }
                                        </div>
                                        <hr/>
                                        <div classname="font-bold"> Actual Cost: </div>
                                        <div className="ms-5 mobile-lg:!ms-4"> 
                                            {act.actual_budget % 1 != 0?
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={(((act.actual_budget)*100)/100).toFixed(2)} 
                                                /> : 
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    suffix='.00'
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={act.actual_budget} 
                                                />
                                            }
                                        </div>
                                        <hr/>
                                        <div classname="font-bold"> GAD Activity: </div>
                                        {act.act_atitles.length > 1 ?
                                            <ol className="ms-5 mobile-lg:!ms-4">
                                                {act.act_atitles.map((titles,index) => (
                                                    <li key={index}> {titles.act_title} </li>
                                                ))}
                                            </ol> : 
                                            act.act_atitles.map((titles,index) => (
                                                <div className="ms-5 mobile-lg:!ms-4" key={index}> {titles.act_title} </div>
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
        //Attributed PPA View
        if (attribView) {
            return(
                <Layout title={"/ Budget"}>
                    <div className="card-header">
                        <div className="back-btn text-decoration-none" onClick={this.handleChangeViewAttrib}>
                            <button className="button">
                                <i className="far fa-arrow-left rounded-circle p-1"></i>
                            </button>
                            <span className="tooltip-text text-sm ms-1"> Back </span>
                        </div>
                        <div className="text-center text-3xl"> GAD Budget </div>
                    </div>
                    <div className="card-body p-5 mobile-lg:!p-2">
                        <div className="text-2xl fw-bold text-center text-primary m-3">
                            Budget Documentary for Attributed PPAs for FY {PPA[0].attrib_year}
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
                                    <td className="border text-center p-1 mobile-lg:!text-base">
                                        <NumericFormat 
                                            type="text" 
                                            displayType="text"
                                            prefix='₱ '
                                            thousandSeparator={true}
                                            thousandsGroupStyle="thousand"
                                            value={budget_data[0].attrib_planned}
                                        />
                                    </td>
                                    <td className="border text-center p-1 mobile-lg:!text-base">
                                        <NumericFormat 
                                            type="text" 
                                            displayType="text"
                                            prefix='₱ '
                                            thousandSeparator={true}
                                            thousandsGroupStyle="thousand"
                                            value={budget_data[0].attrib_sum}
                                        />
                                    </td>
                                    <td className="border text-center p-1 mobile-lg:!text-base"> 
                                        <NumericFormat 
                                            type="text" 
                                            displayType="text"
                                            suffix='%'
                                            thousandSeparator={true}
                                            thousandsGroupStyle="thousand"
                                            value={
                                                ((budget_data[0].attrib_sum /
                                                    budget_data[0].attrib_planned ) * 100).toFixed(2)
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
                                <div className="w-50 mobile-lg:!w-[100%] p-3" key={ndx}>
                                    <div id="ppaContainer" className="p-3" style={{height:'100%'}}>
                                        <div className='font-bold'> Agency Approved Budget: </div>
                                        <div className="ms-5 mobile-lg:!ms-4"> 
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={act.attrib_planned_budget} 
                                            />
                                        </div>
                                        <hr/>
                                        <div className='font-bold'> Actual Cost: </div>
                                        <div className="ms-5 mobile-lg:!ms-4"> 
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={act.attrib_actual_budget}
                                            />
                                        </div>
                                        <hr/>
                                        <div className='font-bold'> GAD Activity: </div>
                                        <div className="ms-5 mobile-lg:!ms-4" > {act.attrib_title} </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Layout>
            )
        }
        //Main View
        return (
            <Layout title={"/ Budget"}>
                <div className="text-center text-3xl"> GAD Budget </div>
                <div className="card-body p-5 mobile-lg:!p-2">
                    {/* <div className="text-2xl fw-bold text-primary m-3">
                        National Women's Month Celebration
                    </div>
                    <div className="d-flex flex-wrap mb-5">
                        {nwmc.map((budget, ndx) => 
                            <Link className="w-50 text-xl p-4 text-decoration-none text-dark" key={ndx} to="/Budget/NWMC">
                                <div id="ppaContainer" className="card p-3">
                                    <div className="text-center mb-2"> Total Budget for all NWMC Activities </div>
                                    <div className="d-flex">
                                        <div className="w-25 px-2 mb-3"> Budget </div>
                                        <div className="w-25 px-4 mb-3"> : </div>
                                        <div className="w-50 px-4 mb-3">
                                            <NumericFormat 
                                                type="text"
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={budget.direct_sum}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end text-sm text-info">
                                        <i className="far fa-info-circle p-1"></i> click for more info
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div> */}
                    <div className="text-2xl fw-bold text-primary m-3">
                        Direct PPAs
                    </div>
                    <div className="d-flex flex-wrap mb-4">
                        {direct.map((budget, ndx) => 
                            <div className="w-50 text-xl p-4 mobile-lg:!p-2" key={ndx} onClick={() => this.handleChangeData(budget.act_year)}>
                                <div id="ppaContainer" className="card p-3 mobile-lg:!px-1 mobile-xs:!text-base">
                                    <div className="d-flex flex-wrap">
                                        <div className="w-25 mobile-lg:!w-[45%] mobile-lg:!mb-0 px-2 mb-3"> Year </div>
                                        <div className="w-25 mobile-lg:!px-0 mobile-lg:!w-[5%] px-2 mb-3"> : </div>
                                        <div className="w-50 mobile-lg:!w-[50%] mobile-lg:!px-2 px-2 mb-3"> {budget.act_year} </div>
                                    </div>
                                    <div className="d-flex flex-wrap">
                                        <div className="w-25 mobile-lg:!w-[100%] mobile-lg:!mb-0 px-2 mb-3"> Budget </div>
                                        <div className="w-25 mobile-lg:!hidden px-2 mb-3"> : </div>
                                        <div className="w-50 mobile-lg:!w-[100%] mobile-lg:!px-2 px-2 mb-3">
                                            {budget.direct_sum % 1 != 0?
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={(((budget.direct_sum)*100)/100).toFixed(2)}
                                                /> : 
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    suffix='.00'
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={budget.direct_sum} 
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end text-sm text-info">
                                        <i className="far fa-info-circle p-1"></i> click for more info
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <hr />
                    <div className="text-2xl fw-bold text-primary m-3">
                        Attributed PPAs
                    </div>
                    <div className="d-flex flex-wrap mb-4">
                        {attrib.map((attrib, ndx) => 
                            <div className="w-50 text-xl p-4 mobile-lg:!p-2" key={ndx} onClick={() => this.handleChangeDataForAttrib(attrib.attrib_year) }>
                                <div id="ppaContainer" className="card p-3 mobile-lg:!px-1 mobile-xs:!text-base">
                                    <div className="d-flex flex-wrap">
                                        <div className="w-25 mobile-lg:!w-[45%] mobile-lg:!mb-0 px-2 mb-3"> Year </div>
                                        <div className="w-25 mobile-lg:!px-0 mobile-lg:!w-[5%] px-2 mb-3"> : </div>
                                        <div className="w-50 mobile-lg:!w-[50%] mobile-lg:!px-2 px-2 mb-3"> {attrib.attrib_year} </div>
                                    </div>
                                    <div className="d-flex flex-wrap">
                                        <div className="w-25 mobile-lg:!w-[100%] mobile-lg:!mb-0 px-2 mb-3"> Budget </div>
                                        <div className="w-25 mobile-lg:!hidden px-2 mb-3"> : </div>
                                        <div className="w-50 mobile-lg:!w-[100%] mobile-lg:!px-2 px-2 mb-3">
                                            <NumericFormat 
                                                type="text" 
                                                displayType="text"
                                                prefix='₱ '
                                                thousandSeparator={true}
                                                thousandsGroupStyle="thousand"
                                                value={attrib.attrib_sum}
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

export default BudgetList