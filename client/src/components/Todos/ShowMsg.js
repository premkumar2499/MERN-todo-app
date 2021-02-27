import React from 'react';

const showMsg = ({error,handleClose}) =>{
    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 add-todo">
            <div className="modal-dialog modal-dialog-centered w-100 w-xl-50" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="container">
                            <div className="row">
                                <div className="col-10 font-weight-bold fs-2">
                                {error}
                                </div>
                                <div className="col-1 fs-2 btn" onClick={handleClose}>X</div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="row pt-2">
                                <button className="btn btn-primary" onClick={handleClose}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default showMsg;