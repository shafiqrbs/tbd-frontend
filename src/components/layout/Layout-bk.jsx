import React, {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import Header from "./Header";
import {AppShell} from "@mantine/core";
import {useDisclosure, useViewportSize} from "@mantine/hooks";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";


function Layout_bk() {
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

export default Layout_bk;