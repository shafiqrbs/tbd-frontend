import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, Text, NavLink
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../../../assets/css/HeaderSearch.module.css';
import {
    IconInfoCircle, IconTrash, IconSearch, IconSettings
} from "@tabler/icons-react";
import {useLocation, useNavigate} from "react-router-dom";


function AccountingHeaderNavbar(props) {
    const { pageTitle, roles, currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { link: '/production/items', label: t('ProductionItems') },
        { link: '/production/setting', label: t('ProductionSetting') },
        { link: '/inventory/category-group', label: t('ProductionConfiguration') },
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
                    <Group ml={10}><Text>{pageTitle}</Text></Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={'2'}>
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400} mr={'8'}>
                            <Menu.Target>
                                <ActionIcon mt={'4'} variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle height={'12'} width={'12'} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item href="/production/setting"
                                    component="button" onClick={(e) => { navigate('/production/setting') }} leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ProductionSetting')}
                                </Menu.Item>
                                <Menu.Item href="/inventory/config"
                                    component="button" onClick={(e) => { navigate('/inventory/config') }} leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ProductionConfiguration')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default AccountingHeaderNavbar;
