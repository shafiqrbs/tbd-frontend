import React from "react";
import { useOutletContext } from "react-router-dom";
import { ActionIcon, Grid, Box, Drawer, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";

export default function _CouponViewDrawer(props) {
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
                    {entityEditData &&
                      entityEditData.name &&
                      entityEditData.name}
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
                    {t("DisMode")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.mode &&
                      entityEditData.mode}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("DisAmount")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.amount &&
                      entityEditData.amount}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("Limit")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.limit &&
                      entityEditData.limit}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("MinAmount")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.minimum_sales_amount &&
                      entityEditData.minimum_sales_amount}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("Duration")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.duration &&
                      entityEditData.duration}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("SmsEnable")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {entityEditData &&
                      entityEditData.is_sms &&
                      entityEditData.is_sms}
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
