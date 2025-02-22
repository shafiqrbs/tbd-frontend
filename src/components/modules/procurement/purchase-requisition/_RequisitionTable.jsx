import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  LoadingOverlay,
  Menu,
  rem,
  Stack,
  Text,
  ScrollArea,
  Table,
} from "@mantine/core";
import _RequisitionSearch from "./_RequisitionSearch";
import { DataTable } from "mantine-datatable";
import {
  IconDotsVertical,
  IconPencil,
  IconPrinter,
  IconEdit,
  IconReceipt,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { setFetching } from "../../../../store/core/crudSlice";
import _ShortcutTable from "../../shortcut/_ShortcutTable";
import { useHotkeys } from "@mantine/hooks";
import { InvoiceBatchPrintPos } from "../../inventory/invoice-batch/invoice-batch-print/InvoiceBatchPrintPos";
import {getIndexEntityData} from "../../../../store/inventory/crudSlice.js";
import { PrintNormal } from "../requisition-print/PrintNormal.jsx";

export default function _RequisitionTable(props) {
  const printRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const tableHeight = mainAreaHeight - 106;
  const height = mainAreaHeight - 320;

  const perPage = 50;
  const [page, setPage] = useState(1);
  const [printA4, setPrintA4] = useState(false);
  const [printPos, setPrintPos] = useState(false);
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState("");
  const [indexData, setIndexData] = useState([])
  const [fetching, setFetching] = useState(true)
  const [requisitionViewData, setRequisitionViewData] = useState({});
  const requisitionFilterData = useSelector((state) => state.coreCrudSlice.requisitionFilterData);
  // const coreFetching = useSelector((state) => state.coreCrudSlice.fetching);

  const [loading, setLoading] = useState(true);
      useEffect(() => {
          setTimeout(() => {
              setLoading(false);
          }, 500);
      }, [loading]);

  const fetchData = async () => {
    // setFetching(true)
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    const value = {
      url: 'inventory/requisition',
      param: {
        term: requisitionFilterData.searchKeyword,
        vendor_id: requisitionFilterData.vendor_id,
        start_date: requisitionFilterData.start_date && new Date(requisitionFilterData.start_date).toLocaleDateString("en-CA", options),
        end_date: requisitionFilterData.end_date && new Date(requisitionFilterData.end_date).toLocaleDateString("en-CA", options),
        page: page,
        offset: perPage
      }
    }

    try {
      const resultAction = await dispatch(getIndexEntityData(value));

      if (getIndexEntityData.rejected.match(resultAction)) {
        console.error('Error:', resultAction);
      } else if (getIndexEntityData.fulfilled.match(resultAction)) {
        setIndexData(resultAction.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }finally {
      setFetching(false)
      // dispatch(setFetching(false))
    }
  };

  useEffect(() => {
    fetchData();
  // }, [salesFilterData,page]);
  }, [page,fetching]);

  useEffect(() => {
    setSelectedRow(indexData.data && indexData.data[0] && indexData.data[0].invoice)
    
    setRequisitionViewData(
      indexData.data && indexData.data[0] && indexData.data[0]
  );
  }, [indexData.data])
  const rows =
    requisitionViewData &&
    requisitionViewData?.requisition_items &&
    requisitionViewData?.requisition_items.map((element, index) => (
      <Table.Tr key={element.id}>
        <Table.Td fz="xs" width={"20"}>
          {index + 1}
        </Table.Td>
        <Table.Td ta="left" fz="xs" width={"300"}>
          {element.item_name}
        </Table.Td>
        <Table.Td ta="center" fz="xs" width={"60"}>
          {element.quantity}
        </Table.Td>
        <Table.Td ta="center" fz="xs" width={"60"}>
          {element.unit_name}
        </Table.Td>
        <Table.Td ta="right" fz="xs" width={"80"}>
          {element.purchase_price}
        </Table.Td>
        <Table.Td ta="right" fz="xs" width={"100"}>
          {element.sub_total}
        </Table.Td>
      </Table.Tr>
    ));

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          navigate("/procurement/new-requisition");
        },
      ],
    ],
    []
  );

  
  return (
    <>
      <Box>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={24}>
            <Box
              pl={`xs`}
              pb={"4"}
              pr={"xs"}
              pt={"4"}
              mb={"4"}
              className={"boxBackground borderRadiusAll"}
            >
              <Grid>
                <Grid.Col>
                  <Stack>
                    <_RequisitionSearch checkList={1} customerId={1} setFetching={setFetching} />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
      <Box>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={15}>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
              <Box className="borderRadiusAll">
                <DataTable
                  classNames={{
                    root: tableCss.root,
                    table: tableCss.table,
                    header: tableCss.header,
                    footer: tableCss.footer,
                    pagination: tableCss.pagination,
                  }}
                  records={indexData.data}
                  columns={[
                    {
                      accessor: "id",
                      title: t("S/N"),
                      textAlign: "left",
                      render: (item) => indexData.data.indexOf(item) + 1,
                    },
                    {
                      accessor: "created",
                      title: t("Created"),
                    },
                    {
                      accessor: "expected_date",
                      title: t("expectedDate"),
                    },
                    {
                      accessor: "invoice",
                      title: t("Invoice"),
                      textAlign: "center",
                      render: (item) => (
                        <Text
                          component="a"
                          size="sm"
                          variant="subtle"
                          c="red.4"
                          onClick={(e) => {
                            e.preventDefault();
                            setLoading(true);
                            setSelectedRow(item.invoice);
                            setRequisitionViewData(item)
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {item.invoice}
                        </Text>
                      ),
                    },

                    {
                      accessor: "vendor_name",
                      title: t("Vendor"),
                      textAlign: "center",
                    },
                    {
                      accessor: "vendor_mobile",
                      title: t("vendorMobile"),
                      textAlign: "center",
                    },
                    {
                      accessor: "process",
                      title: t("Status"),
                      textAlign: "center",
                      render: (data) => (
                        <Button
                          size="compact-xs"
                          radius="xs"
                          variant="filled"
                          fw={"100"}
                          fz={"12"}
                          color="red.3"
                          mr={"4"}
                          w={60}
                        >
                          {data.process}
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
                          </Menu>
                        </Box>
                      ),
                    },
                  ]}
                  fetching={fetching}
                  totalRecords={indexData.total}
                  recordsPerPage={perPage}
                  page={page}
                  onPageChange={(p) => {
                    setPage(p);
                    // dispatch(setFetching(true));
                  }}
                  loaderSize="xs"
                  loaderColor="grape"
                  height={tableHeight}
                  scrollAreaProps={{ type: "never" }}
                  rowBackgroundColor={(item) => {
                    if (item.invoice === selectedRow) return "#e2c2c263";
                  }}
                  rowColor={(item) => {
                    if (item.invoice === selectedRow) return "red.6";
                  }}
                />
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={8}>
            <Box
              bg={"white"}
              p={"xs"}
              className={"borderRadiusAll"}
              ref={printRef}
              pos="relative"
            >
              {loading && (
                <LoadingOverlay
                  visible={loading}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                  loaderProps={{ color: "red" }}
                />
              )}
              <Box
                h={"42"}
                pl={`xs`}
                mb={4}
                fz={"sm"}
                fw={"600"}
                pr={8}
                pt={"xs"}
                className={"boxBackground textColor borderRadiusAll"}
              >
                {t("Invoice")}: {requisitionViewData && requisitionViewData.invoice}
              </Box>
              <Box className={"borderRadiusAll border-top-none"} fz={"sm"}>
                <ScrollArea h={100} type="never">
                  <Box
                    pl={`xs`}
                    fz={"sm"}
                    fw={"600"}
                    pr={"xs"}
                    pt={"6"}
                    pb={"xs"}
                    className={"boxBackground textColor"}
                  >
                    <Grid gutter={{ base: 4 }}>
                      <Grid.Col span={"6"}>
                        <Grid columns={15} gutter={{ base: 4 }}>
                          <Grid.Col span={6}>
                            <Text fz="sm" lh="xs">
                              {t("Customer")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <Text fz="sm" lh="xs">
                              {requisitionViewData &&
                                requisitionViewData.vendor_name &&
                                requisitionViewData.vendor_name}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <Grid columns={15} gutter={{ base: 4 }}>
                          <Grid.Col span={6}>
                            <Text fz="sm" lh="xs">
                              {t("Mobile")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <Text fz="sm" lh="xs">
                              {requisitionViewData &&
                                requisitionViewData.vendor_mobile &&
                                requisitionViewData.vendor_mobile}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <Grid columns={15} gutter={{ base: 4 }}>
                          <Grid.Col span={6}>
                            <Text fz="sm" lh="xs">
                              {t("Address")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <Text fz="sm" lh="xs">
                              {requisitionViewData &&
                                requisitionViewData.vendor_address &&
                                requisitionViewData.vendor_address}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <Grid columns={15} gutter={{ base: 4 }}>
                          <Grid.Col span={6}>
                            <Text fz="sm" lh="xs">
                              {t("Balance")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <Text fz="sm" lh="xs">
                              {requisitionViewData && requisitionViewData.balance
                                ? Number(requisitionViewData.balance).toFixed(2)
                                : 0.0}
                            </Text>
                          </Grid.Col>
                        </Grid>
                      </Grid.Col>
                      <Grid.Col span={"6"}>
                        <Grid columns={15} gutter={{ base: 4 }}>
                          <Grid.Col span={6}>
                            <Text fz="sm" lh="xs">
                              {t("Created")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <Text fz="sm" lh="xs">
                              {requisitionViewData &&
                                requisitionViewData.created &&
                                requisitionViewData.created}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <Grid columns={15} gutter={{ base: 4 }}>
                          <Grid.Col span={6}>
                            <Text fz="sm" lh="xs">
                              {t("CreatedBy")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={9}>
                            <Text fz="sm" lh="xs">
                              {requisitionViewData &&
                                requisitionViewData.createdByUser &&
                                requisitionViewData.createdByUser}
                            </Text>
                          </Grid.Col>
                        </Grid>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </ScrollArea>
                <ScrollArea h={height + 31} scrollbarSize={2} type="never">
                  <Box>
                    <Table stickyHeader>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th fz="xs" w={"20"}>
                            {t("S/N")}
                          </Table.Th>
                          <Table.Th fz="xs" ta="left" w={"300"}>
                            {t("Name")}
                          </Table.Th>
                          <Table.Th fz="xs" ta="center" w={"60"}>
                            {t("QTY")}
                          </Table.Th>
                          <Table.Th ta="center" fz="xs" w={"100"}>
                            {t("UOM")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"80"}>
                            {t("Price")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"100"}>
                            {t("SubTotal")}
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                      <Table.Tfoot>
                        <Table.Tr>
                          <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                            {t("SubTotal")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"100"}>
                            {requisitionViewData &&
                              requisitionViewData.sub_total &&
                              Number(requisitionViewData.sub_total).toFixed(2)}
                          </Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                            {t("Discount")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"100"}>
                            {requisitionViewData &&
                              requisitionViewData.discount &&
                              Number(requisitionViewData.discount).toFixed(2)}
                          </Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                            {t("Total")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"100"}>
                            {requisitionViewData &&
                              requisitionViewData.total &&
                              Number(requisitionViewData.total).toFixed(2)}
                          </Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                            {t("Receive")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"100"}>
                            {requisitionViewData &&
                              requisitionViewData.payment &&
                              Number(requisitionViewData.payment).toFixed(2)}
                          </Table.Th>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
                            {t("Due")}
                          </Table.Th>
                          <Table.Th ta="right" fz="xs" w={"100"}>
                            {requisitionViewData &&
                              requisitionViewData.total &&
                              (
                                Number(requisitionViewData.total) -
                                Number(requisitionViewData.payment)
                              ).toFixed(2)}
                          </Table.Th>
                        </Table.Tr>
                      </Table.Tfoot>
                    </Table>
                  </Box>
                </ScrollArea>
              </Box>
              <Button.Group mb={2}>
                <Button
                  fullWidth={true}
                  variant="filled"
                  leftSection={<IconPrinter size={14} />}
                  color="green.5"
                  onClick={() => {
                    setPrintA4(true);
                  }}
                >
                  {t("Print")}
                </Button>
                <Button
                  fullWidth={true}
                  variant="filled"
                  leftSection={<IconReceipt size={14} />}
                  color="red.5"
                  onClick={() => {
                    setPrintPos(true);
                  }}
                >
                  {t("POS")}
                </Button>

                <Button
                  // href={`/inventory/sales/edit/${salesViewData?.id}`}
                  component="a"
                  fullWidth={true}
                  variant="filled"
                  leftSection={<IconEdit size={14} />}
                  color="cyan.5"
                  onClick={() => {
                    setMmSwapEnabled(true);
                  }}
                >
                  {t("Edit")}
                </Button>
              </Button.Group>
            </Box>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
              <_ShortcutTable
                heightOffset={0}
                form=""
                FormSubmit={"EntityFormSubmit"}
                Name={"CompanyName"}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
      {printA4 && (
        <div style={{ display: "none" }}>
          <PrintNormal
            requisitionViewData={requisitionViewData}
            setPrintA4={setPrintA4}
          />
        </div>
      )}
      {printPos && (
        <div style={{ display: "none" }}>
          <InvoiceBatchPrintPos
            invoiceBatchData={requisitionViewData}
            setPrintPos={setPrintPos}
          />
        </div>
      )}
    </>
  );
}
