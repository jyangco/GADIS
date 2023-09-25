const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none"
    
        return (
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div className="card m-0" style={{height:'max-content', width:'max-content', maxHeight:'90vh', maxWidth:'90vw', overflowY:'auto'}}>
                        <div className="card-body p-0">
                            {children}
                            <button className="bg-danger text-white p-1" type="button" onClick={handleClose} 
                                style={{position:'absolute', top:'0', right:'0', zIndex:'998'}}
                            >
                                <i className="far fa-times"></i>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
    
    export default Modal