import React from "react";
import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import WarehouseIssueForm from "./WarehouseIssueForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
export default function WarehouseIssueIndex() {
  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();

  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))

  return (
    <>
      {progress !== 100 && (
        <Progress
          color="red"
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
                  pageTitle={t("WarehouseIssue")}
                  roles={t("Roles")}
                  allowZeroPercentage={domainConfigData?.zero_stock}
                  currencySymbol={domainConfigData?.currency?.symbol}
              />
              <Box p={"8"}>
                <WarehouseIssueForm domainConfigData={domainConfigData} />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
