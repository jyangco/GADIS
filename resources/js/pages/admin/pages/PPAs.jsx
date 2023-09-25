import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

export class PPAs extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            PPAs: [],
            years: [],
            filterYear: ""
        }
    }

    async componentDidMount() {
        try {
            const response = await axios.get('/api/getActivities')
            this.setState({
                PPAs: response.data,
            })
            const years = await axios.get('/api/getYears')
            this.setState({
                years: years.data,
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

    //Changing of year for filter
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        setTimeout(() => {
            this.handleChangeData()
        }, 5)
    }

    //Change displayed data
    handleChangeData = () => {
        const data = {
            filterYear: this.state.filterYear
        }
        axios.post('/api/getPPAperYear', data).then(response => {
            this.setState({
                PPAs: response.data,
            })
        })
    }

    render() {
        const { loading, years, PPAs } = this.state
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader />
                </AdminHeader>
            )
        }
        return (
            <AdminHeader>
                <div className="text-center text-3xl"> GAD PPAs </div>
                <div className="min-h-[50vh]">
                    <div className="form-group my-3 text-lg">
                        <label> Filter by Year <i className="far fa-filter mx-1"></i> </label>
                        <select
                            name="filterYear" 
                            className="custom-select ms-2 border border-dark outline-none"
                            value={this.state.filterYear}
                            onChange={this.handleFieldChange}
                        >
                            <option className="text-center"> -- Select Value -- </option>
                            <option className="text-center" value={"all"} > All </option>
                            {years.map((val,i) => 
                                <option className="text-center" value={val} key={i}> {val} </option>
                            )}
                        </select>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between my-3">
                        {PPAs.length == 0 ? "" :
                            PPAs.map((act,i) => 
                            <div className="w-50 text-xl p-3" key={i}>
                                <div id="ppaContainer" className="position-relative p-3">
                                    <Link className="text-dark text-decoration-none"
                                        to={`/Admin/PPAs/${act.act_id}`} state={{ id: `${act.act_id}` }}
                                    >
                                        <div className="pill position-absolute top-0 start-100 translate-middle p-2 text-base rounded-pill border"> {i + 1} </div>
                                        <div className="text-center m-0 text-3xl"> FY {act.act_year} </div>
                                        <div className="m-0"> <strong> GAD Activity: </strong> 
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
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminHeader>
        )
    }
}

export default PPAs