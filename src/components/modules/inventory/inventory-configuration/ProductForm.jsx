import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm";
import { setFormLoading } from "../../../../store/inventory/crudSlice";
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";

function ProductForm(props) {
  const { height, config_product, id } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const form = useForm({
    initialValues: {
      barcode_brand: config_product?.barcode_brand || 0,
      barcode_color: config_product?.barcode_color || 0,
      barcode_price_hide: config_product?.barcode_price_hide || 0,
      barcode_print: config_product?.barcode_print || 0,
      barcode_size: config_product?.barcode_size || 0,
      is_brand: config_product?.is_brand || 0,
      is_color: config_product?.is_color || 0,
      is_grade: config_product?.is_grade || 0,
      is_measurement: config_product?.is_measurement || 0,
      is_model: config_product?.is_model || 0,
      is_multi_price: config_product?.is_multi_price || 0,
      is_product_gallery: config_product?.is_product_gallery || 0,
      is_size: config_product?.is_size || 0,
      is_sku: config_product?.is_sku || 0,
      sku_brand: config_product?.sku_brand || 0,
      sku_category: config_product?.sku_category || 0,
      sku_color: config_product?.sku_color || 0,
      sku_model: config_product?.sku_model || 0,
      sku_size: config_product?.sku_size || 0,
      sku_warehouse: config_product?.sku_warehouse || 0,
    },
  });

  useEffect(() => {
    if (config_product) {
      form.setValues({
        barcode_brand: config_product?.barcode_brand || 0,
        barcode_color: config_product?.barcode_color || 0,
        barcode_price_hide: config_product?.barcode_price_hide || 0,
        barcode_print: config_product?.barcode_print || 0,
        barcode_size: config_product?.barcode_size || 0,
        is_brand: config_product?.is_brand || 0,
        is_color: config_product?.is_color || 0,
        is_grade: config_product?.is_grade || 0,
        is_measurement: config_product?.is_measurement || 0,
        is_model: config_product?.is_model || 0,
        is_multi_price: config_product?.is_multi_price || 0,
        is_product_gallery: config_product?.is_product_gallery || 0,
        is_size: config_product?.is_size || 0,
        is_sku: config_product?.is_sku || 0,
        sku_brand: config_product?.sku_brand || 0,
        sku_category: config_product?.sku_category || 0,
        sku_color: config_product?.sku_color || 0,
        sku_model: config_product?.sku_model || 0,
        sku_size: config_product?.sku_size || 0,
        sku_warehouse: config_product?.sku_warehouse || 0,
      });
    }
  }, [dispatch, config_product]);

  const handleProductFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleProductConfirmSubmit(values),
    });
  };

  const handleProductConfirmSubmit = async (values) => {
    // Convert checkbox values to 0 or 1
    const properties = [
      "barcode_brand",
      "barcode_color",
      "barcode_price_hide",
      "barcode_print",
      "barcode_size",
      "is_brand",
      "is_color",
      "is_grade",
      "is_measurement",
      "is_model",
      "is_multi_price",
      "is_product_gallery",
      "is_size",
      "is_sku",
      "sku_brand",
      "sku_category",
      "sku_color",
      "sku_model",
      "sku_size",
      "sku_warehouse",
    ];
    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] === 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);
      const value = {
        url: `domain/config/inventory-product/${id}`,
        data: values,
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
      console.error("Error updating product config:", error);

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
          document.getElementById("ProductFormSubmit").click();
        },
      ],
    ],
    []
  );

  // Helper function to create checkbox items
  const renderCheckboxItem = (name, labelKey) => {
    return (
      <Box mt={"xs"}>
        <Grid
          gutter={{ base: 1 }}
          style={{ cursor: "pointer" }}
          onClick={() =>
            form.setFieldValue(name, form.values[name] === 1 ? 0 : 1)
          }
        >
          <Grid.Col span={11} fz={"sm"} pt={"1"}>
            {t(labelKey)}
          </Grid.Col>
          <Grid.Col span={1}>
            <Checkbox
              pr="xs"
              checked={form.values[name] === 1}
              color="red"
              {...form.getInputProps(name, {
                type: "checkbox",
              })}
              onChange={(event) =>
                form.setFieldValue(name, event.currentTarget.checked ? 1 : 0)
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
    );
  };

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleProductFormSubmit)}>
        <Box pt={"xs"} pl={"xs"} pb={"sm"}>
          <Center>
            <Text fw={800} fz={16} mb="xs">
              {t("ProductAttributes")}
            </Text>
          </Center>
          {renderCheckboxItem("is_brand", "Brand")}
          {renderCheckboxItem("is_color", "Color")}
          {renderCheckboxItem("is_size", "Size")}
          {renderCheckboxItem("is_model", "Model")}
          {renderCheckboxItem("is_grade", "Grade")}
          {renderCheckboxItem("is_measurement", "Measurement")}
          {renderCheckboxItem("is_multi_price", "MultiPrice")}
          {renderCheckboxItem("is_product_gallery", "ProductGallery")}
          {renderCheckboxItem("is_sku", "SKU")}

          <Center>
            <Text fw={800} fz={16} mt="md" mb="xs">
              {t("BarcodeSettings")}
            </Text>
          </Center>
          {renderCheckboxItem("barcode_brand", "BarcodeBrand")}
          {renderCheckboxItem("barcode_color", "BarcodeColor")}
          {renderCheckboxItem("barcode_size", "BarcodeSize")}
          {renderCheckboxItem("barcode_print", "BarcodePrint")}
          {renderCheckboxItem("barcode_price_hide", "BarcodePriceHide")}

          <Center>
            <Text fw={800} fz={16} mt="md" mb="xs">
            {t("SKUSettings")}
          </Text>
          </Center>
          {renderCheckboxItem("sku_brand", "SKUBrand")}
          {renderCheckboxItem("sku_category", "SKUCategory")}
          {renderCheckboxItem("sku_color", "SKUColor")}
          {renderCheckboxItem("sku_model", "SKUModel")}
          {renderCheckboxItem("sku_size", "SKUSize")}
          {renderCheckboxItem("sku_warehouse", "SKUWarehouse")}
        </Box>
        <Button
          id="ProductFormSubmit"
          type="submit"
          style={{ display: "none" }}
        >
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default ProductForm;
