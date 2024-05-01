import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, NavLink
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../assets/css/FooterNavbar.module.css';
import {
    IconInfoCircle, IconTrash, IconSearch, IconSettings
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";


function FooterNavbar() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure(false);

    const links = [
        { link: '/inventory/sales-invoice', label: t('Sales') },
        { link: '/inventory/purchase-invoice', label: t('Purchase') },
        { link: '/inventory/product', label: t('Product') },
        { link: '/accounting/voucher-entry', label: t('Accounting') },
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

    const leftLinks = [
        { link: '/', label: t('Home') },
        { link: '/sitemap', label: t('Sitemap') },
    ];

    const leftItems = leftLinks.map((link) => (
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
            <footer className={classes.footer} mt={'xs'}>
                <div className={classes.inner} mt={'xs'}>
                    <Group gap={5} className={classes.links} visibleFrom="sm">
                        {leftItems}
                    </Group>
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
export default FooterNavbar;
