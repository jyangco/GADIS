import React, { Component } from 'react'
import moment from 'moment/moment'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router-dom'
import CryptoJS from 'crypto-js'

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}
export class GAR extends Component {
    constructor(props){
        super(props)
        this.state = {
            filterYear: "",
            TotalBudget: "",
            percentage: "",
            report_status: "",
            id_number: "",
            years: this.props.years,
            PPA: this.props.PPA,
            Attrib: this.props.Attrib,
            Directbudgets: this.props.Directbudgets,
            Attribbudgets: this.props.Attribbudgets,
            signatories: this.props.signatories,
            user_title: this.props.user_title
        }
    }

    handleGetData = () => {
        const data = {
            report_year: this.state.filterYear,
            report_type: "GAR"
        }
        axios.post('/api/getPPAsforReport', data).then(response => {
            this.setState({
                PPA: response.data.Acts,
                Attrib: response.data.Attrib,
                TotalBudget: response.data.Details.total_budget,
                report_status: response.data.Details.status,
                id_number: response.data.Details.report_id,
            })
        })
    }

    handleChangeYear = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        setTimeout(() => {
            this.handleGetData()
        }, 5)
    }

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    
    render() {
        const { PPA, Attrib, Directbudgets, Attribbudgets, years, filterYear, loading } = this.state
        return (
            <div className="container-fluid p-0">
                <div className="card">
                    <div className="card-body">
                        <form className="createForms text-lg">
                            <div className="form-group my-3 text-center">
                                <label> Filter by Year <i className="far fa-filter mx-1"></i> </label>
                                <select
                                    name="filterYear" 
                                    className="custom-select ms-2 border border-dark outline-none"
                                    value={filterYear}
                                    onChange={this.handleChangeYear}
                                >
                                    <option className="text-center" value={""}> -- Select Value -- </option>
                                    {years.map((val,i) => 
                                        <option className="text-center" value={val} key={i}> {val} </option>
                                    )}
                                </select>
                                <div className="float-end px-2 text-white bg-primary rounded-pill">
                                    Status: {this.state.report_status}
                                </div>
                            </div>
                        </form>
                        <div ref={ el => (this.componentRef=el) } id="toPrint" className="p-1">
                            <div className="text-center fs-5 fw-bold"> ANNUAL GENDER AND DEVELOPMENT (GAD) ACCOMPLISHMENT REPORT </div>
                            <div className="text-center fs-5 fw-bold"> FY {filterYear} </div>
                            <div className="d-flex">
                                <div className="w-50 p-3 border">
                                    <strong> Reference: </strong>
                                    {this.state.id_number != "" ?
                                        <span> GADIS Generated #{this.state.id_number} - {this.state.filterYear} </span> : ""
                                    }
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
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.direct_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_sum)))
                                                                    .toFixed(2)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="d-flex">
                                                        <div className="w-50 border-end border-bottom py-1 px-3">
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
                                                                    (((Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.direct_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_sum))) /
                                                                    (Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.planned_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_planned)))
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
                                                                    (((Number(Directbudgets.filter(dyr => dyr.act_year == filterYear).map(val => val.direct_sum)) + 
                                                                    Number(Attribbudgets.filter(ayr => ayr.attrib_year == filterYear).map(val => val.attrib_sum)))
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
                                        <th className="border p-2 text-center align-middle w-[5%]" >  </th>
                                        <th className="border p-2 text-center align-middle w-[10%]" > Gender Issue/ GAD Mandate </th>
                                        <th className="border p-2 text-center align-middle w-[10%]" > Cause of Gender Issue  </th>
                                        <th className="border p-2 text-center align-middle w-[10%]" > GAD Result Statement/ GAD Objective </th>
                                        <th className="border p-2 text-center align-middle w-[10%]" > Relevant Organization MFO/PAP or PPA </th>
                                        <th className="border p-2 text-center align-middle w-[12%]" > GAD Activity </th>
                                        <th className="border p-2 text-center align-middle w-[10%]" > Performance Indicator/s </th>
                                        <th className="border p-2 text-center align-middle w-[5%]" > Actual Result (Outputs/ Outcomes) </th>
                                        <th className="border p-2 text-center align-middle w-[5%]" > Total Agency Approved Budget </th>
                                        <th className="border p-2 text-center align-middle w-[10%]" > Actual Cost/ Expenditure </th>
                                        <th className="border p-2 text-center align-middle w-[8%]" > Responsible Unit </th>
                                        <th className="border p-2 text-center align-middle w-[5%]" > Variance/ Remarks </th>
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
                                    {PPA.filter(filter => filter.act_year == filterYear && filter.status == "Done").map((value, ndx) => value.act_type == "Client Focused" ?
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
                                                                <div key={index}> {titles.act_title} </div> <br/>
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
                                                                </div> <br/>
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
                                                {value.act_abens.length > 1 ?
                                                    <div className="m-0">
                                                        {value.act_abens.map((bens,index) => 
                                                            <div className="contents">
                                                                <div key={index}> 
                                                                    {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target} 
                                                                </div> <br/>
                                                            </div>
                                                        )}
                                                    </div> : 
                                                    value.act_abens.map((bens,index) => 
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target}
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
                                    {PPA.filter(filter => filter.act_year == filterYear && filter.status == "Done").map((value, ndx) => value.act_type == "Organization Focused" ?
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
                                                                <div key={index}> {titles.act_title} </div> <br/>
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
                                                                </div> <br/>
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
                                                {value.act_abens.length > 1 ?
                                                    <div className="m-0">
                                                        {value.act_abens.map((bens,index) => 
                                                            <div className="contents" key={index}>
                                                                <div> 
                                                                    {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target} 
                                                                </div> <br/>
                                                            </div>
                                                        )}
                                                    </div> : 
                                                    value.act_abens.map((bens,index) => 
                                                        <div className="m-0" key={index}>
                                                            {bens.act_target} {bens.a_beneficiary_value} - {bens.a_beneficiary_target}
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
                                        attribs.attrib_adetails.filter(yr => yr.attrib_year == filterYear).map(values => 
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
                            {role == "admin" && this.state.filterYear.length != 0 ?
                                <div className="d-flex justify-content-center mt-5">
                                    <Link to={`/Reports/GAR/${this.state.id_number}`} state={{ id: `${this.state.id_number}` }} className="text-decoration-none bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl">
                                        Check Progress
                                    </Link>    
                                </div> : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GAR