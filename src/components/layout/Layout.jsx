import React, {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation,useOutletContext} from "react-router-dom";
import Header from "./Header";
import {AppShell, Grid} from "@mantine/core";
import {useDisclosure, useViewportSize} from "@mantine/hooks";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";
import ProductForm from "../modules/inventory/product/ProductForm";
import ProductUpdateForm from "../modules/inventory/product/ProductUpdateForm";

console.log(window.location.href);

function Layout() {
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure(false);
    const [navbarOpened, {toggle: toggleNavbar}] = useDisclosure(true);
    const [rightSidebarOpened, {toggle: toggleRightSideBar}] = useDisclosure(false);
    const {height, width} = useViewportSize();
    const [isOnline, setNetworkStatus] = useState(navigator.onLine);

    const user = localStorage.getItem("user");
    const location = useLocation();
    const paramPath = window.location.pathname;

    console.log(paramPath);

    if(!user){
        return <Navigate replace to="/login"/>;
    }else{
        /*let userGroup = JSON.parse(user).user_group;

        if (userGroup==='admin'){
            return <Navigate replace to="/core/user"/>;
        }else {
            return <Navigate replace to="/"/>;
        }*/


        // const tempProducts = localStorage.getItem('temp-sales-products');
        // setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])

        /*if(location.pathname === '/'){
            return <Navigate replace to="/dashboard"/>;
        }*/

    }

    useEffect(() => {
        return () => {
            window.addEventListener("online", () => setNetworkStatus(true));
            window.addEventListener("offline", () => setNetworkStatus(false));
        };
    }, []);

    const headerHeight = 42;
    const footerHeight = 36;
    const mainAreaHeight = height - (headerHeight + footerHeight + 16); //default padding 20

    return (
        <>
            <AppShell
                header={{height: headerHeight}}
                footer={{height: footerHeight}}
                /*navbar={{
                    width: 200,
                    breakpoint: "sm",
                    collapsed: {mobile: !mobileOpened, desktop: !navbarOpened},
                }}*/
                /*aside={{
                    width: 88,
                    breakpoint: "sm",
                    collapsed: {mobile: !mobileOpened, desktop: rightSidebarOpened},
                }}*/
                padding="0"
            >
                <AppShell.Header bg={`gray.0`}>
                    <Header
                        isOnline={isOnline}
                        navbarOpened={navbarOpened}
                        toggleNavbar={toggleNavbar}
                        rightSidebarOpened={rightSidebarOpened}
                        toggleRightSideBar={toggleRightSideBar}
                    />
                </AppShell.Header>
               {/*
                <AppShell.Navbar p="xs">
                    <Navbar/>
                </AppShell.Navbar>
                */}
                <AppShell.Main>
                    {
                        paramPath !== '/' ?
                            <Outlet context={{isOnline, mainAreaHeight}}/>
                            :
                            <MainDashboard height={mainAreaHeight} />
                    }

                </AppShell.Main>
                {/*<AppShell.Shortcut p="xs">
                    <Shortcut/>
                </AppShell.Shortcut>*/}
                <AppShell.Footer>
                    <Footer/>
                </AppShell.Footer>
            </AppShell>
        </>
    );
}

export default Layout;
