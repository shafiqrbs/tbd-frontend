import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Progress, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BatchIssueForm from "./BatchIssueForm.jsx";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import useConfigData from "../../../../global-hook/config-data/useConfigData.js";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";
import useDomainConfig from "../../../../global-hook/config-data/useDomainConfig.js";
export default function BatchIssueIndex() {
  const { t, i18n } = useTranslation();
  const progress = getLoadingProgress();
  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
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
              <ProductionHeaderNavbar
                pageTitle={t("BatchProdcutionIssue")}
                roles={t("Roles")}
              />
              <Box p={"8"}>
                <BatchIssueForm domainConfigData={domainConfigData} />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
