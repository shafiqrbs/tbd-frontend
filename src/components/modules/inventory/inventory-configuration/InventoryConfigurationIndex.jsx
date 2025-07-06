import React from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar.jsx";
import Navigation from "../common/Navigation.jsx";
import InventoryConfigarationForm from "./InventoryConfigarationForm.jsx";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar";

function InventoryConfigurationIndex() {

  const { t, i18n } = useTranslation();

  const progress = getLoadingProgress();


  const domainConfigData = JSON.parse(
      localStorage.getItem("domain-config-data")
  );
  let configData = domainConfigData?.inventory_config

  return (
    <>
      {progress !== 100 && (
        <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>

          <_SalesPurchaseHeaderNavbar
              pageTitle={t('ManageSales')}
              roles={t('Roles')}
              configData={configData}
              allowZeroPercentage={configData?.zero_stock}
              currancySymbol={configData?.currency?.symbol}
          />
          <Box p={"8"}>
            <Grid columns={24} gutter={{ base: 8 }}>
              <Grid.Col span={1}>
                <Navigation module={"config"} />
              </Grid.Col>
              <Grid.Col span={23}>
                <InventoryConfigarationForm />
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}

export default InventoryConfigurationIndex;
