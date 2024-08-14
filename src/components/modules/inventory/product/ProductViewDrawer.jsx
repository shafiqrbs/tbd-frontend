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



function ProductViewDrawer(props) {

    const { viewDrawer, setViewDrawer } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104
    const closeDrawer = () => {
        setViewDrawer(false)
    }
    const showEntityData = useSelector((state) => state.crudSlice.showEntityData)

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
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Name')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.product_name && showEntityData.product_name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('AlternativeProductName')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.alternative_name && showEntityData.alternative_name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('ProductType')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.product_type && showEntityData.product_type}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('ProductSku')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col span={'auto'}>{showEntityData && showEntityData.sku && showEntityData.sku}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Category')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.category_name && showEntityData.category_name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Unit')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.unit_name && showEntityData.unit_name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Brand')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.brand_name && showEntityData.brand_name}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('OpeningQuantity')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.opening_quantity && showEntityData.opening_quantity}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('MinimumQuantity')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.min_quantity && showEntityData.min_quantity}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('ReorderQuantity')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.reorder_quantity && showEntityData.reorder_quantity}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('PurchasePrice')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.purchase_price && showEntityData.purchase_price}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('SalesPrice')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.sales_price && showEntityData.sales_price}</Grid.Col>
                                </Grid>
                                <Grid columns={24}>
                                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('Barcode')}</Grid.Col>
                                    <Grid.Col span={'1'}>:</Grid.Col>
                                    <Grid.Col
                                        span={'auto'}>{showEntityData && showEntityData.barcode && showEntityData.barcode}</Grid.Col>
                                </Grid>
                            </Box>

                        </Box>
                    </Box>
                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default ProductViewDrawer;
