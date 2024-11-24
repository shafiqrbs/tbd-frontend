import React from "react";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import { Box, Progress } from "@mantine/core";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar.jsx";
import BranchManagementForm from "./BranchManagementForm.jsx";
import DomainHeaderNavbar from "../DomainHeaderNavbar.jsx";

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
          <DomainHeaderNavbar
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
