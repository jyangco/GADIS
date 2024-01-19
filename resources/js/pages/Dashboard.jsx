import React, { Component } from 'react'

import Layout from '../components/Layout'
import  GISMap from './GISmap/Map'

export class Dashboard extends Component {

    render() {
        return (
            <Layout>
                <div className="section_map-gis">
                    <GISMap/>
                </div>
                <hr className="my-3" />
                <div className="section_graphs min-h-[85vh]">
                    
                </div>
            </Layout>
        )
    }
}

export default Dashboard