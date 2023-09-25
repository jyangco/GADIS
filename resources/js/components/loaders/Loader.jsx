import React from 'react'
import logo from '../../../../public/images/Logo/GAD-Logo_3D-nobg.png'

function Loader() {
    return(
        <div className="vertical-center ms-[10%] mobile-lg:!ms-0">
            <div className="text-center">
                <div className="animate-spin m-auto ">
                    <img className="imageLoader w-40 h-40 mx-auto p-4" src={logo} alt="logo" />
                </div>
            </div>
        </div>
    )
}

export default Loader