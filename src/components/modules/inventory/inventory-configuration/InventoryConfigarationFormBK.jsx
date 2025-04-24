import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Flex,
  Grid,
  Box,
  ScrollArea,
  Text,
  Title,
  Stack,
  Radio,
  Card,
  Center,
  Checkbox,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut";
import {
  setValidationData,
  showInstantEntityData,
  updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { getIndexEntityData } from "../../../../store/core/crudSlice.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig.js";

function InventoryConfigarationFormBK() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const inventoryConfigData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];
  const [formLoad, setFormLoad] = useState(true);
  const [setFormData, setFormDataForUpdate] = useState(false);

  const { domainConfig } = getDomainConfig();
  //   console.log(domainConfig);
  let inventory_config = domainConfig?.inventory_config;
  let config_sales = inventory_config?.config_sales;
  //   console.log(config_sales);

  // console.log(inventoryConfigData)
  const form = useForm({
    initialValues: {
      search_by_vendor: config_sales?.search_by_vendor,
      search_by_product_nature: config_sales?.search_by_product_nature,
      search_by_category: config_sales?.search_by_category,
      show_product: config_sales?.show_product,
      is_measurement_enabled: config_sales?.is_measurement_enabled,
      is_zero_receive_allow: config_sales?.is_zero_receive_allow,
      due_sales_without_customer: config_sales?.due_sales_without_customer,
      item_sales_percent: config_sales?.item_sales_percent,
      item_sales_percent: config_sales?.item_sales_percent,
      zero_stock: config_sales?.zero_stock,
      is_multi_price: config_sales?.is_multi_price,
      is_sales_auto_approved: config_sales?.is_sales_auto_approved,
      search_by_warehouse: config_sales?.search_by_warehouse,
      discount_with_customer: config_sales?.discount_with_customer,
    },
  });
  const [subDomainData, setSubDomainData] = useState([]);
  const [reloadList, setReloadList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: "domain/b2b/sub-domain",
        param: {},
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setSubDomainData(resultAction.payload);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setReloadList(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch]);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("is_brand").click();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );
  const handleFormSubmit = (values) => {
    // Dispatch to set validation state (if needed)
    dispatch(setValidationData(false));
    console.log("form", values);
    // Open confirmation modal
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => {
        console.log("Cancel");
      },
      onConfirm: () => handleConfirmSubmit(values), // Separate function for "onConfirm"
    });
  };
  const handleConfirmSubmit = async (values) => {
    const properties = [
      "search_by_vendor",
      "search_by_product_nature",
      "search_by_category",
      "show_product",
      "is_measurement_enabled",
      "is_zero_receive_allow",
      "due_sales_without_customer",
      "item_sales_percent",
      "zero_stock",
      "is_multi_price",
      "is_sales_auto_approved",
      "search_by_warehouse",
      "discount_with_customer",
    ];

    properties.forEach((property) => {
        form.values[property] = values[property] === true || values[property] == 1 ? 1 : 0;
    });

    try {
      const value = {
        url: `domain/config/inventory-product/${inventory_config?.id}`,
        data: values,
      };

      await dispatch(updateEntityData(value));

      const resultAction = await dispatch(
        showInstantEntityData("inventory/config")
      );
      if (showInstantEntityData.fulfilled.match(resultAction)) {
        if (resultAction.payload.data.status === 200) {
          localStorage.setItem(
            "config-data",
            JSON.stringify(resultAction.payload.data.data)
          );
        }
      }

      // Show success notification
      notifications.show({
        color: "teal",
        title: t("UpdateSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      // Reset loading state
      setTimeout(() => {
        setSaveCreateLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error updating entity:", error);

      // Error notification
      notifications.show({
        color: "red",
        title: t("UpdateFailed"),
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });
    }
  };
  const selectedDomainId = inventory_config?.domain_id;

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={4}>
            <Card shadow="md" radius="4" className={classes.card} padding="xs">
              <Grid gutter={{ base: 2 }}>
                <Grid.Col span={11}>
                  <Text fz="md" fw={500} className={classes.cardTitle}>
                    {t("ManageDomain")}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid columns={9} gutter={{ base: 1 }}>
                <Grid.Col span={9}>
                  <Box bg={"white"}>
                    <Box mt={8} pt={"8"}>
                      <ScrollArea
                        h={height}
                        scrollbarSize={2}
                        scrollbars="y"
                        type="never"
                      >
                        {subDomainData &&
                          subDomainData?.data &&
                          subDomainData.data.map((data) => (
                            <Box
                              style={{
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                              className={`${classes["pressable-card"]} border-radius`}
                              mih={40}
                              mt={"4"}
                              variant="default"
                              key={data.id}
                              onClick={() => {
                                setSelectedDomainId(data.id);
                                navigate(
                                  `/b2b/sub-domain/${module}/${data.id}`
                                );
                                setReloadList(true);
                              }}
                              bg={
                                data.id == selectedDomainId
                                  ? "#f8eedf"
                                  : "gray.1"
                              }
                            >
                              <Text
                                size={"sm"}
                                pt={8}
                                pl={8}
                                fw={500}
                                c={
                                  data.id === selectedDomainId
                                    ? "black"
                                    : "black"
                                }
                              >
                                {data.name}
                              </Text>
                            </Box>
                          ))}
                      </ScrollArea>
                    </Box>
                  </Box>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
          <Grid.Col span={11}>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"8"}
                  pb={"10"}
                  mb={"4"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <Title order={6} pt={"4"}>
                        {t("Sales")}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack right align="flex-end">
                        <>
                          {!saveCreateLoading && isOnline && (
                            <Button
                              size="xs"
                              className={"btnPrimaryBg"}
                              type="submit"
                              id="EntityFormSubmit"
                              leftSection={<IconDeviceFloppy size={16} />}
                            >
                              <Flex direction={`column`} gap={0}>
                                <Text fz={14} fw={400}>
                                  {t("UpdateAndSave")}
                                </Text>
                              </Flex>
                            </Button>
                          )}
                        </>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Box>
                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                  <ScrollArea
                    h={height}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                  >
                    <Box pt={"xs"} pl={"xs"}>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("ZeroStockAllowed")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.zero_stock === 1}
                              color="red"
                              {...form.getInputProps("zero_stock", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "zero_stock",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("StockItem")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.stock_item === 1}
                              color="red"
                              {...form.getInputProps("stock_item", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "stock_item",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("StockHistory")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.is_stock_history === 1}
                              color="red"
                              {...form.getInputProps("is_stock_history", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "is_stock_history",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("PosSales")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.pos_sales === 1}
                              color="red"
                              {...form.getInputProps("pos_sales", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "pos_sales",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("PayFirst")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.pay_first === 1}
                              color="red"
                              {...form.getInputProps("pay_first", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "pay_first",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("IsMultiPrice")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.is_multi_price === 1}
                              color="red"
                              {...form.getInputProps("is_multi_price", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "is_multi_price",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("IsSalesAutoApproved")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.is_sales_auto_approved === 1}
                              color="red"
                              {...form.getInputProps("is_sales_auto_approved", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "is_sales_auto_approved",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("SearchByWarehouse")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.search_by_warehouse === 1}
                              color="red"
                              {...form.getInputProps("search_by_warehouse", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "search_by_warehouse",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("DiscountWithCustomer")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.discount_with_customer === 1}
                              color="red"
                              {...form.getInputProps("discount_with_customer", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "discount_with_customer",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("MeasurementEnabled")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.is_measurement_enabled === 1}
                              color="red"
                              {...form.getInputProps("is_measurement_enabled", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "is_measurement_enabled",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("DueSalesWithoutCustomer")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={
                                form.values.due_sales_without_customer === 1
                              }
                              color="red"
                              {...form.getInputProps(
                                "due_sales_without_customer",
                                {
                                  type: "checkbox",
                                }
                              )}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "due_sales_without_customer",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("ZeroReceiveAllow")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.is_zero_receive_allow === 1}
                              color="red"
                              {...form.getInputProps("is_zero_receive_allow", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "is_zero_receive_allow",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("ItemSalesPercent")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.item_sales_percent === 1}
                              color="red"
                              {...form.getInputProps("item_sales_percent", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "item_sales_percent",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("SearchByCategory")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.search_by_category === 1}
                              color="red"
                              {...form.getInputProps("search_by_category", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "search_by_category",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("SearchByProdcutNature")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={
                                form.values.search_by_product_nature === 1
                              }
                              color="red"
                              {...form.getInputProps(
                                "search_by_product_nature",
                                {
                                  type: "checkbox",
                                }
                              )}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "search_by_product_nature",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("SearchByVendor")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.search_by_vendor === 1}
                              color="red"
                              {...form.getInputProps("search_by_vendor", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "search_by_vendor",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={11} fz={"sm"} pt={"1"}>
                            {t("SearchByVendor")}
                          </Grid.Col>
                          <Grid.Col span={1}>
                            <Checkbox
                              pr="xs"
                              checked={form.values.show_product === 1}
                              color="red"
                              {...form.getInputProps("show_product", {
                                type: "checkbox",
                              })}
                              onChange={(event) =>
                                form.setFieldValue(
                                  "show_product",
                                  event.currentTarget.checked ? 1 : 0
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      {inventoryConfigData?.pos_sales && (
                        <Box mt={"sm"}>
                          <Grid gutter={{ base: 1 }}>
                            <Grid.Col span={6}>
                              <Grid>
                                <Grid.Col span={11} fz={"sm"}>
                                  <Center ml={"sm"} pl={"md"}>
                                    {t("WithTable")}
                                  </Center>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                  <Checkbox
                                    {...form.getInputProps("with_table", {
                                      type: "checkbox",
                                    })}
                                    checked={form.values.with_table === 1}
                                    onChange={(event) =>
                                      form.setFieldValue(
                                        "with_table",
                                        event.currentTarget.checked ? 1 : 0
                                      )
                                    }
                                    ml="sm"
                                    color="red"
                                  />
                                </Grid.Col>
                              </Grid>
                            </Grid.Col>
                          </Grid>
                        </Box>
                      )}
                    </Box>
                  </ScrollArea>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={8}>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
              <Box
                h={48}
                pl={`xs`}
                pr={8}
                pt={"xs"}
                mb={"xs"}
                className={"boxBackground borderRadiusAll"}
              >
                <Title order={6} pl={"6"} pt={4}>
                  {t("DomainDetails")}
                </Title>
              </Box>
              <Box mb={0} bg={"gray.1"} h={height}>
                <Box
                  p={"md"}
                  className="boxBackground borderRadiusAll"
                  h={height}
                >
                  <ScrollArea h={height - 176} type="never">
                    <Grid columns={24}>
                      <Grid.Col span={11} align={"left"} fw={"600"} fz={"14"}>
                        {t("Name")}
                      </Grid.Col>
                      <Grid.Col span={1}>:</Grid.Col>
                      <Grid.Col span={"13"}>
                        {domainConfig && domainConfig?.name}
                      </Grid.Col>
                    </Grid>

                    <Grid columns={24}>
                      <Grid.Col span={11} align={"left"} fw={"600"} fz={"14"}>
                        {t("Mobile")}
                      </Grid.Col>
                      <Grid.Col span={1}>:</Grid.Col>
                      <Grid.Col span={"13"}>
                        {domainConfig && domainConfig?.mobile}
                      </Grid.Col>
                    </Grid>

                    <Grid columns={24}>
                      <Grid.Col span={11} align={"left"} fw={"600"} fz={"14"}>
                        {t("Email")}
                      </Grid.Col>
                      <Grid.Col span={1}>:</Grid.Col>
                      <Grid.Col span={"13"}>
                        {domainConfig && domainConfig?.email}
                      </Grid.Col>
                    </Grid>
                  </ScrollArea>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
              <Shortcut
                form={form}
                FormSubmit={"EntityFormSubmit"}
                Name={"name"}
                inputType="select"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  );
}

export default InventoryConfigarationFormBK;
