import React, {useEffect, useState} from "react";
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
import TextAreaGenericForm from "../../../form-builders/TextAreaGenericForm";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import useDomainConfig from "../../../global-hook/config-data/useDomainConfig.js";

function InventoryForm(props) {
  const {
    height,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const {domainConfig,fetchDomainConfig} = useDomainConfig()
  const inventory_config = domainConfig?.inventory_config;
  const id = domainConfig?.id;

  const form = useForm({
    initialValues: {
      // Text fields

      print_footer_text: inventory_config?.print_footer_text || "",
      invoice_comment: inventory_config?.invoice_comment || "",
      invoice_prefix: inventory_config?.invoice_prefix || "",
      invoice_type: inventory_config?.invoice_type || "",

      // Boolean/Checkbox fields
      is_stock_history: inventory_config?.is_stock_history || 0,
      bonus_from_stock: inventory_config?.bonus_from_stock || 0,
      is_print_header: inventory_config?.is_print_header || 0,
      is_invoice_title: inventory_config?.is_invoice_title || 0,
      print_outstanding: inventory_config?.print_outstanding || 0,
      is_print_footer: inventory_config?.is_print_footer || 0,
      is_unit_price: inventory_config?.is_unit_price || 0,
      invoice_print_logo: inventory_config?.invoice_print_logo || 0,
      show_stock: inventory_config?.show_stock || 0,
      remove_image: inventory_config?.remove_image || 0,
      stock_item: inventory_config?.stock_item || 0,
      is_description: inventory_config?.is_description || 0,
    },
  });

  useEffect(() => {

    if (inventory_config) {
      form.setValues({
        print_footer_text: inventory_config?.print_footer_text || "",
        invoice_comment: inventory_config?.invoice_comment || "",
        invoice_prefix: inventory_config?.invoice_prefix || "",
        invoice_type: inventory_config?.invoice_type || "",

        // Boolean/Checkbox fields
        is_stock_history: inventory_config?.is_stock_history || 0,
        bonus_from_stock: inventory_config?.bonus_from_stock || 0,
        is_print_header: inventory_config?.is_print_header || 0,
        is_invoice_title: inventory_config?.is_invoice_title || 0,
        print_outstanding: inventory_config?.print_outstanding || 0,
        is_print_footer: inventory_config?.is_print_footer || 0,
        is_unit_price: inventory_config?.is_unit_price || 0,
        invoice_print_logo: inventory_config?.invoice_print_logo || 0,
        show_stock: inventory_config?.show_stock || 0,
        remove_image: inventory_config?.remove_image || 0,
        stock_item: inventory_config?.stock_item || 0,
        is_description: inventory_config?.is_description || 0,
      });
    }
  }, [dispatch, inventory_config]);

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
    const properties = [
      "is_stock_history",
      "bonus_from_stock",
      "is_print_header",
      "is_invoice_title",
      "print_outstanding",
      "is_print_footer",
      "invoice_print_logo",
      "show_stock",
      "is_unit_price",
      "remove_image",
      "stock_item",
      "is_description",
    ];

    properties.forEach((property) => {
      values[property] =
          values[property] === true || values[property] == 1 ? 1 : 0;
    });

    const payload = {
      url: `domain/config/inventory/${id}`,
      data: values,
    };

    try {
      setSaveCreateLoading(true);
      const result = await dispatch(storeEntityData(payload));
      if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
        fetchDomainConfig()
        showNotificationComponent(t("UpdateSuccessfully"), "teal");
        setTimeout(() => {
          closeDrawer()
        }, 1000)
      } else {
        showNotificationComponent(t("UpdateFailed"), "red");
      }

    } catch (err) {
      console.error(err);
      showNotificationComponent(t("UpdateFailed"), "red");
    } finally {
      setSaveCreateLoading(true);
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
  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleInventoryFormSubmit)}>
        <Box pt={"xs"} pl={"xs"} pb={"sm"}>

          <Box ml={'-md'} pl={'md'} pt={'8'} pb={'12'} mt={'8'} ta="left" bg={'gray.2'}>
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
                <TextAreaGenericForm
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
                <TextAreaGenericForm
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

          <Box ml={'-md'} pl={'md'} pt={'8'} pb={'12'} mt={'8'} ta="left" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('InvoiceFeatures')}</Title>
          </Box>
          <Box><InputCheckboxForm form={form} label={t("IsStockHistory")} field={'is_stock_history'}  name={'is_stock_history'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("BonusFromStock")} field={'bonus_from_stock'}  name={'bonus_from_stock'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsPrintHeader")} field={'is_print_header'}  name={'is_print_header'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsInvoiceTitle")} field={'is_invoice_title'}  name={'is_invoice_title'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("PrintOutstanding")} field={'print_outstanding'}  name={'print_outstanding'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsPrintFooter")} field={'is_print_footer'}  name={'is_print_footer'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsUnitPrice")} field={'is_unit_price'}  name={'is_unit_price'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("InvoicePrintLogo")} field={'invoice_print_logo'}  name={'invoice_print_logo'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("PrintOutstanding")} field={'print_outstanding'}  name={'print_outstanding'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("ShowStock")} field={'show_stock'}  name={'show_stock'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("RemoveImage")} field={'remove_image'}  name={'remove_image'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("StockItem")} field={'stock_item'}  name={'stock_item'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsDescription")} field={'is_description'}  name={'is_description'} /></Box>
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
