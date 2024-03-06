import React from "react";
import {
    rem, Modal, List, ThemeIcon, Grid, Box, useMantineTheme,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck
} from "@tabler/icons-react";

import {useDispatch, useSelector} from "react-redux";

function UserViewModel(props) {
    const {t, i18n} = useTranslation();
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const theme = useMantineTheme();
    const closeModel = () => {
        props.setUserViewModel(false)
    }

    return (
        <Modal opened={props.userViewModel} onClose={closeModel} title={t('UserInformation')} size="75%" overlayProps={{
            color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
            opacity: 0.9,
            blur: 3,
        }}>
            <Box m={'md'}>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('UserName')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.username && entityEditData.username}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Mobile')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.mobile && entityEditData.mobile}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Email')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.email && entityEditData.email}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Address')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.address && entityEditData.address}</Grid.Col>
                </Grid>

            </Box>
        </Modal>

    );
}

export default UserViewModel;
