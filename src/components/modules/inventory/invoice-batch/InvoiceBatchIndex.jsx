import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InvoiceBatchTable from "./InvoiceBatchTable.jsx";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";

function InvoiceBatchIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const {configData} = getConfigData()


    return (
        <>
            {progress !== 100 &&
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {
                        configData &&
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t('BatchInvoice')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData?.zero_stock}
                                currancySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <InvoiceBatchTable
                                    allowZeroPercentage={configData?.zero_stock}
                                    currancySymbol={configData?.currency?.symbol}
                                />
                            </Box>

                        </>
                    }
                </Box>
            }
        </>
    );
}

export default InvoiceBatchIndex;
