import React, { useEffect, useState } from "react";
import {Box, Button, Card, Flex, Grid, Progress, ScrollArea, Text, Title, Tooltip} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import {
  setDropdownLoad,
} from "../../../../store/inventory/crudSlice.js";
import StockTable from "./StockTable.jsx";
import { getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import NavigationGeneral from "../common/NavigationGeneral.jsx";
import {IconCategory, IconDashboard, IconIcons, IconSettings, IconUsers} from "@tabler/icons-react";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import WarehouseStockNav from "./WarehouseStockNav";
import {useParams} from "react-router";
import StockWarehouseTable from "./StockWarehouseTable";
import StockMatrixTable from "./StockMatrixTable";

function StockIndex() {
  const { t, i18n } = useTranslation();
  const insertType = useSelector((state) => state.crudSlice.insertType);
  const dispatch = useDispatch();
  const {warehouse} = useParams();
  const {matrix} = useParams();
  const [selectedDomainId, setSelectedDomainId] = useState(warehouse);
  const [selectedMatrix, setSelectedMatrix] = useState(matrix);
  const progress = getLoadingProgress();
  const {configData} = useConfigData();
  const dropdownLoad = useSelector(
    (state) => state.inventoryCrudSlice.dropdownLoad
  );
  const categoryDropdownData = useSelector(
    (state) => state.inventoryUtilitySlice.categoryDropdownData
  );
  console.log(matrix)
  console.log(selectedMatrix)
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
          color='var(--theme-primary-color-6)'
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
                  <Grid.Col span={3}>
                    <WarehouseStockNav/>
                  </Grid.Col>
                  <Grid.Col span={20}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <>
                        <StockMatrixTable
                            categoryDropdown={categoryDropdown}
                            locationData={locationData}
                        />
                      </>
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
