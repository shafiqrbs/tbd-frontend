import React from "react";
import {
    Box, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _ApproveTable from "./_ApproveTable";

function OpeningApproveIndex() {
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
                                pageTitle={t('ApproveOpeningStock')}
                                roles={t('Roles')}
                                currencySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <_ApproveTable
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
