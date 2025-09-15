import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { AppShell, LoadingOverlay } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";
import { useAuth } from "../context/AuthContext"; // Import the context

const Layout = () => {
    const [isOnline, setNetworkStatus] = useState(navigator.onLine);
    const { height, width } = useViewportSize();
    const location = useLocation();
    const paramPath = window.location.pathname;
    const { user, configData, isLoading } = useAuth(); // Use auth context

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

    const headerHeight = 42;
    const footerHeight = 58;
    const padding = 0;
    const mainAreaHeight = height - headerHeight - footerHeight - padding;

    if (isLoading) {
        return <LoadingOverlay visible={true} />;
    }

    if (!user) {
        return <Navigate replace to="/login" />;
    }

    if (!configData) {
        // Optional: handle missing config data
        console.log("Config data not available");
        return <div>Loading configuration...</div>;
    }

    return (
        <AppShell padding="0">
            <AppShell.Header height={headerHeight} bg='gray.0'>
                <Header isOnline={isOnline} configData={configData} mainAreaHeight={mainAreaHeight}/>
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