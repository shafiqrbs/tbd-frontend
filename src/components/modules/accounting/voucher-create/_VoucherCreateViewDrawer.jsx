import React from "react";
import { useOutletContext } from "react-router-dom";
import { ActionIcon, Grid, Box, Drawer, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";

function _VoucherCreateViewDrawer(props) {
  const showEntityData = useSelector(
    (state) => state.accountingCrudSlice.showEntityData
  );

  const { voucherCrateViewDrawer, setVoucherCreateViewDrawer } = props;
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t, i18n } = useTranslation();
  const height = mainAreaHeight; //TabList height 104
  const closeDrawer = () => {
    setVoucherCreateViewDrawer(false);
  };

  return (
    <>
      <Drawer.Root
        opened={voucherCrateViewDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text fw={"600"} fz={"16"}>
                {t("VoucherDetailsData")}
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
                    {showEntityData && showEntityData.name && showEntityData.name}
                  </Grid.Col>
                </Grid>
                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("ShortName")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {showEntityData && showEntityData.short_name && showEntityData.short_name}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("ShortCode")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {showEntityData &&
                      showEntityData.short_code &&
                      showEntityData.short_code}
                  </Grid.Col>
                </Grid>

                <Grid columns={24}>
                  <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                    {t("VoucherType")}
                  </Grid.Col>
                  <Grid.Col span={"1"}>:</Grid.Col>
                  <Grid.Col span={"auto"}>
                    {showEntityData && showEntityData.voucher_type_name && showEntityData.voucher_type_name}
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

export default _VoucherCreateViewDrawer;
