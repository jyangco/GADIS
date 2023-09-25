import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

import Layout from '../../components/Layout'

export class UploadImages extends Component {
    constructor(props){
        super(props)
        this.state = {
            event_year: "",
            event_celebration: "",
            event_title: "",
            image_name: "",
            display_image: "",
            filetypeError: "",
            loading: "d-none"
        }
    }

    //onchange in file input field and creation of array for displaying the preview
    handleChange = (e) => {
        const imagesArray = []
        let isValid = ""
        for (let i = 0; i < e.target.files.length; i++) {
            isValid = this.fileValidate(e.target.files[i])
            imagesArray.push(e.target.files[i])
        }
        const fileArray = Array.from(imagesArray).map((file) => URL.createObjectURL(file))
        this.setState({
            image_name: imagesArray,
            display_image: fileArray
        })
        Array.from(imagesArray).map((file) => URL.revokeObjectURL(file))
    }

    //onchange in input fileds
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //file validation to allow images only in file uploading
    fileValidate = (file) => {
        if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" ) {
            this.setState({
                filetypeError: ""
            })
            return true
        } else {
            this.setState({
                filetypeError: "File type allowed only jpg, png, jpeg"
            })
            return false
        }
    }

    //submit upload images
    handleUploadImages = (e) => {
        e.preventDefault()
        this.setState({
            loading: "d-block text-center m-3"
        })
        const data = new FormData()
        for (let i = 0; i < this.state.image_name.length; i++) {
            data.append('image_name[]', this.state.image_name[i])
            data.append('event_title', this.state.event_title)
            data.append('event_year', this.state.event_year)
            data.append('event_celebration', this.state.event_celebration)
    }
    axios.post('/api/uploadImages', data)
        .then((response) => {
            this.setState({
                loading: "d-none"
            })
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                document.querySelector("#imageForm").reset()
                this.setState({
                    event_year: "",
                    event_celebration: "",
                    event_title: "",
                    image_name: "",
                    display_image: "",
                })
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
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
        const events = [ 'National Women`s Month', 'VAWC', 'Others' ]
        const years = []
        for (let index = 2015; index <= new Date().getFullYear() + 5; index++) {
            years.push(index)
        }
        return (
            <Layout title={"/ Gallery / New"}>
                <div className="card-header">
                    <Link className="back-btn text-decoration-none" to="/Gallery">
                        <i className="far fa-arrow-left p-1 rounded-circle"></i>
                        <span className="tooltip-text text-sm ms-1">Back</span>
                    </Link>
                    <div className="text-center text-3xl"> Upload Images </div>
                </div>
                <div className="p-5 mobile-lg:!p-2">
                    <div className="details text-lg text-info mb-2 text-start">
                        <i className="fas fa-exclamation-circle"></i>
                        <span> To avoid errors and smoothly upload files </span>
                        <div className="steps text-start">
                            <span> 1. Choose files that are less than 10Mb each. </span> <br/>
                            <span> 2. Don't upload more than 20 photos per batch. </span> <br/>
                            <span> 3. Don't exceed 200Mb of total filesize per batch. </span>
                        </div>
                    </div>
                    <div className="col-10 m-auto mb-5">
                        <form className="p-4 mx-3 text-xl mobile-lg:!mx-0 mobile-lg:!p-2" onSubmit={this.handleUploadImages} encType="multipart/form-data" id="imageForm">
                            <div className="form-group pb-4">
                                <label htmlFor="event_year"> Event Year: 
                                    {this.state.event_year.length != 0 ? "" :
                                        <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                    }
                                </label>
                                <select
                                    className="custom-select m-0 w-100 border border-dark outline-none"
                                    name="event_year"
                                    onChange={this.handleFieldChange}
                                >
                                    <option className="text-center"> -- Please Select Value -- </option>
                                    {years.map((val,i) => 
                                        <option className="text-center" value={val} key={i}> {val} </option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group pb-4">
                                <label htmlFor="event_celebration"> Event Celebration: 
                                    {this.state.event_celebration.length != 0 ? "" :
                                        <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                    }
                                </label>
                                <select
                                    className="custom-select m-0 w-100 border border-dark outline-none"
                                    name="event_celebration"
                                    onChange={this.handleFieldChange}
                                >
                                    <option className="text-center"> -- Please Select Value -- </option>
                                    {events.map((val,i) => 
                                        <option className="text-center" value={val} key={i}> {val} </option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group pb-4">
                                <label htmlFor="event_title"> Event:
                                    {this.state.event_title.length != 0 ? "" :
                                        <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                    }
                                </label>
                                <input className='w-100 m-0 p-0 border-2 border-transparent border-b-slate-950 outline-none'
                                    type="text" 
                                    placeholder="Event ..."
                                    name='event_title'
                                    onChange={this.handleFieldChange}
                                    value={this.state.event_title}
                                />
                            </div>
                            <div className="form-group pb-4">
                                <label htmlFor="image_name">Images
                                    {this.state.image_name.length != 0 ? "" :
                                        <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                    }
                                </label>
                                <input
                                    type="file"
                                    name="image_name"                      
                                    onChange={this.handleChange}
                                    className="form-control"
                                    multiple
                                />
                                <span className="text-danger">
                                    {this.state.filetypeError}
                                </span>
                            </div>
                            <div className={ this.state.loading }>
                                <span className="text-xl"> <i className="fas fa-circle-notch fa-spin me-2"></i> Saving ... </span>
                            </div>
                            <div className="d-flex justify-content-center">
                                {this.state.filetypeError === "" ? 
                                    <div className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl">
                                        <input type="submit" value="Upload File"/>
                                    </div>: 
                                    <div className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl cursor-not-allowed opacity-50" >
                                        <input className="cursor-not-allowed" disabled type="submit" value="Upload File"/>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>
                    <h1 className="text-start px-5 text-xl"> Preview: </h1>
                    {this.state.display_image.length == 0 ?
                        <div className="d-none"></div> : 
                        <div className="p-4 border d-flex flex-wrap justify-content-center">
                            {this.state.display_image.map((file, i) => 
                                <img
                                    src={file} 
                                    key={i} alt="" 
                                    className="p-2 w-[200px] h-[200px]" 
                                />
                            )}
                        </div>
                    }
                </div>
            </Layout>
        )
    }
}

export default UploadImages