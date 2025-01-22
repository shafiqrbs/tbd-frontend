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



function __UserViewDrawer(props) {

    const { viewDrawer, setViewDrawer,userObject } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setViewDrawer(false)
    }

    return (
        <>
            <Drawer.Root opened={viewDrawer} position="right" onClose={closeDrawer} size={'30%'} >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>
                            <Text fw={'600'} fz={'16'}>
                            {t('UserDetails')}
                            </Text>
                            </Drawer.Title>
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
                        <Box p={'md'} className="boxBackground borderRadiusAll" h={height}>
                            <Box >
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{userObject && userObject.name && userObject.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('UserName')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{userObject && userObject.username && userObject.username}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Mobile')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{userObject && userObject.mobile && userObject.mobile}</Grid.Col>
                                </Grid>

                                <Grid columns={24}>
                                    <Grid.Col span={'8'} align={'left'} fw={'600'} fz={'14'}>{t('Email')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{userObject && userObject.email && userObject.email}</Grid.Col>
                                </Grid>
                            </Box>

                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default __UserViewDrawer;
