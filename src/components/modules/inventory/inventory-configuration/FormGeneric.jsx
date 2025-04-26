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
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  showInstantEntityData,
  updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";

function FormGeneric(props) {
  const { height, config_sales, id } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const form = useForm({
    initialValues: {
      search_by_vendor: config_sales?.search_by_vendor || "",
      search_by_product_nature: config_sales?.search_by_product_nature || "",
      search_by_category: config_sales?.search_by_category || "",
      show_product: config_sales?.show_product || "",
      is_measurement_enable: config_sales?.is_measurement_enable || "",
      is_purchase_auto_approved: config_sales?.is_purchase_auto_approved || "",
      default_vendor_group_id: config_sales?.default_vendor_group_id || "",
      search_by_warehouse: config_sales?.search_by_warehouse || "",
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
      "default_vendor_group_id",
      "search_by_warehouse",
    ];

    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] == 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);

      const value = {
        url: `inventory/config-purchase-update/${id}`,
        data: values,
      };
      console.log("value", values);
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

  const [value, setValue] = useState(null);

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          <Box mt={"xs"}>
            <Grid gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("SearchByVendor")}
              </Grid.Col>
              <Grid.Col span={6}>
                <SelectForm
                  tooltip={t("ChooseMethod")}
                  label={""}
                  placeholder={t("ChooseMethod")}
                  required={true}
                  nextField={"name"}
                  name={"method_id"}
                  form={form}
                  dropdownValue={["1", "2"]}
                  id={"method_id"}
                  searchable={false}
                  value={value}
                  changeValue={setValue}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"xs"}>
            <Grid gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("SearchByProductNature")}
              </Grid.Col>
              <Grid.Col span={6}>
                <InputForm
                  tooltip={t("SubGroupNameValidateMessage")}
                  label={""}
                  placeholder={t("Name")}
                  required={true}
                  nextField={"code"}
                  name={"name"}
                  form={form}
                  id={"name"}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"xs"}>
            <Grid gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("SearchByCategory")}
              </Grid.Col>
              <Grid.Col span={6}>
                <TextAreaForm
                  autosize={true}
                  minRows={4}
                  maxRows={4}
                  tooltip={t("Narration")}
                  label={""}
                  placeholder={t("Narration")}
                  required={false}
                  nextField={"EntityFormSubmits"}
                  name={"narration"}
                  form={form}
                  id={"narration"}
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
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("ShowProduct")}
              </Grid.Col>
              <Grid.Col span={6} align={"center"} justify={"center"}>
                <Center>
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
                </Center>
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
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("MeasurementEnabled")}
              </Grid.Col>
              <Grid.Col span={6}>
                <Center>
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
                </Center>
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
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("PurchaseAutoApproved")}
              </Grid.Col>
              <Grid.Col span={6}>
                <Center>
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
                </Center>
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "default_vendor_group_id",
                  form.values.default_vendor_group_id === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                {t("DefaultVendorGroup")}
              </Grid.Col>
              <Grid.Col span={6}>
                <Center>
                  <Checkbox
                    pr="xs"
                    checked={form.values.default_vendor_group_id === 1}
                    color="red"
                    {...form.getInputProps("default_vendor_group_id", {
                      type: "checkbox",
                    })}
                    onChange={(event) =>
                      form.setFieldValue(
                        "default_vendor_group_id",
                        event.currentTarget.checked ? 1 : 0
                      )
                    }
                    styles={(theme) => ({
                      input: {
                        borderColor: "red",
                      },
                    })}
                  />
                </Center>
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

export default FormGeneric;
