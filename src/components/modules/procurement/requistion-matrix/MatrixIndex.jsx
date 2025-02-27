import { Box, Progress } from "@mantine/core";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import ProcurementHeaderNavbar from "../ProcurementHeaderNavbar";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import MatrixTable from "./MatrixTable";
import { useTranslation } from "react-i18next";

export default function MatrixIndex() {
  const progress = getLoadingProgress();
  const configData = getConfigData();
  const { t } = useTranslation();

  return (
    <>
      {progress !== 100 && (
        <Progress
          color="red"
          size="sm"
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
              <ProcurementHeaderNavbar
                pageTitle={t("RequistionMatrix")}
                roles={t("Roles")}
              />
              <Box p={8}>
                <MatrixTable
                    currencySymbol={configData?.currency?.symbol}
                    configId = {configData?.configData?.id}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
