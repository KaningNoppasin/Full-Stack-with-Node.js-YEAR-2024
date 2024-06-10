import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';

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

    useEffect(() => {
        fetchData();
        const itemInCarts = JSON.parse(localStorage.getItem('carts'))
        setCarts(itemInCarts)
        setQuantityCart(itemInCarts.reduce((sum, item) => sum += item.quantity, 0))
    }, [])

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

        localStorage.setItem('carts', JSON.stringify(carts))
        console.log("carts: ",localStorage.getItem('carts'));
        setQuantityCart(carts.reduce((sum, item) => sum += item.quantity, 0))



    }
    return (
        <>
            <div className='container mt-3'>
                <nav className="navbar navbar-light bg-light mb-3">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h1">
                            <div className='h3 float-start'><span className="badge bg-success">New</span> Product</div>
                        </span>
                        <button className="btn btn-outline-secondary" >
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
        </>
    )
}

export default Index