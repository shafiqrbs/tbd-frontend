import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, Text, NavLink
} from "@mantine/core";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import classes from  '../../../assets/css/HeaderSearch.module.css';
import {
    IconInfoCircle,IconTrash,IconSearch,IconSettings
} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";


function DomainHeaderNavbar(props) {
    const { pageTitle,roles,currancySymbol,allowZeroPercentage } = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
    const links = [
        { link: '/domain', label: t('Domains') },
    ];
    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
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
                    <Group ml={10}><Text>{pageTitle}</Text></Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400}>
                            <Menu.Target>
                                <ActionIcon variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle height={'12'} width={'12'} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                        </Menu>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default DomainHeaderNavbar;
