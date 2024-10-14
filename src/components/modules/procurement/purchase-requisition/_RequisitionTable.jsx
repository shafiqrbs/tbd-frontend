import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import tableCss from "../../../../assets/css/Table.module.css";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@mantine/core";
import KeywordSearch from "../../filter/KeywordSearch";
import { DataTable } from "mantine-datatable";

export default function _RequisitionTable(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation;
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
                accessor: "index",
                title: "S/N",
                textAlign: "left",
                render: (item) => data.indexOf(item) + 1,
              },
              {
                accessor: "product",
                title: "Product",
              },
              {
                accessor: "created",
                title: "Created",
              },
              {
                accessor: "quantity",
                title: "Quantity",
              },
              {
                accessor: "status",
                title: "Status",
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
            ]}
            // fetching={}
            totalRecords={data.total}
            recordsPerPage={perPage}
            page={page}
            onPageChange={(p) => {
              setPage(p);
            }}
            loaderSize="xs"
            loaderColor="grape"
            height={tableHeight }
          />
        </Box>
      </Box>
    </>
  );
}
