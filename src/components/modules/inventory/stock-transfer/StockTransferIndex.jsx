import React from "react";
import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import _StockTransferForm from "./_StockTransferForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _StockTransferTable from "./_StockTransferTable.jsx";
export default function StockTransferIndex() {
  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();

  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
    const isWarehouse = domainConfigData?.inventory_config?.sku_warehouse;

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
                  pageTitle={t("StockTransfer")}
                  roles={t("Roles")}
                  allowZeroPercentage={domainConfigData?.zero_stock}
                  currencySymbol={domainConfigData?.currency?.symbol}
              />
              <Box p={"8"}>
                  {
                      isWarehouse==1 && <_StockTransferTable domainConfigData={domainConfigData} isWarehouse={isWarehouse} />
                  }

              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
