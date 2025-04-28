import React, { useState } from "react";
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

function PosForm(props) {
  const { height, inventory_config, invoiceModeList, id } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [posInvoiceModeData, setPosInvoiceModeData] = useState(null);

  const form = useForm({
    initialValues: {
      pos_print: inventory_config?.pos_print || "",
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
    // Fields that should be treated as boolean (1 or 0)
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
      setSaveCreateLoading(true);

      const value = {
        url: `pos/${id}`,
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
      console.error("Error updating POS config:", error);

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
          {/* POS Settings */}
          {/* POS Invoice Position InputForm */}
          <Box mt="md">
            <InputForm
              label={""}
              placeholder={t("EnterPOSInvoicePosition")}
              required={false}
              nextField={"pos_invoice_mode_id"}
              name={"pos_invoice_position"}
              form={form}
              id={"pos_invoice_position"}
            />
          </Box>

          {/* POS Invoice Mode SelectForm */}
          <Box mt="md">
            <SelectForm
              label={""}
              placeholder={t("SelectPOSInvoiceMode")}
              required={false}
              nextField={"multi_kitchen"}
              name={"pos_invoice_mode_id"}
              form={form}
              dropdownValue={invoiceModeList || []}
              id={"pos_invoice_mode_id"}
              searchable={true}
              value={
                posInvoiceModeData
                  ? String(posInvoiceModeData)
                  : inventory_config?.pos_invoice_mode_id
                  ? String(inventory_config?.pos_invoice_mode_id)
                  : null
              }
              changeValue={setPosInvoiceModeData}
            />
          </Box>
          {renderCheckboxField("pos_print", "POSPrint")}
          {renderCheckboxField("is_pos", "IsPOS")}
          {renderCheckboxField("is_pay_first", "PayFirst")}

          {renderCheckboxField("multi_kitchen", "MultiKitchen")}
          {renderCheckboxField("payment_split", "PaymentSplit")}
          {renderCheckboxField("item_addons", "ItemAddons")}
          {renderCheckboxField("cash_on_delivery", "CashOnDelivery")}
          {renderCheckboxField("is_online", "IsOnline")}
          {renderCheckboxField("custom_invoice", "CustomInvoice")}
          {renderCheckboxField("custom_invoice_print", "CustomInvoicePrint")}
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
