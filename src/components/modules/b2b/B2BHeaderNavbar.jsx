

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
    IconBuildingStore, IconDashboard,
    IconInfoCircle, IconMap2, IconSearch, IconSettings
} from "@tabler/icons-react";
import {useLocation, useNavigate} from "react-router-dom";


function B2BHeaderNavbar(props) {
    const { pageTitle,pageDescription, roles, currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { link: '/b2b/dashboard', label: t('Dashboard') },
        { link: '/b2b/domain', label: t('Domains') },
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


    return (
        <>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <Group ml={10}>
                        <Text>{pageTitle}</Text>
                        { pageDescription &&
                        <Flex mt={'4'}>
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
                                <IconInfoCircle size={18}  color={"gray"}/>
                            </Tooltip>
                        </Flex>
                        }
                    </Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={'2'} >
                            {items}
                        </Group>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default B2BHeaderNavbar;

