import React from "react";
import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import GeneralIssueForm from "./GeneralIssueForm.jsx";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";
export default function GeneralIssueIndex() {
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
                pageTitle={t("GeneralProductionIssue")}
                roles={t("Roles")}
              />
              <Box p={"8"}>
                <GeneralIssueForm domainConfigData={domainConfigData} />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
