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
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  showInstantEntityData,
  updateEntityData,
} from "../../../../store/inventory/crudSlice.js";

function VatForm(props) {
  const { height, inventory_config, id } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const form = useForm({
    initialValues: {
      vat_enable: inventory_config?.vat_enable || "",
      vat_percent: inventory_config?.vat_percent || "",
      vat_reg_no: inventory_config?.vat_reg_no || "",
      vat_integration: inventory_config?.vat_integration || "",
      ait_enable: inventory_config?.ait_enable || "",
      ait_percent: inventory_config?.ait_percent || "",
      zakat_enable: inventory_config?.zakat_enable || "",
      zakat_percent: inventory_config?.zakat_percent || "",
      hs_code_enable: inventory_config?.hs_code_enable || "",
      sd_enable: inventory_config?.sd_enable || "",
      sd_percent: inventory_config?.sd_percent || "",
    },
  });

  const handleVatFormSubmit = (values) => {
    dispatch(setValidationData(false));

    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleVatConfirmSubmit(values),
    });
  };

  const handleVatConfirmSubmit = async (values) => {
    const properties = [
      "vat_enable",
      "vat_integration",
      "ait_enable",
      "zakat_enable",
      "hs_code_enable",
      "sd_enable",
    ];

    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] == 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);

      const value = {
        url: `vat/${id}`,
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
      console.error("Error updating vat config:", error);

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
        "alt+v",
        () => {
          document.getElementById("VatFormSubmit").click();
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
      <form onSubmit={form.onSubmit(handleVatFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          {renderCheckboxField("vat_enable", "VatEnable")}
          {renderCheckboxField("vat_percent", "VatPercent")}
          {renderCheckboxField("vat_reg_no", "VatRegNo")}
          {renderCheckboxField("vat_integration", "VatIntegration")}
          {renderCheckboxField("ait_enable", "AitEnable")}
          {renderCheckboxField("ait_percent", "AitPercent")}
          {renderCheckboxField("zakat_enable", "ZakatEnable")}
          {renderCheckboxField("zakat_percent", "ZakatPercent")}
          {renderCheckboxField("hs_code_enable", "HsCodeEnable")}
          {renderCheckboxField("sd_enable", "SdEnable")}
          {renderCheckboxField("sd_percent", "SdPercent")}
        </Box>
        {/* Add hidden submit button with ID for external triggering */}
        <Button id="VatFormSubmit" type="submit" style={{ display: "none" }}>
          Submit
        </Button>
      </form>
    </ScrollArea>
  );
}

export default VatForm;
