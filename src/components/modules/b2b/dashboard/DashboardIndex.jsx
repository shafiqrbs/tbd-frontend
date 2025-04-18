import React, { useState } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_Shortcut.jsx";
import DashBoardTable from "./DashboardTable.jsx";
import B2BHeaderNavbar from "../B2BHeaderNavbar";
export default function DashboardIndex() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();

  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          <B2BHeaderNavbar
            pageTitle={t("Dashboard")}
            pageDescription={t("Dashboard")}
            roles={t("Roles")}
            allowZeroPercentage=""
            currencySymbol=""
          />
          <Box p={"8"}>
            <Grid columns={24} gutter={{ base: 8 }}>
              <Grid.Col span={1}>
                <_Shortcut module={"b2b_dashboard"} />
              </Grid.Col>
              <Grid.Col span={23}>
                <DashBoardTable />
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
