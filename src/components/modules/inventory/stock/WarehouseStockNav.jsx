import React, { useEffect, useState } from "react";
import {Box, Button, Card, Flex, Grid, Progress, ScrollArea, Text, Title, Tooltip} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseData.js";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";

function WarehouseStockNav() {
  const { t, i18n } = useTranslation();
  const {warehouse} = useParams();
  const [selectedDomainId, setSelectedDomainId] = useState(warehouse);
  const {reloadList, setReloadList} = useState(true);
  const navigate = useNavigate();
  const dropdownLoad = useSelector(
    (state) => state.inventoryCrudSlice.dropdownLoad
  );
  let warehouseDropdownData = getCoreWarehouseDropdownData();
  const handleWarehouseNavigation = (values) => {
  };
  return (
    <>
      <Card shadow="md" radius="4"  className={classes.card} padding="xs">
        <Grid gutter={{base: 2}}>
          <Grid.Col span={10}>
            <Text fz="md" fw={500} className={classes.cardTitle}>
              {t("WarehouseStock")}
            </Text>
          </Grid.Col>
        </Grid>
        <ScrollArea  bg="white" type="never" className="border-radius">

          <Box
              style={{
                borderRadius: 4,
                cursor: "pointer",
              }}
              className={`${classes["pressable-card"]} border-radius`}
              mih={40}
              mt="4"
              variant="default"
              onClick={() => {
                  navigate(`/inventory/stock`);
              }}
          >
            <Text
                size="sm"
                pt={8}
                pl={8}
                fw={500}
                c="black"
            >
              {t("Stocks")}
            </Text>
          </Box>
          <Box
              style={{
                borderRadius: 4,
                cursor: "pointer",
              }}
              className={`${classes["pressable-card"]} border-radius`}
              mih={40}
              mt="4"
              variant="default"
              onClick={() => {
                navigate(`/inventory/stock/expiry`);
              }}
          >
            <Text
                size="sm"
                pt={8}
                pl={8}
                fw={500}
                c="black">
              {t("ExpiryStock")}
            </Text>
          </Box>
          <Box
              style={{
                borderRadius: 4,
                cursor: "pointer",
              }}
              className={`${classes["pressable-card"]} border-radius`}
              mih={40}
              mt="4"
              variant="default"
              onClick={() => {
                navigate(`/inventory/stock/matrix`);
              }}
          >
            <Text
                size="sm"
                pt={8}
                pl={8}
                fw={500}
                c="black"
            >
              {t("StockMatrix")}
            </Text>
          </Box>
          {warehouseDropdownData && (
              warehouseDropdownData.map((data, index) => (
                  <Box
                      key={index}
                      style={{
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      className={`${classes["pressable-card"]} border-radius`}
                      mih={40}
                      mt="4"
                      variant="default"
                      bg={
                        data?.id == selectedDomainId ? "#f8eedf" : "gray.1"
                      }
                      key={data.id}
                      onClick={() => {
                        setSelectedDomainId(data.id);
                        navigate(`/inventory/stock/${data.id}`);
                      }}
                  >
                    <Text
                        size="sm"
                        pt={8}
                        pl={8}
                        fw={500}
                        c="black"
                    >
                      {data?.name}
                    </Text>
                  </Box>
              ))
          )}
        </ScrollArea>
      </Card>
    </>
  );
}

export default WarehouseStockNav;
