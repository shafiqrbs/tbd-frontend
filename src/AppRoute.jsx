import {Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import './lang/i18next';
import CustomerIndex from "./components/modules/core/customer/CustomerIndex";
import UserIndex from "./components/modules/core/user/UserIndex";
import VendorIndex from "./components/modules/core/vendor/VendorIndex";
import ConfigurationIndex from "./components/modules/inventory/configuraton/ConfigurationIndex";
import CategoryGroupIndex from "./components/modules/inventory/category-group/CategoryGroupIndex";
import CategoryIndex from "./components/modules/inventory/category/CategoryIndex";
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
                <Route path="/inventory/">
                    <Route path="config" element={<ConfigurationIndex/>}/>
                    <Route path="category-group" element={<CategoryGroupIndex/>}/>
                    <Route path="category" element={<CategoryIndex/>}/>
                </Route>
            </Route>
        </Routes>

    )
}

export default AppRoute
