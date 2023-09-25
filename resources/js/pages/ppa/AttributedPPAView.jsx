import React, { Component, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

window.name

const ForID = () => {
    const location = useLocation()
    useEffect(() => {
        window.name = location.state.id
        return() => {
            window.name
        }
    }, [])
}

export class AttributedPPAView extends Component {
    constructor(props){
        super(props)
        this.state = {
            updateMode: false,
            loading: true,
            Attrib: "",
            year: "",
            ppa_id: "",
            attrib_actual_budget: "",
            ppa_file_path: "",
            ppa_file_title: ""
        }
    }

    //editMode
    editMode = (id) => {
        this.setState({
            updateMode: true,
            ppa_id: id
        })
    }
    //viewMode
    viewMode = (e) => {
        e.preventDefault()
        this.setState({
            updateMode: false
        })
    }

    //CHANGE INPUT FIELDS
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    //Change File
    handleChangeFile = (e) => {
        this.setState({
            ppa_file_path: e.target.files[0]
        })
    }

    //Adding Files
    newHGDG() {
        const data = new FormData()
            data.append('ppa_id', this.state.ppa_id)
            data.append('ppa_file_title', this.state.ppa_file_title)
            data.append('ppa_file_path', this.state.ppa_file_path)
        axios.post('/api/newHGDG', data).then(response => {
        })
    }
    //Updating PPA setting to Done
    markAsDone = (e) => {
        e.preventDefault()
        const data = {
            ppa_id: this.state.ppa_id,
            attrib_actual_budget: (this.state.attrib_actual_budget).replace(/,/g, ""),
        }
        axios.post('/api/updateAttrib',(data))
        .then(response => {
            this.newHGDG()
            Swal.fire("Success", response.data.message, "success")
            this.componentDidMount()
        })
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    //showing PPA details
    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        const fetchData = async() => {
            try {
                const ppa_id = window.name
                const response = await axios.get(`/api/showAttributedPPA/${ppa_id}`)
                this.setState({
                    Attrib: response.data,
                    loading: false,
                    updateMode: false,
                })
            } catch (error) {
                Swal.fire({
                    title: (error.code),
                    text: (error.message),
                    icon: "warning",
                })
            }
        }
        setTimeout(() => {
            fetchData()
        }, 5)
    }

    render() {
        const { loading, Attrib, year, updateMode } = this.state
        if (loading) {
            return(
                <Layout title={"/ GAD PPAs / Attributed"}>
                    <Loader/>
                    <div className="hidden">
                        <ForID></ForID>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout title={"/ GAD PPAs / Direct"}>
                <div className="hidden">
                    <ForID></ForID>
                </div>
                <div className="card-header">
                    <Link className="back-btn text-decoration-none" to="/PPA">
                        <i className="far fa-arrow-left rounded-circle p-1"></i>
                        <span className="tooltip-text text-sm ms-1">back</span>
                    </Link>
                    <div className="text-center text-3xl"> Attributed PPA Details </div>
                </div>
                <div className="card-body p-5 mobile-lg:!p-2">
                    <div className="text-center text-3xl mobile-lg:text-2xl"> {Attrib.attrib_title} </div>
                    <div className="text-center text-3xl mobile-lg:text-2xl"> FY {year} </div>
                    <form className="createForms text-xl mobile-lg:!py-2" encType="multipart/form-data" onSubmit={this.markAsDone}>
                        <label htmlFor="attrib_year" className='m-0'> Year: </label>
                        <select
                            name="year" 
                            className="custom-select ms-2 border border-dark outline-none"
                            value={this.state.year}
                            onChange={this.handleFieldChange}
                        >
                            <option className="text-center" value=""> -- Select Value -- </option>
                            {Attrib.attrib_adetails.map((val,i) => (
                                <option className='text-center' key={i} value={val.attrib_year}> {val.attrib_year} </option>
                            ))}
                        </select>
                        <div className={year == "" ? "text-center m-5 p-3 text-3xl bg-pink-400 text-white rounded-full": "text-center m-5 p-3 text-3xl bg-pink-400 text-white rounded-full d-none"}> 
                            SELECT A YEAR TO VIEW DATA 
                        </div>
                        <div className={year != "" ? "container d-block mobile-lg:!p-0": "container d-none"}>
                            <div className="my-5 mx-1">
                                {Attrib.attrib_adetails.filter(act => act.attrib_year == year).map((filteredData, i) => 
                                    <div className="flex mobile-lg:!flex-wrap mobile-lg:!text-lg text-xl" key={i}>
                                        <div className="mobile-lg:!w-[100%] w-50 px-1">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="p-0 mb-4"> GAD Budget </div>
                                                    <div className="p-0 mb-4"> Expense Class </div>
                                                    <div className="p-0 mb-4"> Budget Source </div>
                                                    <div className="p-0 mb-4"> Responsible Unit </div>
                                                </div>
                                                <div className="w-25">
                                                    <div className="p-0 mb-4"> : </div>
                                                    <div className="p-0 mb-4"> : </div>
                                                    <div className="p-0 mb-4"> : </div>
                                                    <div className="p-0 mb-4"> : </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="p-0 mb-4">
                                                        <NumericFormat
                                                            type="text" 
                                                            displayType="text"
                                                            prefix='₱ '
                                                            thousandSeparator={true}
                                                            thousandsGroupStyle="thousand"
                                                            value={filteredData.attrib_planned_budget}
                                                        />
                                                    </div>
                                                    <div className="p-0 mb-4"> {filteredData.attrib_class} </div>
                                                    <div className="p-0 mb-4"> {filteredData.attrib_source} </div>
                                                    <div className="p-0 mb-4"> {filteredData.attrib_responsible_unit} </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="vr mobile-lg:hidden"></div>
                                        <div className="mobile-lg:!w-[100%] w-50 ps-2">
                                            <div className="d-flex">
                                                <div className="w-50">
                                                    <div className="p-0 mb-4"> Actual Cost </div>
                                                    <div className="p-0 mb-4"> Status </div>
                                                    <div className="p-0 mb-4"> Attached Files </div>
                                                </div>
                                                <div className="w-25">
                                                    <div className="p-0 mb-4"> : </div>
                                                    <div className="p-0 mb-4"> : </div>
                                                    <div className="p-0 mb-4"> : </div>
                                                </div>
                                                {updateMode ?
                                                    <div className="w-50">
                                                        <div className="p-0 mb-4">
                                                            <div className="form-group m-0 p-0"> <span> ₱ </span>
                                                                <NumericFormat 
                                                                    className="w-75 p-0 m-0 border-2 border-transparent border-b-slate-950 outline-none"
                                                                    placeholder="0.00"
                                                                    type="text" 
                                                                    name="attrib_actual_budget"
                                                                    decimalSeparator="."
                                                                    displayType="input"
                                                                    thousandSeparator={true}
                                                                    thousandsGroupStyle="thousand"
                                                                    value={this.state.attrib_actual_budget}
                                                                    onChange={this.handleFieldChange}
                                                                /> 
                                                            </div>
                                                        </div>
                                                        <div className="p-0 mb-4">
                                                            <span className="text-primary m-0 p-0"> Will be changed to DONE </span>
                                                        </div>
                                                        <div className="p-0 mb-4">
                                                            <label htmlFor="ppa_file_title"> File Title: </label>
                                                            <input className="w-100 m-0 p-0 border-2 border-transparent border-b-slate-950 outline-none"
                                                                type="text" 
                                                                placeholder="File Title ..." 
                                                                name='ppa_file_title'
                                                                onChange={this.handleFieldChange}
                                                                value={this.state.ppa_file_title}
                                                            />
                                                        </div>
                                                        <div className="p-0 mb-4">
                                                            <label htmlFor="ppa_file_path"> File: </label>
                                                            <input className="text-base"
                                                                type="file" 
                                                                placeholder="File ..." 
                                                                name='ppa_file_path'
                                                                multiple
                                                                onChange={this.handleChangeFile}
                                                            />
                                                        </div>
                                                    </div> :
                                                    <div className="w-50">
                                                        <div className="p-0 mb-4"> 
                                                            <NumericFormat
                                                                className="w-75 p-0 m-0 "
                                                                type="text" 
                                                                displayType="text"
                                                                decimalSeparator="."
                                                                prefix='₱ '
                                                                thousandSeparator={true}
                                                                thousandsGroupStyle="thousand"
                                                                value={filteredData.attrib_actual_budget}
                                                            />
                                                        </div>
                                                        <div className="p-0 mb-4">
                                                            {filteredData.status}
                                                        </div>
                                                        <div className="p-0 mb-4">
                                                            <span className="m-0 p-0">
                                                                {filteredData.ppa_file_title == null ?
                                                                    <span> No Attachment </span>
                                                                    :
                                                                    <Link className="text-2xl text-decoration-none" to={{ pathname: window.location.origin + '/' + filteredData.ppa_file_path }} target="_blank">
                                                                        <i className="far fa-paperclip me-3"></i>{filteredData.ppa_file_title} 
                                                                    </Link>
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {Attrib.attrib_adetails.filter(act => act.attrib_year == year).map((filteredData, i) => 
                                filteredData.status == "For Implementation" ?
                                    <div className={updateMode ? "d-none" : "d-flex justify-content-center"} key={i}>
                                        <input className="bg-yellow-300 px-5 py-2 hover:bg-yellow-500 hover:text-white hover:shadow-2xl" type="button" value="Update" onClick={() => this.editMode(filteredData.attrib_id)} />
                                    </div> : 
                                    <div className="d-none" key={i}>
                                    </div>
                            )}
                            {updateMode ?
                                <div className="d-flex justify-content-evenly">
                                    <input className="bg-red-300 px-5 py-2 hover:bg-red-500 hover:text-white hover:shadow-2xl" type="button" value="Cancel" onClick={this.viewMode} />
                                    <input className="bg-green-300 px-5 py-2 hover:bg-green-500 hover:text-white hover:shadow-2xl" type="submit" value="Submit"/>
                                </div> :
                                <div className="d-none"></div>
                            }
                        </div>
                    </form>
                </div>
            </Layout>
        )
    }
}

export default AttributedPPAView