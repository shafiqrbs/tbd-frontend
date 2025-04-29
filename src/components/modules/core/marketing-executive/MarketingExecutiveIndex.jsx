import React, { useEffect, useState } from "react";
import { Box, Grid, Progress, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  setEntityNewData,
  setInsertType,
  setSearchKeyword,
  editEntityData,
  setFormLoading,
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { useNavigate, useParams } from "react-router-dom";
import CoreHeaderNavbar from "../CoreHeaderNavbar.jsx";
import MarketingExecutiveTable from "./MarketingExecutiveTable.jsx";
import MarketingExecutiveForm from "./MarketingExecutiveForm.jsx";
import MarketingExecutiveUpdateForm from "./MarketingExecutiveUpdateForm.jsx";
import Navigation from "../common/Navigation.jsx";

function MarketingExecutiveIndex() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const insertType = useSelector(
    (state) => state.inventoryCrudSlice.insertType
  );

  const progress = getLoadingProgress();
  const { configData } = getConfigData();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`/core/marketing-executive/${id}`));
      dispatch(setFormLoading(true));
    } else if (!id) {
      dispatch(setInsertType("create"));
      dispatch(setSearchKeyword(""));
      dispatch(setEntityNewData([]));
      navigate("/core/marketing-executive");
    }
  }, [id, dispatch, navigate]);

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
              <CoreHeaderNavbar
                pageTitle={t("MarketingExecutive")}
                roles={t("Roles")}
                allowZeroPercentage=""
                currencySymbol=""
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={1}>
                    <Navigation module={"marketing-executive"} />
                  </Grid.Col>
                  <Grid.Col span={14}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <MarketingExecutiveTable />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    {insertType === "create" ? (
                      <MarketingExecutiveForm />
                    ) : (
                      <MarketingExecutiveUpdateForm />
                    )}
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}

export default MarketingExecutiveIndex;
