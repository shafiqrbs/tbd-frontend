import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconDeviceFloppy,
    IconPrinter,
    IconCheck, IconX,

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import CustomerSettingsForm from "../customer-settings/CustomerSettingsForm.jsx";


function CustomerGroupDrawer(props) {
    const configData = localStorage.getItem('config-data');

    const adjustment = -28;

    const { saveId } = props

    const { groupDrawer, setGroupDrawer } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeModel = () => {
        setGroupDrawer(false)
    }



    return (
        <>
            <Drawer.Root opened={groupDrawer} position="right" onClose={closeModel} size={'30%'}  >
                <Drawer.Overlay />
                <Drawer.Content>
                    {/* <ScrollArea h={height + 76} scrollbarSize={2} type="never" bg={'gray.1'}>
                        <Drawer.Header>
                            <ActionIcon
                                style={{
                                    position: 'absolute', 
                                    top: '50%',
                                    transform: 'translate(-5px, -50%)',
                                    zIndex: 1000, 
                                }}
                                color="red.6" size="lg"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                            <Box style={{
                                position: 'absolute', 
                                top: '50%',
                                transform: 'translate(50px, -50%)',
                                zIndex: 1000, 
                            }}>
                                <Drawer.Title>{t('AddCustomerGroup')}</Drawer.Title>
                            </Box>
                            <Drawer.CloseButton />
                        </Drawer.Header>
                        <Box m={8} mb={0}>
                            <CustomerSettingsForm adjustment={adjustment} />
                        </Box>
                    </ScrollArea> */}

                    <ScrollArea h={height + 76} scrollbarSize={2} type="never" bg={'gray.1'}>
                        <Drawer.Header>

                            <Drawer.Title>{t('AddCustomerGroup')}</Drawer.Title>
                            <ActionIcon
                                className="ActionIconCustom"
                                radius="xl"
                                color="red.6" size="lg"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                        </Drawer.Header>
                        <Box m={8} mb={0}>
                            <CustomerSettingsForm adjustment={adjustment} saveId={saveId} />
                        </Box>
                    </ScrollArea>

                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default CustomerGroupDrawer;
