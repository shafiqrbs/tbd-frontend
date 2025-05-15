import React, {useEffect, useMemo, useState} from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Checkbox,
  ScrollArea,
  Button,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  showInstantEntityData,
  updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import getSettingPosInvoiceModeDropdownData from "../../../global-hook/dropdown/getSettingPosInvoiceModeDropdownData";
import {storeEntityData} from "../../../../store/core/crudSlice";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig.js";

function PosForm(props) {

  const { height,id } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();


  const { domainConfig, fetchDomainConfig } = getDomainConfig();
  const posInvoiceModeDropdown = getSettingPosInvoiceModeDropdownData();
  const inventory_config = useMemo(() => domainConfig?.inventory_config || {}, [domainConfig]);

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [posInvoiceModeData, setPosInvoiceModeData] = useState(null);
  const [posInvoiceModeId, setPosInvoiceModeId] = useState(null);

  useEffect(() => {
    setPosInvoiceModeId(inventory_config?.pos_invoice_mode_id?.toString())
  }, [domainConfig]);


  const form = useForm({
    initialValues: {
      pos_print: inventory_config?.pos_print || "",
      invoice_comment: inventory_config?.invoice_comment || "",
      is_pos: inventory_config?.is_pos || "",
      is_pay_first: inventory_config?.is_pay_first || "",
      pos_invoice_position: inventory_config?.pos_invoice_position || "",
      multi_kitchen: inventory_config?.multi_kitchen || "",
      payment_split: inventory_config?.payment_split || "",
      item_addons: inventory_config?.item_addons || "",
      cash_on_delivery: inventory_config?.cash_on_delivery || "",
      is_online: inventory_config?.is_online || "",
      pos_invoice_mode_id: inventory_config?.pos_invoice_mode_id || "",
      custom_invoice: inventory_config?.custom_invoice || "",
      custom_invoice_print: inventory_config?.custom_invoice_print || "",
    },
  });

  useEffect(() => {
    if (inventory_config) {
      form.setValues({
        pos_print: inventory_config?.pos_print || "",
        invoice_comment: inventory_config?.invoice_comment || "",
        is_pos: inventory_config?.is_pos || "",
        is_pay_first: inventory_config?.is_pay_first || "",
        pos_invoice_position: inventory_config?.pos_invoice_position || "",
        multi_kitchen: inventory_config?.multi_kitchen || "",
        payment_split: inventory_config?.payment_split || "",
        item_addons: inventory_config?.item_addons || "",
        cash_on_delivery: inventory_config?.cash_on_delivery || "",
        is_online: inventory_config?.is_online || "",
        pos_invoice_mode_id: posInvoiceModeId,
        custom_invoice: inventory_config?.custom_invoice || "",
        custom_invoice_print: inventory_config?.custom_invoice_print || "",

      });
    }
  }, [dispatch, inventory_config]);

  const handlePosFormSubmit = (values) => {

      dispatch(setValidationData(false));
      modals.openConfirmModal({
        title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
        children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
        labels: { confirm: t("Submit"), cancel: t("Cancel") },
        confirmProps: { color: "red" },
        onCancel: () => console.log("Cancel"),
        onConfirm: () => handlePosConfirmSubmit(values),
      });

  };

  const handlePosConfirmSubmit = async (values) => {
    const booleanFields = [
      "pos_print",
      "is_pos",
      "is_pay_first",
      "multi_kitchen",
      "payment_split",
      "item_addons",
      "cash_on_delivery",
      "is_online",
      "custom_invoice",
      "custom_invoice_print",
    ];

    booleanFields.forEach((field) => {
      values[field] = values[field] === true || values[field] == 1 ? 1 : 0;
    });

    try {
      const value = {
        url: `domain/config/inventory-pos/${id}`,
        data: values,
      };
      setSaveCreateLoading(true);
      const resultAction = await dispatch(storeEntityData(value));
      if (storeEntityData.rejected.match(resultAction)) {
        const fieldErrors = resultAction.value.errors;
        // Check if there are field validation errors and dynamically set them
        if (fieldErrors) {
          const errorObject = {};
          Object.keys(fieldErrors).forEach(key => {
            errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
          });
          // Display the errors using your form's `setErrors` function dynamically
          form.setErrors(errorObject);
        }
      }else if (storeEntityData.fulfilled.match(resultAction) && resultAction.payload?.data?.status === 200) {
        await fetchDomainConfig();
        showNotificationComponent(t('CreateSuccessfully'), 'teal');
      }
    } catch (err) {
        showNotificationComponent(t("UpdateFailed"), "red");
    } finally {
        setSaveCreateLoading(false);
    }
  };

  useHotkeys(
    [
      [
        "alt+p",
        () => {
          document.getElementById("PosFormSubmit").click();
        },
      ],
    ],
    []
  );

  // Helper function to create checkbox grid items
  const renderCheckboxField = (field, label) => (
    <Box mt={"xs"}>
      <Grid
        gutter={{ base: 1 }}
        style={{ cursor: "pointer" }}
        onClick={() =>
          form.setFieldValue(field, form.values[field] === 1 ? 0 : 1)
        }
      >
        <Grid.Col span={11} fz={"sm"} pt={"1"}>
          {t(label)}
        </Grid.Col>
        <Grid.Col span={1}>
          <Checkbox
            pr="xs"
            checked={form.values[field] === 1}
            color="red"
            {...form.getInputProps(field, {
              type: "checkbox",
            })}
            onChange={(event) =>
              form.setFieldValue(field, event.currentTarget.checked ? 1 : 0)
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

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handlePosFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>

          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("PosInvoiceMode")}
              </Grid.Col>
              <Grid.Col span={11}>
                <SelectForm
                    tooltip={t('PosInvoiceMode')}
                    label={t('')}
                    placeholder={t('ChoosePosInvoiceMode')}
                    required={false}
                    nextField={'print_footer_text'}
                    name={'pos_invoice_mode_id'}
                    form={form}
                    dropdownValue={posInvoiceModeDropdown}
                    mt={8}
                    id={'pos_invoice_mode_id'}
                    searchable={false}
                    value={posInvoiceModeId}
                    changeValue={setPosInvoiceModeId}
                    clearable={true}
                    allowDeselect={true}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={23}>
                <TextAreaForm
                    tooltip={t('InvoiceComment')}
                    label={t('InvoiceComment')}
                    placeholder={t('InvoiceComment')}
                    required={false}
                    nextField={'logo'}
                    name={'invoice_comment'}
                    form={form}
                    mt={8}
                    id={'invoice_comment'}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("PosEnable")} field={'pos_print'}  name={'pos_print'} />
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("IsPOS")} field={'is_pos'}  name={'is_pos'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("PayFirst")} field={'is_pay_first'}  name={'is_pay_first'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("PaymentSplit")} field={'payment_split'}  name={'payment_split'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("MultiKitchen")} field={'multi_kitchen'}  name={'multi_kitchen'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("ItemAddons")} field={'item_addons'}  name={'item_addons'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("CashOnDelivery")} field={'cash_on_delivery'}  name={'cash_on_delivery'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("IsOnline")} field={'is_online'}  name={'is_online'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("CustomInvoice")} field={'custom_invoice'}  name={'custom_invoice'} />
          </Box>

          <Box>
            <InputCheckboxForm form={form} label={t("CustomInvoicePrint")} field={'custom_invoice_print'}  name={'custom_invoice_print'} />
          </Box>
        </Box>
        {/* Add hidden submit button with ID for external triggering */}
        <Button id="PosFormSubmit" type="submit" style={{ display: "none" }}>
          Submit
        </Button>
      </form>
    </ScrollArea>
  );
}

export default PosForm;
