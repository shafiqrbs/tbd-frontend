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
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";

function DiscountForm(props) {
  const { height, config_discount, id } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [customerGroupData, setCustomerGroupData] = useState(null);

  const form = useForm({
    initialValues: {
      name: config_discount?.name || "",
      max_discount: config_discount?.max_discount || 0,
      discount_with_customer: config_discount?.discount_with_customer || 0,
      customer_group_id: config_discount?.customer_group_id || 0,
    },
  });
  
  useEffect(() => {
    if (config_discount) {
      form.setValues({
        name: config_discount?.name || "",
        max_discount: config_discount?.max_discount || 0,
        discount_with_customer: config_discount?.discount_with_customer || 0,
        customer_group_id: config_discount?.customer_group_id || 0,
      });
    }
  }, [dispatch, config_discount]);

  const handleDiscountFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDiscountConfirmSubmit(values),
    });
  };

  const handleDiscountConfirmSubmit = async (values) => {
    // Convert checkbox values to 0 or 1
    const properties = [
      "discount_with_customer",
    ];
    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] === 1 ? 1 : 0;
    });

    try {
      setSaveCreateLoading(true);
      const value = {
        url: `domain/config/inventory-discount/${id}`,
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
      console.error("Error updating discount config:", error);

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
          document.getElementById("DiscountFormSubmit").click();
        },
      ],
    ],
    []
  );

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleDiscountFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          {/* Name field */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("Name")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputForm
                  tooltip={t('DiscountName')}
                  label={""}
                  placeholder={t('EnterDiscountName')}
                  required={true}
                  nextField={'max_discount'}
                  name={'name'}
                  form={form}
                  id={'name'}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Max discount field */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("MaxDiscount")}
              </Grid.Col>
              <Grid.Col span={12}>
                <InputNumberForm
                  tooltip={t('MaxDiscountValue')}
                  label={""}
                  placeholder={t('EnterMaxDiscount')}
                  required={true}
                  nextField={'customer_group_id'}
                  name={'max_discount'}
                  form={form}
                  id={'max_discount'}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Customer Group dropdown */}
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("CustomerGroup")}
              </Grid.Col>
              <Grid.Col span={12}>
                <SelectForm
                  tooltip={t('ChooseCustomerGroup')}
                  label={""}
                  placeholder={t('ChooseCustomerGroup')}
                  required={false}
                  nextField={'discount_with_customer'}
                  name={'customer_group_id'}
                  form={form}
                  dropdownValue={props.customerGroupDropdownData || []}
                  id={'customer_group_id'}
                  searchable={true}
                  value={customerGroupData ? String(customerGroupData) : config_discount?.customer_group_id ? String(config_discount?.customer_group_id) : null}
                  changeValue={setCustomerGroupData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* discount_with_customer */}
          <Box mt={"xs"}>
            <Grid
              gutter={{ base: 1 }}
              style={{ cursor: "pointer" }}
              onClick={() =>
                form.setFieldValue(
                  "discount_with_customer",
                  form.values.discount_with_customer === 1 ? 0 : 1
                )
              }
            >
              <Grid.Col span={11} fz={"sm"} pt={"1"}>
                {t("DiscountWithCustomer")}
              </Grid.Col>
              <Grid.Col span={1}>
                <Checkbox
                  pr="xs"
                  checked={form.values.discount_with_customer === 1}
                  color="red"
                  {...form.getInputProps("discount_with_customer", {
                    type: "checkbox",
                  })}
                  onChange={(event) =>
                    form.setFieldValue(
                      "discount_with_customer",
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
        <Button id="DiscountFormSubmit" type="submit" style={{ display: "none" }}>
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default DiscountForm;
