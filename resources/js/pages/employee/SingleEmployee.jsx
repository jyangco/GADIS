import React, { Component, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

export class SingleEmployee extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            employee: ""
        }
    }

    //getting user informations
    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        const fetchData = async() => {
            try {
                const emp_id = window.name
                const res = await axios.get(`/api/getSingleEmployee/${emp_id}`)
                this.setState({
                    employee: res.data,
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
        setTimeout(() => {
            fetchData()
        }, 5)
    }

    render() {
        const { employee, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ Employee List"}>
                    <Loader />
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ Employee List / " + employee.employee_fname + " " + employee.employee_lname}>
                <div className="hidden">
                    <ForID></ForID>
                </div>
                <Link className="back-btn text-decoration-none" to="/Employees">
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="card border-0">
                    <div className="container p-3">
                        <div className="flex justify-evenly h-[75vh]">
                            <div className="w-50 flex flex-wrap p-2 border rounded-lg shadow mx-5">
                                <div className="w-100 h-50 flex flex-wrap justify-center">
                                    <img className="w-auto h-full" src={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'}/>
                                    <span className="text-4xl font-bold w-100 text-center p-2 font-serif"> {employee.employee_fname} {employee.employee_lname} </span>
                                </div>
                                <div className="w-100 h-40">
                                    <div className="text-base font-semibold w-100 text-start px-2 py-3 font-sans"> 
                                        {
                                            employee.employee_division == "OD" ?
                                                <span> Office of the Director </span> :
                                            employee.employee_division == "FAD" ?
                                                <span> Finance and Administrative Division </span> :
                                            employee.employee_division == "STSD" ?
                                                <span> Science and Technology Scholarship Division </span> :
                                            employee.employee_division == "SEID" ?
                                                <span> Science Education and Innovations Division </span> :
                                            employee.employee_division == "STMERPD" ?
                                                <span> S&T Manpower Education Research and Promotions Division </span> : ""
                                        } 
                                    </div>
                                    <hr />
                                    <div className="text-base font-semibold w-100 text-start px-2 py-3 font-sans"> 
                                        {
                                            employee.employee_status == "COS" ?
                                                <span> Contract of Service </span> : <span> Regular </span>
                                        } 
                                    </div>
                                    <hr />
                                    <div className="text-base font-semibold w-100 text-start px-2 py-3 font-sans"> 
                                        {
                                            employee.email == null ?
                                                <span> <i className="text-red-500 fas fa-circle"></i> No GADIS account found for this Employee </span> :
                                                <span> <i className="text-green-500 fas fa-circle"></i> {employee.email} </span>
                                        } 
                                    </div>
                                </div>
                            </div>
                            <div className="w-50 flex flex-col mx-5">
                                <div className="w-100 h-auto p-2 border rounded-lg shadow mb-3">
                                    <div className="px-5 pb-3 pt-2 text-2xl font-bold">
                                        Sex & Gender
                                    </div>
                                    <hr />
                                    <div className="flex">
                                        <div className="text-xl font-semibold w-50 text-start px-2 py-3 font-sans"> 
                                            {
                                                employee.employee_sex == "Male" ?
                                                    <span> Sex: Male <i className="text-sky-500 fas fa-mars"></i> </span>  : 
                                                    <span> Sex: Female <i className="text-fuchsia-500 fas fa-venus"></i> </span>
                                            } 
                                        </div>
                                        <div className="text-xl font-semibold w-50 text-start px-2 py-3 font-sans"> 
                                            {
                                                employee.employee_gender != "" ?
                                                <span> Gender: {employee.employee_gender} <i className="text-purple fas fa-venus-mars"></i> </span> : 
                                                <span> Gender:  </span>
                                            } 
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100 h-[58vh] overflow-y-auto p-2 border rounded-lg shadow mt-3">
                                    <div className="px-5 pb-3 pt-2 text-2xl font-bold">
                                        List of Trainings Attended
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default SingleEmployee