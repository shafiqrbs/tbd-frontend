import React from "react";
import {
    rem, Modal, List, ThemeIcon, useMantineTheme, Grid, ScrollArea, Box
} from "@mantine/core";
import {useTranslation} from 'react-i18next';


function _VendorViewModel(props) {
    const {t, i18n} = useTranslation();
    
    let showData = {}
    if (props.vendorObject){
        showData = props.vendorObject
    }
    const theme = useMantineTheme();

    const closeModel = () => {
        props.setVendorViewModel(false)
    }

    return (
        <Modal opened={props.vendorViewModel} onClose={closeModel} title={t('VendorInformation')} size="75%" overlayProps={{
            color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
            opacity: 0.9,
            blur: 3,
        }}>
            <Box m={'md'}>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('CompanyName')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showData && showData.company_name && showData.company_name}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showData && showData.name && showData.name}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Mobile')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showData && showData.mobile && showData.mobile}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Email')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showData && showData.email && showData.email}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Address')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showData && showData.address && showData.address}</Grid.Col>
                </Grid>
            </Box>
        </Modal>

    );
}

export default _VendorViewModel;
