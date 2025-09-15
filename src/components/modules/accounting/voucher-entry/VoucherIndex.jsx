import React, { useEffect, useState } from "react";
import { Box, Progress, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import VoucherFormIndex from "./VoucherFromIndex.jsx";
import VoucherTableNew from "./VoucherTableNew.jsx";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import { useOutletContext } from "react-router-dom";
import VoucherTableInProgress from "./VoucherTableInProgress.jsx";
import VoucherTableApprove from "./VoucherTableApprove.jsx";
import VoucherTableArchive from "./VoucherTableArchive.jsx";
import VoucherTable from "./VoucherTable.jsx";
import _VoucherTable from "./voucher-forms/_VoucherTable.jsx";
function VoucherIndex(props) {
  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();
  const { isOnline, mainAreaHeight } = useOutletContext();

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
              pageTitle={t("ManageVoucher")}
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
                      <_VoucherTable
                          currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
                      />
                  )}
                  {props.type === 'create' && (
                      <VoucherFormIndex
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

export default VoucherIndex;
