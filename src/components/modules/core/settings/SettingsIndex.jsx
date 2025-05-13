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
import SettingsTable from "./SettingsTable.jsx";
import SettingsForm from "./SettingsForm.jsx";
import SettingsUpdateForm from "./SettingsUpdateForm.jsx";
import getParticularTypeDropdownData from "../../../global-hook/dropdown/core/getSettingTypeDropdownData.js";
import { setProductionSettingFilterData } from "../../../../store/production/crudSlice.js";
import Navigation from "../common/Navigation.jsx";

function SettingsIndex() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const insertType = useSelector(
    (state) => state.inventoryCrudSlice.insertType
  );

  const progress = getLoadingProgress();
  const { configData, fetchData } = getConfigData();
  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
  const navigate = useNavigate();

  const { id } = useParams();
  const settingTypeDropdown = getParticularTypeDropdownData();

  const productionSettingFilterData = useSelector(
    (state) => state.productionCrudSlice.productionSettingFilterData
  );

  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`/core/setting/${id}`));
      dispatch(setFormLoading(true));
    } else if (!id) {
      dispatch(setInsertType("create"));
      dispatch(setSearchKeyword(""));
      dispatch(setEntityNewData([]));
      dispatch(
        setProductionSettingFilterData({
          ...productionSettingFilterData,
          setting_type_id: "",
          name: "",
        })
      );
      navigate("/core/setting", { replace: true });
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
                pageTitle={t("CoreSetting")}
                roles={t("Roles")}
                allowZeroPercentage=""
                currencySymbol=""
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={1}>
                    <Navigation module={"setting"} />
                  </Grid.Col>
                  <Grid.Col span={14}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <SettingsTable
                        settingTypeDropdown={settingTypeDropdown}
                      />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    {insertType === "create" ? (
                      <SettingsForm
                        saveId={"EntityFormSubmit"}
                        settingTypeDropdown={settingTypeDropdown}
                      />
                    ) : (
                      <SettingsUpdateForm
                        saveId={"EntityFormSubmit"}
                        settingTypeDropdown={settingTypeDropdown}
                      />
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

export default SettingsIndex;
