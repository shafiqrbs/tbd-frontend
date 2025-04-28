import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Checkbox, ScrollArea, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { useHotkeys } from "@mantine/hooks";
import { setValidationData, storeEntityData } from "../../../../store/core/crudSlice";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";
import SelectForm from "../../../form-builders/SelectForm";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent";

function SalesForm({ customerGroupDropdownData, height, id }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [customerGroupData, setCustomerGroupData] = useState(null);
  const { domainConfig, fetchDomainConfig } = getDomainConfig();

  const salesConfig = useMemo(() => domainConfig?.inventory_config?.config_sales || {}, [domainConfig]);

  const fields = [
    { name: "discount_with_customer", label: "DiscountWithCustomer" },
    { name: "due_sales_without_customer", label: "DueSalesWithoutCustomer" },
    { name: "is_measurement_enable", label: "MeasurementEnable" },
    { name: "is_multi_price", label: "MultiPrice" },
    { name: "is_sales_auto_approved", label: "SalesAutoApproved" },
    { name: "is_zero_receive_allow", label: "ZeroReceiveAllow" },
    { name: "item_sales_percent", label: "ItemSalesPercent" },
    { name: "search_by_category", label: "SearchByCategory" },
    { name: "search_by_product_nature", label: "SearchByProductNature" },
    { name: "search_by_vendor", label: "SearchByVendor" },
    { name: "search_by_warehouse", label: "SearchByWarehouse" },
    { name: "show_product", label: "ShowProduct" },
    { name: "zero_stock", label: "ZeroStock" },
  ];

  const form = useForm({
    initialValues: {
      default_customer_group_id: 0,
      ...fields.reduce((acc, field) => ({ ...acc, [field.name]: 0 }), {})
    },
  });

  useEffect(() => {
    if (salesConfig) {
      form.setValues({
        default_customer_group_id: salesConfig.default_customer_group_id || 0,
        ...fields.reduce((acc, field) => ({ ...acc, [field.name]: salesConfig[field.name] || 0 }), {})
      });
    }
  }, [salesConfig]);

  const handleSalesFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => handleSalesConfirmSubmit(values),
    });
  };

  const handleSalesConfirmSubmit = async (values) => {
    const payload = {
      url: `domain/config/inventory-sales/${id}`,
      data: {
        ...values,
        ...fields.reduce((acc, field) => ({
          ...acc,
          [field.name]: values[field.name] === true || values[field.name] === 1 ? 1 : 0,
        }), {})
      }
    };

    try {
      setSaveCreateLoading(true);

      const result = await dispatch(storeEntityData(payload));

      if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
        await fetchDomainConfig();
        showNotificationComponent(t("UpdateSuccessfully"), "teal");
      } else {
        showNotificationComponent(t("UpdateFailed"), "red");
      }

    } catch (err) {
      console.error(err);
      showNotificationComponent(t("UpdateFailed"), "red");
    } finally {
      setSaveCreateLoading(false);
    }
  };

  useHotkeys([
    ["alt+s", () => document.getElementById("SalesFormSubmit")?.click()]
  ], []);

  return (
      <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
        <form onSubmit={form.onSubmit(handleSalesFormSubmit)}>
          <Box pt="xs" pl="xs">

            {/* CustomerGroup Field */}
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz="sm" mt={8}>
                {t("CustomerGroup")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                    tooltip={t("ChooseCustomerGroup")}
                    label=""
                    placeholder={t("ChooseCustomerGroup")}
                    required
                    name="default_customer_group_id"
                    form={form}
                    dropdownValue={customerGroupDropdownData}
                    id="default_customer_group_id"
                    searchable={false}
                    value={
                      customerGroupData
                          ? String(customerGroupData)
                          : salesConfig?.default_customer_group_id
                              ? String(salesConfig.default_customer_group_id)
                              : null
                    }
                    changeValue={setCustomerGroupData}
                />
              </Grid.Col>
            </Grid>

            {/* Dynamic checkbox fields */}
            {fields.map((field, idx) => (
                <Box key={idx} mt="xs">
                  <Grid
                      gutter={{ base: 1 }}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                          form.setFieldValue(field.name, form.values[field.name] === 1 ? 0 : 1)
                      }
                  >
                    <Grid.Col span={11} fz="sm" pt="1">
                      {t(field.label)}
                    </Grid.Col>
                    <Grid.Col span={1}>
                      <Checkbox
                          pr="xs"
                          checked={form.values[field.name] === 1}
                          color="red"
                          {...form.getInputProps(field.name, { type: "checkbox" })}
                          onChange={(event) =>
                              form.setFieldValue(
                                  field.name,
                                  event.currentTarget.checked ? 1 : 0
                              )
                          }
                          styles={{ input: { borderColor: "red" } }}
                      />
                    </Grid.Col>
                  </Grid>
                </Box>
            ))}

          </Box>

          {/* Hidden submit button */}
          <Button
              id="SalesFormSubmit"
              type="submit"
              style={{ display: "none" }}
              loading={saveCreateLoading}
          >
            {t("Submit")}
          </Button>
        </form>
      </ScrollArea>
  );
}

export default SalesForm;
