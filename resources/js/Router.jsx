import React from 'react'
import { Routes, Route  } from "react-router-dom"

import RouteLayout from './pages/routes/RouteLayout'
import routes from './pages/routes/Route'

const Main = (props) =>(
    <Routes>
        <Route path="/" element={<RouteLayout/>}>
            {routes.map((rowt, idx) => 
                <Route 
                    key={idx}
                    path={rowt.path}
                    exact={rowt.exact}
                    name={rowt.name}
                    element={< rowt.component />}
                />
            )}
        </Route>
    </Routes>
)

export default Main;