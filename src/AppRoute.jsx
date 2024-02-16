import {useEffect, useState} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import './lang/i18next';
import CustomerIndex from "./components/modules/core/customer/CustomerIndex";
function AppRoute() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    return (
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path="/" element={<Layout/>}>
                <Route path="/sample/">
                    <Route path="" element={<SampleDashboard/>}/>
                </Route>
                <Route path="/core/">
                    <Route path="customer" element={<CustomerIndex/>}/>
                </Route>
            </Route>
        </Routes>

    )
}

export default AppRoute
