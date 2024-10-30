import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { ActionIcon, Box, Button, Menu, rem } from "@mantine/core";
import KeywordSearch from "../../filter/KeywordSearch";
import { DataTable } from "mantine-datatable";
import { IconDotsVertical, IconPencil } from "@tabler/icons-react";

export default function _RequisitionTable(props) {
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const tableHeight = mainAreaHeight - 120;
  const perPage = 50;
  const [page, setPage] = useState(1);

  const data = [
    {
      created: "22/11/10",
      product: "Apple",
      quantity: 100,
      status: "Approved",
    },
    {
      created: "22/11/11",
      product: "Apples",
      quantity: 101,
      status: "Pending",
    },
  ];

  return (
    <>
      <Box bg={"white"} p={"xs"} className="borderRadiusAll">
        <Box
          pl={"xs"}
          pb={"xs"}
          pr={8}
          pt={"xs"}
          mb={"xs"}
          className="boxBackground borderRadiusAll"
        >
          <KeywordSearch module={"purchase-requisition"} />
        </Box>
        <Box className="borderRadiusAll">
          <DataTable
            classNames={{
              root: tableCss.root,
              table: tableCss.table,
              header: tableCss.header,
              footer: tableCss.footer,
              paginatoin: tableCss.pagination,
            }}
            records={data}
            columns={[
              {
                accessor: "id",
                title: t("S/N"),
                textAlign: "left",
                render: (item) => data.indexOf(item) + 1,
              },
              {
                accessor: "product",
                title: t("Product"),
              },
              {
                accessor: "created",
                title: t("Created"),
              },
              {
                accessor: "quantity",
                title: t("Quantity"),
                textAlign: "center",
              },
              {
                accessor: "status",
                title: t("Status"),
                textAlign: "center",
                render: (data) => (
                  <Button
                    aria-placeholder="asdasd"
                    variant="filled"
                    color="red.5"
                    size="compact-xs"
                    radius={"sm"}
                    fw={100}
                    fz={12}
                    mr={4}
                    w={70}
                  >
                    {data.status}
                  </Button>
                ),
              },
              {
                accessor: "action",
                title: t("Action"),
                textAlign: "right",
                render: (data) => (
                  <Box>
                    <Menu
                      position="bottom-end"
                      offset={3}
                      withArrow
                      trigger="hover"
                      openDelay={100}
                      closeDelay={400}
                    >
                      <Menu.Target>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="red"
                          radius="xl"
                          aria-label="Settings"
                        >
                          <IconDotsVertical
                            style={{ width: 12, height: 12 }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          onclick={""}
                          w={200}
                          component="a"
                          leftSection={
                            <IconPencil
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                        >
                          {t("Edit")}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Box>
                ),
              },
            ]}
            // fetching={}
            totalRecords={data.length}
            recordsPerPage={perPage}
            page={page}
            onPageChange={(p) => {
              setPage(p);
            }}
            loaderSize="xs"
            loaderColor="grape"
            height={tableHeight}
            scrollAreaProps={{ type: "never" }}
          />
        </Box>
      </Box>
    </>
  );
}
