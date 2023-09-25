import React, { Component, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link, useLocation } from 'react-router-dom'
import ReactToPrint from 'react-to-print'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'

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

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}

export class ReportSubmit extends Component {
    constructor(props){
        super(props)
        this.state = {
            filterYear: "",
            TotalBudget: "",
            report_status: "",
            notif_title: "GAD Plan and Budget Report",
            notif_body: "",
            id_number: "",
            path: "/Reports/GPB/",
            PPA: [],
            Attrib: [],
            Directbudgets: [],
            Attribbudgets: [],
            signatories: [],
            user_title: [],
            loading: true
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        // getting all activities with complete details
        const fetchData = async() => {
                const act_id = window.name
                const response = await axios.get(`/api/showGPB/${act_id}`)
                this.setState({
                    PPA: response.data.Acts,
                    Attrib: response.data.Attrib,
                    TotalBudget: response.data.Details.total_budget,
                    report_status: response.data.Details.status,
                    id_number: response.data.Details.report_id,
                    filterYear: response.data.Details.report_year,
                    loading: false
                })
            } 
        try {
            const signatories = await axios.get('/api/getSignatories')
            this.setState({
                signatories: signatories.data,
            })
            const budget = await axios.get('/api/BudgetList')
            this.setState({
                Directbudgets: budget.data.direct,
                Attribbudgets: budget.data.attrib
            })
            const res = await axios.get('/api/getTitle')
            this.setState({
                user_title: res.data,
            })
            setTimeout(() => {
                fetchData()
            }, 5)
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmitForReview = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/submitGPBForReview',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.componentDidMount()
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
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

    handleReject = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/sendRejectGPB',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.componentDidMount()
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
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

    handleSubmitForApproval = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/sendGPBForApproval',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.componentDidMount()
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
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

    handleRejectByExeCom = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/rejectGPBByExeCom',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.componentDidMount()
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
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

    handleApproved = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('notif_title', this.state.notif_title)
            newFormData.append('notif_body', this.state.notif_body)
            newFormData.append('path', this.state.path)
            newFormData.append('id_number', this.state.id_number)
        axios.post('/api/markGPBAsApproved',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.componentDidMount()
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please complete the required fields before submitting",
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
        const { PPA, Attrib, Directbudgets, signatories, user_title, report_status, Attribbudgets, years, filterYear, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ Reports / GAD Plan and Budget"}>
                    <Loader/>
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ Reports / GAD Plan and Budget"}>
                {role == "admin" ?
                    <Link className="back-btn text-decoration-none" to="/Reports">
                        <i className="far fa-arrow-left rounded-circle p-1"></i>
                        <span className="tooltip-text text-sm ms-1">back</span>
                    </Link> : ""
                }
                <div className="hidden">
                    <ForID></ForID>
                </div>
                <div className="card mt-2">
                    <div className="card-body">
                        <div ref={ el => (this.componentRef=el) } id='toPrintGPB' className="p-1 text-sm">
                            <div className="text-center text-base fw-bold"> ANNUAL GENDER AND DEVELOPMENT (GAD) PLAN AND BUDGET </div>
                            <div className="text-center text-base fw-bold"> FY {filterYear} </div>
                            <div className="d-flex">
                                <div className="w-50 p-1 border">
                                    <strong> Organization: </strong>
                                    Science Education Institute
                                </div>
                                <div className="w-50 p-1 border border-start-0">
                                    <strong> Organization Category: </strong>
                                    National Government, Attached Agency
                                </div>
                            </div>
                            <div className="d-flex w-100 p-1 border-start border-end">
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
                                                        <div className="w-50 border-end p-1">
                                                            <strong> Total Budget/GAA of Organization: </strong>
                                                        </div>
                                                        <div className="w-50 border-end py-3 px-1">
                                                            <span> ₱  </span>
                                                            {this.state.TotalBudget % 1 != 0 ?
                                                                <NumericFormat
                                                                    className="w-[90%] border-0"
                                                                    displayType="input"
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={this.state.TotalBudget}
                                                                /> : 
                                                                <NumericFormat
                                                                    className="w-[90%] border-0"
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
                                                        <div className="w-50 border-end px-3 py-1">
                                                            <strong> Total GAD Budget: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-1 py-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_planned)))
                                                                    .toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end border-bottom p-1 py-3">
                                                            <strong> Primary Sources: </strong>
                                                        </div>
                                                        <div className="w-50 border-end border-bottom p-1 py-3">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_planned)))
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
                                                        <div className="w-50 border-end h-7">
                                                        </div>
                                                        <div className="w-50 border-end h-7">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end p-1">
                                                            <strong> Other Sources: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-1">
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
                                                        <div className="w-50 border-end p-1">
                                                            <strong> % of GAD Allocation: </strong>
                                                        </div>
                                                        <div className="w-50 border-end p-1">
                                                            <NumericFormat 
                                                                type="text" 
                                                                displayType="text"
                                                                suffix='%'
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={
                                                                    (((Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_planned)))
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
                                        <th className="border p-2 text-center align-middle w-[5%]">  </th>
                                        <th className="border p-2 text-center align-middle w-[11%]"> Gender Issue/ GAD Mandate </th>
                                        <th className="border p-2 text-center align-middle w-[11%]"> Cause of Gender Issue </th>
                                        <th className="border p-2 text-center align-middle w-[11%]"> GAD Result Statement/ GAD Objective </th>
                                        <th className="border p-2 text-center align-middle w-[11%]"> Relevant Organization MFO/PAP or PPA  </th>
                                        <th className="border p-2 text-center align-middle w-[15%]"> GAD Activity </th>
                                        <th className="border p-2 text-center align-middle w-[11%]"> Performance Indicators/ Targets </th>
                                        <th className="border p-2 text-center align-middle w-[10%]"> GAD Budget </th>
                                        <th className="border p-2 text-center align-middle w-[5%]"> Source of Budget </th>
                                        <th className="border p-2 text-center align-middle w-[10%]"> Responsible Unit/ Office </th>
                                    </tr>
                                    <tr>
                                        <th className="border w-[5%]">  </th>
                                        <th className="border text-center w-[11%]"> 1 </th>
                                        <th className="border text-center w-[11%]"> 2 </th>
                                        <th className="border text-center w-[11%]"> 3 </th>
                                        <th className="border text-center w-[11%]"> 4 </th>
                                        <th className="border text-center w-[15%]"> 5 </th>
                                        <th className="border text-center w-[11%]"> 6 </th>
                                        <th className="border text-center w-[10%]"> 7 </th>
                                        <th className="border text-center w-[5%]"> 8 </th>
                                        <th className="border text-center w-[10%]"> 9 </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border text-center fw-bold" colSpan={10}> CLIENT-FOCUSED ACTIVITIES </td>
                                    </tr>
                                    {PPA.filter(yr => yr.act_year == filterYear).map((value,ndx) => value.act_type == "Client Focused" ?
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
                                                    <div className="m-0">
                                                        {value.act_atitles.map((titles,index) => 
                                                            <div className="contents">
                                                                <div key={index}> {titles.act_title} </div> <br />
                                                            </div>
                                                        )}
                                                    </div> : 
                                                    value.act_atitles.map((titles,index) => 
                                                        <div className="m-0" key={index}> {titles.act_title} </div>
                                                    )
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <div className="m-0">
                                                        {value.act_abens.map((bens,index) => 
                                                            <div className="contents" key={index}>
                                                                <div> 
                                                                    {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target} 
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div> : 
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
                                    {PPA.filter(yr => yr.act_year == filterYear).map((value,ndx) => value.act_type == "Organization Focused" ?
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
                                                    <div className="m-0">
                                                        {value.act_atitles.map((titles,index) => 
                                                            <div className="contents">
                                                                <div key={index}> {titles.act_title} </div> <br />
                                                            </div>
                                                        )}
                                                    </div> : 
                                                    value.act_atitles.map((titles,index) => 
                                                        <div className="m-0" key={index}> {titles.act_title} </div>
                                                    )
                                                }
                                            </td>
                                            <td className="border">
                                                {value.act_abens.length > 1 ?
                                                    <div className="m-0">
                                                        {value.act_abens.map((bens,index) => 
                                                            <div className="contents">
                                                                <div key={index}> 
                                                                    {bens.act_target} {bens.p_beneficiary_value} - {bens.p_beneficiary_target} 
                                                                </div> <br />
                                                            </div>
                                                        )}
                                                    </div> : 
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
                                        attribs.attrib_adetails.filter(yr => yr.attrib_year == filterYear).map(values => 
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
                            <div className="float-end">
                                Document Status: <span className="text-base text-primary"> {this.state.report_status} </span>
                            </div>
                            <div className="section text-base">
                                <div className="flex justify-content-start">
                                    Prepared by:
                                </div>
                                <div className="flex justify-content-evenly">
                                    <div className="w-25">
                                        {signatories.GAD_Secretariat}
                                        <div className="text-base"> GAD Secretariat </div>
                                    </div>
                                    <div className="w-25">
                                        {signatories.TWG_Chairperson}
                                        <div className="text-base"> GAD TWG Chairperson </div>
                                    </div>
                                </div>
                                <div className="bg-transparent h-20"></div>
                                <div className="flex justify-content-center">
                                    Approved by:
                                </div>
                                <div className="flex justify-content-center ">
                                    <div>
                                        {signatories.Executive_Committee_Chairperson}
                                        <div className="text-base"> Director, DOST-SEI </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-transparent h-20"></div>
                        {report_status == "Draft" || report_status == "For Revision"  && user_title.position_name == "GAD Secretariat" ? 
                            <form className="block" onSubmit={this.handleSubmitForReview}>
                                <div className="text-xl">
                                    <div className="form-group">
                                        <label htmlFor="title"> Subject: </label>
                                        <input className='border-b-2 w-100 outline-none'
                                            type="text" 
                                            name="notif_title" 
                                            value={this.state.notif_title}
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="body"> Content: <span className="text-danger"> *{this.state.error_list} </span> </label>
                                        <textarea className='border w-100 outline-none resize-none p-1'
                                            name="notif_body" 
                                            value={this.state.notif_body}
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-content-center mt-3">
                                    <input className=" bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"
                                        value="Submit For Review"
                                        type='submit'
                                    />
                                </div>
                            </form> : 
                        report_status == "For Review" && user_title.position_name == "TWG Chair" ? 
                            <div className="block">
                                <div className="text-xl">
                                    <div className="form-group">
                                        <label htmlFor="title"> Subject: </label>
                                        <input className='border-b-2 w-100 outline-none'
                                            type="text" 
                                            name="notif_title" 
                                            value={this.state.notif_title}
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="body"> Content: <span className="text-danger"> *{this.state.error_list} </span> </label>
                                        <textarea className='border w-100 outline-none resize-none p-1'
                                            name="notif_body" 
                                            value={this.state.notif_body}
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-content-between mt-3">
                                    <button className=" bg-red-300 px-5 py-2 hover:bg-red-500 hover:text-white hover:shadow-2xl"
                                        onClick={this.handleReject}
                                    > 
                                        Reject
                                    </button>
                                    <button className=" bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"
                                        onClick={this.handleSubmitForApproval}
                                    >
                                        Submit For Approval
                                    </button>
                                </div>
                            </div> : 
                        report_status == "For Approval" && user_title.position_name == "Executive Committee Chair" ? 
                            <div className="block">
                                <div className="text-xl">
                                    <div className="form-group">
                                        <label htmlFor="title"> Subject: </label>
                                        <input className='border-b-2 w-100 outline-none'
                                            type="text" 
                                            name="notif_title" 
                                            value={this.state.notif_title}
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="body"> Content: <span className="text-danger"> *{this.state.error_list} </span> </label>
                                        <textarea className='border w-100 outline-none resize-none p-1'
                                            name="notif_body" 
                                            value={this.state.notif_body}
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-content-between mt-3">
                                    <button className=" bg-red-300 px-5 py-2 hover:bg-red-500 hover:text-white hover:shadow-2xl"
                                        onClick={this.handleRejectByExeCom}
                                    > 
                                        Reject
                                    </button>
                                    <button className=" bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl"
                                        onClick={this.handleApproved}
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div> : 
                        report_status == "Approved" && role == "admin" ? 
                            <div className="block">
                                <div className="flex justify-content-center mt-3">
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
                            </div> : ""
                        }
                    </div>
                </div>
            </Layout>
        )
    }
}

export default ReportSubmit