import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import CryptoJS from 'crypto-js'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

if (localStorage.getItem('auth') != null) {
    var role  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)
}

export class TrainingList extends Component {
    render() {
        return (
            <Layout title={"/ GAD Trainings"}>
                {role == 'admin' ?
                    <Link className="back-btn text-decoration-none" to="#">
                        <i className="far fa-plus p-1 rounded-circle"></i>
                        <span className="tooltip-text text-sm ms-1">Add new</span>
                    </Link> : ""
                }
                <div className="text-center text-3xl"> GAD Trainings </div>
                <div className="p-5">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias magni officia rem officiis similique quam delectus id. Voluptas, magni nobis deserunt sunt temporibus omnis ad fugiat officiis vel reprehenderit corporis.
                </div>
            </Layout>
        )
    }
}

export default TrainingList