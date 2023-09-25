import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import AdminHeader from '../components/AdminHeader'
import AdminLoader from '../components/AdminLoader'

export class Gallery extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            events: [],
            images: [],
            mainMenu: true,
            title: ''
        }
    }

    async componentDidMount(){
        try {
            const response = await axios.get('/api/getImages')
            this.setState({
                events: response.data.events,
                images: response.data.images,
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

    handleSetTitle = (title) => {
        this.setState({
            title: title,
            mainMenu: false
        })
    }
    handleClearTitle = (e) => {
        e.preventDefault()
        this.setState({
            mainMenu: true,
            title: ''
        })
    }

    handleDelete = (id) => {
        const imageId = id
        Swal.fire({
            allowOutsideClick: false,
            title: "You are about to delete this file",
            text: "Do you wish to proceed?",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Yes',
        })
        .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/deleteImage/${imageId}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire("Task Success", res.data.message, "success")
                        this.setState({
                            mainMenu: true,
                            title: ''
                        })
                        this.componentDidMount()
                    } 
                })
            }
        })
    }

    render() {
        const { loading, events, images, mainMenu } = this.state
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader/>
                </AdminHeader>
            )
        }
        return (
            <AdminHeader>
                <div className="text-center text-3xl"> Gallery </div>
                <div className="min-h-[50vh]">
                    {mainMenu == true ? 
                        <div className="d-flex flex-wrap justify-content-start">
                            {events.map((val, ndx) => 
                                <div key={ndx} onClick={() => this.handleSetTitle(val.event_title)} className="mx-2 p-2 hover:bg-sky-100 hover:cursor-pointer w-[200px] h-[full] text-center">
                                    <i className="fad fa-folders text-9xl"></i>
                                    <div className='text-xl'> {val.event_title} </div>
                                </div>
                            )}
                        </div> :
                        <div className="contents">
                            <button className="back-btn text-decoration-none" onClick={this.handleClearTitle}>
                                <i className="far fa-arrow-left p-1 rounded-circle"></i>
                                <span className="tooltip-text text-sm ms-1">back</span>
                            </button>
                            <div className="text-center text-3xl my-3"> {this.state.title} </div>
                            <div className="flex flex-wrap justify-content-center">
                                {images.filter(title => title.event_title == this.state.title).map((pics, ndx) => 
                                    <div key={ndx} className="position-relative w-[45%] h-auto hover:cursor-pointer hover:bg-sky-100 p-4 m-4 border">
                                        <div onClick={() => this.handleDelete(pics.image_id)} className="pill position-absolute top-0 start-100 translate-middle bg-danger text-base rounded-pill border text-white"> 
                                            <i className="fas fa-trash-alt p-2"></i> 
                                        </div>
                                        <img
                                            className="m-0 p-0" 
                                            src={window.location.origin + '/' + pics.image_name} 
                                            alt={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </AdminHeader>
        )
    }
}

export default Gallery