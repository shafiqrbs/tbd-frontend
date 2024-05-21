import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesTable from "./_SalesTable.jsx";
import _SalesPurchaseHeaderNavbar from "../configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";
import {useParams} from "react-router-dom";

function SalesEdit() {
    let { id } = useParams();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const progress = getLoadingProgress()
    const configData = getConfigData()

    console.log(id)
    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {
                        configData &&
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t('SalesInvoice')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData.currency.symbol}
                            />
                            <Box p={'8'}>
                                {
                                    insertType === 'create' && configData.business_model.slug === 'general' &&
                                    <_GenericInvoiceForm
                                        allowZeroPercentage={configData.zero_stock}
                                        currencySymbol={configData.currency.symbol}
                                        domainId={configData.domain_id}
                                        isSMSActive={configData.is_active_sms}
                                        isZeroReceiveAllow={configData.is_zero_receive_allow}
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

export default SalesEdit;
