import React, { Component } from 'react'
import {
    MapContainer, 
    TileLayer,
    Polygon,
    Tooltip,
    LayersControl,
    FeatureGroup,
    Marker,
    useMap
} from 'react-leaflet'
import axios from 'axios'

import { RegionalMAP } from './phRegionMAP'
import { ProvincialMAP } from './phProvinceMAP'

import '../../../../node_modules/leaflet/dist/leaflet.css'

function ProvincesMap({ data, region }) {
    const map = useMap()
    return(
        data.features.filter(el => el.properties.REGION == region).map((state, idx) => {
            const coordinates = state.geometry.coordinates.map(item =>  
                item.map(point => 
                    [point[1], point[0]]
                )
            )
            return (
                <Polygon key={idx} className='outline-none'
                    pathOptions={{
                        fillColor: 'rgba(0, 128, 0, .7)',
                        fillOpacity: 1,
                        weight: 1,
                        opacity: 1,
                        color: 'white'
                    }}
                    positions={coordinates}
                    eventHandlers={{
                        mouseover: (e) => {
                            const layer = e.target
                            layer.setStyle({
                                fillColor: 'rgba(0, 128, 0, .7)',
                                fillOpacity: 1,
                                weight: 1,
                                opacity: 1,
                                color: 'white'
                            })
                        },
                        mouseout: (e) => {
                            const layer = e.target
                            layer.setStyle({
                                fillColor: 'rgba(0, 128, 0, .7)',
                                fillOpacity: 1,
                                weight: 1,
                                opacity: 1,
                                color: 'white'
                            })
                        },
                        click: () => {
                            map.setView([
                                state.properties.GPS[0],
                                state.properties.GPS[1]
                            ],8)
                        }
                    }}
                >
                <Marker position={state.properties.GPS}>
                    <Tooltip 
                        direction="left" offset={[-15, 0]} opacity={1} permanent
                    >
                        {state.properties.PROVINCE}
                    </Tooltip>
                </Marker>
                </Polygon>
            )
        })
    )
}

function RegionsMap({data, clickEvent}){
    const map = useMap()
    return(
        data.features.map((state, idx) => {
            const coordinates = state.geometry.coordinates.map(item =>  
                item[0].map(point => 
                    [point[1], point[0]]
                )
            )
            return (
                <Polygon key={idx} className='outline-none'
                    pathOptions={{
                        fillColor: 'rgb(1, 87, 162)',
                        fillOpacity: 0,
                        weight: 0,
                        opacity: 0,
                        color: 'white'
                    }}
                    positions={coordinates}
                    eventHandlers={{
                        mouseover: (e) => {
                            const layer = e.target
                            layer.setStyle({
                                fillColor: 'rgb(0, 63, 117)',
                                fillOpacity: .5,
                                weight: .5,
                                opacity: 1,
                                color: 'white'
                            })
                        },
                        mouseout: (e) => {
                            const layer = e.target
                            layer.setStyle({
                                fillColor: 'rgb(1, 87, 162)',
                                fillOpacity: 0,
                                weight: 0,
                                opacity: 0,
                                color: 'white'
                            })
                        },
                        click: () => {
                            clickEvent(state.properties.REGION)
                            map.setView([
                                state.properties.GPS[0],
                                state.properties.GPS[1]
                            ],state.properties.ZOOMLEVEL,  {
                                pan: {
                                    animate: true,
                                    duration: 1
                                },
                                zoom: {
                                    animate: true
                                }
                            })
                        }
                    }}
                >
                <Tooltip sticky> {state.properties.REGION} </Tooltip>
                </Polygon>
            )
        })
    )
}

export class GISMap extends Component {
    constructor(props){
        super(props)
        this.state = {
            region: "",
            regionData: [],
            activeTab: 1,
        }
    }

    handleSetRegion = (el) => {
        this.setState({
            region: el
        })
        setTimeout(() => {
            this.handleChangeData()
        }, 5)
    }

    handleChangeData = () => {
        const data = {
            region: this.state.region
        }
        axios.post('/api/getDataPerRegion', data).then(response => {
            this.setState({
                regionData: response.data
            })
        })
    }

    handleTabClick = (el) => {
        this.setState({
            activeTab: el
        })
    }

