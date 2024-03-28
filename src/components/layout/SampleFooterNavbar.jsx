import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title,Group,Burger,Menu,rem,ActionIcon
} from "@mantine/core";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import classes from  '../../assets/css/FooterNavbar.module.css';
import {
    IconInfoCircle,IconTrash,IconSearch,IconSettings
} from "@tabler/icons-react";
const links = [
    { link: '/about', label: 'Features' },
    { link: '/pricing', label: 'Pricing' },
    { link: '/learn', label: 'Learn' },
    { link: '/community', label: 'Community' },
];

function SampleFooterNavbar() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </a>
    ));
    return (
        <>
            <footer className={classes.footer}>
                <div className={classes.inner}>
                    <Group>Left-Side</Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                            {items}
                        </Group>
                    </Group>
                </div>
            </footer>
        </>
    );
}

export default SampleFooterNavbar;
