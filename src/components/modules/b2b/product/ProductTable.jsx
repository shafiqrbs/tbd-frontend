import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  ActionIcon,
  Text,
  Menu,
  rem,
  Switch,
  Flex,
  Image,
  Modal,
  Button,
  TextInput,
} from "@mantine/core";
import {
  editEntityData,
  getIndexEntityData,
  setFetching,
  setFormLoading,
  setInsertType,
  showEntityData,
  deleteEntityData,
  getStatusInlineUpdateData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { getHotkeyHandler } from "@mantine/hooks";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useForm } from "@mantine/form";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";

export default function ProductTable(props) {
  const { id } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 120;

  const navigate = useNavigate();
  const perPage = 50;
  const [page, setPage] = useState(1);

  const [fetching, setFetching] = useState(false);
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const productFilterData = useSelector(
    (state) => state.inventoryCrudSlice.productFilterData
  );
  const fetchingReload = useSelector((state) => state.crudSlice.fetching);

  const [switchEnable, setSwitchEnable] = useState({});

  const handleSwitch = (event, item) => {
    setSwitchEnable((prev) => ({ ...prev, [item.id]: true }));
    const value = {
      url: "inventory/product/status/inline-update/" + item.id,
    };
    dispatch(getStatusInlineUpdateData(value));
    setTimeout(() => {
      setSwitchEnable((prev) => ({ ...prev, [item.id]: false }));
    }, 3000);
  };

  const [indexData, setIndexData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: "inventory/product",
        param: {
          term: searchKeyword,
          name: productFilterData.name,
          alternative_name: productFilterData.alternative_name,
          sku: productFilterData.sku,
          sales_price: productFilterData.sales_price,
          page: page,
          offset: perPage,
          type: "product",
        },
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
          setFetching(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [
    dispatch,
    searchKeyword,
    productFilterData,
    page,
    perPage,
    fetchingReload,
  ]);
  const form = useForm({
    initialValues: {
      mode_id: "",
    },
  });
  const [modeMap, setModeMap] = useState({});

  return (
    <>
      <Box
        pl={`xs`}
        pb={"xs"}
        pr={8}
        pt={"xs"}
        mb={"xs"}
        className={"boxBackground borderRadiusAll"}
      >
        <_Search module={"product"} />
      </Box>
      <Box className={"borderRadiusAll"}>
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
              textAlignment: "right   ",
              render: (item) => indexData.data.indexOf(item) + 1,
            },
            { accessor: "product_name", title: t("Name") },
            { accessor: "category_name", title: t("Category") },
            {
              accessor: "category_percent",
              title: (
                <Box>
                  <Text fw={500} ta={"center"} mb={5}>
                    {t("Percent")}
                  </Text>
                  <Group justify="center" gap={4} noWrap>
                    <Text fz="xs" c="dimmed" w={80} ta="center">
                      {t("Mode")}
                    </Text>
                    <Text fz="xs" c="dimmed" w={80} ta="center">
                      {"SalesPercent"}
                    </Text>
                    <Text fz="xs" c="dimmed" w={80} ta="center">
                      {t("DiscountPercent")}
                    </Text>
                  </Group>
                </Box>
              ),
              textAlign: "center",
              render: (item) => {
                return (
                  <Group justify="center" gap={4} noWrap mt={10}>
                    <Text w={80} ta="center">
                      {item.mode || "0"}
                    </Text>
                    <Text w={80} ta="center">
                      {item.sales_percent || "0"}
                    </Text>
                    <Text w={80} ta="center">
                      {item.discount_percent || "0"}
                    </Text>
                  </Group>
                );
              },
            },
            {
              accessor: "central",
              title: (
                <Box>
                  <Text fw={500} mb={5}>
                    {t("Central")}
                  </Text>
                  <Group justify="center" gap={4} noWrap>
                    <Text fz="xs" c="dimmed" w={50} ta="center">
                      {t("Stock")}
                    </Text>
                    <Text fz="xs" c="dimmed" w={80} ta="center">
                      {"PurchasePrice"}
                    </Text>
                    <Text fz="xs" c="dimmed" w={50} ta="center">
                      {t("MRP")}
                    </Text>
                  </Group>
                </Box>
              ),
              textAlign: "center",
              render: (item) => {
                return (
                  <Group justify="center" gap={4} noWrap mt={10}>
                    <Text w={50} ta="center">
                      {item.stock || "0"}
                    </Text>
                    <Text w={80} ta="center">
                      {item.mrp || "0"}
                    </Text>
                    <Text w={50} ta="center">
                      {item.price || "0"}
                    </Text>
                  </Group>
                );
              },
            },
            {
              accessor: "category_percent",
              title: (
                <Box>
                  <Text fw={500} mb={5}>
                    {t("Branch")}
                  </Text>
                  <Group justify="center" gap={4} noWrap>
                    <Text fz="xs" c="dimmed" w={100} ta="center">
                      {t("PurchasePrice")}
                    </Text>
                    <Text fz="xs" c="dimmed" w={100} ta="center">
                      {"SalesPrice"}
                    </Text>
                    <Text fz="xs" c="dimmed" w={100} ta="center">
                      {t("DiscountPrice")}
                    </Text>
                  </Group>
                </Box>
              ),
              textAlign: "center",
              render: (item) => {
                const [editedSalesPercent, setEditedSalesPrice] = useState(
                  item.sales_percent
                );

                const handlQuantityChange = (e) => {
                  const editedSalesPercent = e.currentTarget.value;
                  setEditedSalesPrice(editedSalesPercent);

                  let salesPercentElement = document.getElementById(
                    "inline-update-sales-percent-" + item.id
                  );
                };
                return (
                  <Group justify="center" gap={4} noWrap mt={10}>
                    <TextInput
                      w={100}
                      type="number"
                      label=""
                      size="xs"
                      id={"inline-update-sales-percent-" + item.id}
                      value={Number(editedSalesPercent)}
                      onChange={() => {}}
                      onKeyDown={getHotkeyHandler([
                        [
                          "Enter",
                          (e) => {
                            document
                              .getElementById(
                                "inline-update-sales-percent-" + item.id
                              )
                              .focus();
                          },
                        ],
                      ])}
                    />
                    <TextInput
                      w={100}
                      type="number"
                      label=""
                      size="xs"
                      id={"inline-update-sales-percent-" + item.id}
                      value={Number(editedSalesPercent)}
                      onChange={() => {}}
                      onKeyDown={getHotkeyHandler([
                        [
                          "Enter",
                          (e) => {
                            document
                              .getElementById(
                                "inline-update-sales-percent-" + item.id
                              )
                              .focus();
                          },
                        ],
                      ])}
                    />
                    <TextInput
                      w={100}
                      type="number"
                      label=""
                      size="xs"
                      id={"inline-update-sales-percent-" + item.id}
                      value={Number(editedSalesPercent)}
                      onChange={() => {}}
                      onKeyDown={getHotkeyHandler([
                        [
                          "Enter",
                          (e) => {
                            document
                              .getElementById(
                                "inline-update-sales-percent-" + item.id
                              )
                              .focus();
                          },
                        ],
                      ])}
                    />
                  </Group>
                );
              },
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
                      {!data.parent_id && (
                        <Menu.Item
                          onClick={() => {
                            dispatch(setInsertType("update"));
                            dispatch(
                              editEntityData("inventory/product/" + data.id)
                            );
                            dispatch(setFormLoading(true));
                            navigate(`/inventory/product/${data.id}`);
                          }}
                        >
                          {t("Edit")}
                        </Menu.Item>
                      )}

                      <Menu.Item
                        onClick={() => {
                          setViewModal(true);
                          dispatch(
                            showEntityData("inventory/product/" + data.id)
                          );
                        }}
                        target="_blank"
                        component="a"
                        w={"200"}
                      >
                        {t("Show")}
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          setId(data.id);
                          setAddonDrawer(true);
                        }}
                        target="_blank"
                        component="a"
                        w={"200"}
                      >
                        {t("Addon")}
                      </Menu.Item>
                      {!data.parent_id && (
                        <Menu.Item
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
                              confirmProps: { color: "red.6" },
                              onCancel: () => console.log("Cancel"),
                              onConfirm: () => {
                                productDeleteHandle(data.id);
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
                      )}
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
    </>
  );
}
