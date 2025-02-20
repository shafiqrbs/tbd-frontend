import React from "react";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { Box, Progress } from "@mantine/core";
import ProcurementHeaderNavbar from "../ProcurementHeaderNavbar";
import _GenericRequisitionForm from "./_GenericRequisitionForm";

export default function RequisitionInvoice() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const configData = getConfigData();

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
                pageTitle={t("NewRequisition")}
                roles={t("Roles")}
              />
              <Box p={8}>
                {  (
                  <_GenericRequisitionForm
                    allowZeroPercentage={configData?.zero_stock}
                    currencySymbol={configData?.currency?.symbol}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
