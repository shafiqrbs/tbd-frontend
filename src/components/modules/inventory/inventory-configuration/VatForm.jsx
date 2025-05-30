import React, {useEffect, useState} from "react";
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
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";
import {storeEntityData} from "../../../../store/core/crudSlice";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import SelectForm from "../../../form-builders/SelectForm";

function VatForm(props) {


  const { height,domainConfigData } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const {domainConfig,fetchDomainConfig} = getDomainConfig()
  const id = domainConfig?.id;
  let config_vat = domainConfig?.inventory_config?.config_vat
  const [vatModeData, setVatModeData] = useState(null);
  useEffect(() => {
    setVatModeData(config_vat?.vat_mode?.toString())
  }, [id]);

  const form = useForm({
    initialValues: {
      vat_reg_no: config_vat?.vat_reg_no || "",
      vat_mode: config_vat?.vat_mode || "",
      vat_enable: config_vat?.vat_enable || "",
      vat_percent: config_vat?.vat_percent || "",
      vat_integration: config_vat?.vat_integration || "",
      ait_enable: config_vat?.ait_enable || "",
      ait_percent: config_vat?.ait_percent || "",
      zakat_enable: config_vat?.zakat_enable || "",
      zakat_percent: config_vat?.zakat_percent || "",
      hs_code_enable: config_vat?.hs_code_enable || "",
      sd_enable: config_vat?.sd_enable || "",
      sd_percent: config_vat?.sd_percent || "",
    },
  });

  useEffect(() => {
    if (config_vat) {
      form.setValues({
        vat_reg_no: config_vat?.vat_reg_no || "",
        vat_mode: config_vat?.vat_mode || "",
        vat_enable: config_vat?.vat_enable || 0,
        vat_percent: config_vat?.vat_percent || 0,
        vat_integration: config_vat?.vat_integration || 0,
        ait_enable: config_vat?.ait_enable || 0,
        ait_percent: config_vat?.ait_percent || 0,
        zakat_enable: config_vat?.zakat_enable ||0,
        zakat_percent: config_vat?.zakat_percent ||0,
        hs_code_enable: config_vat?.hs_code_enable || 0,
        sd_enable: config_vat?.sd_enable || 0,
        sd_percent: config_vat?.sd_percent ||0,
      });
    }
  }, [dispatch, config_vat]);

  console.log(config_vat);

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
    const payload = {
      url: `domain/config/inventory-vat/`+id,
      data: values,
    };

    try {
      setSaveCreateLoading(true);
      const result = await dispatch(storeEntityData(payload));
      if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
        fetchDomainConfig()
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

  return (
    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
      <form onSubmit={form.onSubmit(handleVatFormSubmit)}>
        <Box pt={"xs"} pl={"xs"}>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz={"sm"} mt={8}>
                {t("VatRegNo")}
              </Grid.Col>
              <Grid.Col span={11}>
                <InputForm
                    label={""}
                    placeholder={t("EnterVatRegNo")}
                    required={false}
                    nextField={"hs_code_enable"}
                    name={"vat_reg_no"}
                    form={form}
                    id={"vat_reg_no"}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={'4'}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={12} fz="sm" mt={8}>
                {t("VATMode")}
              </Grid.Col>
              <Grid.Col span={11}>
                <SelectForm
                    tooltip={t("ChooseCustomerGroup")}
                    label=""
                    placeholder={t("ChooseCustomerGroup")}
                    required
                    name="vat_mode"
                    form={form}
                    dropdownValue={['Including','Excluding']}
                    id="vat_mode"
                    searchable={false}
                    value={vatModeData}
                    changeValue={setVatModeData}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("HsCodeEnable")} field={'hs_code_enable'} name={'hs_code_enable'} />
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("VatEnable")} field={'vat_enable'} name={'vat_enable'} />
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={18} fz={"sm"} mt={8}>
                {t("VATPercent")}
              </Grid.Col>
              <Grid.Col span={5}>
                <InputNumberForm
                    label={""}
                    placeholder={t("00.00")}
                    required={false}
                    nextField={"address"}
                    name={"vat_percent"}
                    form={form}
                    id={"vat_percent"}
                    tooltip={t("EnterVATPercent")}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("VatIntegration")} field={'vat_integration'} nextField={'ait_enable'} name={'vat_integration'} />
          </Box>
           <Box>
            <InputCheckboxForm form={form} label={t("AitEnable")} field={'ait_enable'} nextField={'ait_percent'} name={'ait_enable'} />
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={18} fz={"sm"} mt={8}>
                {t("AITPercent")}
              </Grid.Col>
              <Grid.Col span={5}>
                <InputNumberForm
                    label={""}
                    tooltip={t("EnterAITPercent")}
                    placeholder={t("00.00")}
                    required={false}
                    nextField={"zakat_enable"}
                    name={"ait_percent"}
                    form={form}
                    id={"ait_percent"}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("SdEnable")} field={'sd_enable'} nextField={'zakat_percent'} name={'sd_enable'} />
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={18} fz={"sm"} mt={8}>
                {t("SDPercent")}
              </Grid.Col>
              <Grid.Col span={5}>
                <InputNumberForm
                    label={""}
                    tooltip={t("EnterSDPercent")}
                    placeholder={t("00.00")}
                    required={false}
                    nextField={""}
                    name={"sd_percent"}
                    form={form}
                    id={"sd_percent"}
                />
              </Grid.Col>
            </Grid>
          </Box>
          <Box>
            <InputCheckboxForm form={form} label={t("ZakatEnable")} field={'zakat_enable'} nextField={'zakat_percent'} name={'ait_enable'} />
          </Box>
          <Box mt={"xs"}>
            <Grid columns={24} gutter={{ base: 1 }}>
              <Grid.Col span={18} fz={"sm"} mt={8}>
                {t("ZAKATPercent")}
              </Grid.Col>
              <Grid.Col span={5}>
                <InputNumberForm
                    label={""}
                    tooltip={t("EnterZAKATPercent")}
                    placeholder={t("00.00")}
                    required={false}
                    name={"zakat_percent"}
                    form={form}
                    id={"zakat_percent"}
                />
              </Grid.Col>
            </Grid>
          </Box>
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
