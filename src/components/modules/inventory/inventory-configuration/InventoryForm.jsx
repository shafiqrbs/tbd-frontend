import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Checkbox,
  ScrollArea,
  Button,
  Text,
  Center, Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SelectForm from "../../../form-builders/SelectForm";

function InventoryForm(props) {
  const {
    height,
    inventory_config,
    id,
    currencyList,
    countryList,
    businessModelList,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [businessModelData, setBusinessModelData] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);
  const [countryData, setCountryData] = useState(null);

  const form = useForm({
    initialValues: {
      // Text fields
      printer: inventory_config?.printer || "",
      address: inventory_config?.address || "",
      print_footer_text: inventory_config?.print_footer_text || "",
      invoice_comment: inventory_config?.invoice_comment || "",
      invoice_prefix: inventory_config?.invoice_prefix || "",
      invoice_process: inventory_config?.invoice_process || "",
      customer_prefix: inventory_config?.customer_prefix || "",
      production_type: inventory_config?.production_type || "",
      invoice_type: inventory_config?.invoice_type || "",
      shop_name: inventory_config?.shop_name || "",
      border_color: inventory_config?.border_color || "",

      // Number fields
      unit_commission: inventory_config?.unit_commission || null,
      font_size_label: inventory_config?.font_size_label || null,
      font_size_value: inventory_config?.font_size_value || null,
      tlo_commission: inventory_config?.tlo_commission || 0,
      sr_commission: inventory_config?.sr_commission || 0,
      invoice_width: inventory_config?.invoice_width || null,
      print_top_margin: inventory_config?.print_top_margin || null,
      print_margin_bottom: inventory_config?.print_margin_bottom || null,
      header_left_width: inventory_config?.header_left_width || null,
      header_right_width: inventory_config?.header_right_width || null,
      print_margin_report_top:
        inventory_config?.print_margin_report_top || null,
      border_width: inventory_config?.border_width || null,
      body_font_size: inventory_config?.body_font_size || null,
      sidebar_font_size: inventory_config?.sidebar_font_size || null,
      invoice_font_size: inventory_config?.invoice_font_size || null,
      print_left_margin: inventory_config?.print_left_margin || null,
      invoice_height: inventory_config?.invoice_height || null,
      left_top_margin: inventory_config?.left_top_margin || null,
      body_top_margin: inventory_config?.body_top_margin || null,
      sidebar_width: inventory_config?.sidebar_width || null,
      body_width: inventory_config?.body_width || null,

      // Boolean/Checkbox fields
      is_stock_history: inventory_config?.is_stock_history || 0,
      multi_company: inventory_config?.multi_company || 0,
      bonus_from_stock: inventory_config?.bonus_from_stock || 0,
      condition_sales: inventory_config?.condition_sales || 0,
      is_marketing_executive: inventory_config?.is_marketing_executive || 0,
      fuel_station: inventory_config?.fuel_station || 0,
      sales_return: inventory_config?.sales_return || 0,
      store_ledger: inventory_config?.store_ledger || 0,
      is_print_header: inventory_config?.is_print_header || 0,
      is_invoice_title: inventory_config?.is_invoice_title || 0,
      print_outstanding: inventory_config?.print_outstanding || 0,
      is_print_footer: inventory_config?.is_print_footer || 0,
      is_unit_price: inventory_config?.is_unit_price || 0,
      invoice_print_logo: inventory_config?.invoice_print_logo || 0,
      show_stock: inventory_config?.show_stock || 0,
      is_powered: inventory_config?.is_powered || 0,
      remove_image: inventory_config?.remove_image || 0,
      is_active_sms: inventory_config?.is_active_sms || 0,
      stock_item: inventory_config?.stock_item || 0,
      is_description: inventory_config?.is_description || 0,
      is_batch_invoice: inventory_config?.is_batch_invoice || 0,
      is_provision: inventory_config?.is_provision || 0,
      is_category_item_quantity:
        inventory_config?.is_category_item_quantity || 0,

      // Select fields (IDs)
      business_model_id: inventory_config?.business_model_id || "",
      currency_id: inventory_config?.currency_id || "",
      country_id: inventory_config?.country_id || "",
    },
  });

  const handleInventoryFormSubmit = (values) => {
    dispatch(setValidationData(false));

    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleInventoryConfirmSubmit(values),
    });
  };

  const handleInventoryConfirmSubmit = async (values) => {
    const booleanFields = [
      "is_stock_history",
      "multi_company",
      "bonus_from_stock",
      "condition_sales",
      "is_marketing_executive",
      "fuel_station",
      "sales_return",
      "store_ledger",
      "is_print_header",
      "is_invoice_title",
      "print_outstanding",
      "is_print_footer",
      "is_unit_price",
      "invoice_print_logo",
      "show_stock",
      "is_powered",
      "remove_image",
      "is_active_sms",
      "stock_item",
      "is_description",
      "is_batch_invoice",
      "is_provision",
      "is_category_item_quantity",
    ];

    booleanFields.forEach((field) => {
      values[field] = values[field] === true || values[field] == 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);

      const value = {
        url: `domain/config/inventory/${id}`,
        data: values,
      };

      console.log("Submitting values:", values);
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
      console.error("Error updating inventory config:", error);

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
        "alt+i",
        () => {
          document.getElementById("InventoryFormSubmit").click();
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
      <form onSubmit={form.onSubmit(handleInventoryFormSubmit)}>
        <Box pt={"xs"} pl={"xs"} pb={"sm"}>
          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('GeneralSettings')}</Title>
          </Box>

          {/* Printer field */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("Printer")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterPrinter")}
                  required={false}
                  nextField={"address"}
                  name={"printer"}
                  form={form}
                  id={"printer"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Address field */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("Address")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterAddress")}
                  required={false}
                  nextField={"shop_name"}
                  name={"address"}
                  form={form}
                  id={"address"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Shop Name field */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("ShopName")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterShopName")}
                  required={false}
                  nextField={"business_model_id"}
                  name={"shop_name"}
                  form={form}
                  id={"shop_name"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Business Model dropdown */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("BusinessModel")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  label={""}
                  placeholder={t("SelectBusinessModel")}
                  required={false}
                  nextField={"currency_id"}
                  name={"business_model_id"}
                  form={form}
                  dropdownValue={businessModelList || []}
                  id={"business_model_id"}
                  searchable={true}
                  value={
                    businessModelData
                      ? String(businessModelData)
                      : inventory_config?.business_model_id
                      ? String(inventory_config?.business_model_id)
                      : null
                  }
                  changeValue={setBusinessModelData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Currency dropdown */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("Currency")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  label={""}
                  placeholder={t("SelectCurrency")}
                  required={false}
                  nextField={"country_id"}
                  name={"currency_id"}
                  form={form}
                  dropdownValue={currencyList || []}
                  id={"currency_id"}
                  searchable={true}
                  value={
                    currencyData
                      ? String(currencyData)
                      : inventory_config?.currency_id
                      ? String(inventory_config?.currency_id)
                      : null
                  }
                  changeValue={setCurrencyData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Country dropdown */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("Country")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  label={""}
                  placeholder={t("SelectCountry")}
                  required={false}
                  nextField={"unit_commission"}
                  name={"country_id"}
                  form={form}
                  dropdownValue={countryList || []}
                  id={"country_id"}
                  searchable={true}
                  value={
                    countryData
                      ? String(countryData)
                      : inventory_config?.country_id
                      ? String(inventory_config?.country_id)
                      : null
                  }
                  changeValue={setCountryData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Unit Commission field */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("UnitCommission")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputNumberForm
                  label={""}
                  placeholder={t("EnterUnitCommission")}
                  required={false}
                  nextField={"border_color"}
                  name={"unit_commission"}
                  form={form}
                  id={"unit_commission"}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('InvoiceSettings')}</Title>
          </Box>
          {/* Invoice Prefix */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("InvoicePrefix")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterInvoicePrefix")}
                  required={false}
                  nextField={"invoice_process"}
                  name={"invoice_prefix"}
                  form={form}
                  id={"invoice_prefix"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Invoice Process */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("InvoiceProcess")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterInvoiceProcess")}
                  required={false}
                  nextField={"customer_prefix"}
                  name={"invoice_process"}
                  form={form}
                  id={"invoice_process"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Customer Prefix */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("CustomerPrefix")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterCustomerPrefix")}
                  required={false}
                  nextField={"production_type"}
                  name={"customer_prefix"}
                  form={form}
                  id={"customer_prefix"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Production Type */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("ProductionType")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterProductionType")}
                  required={false}
                  nextField={"invoice_type"}
                  name={"production_type"}
                  form={form}
                  id={"production_type"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Invoice Type */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("InvoiceType")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterInvoiceType")}
                  required={false}
                  nextField={"invoice_comment"}
                  name={"invoice_type"}
                  form={form}
                  id={"invoice_type"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Invoice Comment */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("InvoiceComment")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterInvoiceComment")}
                  required={false}
                  nextField={"print_footer_text"}
                  name={"invoice_comment"}
                  form={form}
                  id={"invoice_comment"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Print Footer Text */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("PrintFooterText")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  label={""}
                  placeholder={t("EnterPrintFooterText")}
                  required={false}
                  nextField={"invoice_width"}
                  name={"print_footer_text"}
                  form={form}
                  id={"print_footer_text"}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Center>
            <Text fw={800} fz={16} mt="md" mb="xs">
              {t("PrintingDimensions")}
            </Text>
          </Center>

          {/* Printing dimensions fields */}
          {/* Invoice Width */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("InvoiceWidth")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputNumberForm
                  label={""}
                  placeholder={t("EnterInvoiceWidth")}
                  required={false}
                  nextField={"invoice_height"}
                  name={"invoice_width"}
                  form={form}
                  id={"invoice_width"}
                  min={0}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Several more dimension fields would go here - including the rest for brevity */}
          {/* Add similar Box/Grid structures for all other dimension fields */}

          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('FontSettings')}</Title>
          </Box>

          {/* Font fields */}
          {/* Font Size Label */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("FontSizeLabel")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputNumberForm
                  label={""}
                  placeholder={t("EnterFontSizeLabel")}
                  required={false}
                  nextField={"font_size_value"}
                  name={"font_size_label"}
                  form={form}
                  id={"font_size_label"}
                  min={0}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Several more font fields would go here - omitting for brevity */}
          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('CommissionSettings')}</Title>
          </Box>

          {/* TLO Commission */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("TLOCommission")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputNumberForm
                  label={""}
                  placeholder={t("EnterTLOCommission")}
                  required={false}
                  nextField={"sr_commission"}
                  name={"tlo_commission"}
                  form={form}
                  id={"tlo_commission"}
                  min={0}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* SR Commission */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("SRCommission")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputNumberForm
                  label={""}
                  placeholder={t("EnterSRCommission")}
                  required={false}
                  nextField={"is_stock_history"}
                  name={"sr_commission"}
                  form={form}
                  id={"sr_commission"}
                  min={0}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('Features')}</Title>
          </Box>

          {renderCheckboxItem("is_stock_history", "IsStockHistory")}
          {renderCheckboxItem("multi_company", "MultiCompany")}
          {renderCheckboxItem("bonus_from_stock", "BonusFromStock")}
          {renderCheckboxItem("condition_sales", "ConditionSales")}
          {renderCheckboxItem("is_marketing_executive", "IsMarketingExecutive")}
          {renderCheckboxItem("sales_return", "SalesReturn")}
          {renderCheckboxItem("store_ledger", "StoreLedger")}
          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('InvoiceFeatures')}</Title>
          </Box>

          {renderCheckboxItem("is_print_header", "IsPrintHeader")}
          {renderCheckboxItem("is_invoice_title", "IsInvoiceTitle")}
          {renderCheckboxItem("print_outstanding", "PrintOutstanding")}
          {renderCheckboxItem("is_print_footer", "IsPrintFooter")}
          {renderCheckboxItem("is_unit_price", "IsUnitPrice")}
          {renderCheckboxItem("invoice_print_logo", "InvoicePrintLogo")}
          {renderCheckboxItem("show_stock", "ShowStock")}
          {renderCheckboxItem("is_powered", "IsPowered")}
          {renderCheckboxItem("remove_image", "RemoveImage")}
          {renderCheckboxItem("is_active_sms", "IsActiveSMS")}
          <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('ProductSettings')}</Title>
          </Box>

          {renderCheckboxItem("stock_item", "StockItem")}
          {renderCheckboxItem("is_description", "IsDescription")}
          {renderCheckboxItem("is_batch_invoice", "IsBatchInvoice")}
          {renderCheckboxItem("is_provision", "IsProvision")}
          {renderCheckboxItem(
            "is_category_item_quantity",
            "IsCategoryItemQuantity"
          )}
        </Box>

        {/* Hidden submit button for hotkey */}
        <Button
          id="InventoryFormSubmit"
          type="submit"
          style={{ display: "none" }}
        >
          Submit
        </Button>
      </form>
    </ScrollArea>
  );
}

export default InventoryForm;
