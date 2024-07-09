import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer,
    Flex
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconDeviceFloppy,
    IconPrinter,
    IconCheck,

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import CustomerSettingsForm from "../customer-settings/CustomerSettingsForm.jsx";




function CustomerViewDrawer(props) {
    const configData = localStorage.getItem('config-data');

    const adjustment = -28;

    const entityEditData = useSelector((state => state.crudSlice.entityEditData))

    const { viewDrawer, setViewDrawer } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setViewDrawer(false)
    }



    return (
        <>
            <Drawer.Root title={t('CustomerDetailsData')} opened={viewDrawer} position="right" onClose={closeDrawer} size={'30%'} >
                <Drawer.Overlay />
                <Drawer.Content>

                    <Drawer.Header>
                        <Drawer.Title>{t('CustomerDetailsData')}</Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                    <Box mb={0} bg={'gray.1'} h={height}>
                        <Box m={'md'} p={'md'} className="boxBackground borderRadiusAll" h={height - 10}>
                            <Box pt={'xs'}>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('CustomerId')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.customerId && entityEditData.customerId}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Mobile')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.mobile && entityEditData.mobile}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('AlternativeMobile')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.alternative_mobile && entityEditData.alternative_mobile}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Email')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.email && entityEditData.email}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('ReferenceId')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.reference_id && entityEditData.reference_id}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Created')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.created && entityEditData.created}</Grid.Col>
                                </Grid>
                            </Box>

                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default CustomerViewDrawer;
