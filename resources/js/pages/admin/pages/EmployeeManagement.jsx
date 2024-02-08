import React, { Component } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

export class EmployeeManagement extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            formPart: "one",
            employees: [],
            employee_id: "",
            employee_fname: "",
            employee_lname: "",
            employee_division: "",
            employee_sex: "",
            employee_status: "",
            employee_gender: "",
        }
    }

    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        setTimeout(() => {
            this.fetchData()
        }, 5)
    }

    handleChangeFormTwo = (e) => {
        this.fetchSingleData(e)
        this.setState({
            formPart: "two",
        })
    }

    handleChangeFormThree = (e) => {
        e.preventDefault()
        this.setState({
            formPart: "three",
        })
    }

    fetchData = async() => {
        try {
            const result = await axios.get('/api/getEmployees')
            this.setState({
                employees: result.data,
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

    fetchSingleData = async(el) => {
        try {
            const id = el
            const result = await axios.get(`/api/getSingleEmployee/${id}`)
            this.setState({
                employee_id: result.data.employee_id,
                employee_fname: result.data.employee_fname,
                employee_lname: result.data.employee_lname,
                employee_division: result.data.employee_division,
                employee_sex: result.data.employee_sex,
                employee_status: result.data.employee_status,
                employee_gender: result.data.employee_gender,
            })
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    handleClearForm = (e) => {
        e.preventDefault()
        this.setState({
            formPart: "one",
            employee: {}
        })
    }

    handleFieldChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleUpdateEmployee = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('employee_id', this.state.employee_id)
            newFormData.append('employee_fname', this.state.employee_fname)
            newFormData.append('employee_lname', this.state.employee_lname)
            newFormData.append('employee_division', this.state.employee_division)
            newFormData.append('employee_sex', this.state.employee_sex)
            newFormData.append('employee_status', this.state.employee_status)
            newFormData.append('employee_gender', this.state.employee_gender)
        axios.post('/api/updateEmployee',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    formPart: "one",
                    employee_id: "",
                    employee_fname: "",
                    employee_lname: "",
                    employee_division: "",
                    employee_sex: "",
                    employee_status: "",
                    employee_gender: "",
                })
                this.fetchData()
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else {
                Swal.fire({
                    icon: "error",
                    text: (response.data.validation_errors),
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

    handleSaveEmployee = (e) => {
        e.preventDefault()
        const data = {
            employee_fname: this.state.employee_fname,
            employee_lname: this.state.employee_lname,
            employee_division: this.state.employee_division,
            employee_sex: this.state.employee_sex,
            employee_status: this.state.employee_status,
            employee_gender: this.state.employee_gender,
        }
        axios.post(`/api/newEmployee`, data)
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    formPart: "one",
                    employee_fname: "",
                    employee_lname: "",
                    employee_division: "",
                    employee_sex: "",
                    employee_status: "",
                    employee_gender: "",
                })
                this.fetchData()
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else {
                Swal.fire({
                    icon: "error",
                    text: (response.data.validation_errors),
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
        const { loading, formPart, employees } = this.state
        const divisions = ['OD', 'FAD', 'STSD', 'SEID', 'STMERPD'] // add here
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader />
                </AdminHeader>
            )
        }
        return (
            <AdminHeader>
                <div className="text-center text-3xl"> Employee Management </div>
                {formPart == "one" ? 
                    <div className="contents">
                        <div className='flex justify-end'>
                            <div onClick={this.handleChangeFormThree} className="btn-add border-2 border-sky-600 rounded-lg py-1 px-2">
                                <i className="far fa-user-plus text-sky-600"></i>
                            </div>
                        </div>
                        <div className="h-[64vh] overflow-y-auto">
                            <table className="w-100">
                                <thead className='text-xl bg-purple text-white sticky top-0'>
                                    <tr>
                                        <th className="border p-2 w-[5%] text-center"> # </th>
                                        <th className="border p-2 w-[40%] text-center"> Name </th>
                                        <th className="border p-2 w-[15%] text-center"> Division </th>
                                        <th className="border p-2 w-[15%] text-center"> Status </th>
                                        <th className="border p-2 w-[15%] text-center"> Sex </th>
                                        <th className="border p-2 w-[10%] text-center"> Action </th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {employees.map((val, ndx) => 
                                        <tr key={ndx} className='hover:bg-slate-200 hover:cursor-pointer'>
                                            <td className="border p-1 text-center w-[5%]"> {ndx + 1} </td>
                                            <td className="border p-1 text-start w-[40%]">
                                                {val.user_id == null ? 
                                                    <span> <i className="fas fa-user text-red-500 me-2"></i> {val.employee_lname}, {val.employee_fname}  </span> : 
                                                    <span> <i className="fas fa-user text-green-500 me-2"></i> {val.employee_lname}, {val.employee_fname}  </span>
                                                } 
                                            </td>
                                            <td className="border p-1 text-start w-[15%]"> {val.employee_division} </td>
                                            <td className="border p-1 text-start w-[15%]"> {val.employee_status} </td>
                                            <td className="border p-1 text-start w-[15%]"> {val.employee_sex} </td>
                                            <td className="border p-1 text-start w-[10%]">
                                                <div className="flex justify-evenly">
                                                    <div onClick={()=>this.handleChangeFormTwo(val.employee_id)} className="btn-edt border-2 border-green-600 rounded-lg py-1 px-2">
                                                        <i className="fas fa-edit text-green-600"></i>
                                                    </div>
                                                    <div className="btn-add border-2 border-sky-600 rounded-lg py-1 px-2">
                                                        <i className="fas fa-external-link text-sky-600"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div> : 
                    formPart == "two" ? 
                    <div className="contents">
                        <div className='flex justify-end'>
                            <div onClick={this.handleClearForm} className="btn-cnl border-2 border-red-600 rounded-lg py-1 px-2">
                                <i className="far fa-times text-sm text-red-600"></i>
                            </div>
                        </div>
                        <div className="container mx-auto w-100 p-0 border my-3">
                            <div className="card border-0 bg-transparent">
                                <div className="card-header">
                                    <div className="text-center text-2xl"> Employee Details </div>
                                </div>
                                <div className="card-body">
                                    <form autoComplete="off" className="createform" onSubmit={this.handleUpdateEmployee}>
                                        <div className="text-2xl text-blue-500"> Profile </div>
                                        <div className="flex">
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="First Name"> First Name </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.employee_fname}
                                                    type="text" 
                                                    name="employee_fname"
                                                    className="form-control" 
                                                />
                                            </div>
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="Last Name"> Last Name </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.employee_lname}
                                                    type="text" 
                                                    name="employee_lname"
                                                    className="form-control" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Division"> Division </label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.employee_division}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="employee_division"
                                                >
                                                    {divisions.map((val,ndx) => 
                                                        <option key={ndx} value={val}> {val} </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Status"> Employment Status</label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.employee_status}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="employee_status"
                                                >
                                                    <option value="COS"> COS </option>
                                                    <option value="Regular"> Regular </option>
                                                </select>
                                            </div>
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Sex"> Sex </label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.employee_sex}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="employee_sex"
                                                >
                                                    <option value="Male"> Male </option>
                                                    <option value="Female"> Female </option>
                                                </select>
                                            </div>
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Gender"> Gender </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.employee_gender}
                                                    type="text" 
                                                    name="employee_gender"
                                                    className="form-control" 
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-center mt-3">
                                            <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Update"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div> : 
                    <div className="contents">
                        <div className='flex justify-end'>
                            <div onClick={this.handleClearForm} className="btn-cnl border-2 border-red-600 rounded-lg py-1 px-2">
                                <i className="far fa-times text-sm text-red-600"></i>
                            </div>
                        </div>
                        <div className="container mx-auto w-100 p-0 border my-3">
                            <div className="card border-0 bg-transparent">
                                <div className="card-header">
                                    <div className="text-center text-2xl"> Employee Details </div>
                                </div>
                                <div className="card-body">
                                    <form autoComplete="off" className="createform" onSubmit={this.handleSaveEmployee}>
                                        <div className="text-2xl text-blue-500"> Profile </div>
                                        <div className="flex">
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="First Name"> First Name </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    type="text" 
                                                    name="employee_fname"
                                                    className="form-control" 
                                                />
                                            </div>
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="Last Name"> Last Name </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    type="text" 
                                                    name="employee_lname"
                                                    className="form-control" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Division"> Division </label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="employee_division"
                                                >
                                                    <option className='text-center' value={""}> --SELECT OPTION-- </option>
                                                    {divisions.map((val,ndx) => 
                                                        <option key={ndx} value={val}> {val} </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Status"> Employment Status</label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="employee_status"
                                                >
                                                    <option className='text-center' value={""}> --SELECT OPTION-- </option>
                                                    <option value="COS"> COS </option>
                                                    <option value="Regular"> Regular </option>
                                                </select>
                                            </div>
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Sex"> Sex </label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="employee_sex"
                                                >
                                                    <option className='text-center' value={""}> --SELECT OPTION-- </option>
                                                    <option value="Male"> Male </option>
                                                    <option value="Female"> Female </option>
                                                </select>
                                            </div>
                                            <div className="form-group w-25 px-2">
                                                <label className='text-lg' htmlFor="Gender"> Gender </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    type="text" 
                                                    name="employee_gender"
                                                    className="form-control" 
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-center mt-3">
                                            <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Save"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </AdminHeader>
        )
    }
}

export default EmployeeManagement