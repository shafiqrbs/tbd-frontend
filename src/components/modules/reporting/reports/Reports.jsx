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
  ActionIcon,
  Flex,
  Button,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconBuildingWarehouse,
  IconReportMoney,
  IconShoppingCart,
  IconFileInvoice,
  IconChevronDown,
  IconX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
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
import tableCss from "../../../../assets/css/Table.module.css";

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 98;

  const [activeReport, setActiveReport] = useState("inventory-sales-report-1");
  const [enableTable, setEnableTable] = useState(false);
  const [dataLimit, setDataLimit] = useState(false);
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  // Static data with more columns
  const indexData = {
    data: [
      {
        item_index: 1,
        voucher_no: "VOU-001",
        date: "2024-01-15",
        mode: "Dr",
        ledger_name: "Inventory Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "0",
        description: "Transportation cost for inventory",
        reference: "REF-001",
        balance: "2040",
        created_by: "Admin",
      },
      {
        item_index: 2,
        voucher_no: "VOU-001",
        date: "2024-01-15",
        mode: "Cr",
        ledger_name: "Cash Account - Main Branch",
        debit: "0",
        credit: "2040",
        description: "Cash payment for transportation",
        reference: "REF-001",
        balance: "-2040",
        created_by: "Admin",
      },
      {
        item_index: 3,
        voucher_no: "VOU-002",
        date: "2024-01-16",
        mode: "Dr",
        ledger_name: "Sales Account - Product A",
        debit: "5000",
        credit: "0",
        description: "Sale of Product A to Customer XYZ",
        reference: "INV-1001",
        balance: "5000",
        created_by: "Sales Manager",
      },
      {
        item_index: 4,
        voucher_no: "VOU-002",
        date: "2024-01-16",
        mode: "Cr",
        ledger_name: "Accounts Receivable - Customer XYZ",
        debit: "0",
        credit: "5000",
        description: "Customer receivable for Product A",
        reference: "INV-1001",
        balance: "-5000",
        created_by: "Sales Manager",
      },
      {
        item_index: 5,
        voucher_no: "VOU-003",
        date: "2024-01-17",
        mode: "Dr",
        ledger_name: "Purchase Account - Raw Materials",
        debit: "3500",
        credit: "0",
        description: "Purchase of raw materials",
        reference: "PUR-501",
        balance: "3500",
        created_by: "Purchase Manager",
      },
      {
        item_index: 6,
        voucher_no: "VOU-003",
        date: "2024-01-17",
        mode: "Cr",
        ledger_name: "Accounts Payable - Supplier ABC",
        debit: "0",
        credit: "3500",
        description: "Payable to supplier for raw materials",
        reference: "PUR-501",
        balance: "-3500",
        created_by: "Purchase Manager",
      },
      {
        item_index: 7,
        voucher_no: "VOU-004",
        date: "2024-01-18",
        mode: "Dr",
        ledger_name: "Office Expenses - Utilities",
        debit: "1200",
        credit: "0",
        description: "Monthly electricity bill",
        reference: "UTIL-001",
        balance: "1200",
        created_by: "Accountant",
      },
      {
        item_index: 8,
        voucher_no: "VOU-004",
        date: "2024-01-18",
        mode: "Cr",
        ledger_name: "Bank Account - Commercial Bank",
        debit: "0",
        credit: "1200",
        description: "Bank payment for utilities",
        reference: "UTIL-001",
        balance: "-1200",
        created_by: "Accountant",
      },
    ],
    total: 8,
  };

  const columns = useMemo(
    () => [
      {
        accessor: "index",
        title: t("S/N"),
        textAlign: "left",
        render: (item, index) => index + 1,
      },
      {
        accessor: "voucher_no",
        title: t("VoucherNo"),
        textAlign: "center",
      },
      ...(activeReport && activeReport.includes("purchase")
        ? [
            {
              accessor: "description",
              title: t("Description"),
              textAlign: "center",
            },
          ]
        : []),
      ...(activeReport && activeReport.includes("sales")
        ? [
            {
              accessor: "mode",
              title: t("Mode"),
              textAlign: "center",
            },
          ]
        : []),
      {
        accessor: "action",
        title: t("Action"),
        textAlign: "right",
        render: (item) => (
          <Group gap={4} justify="right" wrap="nowrap">
            <ActionIcon
              size="sm"
              variant="outline"
              radius="xl"
              color="var(--theme-primary-color-6)"
              onClick={() => {}}
            >
              <IconX
                size={16}
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [activeReport]
  );

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
              pt="4"
              pl={"xs"}
              pr="xs"
              pb={4}
            >
              <__ReportsSearch activeReport={activeReport} />
            </Box>
            <Box className={"borderRadiusAll"} mt={4}>
              <DataTable
                classNames={{
                  root: tableCss.root,
                  table: tableCss.table,
                  header: tableCss.header,
                  footer: tableCss.footer,
                  pagination: tableCss.pagination,
                }}
                records={indexData.data}
                columns={columns}
                totalRecords={indexData.total}
                recordsPerPage={10}
                loaderSize="xs"
                loaderColor="grape"
                height={height - 34}
                scrollAreaProps={{ type: "never" }}
              />
            </Box>
            <Box mt={4}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"11"}
                  pb={"xs"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Flex h={28} direction={"row"} gap={"xs"} justify="flex-end">
                    {!saveCreateLoading && isOnline && 1 && (
                      <>
                        <Button
                          size="xs"
                          color={"green.8"}
                          type="submit"
                          id="EntityFormSubmits"
                          leftSection={<IconDeviceFloppy size={16} />}
                        >
                          <Flex direction={"column"} gap={0}>
                            <Text fz={14} fw={400}>
                              {t("GenerateExcel")}
                            </Text>
                          </Flex>
                        </Button>
                        <Button
                          size="xs"
                          color={"green.8"}
                          type="submit"
                          id="EntityFormSubmits"
                          leftSection={<IconDeviceFloppy size={16} />}
                        >
                          <Flex direction={"column"} gap={0}>
                            <Text fz={14} fw={400}>
                              {t("GeneratePdf")}
                            </Text>
                          </Flex>
                        </Button>
                      </>
                    )}
                  </Flex>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};
export default Reports;
