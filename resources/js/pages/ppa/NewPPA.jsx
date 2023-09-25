import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import AttributedPPA from './AttributedPPA'
import DirectPPA from './DirectPPA'

import Layout from '../../components/Layout'

export class NewPPA extends Component {
    constructor(){
        super()
        this.state ={
            ppa_type: ""
        }
    }

    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const { ppa_type } = this.state
        return (
            <Layout title={"/ GAD PPAs / New"} >
                <Link className="back-btn text-decoration-none" to="/PPA">
                    <i className="far fa-arrow-left rounded-circle p-1"></i>
                    <span className="tooltip-text text-sm ms-1">back</span>
                </Link>
                <div className="text-center text-3xl"> New PPA </div>
                <div className="p-5 mobile-lg:!p-2">
                    <form className="createForms">
                        <div className="form-group text-center text-lg">
                            <label htmlFor="ppa_type" className='m-0'> Classification: </label>
                            <select
                                name="ppa_type" 
                                className="custom-select ms-2 border border-dark"
                                value={this.state.ppa_type}
                                onChange={this.handleFieldChange}
                            >
                                <option className="text-center" value={""}> -- Select Value -- </option>
                                <option className="text-center" value="Direct"> Direct </option>
                                <option className="text-center" value="Attributed"> Attributed </option>
                            </select>
                        </div>
                    </form>
                    {ppa_type == "" ?
                        <h1 className="text-center m-5 p-3 text-3xl bg-pink-400 text-white rounded-full"> Select Type </h1>
                    :ppa_type == "Direct" ?
                        <DirectPPA/> : <AttributedPPA/>
                    }
                </div>
            </Layout>
        )
    }
}

export default NewPPA