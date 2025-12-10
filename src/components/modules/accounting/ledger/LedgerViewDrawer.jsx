import React from "react";
import {useOutletContext} from "react-router-dom";
import {ActionIcon, Grid, Box, Drawer,} from "@mantine/core";
import {useTranslation} from 'react-i18next';

import {IconX} from "@tabler/icons-react";
import {useSelector} from "react-redux";

function LedgerViewDrawer(props) {
    const entityEditData = useSelector((state => state.crudSlice.entityEditData))

    const {ledgerViewDrawer, setLedgerViewDrawer} = props
    const {isOnline, mainAreaHeight} = useOutletContext();
    const {t, i18n} = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setLedgerViewDrawer(false)
    }

    return (
        <>
            <Drawer.Root title={t('LedgerDetails')} opened={ledgerViewDrawer} position="right" onClose={closeDrawer}
                         size={'30%'}>
                <Drawer.Overlay/>
                <Drawer.Content>

                    <Drawer.Header h={5}>
                        <Drawer.Title>{t('LedgerDetails')}</Drawer.Title>
                        <ActionIcon
                            className="ActionIconCustom"
                            radius="xl"
                            color='var( --theme-remove-color)' size="lg"
                            onClick={closeDrawer}
                        >
                            <IconX style={{width: '70%', height: '70%'}} stroke={1.5}/>
                        </ActionIcon>
                    </Drawer.Header>
                    <Box mb={0} bg={'gray.1'} h={height}>
                        <Box m={'md'} p={'md'} className="boxBackground borderRadiusAll" h={height - 10}>
                            <Box>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('HeadGroup')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{entityEditData && entityEditData.customerId && entityEditData.customerId}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'}
                                              fz={'14'}>{t('AccountCode')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{entityEditData && entityEditData.mobile && entityEditData.mobile}</Grid.Col>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root>
        </>

    );
}

export default LedgerViewDrawer;
