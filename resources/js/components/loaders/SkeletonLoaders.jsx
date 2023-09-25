import React from 'react'

function SkeletonLoader() {
    return (
        <div className="container-fluid p-0 m-0">
            <div className="container-fluid p-0 m-0">
                <div className="section my-3">
                    <div className="d-flex">
                        <div className="w-25 rounded shadow-lg mx-3">
                            <div className="skel-loader" style={{height:'15vh'}} ></div>
                        </div>
                        <div className="w-25 rounded shadow-lg mx-3">
                            <div className="skel-loader" style={{height:'15vh'}} ></div>
                        </div>
                        <div className="w-25 rounded shadow-lg mx-3">
                            <div className="skel-loader" style={{height:'15vh'}} ></div>
                        </div>
                    </div>
                </div>
                <hr className="text-light my-3"/>
                <div className="section my-3">
                    <div className="d-flex">
                        <div className="w-50 border p-3 mx-3">
                            <div className="skel-loader" style={{height:'15vh'}} ></div>
                        </div>
                        <div className="w-50 border p-3 mx-3">
                            <div className="skel-loader" style={{height:'15vh'}} ></div>
                        </div>
                    </div>
                </div>
                <hr className="text-light my-3"/>
                <div className="section my-3 px-3">
                    <div className="border p-3">
                        <div className="skel-loader" style={{height:'30vh'}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonLoader