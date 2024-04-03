import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import SidebarAndHeader from './SidebarAndHeader'
import PST from './PST'

const Layout = ({ children, title }) => {
    useEffect(() => {
        document.title="GAD Info System"
    }, [])
    return (
        <div className="wrapper">
            <SidebarAndHeader />
            <nav aria-label="breadcrumb" className="ms-72 mt-14 mobile-lg:ms-[5%] mobile-lg:mt-[160px]">
                <div className="mobile-lg:inline flex justify-content-between">
                    <div className="breadcrumb bg-transparent px-2 py-3 m-0">
                        <div className="breadcrumb-item-dash"> 
                            <Link className="hover:no-underline text-primary" to={"/dashboard"}>
                                Dashboard
                            </Link> <span> {title} </span>
                        </div>
                    </div> 
                    <div className="px-2 py-3 me-[2%] mobile-lg:hidden">
                        <PST/>
                    </div>  
                </div>
            </nav>
            <hr className="ms-72 me-[2%] mobile-lg:mx-[5%]"/>
            <div className="mobile-lg:!m-2 mobile-lg:!pb-2 ms-72 me-4 mt-3 pb-5">
                {children}
            </div>
        </div>
    )
}

export default Layout