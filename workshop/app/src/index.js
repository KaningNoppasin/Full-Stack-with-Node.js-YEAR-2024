import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SignIn from './pages/backoffice/SignIn';
import Home from './pages/backoffice/Home';
import Product from './pages/backoffice/Product';
import BillSale from './pages/backoffice/BillSale';
import Dashboard from './pages/backoffice/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn/>
  },{
    path: '/home',
    element: <Home/>
  },{
    path: '/product',
    element: <Product/>
  },{
    path: '/billSale',
    element: <BillSale/>
  },{
    path: '/dashboard',
    element: <Dashboard/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
  // <React.StrictMode>
    // {/* <App /> */}
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
