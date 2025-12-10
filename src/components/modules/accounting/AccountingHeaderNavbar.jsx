import React from "react";
import {
    Group,
    Menu,
    rem,
    ActionIcon,
    Text,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import classes from "../../../assets/css/HeaderSearch.module.css";
import {
    IconInfoCircle,
    IconSettings,
} from "@tabler/icons-react";
import {useLocation, useNavigate} from "react-router-dom";

function AccountingHeaderNavbar(props) {
    const {pageTitle} = props;
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        {link: "/accounting/branch/voucher-entry", label: t("BranchVoucherEntry")},
        {link: "/accounting/voucher-entry", label: t("VoucherEntry")},
        {link: "/accounting/ledger", label: t("Ledger")},
        {link: "/accounting/voucher-create", label: t("Voucher")},
    ];
    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={location.pathname == link.link ? classes.active : classes.link}
            onClick={(event) => {
                event.preventDefault();
                navigate(link.link);
            }}
        >
            {link.label}
        </a>
    ));
    return (
        <>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <Group ml={"xs"}>
                        <Text>{pageTitle}</Text>
                    </Group>
                    <Group>
                        <Group
                            ml={50}
                            gap={5}
                            className={classes.links}
                            visibleFrom="sm"
                            mt={2}
                        >
                            {items}
                        </Group>
                        <Menu
                            withArrow
                            arrowPosition="center"
                            trigger="hover"
                            openDelay={100}
                            closeDelay={400}
                            mr={"8"}
                        >
                            <Menu.Target>
                                <ActionIcon
                                    mt={4}
                                    variant="filled"
                                    color="red.5"
                                    radius="xl"
                                    aria-label="Settings"
                                >
                                    <IconInfoCircle height={"12"} width={"12"} stroke={1.5}/>
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>

                                <Menu.Item
                                    href="/accounting/head-group"
                                    component="button"
                                    onClick={(e) => {
                                        navigate("/accounting/head-group");
                                    }}
                                    leftSection={
                                        <IconSettings style={{width: rem(14), height: rem(14)}}/>
                                    }
                                >
                                    {t("Head")}
                                </Menu.Item>
                                <Menu.Item
                                    href="/accounting/head-subgroup"
                                    component="button"
                                    onClick={(e) => {
                                        navigate("/accounting/head-subgroup");
                                    }}
                                    leftSection={
                                        <IconSettings style={{width: rem(14), height: rem(14)}}/>
                                    }
                                >
                                    {t("SubHead")}
                                </Menu.Item>
                                <Menu.Item
                                    href="/accounting/transaction-mode"
                                    component="button"
                                    onClick={(e) => {
                                        navigate("/accounting/transaction-mode");
                                    }}
                                    leftSection={
                                        <IconSettings style={{width: rem(14), height: rem(14)}}/>
                                    }
                                >
                                    {t("Transaction")}
                                </Menu.Item>
                                <Menu.Item
                                    href="/accounting/config"
                                    component="button"
                                    onClick={(e) => {
                                        navigate("/accounting/config");
                                    }}
                                    leftSection={
                                        <IconSettings style={{width: rem(14), height: rem(14)}}/>
                                    }
                                >
                                    {t("Settings")}
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
