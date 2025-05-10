import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";
import _WholeSaleGenericInvoiceForm from "./whole-sale/_GenericInvoiceForm.jsx";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _GenericPosForm from "./_GenericPosForm";
import __GenericPosSalesForm from "./__GenericPosSalesForm";

function SalesInvoice() {

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const progress = getLoadingProgress()
    const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
    let configData = domainConfigData?.inventory_config
    // console.log(domainConfigData?.inventory_config?.business_model)

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {
                        domainConfigData &&
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t('SalesInvoice')}
                                roles={t('Roles')}
                                configData={configData}
                                allowZeroPercentage={domainConfigData?.inventory_config?.zero_stock}
                                currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                {
                                    
                                    <_GenericPosForm
                                        domainConfigData={domainConfigData}
                                    />
                                }
                                {
                                    insertType === 'create' && domainConfigData?.inventory_config?.business_model?.slug === 'distribution' &&
                                    <_WholeSaleGenericInvoiceForm
                                        allowZeroPercentage={domainConfigData?.inventory_config?.zero_stock}
                                        currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
                                        domainId={domainConfigData?.inventory_config?.domain_id}
                                        isSMSActive={domainConfigData?.inventory_config?.is_active_sms}
                                        isZeroReceiveAllow={domainConfigData?.inventory_config?.is_zero_receive_allow}
                                    />
                                }
                            </Box>
                        </>
                    }

                </Box>
            }
        </>
    );
}

export default SalesInvoice;
