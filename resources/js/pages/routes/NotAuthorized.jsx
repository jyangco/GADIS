import React from 'react'
import { Link } from 'react-router-dom'

function NotAuthorized() {
    return (
        <div className="h-[85vh] flex justify-content-center relative">
            <span className="font-serif text-8xl text-white mt-4 text-center fw-bold z-999 text-center absolute top-0">
                <div> 403 </div> ACCESS FORBIDDEN
            </span>
            <img 
                className="w-[80vw] h-[70vh] absolute top-10 place-items-center"
                src="https://cdn.dribbble.com/users/103176/screenshots/2548586/summoning.gif" 
            />
            <span className="font-mono px-[15%] text-5xl z-999 text-center absolute -bottom-10">
                The page you're trying to access is for ADMIN only
                <Link className="text-decoration-none text-dark px-5" to="/dashboard">
                    <button className="text-lg py-1 px-2 text-white rounded-full bg-primary z-999"> Go back home</button>
                </Link>
            </span>
        </div>
    )
}

export default NotAuthorized