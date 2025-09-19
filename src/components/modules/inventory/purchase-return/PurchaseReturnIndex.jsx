import React from "react";
import {Box, Grid, Progress} from "@mantine/core";
import { useTranslation } from "react-i18next";
import _PurchaseReturnForm from "./_PurchaseReturnForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _PurchaseReturnTable from "./_PurchaseReturnTable.jsx";
import Navigation from "../common/Navigation.jsx";
import _PurchaseTable from "../purchase/_PurchaseTable.jsx";
export default function PurchaseReturnIndex() {
    const { t, i18n } = useTranslation();
    const progress = getLoadingProgress()

    // Use the useConfigData hook

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
                              pageTitle={t('PurchaseReturn')}
                              roles={t('Roles')}
                              configData={configData}
                              allowZeroPercentage={configData?.zero_stock}
                              currancySymbol={configData?.currency?.symbol}
                          />
                          <Box p={'8'}>
                              <Grid columns={24} gutter={{ base: 8 }}>
                                  <Grid.Col span={1} ><Navigation module={"PurchaseReturn"}/></Grid.Col>
                                  <Grid.Col span={23} >
                                      <_PurchaseReturnTable
                                          allowZeroPercentage={configData?.zero_stock}
                                          currancySymbol={configData?.currency?.symbol}
                                          isWarehouse={configData?.sku_warehouse}
                                      />
                                  </Grid.Col>
                              </Grid>

                          </Box>

                      </>
                  }
              </Box>
          }
      </>
  );
}
