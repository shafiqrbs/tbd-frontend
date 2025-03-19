import React from "react";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { Box, Progress } from "@mantine/core";
import ProcurementHeaderNavbar from "../ProcurementHeaderNavbar";
import _RequisitionTable from "./_RequisitionTable.jsx";
export default function Requisition() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const {configData} = getConfigData();

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
              <ProcurementHeaderNavbar pageTitle={t("Requisition")} />
              <Box p={8}>
                <_RequisitionTable />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
