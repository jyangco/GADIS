import React from 'react'
import logo from '../../../../../public/images/Logo/GAD-Logo_3D-nobg.png'

function Loader() {
    return (
        <div className="h-[70vh]">
            <div className="flex h-full">
                <div className="animate-bounce m-auto ">
                    <img className="imageLoader w-64 h-64 mx-auto p-4" src={logo} alt="logo" />
                </div>
            </div>
        </div>
    )
}

export default Loader