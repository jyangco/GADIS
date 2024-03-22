import React, { Component } from 'react'

import Layout from '../../components/Layout'

export class AboutTheSystem extends Component {
    render() {
        return (
            <Layout title={"/ About GADIS"} > 
                <div className="border p-2 rounded-lg shadow">
                    <div className="container mx-auto">
                        <div className="text-xl font-mono font-bold">
                            Introduction to GADIS:
                        </div>
                        <div className="bg-transparent h-3"/>
                        <p className='text-lg indent-10'>
                            The Gender and Development (GAD) Information System offers wide range of information on GAD programs, projects, and activities (PPAs) implemented by the DOST-SEI.  The goal of the project is to build a broad overview of statistics on gender and development; and serve as a reliable resource in formulation and monitoring of policies that are beneficial for both women and men to facilitate decision making. 
                        </p>
                        <div className="bg-transparent h-3"/>
                        <p className="text-lg indent-10">
                            GADIS is also capable of storing, editing, and retrieving information on GAD-related PPAs on scholarship programs; teacher trainings; S&T promotion activities; youth programs; innovative programs in science and mathematics education; and human resource science and technology development and science education research studies conducted by the Institute. It will generate reports on the status of all GAD-related PPAs.
                        </p>
                        <div className="bg-transparent h-10"/>
                        <div className="text-xl font-mono font-bold">
                            The objectives of developing GADIS are as follows:
                        </div>
                        <div className="bg-transparent h-3"/>
                        <ol className="list-decimal text-lg ms-10">
                            <li className="p-1">
                                Generate GAD-related data in a timely manner.
                            </li>
                            <li className="p-1">
                                Reduce consolidation time in generating requested GAD reports.
                            </li>
                            <li className="p-1">
                                Provide accurate and consistent GAD-related data to various stakeholders for basis in policy and decision making and fund allocation purposes.
                            </li>
                            <li className="p-1">
                                Make available the GAD-related project information, status, and technical reports.
                            </li>
                        </ol>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default AboutTheSystem