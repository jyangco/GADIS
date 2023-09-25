import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="h-[85vh] flex justify-content-center relative">
            <span className="font-serif text-8xl mt-4 text-center fw-bold z-999 text-center absolute top-0"> <div> 404 </div> PAGE NOT FOUND </span>
            <img 
                className="w-[65vw] absolute top-0 place-items-center"
                src="https://cdn.svgator.com/images/2022/01/funny-404-error-page-design.gif" 
            />
            <span className="font-mono px-[15%] text-5xl z-999 text-center absolute bottom-20">
                The page you are looking for may have been moved, deleted or possibly never existed
                <Link className="text-decoration-none text-dark px-5" 
                    to={JSON.parse(localStorage.getItem('auth')).session ? "/Admin/dashboard" : "/dashboard"}
                >
                    <button className="text-lg py-1 px-2 text-white rounded-full bg-primary z-999"> Go back home</button>
                </Link>
            </span>
        </div>
    )
}

export default NotFound