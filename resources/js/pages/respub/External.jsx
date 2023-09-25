import React, { Component } from 'react'

export class External extends Component {
    constructor(props){
        super(props)
        this.state = {
            respubs: this.props.files,
            activeTab: 1,
            activeMenuR: 1,
            activeMenuI: 1
        }
    }

    handleTabClick = (tabNumber) => {
        this.setState({
            activeTab: tabNumber
        })
    }

    handleMenuClickR = (menuNumber) => {
        this.setState({
            activeMenuR: menuNumber
        })
    }

    handleMenuClickI = (menuNumber) => {
        this.setState({
            activeMenuI: menuNumber
        })
    }

    render() {
        const { respubs, activeTab, activeMenuR, activeMenuI } = this.state
        const SO = [...new Set(respubs.filter(so => so.file_subcategory == "Special Orders" && so.file_type == "External").map((item) => item.issuance_year))]
        const SOyear = SO.sort().reverse()
        const MO = [...new Set(respubs.filter(mo => mo.file_subcategory == "Memorandum" && mo.file_type == "External").map((item) => item.issuance_year))]
        const MOyear = MO.sort().reverse()
        return (
            <div className="card-body p-0 m-0">
                <div className="text-center text-3xl"> External Files </div>
                <div className="bg-transparent h-14"></div>
                <div className="tab-buttons w-100 flex justify-content-around text-xl">
                    <button
                        className={activeTab == 1 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg bg-white rounded-t-lg' : 'p-2'}
                        onClick={() => this.handleTabClick(1)}
                    >
                        {activeTab == 1 ? 
                            <span className="text-purple"> <i className="fas fa-bookmark"> </i> Resources </span> :
                            <span> Resources </span>
                        }
                    </button>
                    <button
                        className={activeTab == 2 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg bg-white rounded-t-lg' : 'p-2'}
                        onClick={() => this.handleTabClick(2)}
                    >
                        {activeTab ==2 ?
                            <span className="text-purple"> <i className="fas fa-bookmark"> </i> Issuances </span> :
                            <span> Issuances </span>
                        }
                    </button>
                </div>
                <div className="tab-content -mt-1 border-t-2 border-dark mobile-lg:!hidden">
                    {activeTab == 1 ?
                        <div className="tab-buttons mt-2 w-100 flex justify-content-evenly text-xl">
                            <button
                                className={activeMenuR == 1 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(1)}
                            >
                                {activeMenuR == 1 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Books </span> :
                                    <span> Books </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 2 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(2)}
                            >
                                {activeMenuR == 2 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Brochures </span> :
                                    <span> Brochures </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 3 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(3)}
                            >
                                {activeMenuR == 3 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Magazines </span> :
                                    <span> Magazines </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 4 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(4)}
                            >
                                {activeMenuR == 4 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Posters </span> :
                                    <span> Posters </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 5 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(5)}
                            >
                                {activeMenuR == 5 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Presentations </span> :
                                    <span> Presentations </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 6 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(6)}
                            >
                                {activeMenuR == 6 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Article/Features </span> :
                                    <span> Article/Features </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 7 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(7)}
                            >
                                {activeMenuR == 7 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Videos </span> :
                                    <span> Videos </span>
                                }
                            </button>
                            <button
                                className={activeMenuR == 8 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickR(8)}
                            >
                                {activeMenuR == 8 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Audios </span> :
                                    <span> Audios </span>
                                }
                            </button>
                        </div> :  
                        <div className="tab-buttons mt-2 w-100 flex justify-content-evenly text-xl">
                            <button
                                className={activeMenuI == 1 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickI(1)}
                            >
                                {activeMenuI == 1 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Memorandum </span> :
                                    <span> Memorandum </span>
                                }
                            </button>
                            <button
                                className={activeMenuI == 2 ? 'border-2 border-b-0 border-dark p-2 bg-white rounded-t-lg' : 'p-2'}
                                onClick={() => this.handleMenuClickI(2)}
                            >
                                {activeMenuI == 2 ? 
                                    <span className="text-purple"> <i className="fas fa-bookmark"> </i> Special Order </span> :
                                    <span> Special Order </span>
                                }
                            </button>
                        </div>
                    }
                </div>
                <div className="menu-content -mt-1 border-t-2 border-dark">
                    {activeTab == 1 && activeMenuR == 8 ?
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Audios"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 1 ?
                        <div className="p-4 mobile-lg:!hidden">
                            <div className="my-1 mx-4 justify-content-center p-2 flex flex-wrap">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Books"
                                        )
                                    .map((val,ndx) => 
                                        <a key={ndx} className="text-decoration-none text-info max-w-[200px]" href={`${val.file_name}`} target="_blank" > 
                                            <img className="w-full h-[250px]" src={window.location.origin + '/' + val.file_thumbnail} />
                                            <p className="text-sm text-center"> {val.file_title}  </p>
                                        </a>
                                    )
                                }
                            </div>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 2 ?
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Brochures"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 3 ?
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Magazines"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 4 ?
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Posters"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 5 ? 
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Presentations"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 6 ? 
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Article/Features"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 1 && activeMenuR == 7 ? 
                        <div className="p-4 mobile-lg:!hidden">
                            <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Resources" && 
                                            type.file_subcategory == "Videos"
                                        )
                                    .map((val,ndx) => 
                                    <li key={ndx} className="py-2">
                                        <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                    {activeTab == 2 && activeMenuI == 1 ?
                        <div className="p-4 mobile-lg:!hidden">
                            {respubs.filter(type => type.file_subcategory == "Memorandum").length != 0 ?
                                MOyear.map((year,i) => 
                                <div key={i} className="row justify-content-start">
                                    <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                    <div className='text-2xl'> {year} </div>
                                    {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Issuances" && 
                                            type.file_subcategory == "Memorandum" &&
                                            type.issuance_year == year
                                        )
                                    .map((val,ndx) => 
                                        <li key={ndx} className="py-2">
                                            <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                        </li>)}
                                    </ul>
                                </div>
                                ) : "No Data"
                            }
                        </div> : ""
                    }
                    {activeTab == 2 && activeMenuI == 2 ?
                        <div className="p-4 mobile-lg:!hidden">
                            {respubs.filter(type => type.file_subcategory == "Memorandum").length != 0 ?
                                SOyear.map((year,i) => 
                                <div key={i} className="row justify-content-start">
                                    <ul className="my-1 ms-4 text-xl p-2 list-disc">
                                    <div className='text-2xl'> {year} </div>
                                    {respubs
                                    .filter(
                                        type => 
                                            type.file_type == "External" && 
                                            type.file_category == "Issuances" && 
                                            type.file_subcategory == "Special Orders" &&
                                            type.issuance_year == year
                                        )
                                    .map((val,ndx) => 
                                        <li key={ndx} className="py-2">
                                            <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                        </li>)}
                                    </ul>
                                </div>
                                ) : "No Data"
                            }
                        </div> : ""
                    }
                </div>
                <div className="hidden mobile-lg:!block">
                    {activeTab == 1 ?
                        <div className="px-3 py-5">
                            <div className="accordion" id="ResourceAccordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                            Books
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show visible" aria-labelledby="headingOne" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                                            Brochures
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse visible" aria-labelledby="headingTwo" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                                            Magazines
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse visible" aria-labelledby="headingThree" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                                            Posters
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className="accordion-collapse collapse visible" aria-labelledby="headingFour" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFive">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                                            Presentations
                                        </button>
                                    </h2>
                                    <div id="collapseFive" className="accordion-collapse collapse visible" aria-labelledby="headingFive" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingSix">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
                                            Article/Features
                                        </button>
                                    </h2>
                                    <div id="collapseSix" className="accordion-collapse collapse visible" aria-labelledby="headingSix" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingSeven">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven">
                                            Videos
                                        </button>
                                    </h2>
                                    <div id="collapseSeven" className="accordion-collapse collapse visible" aria-labelledby="headingSeven" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingEight">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight">
                                            Audios
                                        </button>
                                    </h2>
                                    <div id="collapseEight" className="accordion-collapse collapse visible" aria-labelledby="headingEight" data-bs-parent="#ResourceAccordion">
                                        <div className="accordion-body">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="px-3 py-5">
                            <div className="accordion" id="IssuanceAccordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOneI">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOneI">
                                            Special Order
                                        </button>
                                    </h2>
                                    <div id="collapseOneI" className="accordion-collapse collapse show visible" aria-labelledby="headingOneI" data-bs-parent="#IssuanceAccordion">
                                        <div className="accordion-body">
                                            {respubs.filter(type => type.file_subcategory == "Memorandum").length != 0 ?
                                                SOyear.map((year,i) => 
                                                <div key={i} className="row justify-content-start">
                                                    <ul className="my-1 ms-3 text-xl p-2 list-disc">
                                                    <div className='text-2xl'> {year} </div>
                                                    {respubs
                                                    .filter(
                                                        type => 
                                                            type.file_type == "External" && 
                                                            type.file_category == "Issuances" && 
                                                            type.file_subcategory == "Special Orders" &&
                                                            type.issuance_year == year
                                                        )
                                                    .map((val,ndx) => 
                                                        <li key={ndx} className="py-2">
                                                            <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                                        </li>)}
                                                    </ul>
                                                </div>
                                                ) : "No Data"
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingTwoI">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwoI">
                                            Memorandum
                                        </button>
                                    </h2>
                                    <div id="collapseTwoI" className="accordion-collapse collapse visible" aria-labelledby="headingTwoI" data-bs-parent="#IssuanceAccordion">
                                        <div className="accordion-body">
                                            {respubs.filter(type => type.file_subcategory == "Memorandum").length != 0 ?
                                                MOyear.map((year,i) => 
                                                <div key={i} className="row justify-content-start">
                                                    <ul className="my-1 ms-3 text-xl p-2 list-disc">
                                                    <div className='text-2xl'> {year} </div>
                                                    {respubs
                                                    .filter(
                                                        type => 
                                                            type.file_type == "External" && 
                                                            type.file_category == "Issuances" && 
                                                            type.file_subcategory == "Memorandum" &&
                                                            type.issuance_year == year
                                                        )
                                                    .map((val,ndx) => 
                                                        <li key={ndx} className="py-2">
                                                            <a className="text-decoration-none text-info" href={`${val.file_name}`} target="_blank" > {val.file_title} </a>
                                                        </li>)}
                                                    </ul>
                                                </div>
                                                ) : "No Data"
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default External