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
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import {
  setValidationData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";


function PurchaseForm(props) {

  const { vendorGroupDropdownData, height, domainConfigData, closeDrawer} = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {fetchDomainConfig} = getDomainConfig(false)

  let config_purchase = domainConfigData?.inventory_config?.config_purchase
  let id = domainConfigData?.id

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [vendorGroupData, setVendorGroupData] = useState(null);

  useEffect(() => {
    setVendorGroupData(config_purchase?.default_vendor_group_id?.toString())
  }, [id]);

  const form = useForm({
    initialValues: {
      search_by_vendor: config_purchase?.search_by_vendor || "",
      search_by_product_nature: config_purchase?.search_by_product_nature || "",
      search_by_category: config_purchase?.search_by_category || "",
      is_barcode: config_purchase?.is_barcode || "",
      is_measurement_enable: config_purchase?.is_measurement_enable || "",
      is_purchase_auto_approved: config_purchase?.is_purchase_auto_approved || "",
      default_vendor_group_id: config_purchase?.default_vendor_group_id || '',
      is_warehouse: config_purchase?.is_warehouse || "",
      is_bonus_quantity: config_purchase?.is_bonus_quantity || "",
      is_purchase_by_purchase_price: config_purchase?.is_purchase_by_purchase_price || "",
      item_percent: config_purchase?.item_percent || "",
    },
  });

  useEffect(() => {
    if (config_purchase) {
      form.setValues({
        search_by_vendor: config_purchase?.search_by_vendor || 0,
        search_by_product_nature: config_purchase?.search_by_product_nature || 0,
        search_by_category: config_purchase?.search_by_category || 0,
        is_barcode: config_purchase?.is_barcode || 0,
        is_measurement_enable: config_purchase?.is_measurement_enable || 0,
        is_purchase_auto_approved: config_purchase?.is_purchase_auto_approved || 0,
        default_vendor_group_id: config_purchase?.default_vendor_group_id || null,
        is_warehouse: config_purchase?.is_warehouse || 0,
        is_bonus_quantity: config_purchase?.is_bonus_quantity || 0,
        is_purchase_by_purchase_price: config_purchase?.is_purchase_by_purchase_price || 0,
        item_percent: config_purchase?.item_percent || 0,
      });
    }
  }, [dispatch, config_purchase]);

  const handlePurchaseFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handlePurchaseConfirmSubmit(values),
    });
  };

  const handlePurchaseConfirmSubmit = async (values) => {
    const properties = [
      "search_by_vendor",
      "search_by_product_nature",
      "search_by_category",
      "is_barcode",
      "is_measurement_enable",
      "is_purchase_auto_approved",
      "is_bonus_quantity",
      "is_purchase_by_purchase_price",
      "item_percent",
      "is_warehouse",
    ];

    properties.forEach((property) => {
      values[property] =
        values[property] === true || values[property] === 1 ? 1 : 0;
    });
    const payload = {
      url: `domain/config/inventory-purchase/`+id,
      data: values,
      type: "POST",
    };

    try {
      setSaveCreateLoading(true);
      const result = await dispatch(storeEntityData(payload));
      if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
        fetchDomainConfig()
        showNotificationComponent(t("UpdateSuccessfully"), "teal");
        setTimeout(() => {
          closeDrawer();
        }, 1000);
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

  useHotkeys(
    [
      [
        "alt+p",
        () => {
          document.getElementById("PurchaseFormSubmit").click();
        },
      ],
    ],
    []
  );

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
        <Box pt={"xs"}>
          {/* Vendor Group Selection */}
          <Box>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8} pl="xs">
                {t("VendorGroup")}
              </Grid.Col>
              <Grid.Col span={11}>
                <SelectForm
                  tooltip={t("ChooseVendorGroup")}
                  label={""}
                  placeholder={t("ChooseVendorGroup")}
                  required={true}
                  nextField={""}
                  name={"default_vendor_group_id"}
                  form={form}
                  dropdownValue={vendorGroupDropdownData}
                  id={"default_vendor_group_id"}
                  searchable={false}
                  value={vendorGroupData}
                  changeValue={setVendorGroupData}
                />
              </Grid.Col>
            </Grid>
          </Box>

          {/* Purchase Settings */}
          <Box bg="gray.1" px="sm" py="xs" mt="xs">
            <Text fz={14} fw={600}>Purchase Settings</Text>
          </Box>
          <Box pl="sm">
            <Box>
              <InputCheckboxForm form={form} label={t('PurchaseByPurchasePrice')} field={'is_purchase_by_purchase_price'}  name={'is_purchase_by_purchase_price'} />
            </Box>
            <Box>
              <InputCheckboxForm form={form} label={t('PurchaseAutoApproved')} field={'is_purchase_auto_approved'}  name={'is_purchase_auto_approved'} />
            </Box>
            <Box>
              <InputCheckboxForm form={form} label={t('BonusQuantity')} field={'is_bonus_quantity'}  name={'is_bonus_quantity'} />
            </Box>
            <Box>
              <InputCheckboxForm form={form} label={t('ItemPercent')} field={'item_percent'}  name={'item_percent'} />
            </Box>
          </Box>

          {/* Product & Configuration */}
          <Box bg="gray.1" px="sm" py="xs" mt="xs">
            <Text fz={14} fw={600}>Product & Configuration</Text>
          </Box>
          <Box pl="sm">
            <Box>
              <InputCheckboxForm form={form} label={t('IsBarcode')} field={'is_barcode'}  name={'is_barcode'} />
            </Box>
            <Box>
              <InputCheckboxForm form={form} label={t('MeasurementEnabled')} field={'is_measurement_enable'}  name={'is_measurement_enable'} />
            </Box>
          </Box>

          {/* Search & Filtering */}
          <Box bg="gray.1" px="sm" py="xs" mt="xs">
            <Text fz={14} fw={600}>Search & Filtering</Text>
          </Box>
          <Box pl="sm">
            <Box>
              <InputCheckboxForm form={form} label={t('SearchByVendor')} field={'search_by_vendor'}  name={'search_by_vendor'} />
            </Box>
            <Box>
              <InputCheckboxForm form={form} label={t('SearchByProductNature')} field={'search_by_product_nature'}  name={'search_by_product_nature'} />
            </Box>
            <Box>
              <InputCheckboxForm form={form} label={t('SearchByCategory')} field={'search_by_category'}  name={'search_by_category'} />
            </Box>
          </Box>

          {/* Inventory & Storage */}
          <Box bg="gray.1" px="sm" py="xs" mt="xs">
            <Text fz={14} fw={600}>Inventory & Storage</Text>
          </Box>
          <Box pl="sm">
            <Box>
              <InputCheckboxForm form={form} label={t('Warehouse')} field={'is_warehouse'}  name={'is_warehouse'} />
            </Box>
          </Box>
        </Box>
        <Button
          id="PurchaseFormSubmit"
          type="submit"
          style={{ display: "none" }}
        >
          {t("Submit")}
        </Button>
      </form>
    </ScrollArea>
  );
}

export default PurchaseForm;
