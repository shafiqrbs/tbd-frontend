import React from "react";
import {
    Box,Progress,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesTable from "./_SalesTable.jsx";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";

function SalesIndex() {
    const { t, i18n } = useTranslation();

    const progress = getLoadingProgress()
    const domainConfigData = JSON.parse(
        localStorage.getItem("domain-config-data")
    );
    let configData = domainConfigData?.inventory_config


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {
                        configData &&
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t('ManageSales')}
                                roles={t('Roles')}
                                configData={configData}
                                allowZeroPercentage={configData?.zero_stock}
                                currancySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <_SalesTable
                                    configData={configData}
                                    allowZeroPercentage={configData?.zero_stock}
                                    currancySymbol={configData?.currency?.symbol}
                                    isWarehouse={configData?.sku_warehouse}
                                />
                            </Box>

                        </>
                    }
                </Box>
            }
        </>
    );
}

export default SalesIndex;
