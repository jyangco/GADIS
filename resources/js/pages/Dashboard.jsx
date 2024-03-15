import React, { Component } from 'react'
import axios from 'axios'
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
import { Pie, Bar, Chart } from 'react-chartjs-2'

import Layout from '../components/Layout'
import  GISMap from './GISmap/Map'
import Loader from '../components/loaders/Loader'

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

export class Dashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            male_emp: "",
            female_emp: "",
            male_breakdown: "",
            female_breakdown: "",
            breakdown: "",
            male_div: [],
            female_div: [],
            loading: true
        }
    }

    fetchData = async() => {
        try {
            const result = await axios.get('/api/getSexByDivision')
            this.setState({
                male_div: result.data.male,
                female_div: result.data.female,
            })
            const response = await axios.get('/api/getEmployeeNumber')
            this.setState({
                male_emp: response.data.male,
                female_emp: response.data.female,
                male_breakdown: response.data.male_breakdown,
                female_breakdown: response.data.female_breakdown,
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

    componentDidMount(){
        window.scrollTo({top: 0, behavior: 'smooth'})
        setTimeout(() => {
            this.fetchData()
        }, 5)
    }

    render() {
        const { loading, male_div, female_div, male_emp, female_emp, male_breakdown, female_breakdown, breakdown } = this.state
        let bgColor = [ 
            'rgba(0, 69, 255, 0.5)',
            'rgba(255, 84, 172, 0.5)' 
        ]
        const divMaleData = {
            labels: ['OD', 'STSD', 'SEID', 'FAD', 'STMERPD'],
            datasets: [
                {
                    label: 'No. of Male in this Division',
                    data: male_div.map(val => val),
                    backgroundColor: [
                        'rgba(0, 69, 255, 0.5)',
                    ],
                    borderColor: [
                        'rgba(0, 69, 255, 1)',
                    ],
                    borderWidth: 3,
                }
            ],
        }
        const divFemaleData = {
            labels: ['OD', 'STSD', 'SEID', 'FAD', 'STMERPD'],
            datasets: [
                {
                    label: 'No. of Female in this Division',
                    data: female_div.map(val => val),
                    backgroundColor: [
                        'rgba(255, 84, 172, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 84, 172, 1)',
                    ],
                    borderWidth: 3,
                }
            ],
        }
        const empData = {
            labels: ['Male', 'Female'],
            datasets: [
                {
                    label: 'No. of SEI Employees',
                    data:[ male_emp, female_emp ],
                    backgroundColor: bgColor,
                    borderColor: [
                        'rgba(0, 69, 255, 1)',
                        'rgba(255, 84, 172, 1)'
                    ],
                    borderWidth: 3,
                }
            ], 
        }
        const breakdownDataF = {
            labels: ['COS', 'Regular'],
            datasets: [
                {
                    label: 'Female Employee',
                    data:[ female_breakdown.cos, female_breakdown.regular ],
                    backgroundColor: [
                        'rgba(255, 0, 140, 0.5)',
                        'rgba(255, 85, 180, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 0, 140, 1)',
                        'rgba(255, 85, 180, 1)'
                    ],
                    borderWidth: 3,
                }
            ],
        }
        const breakdownDataM = {
            labels: ['COS', 'Regular'],
            datasets: [
                {
                    label: 'Male Employee',
                    data:[ male_breakdown.cos, male_breakdown.regular ],
                    backgroundColor: [
                        'rgba(0, 0, 255, 0.5)',
                        'rgba(120, 120, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(0, 0, 255, 1)',
                        'rgba(120, 120, 255, 1)'
                    ],
                    borderWidth: 3,
                }
            ],
        }
        const chartOptions = {
            onClick: (event, elements, chart) => {
                if (elements.length > 0) {            
                    const i = elements[0].index
                    if (chart.data.labels[i] === "Female") {
                        this.setState({ breakdown: "Female" })
                        bgColor = [ 
                            'rgba(0, 69, 255, 0.5)',
                            'rgba(255, 84, 172, 1)' 
                        ]
                    } else {
                        this.setState({ breakdown: "Male" })
                        bgColor = [ 
                            'rgba(0, 69, 255, 1)',
                            'rgba(255, 84, 172, 0.5)' 
                        ]
                    }
                }
            }
        }
        if (loading) {
            return(
                <Layout>
                    <Loader />
                </Layout>
            )
        }
        return (
            <Layout>
                <div className="section_map-gis">
                    <GISMap/>
                </div>
                <hr className="my-3" />
                <div className="section_graphs min-h-[85vh]">
                <div className="text-center text-5xl my-4 font-mono font-bold"> SEI Employees </div>
                    <div className="d-flex">
                        <div className="w-50 border-r-2 h-[80vh]">
                            <div className="p-3">
                                <div className="text-center text-xl"> Number of SEI Employees </div>
                                <Pie data={empData} options={chartOptions} />
                                <div className="text-xs text-right text-info">*Click on the graph to show breakdown</div>
                            </div>
                        </div>
                        <div className="w-50 relative overflow-hidden">
                            <div className={`absolute transition transform ease-in-out duration-1000 ${breakdown == "Female" ? "translate-x-0 w-100" : "translate-x-[1000px]"}`}>
                                <div className="flex flex-wrap">
                                    <div className="w-100">
                                        <div className="text-center text-xl"> Female Employees per Employment Status </div>
                                        <Bar 
                                            data={breakdownDataF} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                    display: false,
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="w-100">
                                        <div className="text-center text-xl"> Female Employees per Division </div>
                                        <Bar 
                                            data={divFemaleData} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                    display: false,
                                                    },
                                                },                                  
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`absolute transition transform ease-in-out duration-1000 ${breakdown == "Male" ? "translate-x-0" : "translate-x-[1000px]"}`}>
                                <div className="flex flex-wrap">
                                    <div className="w-100">
                                        <div className="text-center text-xl"> Male Employees per Employment Status </div>
                                        <Bar 
                                            data={breakdownDataM} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                    display: false,
                                                    },
                                                },                                  
                                            }}
                                        />
                                    </div>
                                    <div className="w-100">
                                        <div className="text-center text-xl"> Male Employees per Division </div>
                                        <Bar 
                                            data={divMaleData} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                    display: false,
                                                    },
                                                },                               
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Dashboard