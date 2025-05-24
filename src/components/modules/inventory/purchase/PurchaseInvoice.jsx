import React from "react";
import {Box, Grid, Progress} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";
import Navigation from "../common/Navigation";
import _SalesTable from "../sales/_SalesTable";

function PurchaseInvoice() {
  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();
  const domainConfigData = JSON.parse(
    localStorage.getItem("domain-config-data")
  );

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
                pageTitle={t("PurchaseInvoice")}
                roles={t("Roles")}
                configData={domainConfigData?.inventory_config}
                allowZeroPercentage={
                  domainConfigData?.inventory_config?.zero_stock
                }
                currencySymbol={
                  domainConfigData?.inventory_config?.currency?.symbol
                }
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={1} ><Navigation module={"purchase-invoice"}/></Grid.Col>
                  <Grid.Col span={23} >
                    <_GenericInvoiceForm domainConfigData={domainConfigData} />
                  </Grid.Col>
                </Grid>

              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}

export default PurchaseInvoice;
