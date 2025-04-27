import React from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar.jsx";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import Navigation from "../common/Navigation.jsx";
import InventoryConfigarationForm from "./InventoryConfigarationForm.jsx";

function InventoryConfigurationIndex() {
  const { t, i18n } = useTranslation();

  const progress = getLoadingProgress();
  const { configData, fetchData } = getConfigData();
  localStorage.setItem("config-data", JSON.stringify(configData));

  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          <InventoryHeaderNavbar
            pageTitle={t("ProductConfiguration")}
            roles={t("Roles")}
            allowZeroPercentage=""
            currencySymbol=""
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
