import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import MyModal from '../components/MyModal';

function Index() {
    const alertError = (error) => {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }

    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    const [quantityCart, setQuantityCart] = useState(0)
    // const [sumQty, setSumQty] = useState(0)
    const [sumPrice, setSumPrice] = useState(0)

    useEffect(() => {
        fetchData();
        const itemInCarts = JSON.parse(localStorage.getItem('carts'))
        if (itemInCarts !== null){
            setCarts(itemInCarts)
            // setQuantityCart(itemInCarts?.reduce((sum, item) => sum += item.quantity, 0))
            // computePriceAndPrice();
            // setSumPrice(itemInCarts?.reduce((sum, item) => sum += item.price * item.quantity,0));
        }else{
            localStorage.setItem('carts', JSON.stringify(carts))
        }
    }, [])

    useEffect(() => {
        setQuantityCart(carts.reduce((sum, item) => sum += item.quantity, 0))
        setSumPrice(carts?.reduce((sum, item) => sum += item.price * item.quantity,0));
    },[carts])

    const fetchData = async () => {
        await axios.get(config.apiPath + '/product/list')
            .then((res) => {
                if (res.data.results !== undefined) {
                    setProducts(res.data.results)
                }
            })
            .catch((e) => alertError(e));
    }

    const addToCart = (newItem) => {
        setCarts((prevCarts) => {
            // Check if the item already exists in the cart
            const itemIndex = prevCarts.findIndex(item => item.id === newItem.id);

            if (itemIndex !== -1) {
                // Create a new array with updated quantity for the existing item
                const updatedCarts = prevCarts.map((item, index) =>
                    index === itemIndex
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
                localStorage.setItem('carts', JSON.stringify(updatedCarts))
                return updatedCarts;
            } else {
                // Add the new item to the cart
                localStorage.setItem('carts', JSON.stringify([...prevCarts, newItem]))
                return [...prevCarts, newItem];
            }
        })
        // * and then call useEffect
        // setCarts(JSON.parse(localStorage.getItem('carts')));

        // localStorage.setItem('carts', JSON.stringify(carts))
        // setQuantityCart(carts.reduce((sum, item) => sum += item.quantity, 0))
        // setQuantityCart(prevQty => prevQty += 1);
        // setSumPrice(carts?.reduce((sum, item) => sum += item.price * item.quantity,0));
    }

    // const computePriceAndPrice = () => {
    //     setSumQty(carts.reduce((sum, item) => sum += item.quantity,0));
    //     setSumPrice(carts.reduce((sum, item) => sum += item.price,0));
    // }



    return (
        <>
            <div className='container mt-3'>
                <nav className="navbar navbar-light bg-light mb-3">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h1">
                            <div className='h3 float-start'><span className="badge bg-success">New</span> Product</div>
                        </span>
                        <button data-bs-toggle="modal" data-bs-target="#modalCart" className="btn btn-outline-secondary" >
                        <i className="fa fa-shopping-cart" aria-hidden="true"></i> {quantityCart > 100 ? "99+" : quantityCart}
                        </button>
                    </div>
                </nav>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.length > 0 ? products.map((item) =>
                        <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <div className="card h-100">
                                {item.img !== ""
                                    ? <img className="card-img-top" style={{ maxHeight: '170px', minHeight: '170px', height: 'auto', width: 'auto' }} src={config.apiPath + '/uploads/' + item.img} alt="" />
                                    : <img className="card-img-top" style={{ maxHeight: '170px', minHeight: '170px', height: 'auto', width: 'auto' }} src={config.apiPath + '/uploads/defaultPic.png'} alt="" />}
                                {/* <img src="..." class="card-img-top" alt="..."/> */}
                                <div className="card-body">
                                    <h6 className="card-title">{item.name}</h6>
                                    <p className="card-text float-end">{parseInt(item.price).toLocaleString('th-TH')} <i class="fa-regular fa-dollar-sign"></i></p>
                                </div>
                                <div className="card-footer">
                                    <button className='btn btn-outline-secondary float-end' onClick={(e) => addToCart({id:item.id,img: item.img,name: item.name,price: item.price, quantity:1})}>
                                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                    </button>
                                    {/* <small class="text-muted">Last updated 3 mins ago</small> */}
                                </div>
                            </div>
                        </div>
                    ) : <></>}
                </div>
            </div>
            <MyModal id="modalCart" title="MyCart">
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Picture</th>
                                <th className='text-end'>Price</th>
                                <th className='text-end'>QTY</th>
                                <th width="60px">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            { carts.length > 0 ? carts.map((item) =>
                                <tr>
                                    <td>{item.name}</td>
                                    <td>
                                    {item.img !== ""
                                            ? <img className="card-img-top" style={{ height: '70px', width: 'auto' }} src={config.apiPath + '/uploads/' + item.img} alt="" />
                                            : <img className="card-img-top" style={{ height: '70px', width: 'auto' }} src={config.apiPath + '/uploads/defaultPic.png'} alt="" />}
                                    </td>
                                    <td className='text-end'>{parseInt(item.price).toLocaleString('th-TH')}</td>
                                    <td className='text-end'>{item.quantity}</td>
                                    <td className='text-center'>
                                        <button className='btn btn-danger'>
                                            <i className='fa fa-times'></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                            : <></>}
                        </tbody>
                    </table>
                    <div className='text-center'>
                        Quantity : {quantityCart} | Price : {parseInt(sumPrice).toLocaleString('th-TH')} Bath
                    </div>
                    <div className='text-end mt-2'>
                        <button className='btn btn-primary'
                                onClick={() => document.getElementById("modalCart_btnClose").click()}
                                data-bs-toggle="modal" data-bs-target="#modalForm"
                        >
                            <i class="fa fa-check me-2" aria-hidden="true"></i>Confirm
                        </button>
                    </div>
            </MyModal>


            <MyModal id="modalForm" title="Form">
            <form className="row g-3 needs-validation" novalidate>
                <div className='col-md-12 alert alert-warning'>
                    <i className="fa fa-university me-2" aria-hidden="true"></i>
                    SCB. 999-999-999
                </div>
                <div className="col-md-12 mt-3">
                    <label for="validationCustom01" className="form-label"><i className="fa fa-user me-2" aria-hidden="true"></i>User Name</label>
                    <input type="text" className="form-control" id="validationCustom01" required/>
                </div>

                <div className="col-md-12 mt-3">
                    <label for="validationCustom01" className="form-label"><i className="fa fa-phone me-2" aria-hidden="true"></i>Tel.</label>
                    <input type="text" className="form-control" id="validationCustom01" required/>
                </div>

                <div className="col-md-12 mt-3">
                    <label for="validationCustom01" className="form-label"><i className="fa fa-envelope me-2" aria-hidden="true"></i>Address</label>
                    <input type="text" className="form-control" id="validationCustom01" required/>
                </div>

                <div className="col-md-12 mt-3">
                    <label for="validationCustom01" className="form-label"><i className="fa fa-calendar me-2" aria-hidden="true"></i>Date</label>
                    <input type="date" className="form-control" id="validationCustom01" required/>
                </div>

                <div className="col-md-12 mt-3">
                    <label for="validationCustom01" className="form-label"><i className="fa fa-clock me-2" aria-hidden="true"></i>Time</label>
                    <input type="text" className="form-control" id="validationCustom01" placeholder='Ex. 00.00' required/>
                </div>

                <div className="col-12 text-end">
                    <button className="btn btn-primary" type="submit"><i className="fa fa-check me-2" aria-hidden="true"></i>Submit</button>
                </div>
            </form>
            </MyModal>
        </>
    )
}

export default Index