    render() {
        const { activeTab, region, regionData } = this.state
        return (
            <div className="d-flex flex-wrap">
                <div className="w-50 mobile-lg:!w-[100%] overflow-auto max-h-[100vh]">
                    <MapContainer center={[ 12.7503486,122.7312101 ]} maxZoom={10} minZoom={5} zoom={6} scrollWheelZoom={false} zoomControl={true} dragging={true} doubleClickZoom={false}
                        style={{width: '100%', height: 800, background: 'white'}}
                    >
                        <TileLayer
                            url="https://api.mapbox.com/styles/v1/jyangco/cllelrpl400hg01rde0plda8d/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianlhbmdjbyIsImEiOiJja2I3bTM4ZGkwMzJ6MnFxcnE3anUyMGE2In0.PEe-llVfbUCxYI4D-o0SUw"
                            attribution="© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>"
                        />
                        <LayersControl position="topright">
                            <LayersControl.Overlay checked name="Clickable Map">
                                <FeatureGroup>
                                    <RegionsMap data={RegionalMAP} clickEvent={this.handleSetRegion}  />
                                </FeatureGroup>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay checked name="Show Provinces">
                                <FeatureGroup>
                                    <ProvincesMap data={ProvincialMAP} region={region} />
                                </FeatureGroup>
                            </LayersControl.Overlay>
                        </LayersControl>
                    </MapContainer>
                </div>
                <div className="w-50 mobile-lg:!w-[100%]">
                    <div className="p-4">
                        <div className="text-center text-3xl"> {region} </div>
                    </div>
                    {region.length == 0 ? 
                        <div className="text-center text-3xl"> 
                            Click on the map to view data
                        </div>:
                        <div className="contents">
                            <div className="tab-buttons w-100 flex justify-content-around text-xl">
                                <button
                                    className={activeTab == 1 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg bg-white rounded-t-lg' : 'p-2'}
                                    onClick={() => this.handleTabClick(1)}
                                >
                                    {activeTab == 1 ? 
                                        <span className="text-purple"> <i className="fas fa-bookmark"> </i> Graduate </span> :
                                        <span> Graduate </span>
                                    }
                                </button>
                                <button
                                    className={activeTab == 2 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg bg-white rounded-t-lg' : 'p-2'}
                                    onClick={() => this.handleTabClick(2)}
                                >
                                    {activeTab == 2 ?
                                        <span className="text-purple"> <i className="fas fa-bookmark"> </i> Undergraduate </span> :
                                        <span> Undergraduate </span>
                                    }
                                </button>
                            </div>
                            <div className="tab-content -mt-1 border-t-2 border-dark">
                                {activeTab == 1 ?
                                    <div className="p-2 overflow-auto max-h-[70vh]">
                                        {ProvincialMAP.features.filter(el => el.properties.REGION == region).map((val, ndx) => 
                                            <div className="mb-2" key={ndx}>
                                                <div className="text-3xl"> {val.properties.PROVINCE} </div>
                                                <table className="table my-2">
                                                    <thead>
                                                        <tr>
                                                            <th className="border text-center w-[25%]"> YEAR </th>
                                                            <th className="border text-center w-[25%]"> MALE </th>
                                                            <th className="border text-center w-[25%]"> FEMALE </th>
                                                            <th className="border text-center w-[25%]"> TOTAL </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {regionData.filter(el => el.province == val.properties.PROVINCE && el.type == 'Graduate').map((value, idx) =>
                                                            <tr key={idx}>
                                                                <td className="border"> {value.year} </td>
                                                                <td className="border"> {value.male} </td>
                                                                <td className="border"> {value.female} </td>
                                                                <td className="border"> {value.total} </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div> :
                                    <div className="p-2 overflow-auto max-h-[70vh]">
                                        {ProvincialMAP.features.filter(el => el.properties.REGION == region).map((val, ndx) => 
                                            <div className="mb-2" key={ndx}>
                                                <div className="text-3xl"> {val.properties.PROVINCE} </div>
                                                <table className="table my-2">
                                                    <thead>
                                                        <tr>
                                                            <th className="border text-center w-[25%]"> YEAR </th>
                                                            <th className="border text-center w-[25%]"> MALE </th>
                                                            <th className="border text-center w-[25%]"> FEMALE </th>
                                                            <th className="border text-center w-[25%]"> TOTAL </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {regionData.filter(el => el.province == val.properties.PROVINCE && el.type == 'Undergraduate').map((value, idx) =>
                                                            <tr key={idx}>
                                                                <td className="border"> {value.year} </td>
                                                                <td className="border"> {value.male} </td>
                                                                <td className="border"> {value.female} </td>
                                                                <td className="border"> {value.total} </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default GISMap