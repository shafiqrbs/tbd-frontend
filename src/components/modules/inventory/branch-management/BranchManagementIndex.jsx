import React from "react";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import { Box, Progress } from "@mantine/core";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import BranchManagementForm from "./BranchManagementForm";

export default function BranchManagementIndex() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          <InventoryHeaderNavbar
            pageTitle={t("BranchManagement")}
            roles={t("Roles")}
            allowZeroPercentage=""
            currencySymbol=""
          />
          <Box p={8}>
            <BranchManagementForm />
          </Box>
        </>
      )}
    </>
  );
}
