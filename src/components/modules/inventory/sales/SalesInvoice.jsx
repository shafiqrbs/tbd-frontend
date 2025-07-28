import React from 'react';
import {Box, Grid, Progress} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getLoadingProgress } from '../../../global-hook/loading-progress/getLoadingProgress.js';
import _WholeSaleGenericInvoiceForm from './whole-sale/_GenericInvoiceForm.jsx';
import _SalesPurchaseHeaderNavbar from '../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx';
import _GenericPosForm from './_GenericPosForm';
import Navigation from "../common/Navigation";
import _GenericInvoiceForm from "../purchase/_GenericInvoiceForm";

function SalesInvoice() {
    const { t } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType);
    const progress = getLoadingProgress();

    // Load and parse config safely
    let domainConfigData = null;
    try {
        const configRaw = localStorage.getItem('domain-config-data');
        domainConfigData = configRaw ? JSON.parse(configRaw) : null;
    } catch (e) {
        console.error('Failed to parse domain-config-data from localStorage', e);
    }

    const inventoryConfig = domainConfigData?.inventory_config;
    const allowZeroStock = inventoryConfig?.zero_stock ?? false;
    const currencySymbol = inventoryConfig?.currency?.symbol ?? '';
    const businessModelSlug = inventoryConfig?.business_model?.slug;
    const domainId = inventoryConfig?.domain_id;
    const isSMSActive = inventoryConfig?.is_active_sms ?? false;
    const isZeroReceiveAllow = inventoryConfig?.is_zero_receive_allow ?? false;

    const isDistributionModel = businessModelSlug === 'distribution';
    const isCreateMode = insertType === 'create';

    return (
        <>
            {progress !== 100 && (
                <Progress
                    color='var(--theme-primary-color-6)'
                    size="sm"
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            )}
            {progress === 100 && domainConfigData && (
                <Box>
                    <_SalesPurchaseHeaderNavbar
                        pageTitle={t('SalesInvoice')}
                        roles={t('Roles')}
                        configData={inventoryConfig}
                        allowZeroPercentage={allowZeroStock}
                        currencySymbol={currencySymbol}
                    />
                    <Box p={"8"}>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={1} >
                            <Navigation module={"purchase-invoice"}/>
                        </Grid.Col>
                        <Grid.Col span={23} >
                            <_GenericPosForm domainConfigData={domainConfigData} />
                            {/*{isCreateMode && isDistributionModel && (
                            <_WholeSaleGenericInvoiceForm
                                allowZeroPercentage={allowZeroStock}
                                currencySymbol={currencySymbol}
                                domainId={domainId}
                                isSMSActive={isSMSActive}
                                isZeroReceiveAllow={isZeroReceiveAllow}
                            />
                        )}*/}
                        </Grid.Col>
                    </Grid>
                    </Box>



                    <Box p="8">




                    </Box>
                </Box>
            )}
        </>
    );
}

export default SalesInvoice;
