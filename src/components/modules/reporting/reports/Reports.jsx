import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Grid,
  Box,
  Text,
  Stack,
  Button,
  Flex,
  Title,
  Center,
  Container,
  Tooltip,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconBuildingWarehouse,
  IconReportMoney,
  IconShoppingCart,
  IconFileInvoice,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFetching } from "../../../../store/accounting/crudSlice.js";
import _ReportBox from "./_ReportBox.jsx";
import __InventoryTable from "./__InventoryTable";
import __PurchaseTable from "./__PurchaseTable";
import __SalesTable from "./__SalesTable.jsx";
import __AccountingTable from "./__AccountingTable.jsx";

function Reports() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 98;

  useEffect(() => {
    dispatch(setFetching(false));
  }, []);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("method_id").click();
        },
      ],
    ],
    []
  );

  useHotkeys([["alt+r", () => {}]], []);

  useHotkeys([["alt+s", () => {}]], []);
  const [enableTable, setEnableTable] = useState(false);
  const [dataLimit, setDataLimit] = useState(false);
  const [inventoryReport, setInventoryReport] = useState(false);
  const [salesReport, setSalesReport] = useState(false);
  const [purchaseReport, setPurchasereport] = useState(false);
  const [accountingReport, setAccountingReport] = useState(false);
  const [inventoryReportTable, setInventoryReportTable] = useState(false);
  const [salesReportTable, setSalesReportTable] = useState(false);
  const [purchaseReportTable, setPurchaseReportTable] = useState(false);
  const [accountingReportTable, setAccountingReportTable] = useState(false);
  useEffect(() => {
    setInventoryReport(true);
    setInventoryReportTable(true);
  }, []);
  return (
    <Box>
      <Box>
        <Grid columns={48} gutter={{ base: 6 }}>
          <Grid.Col span={5}>
            <Box bg={"white"}>
              <Box p={"xs"} pt={"0"} className={"borderRadiusAll"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"6"}
                  pb={"6"}
                  mb={"4"}
                  mt={"xs"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Center>
                    <Title order={6}>{t("Report")}</Title>
                  </Center>
                </Box>
                <Stack
                  className="borderRadiusAll"
                  h={height + 10}
                  bg="var(--mantine-color-body)"
                  align="center"
                >
                  <Center mt={"sm"} pt={"sm"}>
                    <Container fluid mb={"8"}>
                      <Flex
                        justify={"center"}
                        align={"center"}
                        direction={"column"}
                      >
                        <Tooltip
                          label={t("AltTextNew")}
                          px={16}
                          py={2}
                          withArrow
                          position={"left"}
                          c={"white"}
                          bg={`red.5`}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 500,
                          }}
                        >
                          <Button
                            size="md"
                            pl={"12"}
                            pr={"12"}
                            mb={"xs"}
                            bg={inventoryReport ? "red.5" : undefined}
                            variant={inventoryReport ? "filled" : "light"}
                            color="red.5"
                            radius="xl"
                            onClick={(e) => {
                              setInventoryReport(true),
                                setInventoryReportTable(true),
                                setSalesReport(false),
                                setPurchasereport(false),
                                setAccountingReport(false),
                                setSalesReportTable(false),
                                setPurchaseReportTable(false),
                                setAccountingReportTable(false);
                            }}
                          >
                            <Flex direction={"column"} align={"center"}>
                              <IconBuildingWarehouse size={16} />
                            </Flex>
                          </Button>
                        </Tooltip>
                        <Flex
                          direction={"column"}
                          align={"center"}
                          fz={"12"}
                          c={"gray.5"}
                        >
                          {t("InventoryReport")}
                        </Flex>
                      </Flex>
                    </Container>
                  </Center>
                  <Center>
                    <Container fluid mb={"8"}>
                      <Flex
                        justify={"center"}
                        align={"center"}
                        direction={"column"}
                      >
                        <Tooltip
                          label={t("AltTextReset")}
                          px={16}
                          py={2}
                          withArrow
                          position={"left"}
                          c={"white"}
                          bg={`red.5`}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 500,
                          }}
                        >
                          <Button
                            size="md"
                            pl={"12"}
                            pr={"12"}
                            mb={"xs"}
                            bg={salesReport ? "red.5" : undefined}
                            variant={salesReport ? "filled" : "light"}
                            color="red.5"
                            radius="xl"
                            onClick={(e) => {
                              setSalesReport(true),
                                setSalesReportTable(true),
                                setInventoryReport(false),
                                setAccountingReport(false),
                                setPurchasereport(false),
                                setInventoryReportTable(false),
                                setAccountingReportTable(false),
                                setPurchaseReportTable(false);
                            }}
                          >
                            <Flex direction={`column`} align={"center"}>
                              <IconReportMoney size={16} />
                            </Flex>
                          </Button>
                        </Tooltip>
                        <Flex
                          direction={`column`}
                          align={"center"}
                          fz={"12"}
                          c={"gray.5"}
                        >
                          {t("SalesReport")}
                        </Flex>
                      </Flex>
                    </Container>
                  </Center>
                  <Center>
                    <Container fluid mb={"8"}>
                      <Flex
                        justify={"center"}
                        align={"center"}
                        direction={"column"}
                      >
                        <Tooltip
                          label={t("AltTextReset")}
                          px={16}
                          py={2}
                          withArrow
                          position={"left"}
                          c={"white"}
                          bg={`red.5`}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 500,
                          }}
                        >
                          <Button
                            size="md"
                            pl={"12"}
                            pr={"12"}
                            mb={"xs"}
                            bg={purchaseReport ? "red.5" : undefined}
                            variant={purchaseReport ? "filled" : "light"}
                            color="red.5"
                            radius="xl"
                            onClick={(e) => {
                              setPurchasereport(true),
                                setPurchaseReportTable(true),
                                setSalesReport(false),
                                setInventoryReport(false),
                                setAccountingReport(false),
                                setInventoryReportTable(false),
                                setSalesReportTable(false),
                                setAccountingReportTable(false);
                            }}
                          >
                            <Flex direction={`column`} align={"center"}>
                              <IconShoppingCart size={16} />
                            </Flex>
                          </Button>
                        </Tooltip>
                        <Flex
                          direction={`column`}
                          align={"center"}
                          fz={"12"}
                          c={"gray.5"}
                        >
                          {t("PurchaseReport")}
                        </Flex>
                      </Flex>
                    </Container>
                  </Center>
                  <Center>
                    <Container fluid mb={"8"}>
                      <Flex
                        justify={"center"}
                        align={"center"}
                        direction={"column"}
                      >
                        <Tooltip
                          label={t("AltTextReset")}
                          px={16}
                          py={2}
                          withArrow
                          position={"left"}
                          c={"white"}
                          bg={`red.5`}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 500,
                          }}
                        >
                          <Button
                            size="md"
                            pl={"12"}
                            pr={"12"}
                            mb={"xs"}
                            bg={accountingReport ? "red.5" : undefined}
                            variant={accountingReport ? "filled" : "light"}
                            color="red.5"
                            radius="xl"
                            onClick={(e) => {
                              setAccountingReport(true),
                                setAccountingReportTable(true),
                                setSalesReport(false),
                                setInventoryReport(false),
                                setPurchasereport(false),
                                setInventoryReportTable(false),
                                setSalesReportTable(false),
                                setPurchaseReportTable(false);
                            }}
                          >
                            <Flex direction={`column`} align={"center"}>
                              <IconFileInvoice size={16} />
                            </Flex>
                          </Button>
                        </Tooltip>
                        <Flex
                          direction={`column`}
                          align={"center"}
                          fz={"12"}
                          c={"gray.5"}
                        >
                          {t("AccountingReport")}
                        </Flex>
                      </Flex>
                    </Container>
                  </Center>
                </Stack>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={12}>
            <Box bg={"white"}>
              <_ReportBox
                setDataLimit={setDataLimit}
                inventoryReport={inventoryReport}
                salesReport={salesReport}
                purchaseReport={purchaseReport}
                accountingReport={accountingReport}
                setEnableTable={setEnableTable}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={31}>
            {inventoryReportTable && (
              <__InventoryTable
                dataLimit={dataLimit}
                enableTable={enableTable}
                setDataLimit={setDataLimit}
              />
            )}
            {salesReportTable && <__SalesTable dataLimit={dataLimit} />}
            {accountingReportTable && (
              <__AccountingTable dataLimit={dataLimit} />
            )}
            {purchaseReportTable && <__PurchaseTable dataLimit={dataLimit} />}
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}

export default Reports;
