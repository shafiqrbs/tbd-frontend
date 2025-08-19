import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ActionIcon,
  Box,
  ScrollArea,
  Drawer,
  Text,
  Flex,
  Grid,
  Button,
  Title,
  Stack,
  Card,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

import { IconX, IconDeviceFloppy } from "@tabler/icons-react";
import _SettingsForm from "./_SettingsForm.jsx";
import SalesForm from "../inventory-configuration/SalesForm.jsx";
import PurchaseForm from "../inventory-configuration/PurchaseForm.jsx";
import RequisitionForm from "../inventory-configuration/RequisitionForm.jsx";
import FormGeneric from "../inventory-configuration/FormGeneric.jsx";
import { coreSettingDropdown } from "../../../../store/core/utilitySlice.js";
import { setDropdownLoad } from "../../../../store/core/crudSlice.js";
import { useDispatch, useSelector } from "react-redux";
import PosForm from "../inventory-configuration/PosForm.jsx";

function SettingDrawer(props) {
  const {
    domainConfigData,
    settingDrawer,
    setSettingDrawer,
    module,
    config_purchase,
    config_requisition,
    id,
  } = props;

  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t, i18n } = useTranslation();
  const height = mainAreaHeight - 100; //TabList height 104
  const closeDrawer = () => {
    setSettingDrawer(false);
  };
  const dispatch = useDispatch();
  const dropdownLoad = useSelector((state) => state.utilitySlice.dropdownLoad);
  let config_sales = domainConfigData?.inventory_config?.config_sales;
  const dropdownData = useSelector(
    (state) => state.utilitySlice.customerGroupDropdownData
  );
  const vendorDropdownData = useSelector(
    (state) => state.utilitySlice.vendorGroupDropdownData
  );

  let groupDropdownData =
    dropdownData && dropdownData.length > 0
      ? dropdownData.map((type, index) => {
          return { label: type.name, value: String(type.id) };
        })
      : [];
  useEffect(() => {
    const value = {
      url: "core/select/setting",
      param: { "dropdown-type": "customer-group" },
    };
    dispatch(coreSettingDropdown(value));
    dispatch(setDropdownLoad(false));
  }, [dropdownLoad]);

  let groupVendorDropdownData =
    vendorDropdownData && vendorDropdownData.length > 0
      ? vendorDropdownData.map((type, index) => {
          return { label: type.name, value: String(type.id) };
        })
      : [];
  useEffect(() => {
    const value = {
      url: "core/select/setting",
      param: { "dropdown-type": "vendor-group" },
    };
    dispatch(coreSettingDropdown(value));
    dispatch(setDropdownLoad(false));
  }, [dropdownLoad]);
  const renderForm = () => {
    switch (module) {
      case "Sales":
        return (
          <SalesForm
            customerGroupDropdownData={groupDropdownData}
            height={height + 56}
            config_sales={config_sales}
            id={id}
            domainConfigData={domainConfigData}
            closeDrawer={closeDrawer}
          />
        );
      case "Purchase":
        return (
          <PurchaseForm
            height={height+60}
            id={id}
            vendorGroupDropdownData={groupVendorDropdownData}
            closeDrawer={closeDrawer}
          />
        );
      case "Requisition":
        return (
          <RequisitionForm
            height={height}
            config_requisition={config_requisition}
            id={id}
            closeDrawer={closeDrawer}
          />
        );
      case "Pos":
        return (
          <PosForm
            height={height}
            id={id}
          />
        );
      default:
        return (
          <FormGeneric height={height} salesConfig={domainConfigData?.inventory_config?.config_sales} id={id} closeDrawer={closeDrawer} />
        );
    }
  };

  return (
    <>
      <Drawer.Root
        opened={settingDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollArea h={height + 190} scrollbarSize={2} type="never">
            <Flex
              mih={40}
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                mr={"sm"}
                radius="xl"
                color="grey.6"
                size="md"
                variant="outline"
                onClick={closeDrawer}
              >
                <IconX style={{ width: "80%", height: "80%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>
            <Box bg={"white"} className={"borderRadiusAll"} mb={"8"} mt={2}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"8"}
                  pb={"10"}
                  mb={"4"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <Title order={6} pt={"4"}>
                        {t(module)}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack right align="flex-end">
                        <>
                          {isOnline &&
                            (module === "Sales" ||
                              module === "Purchase" ||
                              module === "Requisition" ||
                              module === "Pos") && (
                              <Button
                                size="xs"
                                className={"btnPrimaryBg"}
                                leftSection={<IconDeviceFloppy size={16} />}
                                onClick={() => {
                                  if (module === "Sales") {
                                    document
                                      .getElementById("SalesFormSubmit")
                                      .click();
                                  } else if (module === "Purchase") {
                                    document
                                      .getElementById("PurchaseFormSubmit")
                                      .click();
                                  } else if (module === "Requisition") {
                                    document
                                      .getElementById("RequisitionFormSubmit")
                                      .click();
                                  } else if (module === "Pos") {
                                    document
                                      .getElementById("PosFormSubmit")
                                      .click();
                                  }
                                }}
                              >
                                <Flex direction={`column`} gap={0}>
                                  <Text fz={14} fw={400}>
                                    {t("UpdateAndSave")}
                                  </Text>
                                </Flex>
                              </Button>
                            )}
                        </>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Box>
                <Box className={"borderRadiusAll"}>
                  {renderForm()}
                </Box>
              </Box>
            </Box>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default SettingDrawer;
