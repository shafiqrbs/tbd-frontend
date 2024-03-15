import React from "react";
import {
    Modal, useMantineTheme, Grid, Box
} from "@mantine/core";
import {useTranslation} from 'react-i18next';

import {useSelector} from "react-redux";

function ProductViewModel(props) {
    const {t, i18n} = useTranslation();
    const showEntityData = useSelector((state) => state.crudSlice.showEntityData)
    const theme = useMantineTheme();

    const closeModel = () => {
        props.setProductViewModel(false)
    }

    return (
        <Modal opened={props.productViewModel} onClose={closeModel} title={t('ProductInformation')} size="75%"
               overlayProps={{
                   color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
                   opacity: 0.9,
                   blur: 3,
               }}>

            <Box m={'md'}>
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
        </Modal>

    );
}

export default ProductViewModel;
