import React from "react";
import {
    Box, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";

function PurchaseInvoice() {
    const { t, i18n } = useTranslation();
    const progress = getLoadingProgress()
    const configData = getConfigData()

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
                                pageTitle={t('PurchaseInvoice')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData.currency.symbol}
                            />
                            <Box p={'8'}>
                                {
                                    configData.business_model.slug === 'general' &&
                                    <_GenericInvoiceForm
                                        allowZeroPercentage={configData.zero_stock}
                                        currencySymbol={configData.currency.symbol}
                                        isPurchaseByPurchasePrice={configData.is_purchase_by_purchase_price}
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

export default PurchaseInvoice;
