import React, {useEffect, useState} from "react";
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
import {useDispatch, useSelector} from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm";
import {setFormLoading} from "../../../../store/inventory/crudSlice";

function ProductionForm(props) {
  const { height, production_config, id } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [customerGroupData, setCustomerGroupData] = useState(null);
  const [consumptionMethodData, setConsumptionMethodData] = useState(null);
  const [productionProcedureData, setProductionProcedureData] = useState(null);

  const form = useForm({
    initialValues: {
      consumption_method_id: production_config?.consumption_method_id || 0,
      production_procedure_id: production_config?.production_procedure_id || 0,
      is_measurement: production_config?.is_measurement || 0,
      is_warehouse: production_config?.is_warehouse || 0,
      issue_by_production_batch: production_config?.issue_by_production_batch || 0,
      issue_with_warehouse: production_config?.issue_with_warehouse || 0,
    },
  });
  
  useEffect(() => {
    if (production_config) {
      form.setValues({
        consumption_method_id: production_config?.consumption_method_id || 0,
        production_procedure_id: production_config?.production_procedure_id || 0,
        is_measurement: production_config?.is_measurement || 0,
        is_warehouse: production_config?.is_warehouse || 0,
        issue_by_production_batch: production_config?.issue_by_production_batch || 0,
        issue_with_warehouse: production_config?.issue_with_warehouse || 0,
      });
    }
  }, [dispatch, production_config]);

  const handleProductionFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleProductionConfirmSubmit(values),
    });
  };

  const handleProductionConfirmSubmit = async (values) => {
    const properties = [
      "is_measurement",
      "is_warehouse",
      "issue_by_production_batch",
      "issue_with_warehouse",
    ];
    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] === 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);
      const value = {
        url: `domain/config/production/${id}`,
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
      console.error("Error updating production config:", error);

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
          document.getElementById("ProductionFormSubmit").click();
        },
      ],
    ],
    []
  );

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleProductionFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          {/* Consumption Method dropdown */}
          <Box>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("ConsumptionMethod")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                    tooltip={t('ChooseConsumptionMethod')}
                    label={""}
                    placeholder={t('ChooseConsumptionMethod')}
                    required={true}
                    nextField={''}
                    name={'consumption_method_id'}
                    form={form}
                    dropdownValue={props.consumptionMethodDropdownData || []}
                    id={'consumption_method_id'}
                    searchable={false}
                    value={consumptionMethodData ? String(consumptionMethodData) : production_config?.consumption_method_id ? String(production_config?.consumption_method_id) : null}
                    changeValue={setConsumptionMethodData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Production Procedure dropdown */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("ProductionProcedure")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                    tooltip={t('ChooseProductionProcedure')}
                    label={""}
                    placeholder={t('ChooseProductionProcedure')}
                    required={true}
                    nextField={''}
                    name={'production_procedure_id'}
                    form={form}
                    dropdownValue={props.productionProcedureDropdownData || []}
                    id={'production_procedure_id'}
                    searchable={false}
                    value={productionProcedureData ? String(productionProcedureData) : production_config?.production_procedure_id ? String(production_config?.production_procedure_id) : null}
                    changeValue={setProductionProcedureData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* is_measurement */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_measurement",
                  form.values.is_measurement === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("Measurement")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.is_measurement === 1}
                  color="red"
                  {...form.getInputProps("is_measurement", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "is_measurement",
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

          {/* is_warehouse */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "is_warehouse",
                  form.values.is_warehouse === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("Warehouse")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.is_warehouse === 1}
                  color="red"
                  {...form.getInputProps("is_warehouse", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "is_warehouse",
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

          {/* issue_by_production_batch */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "issue_by_production_batch",
                  form.values.issue_by_production_batch === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("IssueByProductionBatch")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.issue_by_production_batch === 1}
                  color="red"
                  {...form.getInputProps("issue_by_production_batch", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "issue_by_production_batch",
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

          {/* issue_with_warehouse */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "issue_with_warehouse",
                  form.values.issue_with_warehouse === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("IssueWithWarehouse")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.issue_with_warehouse === 1}
                  color="red"
                  {...form.getInputProps("issue_with_warehouse", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "issue_with_warehouse",
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
        <Button id="ProductionFormSubmit" type="submit" style={{ display: "none" }}>
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default ProductionForm;
