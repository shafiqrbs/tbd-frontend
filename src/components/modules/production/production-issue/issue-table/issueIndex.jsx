import React from "react";
import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import IssueTable from "./IssueTable.jsx";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";

function IssueIndex() {
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
                    <ProductionHeaderNavbar
                        pageTitle={t("IssueIndex")}
                        roles={t("Roles")}
                    />
                    <Box p={"8"}>
                      <IssueTable domainConfigData={domainConfigData} />
                    </Box>
                  </>
              )}
            </Box>
        )}
      </>
  );
}

export default IssueIndex;
