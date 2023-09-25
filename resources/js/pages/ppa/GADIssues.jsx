import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class GADIssues extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            isMain: true,
            show: false,
            mainIssue: "",
            activeTab: 1,
            issues: [],
            years: [],
            activities: []
        }
    }

    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        window.addEventListener('scroll', this.checkScroll)
        try {
            const response = await axios.get('/api/getIssues')
            this.setState({
                issues: response.data,
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

    componentWillUnmount(){
        window.removeEventListener('scroll', this.checkScroll)
    }

    handleSetActiveTab = (i) => {
        this.setState({
            activeTab: i
        })
    }

    handleGetPPAs = (mandate) => {
        const data = {
            mandate: mandate
        }
        axios.post('/api/getActPerMandates', data).then(response => {
            this.setState({
                activities: response.data.details,
                years: response.data.years,
                mainIssue: mandate,
                isMain: false
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    handleSetMainView = (e) => {
        e.preventDefault()
        this.setState({
            isMain: true,
            activeTab: 1
        })
    }

    checkScroll = () => {
        if (!this.state.show && window.pageYOffset > 455){
            this.setState({
                show: true
            })
        } else if (this.state.show && window.pageYOffset <= 455){
            this.setState({
                show: false
            })
        }
    }

    render() {
        const { issues, years, activities, loading, isMain, mainIssue, activeTab, show } = this.state
        if (loading) {
            return(
                <Layout title={"/ SEI GAD Issues"}>
                    <Loader />
                </Layout>
            )
        }
        if (isMain) {
            return (
                <Layout title={"/ SEI GAD Issues"}>
                    <div className="text-center text-3xl"> SEI GAD Issues </div>
                    <div className="card-body p-5 mobile-lg:!p-2">
                        <ul>
                            {issues.map((val, idx) => 
                                <li onClick={() => this.handleGetPPAs(val.act_gad_mandate)} key={idx} className='border p-2 text-xl text-info hover:bg-slate-50 hover:cursor-pointer'> 
                                    {idx+1}. <span className="ms-1"> {val.act_gad_mandate}  </span>
                                </li>
                            )}
                        </ul>
                        {/* <div className="text-right text-lg p-2"> Total: {issues.length} </div> */}
                    </div>
                </Layout>
            )
        } else {
            return(
                <Layout title={"/ SEI GAD Issues"}>
                    <div className="text-center text-3xl"> SEI GAD Issues </div>
                    <div className="back-btn text-decoration-none" onClick={this.handleSetMainView} >
                        <i className="far fa-arrow-left rounded-circle p-1"></i>
                        <span className="tooltip-text text-sm ms-1">back</span>
                    </div>
                    <div className="card-body p-5 mobile-lg:!p-2">
                        <div className="text-center text-3xl mobile-lg:!text-2xl"> {mainIssue} </div>
                        <div className="mt-10">
                            <div className="d-flex">
                                <div className="w-25">
                                    <div className={ show ? "sticky top-20 mobile-lg:!top-40 row justify-content-center bg-white" : "d-none" } >
                                        <div className="bg-lightpurple p-3 mobile-lg:!p-2 text-center rounded-full text-white inline-block my-2 text-5xl mobile-lg:!text-3xl w-75" > 
                                            {activities[activeTab-1][0].act_year}
                                        </div> <div className="triangle mobile-lg:!hidden"></div>
                                    </div>
                                    {years.length == 0 ? "" : 
                                        years.map((yr, idx) => 
                                        <div className="row justify-content-center" key={idx}>
                                            {activeTab == (idx+1) ? 
                                                <div className="contents">
                                                    <div className="bg-lightpurple p-3 mobile-lg:!p-2 text-center rounded-full text-white inline-block my-2 text-5xl mobile-lg:!text-3xl w-75" > 
                                                        {yr} 
                                                    </div> <div className="triangle mobile-lg:!hidden"></div>
                                                </div> :
                                                <div onClick={() => this.handleSetActiveTab(idx+1)} className="bg-white border border-lightpurple my-2 w-75 p-3 rounded-full inline-block text-xl mobile-lg:!text-lg" > 
                                                    {yr} 
                                                </div> 
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className="w-75 border-2 border-lightpurple m-2 p-2">
                                    <div className="contents">
                                        {activities[activeTab-1].map((acts, ndx) =>
                                            <div className="contents" key={ndx}>
                                                <table className="table text-xl">
                                                    <tbody>
                                                        <tr>
                                                            <td className='border' colSpan={3}>
                                                                <span className="italic"> CAUSE OF GENDER ISSUE: </span> <div className="ms-5 fw-bold"> {acts.act_cause_of_issue} </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className='border' colSpan={3}>
                                                                <span className="italic"> GAD OBJECTIVE: </span> <div className="ms-5 fw-bold"> {acts.act_gad_objective} </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='border text-center text-2xl' colSpan={3}>
                                                                GAD ACTIVITY(IES)
                                                            </th>
                                                        </tr>
                                                        {acts.act_atitles.map((title, tIndex) =>
                                                            <tr key={tIndex}>
                                                                <td className='border' colSpan={3}>
                                                                    <span className="italic"> TITLE: </span> <div className="ms-5 fw-bold"> {title.act_title} </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr>
                                                            <th className='border text-center text-2xl' colSpan={3}>
                                                                BENEFICIARIES
                                                            </th>
                                                        </tr>
                                                        <tr className="mobile-lg:!hidden">
                                                            <th className="border text-center align-middle" style={{width:'33%'}}> PERFORMANCE INDICATORS/ TARGETS </th>
                                                            <th className="border text-center align-middle" style={{width:'33%'}}> ACTUAL RESULTS </th>
                                                            <th className="border text-center align-middle" style={{width:'33%'}}> REMARKS </th>
                                                        </tr>
                                                        {acts.act_abens.map((ben, bIndex) => 
                                                            <tr key={bIndex}>
                                                                <td className="border mobile-lg:!hidden" style={{width:'33%'}}> {ben.act_target} - {ben.p_beneficiary_value} {ben.p_beneficiary_target} </td>
                                                                <td className="border mobile-lg:!hidden" style={{width:'33%'}}> {ben.a_beneficiary_value} {ben.a_beneficiary_target} </td>
                                                                <td className="border mobile-lg:!hidden" style={{width:'33%'}}> 
                                                                    {(Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value) < 0 ?
                                                                        <div className="contents">
                                                                            <span className="text-danger">
                                                                                {Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value)}
                                                                            </span> Difference between Actual Result and Performance Indicator
                                                                        </div> : 
                                                                        Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value) == 0 ?
                                                                        <span>
                                                                            {Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value)} Difference between Actual Result and Performance Indicator
                                                                        </span> : 
                                                                        <div className="contents">
                                                                            <span className="text-success">
                                                                                +{Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value)}
                                                                            </span> Difference between Actual Result and Performance Indicator
                                                                        </div>
                                                                    )} 
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {acts.act_abens.map((ben, bIndex) => 
                                                            <tr className='hidden mobile-lg:!block' key={bIndex}>
                                                                <td className='border' colSpan={3}>
                                                                    <span className="italic"> PERFORMANCE INDICATORS/ TARGETS: </span> <div className="ms-5 fw-bold"> {ben.act_target} - {ben.p_beneficiary_value} {ben.p_beneficiary_target} </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {acts.act_abens.map((ben, bIndex) => 
                                                            <tr className='hidden mobile-lg:!block' key={bIndex}>
                                                                <td className='border' colSpan={3}>
                                                                    <span className="italic"> ACTUAL RESULTS: </span> <div className="ms-5 fw-bold"> {ben.a_beneficiary_value} {ben.a_beneficiary_target} </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {acts.act_abens.map((ben, bIndex) => 
                                                            <tr className='hidden mobile-lg:!block' key={bIndex}>
                                                                <td className='border' colSpan={3}>
                                                                    <span className="italic"> REMARKS: </span> <div className="ms-5 fw-bold">
                                                                        {(Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value) < 0 ?
                                                                            <div className="contents">
                                                                                <span className="text-danger">
                                                                                    {Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value)}
                                                                                </span> Difference between Actual Result and Performance Indicator
                                                                            </div> : 
                                                                            Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value) == 0 ?
                                                                            <span>
                                                                                {Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value)} Difference between Actual Result and Performance Indicator
                                                                            </span> : 
                                                                            <div className="contents">
                                                                                <span className="text-success">
                                                                                    +{Number(ben.a_beneficiary_value) - Number(ben.p_beneficiary_value)}
                                                                                </span> Difference between Actual Result and Performance Indicator
                                                                            </div>
                                                                        )} 
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                                <div className="text-center text-lg"> {ndx+1} </div>
                                                <hr className="my-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
    }
}

export default GADIssues