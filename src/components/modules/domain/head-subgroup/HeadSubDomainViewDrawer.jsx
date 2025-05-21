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
    IconX,

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

function HeadSubDomainViewDrawer(props) {
    const configData = localStorage.getItem('config-data');

    const adjustment = -28;

    const entityEditData = useSelector((state => state.crudSlice.entityEditData))

    const { headGroupDrawer, setHeadGroupDrawer } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setHeadGroupDrawer(false)
    }



    return (
        <>
            <Drawer.Root title={t('LedgerDetails')} opened={headGroupDrawer} position="right" onClose={closeDrawer} size={'30%'} >
                <Drawer.Overlay />
                <Drawer.Content>

                    <Drawer.Header h={5}>
                        <Drawer.Title>{t('AccountHeadGroupDetails')}</Drawer.Title>
                        <ActionIcon
                            className="ActionIconCustom"
                            radius="xl"
                            color="red.6" size="lg"
                            onClick={closeDrawer}
                        >
                            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Drawer.Header>
                    <Box mb={0} bg={'gray.1'} h={height}>
                        <Box m={'md'} p={'md'} className="boxBackground borderRadiusAll" h={height - 10}>
                            <Box >
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('HeadGroup')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.customerId && entityEditData.customerId}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('AccountCode')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.mobile && entityEditData.mobile}</Grid.Col>
                                </Grid>

                            </Box>

                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default HeadSubDomainViewDrawer;
