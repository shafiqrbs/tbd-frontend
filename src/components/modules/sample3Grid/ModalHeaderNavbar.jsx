import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../../assets/css/HeaderSearch.module.css'
import {
    IconInfoCircle, IconTrash, IconSearch, IconSettings
} from "@tabler/icons-react";
const links = [
    { link: '/sales', label: 'Sales' },
    { link: '/pricing', label: 'Sales Return' },
    { link: '/learn', label: 'Stock' },
    { link: '/community', label: 'Add Sales' },
];

function ModalHeaderNavbar(props) {
    const { pageTitle, roles, currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
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
            <header className={classes.header}>
                <div className={classes.inner}>
                    <Group>{pageTitle}</Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400}>
                            <Menu.Target>
                                <ActionIcon variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Application</Menu.Label>
                                <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    Settings
                                </Menu.Item>
                                {/*<Menu.Item
                                            leftSection={<IconSearch style={{ width: rem(14), height: rem(14) }} />}
                                            rightSection={
                                                <Text size="xs" c="dimmed">
                                                    ⌘K
                                                </Text>
                                            }
                                        >
                                            Search
                                        </Menu.Item>*/}

                                <Menu.Divider />

                                <Menu.Label>Danger zone</Menu.Label>

                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                >
                                    Delete my account
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default ModalHeaderNavbar;
