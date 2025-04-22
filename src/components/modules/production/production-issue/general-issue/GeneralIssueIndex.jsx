import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Progress, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import GeneralIssueForm from "./GeneralIssueForm.jsx";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../../global-hook/config-data/getConfigData.js";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";
export default function GeneralIssueIndex() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const insertType = useSelector((state) => state.crudSlice.insertType);
  const progress = getLoadingProgress();
  const { configData, fetchData } = getConfigData();
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
          {configData && (
            <>
              <ProductionHeaderNavbar
                pageTitle={t("IssueProduction")}
                roles={t("Roles")}
              />
              <Box p={"8"}>
                <GeneralIssueForm isWarehouse={configData?.sku_warehouse} currencySymbol={configData?.currencySymbol} isMeasurement={configData?.isMeasurement} />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
