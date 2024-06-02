/*
import React, {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import Header from "./Header";
import {AppShell, Grid} from "@mantine/core";
import {useDisclosure, useViewportSize} from "@mantine/hooks";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";

function Layout() {
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure(false);
    const [navbarOpened, {toggle: toggleNavbar}] = useDisclosure(true);
    const [rightSidebarOpened, {toggle: toggleRightSideBar}] = useDisclosure(false);
    const {height, width} = useViewportSize();
    const [isOnline, setNetworkStatus] = useState(navigator.onLine);

    const user = localStorage.getItem("user");
    const location = useLocation();
    const paramPath = window.location.pathname;
    if(!user){
        return <Navigate replace to="/login"/>;
    }else{
        /!*let userGroup = JSON.parse(user).user_group;

        if (userGroup==='admin'){
            return <Navigate replace to="/core/user"/>;
        }else {
            return <Navigate replace to="/"/>;
        }*!/


        // const tempProducts = localStorage.getItem('temp-sales-products');
        // setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])

        /!*if(location.pathname === '/'){
            return <Navigate replace to="/dashboard"/>;
        }*!/

    }

    const navigate = useNavigate();

    // Automatically log the user out after 1 minute
    setTimeout(() => {
        localStorage.clear();
        navigate("/login");
    }, 60000); // 60000 milliseconds = 1 minute

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

                <AppShell.Main>
                    {
                        paramPath !== '/' ?
                            <Outlet context={{isOnline, mainAreaHeight}}/>
                            :
                            <MainDashboard height={mainAreaHeight} />
                    }

                </AppShell.Main>

                <AppShell.Footer>
                    <Footer/>
                </AppShell.Footer>
            </AppShell>
        </>
    );
}

export default Layout;
*/



import React, {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useDisclosure, useViewportSize} from "@mantine/hooks";
import {AppShell} from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";

const Layout = () => {
    const [isOnline, setNetworkStatus] = useState(navigator.onLine);
    const {height, width} = useViewportSize();
    const navigate = useNavigate();
    const location = useLocation();
    const paramPath = window.location.pathname;

    // check authentication
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (!user) {
        return <Navigate replace to="/login" />;
    }

    // Handle network status
    useEffect(() => {
        const handleNetworkStatus = () => setNetworkStatus(window.navigator.onLine);
        window.addEventListener('offline', handleNetworkStatus);
        window.addEventListener('online', handleNetworkStatus);
        return () => {
            window.removeEventListener('online', handleNetworkStatus);
            window.removeEventListener('offline', handleNetworkStatus);
        };
    }, []);

    // Automatically log the user out after 30 minute
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.clear();
            navigate("/login");
        }, 1800000);
        return () => clearTimeout(timeout);
    }, [navigate]);



    const headerHeight = 42;
    const footerHeight = 36;
    const padding = 16;
    const mainAreaHeight = height - headerHeight - footerHeight - padding;

    return (
        <AppShell padding="0">
            <AppShell.Header height={headerHeight} bg='gray.0'>
                <Header isOnline={isOnline} />
            </AppShell.Header>
            <AppShell.Main>
                {paramPath !== '/' ? <Outlet context={{isOnline, mainAreaHeight}}/> : <MainDashboard height={mainAreaHeight} />}
            </AppShell.Main>
            <AppShell.Footer height={footerHeight}>
                <Footer />
            </AppShell.Footer>
        </AppShell>
    );
};

export default Layout;

