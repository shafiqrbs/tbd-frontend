import {
  Box,
  Flex,
  NumberInput,
  Button,
  ActionIcon,
  Text,
  ScrollArea,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

export default function __SalesTable(props) {
  const { dataLimit, enableTable } = props;
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 98;
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const { t } = useTranslation();
  const fetching = useSelector((state) => state.crudSlice.fetching);
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([
    {
      item_index: 1,
      mode: "Dr",
      ledger_name: "Office Rent & Utilities",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 2,
      mode: "Dr",
      ledger_name: "Staff Salary & Benefits",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 3,
      mode: "Dr",
      ledger_name: "Marketing & Advertisement",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 4,
      mode: "Dr",
      ledger_name: "Equipment Purchase",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 5,
      mode: "Dr",
      ledger_name: "Travel & Accommodation",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 6,
      mode: "Dr",
      ledger_name: "Professional Services",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 7,
      mode: "Dr",
      ledger_name: "Insurance Premium",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 8,
      mode: "Dr",
      ledger_name: "Bank Charges & Fees",
      debit: "2040",
      credit: "2100",
    },
    {
      item_index: 9,
      mode: "Dr",
      ledger_name: "Telephone & Internet",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 10,
      mode: "Dr",
      ledger_name: "Office Supplies",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 11,
      mode: "Dr",
      ledger_name: "Vehicle Maintenance",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 12,
      mode: "Dr",
      ledger_name: "Software Licenses",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 13,
      mode: "Dr",
      ledger_name: "Training & Development",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 14,
      mode: "Dr",
      ledger_name: "Legal & Compliance",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 15,
      mode: "Dr",
      ledger_name: "Customer Entertainment",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 16,
      mode: "Dr",
      ledger_name: "Repair & Maintenance",
      debit: "2040",
      credit: "900",
    },
    {
      item_index: 17,
      mode: "Dr",
      ledger_name: "Petrol & Fuel Expenses",
      debit: "2040",
      credit: "900",
    },
  ]);
  return (
    <>
      <Box p={"xs"} className={"borderRadiusAll"} bg={"white"}>
        <Box className="borderRadiusAll">
          {dataLimit ? (
            <Box>
              <Flex
                direction={"row"}
                gap={"xs"}
                align={"center"}
                justify={"center"}
                h={height - 36}
              >
                {!saveCreateLoading && isOnline && (
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
          ) : (
            <DataTable
              classNames={{
                root: tableCss.root,
                table: tableCss.table,
                header: tableCss.header,
                footer: tableCss.footer,
                pagination: tableCss.pagination,
              }}
              records={records}
              columns={[
                {
                  accessor: "item_index",
                  title: t("S/N"),
                  render: (record) => (
                    <ActionIcon color="red.5" size={"sm"}>
                      <IconPlus height={18} width={18} stroke={1.5} />
                    </ActionIcon>
                  ),
                },
                {
                  accessor: "mode",
                  title: t("Mode"),
                  
                },
                {
                  accessor: "ledger_name",
                  title: t("LedgerName"),
                },
                {
                  accessor: "debit",
                  title: t("Debit"),
                },
                {
                  accessor: "credit",
                  title: t("Credit"),
                  resizable: true,
                },
                {
                  accessor: "action",
                  title: t("Action"),
                  textAlign: "right",
                },
              ]}
              fetching={fetching}
              totalRecords={records.length}
              loaderSize="xs"
              loaderColor="grape"
              height={height - 40}
              scrollAreaProps={{ type: "never" }}
            />
          )}
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
                {!saveCreateLoading && isOnline && enableTable && (
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
      </Box>
    </>
  );
}
