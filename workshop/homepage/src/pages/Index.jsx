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

    useEffect(() => {
        fetchData();
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
    return (
        <>
        <div className='container mt-3'>
            <nav class="navbar navbar-light bg-light mb-3">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">
                <div className='h3'><span class="badge bg-success">New</span> Product</div>
                </span>
            </div>
            </nav>
            <div class="row row-cols-1 row-cols-md-3 g-4">
                {products.length > 0 ? products.map((item) =>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
                    <div class="card h-100">
                        {item.img !== ""
                                ? <img className="card-img-top" style={{ maxHeight: '170px', minHeight: '170px', height: 'auto', width: 'auto' }} src={config.apiPath + '/uploads/' + item.img} alt=""/>
                                : <img className="card-img-top" style={{ maxHeight: '170px', minHeight: '170px', height: 'auto', width: 'auto' }} src={config.apiPath + '/uploads/defaultPic.png'} alt=""/>}
                        {/* <img src="..." class="card-img-top" alt="..."/> */}
                            <div class="card-body">
                                <h6 class="card-title">{item.name}</h6>
                                <p class="card-text float-end">{parseInt(item.price).toLocaleString('th-TH')} <i class="fa-regular fa-dollar-sign"></i></p>
                            </div>
                            <div class="card-footer">
                                <button className='btn btn-outline-secondary float-end'>
                                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
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