import { useEffect, useState } from "react";
import './Hello.css';
import MyComponent from "./components/MyComponent";
import axios from 'axios';
import config from "./config";
// import { dayjs } from "dayjs";
const dayjs = require('dayjs');

function Hello(){
    const [name, setName] = useState("kob");
    const [email, setEmail] = useState("");

    const [user, setUser] = useState({});

    const [income, setIncome] = useState(100_000);
    //* 100000 100_000 1e6

    const [payDate, setPayDate] = useState(new Date());

    const handleSignIn = () => {
        // console.log(name, email);
        console.log(user);
    }

    const changeName = () => {
        setName("Top");
    }

    const [product, setProduct] = useState(['java', 'php', 'c#', 'react', 'node.js']);

    const showName = () => {
        console.log(name);
    }

    const [value, setValue] = useState('100');

    const [items, setItems] = useState([]);

    useEffect(() => {
        console.log("start");
    }, [items]);
    // * => when items Change useEffect will call

    const newItem = () => {
        setItems([1, 3, 5, 7, 9]);
    }

    const getMethod = async () => {
        try {
            await axios.get("http://localhost:3001/book/orderBy");
        } catch (e) {
            console.log(e);
        }
    }

    const postMethod = async () => {
        try {
            await axios.post('http://localhost:3001/book/search',{
                keyword : "basic"
            })
        } catch (e) {
            console.log(e);
        }
    }

    const putMethod = async () => {
        try {
            await axios.put('http://localhost:3001/book/update/4');
        } catch (e) {
            console.log(e);
        }
    }

    const deleteMethod = async () => {
        try {
            await axios.delete('http://localhost:3001/orderDetail/remove/1');
        } catch (e) {
            console.log(e);
        }
    }

    const userInfo = async () => {
        try {
            // await axios.get('http://localhost:3001/user/info/',{
            //     headers: {
            //         'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjoia29iIiwibGV2ZWwiOiJhZG1pbiIsImlhdCI6MTcxNjM3MzM2NiwiZXhwIjoxNzE2NDU5NzY2fQ.zSNdzmYtNAEn19dY0pyLD2ZLcWVBire5ilArctNcJrQ'
            //     }
            // });
            await axios.get(config.apiPath +'/user/info/', config.headersValue);
        } catch (e) {
            console.log(e);
        }
    }

    const [fileSelected, setFileSelected] = useState({});

    const selectedFile = (fileInput) => {
        if (fileInput !== undefined){
            if (fileInput.length > 0){
                setFileSelected(fileInput[0]);
            }
        }
    }

    const uploadFile = async () => {
        try {
            const formData = new FormData();
            formData.append('myFile', fileSelected);

            await axios.post(config.apiPath + '/book/testUpload', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <>
            <div>Hello {name}</div>
            <button onClick={changeName}>Click Here</button>

            {product.map((item) =>
                <>
                    {/* <div>Name is</div> */}
                    <div>Name is {item}</div>
                </>
            )}

            {product.length > 0 ? <div>Have</div> : <div>Not Have</div>}

            <input onChange={(e) => {setName(e.target.value)}} />
            <button onClick={showName}>Show Name</button>


            <select onChange={(e) => setValue(e.target.value)}>
                <option value="100">Java</option>
                <option value="200">PHP</option>
                <option value="300">Node.js</option>
            </select>
            <div>{value}</div>

            <input type="checkbox" onClick={(e) => setValue(e.target.checked)} />Agree
            {value ? <div>Checked</div> : <div>unChecked</div>}

            <div>useEffect Example</div>
            <button onClick={newItem}>
                Add Item
            </button>
            {/* Day 10 */}

            <div style={{ backgroundColor: 'red', color: 'white', padding: '20px'}}>Hello</div>


            <div className="myClass"><i className="fa fa-home"></i>Hello</div>

            <div className="bg-danger text-white p-4 h4"><i className="fa fa-home"></i>Hello</div>
            <MyComponent name="KK" age="39"/>

            <div className="container p-5">
                <div>
                    <div>Name</div>
                    {/* <input className="form-control" onChange={e => setName(e.target.value)} /> */}
                    <input className="form-control" onChange={e => setUser({...user ,name: e.target.value})} />
                </div>
                <div className="mt-3">
                    <div>Email</div>
                    {/* <input className="form-control" onChange={e => setEmail(e.target.value)} /> */}
                    <input className="form-control" onChange={e => setUser({...user ,email: e.target.value})} />
                </div>
                <div>
                    <button className="btn btn-primary mt-3" onClick={handleSignIn}>
                        <i className="fa fa-check me-2"></i>Sign In
                    </button>
                </div>
            </div>

            <div>{income}</div>
            <div>{income.toLocaleString('th-TH')}</div>
            <div>{parseInt("100000").toLocaleString('th-TH')}</div>

            <div>{dayjs(payDate).format('DD/MM/YYYY')}</div>

            <div>
                <button className="btn btn-primary mb-2" onClick={getMethod}>
                    Call API GET Method
                </button>
            </div>

            <div>
                <button className="btn btn-primary mb-2" onClick={postMethod}>Call Api Post</button>
            </div>
            <div>
                <button className="btn btn-primary mb-2" onClick={putMethod}>Call Api Put</button>
            </div>
            <div>
                <button className="btn btn-primary mb-2" onClick={deleteMethod}>Call Api Delete</button>
            </div>
            <div>
                <button className="btn btn-primary mb-2" onClick={userInfo}>User Info</button>
            </div>
            <div>
                <input type="file" onChange={e => selectedFile(e.target.files)} />
                <button className="btn btn-primary" onClick={uploadFile}>
                    Upload Now
                </button>
            </div>

            <div className="row">
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 1</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 2</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 3</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 4</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 5</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 6</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 7</div>
                <div className="col-xxl-2 col-xl-2 col-lg-3 col-md col-sm-6 col-xs-12">Cell 8</div>
            </div>
        </>
    )
}

export default Hello;