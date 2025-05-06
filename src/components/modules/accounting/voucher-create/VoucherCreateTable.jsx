import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  ActionIcon,
  Text,
  rem,
  Menu,
  Switch,
  Flex,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDotsVertical,
  IconTrashX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import {
  editEntityData,
  getIndexEntityData,
  setFetching,
  setFormLoading,
  setInsertType,
  showEntityData,
  deleteEntityData,
} from "../../../../store/accounting/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch.jsx";
import { modals } from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import _VoucherCreateViewDrawer from "./_VoucherCreateViewDrawer.jsx";

function VoucherCreateTable(props) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98; //TabList height 104
  const perPage = 50;
  const [page, setPage] = useState(1);

  const fetching = useSelector((state) => state.crudSlice.fetching);
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const indexData = useSelector((state) => state.crudSlice.indexEntityData);

  const [switchEnable, setSwitchEnable] = useState({});

  const handleSwitch = (event, item) => {
    setSwitchEnable((prev) => ({ ...prev, [item.id]: true }));
    // const value = {
    //   url: "inventory/product/status/inline-update/" + item.id,
    // };
    // dispatch(getStatusInlineUpdateData(value));
    // setTimeout(() => {
    //   setSwitchEnable((prev) => ({ ...prev, [item.id]: false }));
    // }, 3000);
  };

  useEffect(() => {
    const value = {
      url: "accounting/voucher",
      param: {
        term: searchKeyword,
        page: page,
        offset: perPage,
      },
    };
    dispatch(getIndexEntityData(value));
  }, [fetching]);

  const navigate = useNavigate();
  const [voucherCrateViewDrawer, setVoucherCreateViewDrawer] = useState(false);
  return (
    <>
      <Box
        pl={`xs`}
        pr={8}
        pt={"6"}
        pb={"4"}
        className={"boxBackground borderRadiusAll border-bottom-none"}
      >
        <KeywordSearch module={"customer"} />
      </Box>
      <Box className={"borderRadiusAll border-top-none"}>
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
              accessor: "index",
              title: t("S/N"),
              textAlignment: "right",
              render: (item) => indexData.data.indexOf(item) + 1,
            },
            { accessor: "name", title: t("Name") },
            { accessor: "short_name", title: t("ShortName") },
            { accessor: "short_code", title: t("ShortCode") },
            { accessor: "mode", title: t("Mode") },
            { accessor: "voucher_type_name", title: t("VoucherType") },
            {
              accessor: "status",
              title: t("Status"),
              textAlign: "center",
              render: (item) => (
                <Flex justify="center" align="center">
                  <Switch
                    disabled={switchEnable[item.id] || false || item.parent_id}
                    defaultChecked={item.status == 1 ? true : false}
                    color="red"
                    radius="xs"
                    size="md"
                    onLabel="Enable"
                    offLabel="Disable"
                    onChange={(event) => {
                      handleSwitch(event.currentTarget.checked, item);
                    }}
                  />
                </Flex>
              ),
            },
            {
              accessor: "action",
              title: t("Action"),
              textAlign: "right",
              render: (data) => (
                <Group gap={4} justify="right" wrap="nowrap">
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
                          height={"18"}
                          width={"18"}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        // href={`/inventory/sales/edit/${data.id}`}
                        onClick={() => {
                          dispatch(setInsertType("update"));
                          dispatch(
                            editEntityData(
                              `accounting/voucher/${data.id}`
                            )
                          );
                          dispatch(setFormLoading(true));
                          navigate(`/accounting/voucher-create/${data.id}`);
                        }}
                      >
                        {t("Edit")}
                      </Menu.Item>

                      <Menu.Item
                        onClick={() => {
                          console.log("ok")
                          setVoucherCreateViewDrawer(true);
                          dispatch(
                            showEntityData(
                              `accounting/voucher/${data.id}`
                            )
                          );
                          // dispatch(showEntityData('core/customer/' + data.id))
                        }}
                        target="_blank"
                        component="a"
                        w={"200"}
                      >
                        {t("Show")}
                      </Menu.Item>
                      <Menu.Item
                        // href={``}
                        target="_blank"
                        component="a"
                        w={"200"}
                        mt={"2"}
                        bg={"red.1"}
                        c={"red.6"}
                        onClick={() => {
                          modals.openConfirmModal({
                            title: (
                              <Text size="md">
                                {" "}
                                {t("FormConfirmationTitle")}
                              </Text>
                            ),
                            children: (
                              <Text size="sm">
                                {" "}
                                {t("FormConfirmationMessage")}
                              </Text>
                            ),
                            labels: { confirm: "Confirm", cancel: "Cancel" },
                            onCancel: () => console.log("Cancel"),
                            confirmProps: { color: "red.6" },
                            onConfirm: () => {
                              dispatch(
                                deleteEntityData(
                                  "accounting/voucher-create/" + data.id
                                )
                              );
                              dispatch(setFetching(true));
                            },
                          });
                        }}
                        rightSection={
                          <IconTrashX
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        {t("Delete")}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              ),
            },
          ]}
          fetching={fetching}
          totalRecords={indexData.total}
          recordsPerPage={perPage}
          page={page}
          onPageChange={(p) => {
            setPage(p);
            dispatch(setFetching(true));
          }}
          loaderSize="xs"
          loaderColor="grape"
          height={height}
          scrollAreaProps={{ type: "never" }}
        />
      </Box>
      {voucherCrateViewDrawer &&
                <_VoucherCreateViewDrawer voucherCrateViewDrawer={voucherCrateViewDrawer} setVoucherCreateViewDrawer={setVoucherCreateViewDrawer} />
            }
    </>
  );
}
export default VoucherCreateTable;
