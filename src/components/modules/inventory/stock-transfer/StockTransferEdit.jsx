import React, {useMemo} from "react";
import {Box, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _StockTransferUpdateForm from "./_StockTransferUpdateForm.jsx";

function StockTransferEdit() {
    const {t, i18n} = useTranslation();
    const progress = getLoadingProgress();
    // Safe parsing of config data from localStorage
    const domainConfigData = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("domain-config-data")) || {};
        } catch {
            return {};
        }
    }, []);

    return (
        <>
            {progress !== 100 && (
                <Progress
                    color='var(--theme-primary-color-6)'
                    size={"sm"}
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            )}
            {progress === 100 && (
                <Box>
                    {domainConfigData && (
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t("PurchaseReturn")}
                                roles={t("Roles")}
                                allowZeroPercentage={domainConfigData?.inventory_config?.zero_stock}
                                currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
                            />
                            <Box p={"8"}>
                                <_StockTransferUpdateForm domainConfigData={domainConfigData}/>
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </>
    );
}

export default StockTransferEdit;
