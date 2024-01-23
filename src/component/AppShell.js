import React, { useState } from "react";
import {Link} from "react-router-dom";
import {Sidebar, Menu, MenuItem, SubMenu,menuClasses, sidebarClasses} from 'react-pro-sidebar';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    Paper,
    TextInput,
    MediaQuery,
    Burger,
    useMantineTheme, Autocomplete, ScrollArea, Switch
} from '@mantine/core';
import {HeaderMegaMenu} from "./layout/Header";
import {ArticaleCard} from "./ArticaleCard";
import Example from "./medicine/item/AddItem";


const themes = {
    light: {
        sidebar: {
            backgroundColor: '#ffffff',
            color: '#607489',
        },
        menu: {
            menuContent: '#fbfcfd',
            icon: '#0098e5',
            hover: {
                backgroundColor: '#c5e4ff',
                color: '#44596e',
            },
            disabled: {
                color: '#9fb6cf',
            },
        },
    },
    dark: {
        sidebar: {
            backgroundColor: '#0b2948',
            color: '#8ba1b7',
        },
        menu: {
            menuContent: '#082440',
            icon: '#59d0ff',
            hover: {
                backgroundColor: '#00458b',
                color: '#b6c8d9',
            },
            disabled: {
                color: '#3e5e7e',
            },
        },
    },
};

const hexToRgba = (hex,alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export default function AppShellDemo() {
    // const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const containerHeight = localStorage.getItem('containerHeight');
    console.log(containerHeight);
    const dropdown = (e, type) => {
        document.querySelector("." + type + "-list").classList.toggle("hidden");
        let classExists = document.getElementById("arrow-"+type).classList.contains('bi-chevron-up')
        if (classExists && classExists === true){
            document.getElementById("arrow-"+type).classList.add("bi-chevron-down");
            document.getElementById("arrow-"+type).classList.remove("bi-chevron-up");
        }else {
            document.getElementById("arrow-"+type).classList.add("bi-chevron-up");
            document.getElementById("arrow-"+type).classList.remove("bi-chevron-down");
        }
    }
    const [hasImage, setHasImage] = useState(false);
    const [theme, setTheme] = useState('light');
    const [collapsed, setCollapsed] = useState(false);
    const menuItemStyles = {
        root: {
            fontSize: '13px',
            fontWeight: 400,
        },
        icon: {
            color: themes[theme].menu.icon,
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
        },
        SubMenuExpandIcon: {
            color: '#b6b7b9',
        },
        subMenuContent: ({ level }) => ({
            backgroundColor:
                level === 0
                    ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
                    : 'transparent',
        }),
        button: {
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
            '&:hover': {
                backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
                color: themes[theme].menu.hover.color,
            },
        },
        label: ({ open }) => ({
            fontWeight: open ? 600 : undefined,
        }),
    };
    return (
        <AppShell
            /*styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}*/
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar  hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }}>
                    <Sidebar
                        collapsed={collapsed}
                        breakPoint="md"
                        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, hasImage ? 0.9 : 1)}
                        rootStyles={{
                            color: themes[theme].sidebar.color
                        }}
                    >
                        <Menu menuItemStyles={menuItemStyles} className={'text-left'}>
                            <SubMenu label="Charts">
                                <MenuItem> Pie charts </MenuItem>
                                <MenuItem> Line charts </MenuItem>
                                <MenuItem> Line charts </MenuItem>
                                <MenuItem> Line charts </MenuItem>
                            </SubMenu>
                            <MenuItem> Documentation </MenuItem>
                            <MenuItem> Calendar </MenuItem>
                        </Menu>
                        <Menu menuItemStyles={menuItemStyles} className={'text-left'}>
                            <SubMenu label="Charts">
                                <MenuItem> Pie charts </MenuItem>
                                <MenuItem> Line charts </MenuItem>
                                <SubMenu label="Sales">
                                    <MenuItem> Pie charts </MenuItem>
                                    <MenuItem> Line charts </MenuItem>
                                    <MenuItem> Line charts </MenuItem>
                                    <MenuItem> Line charts </MenuItem>
                                </SubMenu>
                                <MenuItem> Line charts </MenuItem>
                                <MenuItem> Line charts

                                </MenuItem>
                            </SubMenu>
                            <MenuItem> Documentation </MenuItem>
                            <MenuItem> Calendar </MenuItem>
                        </Menu>
                    </Sidebar>
                </Navbar>
            }
            /*aside={
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                        <Sidebar>
                            <Menu>
                                <SubMenu label="Charts">
                                    <MenuItem> Pie charts </MenuItem>
                                    <MenuItem> Line charts </MenuItem>
                                </SubMenu>
                                <MenuItem> Documentation </MenuItem>
                                <MenuItem> Calendar </MenuItem>
                            </Menu>
                        </Sidebar>
                    </Aside>
                </MediaQuery>
            }*/
            footer={
                <Footer height={40} p="xs">
                    Application footer
                </Footer>
            }
            header={
                <Header height={{ base: 50, md: 56 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <HeaderMegaMenu>
                        </HeaderMegaMenu>
                    </div>
                </Header>
            }>
            <Paper>
                <Example></Example>
            </Paper>
        </AppShell>
    );
}