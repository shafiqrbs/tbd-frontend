import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title,Group,Burger,Menu,rem
} from "@mantine/core";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import genericCss from '../../../../assets/css/Generic.module.css';
import classes from  '../../../../assets/css/HeaderSearch.module.css';
import SalesTable from "./SalesTable";
import PurchaseForm from "./PurchaseForm";
import SalesUpdateForm from "./SalesUpdateForm.jsx";
import {
    setCustomerFilterData,
    setInsertType,
    setSearchKeyword,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import {getShowEntityData} from "../../../../store/inventory/crudSlice.js";
import GeneralPurchaseForm from "./GeneralPurchaseForm";

import {
    IconInfoCircle,IconTrash,IconSearch,IconSettings
} from "@tabler/icons-react";


const links = [
    { link: '/about', label: 'Features' },
    { link: '/pricing', label: 'Pricing' },
    { link: '/learn', label: 'Learn' },
    { link: '/community', label: 'Community' },
];

function PurchaseInvoice() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const insertType = useSelector((state) => state.crudSlice.insertType)
    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });
        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);

    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData)

    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, []);
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
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    <header className={classes.header}>
                        <div className={classes.inner}>
                            <Group>
                                {t('SalesInformation')}
                            </Group>

                            <Group>
                                <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                                    {items}

                                </Group>
                                <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400}>
                                    <Menu.Target>
                                        <Button>Toggle menu</Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Application</Menu.Label>
                                        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                            Settings
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<IconSearch style={{ width: rem(14), height: rem(14) }} />}
                                            rightSection={
                                                <Text size="xs" c="dimmed">
                                                    ⌘K
                                                </Text>
                                            }
                                        >
                                            Search
                                        </Menu.Item>

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

                    <Box pr={'12'} pl={'12'}>
                        {
                            insertType === 'create' && configData.business_model.slug==='general' &&
                            <GeneralPurchaseForm
                                allowZeroPercentage = {configData.zero_stock}
                                currancySymbol = {configData.currency.symbol}
                            />
                        }
                    </Box>
                </Box>
            }
        </>
    );
}

export default PurchaseInvoice;
