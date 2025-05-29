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
import getCurrencyDropdownData from "../../../global-hook/dropdown/getCurrencyDropdownData";
import getCountryDropdownData from "../../../global-hook/dropdown/getCountryDropdownData";
import getSettingBusinessModelDropdownData from "../../../global-hook/dropdown/getSettingBusinessModelDropdownData";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";

function DomainConfigForm(props) {
  const {
    height,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {domainConfig,fetchDomainConfig} = getDomainConfig()
  let currencyList = getCurrencyDropdownData();
  let countryList = getCountryDropdownData();
  let businessModelList = getSettingBusinessModelDropdownData();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [businessModelData, setBusinessModelData] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const inventory_config = domainConfig?.inventory_config;
  const id = domainConfig?.id;

  useEffect(() => {
    setBusinessModelData(inventory_config?.business_model_id?.toString());
    setCurrencyData(inventory_config?.currency_id?.toString());
    setCountryData(inventory_config?.country_id?.toString());
  }, [inventory_config]);

  const form = useForm({
    initialValues: {
      // Text fields

      address: inventory_config?.address || "",
      customer_prefix: inventory_config?.customer_prefix || "",
      shop_name: domainConfig?.name || "",

      // Number fields

      unit_commission: inventory_config?.unit_commission || null,
      tlo_commission: inventory_config?.tlo_commission || 0,
      sr_commission: inventory_config?.sr_commission || 0,

      // Boolean/Checkbox fields

      multi_company: inventory_config?.multi_company || 0,
      condition_sales: inventory_config?.condition_sales || 0,
      is_marketing_executive: inventory_config?.is_marketing_executive || 0,
      fuel_station: inventory_config?.fuel_station || 0,
      is_powered: inventory_config?.is_powered || 0,
      is_active_sms: inventory_config?.is_active_sms || 0,
      is_batch_invoice: inventory_config?.is_batch_invoice || 0,
      is_provision: inventory_config?.is_provision || 0,
      business_model_id: inventory_config?.business_model_id || "",
      currency_id: inventory_config?.currency_id || "",
      country_id: inventory_config?.country_id || "",

    },
  });

  useEffect(() => {
    if (inventory_config) {
      form.setValues({

        address: inventory_config?.address || "",
        customer_prefix: inventory_config?.customer_prefix || "",
        shop_name: domainConfig?.name || "",

        // Number fields

        unit_commission: inventory_config?.unit_commission || null,
        tlo_commission: inventory_config?.tlo_commission || 0,
        sr_commission: inventory_config?.sr_commission || 0,

        // Boolean/Checkbox fields

        multi_company: inventory_config?.multi_company || 0,
        condition_sales: inventory_config?.condition_sales || 0,
        is_marketing_executive: inventory_config?.is_marketing_executive || 0,
        fuel_station: inventory_config?.fuel_station || 0,
        is_powered: inventory_config?.is_powered || 0,
        is_active_sms: inventory_config?.is_active_sms || 0,
        is_batch_invoice: inventory_config?.is_batch_invoice || 0,
        is_provision: inventory_config?.is_provision || 0,
        business_model_id: inventory_config?.business_model_id || "",
        currency_id: inventory_config?.currency_id || "",
        country_id: inventory_config?.country_id || "",
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
      "multi_company",
      "condition_sales",
      "is_marketing_executive",
      "fuel_station",
      "is_powered",
      "is_active_sms",
      "is_batch_invoice",
      "is_provision"
    ];

    properties.forEach((property) => {
      values[property] =
          values[property] === true || values[property] == 1 ? 1 : 0;
    });
    const payload = {
      url: `domain/config/domain/${id}`,
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
          document.getElementById("DomainFormSubmit").click();
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
          <Box ml={'-md'} pl={'md'} pt={'8'} pb={'12'} mt={'8'} ta="left" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('GeneralSettings')}</Title>
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
                    value={businessModelData}
                    changeValue={setBusinessModelData}
                />
              </Grid.Col>
            </Grid>
          </Box>
          {/* Address field */}
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
                  nextField={"address"}
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
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("Address")}
              </Grid.Col>
              <Grid.Col span={12}>
                <TextAreaGenericForm
                    label={""}
                    placeholder={t("EnterAddress")}
                    required={false}
                    nextField={"unit_commission"}
                    name={"address"}
                    form={form}
                    id={"address"}
                />
              </Grid.Col>
            </Grid>
          </Box>
          {/* Unit Commission field */}

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

          {/* Several more font fields would go here - omitting for brevity */}
          <Box ml={'-md'} pl={'md'} pt={'8'} pb={'12'} mt={'8'} ta="left" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('CommissionSettings')}</Title>
          </Box>

          {/* TLO Commission */}
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
                  nextField={"multi_company"}
                  name={"sr_commission"}
                  form={form}
                  id={"sr_commission"}
                  min={0}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box ml={'-md'} pl={'md'} pt={'8'} pb={'12'} mt={'8'} ta="left" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('Features')}</Title>
          </Box>
          <Box><InputCheckboxForm form={form} label={t("MultiCompany")} field={'multi_company'}  name={'multi_company'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsActiveSMS")} field={'is_active_sms'}  name={'is_active_sms'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("ConditionSales")} field={'condition_sales'}  name={'condition_sales'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsMarketingExecutive")} field={'is_marketing_executive'}  name={'is_marketing_executive'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsPowered")} field={'is_powered'}  name={'is_powered'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsFuelStation")} field={'fuel_station'}  name={'fuel_station'} /></Box>
          <Box ml={'-md'} pl={'md'} pt={'8'} pb={'12'} mt={'8'} ta="left" bg={'gray.2'}>
            <Title order={6} pt={'4'}>{t('ProductSettings')}</Title>
          </Box>
          <Box><InputCheckboxForm form={form} label={t("IsBatchInvoice")} field={'is_batch_invoice'}  name={'is_batch_invoice'} /></Box>
          <Box><InputCheckboxForm form={form} label={t("IsProvision")} field={'is_provision'}  name={'is_provision'} /></Box>
        </Box>

        {/* Hidden submit button for hotkey */}
        <Button
          id="DomainFormSubmit"
          type="submit"
          style={{ display: "none" }}
        >
          Submit
        </Button>
      </form>
    </ScrollArea>
  );
}

export default DomainConfigForm;
