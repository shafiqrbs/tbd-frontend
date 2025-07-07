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
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";

function ProductForm(props) {
  const { height, config_product, id,fetchDomainConfig } = props;

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
        fetchDomainConfig()
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
              color='var(--theme-primary-color-6)'
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
          <Box><InputCheckboxForm form={form} label={t('Measurement')} field={'is_measurement'} name={'is_measurement'}/></Box>
          <Box><InputCheckboxForm form={form} label={t('MultiPrice')} field={'is_multi_price'} name={'is_multi_price'}/></Box>
          <Box><InputCheckboxForm form={form} label={t('ProductGallery')} field={'is_product_gallery'} name={'is_product_gallery'}/></Box>
          <Box><InputCheckboxForm form={form} label={t('SKU')} field={'is_sku'} name={'is_sku'}/></Box>
          <Center>
            <Text fw={800} fz={16} mt="md" mb="xs">
              {t("BarcodeSettings")}
            </Text>
          </Center>
          <Box><InputCheckboxForm form={form}  field={'barcode_brand'} name={'barcode_brand'} label={t('BarcodeBrand')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'barcode_color'} name={'barcode_color'} label={t('BarcodeColor')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'barcode_size'} name={'barcode_size'} label={t('BarcodeSize')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'barcode_print'} name={'barcode_print'} label={t('BarcodePrint')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'barcode_price_hide'} name={'barcode_price_hide'} label={t('BarcodePriceHide')} /></Box>

          <Center>
            <Text fw={800} fz={16} mt="md" mb="xs">
            {t("SKUSettings")}
          </Text>
          </Center>
          <Box><InputCheckboxForm form={form}  field={'sku_brand'} name={'sku_brand'} label={t('SKUBrand')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'sku_grade'} name={'sku_grade'} label={t('SKUGrade')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'sku_color'} name={'sku_color'} label={t('SKUColor')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'sku_model'} name={'sku_model'} label={t('SKUModel')} /></Box>
          <Box><InputCheckboxForm form={form}  field={'sku_size'} name={'sku_size'} label={t('SKUSize')} /></Box>
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
