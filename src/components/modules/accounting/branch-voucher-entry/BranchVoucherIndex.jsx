import React, {useEffect, useState} from "react";
import {Box, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import _BranchVoucherTable from "./voucher-forms/_BranchVoucherTable.jsx";
import BranchVoucherFromIndex from "./BranchVoucherFromIndex.jsx";

function BranchVoucherIndex(props) {
    const {t, i18n} = useTranslation();
    const progress = getLoadingProgress();

    const [activeTab, setActiveTab] = useState("");
    useEffect(() => {
        setActiveTab("");
    }, []);
    const domainConfigData = JSON.parse(
        localStorage.getItem("domain-config-data")
    );

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
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t("ManageBranchVoucher")}
                            roles={t("Roles")}
                            allowZeroPercentage=""
                            currencySymbol={
                                domainConfigData?.inventory_config?.currency?.symbol
                            }
                        />
                        <Box>
                            <Box className="" bg={"#f0f1f9"}>
                                <Box bg={"white"}>
                                    {props.type === 'index' && (
                                        <_BranchVoucherTable
                                            currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
                                        />
                                    )}
                                    {props.type === 'create' && (
                                        <BranchVoucherFromIndex
                                            currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}

export default BranchVoucherIndex;
