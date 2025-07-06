import {
  ActionIcon,
  Tooltip,
  Grid,
  Box,
  Title,
  Stack,
  Button,
  Flex,
  ScrollArea,
  Text,
} from "@mantine/core";
import SelectForm from "../../../form-builders/SelectForm";
import {
  IconUsersGroup,
  IconDeviceFloppy,
  IconCalendar,
  IconSortAscendingNumbers,
  IconPlusMinus,
  IconPercentage,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import { DateInput } from "@mantine/dates";
import DatePickerForm from "../../../form-builders/DatePicker";
import SwitchForm from "../../../form-builders/SwitchForm";

export default function CouponUpdateForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [modeId, setModeId] = useState(null);
  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  const formLoading = useSelector((state) => state.crudSlice.formLoading);
  const [formLoad, setFormLoad] = useState(true);
  const [setFormData, setFormDataForUpdate] = useState(false);

  const mode = [
    { label: "Flat", value: "1" },
    { label: "Percent", value: "2" },
  ];
  const form = useForm({
    initialValues: {
      name: entityEditData?.name || "",
      quantity: entityEditData?.quantity || "",
      amount: entityEditData?.amount || "",
      limit: entityEditData?.limit || "",
      minimum_sales_amount: entityEditData?.minimum_sales_amount || "",
      mode_id: entityEditData?.mode_id || "",
      start_date: entityEditData?.start_date || "",
      end_date: entityEditData?.end_date || "",
      is_sms: entityEditData?.is_sms || "",
    },
    validate: {
      name: isNotEmpty(),
    },
  });

  useEffect(() => {
    setFormLoad(true);
    setFormDataForUpdate(true);
  }, [dispatch, formLoading]);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("name").focus();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          modals.openConfirmModal({
            title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t("Submit"), cancel: t("Cancel") },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => {
              console.log(values);
            },
          });
        })}
      >
        <Grid columns={9} gutter={{ base: 8 }}>
          <Grid.Col span={8}>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"6"}
                  pb={"6"}
                  mb={"4"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <Title order={6} pt={"6"}>
                        {t("CreateCouponCode")}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack right align="flex-end">
                        <>
                          {!saveCreateLoading && isOnline && (
                            <Button
                              size="xs"
                              className={'btnPrimaryBg'}
                              type="submit"
                              id="EntityFormSubmit"
                              leftSection={<IconDeviceFloppy size={16} />}
                            >
                              <Flex direction={`column`} gap={0}>
                                <Text fz={14} fw={400}>
                                  {" "}
                                  {t("CreateAndSave")}
                                </Text>
                              </Flex>
                            </Button>
                          )}
                        </>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Box>
                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                  <ScrollArea
                    h={height}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                  >
                    <Box>
                      <Box mt={"8"}>
                        <InputForm
                          tooltip={t("CouponName")}
                          label={t("Name")}
                          placeholder={t("CouponName")}
                          required={true}
                          nextField={"quantity"}
                          name={"name"}
                          form={form}
                          mt={0}
                          id={"name"}
                        />
                      </Box>
                      <Box mt={"xs"}>
                        <InputForm
                          type="number"
                          leftSection={
                            <IconSortAscendingNumbers size={16} opacity={0.5} />
                          }
                          tooltip={t("Quantity")}
                          label={t("Quantity")}
                          placeholder={t("CouponQuantity")}
                          required={false}
                          nextField={"amount"}
                          name={"quantity"}
                          form={form}
                          mt={8}
                          id={"quantity"}
                        />
                      </Box>
                      <Box mt={"xs"}>
                        <InputForm
                          type="number"
                          leftSection={
                            modeId === "1" ? (
                              <IconPlusMinus size={16} opacity={0.5} />
                            ) : (
                              <IconPercentage size={16} opacity={0.5} />
                            )
                          }
                          tooltip={t("CouponDiscountAmount")}
                          label={t("DiscountAmount")}
                          placeholder={t("CouponDiscountAmount")}
                          required={false}
                          nextField={"limit"}
                          name={"amount"}
                          form={form}
                          mt={8}
                          id={"amount"}
                        />
                      </Box>
                      <Box mt={"xs"}>
                        <InputForm
                          tooltip={t("CouponLimit")}
                          label={t("Limit")}
                          placeholder={t("CouponLimit")}
                          required={false}
                          nextField={"limit"}
                          type="number"
                          leftSection={
                            <IconPlusMinus size={16} opacity={0.5} />
                          }
                          name={"limit"}
                          form={form}
                          mt={8}
                          id={"limit"}
                        />
                      </Box>
                      <Box mt={"xs"}>
                        <InputForm
                          type="number"
                          leftSection={
                            <IconPlusMinus size={16} opacity={0.5} />
                          }
                          tooltip={t("MinimumSalesAmount")}
                          label={t("MinimumSalesAmount")}
                          placeholder={t("MinimumSalesAmount")}
                          required={false}
                          nextField={"mode_id"}
                          name={"minimum_sales_amount"}
                          form={form}
                          mt={8}
                          id={"limit"}
                        />
                      </Box>
                      <Box mt={"xs"}>
                        <SelectForm
                          tooltip={t("ChooseCouponMode")}
                          label={t("Mode")}
                          placeholder={t("ChooseCouponMode")}
                          required={true}
                          nextField={"start_date"}
                          name={"mode_id"}
                          form={form}
                          dropdownValue={mode}
                          mt={8}
                          id={"mode_id"}
                          searchable={false}
                          value={modeId}
                          changeValue={setModeId}
                        />
                      </Box>
                      <Box mt={"xs"}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                          <Grid.Col span={12}>
                            <DatePickerForm
                              tooltip={t("ChooseStartDate")}
                              label="StartDate"
                              placeholder={t("ChooseStartDate")}
                              required={false}
                              nextField={"end_date"}
                              form={form}
                              name={"start_date"}
                              id={"start_date"}
                              leftSection={
                                <IconCalendar size={16} opacity={0.5} />
                              }
                              closeIcon={true}
                            />
                          </Grid.Col>
                          <Grid.Col span={12}>
                            <DatePickerForm
                              tooltip={t("ChooseEndDate")}
                              label="EndDate"
                              placeholder={t("ChooseEndDate")}
                              required={false}
                              nextField={"is_sms"}
                              form={form}
                              name={"end_date"}
                              id={"end_date"}
                              leftSection={
                                <IconCalendar size={16} opacity={0.5} />
                              }
                              closeIcon={true}
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"} mb={"xs"}>
                        <Grid gutter={{ base: 1 }}>
                          <Grid.Col span={2}>
                            <SwitchForm
                              mt={8}
                              tooltip={t("SmsEnable")}
                              label=""
                              nextField={"EntityFormSubmit"}
                              name={"is_sms"}
                              form={form}
                              color='var(--theme-primary-color-6)'
                              id={"is_sms"}
                              position={"left"}
                              defaultChecked={1}
                            />
                          </Grid.Col>
                          <Grid.Col span={6} fz={"sm"} pt={"1"} mt={"8"}>
                            {t("SendCustomerSms")}
                          </Grid.Col>
                        </Grid>
                      </Box>
                    </Box>
                  </ScrollArea>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
              <Shortcut
                form={form}
                FormSubmit={"EntityFormSubmit"}
                Name={"name"}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
