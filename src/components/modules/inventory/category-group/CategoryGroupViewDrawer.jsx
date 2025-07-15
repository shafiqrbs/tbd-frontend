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



function CategoryGroupViewDrawer(props) {

    const { viewDrawer, setViewDrawer } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setViewDrawer(false)
    }
    const entityEditData = useSelector((state) => state.inventoryCrudSlice.entityEditData)

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
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('CategoryGroup')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.category_group && entityEditData.category_group}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('CategoryName')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Status')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{entityEditData && entityEditData.status && entityEditData.status}</Grid.Col>
                                </Grid>
                            </Box>

                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default CategoryGroupViewDrawer;
