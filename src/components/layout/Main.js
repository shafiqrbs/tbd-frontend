import React from "react";
import {Outlet} from 'react-router-dom';
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import {Navigate, useLocation, useNavigate} from "react-router";
import LeftMenuBK from "./LeftMenuBK";

function Main() {
    const user = localStorage.getItem("user_token");
    const location = useLocation();

    if(!user){
        return <Navigate replace to="/login"/>;
    }else{
        if(location.pathname === '/'){
            return <Navigate replace to="/dashboard"/>;
        }
    }
    return (
        <>
            <div className="App">
                <div className="flex flex-col h-screen">
                    <Header/>
                    <div className="flex flex-1 overflow-hidden">
                        <LeftMenu/>
                        {/*<LeftMenuBK/>*/}
                        <Outlet/>
                        {/*<Sidebar/>*/}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}

export default Main