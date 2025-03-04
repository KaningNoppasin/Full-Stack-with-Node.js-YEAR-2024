import { useEffect, useRef, useState } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

function Product(){
    const alertError = (error) => {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }

    const [product, setProduct] = useState({});     // Create Update
    const [products, setProducts] = useState([]);   //Show
    const [productTrash, setProductTrash] = useState([]);   //Trash
    const [img, setImg] = useState({});
    const [fileExcel, setFileExcel] = useState({})
    const [pageIndex, setPageIndex] = useState(1);
    const refImg = useRef();
    const refExcel = useRef();

    const productInOnePage = 8;

    const handlePreviousPage = () => {
        if (pageIndex - 1 > 0){
            setPageIndex(pageIndex - 1);
        }
    }

    const handleNextPage = () => {
        if (pageIndex + 1 <= Math.ceil(products.length / productInOnePage)){
            setPageIndex(pageIndex + 1);
        }
    }


    useEffect(() => {
        fetchData();
    }, [])

    const handleSave = async () => {
        try {
            // setProduct({...product, img: ""});
            product.img = await handleUpload();
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            // console.log("await handleUpload():",await handleUpload());

            // let res;
            // if (product.id !== undefined){
            //     res = await axios.put(config.apiPath + '/product/edit/' + product.id, product, config.headers())
            // }else{
                // res = await axios.post(config.apiPath + '/product/create', product, config.headers())
            // }
            console.log(product);
            const res = product.id !== undefined
                            ? await axios.put(config.apiPath + '/product/update', product, config.headers())
                            : await axios.post(config.apiPath + '/product/create', product, config.headers())

            if (res.data.message === 'success'){
                Swal.fire({
                    title: 'Save',
                    text: 'Success',
                    icon: 'success',
                    timer: 1000
                })
                document.getElementById("modalProduct_btnClose").click();
                fetchData();
                setProduct({ ...product, id: undefined})
            }
            // await axios.post(config.apiPath + '/product/create', product, config.headers())
            //     .then((res) => {
            //         if (res.data.message === 'success'){
            //             Swal.fire({
            //                 title: 'Save',
            //                 text: 'Success',
            //                 icon: 'success',
            //                 timer: 1000
            //             })
            //             document.getElementById("modalProduct_btnClose").click();
            //             fetchData();
            //         }
            //     })
        } catch (e) {
            alertError(e);
        }
    }

    const handleUpload = async () => {
        // const formData = new FormData();
        // formData.append('img', img);
        // await axios.post(config.apiPath + '/product/upload', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //         'Authorization': localStorage.getItem('token')
        //     }
        // })
        //     .then((res) => {
        //         if (res.data.newName !== undefined) {
        //             return res.data.newName;
        //         }
        //     })
        //     .catch((e) => alertError(e))

        try {
            const formData = new FormData();
            formData.append('img', img);
            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })
            if (res.data.newName !== undefined){
                return res.data.newName;
            }
        } catch (e) {
            alertError(e);
            return "";
        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        });
        setImg({});
        // setImg(null);
        refImg.current.value = '';
    }

    const handleRemove = async (item) => {
        Swal.fire({
            text: 'remove item',
            title: 'remove',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if(res.isConfirmed){
                await axios.delete(config.apiPath + '/product/remove/' + item.id,config.headers())
                    .then((res) => {
                        if (res.data.message === "success"){
                            Swal.fire({
                                title: 'remove',
                                text: 'remove success',
                                icon: 'success',
                                timer: 1000
                            });
                            fetchData();
                        }
                    })
            }
        }).catch((e) => alertError(e))
    }

    const selectedFile = (inputFile) => {
        if (inputFile !== undefined){
            if (inputFile.length > 0){
                setImg(inputFile[0]);
            }
        }
    }

    const fetchData = async () => {
        try {
            await axios.get(config.apiPath + '/product/list', config.headers())
                .then((res) => {
                    if (res.data.results !== undefined){
                        setProducts(res.data.results)
                    }
                })
            fetchTrash();
        } catch (e) {
            alertError(e);
        }
    }

    const fetchTrash = async () => {
        try {
            await axios.get(config.apiPath + '/product/listTrash', config.headers())
                .then((res) => {
                    if (res.data.results !== undefined){
                        setProductTrash(res.data.results)
                    }
                })
        } catch (e) {
            alertError(e);
        }
    }

    const handleRestore = (item) => {
        Swal.fire({
            text: 'Restore item',
            title: 'Restore',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if(res.isConfirmed){
                await axios.delete(config.apiPath + '/product/restore/' + item.id,config.headers())
                    .then((res) => {
                        if (res.data.message === "success"){
                            Swal.fire({
                                title: 'remove',
                                text: 'remove success',
                                icon: 'success',
                                timer: 1000
                            });
                            fetchData();
                        }
                    })
            }
        }).catch((e) => alertError(e))
    }

    const clearFormExcel = () => {
        refExcel.current.value = '';
        setFileExcel({});
    }
    const selectedFileExcel = (fileInput) => {
        if (fileInput !== undefined){
            if(fileInput.length > 0){
                setFileExcel(fileInput[0]);
            }
        }
    }
    const handleUploadExcel = async () => {
        const formData = new FormData();
        formData.append('fileExcel', fileExcel);
        await axios.post(config.apiPath + '/product/uploadFromExcel', formData,{
            headers: {
                'Content-Type' : 'multipart/form-data',
                'Authorization' : localStorage.getItem('token')
            }
        }).then((res) => {
            if (res.data.message === "success"){
                Swal.fire({
                    title: 'upload file',
                    text: 'upload success',
                    icon: 'success',
                    timer: 1000
                })
                fetchData();
                document.getElementById('modalExcel_btnClose').click();
            }
        }).catch((e) => alertError(e))
    }

    return (
        <>
            <BackOffice>
                <div className="h4">Product</div>
                <button onClick={clearForm} className="btn btn-primary" data-toggle="modal" data-target="#modalProduct">
                    <i className="fa fa-plus mr-2"></i>
                    Add item
                </button>

                <button onClick={clearFormExcel} className="btn btn-success ml-2" data-toggle="modal" data-target="#modalExcel">
                    <i className="fa fa-arrow-down mr-2"></i>
                    Import Excel
                </button>

                <button className="btn btn-secondary ml-2 float-right" data-toggle="modal" data-target="#modalTrash">
                    {/* <i class="fa-regular fa-trash mr-2"></i> */}
                    <i class="fa fa-trash mr-2"></i>
                    Trash
                    ( {productTrash.length} )
                </button>

                <table className="mt-3 table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width="150px">Picture</th>
                            <th>name</th>
                            <th width="150px" className="text-right">cost</th>
                            <th width="150px" className="text-right">price</th>
                            <th width="140px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.slice((productInOnePage * pageIndex) - productInOnePage,productInOnePage * pageIndex).map((item) =>
                            <tr key={item.id}>
                                <td>
                                    {item.img !== ""
                                        ? <img className="img-fluid" src={config.apiPath + '/uploads/' + item.img} alt=""/>
                                        : <img className="img-fluid" src={config.apiPath + '/uploads/defaultPic.png'} alt=""/>}
                                </td>
                                <td>{item.name}</td>
                                <td className="text-right">{item.cost}</td>
                                <td className="text-right">{item.price}</td>
                                <td className="text-center">
                                    <button className="btn btn-primary mr-2" data-toggle="modal" data-target="#modalProduct" onClick={(e) => setProduct(item)}>
                                        <i class="fa fa-edit"></i>
                                    </button>
                                    <button className="btn btn-danger" onClick={(e) => handleRemove(item)}>
                                        <i class="fa fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        ) : <></>}
                    </tbody>
                </table>
                <div className="text-center">
                    <button className="btn" onClick={handlePreviousPage}>&laquo; Previous</button>
                    {pageIndex}
                    <button className="btn" onClick={handleNextPage}>Next &raquo;</button>
                </div>


                <MyModal id="modalProduct" title="Product">
                    <div>
                        <div>Name:</div>
                        <input value={product.name} className="form-control mb-2" placeholder="Name" onChange={(e) => setProduct({...product, name: e.target.value})} />
                    </div>
                    <div>
                        <div>Cost:</div>
                        <input value={product.cost} className="form-control mb-2" placeholder="Cost" onChange={(e) => setProduct({...product, cost: e.target.value})} />
                    </div>
                    <div>
                        <div>Price:</div>
                        <input value={product.price} className="form-control mb-2" placeholder="Price" onChange={(e) => setProduct({...product, price: e.target.value})} />
                    </div>
                    <div>
                        <div>Picture:</div>
                        <div className="m-2">
                            {product.img !== ""
                                    ? <img className="img-fluid" width="200px" src={config.apiPath + '/uploads/' + product.img} alt=""/>
                                    : <></>}
                        </div>
                        <input className="form-control-file mb-2" type="file" ref={refImg} onChange={(e) => selectedFile(e.target.files)}/>
                    </div>
                    <div>
                        <button className="btn btn-primary float-right" onClick={handleSave}>
                            <i class="fa fa-check mr-2"></i>
                            Save
                        </button>
                    </div>
                </MyModal>

                <MyModal id='modalExcel' title='Select File'>
                    <div>Select Excel File</div>
                    <input ref={refExcel} className="form-control-file mt-3" type="file" onChange={(e) => selectedFileExcel(e.target.files)} />

                    <button className="btn btn-primary mt-3 float-right" onClick={handleUploadExcel}>
                        <i class="fa fa-check mr-2"></i>Save
                    </button>
                </MyModal>

                <MyModal id='modalTrash' title='Trash'>
                    <table className="mt-3 table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th width="150px">Picture</th>
                                <th>name</th>
                                <th width="150px" className="text-right">cost</th>
                                <th width="150px" className="text-right">price</th>
                                <th width="140px">Restore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTrash.length > 0 ? productTrash.map((item) =>
                                <tr key={item.id}>
                                    <td>
                                        {item.img !== ""
                                            ? <img className="img-fluid" src={config.apiPath + '/uploads/' + item.img} alt=""/>
                                            : <img className="img-fluid" src={config.apiPath + '/uploads/defaultPic.png'} alt=""/>}
                                    </td>
                                    <td>{item.name}</td>
                                    <td className="text-right">{item.cost}</td>
                                    <td className="text-right">{item.price}</td>
                                    <td className="text-center">
                                        <button className="btn btn-success mr-2" onClick={(e) => handleRestore(item)}>
                                            <i class="fas fa-trash-restore"></i>
                                        </button>
                                    </td>
                                </tr>
                            ) : <></>}
                        </tbody>
                    </table>
                </MyModal>
            </BackOffice>
        </>
    )
}

export default Product;