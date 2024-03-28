import React from "react";
import {
    rem, Modal, List, ThemeIcon, useMantineTheme, Grid, ScrollArea, Box
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck
} from "@tabler/icons-react";

import {useDispatch, useSelector} from "react-redux";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

function SalesViewModel(props) {
    const {t, i18n} = useTranslation();
    const showEntityData = useSelector((state) => state.crudSlice.showEntityData)
    const theme = useMantineTheme();
    // console.log(showEntityData)

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
                    <Grid.Col span={'auto'}>{showEntityData && showEntityData.company_name && showEntityData.company_name}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showEntityData && showEntityData.name && showEntityData.name}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Mobile')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showEntityData && showEntityData.mobile && showEntityData.mobile}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Email')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showEntityData && showEntityData.email && showEntityData.email}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Address')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{showEntityData && showEntityData.address && showEntityData.address}</Grid.Col>
                </Grid>

            </Box>
        </Modal>

    );
}

export default SalesViewModel;
