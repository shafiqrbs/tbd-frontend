import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Box, Grid, Progress, useMantineTheme } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_Shortcut.jsx";
import DomainHeaderNavbar from "../../domain/DomainHeaderNavbar.jsx";
import SubDomainSettingForm from "./SubDomainSettingForm.jsx";

export default function SettingIndex() {
  const { id } = useParams();
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight + 20;
  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          <DomainHeaderNavbar
            pageTitle={t("Setting")}
            roles={t("Roles")}
            allowZeroPercentage=""
            currencySymbol=""
          />
          <Box p={"8"}>
            <Grid columns={24} gutter={{ base: 8 }}>
              <Grid.Col span={1}>
                <_Shortcut id={id} />
              </Grid.Col>
              <Grid.Col span={23}>
                <SubDomainSettingForm id={id} />
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
