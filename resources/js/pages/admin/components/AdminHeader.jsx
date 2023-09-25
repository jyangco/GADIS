import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import PST from '../../../components/PST'

const Layout = ({ children }) => {
    useEffect(() => {
        document.title="GAD Info System"
    }, [])
    
    const history = useNavigate()
    const handleLogout = (e) => {
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

    return (
        <div className="wrapper bg-slate-200 min-h-[100vh]">
            <nav id="adminHeader" className="h-[250px] text-white w-full rounded-bl-[40%] rounded-br-[25%]">
                <div className="text-lg px-2 py-3">
                    <div className="container">
                        <div className="d-flex justify-content-between">
                            <Link to="/Admin/Dashboard" className="text-decoration-none text-white px-4 py-2 border rounded-full hover:cursor-pointer hover:tracking-widest hover:bg-mediumpurple"> 
                                <i className="fas fa-home"></i> Home 
                            </Link>
                            <div className="p-2"> <PST/> </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="text-lg px-2 py-3">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="d-flex w-75">
                                <Link to="/Admin/Agenda" className="text-decoration-none text-white px-4 py-2 border-x border-l-2 hover:bg-mediumpurple"> 
                                    Agenda
                                </Link>
                                <Link to="/Admin/PPAs" className="text-decoration-none text-white px-4 py-2 border-x hover:bg-mediumpurple"> 
                                    PPAs
                                </Link>
                                <Link to="/Admin/Reports" className="text-decoration-none text-white px-4 py-2 border-x hover:bg-mediumpurple"> 
                                    Reports
                                </Link>
                                <Link to="/#" className="text-decoration-none text-white px-4 py-2 border-x hover:bg-mediumpurple"> 
                                    Trainings
                                </Link>
                                <Link to="/Admin/Resources-and-Publications" className="text-decoration-none text-white px-4 py-2 border-x hover:bg-mediumpurple"> 
                                    Resources and Publications
                                </Link>
                                <Link to="/Admin/Gallery" className="text-decoration-none text-white px-4 py-2 border-x border-r-2 hover:bg-mediumpurple"> 
                                    Gallery
                                </Link>
                            </div>
                            <div className="d-flex w-25 justify-end">
                                <Link id="adminbtn" to="/#" className="text-decoration-none text-white px-4 py-2 border-x border-l-2 hover:bg-mediumpurple"> 
                                    <i className="far fa-users-cog"></i>
                                    <span className="toolTip text-sm absolute rounded-lg mt-8 -ml-11 bg-violet px-3 py-2">User Settings</span>
                                </Link>
                                <div id="adminbtn" onClick={handleLogout} className="text-white px-4 py-2 border-x border-r-2 hover:bg-mediumpurple hover:cursor-pointer"> 
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span className="toolTip text-sm absolute rounded-lg mt-8 -ml-10 bg-violet px-3 py-2">Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="row w-full -mt-20 mx-0">
                <div className="col-11 p-4 mb-5 bg-slate-100 mx-auto rounded shadow">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout