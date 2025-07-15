import React from "react";
import {useOutletContext} from "react-router-dom";
import {
    ActionIcon,
    Grid, Box, Drawer,
    Text,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import {
    IconX,
} from "@tabler/icons-react";

function _ParticularViewModal(props) {
    const {
        productionSettingView,
        setProductionSettingViewModal,
        productionSettingData,
        setProductionSettingViewData
    } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
        const { t, i18n } = useTranslation();
        const height = mainAreaHeight; //TabList height 104
    const CloseModal = () => {
        setProductionSettingViewModal(false);
        setProductionSettingViewData([]);
    }

    return (
        <>
            <Drawer.Root opened={productionSettingView} position="right" onClose={CloseModal} size={'30%'} >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>
                            <Text fw={'600'} fz={'16'}>
                                {t('ProductionSetting')}
                            </Text>
                        </Drawer.Title>
                        <ActionIcon
                            className="ActionIconCustom"
                            radius="xl"
                            color='var( --theme-remove-color)'  size="lg"
                            onClick={CloseModal}
                        >
                            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Drawer.Header>
                    <Box mb={0} bg={'gray.1'} h={height}>
                        <Box p={'md'} className="boxBackground borderRadiusAll" h={height}>
                            <Box >
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('SettingName')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.name && productionSettingData.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('SettingType')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.setting_type_name && productionSettingData.setting_type_name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Status')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.status == 1 ? 'Active' : 'Inactive'}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Status')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                            span={'auto'}>{productionSettingData && productionSettingData.created && productionSettingData.created}</Grid.Col>
                                </Grid>
                            </Box>

                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root >
        </>
    );
}

export default _ParticularViewModal;
