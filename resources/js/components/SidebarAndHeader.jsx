import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'
import { GlobalContext } from './GlobalContext'

axios.defaults.withCredentials = true
axios.interceptors.request.use(function(config) {
    const token = JSON.parse(localStorage.getItem('auth')).token
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
})

function SidebarAndHeader() {
    const { notif, setNotif } = useContext(GlobalContext)
    const [ showStyle, setShowStyle ] = useState('-translate-x-[300px]')
    const [ ovl, setOvl ] = useState(false)
    const history = useNavigate()
    const logout = (e) => {
        e.preventDefault()
        Swal.fire({
            allowOutsideClick: false,
            title: "You are about to Logout",
            text: "Do you wish to proceed?",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Yes',
        })
        .then((result) => {
            if (result.isConfirmed) {
                axios.post('/api/logout').then(res => {
                    if (res.data.status === 200) {
                        localStorage.clear()
                        Swal.fire("Successfully Logged Out", res.data.message, "success")
                        history("/")
                    } 
                })
            }
        })
    }

    const showSidebar = (e) =>  {
        e.preventDefault()
        setShowStyle('translate-x-0')
        setTimeout(() => {
            setOvl(true)
        }, 300)
    }
    const hideSidebar = (e) =>  {
        e.preventDefault()
        setShowStyle('-translate-x-[300px]') 
        setTimeout(() => {
            setOvl(false)
        }, 500)
    }

    useEffect(() => {
        if (notif == "") {
            axios.get('/api/getNotif').then(data => {
                setNotif(data.data)
            })
        } else {
            ""
        }
    }, [])

    const handleNotReady = (e) => {
        e.preventDefault()
        Swal.fire({
            title: ("Module is currently unavailable"),
            text: ("Sorry for the inconvenience, this module will be ready later during the last part of the development phase"),
            icon: "info",
        })
    }

    var AuthLinks = ''
    var SideItems = ''
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
    var UserRole = role
    if (UserRole == 'admin') {
        AuthLinks = (
            <div className="p-0 m-0 mobile-lg:!text-lg mobile-lg:!list-none">
                <Link to="/My-profile" className="text-decoration-none">
                    <li className="py-3 px-2 text-left mobile-lg:!p-2"> 
                    <i className="far fa-user-alt me-2"></i>
                        Profile 
                    </li>
                </Link>
                <Link to="/Messages" className="text-decoration-none">
                    <li className="py-3 px-2 text-left mobile-lg:!p-2"> 
                    <i className="fas fa-envelope me-2"></i>
                        Notifications 
                        {notif.messages == 0 ?
                            "" :
                            <span className="ms-5 px-1 rounded-circle text-white bg-danger"> 
                                {notif.messages}   
                            </span>
                        }
                    </li>
                </Link>
                <Link to="/Employees" className="text-decoration-none">
                    <li className="py-3 px-2 text-left mobile-lg:!p-2">
                        <i className="far fa-users me-2"></i>
                        Employees
                    </li>
                </Link>
            </div>
        )
    } 
    else {
        AuthLinks = (
            <div className="p-0 m-0 mobile-lg:!text-lg mobile-lg:!list-none">
                <Link to="/My-profile" className="text-decoration-none">
                    <li className="py-3 px-2 text-left mobile-lg:!p-2"> 
                        <i className="far fa-user-alt me-2"></i>
                        Profile 
                    </li>
                </Link>
                <Link to="/messages" className="text-decoration-none">
                    <li className="py-3 px-2 text-left mobile-lg:!p-2"> 
                    <i className="fas fa-envelope me-2"></i>
                        Notifications 
                        {notif.messages == 0 ?
                            "" :
                            <span className="ms-5 px-1 rounded-circle text-white bg-danger"> 
                                {notif.messages}   
                            </span>
                        }
                    </li>
                </Link>
            </div>
        )
    }

    SideItems = (
        <div className="m-0 p-0">
            <NavLink id={1} to={"/GADES"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-folder-tree me-3"></i>
                            GADES
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-folder-tree me-3"></i>
                        GADES
                    </button>
                )}
            </NavLink>
            <NavLink id={2} to={"/GAD-agenda"} className={UserRole == 'admin' ? "no-underline" : "d-none"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-bullseye me-3"></i>
                            GAD Agenda
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-bullseye me-3"></i>
                        GAD Agenda
                    </button>
                )}
            </NavLink>
            <NavLink id={3} to={"/PPA"} className={UserRole == 'admin' ? "no-underline" : "d-none"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-clipboard-list me-3"></i>
                            PPAs
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-clipboard-list me-3"></i>
                        PPAs
                    </button>
                )}
            </NavLink>
            <NavLink id={4} to={"/Budget"} className={UserRole == 'admin' ? "no-underline" : "d-none"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-sack me-3"></i>
                            Budget
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-sack me-3"></i>
                        Budget
                    </button>
                )}
            </NavLink>
            <NavLink id={5} to={"/Status"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-tasks me-3"></i>
                            Status
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-tasks me-3"></i>
                        Status
                    </button>
                )}
            </NavLink>
            <NavLink id={6} to={"/Reports"} className={UserRole == 'admin' ? "no-underline mobile-lg:!hidden" : "d-underline mobile-lg:!hidden"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-folders me-3"></i>
                            Reports
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-folders me-3"></i>
                        Reports
                    </button>
                )}
            </NavLink>
            <NavLink onClick={handleNotReady} id={7} to={"/#"} className={UserRole == 'admin' ? "no-underline" : "d-none"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-chalkboard-teacher me-3"></i>
                            GAD Trainings
                        </button>
                    </span>
                    : 
                    <button >
                        <i className="fas fa-chalkboard-teacher me-3"></i>
                        GAD Trainings
                    </button>
                )}
            </NavLink>
            <NavLink id={8} to={"/Resources-and-Publications"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <div className="d-flex">
                                <div className="w-10 py-3 pe-1">
                                    <i className="fas fa-book ms-1 me-3"></i>
                                </div>
                                <div className="w-90">
                                    Resources & <br/>
                                    Publications
                                </div>
                            </div>
                        </button>
                    </span>
                    : 
                    <button>
                        <div className="d-flex">
                            <div className="w-10 py-3 pe-1">
                                <i className="fas fa-book ms-1 me-3"></i>
                            </div>
                            <div className="w-90">
                                Resources & <br/>
                                Publications
                            </div>
                        </div>
                    </button>
                )}
            </NavLink>
            <NavLink id={9} to={"/Gallery"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="far fa-image ms-1 me-3"></i>
                            Gallery
                        </button>
                    </span>
                    : 
                    <button>
                        <i className="far fa-image ms-1 me-3"></i>
                        Gallery
                    </button>
                )}
            </NavLink>
            <NavLink onClick={handleNotReady} id={10} to={"/#"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <div className="d-flex">
                                <div className="w-10 py-3 pe-1">
                                    <i className="fas fa-calendar-alt ms-1 me-3"></i>
                                </div>
                                <div className="w-90">
                                    Calendar of <br/>
                                    Activities
                                </div>
                            </div>
                        </button>
                    </span>
                    : 
                    <button>
                        <div className="d-flex">
                            <div className="w-10 py-3 pe-1">
                                <i className="fas fa-calendar-alt ms-1 me-3"></i>
                            </div>
                            <div className="w-90">
                                Calendar of <br/>
                                Activities
                            </div>
                        </div>
                    </button>
                )}
            </NavLink>
            <NavLink id={11} to={"/GAD-issues"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-stream me-3"></i>
                            SEI GAD Issues
                        </button>
                    </span>
                    : 
                    <button>
                        <i className="fas fa-stream me-3"></i>
                        SEI GAD Issues
                    </button>
                )}
            </NavLink>
            <NavLink onClick={handleNotReady} id={12} to={"/#"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-analytics me-3"></i>
                            Training Modules
                        </button>
                    </span>
                    : 
                    <button>
                        <i className="fas fa-analytics me-3"></i>
                        Training Modules
                    </button>
                )}
            </NavLink>
            <NavLink id={13} to={"/About-GADIS"} className={UserRole == 'admin' ? "no-underline" : "no-underline"}>
                {({ isActive }) => ( isActive ?
                    <span className="flex bg-white text-purple">
                        <i className="fas fa-bookmark fa-2x text-purple"></i> 
                        <button >
                            <i className="fas fa-info-circle me-3"></i>
                            About the System
                        </button>
                    </span>
                    : 
                    <button>
                        <i className="fas fa-info-circle me-3"></i>
                        About the System
                    </button>
                )}
            </NavLink>
        </div>
    )

    return (
        <div className="mobile-lg:block flex">
            <nav className="row fixed top-0 z-999 align-items-center border-b-4 border-t-2 border-dark header bg-purple p-0 m-0 w-full h-14 mobile-lg:h-[150px]">
                <div onClick={showSidebar}
                    className="hidden mobile-lg:block absolute w-fit start-0 top-25 text-3xl text-white">
                    <i className="fad fa-arrow-to-right"></i>
                </div>
                <div className="hidden mx-auto mobile-lg:flex mobile-lg:justify-center h-[150px]">
                    <img className="my-2" src={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'}/>
                    <img className="my-2" src={window.location.origin + '/images/Logo/SEI_LOGO.png'}/>
                </div>
                <div className="w-full">
                    <div className="flex justify-between mobile-lg:hidden">
                        <Link to="/dashboard" className="ms-72 text-lg h-12 px-3 row align-items-center text-decoration-none text-indigo-50 hover:tracking-widest hover:border hover:text-white hover:rounded-full hover:bg-mediumpurple">
                            <i className="far fa-chart-line w-fit p-1"></i>
                            Dashboard
                        </Link>
                        <div className="dropdown cursor-pointer flex mx-3 row align-items-center h-12 text-indigo-50 mobile-lg:hidden hover:border hover:rounded-full hover:bg-mediumpurple"> 
                            <div className="mx-1 w-fit">
                                {JSON.parse(localStorage.getItem('auth')).name}
                            </div>
                            <div className="p-2.5 w-fit z-999">
                                <i className="far fa-ellipsis-v me-3"></i>
                                <ul className="dropdown-content cursor-pointer">
                                    <li className="text-uppercase py-3 text-left text-center text-white bg-[#B19FF9]">
                                        {role} 
                                    </li>
                                    <hr className="m-0" />
                                        {AuthLinks}
                                    <hr className="m-0"/>
                                    <li className="py-3 px-2 text-left" onClick={logout}>
                                        <i className="fas fa-sign-out me-2"></i>
                                        Log Out
                                    </li>
                                </ul>
                                <i className="far fa-bell inline-flex">
                                    {notif.messages == 0 ?
                                        "" :
                                        <div className="text-xs px-1 rounded-circle bg-danger mt-1">
                                            {notif.messages}  
                                        </div>
                                    }
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <nav className="sidebar z-999 border border-dark w-64 h-full bg-transparent fixed mobile-lg:hidden">
                <div className="flex flex-column h-full">
                    <div className="h-[25%] border border-dark bg-mediumpurple">
                        <div className="w-full h-full p-4">
                            <img className="w-full h-full" src={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'}/>
                        </div>
                    </div>
                    <div className="shadow-inner overflow-y-auto border border-dark h-4/5">
                        <ul className="m-0 py-4">
                            {SideItems}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="mobile-lg:!block hidden">
                <nav className={`shadow-inner bg-white sidebar z-999 top-0 border border-dark w-64 h-full fixed ${showStyle} transition transform ease-in-out duration-1000`}>
                    <div className="h-full overflow-y-auto">
                        <div className="bg-transparent h-[150px] border-2 border-b-black">
                            {/* <div className="text-5xl p-5"> GADIS </div> */}
                            <img className="w-full h-full" src={window.location.origin + '/images/Logo/Banner.png'}/>
                            <div onClick={hideSidebar}
                                className="absolute px-2 w-fit start-[210px] top-[50px] text-3xl text-black">
                                <i className="fad fa-arrow-to-left"></i>
                            </div>
                        </div>
                        <div className="border-2 border-b-black">
                            <div className="accordion accordion-flush" id="accordionFlush">
                                <div className="accordion-item bg-transparent">
                                    <div className="accordion-header relative">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flushcollapse" >
                                            <i className="fas fa-user-circle me-2"></i>
                                            {JSON.parse(localStorage.getItem('auth')).name}
                                            <i className="far fa-bell inline-flex ms-2">
                                                {notif.messages == 0 ?
                                                    "" :
                                                    <div className="text-xs px-1 rounded-circle bg-danger mt-1">
                                                        {notif.messages}  
                                                    </div>
                                                }
                                            </i>
                                        </button>
                                    </div>
                                    <div id="flushcollapse" className="accordion-collapse collapse visible" data-bs-parent="#accordionFlush">
                                        <hr className="m-0"/>
                                        {AuthLinks}
                                        <hr className="m-0"/>
                                        <button className="p-2 text-left" onClick={logout}>
                                            <i className="fas fa-sign-out me-2"></i>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="m-0 py-4 mobile-lg:!py-2">
                            {SideItems}
                        </ul>
                    </div>
                </nav>
                {ovl && <div className="overlay"/>}
            </div>
        </div>
    )
}

export default SidebarAndHeader