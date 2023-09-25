import React, {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loaders/Loader'
import Layout from '../../components/Layout'

function AnnexA_View() {
    const [AnnexA, setAnnexA] = useState("")
    const [goals, setGoals] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchData = async() =>{
            window.scrollTo({top: 0, behavior: 'smooth'})
            if (location.state == null) {
                Swal.fire({
                    title: "ERROR in opening Annex A",
                    text: "Annex A can't be opened, either deleted or corrupted",
                    icon: "error",
                })
                navigate("/GAD-agenda")
            } else {
                const { id } = location.state 
                try {
                    const response = await axios.get(`/api/getIndividualAnnexA/${id}`)
                    setGoals(response.data.goals)
                    setAnnexA(response.data)
                    setLoading(false)
                } catch (error) {
                    Swal.fire({
                        title: (error.code),
                        text: (error.message),
                        icon: "warning",
                    })
                }
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return(
            <Layout title={"/ GAD Agenda / Annex A"}>
                <Loader />
            </Layout>
        )
    }

    return (
        <Layout title={"/ GAD Agenda / Annex A"}>
            <Link className="back-btn text-decoration-none" to="/GAD-agenda">
                <i className="far fa-arrow-left rounded-circle p-1"></i>
                <span className="tooltip-text text-sm ms-1">back</span>
            </Link>
            <div className="text-center text-3xl"> GAD Agenda </div>
            <div className="text-center text-xl"> {AnnexA.start_year} - {AnnexA.end_year} </div>
            <div className="p-5 mobile-lg:!p-2">
                <span className="d-flex justify-content-end text-sm"> Annex A </span>
                <div className='text-lg text-primary mobile-lg:text-base'> I. <span className="ms-5"> GAD Strategic Framework </span>  </div>
                <table className="table border shadow">
                    <tbody>
                        <tr>
                            <td className='px-5 mobile-lg:!px-4 py-3 text-lg'> <strong> Agency: </strong>  Department of Science and Technology – Science Education Institute </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td className='px-5 mobile-lg:!px-4 py-3 text-lg'> <strong> Mandate: </strong> 
                                <ul className='ms-5 list-disc'>
                                    <li> Undertake science education and training; </li>
                                    <li> Administer scholarships, awards and grants; </li>
                                    <li> Undertake science and technology manpower development; and </li>
                                    <li> Formulate plans and establish programs and projects for the promotion and development of S&T education and training in coordination with DepEd, CHED and other institutions of learning. </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="table border shadow">
                    <thead>
                        <tr>
                            <th className="text-center text-sm"> Area </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='px-5 mobile-lg:!px-4 py-3 text-lg'>
                                <strong> GAD Vision: </strong>
                                <div className="ms-5">
                                    {AnnexA.GAD_vision}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td className='px-5 mobile-lg:!px-4 py-3 text-lg'> 
                                <strong> GAD Mission: </strong>
                                <div className="ms-5">
                                    {AnnexA.GAD_mission}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td className='px-5 mobile-lg:!px-4 py-3 text-lg'> 
                                <strong> GAD Goals: </strong>
                                <ul className="list-decimal ms-5">
                                    {goals.map((val,i) => (
                                        <li key={i} className="px-1">
                                            <p> {val.GAD_goal} </p>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default AnnexA_View