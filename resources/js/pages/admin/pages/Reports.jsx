import React, { Component } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import moment from 'moment'
import { NumericFormat } from 'react-number-format'
import ReactToPrint from 'react-to-print'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

export class Reports extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            view: 'main',
            type: '',
            year: '',
            reports: [],
            PPA: [],
            Attrib: [],
            Directbudgets: [],
            Attribbudgets: [],
            TotalBudget: '',
            report_status: '',
        }
    }

    async componentDidMount(){
        try {
            const response = await axios.get('/api/getReports')
            this.setState({
                reports: response.data,
                loading: false
            })
            const budget = await axios.get('/api/BudgetList')
            this.setState({
                Directbudgets: budget.data.direct,
                Attribbudgets: budget.data.attrib
            })
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    //get data for reports
    handleGetData = () => {
        const data = {
            report_year: this.state.year,
            report_type: this.state.type
        }
        axios.post('/api/getPPAsforReport', data).then(response => {
            this.setState({
                PPA: response.data.Acts,
                Attrib: response.data.Attrib,
                TotalBudget: response.data.Details.total_budget,
                report_status: response.data.Details.status,
            })
        })
    }

    //change view
    handleSetViewToSub = (type, year) => {
        this.setState({
            view: 'sub',
            type: type,
            year: year
        })
        setTimeout(() => {
            this.handleGetData()
        }, 5)
    }
    handleSetViewToMain = (e) => {
        e.preventDefault()
        this.setState({
            view: 'main',
            type: '',
            PPA: [],
            Attrib: [],
            TotalBudget: '',
            report_status: ''
        })
    }

    render() {
        const { loading, reports, view, type, year, PPA, Attrib, Directbudgets, Attribbudgets, TotalBudget, report_status } = this.state
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader/>
                </AdminHeader>
            )
        }
        if (view == 'main') {
            return (
                <AdminHeader>
                    <div className="text-center text-3xl"> GAD Reports </div>
                    <div className="min-h-[50vh]">
                        <div className="d-flex mt-5">
                            <div className="w-50 p-2">
                                <div className="text-center text-3xl my-3"> GPB </div>
                                <div className="block">
                                    {reports.filter(type => type.report_type == "GPB").map((val, i) =>
                                        <div id="ppaContainer" className="position-relative p-3 mx-auto my-5 w-75" key={i} onClick={() => this.handleSetViewToSub('GPB', val.report_year)}>
                                            <div className="pill position-absolute top-0 start-100 translate-middle p-2 text-base rounded-pill border"> {i + 1} </div>
                                            <div className="text-center m-0 text-3xl"> FY {val.report_year} </div>
                                            <div className="text-right mt-2 text-lg text-info"> <i className="fas fa-info-circle"></i> {val.status} </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="vr"></div>
                            <div className="w-50 p-2">
                                <div className="text-center text-3xl my-3"> GAR </div>
                                <div className="block">
                                    {reports.filter(type => type.report_type == "GAR").map((val, i) =>
                                        <div id="ppaContainer" className="position-relative p-3 mx-auto my-5 w-75" key={i} onClick={() => this.handleSetViewToSub('GAR', val.report_year)}>
                                            <div className="pill position-absolute top-0 start-100 translate-middle p-2 text-base rounded-pill border"> {i + 1} </div>
                                            <div className="text-center m-0 text-3xl"> FY {val.report_year} </div>
                                            <div className="text-right mt-2 text-lg text-info"> <i className="fas fa-info-circle"></i> {val.status} </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminHeader>
            )
        } else if (view == 'sub') {
            return(
                <AdminHeader>
                    <button className="back-btn text-decoration-none" onClick={this.handleSetViewToMain} >
                        <i className="far fa-arrow-left rounded-circle p-1"></i>
                        <span className="tooltip-text text-sm">back</span>
                    </button>
                    <div className="text-center text-3xl"> GAD Reports </div>
                    <div className="text-center text-2xl"> {type} </div>
                    {type == "GAR" ? 
                        <div ref={ el => (this.componentRef=el) } id="toPrint" className="p-1">
                            <div className="text-center fs-5 fw-bold"> ANNUAL GENDER AND DEVELOPMENT (GAD) ACCOMPLISHMENT REPORT </div>
                            <div className="text-center fs-5 fw-bold"> FY {year} </div>
                            <div className="d-flex">
                                <div className="w-50 p-3 border">
                                    <strong> Reference: </strong>
                                        GADIS Generated GAR{year}
                                </div>
                                <div className="w-50 p-3 border">
                                    <strong> Date: </strong>
                                    {moment(new Date()).format('LL')}
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="w-50 p-3 border">
                                    <strong> Organization: </strong>
                                    Science Education Institute
                                </div>
                                <div className="w-50 p-3 border border-start-0">
                                    <strong> Organization Category: </strong>
                                    National Government, Attached Agency
                                </div>
                            </div>
                            <div className="d-flex w-100 p-3 border-start border-end">
                                <strong> Organization Hierarchy: </strong>
                                Department of Science and Technology, Science Education Institute
                            </div>
                            <div className="d-flex border">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-3">
                                                            <strong> Total Budget/GAA of Organization: </strong>
                                                        </div>
                                                        <div className="w-50 border-end py-3 px-1">
                                                            <span> ₱  </span>
                                                            {this.state.TotalBudget % 1 != 0 ?
                                                                <NumericFormat
                                                                    className="w-[90%] bg-transparent border-0"
                                                                    displayType="input"
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={TotalBudget}
                                                                /> : 
                                                                <NumericFormat
                                                                    className="w-[90%] bg-transparent border-0"
                                                                    displayType="input"
                                                                    suffix=".00"
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={TotalBudget}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex border-start border-end ">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end py-1 px-3">
                                                            <strong> Actual GAD Expenditure: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.direct_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_sum)))
                                                                    .toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end border-bottom py-3 px-2">
                                                            <strong> Original Budget: </strong>
                                                        </div>
                                                        <div className="w-50 border-end border-bottom py-3 px-2">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_planned)))
                                                                    .toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-25 border-bottom"></div>
                                    </div>
                                </div>
                                <div className="w-25 border-bottom"></div>
                            </div>
                            <div className="d-flex border-start border-end border-bottom">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end h-14">
                                                        </div>
                                                        <div className="w-50 border-end h-14">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end py-1 px-3">
                                                            <strong> % Utilization of Budget: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                suffix='%'
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (((Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.direct_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_sum))) /
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_planned)))
                                                                    ) * 100).toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex border-start border-end border-bottom">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-3">
                                                            <strong> % of GAD Expenditure: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                suffix='%'
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (((Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.direct_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_sum)))
                                                                    /(Number(this.state.TotalBudget)))*100).toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table text-xs">
                                <thead>
                                    <tr>
                                        <th className="border p-2 text-center align-middle" style={{width:'2%'}}>  </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> Gender Issue/ GAD Mandate </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> Cause of Gender Issue  </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> GAD Result Statement/ GAD Objective </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> Relevant Organization MFO/PAP or PPA </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'12%'}}> GAD Activity </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> Performance Indicator/s </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'5%'}}> Actual Result (Outputs/ Outcomes) </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'9%'}}> Total Agency Approved Budget </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> Actual Cost/ Expenditure </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'7%'}}> Responsible Unit </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'5%'}}> Variance/ Remarks </th>
                                    </tr>
                                    <tr>
                                        <th className="border" >  </th>
                                        <th className="border text-center" > 1 </th>
                                        <th className="border text-center" > 2 </th>
                                        <th className="border text-center" > 3 </th>
                                        <th className="border text-center" > 4 </th>
                                        <th className="border text-center" > 5 </th>
                                        <th className="border text-center" > 6 </th>
                                        <th className="border text-center" > 7 </th>
                                        <th className="border text-center" > 8 </th>
                                        <th className="border text-center" > 9 </th>
                                        <th className="border text-center" > 10 </th>
                                        <th className="border text-center" > 11 </th>
                                    </tr> 
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={12}> CLIENT-FOCUSED ACTIVITIES </td>
                                    </tr>
                                    {PPA.filter(filter => filter.act_year == year && filter.status == "Done").map((value, ndx) => value.act_type == "Client Focused" ?
                                        <tr key={ndx}>
                                            <td className="border"> {ndx + 1} </td>
                                            <td className="border"> {value.act_gad_mandate} </td>
                                            <td className="border"> {value.act_cause_of_issue} </td>
                                            <td className="border"> {value.act_gad_objective} </td>
                                            <td className="border">
                                                {value.act_relevant_org == "PAP" ?
                                                    <div className="m-0">
                                                        <span> PAP: Development and administration of Science and Technology Scholarship </span><br/><br/>
                                                        <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                                    </div> : 
                                                    <span> MFO: Science and Technology Human Resource Development Services </span>
                                                }
                                            </td>
                                            <td className="border"> 
                                                {value.act_atitles.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_atitles.map((titles,index) => (
                                                            <li key={index}> {titles.act_title} </li>
                                                        ))}
                                                    </ol> : 
                                                    value.act_atitles.map((titles,index) => (
                                                        <div className="m-0" key={index}> {titles.act_title} </div>
                                                    ))
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_abens.map((bens,index) => (
                                                            <li key={index}> 
                                                                {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target} 
                                                            </li>
                                                        ))}
                                                    </ol> : 
                                                    value.act_abens.map((bens,index) => (
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target}
                                                        </div>
                                                    ))
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_abens.map((bens,index) => (
                                                            <li key={index}> 
                                                                {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target} 
                                                            </li>
                                                        ))}
                                                    </ol> : 
                                                    value.act_abens.map((bens,index) => (
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target}
                                                        </div>
                                                    ))
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_expense_class} <br/>
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={value.act_abudgets.planned_budget}
                                                /> <br/>
                                                {value.act_source}
                                            </td>
                                            <td className="border">
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={value.act_abudgets.actual_budget}
                                                /><br/>
                                                {value.act_source}
                                            </td>
                                            <td className="border"> {value.act_responsible_unit} </td>
                                            <td className="border"> {value.status} </td>
                                        </tr>: <tr key={ndx}></tr>
                                    )}
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={12}> ORGANIZATION-FOCUSED ACTIVITIES </td>
                                    </tr>
                                    {PPA.filter(filter => filter.act_year == year && filter.status == "Done").map((value, ndx) => value.act_type == "Organization Focused" ?
                                        <tr key={ndx}>
                                            <td className="border"> {ndx + 1} </td>
                                            <td className="border"> {value.act_gad_mandate} </td>
                                            <td className="border"> {value.act_cause_of_issue} </td>
                                            <td className="border"> {value.act_gad_objective} </td>
                                            <td className="border">
                                                {value.act_relevant_org == "PAP" ?
                                                    <div className="m-0">
                                                        <span> PAP: Development and administration of Science and Technology Scholarship </span><br/><br/>
                                                        <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                                    </div> : 
                                                    <span> MFO: Science and Technology Human Resource Development Services </span>
                                                }
                                            </td>
                                            <td className="border"> 
                                                {value.act_atitles.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_atitles.map((titles,index) => (
                                                            <li key={index}> {titles.act_title} </li>
                                                        ))}
                                                    </ol> : 
                                                    value.act_atitles.map((titles,index) => (
                                                        <div className="m-0" key={index}> {titles.act_title} </div>
                                                    ))
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_abens.map((bens,index) => (
                                                            <li key={index}> 
                                                                {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target} 
                                                            </li>
                                                        ))}
                                                    </ol> : 
                                                    value.act_abens.map((bens,index) => (
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target}
                                                        </div>
                                                    ))
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_abens.map((bens,index) => (
                                                            <li key={index}> 
                                                                {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target} 
                                                            </li>
                                                        ))}
                                                    </ol> : 
                                                    value.act_abens.map((bens,index) => (
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target}
                                                        </div>
                                                    ))
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_expense_class} <br/>
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={value.act_abudgets.planned_budget}
                                                /> <br/>
                                                {value.act_source}
                                            </td>
                                            <td className="border">
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={value.act_abudgets.actual_budget}
                                                /><br/>
                                                {value.act_source}
                                            </td>
                                            <td className="border"> {value.act_responsible_unit} </td>
                                            <td className="border"> {value.status} </td>
                                        </tr>: <tr key={ndx}></tr>
                                    )}
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={12}> ATTRIBUTED PROGRAM </td>
                                    </tr>
                                    {Attrib.map((attribs, index) =>
                                        attribs.attrib_adetails.filter(yr => yr.attrib_year == year).map(values => 
                                            <tr key={index}>
                                                <td className="border"> {index + 1} </td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border"> {attribs.attrib_title} </td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border">
                                                    {values.attrib_class} <br/>
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={values.attrib_planned_budget}
                                                    /> <br/>
                                                    {values.attrib_source}
                                                </td>
                                                <td className="border">
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={values.attrib_actual_budget}
                                                    /> <br/>
                                                    {values.attrib_source}
                                                </td>
                                                <td className="border"> {values.attrib_responsible_unit} </td>
                                                <td className="border">  </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div> :
                        <div ref={ el => (this.componentRef=el) } id='toPrint' className="p-1 text-base">
                            <div className="text-center text-xl fw-bold"> ANNUAL GENDER AND DEVELOPMENT (GAD) PLAN AND BUDGET </div>
                            <div className="text-center text-xl fw-bold"> FY {year} </div>
                            <div className="d-flex">
                                <div className="w-50 p-3 border">
                                    <strong> Organization: </strong>
                                    Science Education Institute
                                </div>
                                <div className="w-50 p-3 border border-start-0">
                                    <strong> Organization Category: </strong>
                                    National Government, Attached Agency
                                </div>
                            </div>
                            <div className="d-flex w-100 p-3 border-start border-end">
                                <strong> Organization Hierarchy: </strong> 
                                Department of Science and Technology, Science Education Institute
                            </div>
                            <div className="d-flex border">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-75">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-3">
                                                            <strong> Total Budget/GAA of Organization: </strong>
                                                        </div>
                                                        <div className="w-50 border-end py-3 px-1">
                                                            <span> ₱  </span>
                                                            {this.state.TotalBudget % 1 != 0 ?
                                                                <NumericFormat
                                                                    className="w-[90%] bg-transparent border-0"
                                                                    displayType="input"
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={this.state.TotalBudget}
                                                                /> : 
                                                                <NumericFormat
                                                                    className="w-[90%] bg-transparent border-0"
                                                                    displayType="input"
                                                                    suffix=".00"
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={this.state.TotalBudget}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex border-start border-end ">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-3">
                                                            <strong> Total GAD Budget: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_planned)))
                                                                    .toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end border-bottom p-3">
                                                            <strong> Primary Sources: </strong>
                                                        </div>
                                                        <div className="w-50 border-end border-bottom p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_planned)))
                                                                    .toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-25 border-bottom"></div>
                                    </div>
                                </div>
                                <div className="w-25 border-bottom"></div>
                            </div>
                            <div className="d-flex border-start border-end border-bottom">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end h-14">
                                                        </div>
                                                        <div className="w-50 border-end h-14">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-3">
                                                            <strong> Other Sources: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={Number(0).toFixed(2)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex border-start border-end border-bottom">
                                <div className="w-75">
                                    <div className="d-flex">
                                        <div className="w-75">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-3">
                                                            <strong> % of GAD Allocation: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                suffix='%'
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (((Number(Directbudgets.filter(dyr => dyr.act_year == year).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == year).map(val => val.attrib_planned)))
                                                                    /(Number(this.state.TotalBudget)))*100).toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="border p-2 text-center align-middle" style={{width:'5%'}}>  </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'11%'}}> Gender Issue/ GAD Mandate </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'11%'}}> Cause of Gender Issue </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'11%'}}> GAD Result Statement/ GAD Objective </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'11%'}}> Relevant Organization MFO/PAP or PPA  </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'15%'}}> GAD Activity </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'11%'}}> Performance Indicators/ Targets </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> GAD Budget </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'5%'}}> Source of Budget </th>
                                        <th className="border p-2 text-center align-middle" style={{width:'10%'}}> Responsible Unit/ Office </th>
                                    </tr>
                                    <tr>
                                        <th className="border">  </th>
                                        <th className="border text-center"> 1 </th>
                                        <th className="border text-center"> 2 </th>
                                        <th className="border text-center"> 3 </th>
                                        <th className="border text-center"> 4 </th>
                                        <th className="border text-center"> 5 </th>
                                        <th className="border text-center"> 6 </th>
                                        <th className="border text-center"> 7 </th>
                                        <th className="border text-center"> 8 </th>
                                        <th className="border text-center"> 9 </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={10}> CLIENT-FOCUSED ACTIVITIES </td>
                                    </tr>
                                    {PPA.filter(yr => yr.act_year == year).map((value,ndx) => value.act_type == "Client Focused" ?
                                        <tr key={ndx}>
                                            <td className="border"> {ndx + 1} </td>
                                            <td className="border"> {value.act_gad_mandate} </td>
                                            <td className="border"> {value.act_cause_of_issue} </td>
                                            <td className="border"> {value.act_gad_objective} </td>
                                            <td className="border">
                                                {value.act_relevant_org == "PAP" ?
                                                    <div className="m-0">
                                                        <span> PAP: Development and administration of Science and Technology Scholarship </span><br/><br/>
                                                        <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                                    </div> : 
                                                    <span> MFO: Science and Technology Human Resource Development Services </span>
                                                }
                                            </td>
                                            <td className="border"> 
                                                {value.act_atitles.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_atitles.map((titles,index) => 
                                                            <li key={index}> {titles.act_title} </li>
                                                        )}
                                                    </ol> : 
                                                    value.act_atitles.map((titles,index) => 
                                                        <div className="m-0" key={index}> {titles.act_title} </div>
                                                    )
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_abens.map((bens,index) => 
                                                            <li key={index}> 
                                                                {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target} 
                                                            </li>
                                                        )}
                                                    </ol> : 
                                                    value.act_abens.map((bens,index) => 
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target}
                                                        </div>
                                                    )
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_expense_class} <br/>
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={value.act_abudgets.planned_budget}
                                                />
                                            </td>
                                            <td className="border"> {value.act_source} </td>
                                            <td className="border"> {value.act_responsible_unit} </td>
                                        </tr> : <tr key={ndx}></tr>
                                    )}
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={10}> ORGANIZATION-FOCUSED ACTIVITIES </td>
                                    </tr>
                                    {PPA.filter(yr => yr.act_year == year).map((value,ndx) => value.act_type == "Organization Focused" ?
                                        <tr key={ndx}>
                                            <td className="border"> {ndx + 1} </td>
                                            <td className="border"> {value.act_gad_mandate} </td>
                                            <td className="border"> {value.act_cause_of_issue} </td>
                                            <td className="border"> {value.act_gad_objective} </td>
                                            <td className="border">
                                                {value.act_relevant_org == "PAP" ?
                                                    <div className="m-0">
                                                        <span> PAP: Development and administration of Science and Technology Scholarship </span><br/><br/>
                                                        <span> PAP: Research, Promotion and Development of Science and Technology </span>
                                                    </div> : 
                                                    <span> MFO: Science and Technology Human Resource Development Services </span>
                                                }
                                            </td>
                                            <td className="border"> 
                                                {value.act_atitles.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_atitles.map((titles,index) => 
                                                            <li key={index}> {titles.act_title} </li>
                                                        )}
                                                    </ol> : 
                                                    value.act_atitles.map((titles,index) => 
                                                        <div className="m-0" key={index}> {titles.act_title} </div>
                                                    )
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <ol className="m-0">
                                                        {value.act_abens.map((bens,index) => 
                                                            <li key={index}> 
                                                                {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target} 
                                                            </li>
                                                        )}
                                                    </ol> : 
                                                    value.act_abens.map((bens,index) => 
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target}
                                                        </div>
                                                    )
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_expense_class} <br/>
                                                <NumericFormat 
                                                    type="text" 
                                                    displayType="text"
                                                    prefix='₱ '
                                                    thousandSeparator={true}
                                                    thousandsGroupStyle="thousand"
                                                    value={value.act_abudgets.planned_budget}
                                                />
                                            </td>
                                            <td className="border"> {value.act_source} </td>
                                            <td className="border"> {value.act_responsible_unit} </td>
                                        </tr> : <tr key={ndx}></tr>
                                    )}
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={10}> ATTRIBUTED PROGRAM </td>
                                    </tr>
                                    {Attrib.map((attribs, index) =>
                                        attribs.attrib_adetails.filter(yr => yr.attrib_year == year).map(values => 
                                            <tr key={index}>
                                                <td className="border"> {index + 1} </td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border"></td>
                                                <td className="border"> {attribs.attrib_title} </td>
                                                <td className="border"></td>
                                                <td className="border">
                                                    {values.attrib_class} <br/>
                                                    <NumericFormat 
                                                        type="text" 
                                                        displayType="text"
                                                        prefix='₱ '
                                                        thousandSeparator={true}
                                                        thousandsGroupStyle="thousand"
                                                        value={values.attrib_planned_budget}
                                                    />
                                                </td>
                                                <td className="border"> {values.attrib_source} </td>
                                                <td className="border"> {values.attrib_responsible_unit} </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }
                    <div className="flex justify-content-center">
                        <ReactToPrint
                            trigger={ () => {
                                return (
                                <button className="text-xl bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"> 
                                    Download/Print! 
                                </button>
                            )}}
                            content={()=>this.componentRef}
                            pageStyle='@page {
                                margin: 8mm;
                                size: landscape;
                            }'
                        />
                    </div>
                </AdminHeader>
            )
        }
    }
}

export default Reports