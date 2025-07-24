import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Grid,
  Box,
  Text,
  Stack,
  Title,
  Center,
  Container,
  Tree,
  useTree,
  getTreeExpandedState,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconBuildingWarehouse,
  IconReportMoney,
  IconShoppingCart,
  IconFileInvoice,
  IconChevronDown,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFetching } from "../../../../store/accounting/crudSlice.js";
import _ReportBox from "./_ReportBox.jsx";
import __InventoryTable from "./__InventoryTable";
import __PurchaseTable from "./__PurchaseTable";
import __SalesTable from "./__SalesTable.jsx";
import __AccountingTable from "./__AccountingTable.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import __ReportsSearch from "./__ReportsSearch.jsx";

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 98;

  const [activeReport, setActiveReport] = useState("inventory-sales-report-1");
  const [enableTable, setEnableTable] = useState(false);
  const [dataLimit, setDataLimit] = useState(false);

  useEffect(() => {
    dispatch(setFetching(false));
  }, []);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("method_id")?.click();
        },
      ],
      ["alt+r", () => {}],
      ["alt+s", () => {}],
    ],
    []
  );

  const treeData = [
    {
      value: "inventory",
      label: t("InventoryReport"),
      children: [
        {
          value: "inventory-sales",
          label: t("SalesReport"),
          children: [
            { value: "inventory-sales-report-1", label: t("Report 1") },
            { value: "inventory-sales-report-2", label: t("Report 2") },
            { value: "inventory-sales-report-3", label: t("Report 3") },
          ],
        },
        {
          value: "inventory-purchase",
          label: t("PurchaseReport"),
          children: [
            { value: "inventory-purchase-report-1", label: t("Report 1") },
            { value: "inventory-purchase-report-2", label: t("Report 2") },
            { value: "inventory-purchase-report-3", label: t("Report 3") },
          ],
        },
        {
          value: "inventory-stock",
          label: t("StockReport"),
          children: [
            { value: "inventory-stock-report-1", label: t("Report 1") },
            { value: "inventory-stock-report-2", label: t("Report 2") },
            { value: "inventory-stock-report-3", label: t("Report 3") },
          ],
        },
      ],
    },
    {
      value: "accounting",
      label: t("AccountingReport"),
      children: [
        {
          value: "accounting-similar",
          label: t("SalesReport"),
          children: [
            { value: "accounting-sales-report-1", label: t("Report 1") },
            { value: "accounting-sales-report-2", label: t("Report 2") },
            { value: "accounting-sales-report-3", label: t("Report 3") },
          ],
        },
      ],
    },
  ];

  const tree = useTree({
    initialExpandedState: getTreeExpandedState(treeData, "*"),
    multiple: false,
  });

  const handleTreeSelect = useCallback((value, node) => {
    if (!node.children) {
      setActiveReport(value);
    }
  }, []);

  const renderNode = useCallback(
    ({ node, elementProps, level, expanded }) => {
      const isLeaf = !node.children;
      const isSelected = activeReport === node.value;
      const hasChildren = node.children && node.children.length > 0;

      return (
        <Box
          {...elementProps}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            className={
              isLeaf ? `${classes["pressable-card"]} border-radius` : ""
            }
            mih={40}
            mt={4}
            variant="default"
            onClick={
              isLeaf ? () => handleTreeSelect(node.value, node) : undefined
            }
            bg={isSelected ? "#f8eedf" : isLeaf ? "gray.1" : "transparent"}
            style={{
              borderRadius: 4,
              cursor: isLeaf ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Text
              size="sm"
              pt={8}
              pl={hasChildren ? 0 : 8}
              pr={8}
              pb={8}
              fw={500}
              c={isSelected ? "black" : "black"}
            >
              {node.label}
            </Text>
            {hasChildren && (
              <IconChevronDown
                size={14}
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  marginRight: 8,
                  transition: "transform 0.2s ease",
                }}
              />
            )}
          </Box>
        </Box>
      );
    },
    [activeReport]
  );

  return (
    <Box>
      <Box>
        <Grid columns={48} gutter={{ base: 6 }}>
          <Grid.Col span={6}>
            <Box bg="white">
              <Box pb="xs" pl="xs" pr="xs" className="borderRadiusAll">
                <Box
                  pl="xs"
                  pr={8}
                  pt="6"
                  pb="6"
                  mb="4"
                  mt="xs"
                  className="boxBackground borderRadiusAll"
                >
                  <Center>
                    <Title order={6}>{t("Report")}</Title>
                  </Center>
                </Box>
                <Stack
                  className="borderRadiusAll"
                  h={height + 9}
                  bg="var(--mantine-color-body)"
                  align="flex-start"
                  justify="flex-start"
                  w="100%"
                  px="xs"
                >
                  <ScrollArea
                    h={height}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                  >
                    <Tree
                      data={treeData}
                      tree={tree}
                      renderNode={renderNode}
                      levelOffset={30}
                    />
                  </ScrollArea>
                </Stack>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={42}>
            <Box
              className="borderRadiusAll"
              bg="white"
              pt="xs"
              pl={"xs"}
              pr="xs"
            >
              <__ReportsSearch activeReport={activeReport} />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};
export default Reports;
