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
import SelectForm from "../../../form-builders/SelectForm";

function PurchaseForm(props) {

  const {
    vendorGroupDropdownData,
    height,
    config,
    id
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [vendorGroupData, setVendorGroupData] = useState(null);

  const form = useForm({
    initialValues: {
      search_by_vendor: config?.search_by_vendor || "",
      search_by_product_nature: config?.search_by_product_nature || "",
      search_by_category: config?.search_by_category || "",
      show_product: config?.show_product || "",
      is_measurement_enable: config?.is_measurement_enable || "",
      is_purchase_auto_approved: config?.is_purchase_auto_approved || "",
      default_vendor_group_id: config?.default_vendor_group_id || 0,
      search_by_warehouse: config?.search_by_warehouse || "",
    },
  });

  const handlePurchaseFormSubmit = (values) => {

    dispatch(setValidationData(false));

    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handlePurchaseConfirmSubmit(values),
    });
  };

  const handlePurchaseConfirmSubmit = async (values) => {

    const properties = [
      "search_by_vendor",
      "search_by_product_nature",
      "search_by_category",
      "show_product",
      "is_measurement_enable",
      "is_purchase_auto_approved",
      "search_by_warehouse",
    ];

    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] === 1 ? 1 : 0;
    });

    try {

      setSaveCreateLoading(true);
      const value = {
        url: `domain/config/inventory-purchase/${id}`,
        data: values,
        type: 'POST',
      };
      console.log("value", values);
      await dispatch(storeEntityData(value));
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
      console.error("Error updating purchase config:", error);
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
        "alt+p",
        () => {
          document.getElementById("PurchaseFormSubmit").click();
        },
      ],
    ],
    []
  );

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          <Box>
            <SelectForm
                tooltip={t('ChooseVendorGroup')}
                label={t('VendorGroup')}
                placeholder={t('ChooseVendorGroup')}
                required={true}
                nextField={''}
                name={'default_vendor_group_id'}
                form={form}
                dropdownValue={vendorGroupDropdownData}
                mt={8}
                id={'default_vendor_group_id'}
                searchable={false}
                value={vendorGroupData}
                changeValue={setVendorGroupData}
            />
          </Box>
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
                {t("MeasurementEnabled")}
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
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_purchase_auto_approved",
                  form.values.is_purchase_auto_approved === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("PurchaseAutoApproved")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.is_purchase_auto_approved === 1}
                  color="red"
                  {...form.getInputProps("is_purchase_auto_approved", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "is_purchase_auto_approved",
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
        </Box>

        <Button
          id="PurchaseFormSubmit"
          type="submit"
          style={{ display: "none" }}
        >
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default PurchaseForm;
