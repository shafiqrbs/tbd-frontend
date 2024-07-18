import React from "react";
import {useOutletContext} from "react-router-dom";
import {
    Modal, Box, Grid,
    useMantineTheme
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import {useDispatch, useSelector} from "react-redux";

function AccountingSettingViewModal(props) {
    const {
        productionSettingView,
        setProductionSettingViewModal,
        productionSettingData,
        setProductionSettingViewData
    } = props
    const {t, i18n} = useTranslation();
    const theme = useMantineTheme();

    const CloseModal = () => {
        setProductionSettingViewModal(false);
        setProductionSettingViewData([]);
    }

    return (
        <>
            <Modal
                opened={productionSettingView}
                onClose={CloseModal}
                title={t('ProductionSettingModel')}
                size="75%" overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
                opacity: 0.9,
                blur: 3,
            }}
            >
                <Box m={'md'}>
                    <Grid columns={24}>
                        <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('SettingName')}</Grid.Col>
                        <Grid.Col span={'1'}>:</Grid.Col>
                        <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.name && productionSettingData.name}</Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('SettingType')}</Grid.Col>
                        <Grid.Col span={'1'}>:</Grid.Col>
                        <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.setting_type_name && productionSettingData.setting_type_name}</Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Status')}</Grid.Col>
                        <Grid.Col span={'1'}>:</Grid.Col>
                        <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.status == 1 ? 'Active' : 'Inactive'}</Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Status')}</Grid.Col>
                        <Grid.Col span={'1'}>:</Grid.Col>
                        <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.created && productionSettingData.created}</Grid.Col>
                    </Grid>


                </Box>

            </Modal>
        </>
    );
}

export default AccountingSettingViewModal;
