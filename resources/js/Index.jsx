import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { 
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'

import { GlobalContext } from './components/GlobalContext'
import Main from './Router'
import Login from './pages/login&register/Login'

function Index() {
    const [ notif, setNotif ] = useState("")
    return(
        <Router>
            <GlobalContext.Provider value={{ notif, setNotif }} >
                <Routes>
                    <Route path="/*" element = {
                        localStorage.getItem('auth') ?
                        <Main/> : <Login/>
                        } 
                    />
                </Routes>
            </GlobalContext.Provider>
        </Router>
    )
}

if(document.getElementById('app')){
    createRoot(document.getElementById('app')).render(<Index />)
}

