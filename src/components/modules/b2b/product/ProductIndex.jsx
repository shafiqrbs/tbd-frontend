import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _Shortcut from "../common/_Shortcut.jsx";
import DomainHeaderNavbar from "../../domain/DomainHeaderNavbar.jsx";
import ProductTable from "./ProductTable.jsx";

export default function ProductIndex() {
  const { id } = useParams();
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
            pageTitle={t("B2BProduct")}
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
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                  <ProductTable id={id} />
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
