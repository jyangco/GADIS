import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

export class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            profile: "",
        }
    }

    //getting user informations
    async componentDidMount(){
        try {
            const response = await axios.get('/api/getAuth')
            this.setState({
                profile: response.data,
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

    render() {
        const { profile, loading } = this.state
        if (loading) {
            return(
                <Layout title={"/ My Profile"}>
                    <Loader />
                </Layout>
            )
        }
        return (
            <Layout title={"/ My Profile"}>
                <div className="d-flex">
                    <div className="w-25 text-center">
                        <div className="p-3 h-[150px] mobile-lg:!h-[100px] w-[150px] mobile-lg:!w-[100px] bg-transparent shadow mx-auto border rounded-circle">
                            <i className="text-8xl mobile-lg:!text-6xl fad fa-user-secret"></i>
                        </div>
                    </div>
                    <div className="w-75">
                        <div className="text-start text-5xl p-3 mobile-lg:!text-3xl">
                            {profile.name}
                            <div className="text-base text-start text-primary">
                                <i className="far fa-at"></i>
                                {profile.email}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default UserProfile