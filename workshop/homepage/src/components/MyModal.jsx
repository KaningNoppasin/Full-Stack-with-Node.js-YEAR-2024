function MyModal(props) {
    return (
        <>
            <div class="modal" tabindex="-1" id={props.id}>
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            {/* <h5 class="modal-title">Modal title</h5> */}
                            <h5 class="modal-title">{props.title}</h5>
                            {/* <button id="{props.id}_btnClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            {/* <button id={props.id + "_btnClose"} type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                            <button id={props.id + "_btnClose"} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {/* <p>Modal body text goes here.</p> */}
                            <p>{props.children}</p>
                        </div>
                        {/* <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyModal;