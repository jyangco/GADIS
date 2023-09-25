import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import moment from 'moment'

import Layout from '../../components/Layout'
import Loader from '../../components/loaders/Loader'
import { GlobalContext } from '../../components/GlobalContext'

function SingleNotification() {
    const { setNotif } = useContext(GlobalContext)
    const [ getMessage, setMessage ] = useState("") 
    const [ getShow, setShow ] = useState("d-none")
    const [ load, setLoad ] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchData = async() =>{
            if (location.state == null) {
                Swal.fire({
                    title: "ERROR in opening message",
                    text: "Message can't be opened, either deleted or corrupted",
                    icon: "error",
                })
                navigate("/messages")
            } else {
                const { id } = location.state
                const data = {
                    notif_id: id
                }
                try {
                    const response = await axios.get(`/api/getSingleMessage/${id}`)
                    setMessage(response.data)
                    axios.post('/api/updateMessage', (data)).then(response => {
                        if (response.data.status == 200) {
                            axios.get('/api/getNotif').then(notifs => {
                                setNotif(notifs.data)
                            })
                            setLoad(false)
                        }
                    })
                } catch (error) {
                    Swal.fire({
                        title: (error.code),
                        text: (error.message),
                        icon: "warning",
                    })
                }
            }
        }
        fetchData()
    }, [])

    const showDetails = () => {
        setShow("d-block")
    }
    const hideDetails = () => {
        setShow("d-none")
    }

    if (load) {
        return(
            <Layout title={"/ Notifications"}>
                <Loader />
            </Layout>
        )
    }

    var carret = ""
    if (getShow == "d-none") {
        carret = (
            <i onClick={showDetails} className="fas fa-caret-down px-1 hover:bg-slate-200 hover:cursor-pointer"></i>
        )
    } else {
        carret = (
            <i onClick={hideDetails} className="fas fa-caret-up px-1 hover:bg-slate-200 hover:cursor-pointer"></i>
        )
    }

    return (
        <Layout title={"/ Notifications"}>
            <Link className="back-btn text-decoration-none" to="/messages">
                <i className="far fa-arrow-left rounded-circle p-1"></i>
                <span className="tooltip-text text-sm ms-1">back</span>
            </Link>
            <div className="card border-0">
                <div className="container p-3">
                    <div className="text-3xl font-bold px-5">
                        {getMessage.content.notif_title}
                    </div>
                    <br/>
                    <div className="section">
                        <div className="text-start">
                            <strong>{getMessage.from.name}</strong>({getMessage.from.email})
                        </div>
                        <div className="text-start">
                            to me {carret}
                        </div>
                        <div className={getShow}>
                            <div className="absolute bg-white border p-2 px-4 w-fit">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="text-end"> from: </td>
                                            <td className="text-start ps-5"> <strong> {getMessage.from.name}</strong> ({getMessage.from.email}) </td>
                                        </tr>
                                        <tr>
                                            <td className="text-end"> to: </td>
                                            <td className="text-start ps-5"> {getMessage.to.email} </td>
                                        </tr>
                                        <tr>
                                            <td className="text-end"> date: </td>
                                            <td className="text-start ps-5"> {moment(getMessage.content.created_at).format('dddd')}, {moment(getMessage.content.created_at).format('LL')} </td>
                                        </tr>
                                        <tr>
                                            <td className="text-end"> subject: </td>
                                            <td className="text-start ps-5"> {getMessage.content.notif_title} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="container pt-4 px-[10%]">
                        {getMessage.content.notif_body}
                        <br />
                        <br />
                        <Link to={getMessage.content.path + getMessage.content.id_number} state={{ id: `${getMessage.content.id_number}` }}>
                            <button className="btn text-primary text-xs bg-slate-200 rounded-full hover:underline underline-offset-4">
                                click here to proceed
                                <i className="ms-2 fas fa-forward"></i>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SingleNotification