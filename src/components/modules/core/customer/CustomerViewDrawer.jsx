import React from "react";
import { useOutletContext } from "react-router-dom";
import {
    ActionIcon,
    Grid, Box, Drawer,
    Text,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconX,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";




function CustomerViewDrawer(props) {

    const entityEditData = useSelector((state => state.crudSlice.entityEditData))


    const { viewDrawer, setViewDrawer, customerObject } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setViewDrawer(false)
    }

    let showData = {}
    if (customerObject) {
        showData = customerObject
    }

    return (
        <>
            <Drawer.Root opened={viewDrawer} position="right" onClose={closeDrawer} size={'30%'} >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>
                            <Text fw={'600'} fz={'16'}>
                                {t('CustomerDetailsData')}
                            </Text>
                        </Drawer.Title>
                        <ActionIcon
                            className="ActionIconCustom"
                            radius="xl"
                            color='var( --theme-remove-color)'  size="lg"
                            onClick={closeDrawer}
                        >
                            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Drawer.Header>
                    <Box mb={0} bg={'gray.1'} h={height}>
                        <Box p={'md'} className="boxBackground borderRadiusAll" h={height}>
                            <Box >
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('CustomerId')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.id && showData.id}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.name && showData.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Mobile')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.mobile && showData.mobile}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('AlternativeMobile')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.alternative_mobile && showData.alternative_mobile}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Email')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.email && showData.email}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('ReferenceId')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.reference_id && showData.reference_id}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Created')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showData && showData.created_date && showData.created_date}</Grid.Col>
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
