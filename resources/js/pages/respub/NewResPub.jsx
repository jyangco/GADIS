import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import Layout from '../../components/Layout'

export class NewResPub extends Component {
    constructor(props){
        super(props)
        this.state = {
            file_type: "",
            file_category: "",
            file_subcategory: "",
            file_title: "",
            file_name: "",
            file_thumbnail : "",
            issuance_year: "",
        }
    }

    //Change input Fields
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChangeFile = (e) => {
        this.setState({
            file_name: e.target.files[0]
        })
    }
    handleChangeFileThumbnail = (e) => {
        this.setState({
            file_thumbnail: e.target.files[0]
        })
    }

    //create new Resources and Publications
    handleNewResPub = (e) => {
        e.preventDefault()
        const formData = new FormData()
            formData.append('file_type', this.state.file_type)
            formData.append('file_category', this.state.file_category)
            formData.append('file_subcategory', this.state.file_subcategory)
            formData.append('file_title', this.state.file_title)
            formData.append('file_name', this.state.file_name)
            formData.append('file_thumbnail', this.state.file_thumbnail)
            formData.append('issuance_year', this.state.issuance_year)
        axios.post('/api/NewRespub', formData)
        .then(response => {
            if (response.data.status == 200) {
                Swal.fire("Success", response.data.message, "success")
                document.querySelector("#ResPubForm").reset()
            } else if (response.data.status == 400) {
                this.setState({
                    error_list: "This field is required"
                })
                Swal.fire("Warning","Please complete the required fields before submitting", "warning")
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
        const issuances = [ 'Special Orders', 'Memorandum' ]
        const resources = [ 'Books', 'Brochures', 'Magazines', 'Posters', 'Presentations', 'Article/Features', 'Videos', 'Audios' ]
        const years = []
        for (let index = 2015; index <= new Date().getFullYear() + 5; index++) {
            years.push(index)
        }
        return (
            <Layout title={"/ Resources and Publications / New"}>
                <Link className="back-btn text-decoration-none" to="/Resources-and-Publications">
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="text-center text-3xl"> New Resources and Publications </div>
                <div className="p-5 mobile-lg:!p-2">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <form className="createForms text-lg" encType="multipart/form-data" onSubmit={this.handleNewResPub} id="ResPubForm">
                                <div className="m-5">
                                    <div className="form-group">
                                        <label htmlFor="file_type"> File Type: 
                                            {this.state.file_type.length != 0 ? "" :
                                                <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                            } 
                                        </label>
                                        <select
                                            className="custom-select m-0 w-100 border border-dark"
                                            name="file_type"
                                            onChange={this.handleFieldChange}
                                        >
                                            <option className="text-center"> -- Please Select Value -- </option>
                                            <option className="text-center" value='Internal'> Internal </option>
                                            <option className="text-center" value='External'> External </option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="file_title"> File Title/Event: 
                                            {this.state.file_title.length != 0 ? "" :
                                                <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                            } 
                                        </label>
                                        <input className="m-0 w-100 border-b-2 border-dark outline-none"
                                            type="text" 
                                            placeholder="Title/Event ..." 
                                            name='file_title'
                                            onChange={this.handleFieldChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="file_category"> File Category: 
                                            {this.state.file_category.length != 0 ? "" :
                                                <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                            } 
                                        </label>
                                        <select
                                            className="custom-select m-0 w-100 border border-dark"
                                            name="file_category"
                                            onChange={this.handleFieldChange}
                                        >
                                            <option className="text-center"> -- Please Select Value -- </option>
                                            <option value="Resources" className="text-center">Resources</option>
                                            <option value="Issuances" className="text-center">Issuances</option>
                                        </select>
                                    </div>
                                    { this.state.file_category == 'Issuances' ? 
                                        <div className="form-group">
                                            <label htmlFor="issuance_year"> Issuance Year: </label>
                                            <select
                                                className="custom-select m-0 w-100 border border-dark"
                                                name="issuance_year"
                                                onChange={this.handleFieldChange}
                                            >
                                                <option className="text-center"> -- Please Select Value -- </option>
                                                {years.map((val,i) => 
                                                    <option className="text-center" value={val} key={i}> {val} </option>
                                                )}
                                            </select>
                                        </div>: ''
                                    }
                                    <div className="form-group">
                                        <label htmlFor="file_subcategory"> File Sub-Category: 
                                            {this.state.file_subcategory.length != 0 ? "" :
                                                <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                            }
                                        </label>
                                        <select
                                            className="custom-select m-0 w-100 border border-dark"
                                            name="file_subcategory"
                                            onChange={this.handleFieldChange}
                                        >
                                            <option className="text-center"> -- Please Select Value -- </option>
                                            { this.state.file_category == 'Issuances' ?
                                                issuances.map((val, i) => (
                                                    <option value={val} key={i} className="text-center"> {val} </option>
                                                )) :
                                                resources.map((val,i) => (
                                                    <option value={val} key={i} className="text-center"> {val} </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    { this.state.file_subcategory == 'Books' && this.state.file_category == 'Resources' ? 
                                        <div className="form-group my-2">
                                            <label htmlFor="file_thumbnail"> Thumbnail: </label>
                                            <input className="text-base ms-2"
                                                type="file" 
                                                placeholder="File ..." 
                                                name='file_thumbnail'
                                                multiple
                                                onChange={this.handleChangeFileThumbnail}
                                            />
                                        </div>
                                        : ''
                                    }
                                    <div className="form-group my-2">
                                        <label htmlFor="file_name"> File:
                                            {this.state.file_name.length != 0 ? "" :
                                                <span className="text-danger text-base"> *{this.state.error_list} </span> 
                                            }
                                        </label> <br/>
                                        <input className="text-base"
                                            type="file" 
                                            placeholder="File ..." 
                                            name='file_name'
                                            multiple
                                            onChange={this.handleChangeFile}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mt-5">
                                        <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default NewResPub