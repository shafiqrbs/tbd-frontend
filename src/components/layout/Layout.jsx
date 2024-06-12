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
    /*useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.clear();
            navigate("/login");
        }, 1800000);
        return () => clearTimeout(timeout);
    }, [navigate]);*/



    const headerHeight = 42;
    const footerHeight = 58;
    const padding = 0;
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

