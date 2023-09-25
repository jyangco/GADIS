import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js'

import Modal from '../../components/Modal'
import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}

export class GalleryView extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            filterYear: "",
            event_years: "",
            event_celebrations: "",
            celebrationView: false,
            pictureView: false,
            index: 0,
            pictureToDisplay: [],
            events: [],
            show: false,
        }
    }

    //getting all photos grouped by activity
    async componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        //getting all GPB entries
        try {
            const response = await axios.get('/api/getImagesYear')
            this.setState({
                event_years: response.data,
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

    backBtn = (e) => {
        e.preventDefault()
        this.setState({
            event_celebrations: "",
            filterYear: "",
            celebrationView: false
        })
    }

    backBtn1 = (e) => {
        e.preventDefault()
        this.setState({
            celebrationView: true,
            pictureView: false
        })
    }

    //set event title
    handleSetYear = (el) => {
        const data = {
            filterYear: el
        }
        axios.post('/api/getEventCelebrations', data).then(response => {
            this.setState({
                event_celebrations: response.data,
                filterYear: data.filterYear,
                celebrationView: true,
            })
        })
    }

    //open and close modal
    openModal = (e) => {
        this.setState({
            show: true,
            index: e,
        })
    }
    closeModal = (e) => {
        e.preventDefault()
        this.setState({
            show: false,
            index: 0
        })
    }

    //next and prev per image
    goToNext = (el) => {
        el.preventDefault()
        this.setState({ index: (this.state.index + 1) % this.state.pictureToDisplay.length })
    }
    goToPrev = (el) => {
        el.preventDefault()
        if (this.state.index == 0) {
            this.setState({ index: (this.state.pictureToDisplay.length - 1) })
        } else {
            this.setState({ index: (this.state.index - 1) })
        }
    }

    handleGetPictures = (el) => {
        const data = {
            event_year: this.state.filterYear,
            event_celebration: el
        }
        axios.post('/api/getCelebrationPictures', data).then(response => {
            this.setState({
                events: response.data.events,
                pictureToDisplay: response.data.pics,
                pictureView: true,
            })
        })
    }

    render() {
        const { loading, event_years, events, pictureToDisplay, show, celebrationView, pictureView, filterYear, event_celebrations } = this.state
        const item = pictureToDisplay[this.state.index]
        if (loading) {
            return(
                <Layout title={"/ Gallery"} >
                    <Loader/>
                </Layout>
            )
        }
        if (pictureView) {
            return(
                <Layout title={"/ Gallery / " + filterYear + " / " + pictureToDisplay[0].event_celebration} >
                    <Modal show={show} handleClose={this.closeModal}>
                        <div className="wrapper-images position-relative">
                            <i className="hover:cursor-pointer text-8xl mobile-lg:!text-4xl fas fa-chevron-left position-absolute top-50 start-0 text-white" onClick={this.goToPrev} ></i>
                            <img className="imgs h-[80vh] mobile-lg:!h-[40vh] w-auto"
                                src={ window.location.origin + '/' + item.image_name }
                            />
                            <i className="hover:cursor-pointer text-8xl mobile-lg:!text-4xl fas fa-chevron-right position-absolute top-50 end-0 text-white" onClick={this.goToNext}></i>
                        </div>
                    </Modal>
                    <div className="card-header">
                        <div onClick={this.backBtn1} className="back-btn text-decoration-none">
                            <i className="far fa-arrow-left p-1 rounded-circle"></i>
                            <span className="tooltip-text text-sm ms-1">Back</span>
                        </div> 
                        <div className="text-center text-3xl"> Gallery </div>
                    </div>
                    <div className="p-5 mobile-lg:!p-2">
                        <div className="text-center text-3xl p-3 mobile-lg:text-2xl"> Photos of activities under {pictureToDisplay[0].event_celebration} - {filterYear} </div>
                        {events.map((value, idx) =>
                            <div key={idx} className="pb-3 mb-3 border-2 border-transparent border-b-slate-950">
                                <div className="text-2xl mobile-lg:text-xl text-start"> "{value.event_title}" </div>
                                <div className="d-flex flex-wrap justify-content-start mobile-lg:!justify-evenly">
                                    {pictureToDisplay.filter(yr => yr.event_title == value.event_title ).map((val, ndx) => 
                                        <div key={ndx} className="p-2 hover:bg-sky-50 text-center">
                                            <img onClick={() => this.openModal(ndx)}
                                                className="w-[150px] h-[150px] hover:cursor-pointer" 
                                                src={window.location.origin + '/' + val.image_name} 
                                                alt={window.location.origin + '/images/Logo/GAD-Logo_3D-nobg.png'} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Layout>
            )
        }
        if (celebrationView) {
            return(
                <Layout title={"/ Gallery / " + filterYear} >
                    <div className="card-header">
                        <div onClick={this.backBtn} className="back-btn text-decoration-none">
                            <i className="far fa-arrow-left p-1 rounded-circle"></i>
                            <span className="tooltip-text text-sm ms-1">Back</span>
                        </div> 
                        <div className="text-center text-3xl"> Gallery </div>
                    </div>
                    <div className="p-5 mobile-lg:!p-2">
                        <div className="d-flex flex-wrap justify-content-start">
                            {event_celebrations.map((val, ndx) => 
                                <div key={ndx} onClick={() => this.handleGetPictures(val.event_celebration)} className="mx-2 p-2 hover:bg-sky-50 hover:cursor-pointer w-[200px] mobile-lg:!w-[150px] h-[full] text-center">
                                    <i className="fad fa-folders text-9xl mobile-lg:!text-8xl"></i>
                                    <div className='text-xl'> {val.event_celebration} </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ Gallery"} >
                <div className="card-header">
                    {role == 'admin' ?
                        <Link className="back-btn text-decoration-none" to="/Gallery/New">
                            <i className="far fa-plus p-1 rounded-circle"></i>
                            <span className="tooltip-text text-sm ms-1">Add new</span>
                        </Link> : ""
                    }
                    <div className="text-center text-3xl"> Gallery </div>
                </div>
                <div className="p-5 mobile-lg:!p-2">
                    <div className="d-flex flex-wrap justify-content-start">
                        {event_years.map((val, ndx) => 
                            <div onClick={() => this.handleSetYear(val.event_year)} key={ndx} className="mx-2 p-2 hover:bg-sky-50 hover:cursor-pointer w-[200px] h-[full] mobile-lg:!w-[150px] text-center">
                                <i className="fad fa-folders text-9xl mobile-lg:!text-8xl"></i>
                                <div className='text-xl'> {val.event_year} </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        )
    }
}

export default GalleryView