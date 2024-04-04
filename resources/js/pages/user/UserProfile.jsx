import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            editMode: false,
            show: false,
            profile: "",
            employee_fname: "",
            employee_lname: "",
            employee_gender: "",
            old_pass: "",
            new_pass: "",
            confirm_pass: "",
            password_match: "does not match"
        }
    }

    //getting user informations
    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        setTimeout(() => {
            this.fetchData()
        }, 5)
    }

    fetchData = async() => {
        try {
            const response = await axios.get('/api/getAuth')
            this.setState({
                profile: response.data,
                employee_fname: response.data.employee_fname,
                employee_lname: response.data.employee_lname,
                employee_gender: response.data.employee_gender,
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

    //toggle edit mode
    handleEditMode = (e) => {
        e.preventDefault()
        this.setState(state => ({
            editMode: !state.editMode
        }))
        if (this.state.editMode == false) {
            this.setState({
                employee_fname: this.state.profile.employee_fname,
                employee_lname: this.state.profile.employee_lname,
                employee_gender: this.state.profile.employee_gender,
            })
        }
    }

    //field change
    handleFieldChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    resetInput(){
        this.setState({
            old_pass: "",
            new_pass: "",
            confirm_pass: "",
        })
    }

    handleChangePassword = (e) => {
        e.preventDefault()
        this.setState({
            new_pass: e.target.value
        })
        setTimeout(() => {
            if (this.state.confirm_pass.length != 0 && this.state.confirm_pass != this.state.new_pass) {
                this.setState({
                    password_match: "does not match"
                })
            } else {
                this.setState({
                    password_match: "match"
                })
            }
        }, 1)
    }

    handleConfirmPassword = (e) => {
        e.preventDefault()
        this.setState({
            confirm_pass: e.target.value
        })
        setTimeout(() => {
            if (this.state.confirm_pass != this.state.new_pass || this.state.confirm_pass == "") {
                this.setState({
                    password_match: "does not match"
                })
            } else {
                this.setState({
                    password_match: "match"
                })
            }
        }, 1)
    }

    //save updated details
    handleUpdateDetails = (e) => {
        e.preventDefault()
        const data = {
            employee_id: this.state.profile.employee_id,
            employee_fname: this.state.employee_fname,
            employee_lname: this.state.employee_lname,
            employee_gender: this.state.employee_gender,
        }
        axios.post(`/api/updateDetails`, data)
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire({
                    position: 'bottom-end',
                    text: 'Information saved',
                    showConfirmButton: false,
                    timer: 2500,
                    icon: 'success',
                    toast: true
                })
                this.fetchData()
                this.setState({
                    editMode: false
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else if (response.data.status == 304){
                Swal.fire({
                    icon: "info",
                    text: (response.data.message),
                })
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

    //save updated details
    handleSavePassword = (e) => {
        e.preventDefault()
        const data = {
            id: this.state.profile.id,
            new_pass: this.state.new_pass,
            old_pass: this.state.old_pass,
            confirm_pass: this.state.confirm_pass,
        }
        axios.post(`/api/passwordChange`, data)
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire({
                    icon: "success",
                    text: (response.data.message),
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
                this.setState({
                    editMode: false,
                    show: false
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else if (response.data.status == 304){
                this.resetInput()
                Swal.fire({
                    icon: "info",
                    text: (response.data.message),
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else if (response.data.status == 401){
                this.resetInput()
                Swal.fire({
                    icon: "warning",
                    text: (response.data.message),
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
            } else {
                this.resetInput()
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

    //CLOSE MODAL
    forceClose = (e) => {
        e.preventDefault()
        this.setState({
            show: false,
            old_pass: "",
            new_pass: "",
            confirm_pass: "",
            password_match: ""
        })
    }
    //OPEN MODAL
    openModal = (e) => {
        e.preventDefault()
        this.setState({
            show: true,
        })
    }

    render() {
        const { profile, editMode, show, password_match, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ My Profile"}>
                    <Loader />
                </Layout>
            )
        }
        return (
            <Layout title={"/ My Profile"}>
                <div className={`flex justify-center ${show == false ? "hidden": "visible"}`}>
                    <div className="absolute z-998">
                        <div className="w-[30vw] mobile-lg:!w-[100%]">
                            <div className="card">
                                <div className="card-header text-center text-2xl p-2">
                                    Change Password
                                </div>
                                <div className="card-body p-4">
                                    <div className="form-group my-2">
                                        <label htmlFor="old_pass"> Old Password </label>
                                        <input
                                            className=" p-1 rounded-lg border border-black w-100" 
                                            type="password" 
                                            name="old_pass"
                                            value={this.state.old_pass}
                                            onChange={this.handleFieldChange}
                                        />
                                        <div className={`text-sm ${this.state.old_pass.length < 8 ? "text-red-500" : "hidden"}`}>
                                            This field must contain at least 8 characters
                                        </div>
                                    </div>
                                    <div className="form-group my-2">
                                        <label htmlFor="new_pass"> New Password </label>
                                        <input
                                            className=" p-1 rounded-lg border border-black w-100" 
                                            type="password" 
                                            name="new_pass"
                                            value={this.state.new_pass}
                                            onChange={this.handleChangePassword}
                                        />
                                        <div className={`text-sm ${this.state.new_pass.length < 8 ? "text-red-500" : "hidden"}`}>
                                            This field must contain at least 8 characters
                                        </div>
                                    </div>
                                    <div className="form-group my-2">
                                        <label htmlFor="confirm_pass"> Confirm Password </label>
                                        <input
                                            className=" p-1 rounded-lg border border-black w-100" 
                                            type="password" 
                                            name="confirm_pass"
                                            value={this.state.confirm_pass}
                                            onChange={this.handleConfirmPassword}
                                        />
                                    </div>
                                    <div className={`${this.state.confirm_pass.length == 0 ? "hidden" : "visible"}`}>
                                        <div className={`${password_match == "match" ? "text-sm text-green-500 text-start" : "text-sm text-red-500 text-start"}`}>
                                            Password {password_match}
                                        </div>
                                        <div className={`text-sm ${this.state.confirm_pass.length < 8 ? "text-red-500" : "text-green-500"}`}>
                                            Password must contain at least 8 characters
                                        </div>
                                    </div>
                                    <div className="flex justify-between my-3">
                                        <button onClick={this.handleSavePassword}
                                        disabled={
                                            password_match == "match" && 
                                            this.state.new_pass.length >= 8 && 
                                            this.state.confirm_pass.length >= 8 &&
                                            this.state.old_pass.length >= 8 ? 
                                            false : true
                                        }
                                        className={ 
                                            `bg-green-500 py-2 px-3 text-white text-xl mobile-lg:!text-lg rounded-lg 
                                            ${password_match == "match" && 
                                            this.state.new_pass.length >= 8 && 
                                            this.state.confirm_pass.length >= 8 &&
                                            this.state.old_pass.length >= 8 ? 
                                                "hover:shadow-2xl" : 
                                                "opacity-50 hover:cursor-not-allowed hover:shadow-none"
                                            }`
                                        }>
                                            SAVE
                                        </button>
                                        <button onClick={this.forceClose} className="bg-red-500 py-2 px-3 text-white text-xl mobile-lg:!text-lg rounded-lg hover:shadow-2xl">
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`card border-2 border-purple rounded-lg ${show ? "hidden": "visible"}`}>
                    <div className="d-flex">
                        <div className={`w-[40%] border-r-2 border-purple rounded-lg ${profile.employee_sex == "Male" ? "bg-lightblue" : "bg-lightpink"}`}>
                            <div className="p-3 mobile-lg:!p-1 flex flex-wrap justify-center">
                                <img className="w-auto h-[250px] mobile-lg:!h-[200px]" src={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'}/>
                                <div className="w-100 text-center text-5xl mobile-lg:!text-xl">
                                    <hr className="my-4 mobile-lg:!my-2" />
                                    <div className="px-3 pb-4 mobile-lg:!p-1 ">
                                        {editMode == false ? 
                                        <div className="contents">
                                            {profile.employee_fname} {profile.employee_lname}
                                        </div> :
                                        <div className=" block">
                                            <div className="w-100">
                                                <input
                                                    className="w-75 mobile-lg:!w-[100%] bg-slate-50 border-2 border-black rounded-lg p-1 text-2xl focus:outline-none " 
                                                    type="text" 
                                                    name="employee_fname"
                                                    value={this.state.employee_fname}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </div>
                                            <div className="w-100">
                                                <input
                                                    className="w-75 mobile-lg:!w-[100%] bg-slate-50 border-2 border-black rounded-lg p-1 text-2xl focus:outline-none " 
                                                    type="text" 
                                                    name="employee_lname"
                                                    value={this.state.employee_lname}
                                                    onChange={this.handleFieldChange}
                                                />
                                            </div>
                                        </div>
                                        }
                                        <div className="pt-2 text-xl mobile-lg:!text-base text-center text-primary">
                                            <i className="fas fa-envelope me-1 fa-lg"></i>
                                            {profile.email}
                                        </div>
                                        <div onClick={this.openModal} className={`text-sky-500 w-100 text-sm mobile-lg:!text-xs text-right underline-offset-2 hover:underline hover:cursor-pointer ${editMode == false ? "hidden" : ""}`}>
                                            <div className="w-75 mx-auto"> change password </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <div className="w-[60%]">
                            <div onClick={this.handleEditMode} className={`hover:cursor-pointer float-right p-2 ${editMode == false ? "text-2xl" : "text-4xl mobile-lg:!text-3xl text-green-500"}`}>
                                <i className="far fa-user-edit"></i>
                            </div>
                            <div className="px-5 py-3 mobile-lg:!px-3">
                                <div className="block border-b-4 pb-3 pt-2 mobile-lg:!py-2">
                                    <div className="mobile-lg:!text-2xl text-3xl text-slate-500 text-semibold p-1">
                                        Division
                                    </div>
                                    {editMode == false ? 
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg">
                                            {
                                                profile.employee_division == "OD" ?
                                                    <span> Office of the Director </span> :
                                                profile.employee_division == "FAD" ?
                                                    <span> Finance and Administrative Division </span> :
                                                profile.employee_division == "STSD" ?
                                                    <span> Science and Technology Scholarship Division </span> :
                                                profile.employee_division == "SEID" ?
                                                    <span> Science Education and Innovations Division </span> :
                                                profile.employee_division == "STMERPD" ?
                                                    <span> S&T Manpower Education Research and Promotions Division </span> : ""
                                            } 
                                        </div> :
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg mobile-lg:!ms-0">
                                            {
                                                profile.employee_division == "OD" ?
                                                    <input disabled
                                                        className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                        type='text'
                                                        value={"Office of the Director"}
                                                    />  :
                                                profile.employee_division == "FAD" ?
                                                    <input disabled
                                                        className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                        type='text'
                                                        value={"Finance and Administrative Division"}
                                                    />  :
                                                profile.employee_division == "STSD" ?
                                                    <input disabled
                                                        className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                        type='text'
                                                        value={"Science and Technology Scholarship Division"}
                                                    />  :
                                                profile.employee_division == "SEID" ?
                                                    <input disabled
                                                        className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                        type='text'
                                                        value={"Science Education and Innovations Division"}
                                                    />  :
                                                profile.employee_division == "STMERPD" ?
                                                    <input disabled
                                                        className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                        type='text'
                                                        value={"S&T Manpower Education Research and Promotions Division"}
                                                    />  : ""
                                            } 
                                        </div>
                                    }
                                </div>
                                <div className="block border-b-4 pb-3 pt-2 mobile-lg:!py-2">
                                    <div className="text-3xl mobile-lg:!text-2xl text-slate-500 text-semibold p-1">
                                        Status
                                    </div>
                                    {editMode == false ? 
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg">
                                            {
                                                profile.employee_status == "COS" ?
                                                    <span> Contract of Service </span> : <span> Regular </span>
                                            } 
                                        </div> : 
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg mobile-lg:!ms-0">
                                        {
                                            profile.employee_status == "COS" ?
                                                <input disabled
                                                    className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                    type='text'
                                                    value={"Contract of Service"}
                                                /> : 
                                                <input disabled
                                                    className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                    type='text'
                                                    value={"Regular"}
                                                />
                                        } 
                                    </div>
                                    }
                                </div>
                                <div className="block border-b-4 pb-3 pt-2 mobile-lg:!py-2">
                                    <div className="text-3xl mobile-lg:!text-2xl text-slate-500 text-semibold p-1">
                                        Sex
                                    </div>
                                    {editMode == false ? 
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg">
                                            {
                                                profile.employee_sex == "Male" ?
                                                    <span> Male <i className="text-sky-500 fas fa-mars"></i> </span>  : 
                                                    <span> Female <i className="text-fuchsia-500 fas fa-venus"></i> </span>
                                            } 
                                        </div> :
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg mobile-lg:!ms-0">
                                            {
                                                profile.employee_sex == "Male" ?
                                                <input disabled
                                                    className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                    type='text'
                                                    value={"Male"}
                                                /> : 
                                                <input disabled
                                                    className='bg-transparent mobile-lg:!w-[100%] text-slate-500 bg-slate-50 border border-black rounded-lg p-1 focus:outline-none'
                                                    type='text'
                                                    value={"Female"}
                                            />
                                            } 
                                        </div>
                                    }
                                </div>
                                <div className="block pb-3 pt-2 mobile-lg:!py-2">
                                    <div className="text-3xl mobile-lg:!text-2xl text-slate-500 text-semibold p-1">
                                        Gender
                                    </div>
                                    {editMode == false ? 
                                        <div className="text-2xl ms-5 mobile-lg:!text-lg">
                                            {
                                                profile.employee_gender != "" ?
                                                <span> {profile.employee_gender} <i className="text-purple fas fa-venus-mars"></i> </span> : 
                                                <span>  </span>
                                            } 
                                        </div> :
                                        <div className="text-2xl ms-5 mobile-lg:!ms-0 mobile-lg:!text-lg">
                                            <input
                                                className="bg-transparent mobile-lg:!w-[100%] border-2 border-black rounded-lg p-1 focus:outline-none " 
                                                type="text" 
                                                name="employee_gender"
                                                value={this.state.employee_gender}
                                                onChange={this.handleFieldChange}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={`hover:cursor-pointer float-right -mt-6 p-2 ${editMode == false ? "hidden" : ""}`}>
                                <button onClick={this.handleUpdateDetails} className="bg-green-500 mx-2 py-2 px-3 text-white text-2xl mobile-lg:!text-lg rounded-lg hover:shadow-2xl">
                                    <i className="fal fa-save me-1"></i> SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default UserProfile