import React from "react";
import {
    Box, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _OpeningApproveTable from "./_OpeningApproveTable.jsx";

function OpeningApproveIndex() {
    const { t, i18n } = useTranslation();
    const progress = getLoadingProgress()

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
                                pageTitle={t('ApproveStock')}
                                roles={t('Roles')}
                                configData={configData}
                                currencySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <_OpeningApproveTable
                                    currencySymbol={configData?.currency?.symbol}
                                />
                            </Box>
                        </>
                    }
                </Box>
            }
        </>
    );
}

export default OpeningApproveIndex;
