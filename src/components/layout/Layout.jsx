import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { AppShell, LoadingOverlay, Text, Button } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const [isOnline, setNetworkStatus] = useState(navigator.onLine);
    const { height } = useViewportSize();
    const paramPath = window.location.pathname;
    const { user, configData, isLoading, logout } = useAuth();

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

    // Handle missing config data more gracefully
    if (!configData) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Text size="xl" mb="md">Configuration data not available</Text>
                <Text mb="lg">Please try logging in again or contact support.</Text>
                <Button onClick={logout} color="red">
                    Logout and Try Again
                </Button>
            </div>
        );
    }

    return (
        <AppShell padding="0">
            <AppShell.Header height={headerHeight} bg='gray.0'>
                <Header isOnline={isOnline} configData={configData} mainAreaHeight={mainAreaHeight}/>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet context={{isOnline, mainAreaHeight}}/>
            </AppShell.Main>
            <AppShell.Footer height={footerHeight}>
                <Footer />
            </AppShell.Footer>
        </AppShell>
    );
};

export default Layout;