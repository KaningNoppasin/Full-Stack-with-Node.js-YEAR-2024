import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import MyModal from '../components/MyModal';
import dayjs from 'dayjs'

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
    const [sumPrice, setSumPrice] = useState(0)
    const [customer, setCustomer] = useState({payDate: dayjs(new Date()).format('YYYY-MM-DD')});
    const [customerValidateError, setCustomerValidateError] = useState({});

    useEffect(() => {
        fetchData();
        const itemInCarts = JSON.parse(localStorage.getItem('carts'))
        if (itemInCarts !== null){
            setCarts(itemInCarts);
        }else{
            localStorage.setItem('carts', JSON.stringify(carts))
        }
    }, [])

    useEffect(() => {
        setQuantityCart(carts?.reduce((sum, item) => sum += item.quantity, 0))
        setSumPrice(carts?.reduce((sum, item) => sum += item.price * item.quantity,0));
        localStorage.setItem('carts', JSON.stringify(carts));
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
                return updatedCarts;
            } else {
                // Add the new item to the cart
                return [...prevCarts, newItem];
            }
        })
    }

    const adjustQuantity = (targetItem, count) => {
        setCarts((prevCarts) => {
            // Check if the item already exists in the cart
            const itemIndex = prevCarts.findIndex(item => item.id === targetItem.id);

            if (itemIndex !== -1) {
                const currentQuantity = prevCarts[itemIndex].quantity;

                // Check if the quantity will reach zero or below
                if (currentQuantity + count <= 0) {
                    // Call the handleRemove function if the quantity is zero or less
                    handleRemove(targetItem);
                    return prevCarts;
                } else {
                    // Update the quantity of the existing item
                    const updatedCarts = prevCarts.map((item, index) =>
                        index === itemIndex
                            ? { ...item, quantity: item.quantity + count }
                            : item
                    );
                    return updatedCarts;
                }
            } else {
                // Add the new item to the cart
                return [...prevCarts, targetItem];
            }
        })
    }

    const handleRemove = (item) => {
        Swal.fire({
            title: "Remove",
            text: "Do you want to remove",
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then((res) => {
            if (res.isConfirmed){
                setCarts(prevCarts => {
                    for (let i = 0;i < prevCarts.length;i++){
                        if (prevCarts[i].id === item.id) prevCarts.splice(i, 1);
                    }
                    return [...prevCarts];
                })
            }
        }).catch(e => alertError(e))
    }

    const handleSave = async (event) => {
        event.preventDefault();
        const currentValidate = validateForm();
        setCustomerValidateError(currentValidate)
        // * customerValidateError.length undefined when {}
        // * customerValidateError isn't update then use validateForm()
        if (Object.keys(currentValidate).length === 0){
            try {
                if (Object.keys(carts).length === 0) throw new Error("carts is empty");
                const payload = {
                    customerName: customer.name,
                    customerPhone: customer.phone,
                    customerAddress: customer.address,
                    payDate: customer.payDate,
                    payTime: customer.payTime,
                    carts: carts
                }
                await axios.post(config.apiPath + "/api/sale/save", payload)
                    .then((res) => {
                        if (res.data.message === "success"){
                            localStorage.removeItem('carts');
                            Swal.fire({
                                title: "Success",
                                text: "OK",
                                icon: 'success',
                                timer: 1000
                            })
                            setCustomerValidateError({});
                            setCustomer({payDate: dayjs(new Date()).format('YYYY-MM-DD')});

                            setQuantityCart(0);
                            setCarts([]);
                            document.getElementById("modalForm_btnClose").click();
                        }
                    }).catch(e => alertError(e))
            } catch (e) {
                alertError(e);
            }
        }
    }

    const validateForm = () => {
        const err = {};
        if (!customer.name) err.name = "Name is required"
        if (!customer.phone) err.phone = "Tel. is required"
        if (!customer.address) err.address = "Adress is required"
        if (!customer.payTime) err.payTime = "Pay Time is required"
        return err;
    }



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
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                    {item.img !== ""
                                            ? <img className="card-img-top" style={{ height: '70px', width: 'auto' }} src={config.apiPath + '/uploads/' + item.img} alt="" />
                                            : <img className="card-img-top" style={{ height: '70px', width: 'auto' }} src={config.apiPath + '/uploads/defaultPic.png'} alt="" />}
                                    </td>
                                    <td className='text-end'>{parseInt(item.price).toLocaleString('th-TH')}</td>
                                    <td className='text-center' width="120px">
                                        <button type="button" class="btn btn-outline-secondary btn-sm me-2" onClick={e => adjustQuantity(item, 1)}><i className="fas fa-plus"></i></button>
                                        {item.quantity}
                                        <button type="button" class="btn btn-outline-secondary btn-sm ms-2" onClick={e => adjustQuantity(item, -1)}><i className="fas fa-minus"></i></button>
                                    </td>
                                    <td className='text-center'>
                                        <button className='btn btn-danger' onClick={(e) => handleRemove(item)}>
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
                            <i className="fa fa-check me-2" aria-hidden="true"></i>Confirm
                        </button>
                    </div>
            </MyModal>


            <MyModal id="modalForm" title="Form">
            <form className="row g-3 needs-validation" onSubmit={handleSave} noValidate>
                <div className='col-md-12 alert alert-warning'>
                    <i className="fa fa-university me-2" aria-hidden="true"></i>
                    SCB. 999-999-999
                </div>
                <div className="col-md-12 mt-3">
                    <label htmlFor="validationDefault01" className="form-label"><i className="fa fa-user me-2" aria-hidden="true"></i>User Name</label>
                    <input type="text" className={`form-control ${customerValidateError.name ? "is-invalid" : customer.name ? "is-valid" : ""}`} id="validationDefault01" value={customer.name ? customer.name : ""} onChange={e => setCustomer({...customer , name:e.target.value})} required/>
                    {customerValidateError.name && <div className="invalid-feedback">{customerValidateError.name}</div>}
                </div>

                <div className="col-md-12 mt-3">
                    <label htmlFor="validationDefault02" className="form-label"><i className="fa fa-phone me-2" aria-hidden="true"></i>Tel.</label>
                    <input type="text" className={`form-control ${customerValidateError.phone ? "is-invalid" : customer.phone ? "is-valid" : ""}`} id="validationDefault02" value={customer.phone ? customer.phone : ""} onChange={e => setCustomer({...customer , phone:e.target.value})} required/>
                    {customerValidateError.phone && <div className="invalid-feedback">{customerValidateError.phone}</div>}
                </div>

                <div className="col-md-12 mt-3">
                    <label htmlFor="validationDefault03" className="form-label"><i className="fa fa-envelope me-2" aria-hidden="true"></i>Address</label>
                    <input type="text" className={`form-control ${customerValidateError.address ? "is-invalid" : customer.address ? "is-valid" : ""}`} id="validationDefault03" value={customer.address ? customer.address : ""} onChange={e => setCustomer({...customer , address:e.target.value})} required/>
                    {customerValidateError.address && <div className="invalid-feedback">{customerValidateError.address}</div>}
                </div>

                <div className="col-md-12 mt-3">
                    <label htmlFor="validationDefault04" className="form-label"><i className="fa fa-calendar me-2" aria-hidden="true"></i>Pay Date</label>
                    <input type="date"  className={`form-control ${customerValidateError.payDate ? "is-invalid" : ""}`} id="validationDefault04" value={customer.payDate} onChange={e => setCustomer({...customer , payDate:e.target.value})} required/>
                </div>

                <div className="col-md-12 mt-3">
                    <label htmlFor="validationDefault05" className="form-label"><i className="fa fa-clock me-2" aria-hidden="true"></i>Pay Time</label>
                    <input type="text" className={`form-control ${customerValidateError.payTime ? "is-invalid" : customer.payTime ? "is-valid" : ""}`} id="validationDefault05" placeholder='Ex. 00.00' value={customer.payTime ? customer.payTime : ""} onChange={e => setCustomer({...customer , payTime:e.target.value})} required/>
                    {customerValidateError.payTime && <div className="invalid-feedback">{customerValidateError.payTime}</div>}
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