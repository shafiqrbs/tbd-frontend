import React, { useEffect, useState } from "react";
import { Box, Progress, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
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
                <Tabs
                  height={50}
                  p={4}
                  bg={"#f0f1f9"}
                  defaultValue="VoucherEntry"
                  color="red.6"
                  variant="pills"
                  radius="sm"
                  onChange={(value) => setActiveTab(value)}
                >
                  <Tabs.List pos={"relative"}>
                    <Tabs.Tab m={2} value="New">
                      {t("New")}
                    </Tabs.Tab>
                    <Tabs.Tab m={2} value="InProgress">
                      {t("InProgress")}
                    </Tabs.Tab>
                    <Tabs.Tab m={2} value="Approve">
                      {t("Approve")}
                    </Tabs.Tab>
                    <Tabs.Tab m={2} value="Archive">
                      {t("Archive")}
                    </Tabs.Tab>
                    {activeTab !== "VoucherEntry" && activeTab !== "" && (
                      <Tabs.Tab
                        m={2}
                        bg={"red.5"}
                        value="VoucherEntry"
                        ml="auto"
                      >
                        {t("VoucherEntry")}
                      </Tabs.Tab>
                    )}
                  </Tabs.List>

                  <Tabs.Panel value="New">
                    <Box>
                      <VoucherTableNew />
                    </Box>
                  </Tabs.Panel>
                  <Tabs.Panel value="InProgress">
                    <Box>
                      <VoucherTableInProgress />
                    </Box>
                  </Tabs.Panel>
                  <Tabs.Panel value="Approve">
                    <Box>
                      <VoucherTableApprove />
                    </Box>
                  </Tabs.Panel>
                  <Tabs.Panel value="Archive">
                    <Box>
                      <VoucherTableArchive />
                    </Box>
                  </Tabs.Panel>
                  <Tabs.Panel value="VoucherEntry">
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
                  </Tabs.Panel>
                </Tabs>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default VoucherIndex;
