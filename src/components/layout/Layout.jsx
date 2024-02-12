import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { AppShell } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [navbarOpened, { toggle: toggleNavbar }] = useDisclosure(true);
  const [rightSidebarOpened, { toggle: toggleRightSideBar }] = useDisclosure(false);
  const { height, width } = useViewportSize();
  const [isOnline, setNetworkStatus] = useState(navigator.onLine);

  useEffect(() => {
    return () => {
      window.addEventListener("online", () => setNetworkStatus(true));
      window.addEventListener("offline", () => setNetworkStatus(false));
    };
  }, []);

  const headerHeight = 60;
  const footerHeight = 30;
  const mainAreaHeight = height - (headerHeight + footerHeight + 20); //default padding 20

  return (
    <>
      <AppShell
        header={{ height: headerHeight }}
        footer={{ height: footerHeight }}
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !navbarOpened },
        }}
        aside={{
          width: 50,
          breakpoint: "md",
          collapsed: { mobile: !mobileOpened, desktop: !rightSidebarOpened },
        }}
        padding="xs"
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

        <AppShell.Navbar p="xs">
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet context={{ isOnline, mainAreaHeight }} />
        </AppShell.Main>

        <AppShell.Aside p="xs">Aside</AppShell.Aside>

        <AppShell.Footer p="5">
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}

export default Layout;
