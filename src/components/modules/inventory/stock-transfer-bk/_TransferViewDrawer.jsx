import React from "react";
import { useOutletContext } from "react-router-dom";
import { ActionIcon, Grid, Box, Drawer, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";

export default function _TransferViewDrawer(props) {

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  const { viewDrawer, setViewDrawer } = props;
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t, i18n } = useTranslation();
  const height = mainAreaHeight; //TabList height 104
  const closeDrawer = () => {
    setViewDrawer(false);
  };

  return (
    <>
      <Drawer.Root
        opened={viewDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text fw={"600"} fz={"16"}>
                {t("ReconciliationDetailsData")}
              </Text>
            </Drawer.Title>
            <ActionIcon
              className="ActionIconCustom"
              radius="xl"
              color="red.6"
              size="lg"
              onClick={closeDrawer}
            >
              <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Drawer.Header>
          <Box mb={0} bg={"gray.1"} h={height}>
            <Box p={"md"} className="boxBackground borderRadiusAll" h={height}>
              <Box>
                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("FromWarehouse")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData && entityEditData.from_warehouse && entityEditData.from_warehouse}
                  </Grid.Col>
                </Grid>
                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("ToWarehouse")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData && entityEditData.to_warehouse && entityEditData.to_warehouse}
                  </Grid.Col>
                </Grid>
                
                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("StockItem")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.stock_item &&
                      entityEditData.stock_item}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("Quantity")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.quantity &&
                      entityEditData.quantity}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("BonusQuantity")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData && entityEditData.bonus_quantity && entityEditData.bonus_quantity}
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
