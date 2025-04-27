import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Checkbox,
  ScrollArea,
  Button,
  Text,
  Flex,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import SelectForm from "../../../form-builders/SelectForm";

function SalesForm(props) {

  const {
    customerGroupDropdownData,
    height,
    config_sales,
    id
  } = props;

  console.log(props.domainConfig)

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [customerGroupData, setCustomerGroupData] = useState(null);
//  const { locationDropdown, customerGroupDropdownData, executiveDropdown } = props

  const form = useForm({
    initialValues: {
      default_customer_group_id: config_sales?.default_customer_group_id || 0,
      discount_with_customer: config_sales?.discount_with_customer || 0,
      due_sales_without_customer: config_sales?.due_sales_without_customer || "",
      is_measurement_enable: config_sales?.is_measurement_enable || "",
      is_multi_price: config_sales?.is_multi_price || "",
      is_sales_auto_approved: config_sales?.is_sales_auto_approved || "",
      is_zero_receive_allow: config_sales?.is_zero_receive_allow || "",
      item_sales_percent: config_sales?.item_sales_percent || "",
      search_by_category: config_sales?.search_by_category || "",
      search_by_product_nature: config_sales?.search_by_product_nature || "",
      search_by_vendor: config_sales?.search_by_vendor || "",
      search_by_warehouse: config_sales?.search_by_warehouse || "",
      show_product: config_sales?.show_product || "",
      zero_stock: config_sales?.zero_stock || "",
    },
  });


  const handleSalesFormSubmit = (values) => {

    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleSalesConfirmSubmit(values),
    });
  };

  const handleSalesConfirmSubmit = async (values) => {
    const properties = [
      "discount_with_customer",
      "due_sales_without_customer",
      "is_measurement_enable",
      "is_multi_price",
      "is_sales_auto_approved",
      "is_zero_receive_allow",
      "item_sales_percent",
      "search_by_category",
      "search_by_product_nature",
      "search_by_vendor",
      "search_by_warehouse",
      "show_product",
      "zero_stock",
    ];
    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] === 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);
      const value = {
        url: `domain/config/inventory-sales/${id}`,
        data: values,
      };
      console.log("value", values);
      await dispatch(storeEntityData(value));

     /* const resultAction = await dispatch(
        showInstantEntityData("inventory/config")
      );
      if (showInstantEntityData.fulfilled.match(resultAction)) {
        if (resultAction.payload.data.status === 200) {
          localStorage.setItem(
            "config-data",
            JSON.stringify(resultAction.payload.data.data)
          );
        }
      }*/

      notifications.show({
        color: "teal",
        title: t("UpdateSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });


      setTimeout(() => {
        setSaveCreateLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error updating sales config:", error);

      notifications.show({
        color: "red",
        title: t("UpdateFailed"),
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      setSaveCreateLoading(false);
    }
  };

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("SalesFormSubmit").click();
        },
      ],
    ],
    []
  );

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleSalesFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          <Box>
            <SelectForm
                tooltip={t('ChooseCustomerGroup')}
                label={t('CustomerGroup')}
                placeholder={t('ChooseCustomerGroup')}
                required={true}
                nextField={''}
                name={'default_customer_group_id'}
                form={form}
                dropdownValue={customerGroupDropdownData}
                mt={8}
                id={'default_customer_group_id'}
                searchable={false}
                value={customerGroupData}
                changeValue={setCustomerGroupData}
            />
          </Box>

          {/* discount_with_customer */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "discount_with_customer",
                  form.values.discount_with_customer === 1 ? 0 : 1
                )
              }
            >
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

          {/* due_sales_without_customer */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "due_sales_without_customer",
                  form.values.due_sales_without_customer === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("DueSalesWithoutCustomer")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.due_sales_without_customer === 1}
                  color="red"
                  {...form.getInputProps("due_sales_without_customer", {
                    type: "checkbox",
                  })}
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

          {/* is_measurement_enable */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_measurement_enable",
                  form.values.is_measurement_enable === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("IsMeasurementEnable")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.is_measurement_enable === 1}
                  color="red"
                  {...form.getInputProps("is_measurement_enable", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "is_measurement_enable",
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

          {/* is_multi_price */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_multi_price",
                  form.values.is_multi_price === 1 ? 0 : 1
                )
              }
            >
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

          {/* is_sales_auto_approved */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_sales_auto_approved",
                  form.values.is_sales_auto_approved === 1 ? 0 : 1
                )
              }
            >
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

          {/* is_zero_receive_allow */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_zero_receive_allow",
                  form.values.is_zero_receive_allow === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("IsZeroReceiveAllow")}
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

          {/* item_sales_percent */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "item_sales_percent",
                  form.values.item_sales_percent === 1 ? 0 : 1
                )
              }
            >
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

          {/* search_by_category */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "search_by_category",
                  form.values.search_by_category === 1 ? 0 : 1
                )
              }
            >
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

          {/* search_by_product_nature */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "search_by_product_nature",
                  form.values.search_by_product_nature === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("SearchByProductNature")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.search_by_product_nature === 1}
                  color="red"
                  {...form.getInputProps("search_by_product_nature", {
                    type: "checkbox",
                  })}
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

          {/* search_by_vendor */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "search_by_vendor",
                  form.values.search_by_vendor === 1 ? 0 : 1
                )
              }
            >
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

          {/* search_by_warehouse */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "search_by_warehouse",
                  form.values.search_by_warehouse === 1 ? 0 : 1
                )
              }
            >
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

          {/* show_product */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "show_product",
                  form.values.show_product === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("ShowProduct")}
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

          {/* zero_stock */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "zero_stock",
                  form.values.zero_stock === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("ZeroStock")}
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
        </Box>
        <Button id="SalesFormSubmit" type="submit" style={{ display: "none" }}>
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default SalesForm;
