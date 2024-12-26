import {
    Box,
    Flex,
    NumberInput,
    Button,
    ActionIcon,
    Text,
  } from "@mantine/core";
  import { DataTable } from "mantine-datatable";
  import React, { useState } from "react";
  import { useSelector } from "react-redux";
  import tableCss from "../../../../assets/css/Table.module.css";
  import { useTranslation } from "react-i18next";
  import { useOutletContext } from "react-router-dom";
  import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
  
  export default function __AccountingTable(props) {
    const { dataLimit } = props;
    const { mainAreaHeight, isOnline } = useOutletContext();
    const height = mainAreaHeight - 98;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const { t } = useTranslation();
    const fetching = useSelector((state) => state.crudSlice.fetching);
    const [records, setRecords] = useState([
      {
        item_index: 0,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "2100",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
      {
        item_index: 1,
        mode: "Dr",
        ledger_name: "Daily Expenses - Conveyance Exp.",
        debit: "2040",
        credit: "900",
      },
    ]);
    return (
      <>
        <Box p={"xs"} className={"borderRadiusAll"} bg={"white"}>
          <Box className="borderRadiusAll" h={height - 6}>
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
                    width: 70,
                    render: (record) => (
                      <ActionIcon color="red.5" size={"sm"}>
                        <IconPlus height={18} width={18} stroke={1.5} />
                      </ActionIcon>
                    ),
                  },
                  {
                    accessor: "mode",
                    title: t("Mode"),
                    width: 100,
                  },
                  {
                    accessor: "ledger_name",
                    title: t("LedgerName"),
                    width: 540,
                  },
                  {
                    accessor: "debit",
                    title: t("Debit"),
                    width: 130,
                    render: (record, index) => (
                      <NumberInput
                        hideControls
                        ta={"right"}
                        value={record.debit}
                        onChange={(e) =>
                          handleInputChange(index, "debit", e.target.value)
                        }
                      />
                    ),
                  },
                  {
                    accessor: "credit",
                    title: t("Credit"),
                    width: 130,
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
                // useDataTableColumns
                key={"item_index"}
                // resizableColumns
                onPageChange={(p) => {
                  setPage(p);
                  dispatch(setFetching(true));
                }}
                loaderSize="xs"
                loaderColor="grape"
                height={height - 8}
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
                  {!saveCreateLoading && isOnline && dataLimit && (
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
  