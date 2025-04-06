import React from "react";
import { useOutletContext } from "react-router-dom";
import { ActionIcon, Grid, Box, Drawer, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";

export default function _ReconciliationViewDrawer(props) {

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
                    {t("Name")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData && entityEditData.product_name && entityEditData.product_name}
                  </Grid.Col>
                </Grid>
                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("Warehouse")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData && entityEditData.warehouse && entityEditData.warehouse}
                  </Grid.Col>
                </Grid>
                
                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("QuantityMode")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.quantity_id &&
                      entityEditData.quantity_id}
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
                    {t("BonusMode")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData && entityEditData.bonus_id && entityEditData.bonus_id}
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
