import React, { Component } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

export class UserManagement extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            formPart: "one",
            users: [],
            positions: [],
            employees: [],
            emp_id: "",
            emp_name: "",
            emp_email: "",
            emp_role: "",
            emp_position: "",
            twg: false,
            password: "password"
        }
    }

    fetchData = async() => {
        try {
            const result1 = await axios.get(`/api/getUsers`)
            this.setState({
                users: result1.data.users,
                positions: result1.data.positions
            })
            const result2 = await axios.get(`/api/getEmployeeWithoutAccnt`)
            this.setState({
                employees: result2.data,
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
            const result = await axios.get(`/api/getSingleUser/${id}`)
            this.setState({
                emp_id: result.data.id,
                emp_name: result.data.name,
                emp_email: result.data.email,
                emp_role: result.data.user_role,
                emp_position: result.data.position_id,
                twg: result.data.isTWG,
            })
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    handleUpdateUser = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
            newFormData.append('emp_id', this.state.emp_id)
            newFormData.append('emp_email', this.state.emp_email)
            newFormData.append('emp_role', this.state.emp_role)
            newFormData.append('emp_position', this.state.emp_position)
            newFormData.append('twg', this.state.twg)
        axios.post('/api/updateUser',(newFormData))
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                this.setState({
                    formPart: "one",
                    emp_id: "",
                    emp_name: "",
                    emp_email: "",
                    emp_role: "",
                    emp_position: "",
                    twg: false
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

    handleDelete = (id) => {
        const user_id = id
        Swal.fire({
            allowOutsideClick: false,
            title: "You are about to delete this user",
            text: "This process cannot be reversed, Do you wish to proceed?",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Yes',
        })
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/deleteUser/${user_id}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire("Success", res.data.message, "success")
                        this.fetchData()
                    } 
                })
            }
        })
    }

    handleResetPassword = (e) => {
        e.preventDefault()
        const newFormData = new FormData()
        newFormData.append('id', this.state.emp_id)
        Swal.fire({
            allowOutsideClick: false,
            title: "Reset Password",
            text: "Do you wish to proceed?",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Yes',
        })
        .then((result) => {
            if (result.isConfirmed) {
                axios.post('/api/resetUserPassword',(newFormData))
                .then(response => {
                    if (response.data.status == 200) {
                        Swal.fire("Success", response.data.message, "success")
                        this.setState({
                            formPart: "one",
                            emp_id: "",
                            emp_name: "",
                            emp_email: "",
                            emp_role: "",
                            emp_position: "",
                            twg: false
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

    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        setTimeout(() => {
            this.fetchData()
        }, 5)
    }

    handleChangeForm = (e) => {
        this.fetchSingleData(e)
        this.setState({
            formPart: "two",
        })
    }

    handleChangeForm2 = (e) => {
        e.preventDefault()
        this.setState({
            formPart: "three"
        })
    }

    handleClearForm = (e) => {
        e.preventDefault()
        this.setState({
            formPart: "one",
            emp_id: "",
            emp_name: "",
            emp_email: "",
            emp_role: "",
            emp_position: "",
            twg: false
        })
    }

    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    str2bool = (value) => {
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") return true
            if (value.toLowerCase() === "false") return false
        }
        return value
    }

    handleChangeRB = (event) => {
        const target = event.target
        if (target.checked) {
            this.setState({
                twg: this.str2bool(target.value)
            })
        }
    }

    handleSelectName = (event) => {
        this.setState({
            emp_name: event.target.options[event.target.options.selectedIndex].text,
            emp_id: event.target.value
        })
    }

    handleSaveUser = (e) => {
        e.preventDefault()
        const data = {
            emp_id: this.state.emp_id,
            emp_name: this.state.emp_name,
            emp_email: this.state.emp_email,
            emp_role: this.state.emp_role,
            emp_position: this.state.emp_position,
            twg: this.state.twg
        }
        axios.post(`/api/newUser`, data)
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire(response.data.message, "User registered", "success")
                this.setState({
                    formPart: "one",
                    emp_id: "",
                    emp_name: "",
                    emp_email: "",
                    emp_role: "",
                    emp_position: "",
                    twg: false
                })
                this.fetchData()
            } else if (response.data.status == 400) {
                Swal.fire("Warning", "Please complete the required fields before submitting", "warning")
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
        const { loading, users, positions, employees, formPart } = this.state
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader />
                </AdminHeader>
            )
        }
        return (
            <AdminHeader>
                <div className="text-center text-3xl"> User Management </div>
                {formPart == "one" ? 
                    <div className="contents">
                        <div className='flex justify-end'>
                            <div onClick={this.handleChangeForm2} className="btn-add border-2 border-sky-600 rounded-lg py-1 px-2">
                                <i className="far fa-user-plus text-sky-600"></i>
                            </div>
                        </div>
                        <div className="h-[64vh] overflow-y-auto">
                            <table className="w-100">
                                <thead className='text-xl bg-purple text-white sticky top-0'>
                                    <tr>
                                        <th className="border p-2 w-[5%] text-center"> # </th>
                                        <th className="border p-2 w-[28%] text-center"> Name </th>
                                        <th className="border p-2 w-[28%] text-center"> Email </th>
                                        <th className="border p-2 w-[29%] text-center"> Role </th>
                                        <th className="border p-2 w-[10%] text-center"> Actions </th>
                                    </tr>
                                </thead>
                                <tbody className='text-lg'>
                                    {users.map((val,ndx) => 
                                        <tr key={ndx} className='hover:bg-slate-200 hover:cursor-pointer'>
                                            <td className="border p-1 w-[5%] text-center"> {ndx+1} </td>
                                            <td className="border p-2 w-[28%] text-start"> {val.name} </td>
                                            <td className="border p-2 w-[28%] text-start"> {val.email} </td>
                                            <td className="border p-2 w-[29%] text-start"> 
                                                {val.position_name == "TWG Member" && val.isTWG == true ? 
                                                    <div className="contents"> GAD TWG Member </div> :
                                                val.position_name == "GAD Staff" && val.isTWG == false ?
                                                    <div className="contents"> {val.position_name} </div> : 
                                                val.position_name == "GAD Secretariat" ?
                                                    <div className="contents"> {val.position_name} </div> :
                                                val.position_name == "TWG Chair" ?
                                                    <div className="contents"> GAD {val.position_name}person </div> : 
                                                val.position_name == "Executive Committee Chair" ?
                                                    <div className="contents"> GAD {val.position_name}person </div> :
                                                val.position_name == "TWG Member" && val.isTWG == false ? 
                                                    <div className="contents"> {val.position_name}
                                                        <span className="text-red-500"> (TWG is set to FALSE) </span> 
                                                    </div> : 
                                                    <div className="contents"> {val.position_name} </div>
                                                }
                                            </td>
                                            <td className="border p-2 w-[10%] text-start">
                                                <div className="flex justify-evenly">
                                                    <div onClick={() => this.handleChangeForm(val.id)} className="btn-edt border-2 border-green-600 rounded-lg py-1 px-2">
                                                        <i className="fas fa-edit text-green-600"></i>
                                                    </div>
                                                    <div onClick={() => this.handleDelete(val.id)} className="btn-del border-2 border-red-600 rounded-lg py-1 px-2">
                                                        <i className="fas fa-trash-alt text-red-600"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table> 
                        </div>
                    </div>
                    : formPart == "two" ?  
                    <div className="contents">
                        <div className='flex justify-end'>
                            <div onClick={this.handleClearForm} className="btn-cnl border-2 border-red-600 rounded-lg py-1 px-2">
                                <i className="far fa-times text-sm text-red-600"></i>
                            </div>
                        </div>
                        <div className="container w-100 p-0 border my-3 mx-2">
                            <div className="card border-0 bg-transparent">
                                <div className="card-header">
                                    <div className="text-center text-2xl"> Update User </div>
                                </div>
                                <div className="card-body">
                                    <form autoComplete="off" className="createform" onSubmit={this.handleUpdateUser}>
                                        <div className="flex">
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="EMail"> Email </label>
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.emp_email}
                                                    type="email" 
                                                    name="emp_email"
                                                    className="form-control" 
                                                    placeholder="E-Mail" 
                                                />
                                            </div>
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="password"> Password </label>
                                                <div className="flex justify-between">
                                                    <div className="w-[85%]">
                                                        <input disabled
                                                            onChange={this.handleFieldChange}
                                                            value={this.state.password}
                                                            type="text" 
                                                            name="password"
                                                            className="form-control" 
                                                        />
                                                    </div>
                                                    <div className="p-1">
                                                        <button className='border py-1 px-2 rounded-lg bg-white' onClick={this.handleResetPassword}>
                                                            Reset
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="Position"> Position </label>
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    value={this.state.emp_position}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="emp_position"
                                                >
                                                    {positions.map((val,ndx) => 
                                                        <option key={ndx} value={val.position_id}> {val.position_name} </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group w-50 px-2">
                                                <div className="flex">
                                                    <div className="w-50 pe-2">
                                                        <label className='text-lg' htmlFor="User Role"> User Role </label>
                                                        <select 
                                                            onChange={this.handleFieldChange}
                                                            value={this.state.emp_role}
                                                            className="custom-select w-100 border rounded text-lg p-1"
                                                            name="emp_role"
                                                        >
                                                            <option value={"admin"}> Admin </option>
                                                            <option value={"user"}> User </option>
                                                        </select>
                                                    </div>
                                                    <div className="w-50 ps-2">
                                                        <div className='flex justify-start w-100 p-1'>
                                                            <label className='text-lg' htmlFor="TWG Member"> TWG Member: </label>
                                                            <div className="form-froup ps-3">
                                                                <div className="form-group text-lg">
                                                                    <input onChange={this.handleChangeRB} checked={this.state.twg == true} type="radio" id="twg1" value={true}/>
                                                                    <label className='ps-1' htmlFor="twg1"> Yes </label>
                                                                </div>
                                                                <div className="form-group text-lg">
                                                                    <input onChange={this.handleChangeRB} checked={this.state.twg == false} type="radio" id="twg2" value={false}/>
                                                                    <label className='ps-1' htmlFor="twg2"> No </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-center mt-3">
                                            <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Update"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    : 
                    <div className="contents">
                        <div className='flex justify-end'>
                            <div onClick={this.handleClearForm} className="btn-cnl border-2 border-red-600 rounded-lg py-1 px-2">
                                <i className="far fa-times text-sm text-red-600"></i>
                            </div>
                        </div>
                        <div className="container w-100 p-0 border my-3 mx-2">
                            <div className="card border-0 bg-transparent">
                                <div className="card-header">
                                    <div className="text-center text-2xl"> New User </div>
                                </div>
                                <div className="card-body">
                                    <div className="text-base fw-bold">
                                        <p> (<span className="text-danger">*</span>) <span className="text-danger"> Required Fields </span> </p>
                                    </div>
                                    <form autoComplete="off" className="createform" onSubmit={this.handleSaveUser}>
                                        <div className="flex">
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="Name"> Name </label>
                                                {this.state.emp_name.length == 0 ? <span className="text-danger text-base"> * </span> : ""}
                                                <select 
                                                    onChange={this.handleSelectName}
                                                    name="emp_name"
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                >
                                                    <option className='text-center' value=""> --SELECT OPTION -- </option>
                                                    {employees.map((val,ndx) => 
                                                        <option key={ndx} id={val.id} value={val.id}> {val.name} </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="EMail"> Email </label>
                                                {this.state.emp_email.length == 0 ? <span className="text-danger text-base"> * </span> : ""}
                                                <input 
                                                    onChange={this.handleFieldChange}
                                                    type="email" 
                                                    name="emp_email"
                                                    className="form-control" 
                                                    placeholder="E-Mail" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="form-group w-50 px-2">
                                                <label className='text-lg' htmlFor="Position"> Position </label>
                                                {this.state.emp_position.length == 0 ? <span className="text-danger text-base"> * </span> : ""}
                                                <select 
                                                    onChange={this.handleFieldChange}
                                                    className="custom-select w-100 border rounded text-lg p-1"
                                                    name="emp_position"
                                                >
                                                    <option className='text-center' value={""}> -- SELECT OPTION -- </option>
                                                    {positions.map((val,ndx) => 
                                                        <option key={ndx} value={val.position_id}> {val.position_name} </option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group w-50 px-2">
                                                <div className="flex">
                                                    <div className="w-50 pe-2">
                                                        <label className='text-lg' htmlFor="User Role"> User Role </label>
                                                        {this.state.emp_role.length == 0 ? <span className="text-danger text-base"> * </span> : ""}
                                                        <select 
                                                            onChange={this.handleFieldChange}
                                                            className="custom-select w-100 border rounded text-lg p-1"
                                                            name="emp_role"
                                                        >
                                                            <option className='text-center' value={""}> -- SELECT OPTION -- </option>
                                                            <option value={"admin"}> Admin </option>
                                                            <option value={"user"}> User </option>
                                                        </select>
                                                    </div>
                                                    <div className="w-50 ps-2">
                                                        <div className='flex justify-start w-100 p-1'>
                                                            <label className='text-lg' htmlFor="TWG Member"> TWG Member: </label>
                                                            <div className="form-froup ps-3">
                                                                <div className="form-group text-lg">
                                                                    <input onChange={this.handleChangeRB} checked={this.state.twg == true} type="radio" id="twg1" value={true}/>
                                                                    <label className='ps-1' htmlFor="twg1"> Yes </label>
                                                                </div>
                                                                <div className="form-group text-lg">
                                                                    <input onChange={this.handleChangeRB} checked={this.state.twg == false} type="radio" id="twg2" value={false}/>
                                                                    <label className='ps-1' htmlFor="twg2"> No </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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

export default UserManagement