import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { AppShell, LoadingOverlay, Text, Button } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import {useStockItems} from "../global-hook/hooks/useStockItems.js";
import {useConfig} from "../global-hook/hooks/useConfig.js";
import {useCustomers} from "../global-hook/hooks/useCustomers.js";
import {useTransactionModes} from "../global-hook/hooks/useTransactionModes.js";
import {useUsers} from "../global-hook/hooks/useUsers.js";
import {useVendors} from "../global-hook/hooks/useVendors.js";

const Layout = () => {
    const [isOnline, setNetworkStatus] = useState(navigator.onLine);
    const { height } = useViewportSize();
    const paramPath = window.location.pathname;
    const { user, configData, isLoading, logout } = useAuth();

    // HOOK CALL EXAMPLE FOR ALL LOCAL STORAGE API
    /*const { data: stockItems ,loading: stockItemsLoading,error: stockItemError, refetch: stockItemsRefetch } = useStockItems();
    const { data: config } = useConfig(user?.id);
    const { data: customers } = useCustomers(user?.id);
    const { data: transactionModes } = useTransactionModes(user?.id);
    const { data: users } = useUsers(user?.id);
    const { data: vendors } = useVendors(user?.id);
    console.log(stockItems,stockItemsLoading,stockItemError)*/


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