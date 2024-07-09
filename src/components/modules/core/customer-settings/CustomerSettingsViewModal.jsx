import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, Group, Text, ScrollArea, Modal, rem, Box, Grid,
    useMantineTheme
} from "@mantine/core";
import { useTranslation } from "react-i18next";

import {
    IconCheck, IconXboxX
} from "@tabler/icons-react";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { useDispatch, useSelector } from "react-redux";

function CustomerSettingsViewModal(props) {
    // const { openedModel, open, close } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();

    const entityEditData = useSelector((state) => state.inventoryCrudSlice.entityEditData)

    const theme = useMantineTheme();

    const CloseModal = () => {
        props.setCategoryViewModal(false);
    }

    return (
        <>
            <Modal
                opened={props.categoryViewModal}
                onClose={CloseModal}
                title={t('CategoryGroupModel')}
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
                        <Grid.Col span={'auto'}>{entityEditData && entityEditData.category_group && entityEditData.category_group}</Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('SettingType')}</Grid.Col>
                        <Grid.Col span={'1'}>:</Grid.Col>
                        <Grid.Col span={'auto'}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Status')}</Grid.Col>
                        <Grid.Col span={'1'}>:</Grid.Col>
                        <Grid.Col span={'auto'}>{entityEditData && entityEditData.status && entityEditData.status}</Grid.Col>
                    </Grid>


                </Box>

            </Modal>
        </>
    );
}

export default CustomerSettingsViewModal;
