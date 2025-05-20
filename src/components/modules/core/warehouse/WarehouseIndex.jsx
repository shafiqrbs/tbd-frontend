import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";

import {
  setEntityNewData,
  setInsertType,
  setSearchKeyword,
  editEntityData,
  setFormLoading,
} from "../../../../store/core/crudSlice.js";

import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

import CoreHeaderNavbar from "../CoreHeaderNavbar.jsx";
import WarehouseTable from "./WarehouseTable.jsx";
import WarehouseForm from "./WarehouseForm.jsx";
import WarehouseUpdateForm from "./WarehouseUpdateForm.jsx";
import Navigation from "../common/Navigation.jsx";

function WarehouseIndex() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { insertType } = useSelector((state) => state.crudSlice);
  const progress = getLoadingProgress();
  const { configData = {} } = getConfigData();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`/core/warehouse/${id}`));
      dispatch(setFormLoading(true));
    } else {
      dispatch(setInsertType("create"));
      dispatch(setSearchKeyword(""));
      dispatch(setEntityNewData([]));

      if (window.location.pathname !== "/core/warehouse") {
        navigate("/core/warehouse");
      }
    }
  }, [id]);

  return (
    <>
      {progress < 100 && (
        <Progress
          color="red"
          size="sm"
          striped
          animated
          value={progress}
          transitionDuration={200}
        />
      )}

      {progress === 100 && configData && (
        <Box>
          <CoreHeaderNavbar pageTitle={t("Warehouse")} roles={t("Roles")} />
          <Box p="8">
            <Grid columns={24} gutter={{ base: 8 }}>
              <Grid.Col span={1}>
                <Navigation module={"warehouse"} />
              </Grid.Col>
              <Grid.Col span={14}>
                <Box bg="white" p="xs" className="borderRadiusAll">
                  <WarehouseTable />
                </Box>
              </Grid.Col>
              <Grid.Col span={9}>
                {insertType === "create" ? (
                  <WarehouseForm />
                ) : (
                  <WarehouseUpdateForm />
                )}
              </Grid.Col>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
}

export default WarehouseIndex;
