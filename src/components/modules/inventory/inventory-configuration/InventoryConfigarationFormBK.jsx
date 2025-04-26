import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Flex,
  Grid,
  Box,
  ScrollArea,
  Text,
  Title,
  Stack,
  Card,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig.js";
import SalesForm from "./SalesForm";
import PurchaseForm from "./PurchaseForm";
import RequisitionForm from "./RequisitionForm";
import FormGeneric from "./FormGeneric";

function InventoryConfigarationFormBK() {
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104
  const inventoryConfigData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];
  const [activeTab, setActiveTab] = useState("Sales");

  const { domainConfig } = getDomainConfig();
  let inventory_config = domainConfig?.inventory_config;
  let config_sales = inventory_config?.config_sales;
  let config_purchase = inventory_config?.config_purchase;
  let config_requisition = inventory_config?.config_requisition;
  let id = inventoryConfigData?.id;

  const navItems = [
    "Sales",
    "Purchase",
    "Requisition",
    "Domain",
    "Product",
    "Discount",
    "Pos",
    "Vat",
    "Accounting",
    "Production",
  ];

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("SalesFormSubmit").click();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+p",
        () => {
          document.getElementById("PurchaseFormSubmit").click();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          document.getElementById("RequisitionFormSubmit").click();
        },
      ],
    ],
    []
  );

  const renderForm = () => {
    switch (activeTab) {
      case "Sales":
        return (
          <SalesForm height={height} config_sales={config_sales} id={id} />
        );
      case "Purchase":
        return (
          <PurchaseForm
            height={height}
            config_purchase={config_purchase}
            id={id}
          />
        );
      case "Requisition":
        return (
          <RequisitionForm
            height={height}
            config_requisition={config_requisition}
            id={id}
          />
        );
      default:
        return (
          <FormGeneric
            height={height}
            config_sales={config_sales}
            id={id}
          />
        );
    }
  };

  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={4}>
          <Card shadow="md" radius="4" className={classes.card} padding="xs">
            <Grid gutter={{ base: 2 }}>
              <Grid.Col span={11}>
                <Text fz="md" fw={500} className={classes.cardTitle}>
                  {t("ConfigNavigation")}
                </Text>
              </Grid.Col>
            </Grid>
            <Grid columns={9} gutter={{ base: 1 }}>
              <Grid.Col span={9}>
                <Box bg={"white"}>
                  <Box mt={8} pt={"8"}>
                    <ScrollArea
                      h={height}
                      scrollbarSize={2}
                      scrollbars="y"
                      type="never"
                    >
                      {navItems.map((item) => (
                        <Box
                          key={item}
                          style={{
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          className={`${classes["pressable-card"]} border-radius`}
                          mih={40}
                          mt={"4"}
                          variant="default"
                          onClick={() => setActiveTab(item)}
                          bg={activeTab === item ? "#f8eedf" : "gray.1"}
                        >
                          <Text size={"sm"} pt={8} pl={8} fw={500} c={"black"}>
                            {t(item)}
                          </Text>
                        </Box>
                      ))}
                    </ScrollArea>
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
        <Grid.Col span={11}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
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
                      {t(activeTab)}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack right align="flex-end">
                      <>
                        {isOnline &&
                          (activeTab === "Sales" ||
                            activeTab === "Purchase" ||
                            activeTab === "Requisition") && (
                            <Button
                              size="xs"
                              className={"btnPrimaryBg"}
                              leftSection={<IconDeviceFloppy size={16} />}
                              onClick={() => {
                                if (activeTab === "Sales") {
                                  document
                                    .getElementById("SalesFormSubmit")
                                    .click();
                                } else if (activeTab === "Purchase") {
                                  document
                                    .getElementById("PurchaseFormSubmit")
                                    .click();
                                } else if (activeTab === "Requisition") {
                                  document
                                    .getElementById("RequisitionFormSubmit")
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
              <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                {renderForm()}
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={8}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box
              h={48}
              pl={`xs`}
              pr={8}
              pt={"xs"}
              mb={"xs"}
              className={"boxBackground borderRadiusAll"}
            >
              <Title order={6} pl={"6"} pt={4}>
                {t("DomainDetails")}
              </Title>
            </Box>
            <Box mb={0} bg={"gray.1"} h={height}>
              <Box
                p={"md"}
                className="boxBackground borderRadiusAll"
                h={height}
              >
                <ScrollArea h={height - 176} type="never">
                  <Grid columns={24}>
                    <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                      {t("Name")}
                    </Grid.Col>
                    <Grid.Col span={1}>:</Grid.Col>
                    <Grid.Col span={14}>
                      {domainConfig && domainConfig?.name}
                    </Grid.Col>
                  </Grid>

                  <Grid columns={24}>
                    <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                      {t("Mobile")}
                    </Grid.Col>
                    <Grid.Col span={1}>:</Grid.Col>
                    <Grid.Col span={14}>
                      {domainConfig && domainConfig?.mobile}
                    </Grid.Col>
                  </Grid>

                  <Grid columns={24}>
                    <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                      {t("Email")}
                    </Grid.Col>
                    <Grid.Col span={1}>:</Grid.Col>
                    <Grid.Col span={14}>
                      {domainConfig && domainConfig?.email}
                    </Grid.Col>
                  </Grid>
                </ScrollArea>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={1}>
          <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
            <Shortcut
              FormSubmit={
                activeTab === "Sales"
                  ? "SalesFormSubmit"
                  : activeTab === "Purchase"
                  ? "PurchaseFormSubmit"
                  : "RequisitionFormSubmit"
              }
              Name={"name"}
              inputType="select"
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default InventoryConfigarationFormBK;
