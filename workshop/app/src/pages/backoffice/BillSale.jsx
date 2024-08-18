import { useState } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import dayjs from "dayjs";

function BillSale(){
    const [billSale, setBillSale] = useState([]);
    const [billSaleDetails, setBillSaleDetails] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);
    const [sumQuantity, setSumQuantity] = useState(0);

    useEffect(() => {
        fetchData();
    },[])

    const alertError = (error) => {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + "/api/sale/list",config.headers());
            if (res.data.results !== undefined){
                setBillSale(res.data.results);
            }
        } catch (e) {
            alertError(e);
        }
    }

    const openModalInfo = async (id) => {
        try {
            const res = await axios.get(config.apiPath + "/api/sale/billInfo/" + id, config.headers());
            if (res.data.results !== undefined){
                setBillSaleDetails(res.data.results);
                setSumPrice(
                    res.data.results.reduce((sum, item) => sum += item.price,0)
                )
                setSumQuantity(
                    res.data.results.reduce((sum, item) => sum += item.quantity,0)
                )
            }
        } catch (e) {
            alertError(e);
        }
    }

    const handlePay = async (id) => {
        try {
            await Swal.fire({
                title: "Pay Confirm",
                text: "Are you sure",
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async (res) => {
                if (res.isConfirmed){
                    const res = await axios.put(config.apiPath + "/api/sale/updateStatusToPay/" + id, config.headers());
                    if (res.data.message === "success"){
                        Swal.fire({
                            title:"save",
                            text: "save success",
                            icon: "success"
                        })
                        fetchData();
                    }
                }
            })
        } catch (e) {
            alertError(e);
        }
    }
    const handleSend = async (item) => {
        try {
            if (item.status !== "pay") throw new Error("Please Confirm Payment");
            await Swal.fire({
                title: "Send Confirm",
                text: "Are you sure",
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async (res) => {
                if (res.isConfirmed){
                    const res = await axios.put(config.apiPath + "/api/sale/updateStatusToSend/" + item.id, config.headers());
                    if (res.data.message === "success"){
                        Swal.fire({
                            title:"save",
                            text: "save success",
                            icon: "success"
                        })
                        fetchData();
                    }
                }
            })
        } catch (e) {
            alertError(e);
        }
    }
    const handleCancel = async (id) => {
        try {
            await Swal.fire({
                title: "Cancel",
                text: "Are you sure",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true
            }).then(async (res) => {
                if (res.isConfirmed){
                    const res = await axios.put(config.apiPath + "/api/sale/updateStatusToCancel/" + id, config.headers());
                    if (res.data.message === "success"){
                        Swal.fire({
                            title:"save",
                            text: "save success",
                            icon: "success"
                        })
                        fetchData();
                    }
                }
            })
        } catch (e) {
            alertError(e);
        }
    }

    const displayStatusText = (status) => {
        if (status === 'wait'){
            return <div className="badge bg-warning">Waiting for payment</div>
        }
        else if (status === 'pay'){
            return <div className="badge bg-warning">Waiting for Send</div>
        }
        else if (status === 'send'){
            return <div className="badge bg-success">Complete</div>
        }else{
            return <div className="badge bg-red">Cancel</div>
        }
    }


    return (
        <>
        <BackOffice>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Bill Sale</div>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <th>Customer</th>
                            <th>Tel.</th>
                            <th>Address</th>
                            <th>payDate</th>
                            <th>patTime</th>
                            <th>Status</th>
                            <th width="300px">
                            List | PayConfirm | Complete | Cancel
                            </th>
                        </thead>
                        <tbody>
                            {billSale.length > 0 ? billSale.map((item) =>
                                <tr key={item.id}>
                                    <td>{item.customerName}</td>
                                    <td>{item.customerPhone}</td>
                                    <td>{item.customerAddress}</td>
                                    <td>{dayjs(new Date(item.payDate)).format('YYYY-MM-DD')}</td>
                                    <td>{item.payTime}</td>
                                    <td>{displayStatusText(item.status)}</td>
                                    <td>
                                        <button className="btn btn-secondary mr-1" data-toggle="modal" data-target="#modalInfo" onClick={e => openModalInfo(item.id)}>
                                            <i className="fa fa-file-alt mr-2"></i>
                                        </button>
                                        <button className="btn btn-info mr-1" onClick={e => handlePay(item.id)} disabled={ item.status !== "wait" ? true : false}>
                                            <i className="fa fa-check mr-2"></i>
                                        </button>
                                        <button className="btn btn-success mr-1" onClick={e => handleSend(item)} disabled={item.status === "send" || item.status === "cancel" ? true : false}>
                                            <i className="fa fa-file mr-2" aria-hidden="true"></i>
                                        </button>
                                        <button className="btn btn-danger mr-1" onClick={e => handleCancel(item.id)} disabled={ item.status !== "wait" || item.status === "pay" ? true : false}>
                                            <i className="fa fa-times mr-2" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                </tr>
                            ) : <></>}
                        </tbody>
                    </table>

                </div>
            </div>
            <MyModal id="modalInfo" title="BillList">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>List</th>
                            <th>Image</th>
                            <th className="text-right">Price</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSaleDetails.length > 0 ? billSaleDetails.map(item =>
                            <tr key={item.id}>
                                <td>
                                    {item.Product.name}
                                </td>
                                <td>
                                    {item.Product.img !== ""
                                                    ? <img className="card-img-top" style={{ height: '70px', width: 'auto' }} src={config.apiPath + '/uploads/' + item.Product.img} alt="" />
                                                    : <img className="card-img-top" style={{ height: '70px', width: 'auto' }} src={config.apiPath + '/uploads/defaultPic.png'} alt="" />}
                                </td>
                                <td className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                <td className="text-right">{item.quantity}</td>
                            </tr>
                        ) : <></>}
                    </tbody>
                </table>
                <div className="text-center">Price : {sumPrice.toLocaleString('th-TH')} Bath | Qty : {sumQuantity}</div>
            </MyModal>
        </BackOffice>
        </>
    )
}

export default BillSale;