import React, { Component } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import moment from 'moment'
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        ArcElement,
        BarElement,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        LineController,
        BarController
    } from 'chart.js'
import { Bar, Pie, Chart } from 'react-chartjs-2'
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController
)


import AdminHeader from './components/AdminHeader'
import AdminLoader from './components/AdminLoader'

export class Index extends Component {
    constructor(props){
        super(props)
        this.state = {
            logs: [],
            users: [],
            postsPerPage: 10,
            currentPage: 1,
            planned: [],
            actual: [],
            year: [],
            ben_planned: [],
            ben_actual: [],
            ben_year: [],
            loading: true
        }
    }

    async componentDidMount(){
        try {
            const log = await axios.get('/api/getHistories')
            this.setState({
                logs: log.data,
            })
            const user = await axios.get('/api/getLogins')
            this.setState({
                users: user.data,
            })
            const budgetData = await axios.get('/api/getActualAndPlannedBudget')
            this.setState({
                planned: budgetData.data.planned,
                actual: budgetData.data.actual,
                year: budgetData.data.year,
            })
            const beneficiaryData = await axios.get('/api/getActualAndPlannedBeneficiaries')
            this.setState({
                ben_planned: beneficiaryData.data.planned,
                ben_actual: beneficiaryData.data.actual,
                ben_year: beneficiaryData.data.year,
            })
            setTimeout(() => {
                this.setState({
                    loading: false
                })
            }, 100)
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "warning",
            })
        }
    }

    showPagination = () => {
        const { postsPerPage, logs } = this.state
        const pageNumbers = []
        const totalPosts = logs.length
        for(let i = 1; i<=Math.ceil(totalPosts/postsPerPage); i++){
            pageNumbers.push(i)
        }
        const pagination = (pageNumbers) => {
            this.setState({ currentPage: pageNumbers })
        }
        const prevPage = () => {
            if (this.state.currentPage != 1) {
                this.setState({ currentPage: this.state.currentPage - 1 })
            } else {
                Swal.fire({
                    position: 'center-end',
                    text: 'Already at the first page',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'warning',
                    toast: true
                })
            }
        }
        const nextPage = () => {
            if (this.state.currentPage == pageNumbers[pageNumbers.length-1]) {
                Swal.fire({
                    position: 'center-end',
                    text: 'Already at the last page',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'warning',
                    toast: true
                })
            } else {
                this.setState({ currentPage: this.state.currentPage + 1 })
            }
        }
            return(
                <nav>
                    {pageNumbers.length > 15 ?
                        <ul className="pagination">
                            <li>
                                <button onClick={prevPage} className="page-link text-sm">
                                    <i className="fas fa-long-arrow-alt-left"></i> Prev 
                                </button>
                            </li>
                            <li className={this.state.currentPage === pageNumbers[0] ? 'page-item active' : 'page-item' }>
                                <button onClick={()=> pagination(pageNumbers[0])} className="page-link text-sm focus:outline-none"> {pageNumbers[0]} </button>
                            </li>
                            <li className={this.state.currentPage === pageNumbers[1] ? 'page-item active' : 'page-item' }>
                                <button onClick={()=> pagination(pageNumbers[1])} className="page-link text-sm focus:outline-none"> {pageNumbers[1]} </button>
                            </li>
                            <li className={this.state.currentPage === pageNumbers[2] ? 'page-item active' : 'page-item' }>
                                <button onClick={()=> pagination(pageNumbers[2])} className="page-link text-sm focus:outline-none"> {pageNumbers[2]} </button>
                            </li>
                            <li>
                                <button disabled className="page-item text-sm ps-2 pt-3"> 
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                            </li>
                            {this.state.currentPage == pageNumbers[0] || 
                            this.state.currentPage == pageNumbers[1] || 
                            this.state.currentPage == pageNumbers[2] || 
                            this.state.currentPage == pageNumbers[pageNumbers.length-1] || 
                            this.state.currentPage == pageNumbers[pageNumbers.length-2] ||
                            this.state.currentPage == pageNumbers[pageNumbers.length-3] ?
                                "" : 
                                <li className="page-item active">
                                    <button disabled className="page-link text-sm focus:outline-none">
                                        {this.state.currentPage}
                                    </button>
                                </li>
                            }
                            <li>
                                <button disabled className="page-item text-sm pe-2 pt-3"> 
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                            </li>
                            <li className={this.state.currentPage === pageNumbers[pageNumbers.length-3] ? 'page-item active' : 'page-item' }>
                                <button onClick={()=> pagination(pageNumbers[pageNumbers.length-3])} className="page-link text-sm focus:outline-none"> {pageNumbers[pageNumbers.length-3]} </button>
                            </li>
                            <li className={this.state.currentPage === pageNumbers[pageNumbers.length-2] ? 'page-item active' : 'page-item' }>
                                <button onClick={()=> pagination(pageNumbers[pageNumbers.length-2])} className="page-link text-sm focus:outline-none"> {pageNumbers[pageNumbers.length-2]} </button>
                            </li>
                            <li className={this.state.currentPage === pageNumbers[pageNumbers.length-1] ? 'page-item active' : 'page-item' }>
                                <button onClick={()=> pagination(pageNumbers[pageNumbers.length-1])} className="page-link text-sm focus:outline-none"> {pageNumbers[pageNumbers.length-1]} </button>
                            </li>
                            <li>
                                <button onClick={nextPage} className="page-link text-sm">
                                    Next <i className="fas fa-long-arrow-alt-right"></i> 
                                </button>
                            </li>
                        </ul> : 
                        <ul className="pagination">
                            {pageNumbers.map((number) => 
                                <li key={number} className={this.state.currentPage === number ? 'page-item active' : 'page-item' }>
                                    <button onClick={()=> pagination(number)} className="page-link text-sm"> {number} </button>
                                </li>
                            )}
                        </ul>
                    }
                </nav>
            )
        }

    render() {
        const { users, logs, postsPerPage, currentPage, planned, actual, year, ben_planned, ben_actual, ben_year, loading } = this.state
        const indexOfLastPage = currentPage * postsPerPage
        const indexOfFirstPage = indexOfLastPage - postsPerPage
        const slicedData = logs.slice(indexOfFirstPage, indexOfLastPage)
        const budgetData = {
            labels: year.map(val => val),
            datasets: [
                {
                    type: 'bar',
                    label: 'Planned Budget',
                    data: planned.map(val => val), 
                    backgroundColor: 'rgb(0, 121, 255, 0.5)',
                    borderColor: 'rgb(0, 121, 255)',
                    borderWidth: 3,
                    stack: 'Stack 0',
                },
                {
                    type: 'bar',
                    label: 'Actual Budget',
                    data:  actual.map(val => val),
                    backgroundColor: 'rgb(0, 223, 162, 0.5)',
                    borderColor: 'rgb(0, 223, 162)',
                    borderWidth: 3,
                    stack: 'Stack 1',
                },
            ],
        }
        const beneficiaryData = {
            labels: ben_year.map(val => val),
            datasets: [
                {
                    type: 'bar',
                    label: 'Planned Beneficiaries',
                    data: ben_planned.map(val => val), 
                    backgroundColor: 'rgb(0, 121, 255, 0.5)',
                    borderColor: 'rgb(0, 121, 255)',
                    borderWidth: 3,
                    stack: 'Stack 0',
                },
                {
                    type: 'bar',
                    label: 'Actual Beneficiaries',
                    data:  ben_actual.map(val => val),
                    backgroundColor: 'rgb(0, 223, 162, 0.5)',
                    borderColor: 'rgb(0, 223, 162)',
                    borderWidth: 3,
                    stack: 'Stack 1',
                },
            ],
        }
        if (loading) {
            return(
                <AdminHeader>
                    <AdminLoader/>
                </AdminHeader>
            )
        }
        return (
            <AdminHeader>
                <div className="d-flex flex-wrap">
                    <div className="w-[30%] p-2">
                        <div className="text-center text-3xl mb-3"> <i className="far fa-user-clock"></i> User Log </div>
                        <div className="max-h-[460px] overflow-auto">
                            <table className="table">
                                <thead id="adminHeader" className='text-white sticky top-0'>
                                    <tr>
                                        <th className="border-x border-l-0 text-center rounded-tl-lg w-[65%]"> Email </th>
                                        <th className="border-x border-r-0 text-center rounded-tr-lg w-[35%]"> Date </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(( data, ndx ) =>
                                        <tr key={ndx} className="hover:bg-mediumpurple hover:text-white hover:cursor-default">
                                            <td className="border"> { data.name } </td>
                                            <td className="border text-center"> {moment(data.created_at).format("YYYY-MM-DD")} </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-[70%] p-2">
                        <div className="text-center text-3xl mb-3"> <i className="fas fa-history"></i> History </div>
                        <table className="table min-h-[460px]">
                            <thead id="adminHeader" className='text-white'>
                                <tr>
                                    <th className="border-x border-l-0 text-center w-[55%] rounded-tl-lg"> Action </th>
                                    <th className="border-x text-center w-[15%]"> For </th>
                                    <th className="border-x text-center w-[16%]"> By </th>
                                    <th className="border-x border-r-0 text-center w-[12%] rounded-tr-lg"> Date </th>
                                </tr>
                            </thead>
                            <tbody>
                                {slicedData.map(( data, ndx ) =>
                                    <tr key={ndx} className="hover:bg-mediumpurple hover:text-white hover:cursor-default">
                                        <td className="border"> { data.action } </td>
                                        <td className="border"> { data.action_for } </td>
                                        <td className="border"> { data.action_by } </td>
                                        <td className="border"> { data.date } </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='d-flex justify-content-center'>
                            {this.showPagination()}
                        </div>
                    </div>
                </div>
                <hr className="my-2" />
                <div className="container">
                    <div className="d-flex">
                        <div className="w-50 border-r-2">
                            <div className="p-3">
                                <div className="text-center text-xl"> Planned and Actual Budget per Year </div>
                                <Chart 
                                    data={budgetData}
                                />
                                <div className="text-xs text-right text-info">*Figures are in Php(₱)</div>
                            </div>
                        </div>
                        <div className="w-50">
                            <div className="p-3">
                                <div className="text-center text-xl"> Planned and Actual Beneficiaries per Year </div>
                                <Chart 
                                    data={beneficiaryData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminHeader>
        )
    }
}

export default Index
