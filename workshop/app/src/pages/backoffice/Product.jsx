import { useEffect, useState } from "react";
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

    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const handleSave = async () => {
        try {
            // setProduct({...product, img: ""});
            product.img = "";
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);
            await axios.post(config.apiPath + '/product/create', product, config.headers())
                .then((res) => {
                    if (res.data.message === 'success'){
                        Swal.fire({
                            title: 'Save',
                            text: 'Success',
                            icon: 'success',
                            timer: 1000
                        })
                        document.getElementById("modalProduct_btnClose").click();
                        fetchData();
                    }
                })
        } catch (e) {
            alertError(e);
        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        })
    }

    const fetchData = async () => {
        try {
            await axios.get(config.apiPath + '/product/list', config.headers())
                .then((res) => {
                    if (res.data.result !== undefined){
                        setProducts(res.data.result)
                    }
                })
        } catch (e) {
            alertError(e);
        }
    }

    return (
        <>
            <BackOffice>
                <div className="h4">Product</div>
                <button onClick={clearForm} className="btn btn-primary" data-toggle="modal" data-target="#modalProduct">
                    <i className="fa fa-plus mr-2"></i>
                    Add item
                </button>
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
                        <input className="form-control-file mb-2" type="file" />
                    </div>
                    <div>
                        <button className="btn btn-primary float-right" onClick={handleSave}>
                            <i class="fa fa-check mr-2"></i>
                            Save
                        </button>
                    </div>
                </MyModal>
            </BackOffice>
        </>
    )
}

export default Product;