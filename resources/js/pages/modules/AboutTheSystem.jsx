import React, { Component } from 'react'

import Layout from '../../components/Layout'

export class AboutTheSystem extends Component {

    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    render() {
        return (
            <Layout title={"/ About GADIS"} > 
                <div className="border p-2 rounded-lg shadow">
                    <div className="container mx-auto">
                        <div className="text-2xl font-mono font-bold">
                            <i className="fad fa-caret-right mx-1"></i>Introduction to GADIS:
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
                        <div className="text-2xl font-mono font-bold">
                            <i className="fad fa-caret-right mx-1"></i>Objectives of developing GADIS:
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
                        <div className="bg-transparent h-10"/>
                        <div className="text-2xl font-mono font-bold">
                            <i className="fad fa-caret-right mx-1"></i>Instructional videos of GADIS:
                        </div>
                        <div className="bg-transparent h-3"/>
                        <button className="text-decoration-none rounded-full bg-purple text-slate-50 hover:bg-lightpurple hover:text-white hover:cursor-pointer">
                            <p className="my-1 mx-3 text-base mobile-xs:text-sm"> Watch Videos
                                <i className="fas fa-play-circle mx-1 mobile-xs:text-sm"></i>
                            </p>
                        </button>
                        <div className="bg-transparent h-10"/>
                        <div className="text-2xl font-mono font-bold">
                            <i className="fad fa-caret-right mx-1"></i>Technologies used on the development of GADIS:
                        </div>
                        <div className="bg-transparent h-3"/>
                        <div className="flex justify-start flex-wrap">
                            <div className="mobile-lg:w-[100%] w-[50%] p-1">
                                <div className="text-center text-xl font-bold"> Laravel (v.10<i className="far fa-angle-up"></i>) </div>
                                <div className="flex">
                                    <img className='w-40 h-52' src={window.location.origin + '/images/Logo/laravel.svg'}/>
                                    <p className='mobile-lg:text-sm text-lg p-3 indent-5'> Laravel is a free and open-source PHP-based web framework for building high-end web applications. It was intended for the development of web applications following the model–view–controller architectural pattern. </p>
                                </div>
                            </div>
                            <div className="mobile-lg:w-[100%] w-[50%] p-1">
                                <div className="text-center text-xl font-bold"> React (v.18<i className="far fa-angle-up"></i>) </div>
                                <div className="flex">
                                    <img className='w-40 h-52' src={window.location.origin + '/images/Logo/react.svg'}/>
                                    <p className='mobile-lg:text-sm text-lg p-3 indent-5'> React is a free and open-source front-end JavaScript library for building user interfaces based on components. React can be used to develop single-page, mobile, or server-rendered applications. </p>
                                </div>
                            </div>
                            <div className="mobile-lg:w-[100%] w-[50%] p-1">
                                <div className="text-center text-xl font-bold"> Tailwind CSS (v.3<i className="far fa-angle-up"></i>) </div>
                                <div className="flex">
                                    <img className="w-40 h-52" src={window.location.origin + '/images/Logo/tailwindcss-icon.svg'}/>
                                    <p className="mobile-lg:text-sm text-lg p-3 indent-5"> Tailwind CSS is an open source CSS framework. It is a utility-first CSS framework for rapidly building modern websites without ever leaving your HTML. </p>
                                </div>
                            </div>
                            <div className="mobile-lg:w-[100%] w-[50%] p-1">
                                <div className="text-center text-xl font-bold"> PostgreSQL (v.15<i className="far fa-angle-up"></i>) </div>
                                <div className="flex">
                                    <img className="w-40 h-52" src={window.location.origin + '/images/Logo/postgresql.svg'}/>
                                    <p className="mobile-lg:text-sm text-lg p-3 indent-5"> PostgreSQL is an object-relational database management system (ORDMBS), which means that it has relational capabilities and an object-oriented design. It supports both relational (SQL) and non-relational (JSON) queries. </p>
                                </div>
                            </div>
                            <div className="mobile-lg:w-[100%] w-[50%] p-1">
                                <div className="text-center text-xl font-bold"> JavaScript </div>
                                <div className="flex">
                                    <img className="w-40 h-52 scale-75 " src={window.location.origin + '/images/Logo/javascript.svg'}/>
                                    <p className="mobile-lg:text-sm text-lg p-3 indent-5"> JavaScript is a dynamic programming language that's used for web development, in web applications, for game development, and lots more. It allows you to implement dynamic features on web pages that cannot be done with only HTML and CSS. </p>
                                </div>
                            </div>
                            <div className="mobile-lg:w-[100%] w-[50%] p-1">
                                <div className="text-center text-xl font-bold"> CSS </div>
                                <div className="flex">
                                    <img className="w-40 h-52" src={window.location.origin + '/images/Logo/file-type-css.svg'}/>
                                    <p className="mobile-lg:text-sm text-lg p-3 indent-5"> Cascading Style Sheets is a style sheet language used for specifying the presentation and styling of a document written in a markup language such as HTML or XML. </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-transparent h-10"/>
                        <div className="text-2xl font-mono font-bold">
                            <i className="fad fa-caret-right mx-1"></i>Additional documentations for GADIS:
                        </div>
                        <div className="bg-transparent h-3"/>
                        <form className='pb-5' action={window.location.origin + '/Files/GADIS_Documentation.pdf'} method="get" target='_blank'>
                            <button type='submit' className="text-decoration-none rounded-full bg-purple text-slate-50 hover:bg-lightpurple hover:text-white hover:cursor-pointer">
                                <p className="my-1 mx-3 text-base mobile-xs:text-sm"> Get additional info
                                    <i className="fas fa-info-circle mx-1 mobile-xs:text-sm"></i>
                                </p>
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default AboutTheSystem