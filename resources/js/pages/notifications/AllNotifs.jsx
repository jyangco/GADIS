import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import moment from 'moment'

import Layout from '../../components/Layout'
import Loader from '../../components/loaders/Loader'

function AllNotifs() {
    const [ getMessages, setMessages ] = useState("")
    const [ getLoad, setLoad ] = useState(true)

    useEffect(() => {
        const fetchData = async() =>{
            try {
            const response = await axios.get('/api/getAllMessages')
            setMessages(response.data)
            setLoad(false)
            } catch (error) {
                Swal.fire({
                    title: (error.code),
                    text: (error.message),
                    icon: "warning",
                })
            }
        }
        fetchData()
    }, [])

    if (getLoad) {
        return(
            <Layout title={"/ Notifications"}>
                <Loader/>
            </Layout>
        )
    } 

    return (
        <Layout title={"/ Notifications"}>
            <div className="p-0">
                {getMessages.map((messages, idx) =>
                    messages.isViewed == false ?
                    <Link to={`/messages/${messages.notif_id}`} state={{ id: `${messages.notif_id}` }} className="text-decoration-none text-dark" key={idx}>
                        <div className="hover:bg-slate-100 w-full border p-2 flex-wrap relative flex bg-slate-50 row align-items-center m-0">
                            <div className="w-4/12 font-black ps-5 mobile-lg:!ps-7 mobile-lg:!w-[100%]"> {messages.notif_title} </div>
                            <div className="w-5/12 font-black mobile-lg:!w-7/12 mobile-lg:!ps-7"> {(messages.notif_body).slice(0,30)}... </div>
                            <div className="w-2/12 text-end mobile-lg:!w-4/12"> {moment(messages.created_at).format("LL")} </div>
                            <div className="w-1/12 text-end mobile-lg:!p-0">
                                <button className="px-2 m-0">
                                    <i className="fas fa-trash-alt text-danger p-0 m-0"></i>
                                </button>
                            </div>
                            <span className="absolute start-1% top-50% p-0 w-fit"> <i className="fas fa-envelope"></i> </span>
                        </div>
                    </Link> :
                    <Link to={`/messages/${messages.notif_id}`} state={{ id: `${messages.notif_id}` }} className="text-decoration-none text-dark" key={idx}>
                        <div className="hover:bg-slate-100 w-full flex-wrap border p-2 flex bg-slate-50 row align-items-center m-0">
                            <div className="w-4/12 ps-5 mobile-lg:!ps-7 mobile-lg:!w-[100%]"> {messages.notif_title} </div>
                            <div className="w-5/12 mobile-lg:!w-7/12 mobile-lg:!ps-7"> {(messages.notif_body).slice(0,30)}... </div>
                            <div className="w-2/12 text-end mobile-lg:!w-4/12"> {moment(messages.created_at).format("LL")} </div>
                            <div className="w-1/12 text-end mobile-lg:!p-0">
                                <button className="px-2 m-0">
                                    <i className="fas fa-trash-alt text-danger p-0 m-0"></i>
                                </button>
                            </div>
                            <span className="absolute start-1% top-50% p-0 w-fit"> <i className="fas fa-envelope-open"></i> </span>
                        </div>
                    </Link>
                )}  
            </div>
        </Layout>
    )
}

export default AllNotifs