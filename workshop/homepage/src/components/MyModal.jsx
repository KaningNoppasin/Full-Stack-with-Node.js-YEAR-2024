function MyModal(props) {
    return (
        <>
            <div className="modal" tabIndex="-1" id={props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {/* <h5 className="modal-title">Modal title</h5> */}
                            <h5 className="modal-title">{props.title}</h5>
                            {/* <button id="{props.id}_btnClose" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            {/* <button id={props.id + "_btnClose"} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                            <button id={props.id + "_btnClose"} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* <p>Modal body text goes here.</p> */}
                            {/* <p>{props.children}</p> */}
                            {props.children}
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyModal;