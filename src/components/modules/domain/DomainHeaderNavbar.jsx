import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, Text, NavLink, Flex, Tooltip
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../../assets/css/HeaderSearch.module.css';
import {
    IconBuildingStore,
    IconInfoCircle, IconMap2, IconSearch, IconSettings
} from "@tabler/icons-react";
import {useLocation, useNavigate} from "react-router-dom";

function DomainHeaderNavbar(props) {
    const { pageTitle,pageDescription, roles, currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { link: '/domain', label: t('Domains') },
        { link: '/domain/user', label: t('DomainMasterUser') },
        { link: '/domain/head', label: t('DomainHead') },
        { link: '/domain/sitemap', label: t('Sitemap') },
    ];
    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={location.pathname==link.link ? classes.active :classes.link}
            onClick={(event) => {
                event.preventDefault();
                navigate(link.link)
            }}
        >
            {link.label}
        </a>
    ));

    const menuItems = [
        {
            label: t('Sitemap'),
            path: '/domain/sitemap',
            icon: <IconMap2 style={{ width: rem(14), height: rem(14) }} />,
        },
        {
            label: t('DomainMasterUser'),
            path: '/domain/user',
            icon: <IconBuildingStore style={{ width: rem(14), height: rem(14) }} />,
        },
    ];


    return (
        <>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <Group ml={10}><Text>{pageTitle}</Text>
                        { pageDescription &&
                        <Flex direction={`column`} align={"center"}>
                            <Tooltip
                                label={pageDescription}
                                px={16}
                                py={2}
                                w={320}
                                withArrow
                                multiline
                                position={"right"}
                                c={"white"}
                                bg={'gray.6'}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconInfoCircle size={16} color={"gray"}/>
                            </Tooltip>
                        </Flex>
                        }
                    </Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={'2'} >
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400} mr={'8'}>
                            <Menu.Target>
                                <ActionIcon mt={'4'} variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle height={'12'} width={'12'} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {menuItems.map((item, index) => (
                                    <Menu.Item
                                        key={index}
                                        component="button"
                                        onClick={() => navigate(item.path)}
                                        leftSection={item.icon}
                                    >
                                        {t(item.label)}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default DomainHeaderNavbar;
