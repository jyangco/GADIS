import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class EmployeeList extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            employees: [],
            nameInput: "",
            sexInput: "Any",
            divisionInput: "Any",
            statusInput: "Any",
            searchResult: []
        }
    }

    //getting user informations
    async componentDidMount(){
        const { divisionInput, sexInput, statusInput } = this.state
        try {
            const response = await axios.get('/api/getEmployeeNames')
            this.setState({
                employees: response.data,
                loading: false
            })
            if (divisionInput == "Any" && sexInput == "Any" && statusInput == "Any") {
                this.setState({
                    searchResult: response.data
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

    //search bar
    handleSearch = (e) => {
        e.preventDefault()
        setTimeout(() => {
            this.setState({
                searchResult: this.state.employees.filter(
                    emp => emp.employee_fname.toLowerCase().includes(this.state.nameInput.toLowerCase()) ||
                    emp.employee_lname.toLowerCase().includes(this.state.nameInput.toLowerCase()) ||
                    emp.employee_fname.toLowerCase() + " " + emp.employee_lname.toLowerCase() == this.state.nameInput.toLowerCase() ||
                    emp.employee_lname.toLowerCase() + " " + emp.employee_fname.toLowerCase() == this.state.nameInput.toLowerCase()
                )
            })
        }, 5)
    } 

    //clear search
    handleClear = (e) => {
        e.preventDefault()
        this.setState({
            searchResult: this.state.employees,
            nameInput: "",
            sexInput: "Any",
            divisionInput: "Any",
            statusInput: "Any",
        })
    } 

    //for filters
    handleFilter = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        setTimeout(() => {
            switch (true) {
                case ((this.state.divisionInput === "Any") && (this.state.sexInput === "Any")):
                    setTimeout(() => {
                        this.setState({
                            searchResult: this.state.employees.filter(
                                emp => emp.employee_status === this.state.statusInput
                            )
                        })
                    }, 5)
                    break
                case ((this.state.statusInput === "Any") && (this.state.sexInput === "Any")):
                    setTimeout(() => {
                        this.setState({
                            searchResult: this.state.employees.filter(
                                emp => emp.employee_division === this.state.divisionInput
                            )
                        })
                    }, 5)
                    break
                case ((this.state.divisionInput === "Any") && (this.state.statusInput === "Any")):
                    setTimeout(() => {
                        this.setState({
                            searchResult: this.state.employees.filter(
                                emp => emp.employee_sex === this.state.sexInput
                            )
                        })
                    }, 5)
                    break
                case ((this.state.divisionInput !== "Any") && (this.state.statusInput !== "Any")):
                    setTimeout(() => {
                        this.setState({
                            searchResult: this.state.employees.filter(
                                emp => emp.employee_status === this.state.statusInput &&
                                emp.employee_division === this.state.divisionInput
                                
                            )
                        })
                    }, 5)
                    break
                case ((this.state.sexInput !== "Any") && (this.state.statusInput !== "Any")):
                    setTimeout(() => {
                        this.setState({
                            searchResult: this.state.employees.filter(
                                emp => emp.employee_sex === this.state.sexInput &&
                                emp.employee_status === this.state.statusInput
                                
                            )
                        })
                    }, 5)
                    break
                case ((this.state.sexInput !== "Any") && (this.state.divisionInput !== "Any")):
                    setTimeout(() => {
                        this.setState({
                            searchResult: this.state.employees.filter(
                                emp => emp.employee_sex === this.state.sexInput &&
                                emp.employee_division === this.state.divisionInput
                                
                            )
                        })
                    }, 5)
                    break
                default:
                break
            }
            if (this.state.sexInput != "Any" && this.state.divisionInput != "Any" && this.state.statusInput != "Any"){
                setTimeout(() => {
                    this.setState({
                        searchResult: this.state.employees.filter(
                            emp => emp.employee_sex === this.state.sexInput &&
                            emp.employee_division === this.state.divisionInput &&
                            emp.employee_status === this.state.statusInput
                            
                        )
                    })
                }, 5)
            } else if (this.state.sexInput == "Any" && this.state.divisionInput == "Any" && this.state.statusInput == "Any") {
                setTimeout(() => {
                    this.setState({
                        searchResult: this.state.employees
                    })
                }, 5)
            }
        }, 5)
    }

    render() {
        const { loading, employees, searchResult, nameInput } = this.state
        if (loading) {
            return(
                <Layout title={"/ Employee List"}>
                    <Loader />
                </Layout>
            )
        }
        var view = ""
        if (searchResult == "" && nameInput.length == 0) {
            view = (
                <tbody className="text-lg">
                    {employees.map((val,ndx) => 
                        <tr key={ndx} className='hover:bg-slate-200 hover:cursor-pointer'>
                            <td className="border text-center p-1 w-[5%]"> {ndx+1} </td>
                            <td className="border text-start p-1 w-[35%]"> {val.employee_lname}, {val.employee_fname} </td>
                            <td className="border text-start p-1 w-[25%]"> {val.employee_status} </td>
                            <td className="border text-start p-1 w-[15%]"> {val.employee_division} </td>
                            <td className="border text-start p-1 w-[10%]"> {val.employee_sex} </td>
                            <td className="border text-start w-[10%] px-5">
                                <Link 
                                    className="text-dark text-decoration-none" 
                                    to={`/Employees/${val.employee_id}`} state={{ id: `${val.employee_id}` }}
                                >
                                    <button className="btn text-lg bg-success">
                                        <i className="fas fa-eye text-white"></i>
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            )
        } else if (nameInput.length != 0 && searchResult == "") {
            view = (
                <tbody className="text-lg">
                    <tr className='hover:cursor-pointer'>
                        <td className="border text-center p-5 text-4xl" colSpan={6}> NO MATCH FOUND </td>
                    </tr>
                </tbody>
            )
        } else {
            view = (
                <tbody className="text-lg">
                    {searchResult.map((val,ndx) => 
                        <tr key={ndx} className='hover:bg-slate-200 hover:cursor-pointer'>
                            <td className="border text-center p-1 w-[5%]"> {ndx+1} </td>
                            <td className="border text-start p-1 w-[35%]"> {val.employee_lname}, {val.employee_fname} </td>
                            <td className="border text-start p-1 w-[25%]"> {val.employee_status} </td>
                            <td className="border text-start p-1 w-[15%]"> {val.employee_division} </td>
                            <td className="border text-start p-1 w-[10%]"> {val.employee_sex} </td>
                            <td className="border text-start w-[10%] px-5"> 
                                <Link 
                                    className="text-dark text-decoration-none" 
                                    to={`/Employees/${val.employee_id}`} state={{ id: `${val.employee_id}` }}
                                >
                                    <button className="btn text-lg bg-success">
                                        <i className="fas fa-eye text-white"></i>
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            )
        }
        return (
            <Layout title={"/ Employee List"}>
                <div className="w-100 flex justify-between pb-3 pe-5 mobile-lg:flex-wrap mobile-lg:!pe-0">
                    <div className="mobile-lg:w-[100%] w-[40%] p-1 flex">
                        <button className='rounded-l-lg bg-slate-300 text-lg px-2' onClick={this.handleClear}>
                            <i className="far fa-sync"></i>
                        </button>
                        <input
                            className='border w-[90%] outline-none px-1 text-lg'
                            type="text"
                            placeholder='Search ... '
                            value={nameInput}
                            onChange={(e) => this.setState({nameInput: e.target.value.toLowerCase()}) }
                        />
                        <button className='rounded-r-lg bg-slate-300 text-lg px-2' onClick={this.handleSearch}>
                            <i className="far fa-search"></i>
                        </button>
                    </div>
                    <div className="w-auto p-2 flex mobile-lg:!w-[100%]"> 
                        Status <i className="far fa-filter p-1"></i>
                        <select 
                            name="statusInput"
                            value={this.state.statusInput}
                            onChange={this.handleFilter}
                            className='custom-select w-100 border rounded text-base outline-none'
                        >
                            <option value="Any"> Any </option>
                            <option value="Regular"> Regular </option>
                            <option value="COS"> COS </option>
                        </select>
                    </div>
                    <div className="w-auto p-2 flex mobile-lg:!w-[100%]"> 
                        Division <i className="far fa-filter p-1"></i>
                        <select 
                            name="divisionInput"
                            value={this.state.divisionInput}
                            onChange={this.handleFilter}
                            className='custom-select w-100 border rounded text-base outline-none'
                        >
                            <option value="Any"> Any </option>
                            <option value="OD"> OD </option>
                            <option value="STSD"> STSD </option>
                            <option value="SEID"> SEID </option>
                            <option value="FAD"> FAD </option>
                            <option value="STMERPD"> STMERPD </option>
                        </select>
                    </div>
                    <div className="w-auto p-2 flex mobile-lg:!w-[100%]"> 
                        Sex <i className="far fa-filter p-1"></i>
                        <select 
                            name="sexInput"
                            value={this.state.sexInput}
                            onChange={this.handleFilter}
                            className='custom-select w-100 border rounded text-base outline-none'
                        >
                            <option value="Any"> Any </option>
                            <option value="Male"> Male </option>
                            <option value="Female"> Female </option>
                        </select>
                    </div>
                </div>
                <div className="h-[75vh] overflow-y-auto mobile-lg:!h-[50vh] mobile-lg:!overflow-x-hidden">
                    <table className="w-100 mobile-lg:!scale-x-[0.55] mobile-lg:!w-fit">
                        <thead className='text-xl bg-purple text-white sticky top-0'>
                            <tr>
                                <th className="border p-2 text-center w-[5%]"> # </th>
                                <th className="border p-2 text-center w-[35%]"> NAME </th>
                                <th className="border p-2 text-center w-[25%]"> EMPLOYMENT STATUS </th>
                                <th className="border p-2 text-center w-[15%]"> DIVISION </th>
                                <th className="border p-2 text-center w-[10%]"> SEX </th>
                                <th className="border p-2 text-center w-[10%]"> ACTION </th>
                            </tr>
                        </thead>
                        {view}
                    </table>
                </div>
            </Layout>
        )
    }
}

export default EmployeeList