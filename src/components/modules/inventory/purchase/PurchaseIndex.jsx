import React from "react";
import {
    Box, Grid, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _PurchaseTable from "./_PurchaseTable.jsx";
import Navigation from "../common/Navigation";
import _GenericInvoiceForm from "./_GenericInvoiceForm";

function PurchaseIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const progress = getLoadingProgress()

    // Use the getConfigData hook

    const domainConfigData = JSON.parse(
        localStorage.getItem("domain-config-data")
    );
    let configData = domainConfigData?.inventory_config

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
                                pageTitle={t('ManagePurchase')}
                                roles={t('Roles')}
                                configData={configData}
                                allowZeroPercentage={configData?.zero_stock}
                                currancySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={1} ><Navigation module={"purchase"}/></Grid.Col>
                                    <Grid.Col span={23} >
                                        <_PurchaseTable
                                            allowZeroPercentage={configData?.zero_stock}
                                            currancySymbol={configData?.currency?.symbol}
                                            isWarehouse={configData?.sku_warehouse}
                                        />
                                    </Grid.Col>
                                </Grid>

                            </Box>

                        </>
                    }
                </Box>
            }
        </>
    );
}

export default PurchaseIndex;
