import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from 'axios';
import config from "../config";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const alertError = (error) => {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.apiPath + '/user/info', config.headers())
                .then((res) => {
                    if (res.data.result !== undefined){
                        setUser(res.data.result);
                    }
                })
                .catch((err) => {
                    alertError(err);
                    navigate('/');
                })
        } catch (e) {
            alertError(e);
        }
    }

    const handleSignOut = async () => {
        try {
            await Swal.fire({
                title: 'Sign Out',
                text: 'Are you sure ?',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then((res) => {
                if (res.isConfirmed){
                    localStorage.removeItem('token');
                    navigate('/');
                }
            });
        } catch (e) {
            alertError(e);
        }
    }
    return (
        <>
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                <a href="index3.html" class="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}} />
                    <span class="brand-text font-weight-light">AdminLTE 3</span>
                </a>

                <div class="sidebar">
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div class="info">
                            {/* <a href="#" class="d-block">Alexander Pierce</a> */}
                            <a href="#" class="d-block">{user.name}</a>
                        </div>
                        <div class="info">
                            <button className="btn btn-danger" onClick={handleSignOut}>
                                {/* <i className="fa fa-times mr-1 "></i> */}
                                <span class="brand-text font-weight-light">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    <div class="form-inline">
                        <div class="input-group" data-widget="sidebar-search">
                            <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div class="input-group-append">
                                <button class="btn btn-sidebar">
                                    <i class="fas fa-search fa-fw"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            <li class="nav-header">Menu</li>
                            <li class="nav-item">
                                {/* <a href="pages/calendar.html" class="nav-link"> */}
                                {/* <a href="/product" class="nav-link"> */}
                                <Link to="/product" class="nav-link">
                                    {/* <i class="nav-icon far fa-calendar-alt"></i> */}
                                    <i class="nav-icon fa-box mr-2"></i>
                                    <p>
                                        สินค้า
                                        <span class="badge badge-info right">2</span>
                                    </p>
                                </Link>
                                {/* </a> */}
                            </li>
                            <li class="nav-item">
                                {/* <a href="pages/gallery.html" class="nav-link"> */}
                                <Link to="/billSale" class="nav-link">
                                    <i class="nav-icon fa fa-list"></i>
                                    <p>
                                        BillSale
                                    </p>
                                </Link>
                                {/* </a> */}
                            </li>
                            <li class="nav-item">
                                <a href="pages/kanban.html" class="nav-link">
                                    <i class="nav-icon fas fa-columns"></i>
                                    <p>
                                        Kanban Board
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;