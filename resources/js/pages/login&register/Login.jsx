import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'
import axios from 'axios'

import { GlobalContext } from '../../components/GlobalContext'
import http from './Config'

function Login() {
    const history = useNavigate()
    const  { notif, setNotif }  = useContext(GlobalContext)
    const [passwordShown, setPasswordShown] = useState(false)
    const [loginView, setLoginView] = useState("")
    const [mainView, setMainView] = useState(false)
    const [loginInput, setLoginInput] = useState({
        email: '',
        password: '',
        error_list: []
    })
    const [adminLoginInput, setAdminLoginInput] = useState({
        admin_username: '',
        admin_password: '',
        admin_error_list: []
    })

    useEffect(() => {
        window.onload
        if (localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth')).session == "ADMIN") {
            history("/Admin/Dashboard")
        } else if (localStorage.getItem('auth')) {
            history("dashboard")
        } else {
            history("/")
        }
    }, [])

    const handleSetLoginView = (view) => {
        setLoginView({...loginView, view})
    }

    const handleSetMainView = (e) => {
        e.preventDefault()
        setMainView(true)
    }

    const handleCancelMainView = (e) => {
        e.preventDefault()
        setMainView(false)
    }

    const handleInputChange = (e) => {
        e.persist()
        setLoginInput({...loginInput, [e.target.name]: e.target.value })
    }

    const handleAdminInputChange = (e) => {
        e.persist()
        setAdminLoginInput({...adminLoginInput, [e.target.name]: e.target.value })
    }

    const submitLogin = (e) => {
        e.preventDefault()
        const data = {
            email: loginInput.email,
            password: loginInput.password
        }
        http.get('/sanctum/csrf-cookie').then(response => {
            http.post('/api/login', data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth', 
                        JSON.stringify(
                            {token: res.data.token, 
                            name: res.data.name, 
                            role: CryptoJS.AES.encrypt(res.data.role, "gadisgood").toString()}
                        )
                    )
                    Swal.fire({
                        icon: "success",
                        title: "Welcome" + " " + res.data.name
                    })
                    axios.get('/api/getNotif').then(data => {
                        setNotif(data.data)
                    })
                    history("/dashboard")
                } else if (res.data.status === 401) {
                    Swal.fire({
                        title: res.data.message, 
                        text: "username or password is incorrect", 
                        icon: "warning"
                    })
                } else {
                    setLoginInput({ error_list: res.data.validation_errors })
                }
            })
        })
    }

    const submitAdminLogin = (e) => {
        e.preventDefault()
        const data = {
            username: adminLoginInput.admin_username,
            password: adminLoginInput.admin_password
        }
        http.get('/sanctum/csrf-cookie').then(response => {
            http.post('/api/AdminLogin', data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth', 
                        JSON.stringify(
                            {token: res.data.token, 
                            session: "ADMIN", 
                            role: CryptoJS.AES.encrypt(res.data.role, "gadisgood").toString()
                        })
                    )
                    Swal.fire({
                        icon: "success",
                        title: "Welcome GADmin"
                    })
                    history("/Admin/Dashboard")
                } else if (res.data.status === 401) {
                    Swal.fire({
                        title: res.data.message, 
                        text: "username or password is incorrect", 
                        icon: "warning"
                    })
                } else {
                    setLoginInput({ admin_error_list: res.data.validation_errors })
                }
            })
        })
    }

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true)
    }

    return (
        <div className="container-fluid overflow-hidden h-screen bg-gradient-to-br from-sky-500 to-pink-500">
            <div className="hidden mobile-lg:flex mobile-lg:h-[40%]">
                <div className="flex-auto w-1/4 place-self-center">
                    <img src={window.location.origin + '/images/Logo/SEI_LOGO.png'}/>
                </div>
                <div className="flex-auto w-1/4 place-self-center">
                    <img src={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'}/>
                </div>
            </div>
            <div className="p-2 flex h-full mobile-lg:h-0 mobile-lg:block">
                <div className="flex-auto w-1/4 place-self-center mobile-lg:hidden">
                    <img src={window.location.origin + '/images/Logo/SEI_LOGO.png'}/>
                </div>
                <div className="flex-auto w-1/2 place-self-center mobile-lg:w-full">
                    <div className="card border-0" style={{backgroundImage: 'linear-gradient(-225deg, #D6EEFB 50%, #FFE6FA 50%)'}}>
                        {mainView == false ? 
                            <div className="contents">
                                <div className="flex justify-end pt-3 px-3">
                                    <a className="text-decoration-none rounded-full bg-purple text-slate-50 hover:bg-lightpurple hover:text-white hover:cursor-pointer" href={window.location.origin + '/videos/Login_And_Dashboard.mp4'} target='_blank'>
                                        <p className="my-1 mx-3 text-base mobile-xs:text-sm"> Watch Video
                                            <i className="fas fa-play-circle mx-1 mobile-xs:text-sm"></i>
                                        </p>
                                    </a>
                                </div>
                                <div className="px-4 py-1 text-purple font-bold">
                                    <p className='text-5xl py-2'> Hello,</p>
                                    <p className='text-3xl py-2'> Welcome to DOST-SEI GAD Information System </p>
                                </div>
                                <div className="flex justify-end p-3 mobile-lg:!pt-0">
                                    <button onClick={handleSetMainView} className="rounded-full bg-purple text-slate-50 hover:bg-lightpurple">
                                        <p className="my-1 mx-3 text-lg mobile-xs:text-sm"> Log in 
                                            <i className="fas fa-arrow-from-left mx-1 mobile-xs:text-sm"></i>
                                        </p>
                                    </button>
                                </div>
                            </div> : 
                            <div className='contents'>
                                <div className="card-header bg-transparent">
                                    <div className="float-left">
                                        <button onClick={handleCancelMainView} className="text-xl p-2 text-purple">
                                            <i className="fas fa-arrow-from-right mx-1 mobile-xs:text-sm"></i>
                                        </button>
                                    </div>
                                    <div className="text-4xl text-purple font-extrabold text-center mobile-xs:text-xl"> <span className="capitalize"> {loginView.view} </span> Log in </div>
                                </div>
                                <div className="card-body mobile-lg:!p-0">
                                    <div className={loginView == "" ? "d-flex py-5 h-[300px]" : "d-flex mobile-lg:!py-1"}>
                                        <div className="w-50">
                                            <div className="text-center p-2 mobile-lg:!p-0">
                                                <button onClick={() => handleSetLoginView('admin')} 
                                                    className={loginView.view === "admin" ? "btn bg-white hover:bg-sky-200" : "btn hover:bg-sky-200"}
                                                >
                                                    <i className= {
                                                        loginView == "" ?
                                                        "text-9xl mobile-lg:!text-8xl fad fa-user-shield" :
                                                        "text-lg fad fa-user-shield transition-ease-out duration-500"
                                                    }
                                                        style={{"--fa-primary-color": "#046ab1", "--fa-secondary-color": "#079cfb", "--fa-secondary-opacity": "0.5",}} />
                                                    <p className={
                                                        loginView == "" ?
                                                        "text-2xl fw-bold text-sky-500" :
                                                        "text-sm fw-bold text-sky-500 transition-ease-out duration-500"
                                                    } > ADMIN </p>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-50">
                                            <div className="text-center p-2 mobile-lg:!p-0">
                                                <button onClick={() => handleSetLoginView('user')} 
                                                    className={loginView.view === "user" ? "btn bg-white hover:bg-sky-200" : "btn hover:bg-sky-200"}
                                                >
                                                    <i className={
                                                        loginView == "" ?
                                                        "text-9xl mobile-lg:!text-8xl fad fa-users" :
                                                        "text-lg fad fa-users transition-ease-out duration-500"
                                                    } 
                                                        style={{"--fa-primary-color": "#8b2d8a", "--fa-secondary-color": "#8b2da1", "--fa-secondary-opacity": "0.5",}} />
                                                    <p className={
                                                        loginView == "" ?
                                                        "text-2xl fw-bold text-[#8b2d8a]" :
                                                        "text-sm fw-bold text-[#8b2d8a] transition-ease-out duration-500"
                                                    } > USER </p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {loginView.view === 'user' ?
                                        <form className='mobile-lg:!p-2' onSubmit={submitLogin}>
                                            <div className="form-group">
                                                <label>Email </label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    className="form-control" 
                                                    placeholder="Enter email" 
                                                    onChange={handleInputChange}
                                                    value={loginInput.email}
                                                />
                                                <span className="text-danger"> {loginInput.error_list.email} </span>
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <div className="flex">
                                                    <input 
                                                        type={passwordShown ? "text" : "password"} 
                                                        name="password"
                                                        className="form-control" 
                                                        placeholder="Enter password" 
                                                        onChange={handleInputChange}
                                                        value={loginInput.password}
                                                    />
                                                    <div className="-ms-7 place-self-center" onClick={togglePasswordVisiblity}>
                                                        <i
                                                            className={passwordShown ? "fal fa-eye-slash font-bold" : "fal fa-eye font-bold" }
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-danger"> {loginInput.error_list.password} </span>
                                            </div>
                                            <div className="flex justify-content-center">
                                                <button type="submit" className="mt-3 rounded-full bg-slate-500 text-slate-50 hover:bg-slate-100 hover:text-slate-950">
                                                    <p className="my-1 mx-3 text-2xl font-bold mobile-xs:text-sm"> Log in 
                                                        <i className="fad fa-sign-in-alt mx-1 mobile-xs:text-sm"></i>
                                                    </p>
                                                </button>
                                            </div>
                                        </form> : loginView.view === 'admin' ?
                                        <form className='mobile-lg:!p-2' onSubmit={submitAdminLogin}>
                                            <div className="form-group">
                                                <label>Admin Username </label>
                                                <input 
                                                    type="text" 
                                                    name="admin_username"
                                                    className="form-control" 
                                                    placeholder="Enter Username" 
                                                    onChange={handleAdminInputChange}
                                                    value={adminLoginInput.email}
                                                />
                                                <span className="text-danger"> {adminLoginInput.admin_error_list.admin_username} </span>
                                            </div>
                                            <div className="form-group">
                                                <label>Admin Password</label>
                                                <div className="flex">
                                                    <input 
                                                        type={passwordShown ? "text" : "password"} 
                                                        name="admin_password"
                                                        className="form-control" 
                                                        placeholder="Enter password" 
                                                        onChange={handleAdminInputChange}
                                                        value={adminLoginInput.password}
                                                    />
                                                    <div className="-ms-7 place-self-center" onClick={togglePasswordVisiblity}>
                                                        <i
                                                            className={passwordShown ? "fal fa-eye-slash font-bold" : "fal fa-eye font-bold" }
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-danger"> {adminLoginInput.admin_error_list.admin_password} </span>
                                            </div>
                                            <div className="flex justify-content-center">
                                                <button type="submit" className="mt-3 rounded-full bg-slate-500 text-slate-50 hover:bg-slate-100 hover:text-slate-950">
                                                    <p className="my-1 mx-3 text-2xl font-bold mobile-xs:text-sm"> Log in 
                                                        <i className="fad fa-sign-in-alt mx-1 mobile-xs:text-sm"></i>
                                                    </p>
                                                </button>
                                            </div>
                                        </form> : ""
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex-auto w-1/4 place-self-center mobile-lg:hidden">
                    <img src={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'}/>
                </div>
            </div>
        </div>
    )
}

export default Login