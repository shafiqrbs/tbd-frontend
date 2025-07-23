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
import __InventoryTable from "./__InventoryTable.jsx";
import __PurchaseTable from "./__PurchaseTable.jsx";
import __SalesTable from "./__SalesTable.jsx";
import __AccountingTable from "./__AccountingTable.jsx";

const REPORT_TYPES = {
  INVENTORY: "inventory",
  SALES: "sales",
  PURCHASE: "purchase",
  ACCOUNTING: "accounting",
};

const REPORT_BUTTONS = [
  {
    id: REPORT_TYPES.INVENTORY,
    icon: IconBuildingWarehouse,
    label: "InventoryReport",
  },
  {
    id: REPORT_TYPES.SALES,
    icon: IconReportMoney,
    label: "SalesReport",
  },
  {
    id: REPORT_TYPES.PURCHASE,
    icon: IconShoppingCart,
    label: "PurchaseReport",
  },
  {
    id: REPORT_TYPES.ACCOUNTING,
    icon: IconFileInvoice,
    label: "AccountingReport",
  },
];

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 98;

  // Single state for active report type instead of multiple booleans
  const [activeReport, setActiveReport] = useState(REPORT_TYPES.INVENTORY);
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
          document.getElementById("method_id").click();
        },
      ],
    ],
    []
  );

  useHotkeys([["alt+r", () => {}]], []);

  useHotkeys([["alt+s", () => {}]], []);

  // Reusable report button component
  const ReportButton = ({ icon: Icon, label, id }) => (
    <Center>
      <Container fluid mb="8" mt={'xs'}>
        <Flex justify="center" align="center" direction="column">
          <Tooltip
            label={t("AltTextNew")}
            px={16}
            py={2}
            withArrow
            position="left"
            c="white"
            bg="red.5"
            transitionProps={{
              transition: "pop-bottom-left",
              duration: 500,
            }}
          >
            <Button
              size="md"
              pl="12"
              pr="12"
              mb="xs"
              bg={activeReport === id ? "red.5" : undefined}
              variant={activeReport === id ? "filled" : "light"}
              color="red.5"
              radius="xl"
              onClick={() => setActiveReport(id)}
            >
              <Flex direction="column" align="center">
                <Icon size={16} />
              </Flex>
            </Button>
          </Tooltip>
          <Flex direction="column" align="center" fz="12" c="gray.5">
            {t(label)}
          </Flex>
        </Flex>
      </Container>
    </Center>
  );

  // Component to render active report table
  const ReportTable = () => {
    switch (activeReport) {
      case REPORT_TYPES.INVENTORY:
        return (
          <__InventoryTable
            dataLimit={dataLimit}
            enableTable={enableTable}
            setDataLimit={setDataLimit}
          />
        );
      case REPORT_TYPES.SALES:
        return (
          <__SalesTable
            dataLimit={dataLimit}
            enableTable={enableTable}
            setDataLimit={setDataLimit}
          />
        );
      case REPORT_TYPES.PURCHASE:
        return (
          <__PurchaseTable
            dataLimit={dataLimit}
            enableTable={enableTable}
            setDataLimit={setDataLimit}
          />
        );
      case REPORT_TYPES.ACCOUNTING:
        return (
          <__AccountingTable
            dataLimit={dataLimit}
            enableTable={enableTable}
            setDataLimit={setDataLimit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box>
        <Grid columns={48} gutter={{ base: 6 }}>
          <Grid.Col span={4}>
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
                  align="center"
                >
                  {REPORT_BUTTONS.map((button) => (
                    <ReportButton
                      key={button.id}
                      id={button.id}
                      icon={button.icon}
                      label={button.label}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid.Col>

          <Grid.Col span={14}>
            <Box bg="white">
              <_ReportBox
                setDataLimit={setDataLimit}
                inventoryReport={activeReport === REPORT_TYPES.INVENTORY}
                salesReport={activeReport === REPORT_TYPES.SALES}
                purchaseReport={activeReport === REPORT_TYPES.PURCHASE}
                accountingReport={activeReport === REPORT_TYPES.ACCOUNTING}
                setEnableTable={setEnableTable}
              />
            </Box>
          </Grid.Col>

          <Grid.Col span={30}>
            <ReportTable />
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};
export default Reports;
