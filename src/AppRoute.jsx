import {Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import './lang/i18next';
import CustomerIndex from "./components/modules/core/customer/CustomerIndex";
import UserIndex from "./components/modules/core/user/UserIndex";
import VendorIndex from "./components/modules/core/vendor/VendorIndex";
function AppRoute() {

    return (
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path="/" element={<Layout/>}>
                <Route path="/sample/">
                    <Route path="" element={<SampleDashboard/>}/>
                </Route>
                <Route path="/core/">
                    <Route path="customer" element={<CustomerIndex/>}/>
                    <Route path="user" element={<UserIndex/>}/>
                    <Route path="vendor" element={<VendorIndex/>}/>
                </Route>
            </Route>
        </Routes>

    )
}

export default AppRoute
