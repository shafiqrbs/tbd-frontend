import { Box, Progress } from "@mantine/core";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import ProcurementHeaderNavbar from "../ProcurementHeaderNavbar";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import { useTranslation } from "react-i18next";
import InoutTable from "./InoutTable";

export default function InoutIndex() {
  const progress = getLoadingProgress();
  const { configData } = useConfigData();
  const { t } = useTranslation();

  return (
    <>
      {progress !== 100 && (
        <Progress
          color="var(--theme-primary-color-6)"
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
                <InoutTable
                  currencySymbol={configData?.currency?.symbol}
                  configId={configData?.id}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
