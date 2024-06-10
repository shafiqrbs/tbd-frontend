import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, Text
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../../../assets/css/HeaderSearch.module.css';
import {
    IconInfoCircle, IconTrash, IconSearch, IconSettings, IconTable
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function _SalesPurchaseHeaderNavbar(props) {
    const { t, i18n } = useTranslation();
    const links = [
        { link: '/inventory/invoice-batch', label: t('InvoiceBatch') },
        { link: '/inventory/sales', label: t('Sales') },
        { link: '/inventory/sales-invoice', label: t('NewSales') },
        { link: '/inventory/purchase', label: t('Purchase') },
        { link: '/inventory/purchase-invoice', label: t('NewPurchase') },

    ];
    const { pageTitle } = props
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
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
                    <Group><Text>{pageTitle}</Text></Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400} mr={'xs'}>
                            <Menu.Target>
                                <ActionIcon variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle height={'12'} width={'12'} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item href="/inventory/opening-stock"
                                    component="button" onClick={(e) => { navigate('/inventory/opening-stock') }} leftSection={<IconTable style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('OpeningStock')}
                                </Menu.Item>
                                <Menu.Item href="/inventory/opening-approve-stock"
                                    component="button" onClick={(e) => { navigate('/inventory/opening-approve-stock') }} leftSection={<IconTable style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ApproveOpeningStock')}
                                </Menu.Item>
                                <Menu.Item href="/inventory/config"
                                    component="button" onClick={(e) => { navigate('/inventory/config') }} leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('Settings')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default _SalesPurchaseHeaderNavbar;
