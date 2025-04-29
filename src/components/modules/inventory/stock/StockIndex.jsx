import React, { useEffect, useState } from "react";
import { Box, Grid, Progress, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import {
  setDropdownLoad,
} from "../../../../store/inventory/crudSlice.js";
import StockTable from "./StockTable.jsx";
import { getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import NavigationGeneral from "../common/NavigationGeneral.jsx";

function StockIndex() {
  const { t, i18n } = useTranslation();
  const insertType = useSelector((state) => state.crudSlice.insertType);
  const dispatch = useDispatch();

  const progress = getLoadingProgress();
  const {configData} = getConfigData();

  const dropdownLoad = useSelector(
    (state) => state.inventoryCrudSlice.dropdownLoad
  );
  const categoryDropdownData = useSelector(
    (state) => state.inventoryUtilitySlice.categoryDropdownData
  );

  let categoryDropdown =
    categoryDropdownData && categoryDropdownData.length > 0
      ? categoryDropdownData.map((type, index) => {
          return { label: type.name, value: String(type.id) };
        })
      : [];

  useEffect(() => {
    const value = {
      url: "inventory/select/category",
      param: {
        // type: 'parent'
        type: "all",
      },
    };
    dispatch(getCategoryDropdown(value));
    dispatch(setDropdownLoad(false));
  }, [dropdownLoad]);

  const locationData = getSettingParticularDropdownData("location");

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
        <>
          {configData && (
            <>
              <InventoryHeaderNavbar
                pageTitle={t("ManageProduct")}
                roles={t("Roles")}
                allowZeroPercentage={configData.zero_stock}
                currencySymbol={configData?.currency?.symbol}
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={1}>
                    <NavigationGeneral  module={"stock"} />
                  </Grid.Col>
                  <Grid.Col span={23}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <StockTable categoryDropdown={categoryDropdown} locationData={locationData} />
                    </Box>
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}

export default StockIndex;
