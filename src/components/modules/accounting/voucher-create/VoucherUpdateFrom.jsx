import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Button,
  rem,
  Flex,
  Grid,
  Box,
  ScrollArea,
  Group,
  Text,
  Title,
  Alert,
  List,
  Stack,
  Tooltip,
  SimpleGrid,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconDeviceFloppy,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  setEditEntityData,
  setEntityNewData,
  setFetching,
  setFormLoading,
  setValidationData,
  storeEntityData,
  updateEntityData,
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import useAccountHeadDropdownData from "../../../global-hook/dropdown/account/getAccountHeadAllDropdownData";
import {setInsertType} from "../../../../store/generic/crudSlice.js";

function VoucherUpdateFrom(props) {
  const { voucherDropdown } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
  const [mode, setMode] = useState(null);


  const [voucherType, setVoucherType] = useState(null);
  const [accountHeadData, setAccountHeadData] = useState(null);
  const accountHeadDropdownData = useAccountHeadDropdownData(true, 'sub-head');

  useEffect(() => {
    setVoucherType(entityEditData?.voucher_type_id?.toString())
    setAccountHeadData(entityEditData?.ledger_account_head_id?.toString())
    setMode(entityEditData?.mode?.toString() || 'credit')
  }, [entityEditData]);



  const form = useForm({
    initialValues: {
      name: entityEditData?.name || "",
      short_name: entityEditData?.short_name || "",
      short_code: entityEditData?.short_code || "",
      mode: entityEditData?.mode || "",
      voucher_type_id: entityEditData?.voucher_type_id || "",
      ledger_account_head_id: entityEditData?.ledger_account_head_id || "",
    },
    validate: {
      voucher_type_id: isNotEmpty(),
      ledger_account_head_id: isNotEmpty(),
      name: isNotEmpty(),
      short_name: isNotEmpty(),
      short_code: isNotEmpty(),
      mode: isNotEmpty(),
    },
  });
  useEffect(() => {
    if (entityEditData) {
      form.setValues({
        name: entityEditData?.name || "",
        short_name: entityEditData?.short_name || "",
        short_code: entityEditData?.short_code || "",
        mode: entityEditData?.mode || "debit",
        voucher_type_id: entityEditData?.voucher_type_id || "",
        ledger_account_head_id: entityEditData?.ledger_account_head_id || "",
      });
    }
    dispatch(setFormLoading(false));
    setTimeout(() => {
      setFormLoading(false);
    }, 500);
  }, [entityEditData, dispatch]);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("voucher_type_id").click();
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
          handleReset();
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
    <Box>
      <form
        onSubmit={form.onSubmit((values) => {
          dispatch(setValidationData(false));
          modals.openConfirmModal({
            title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: async () => {
              setSaveCreateLoading(true);
              const data = {
                url: "accounting/voucher/" + entityEditData.id,
                data: form.values,
              };

              dispatch(updateEntityData(data));
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
                dispatch(setFetching(true));
                dispatch(
                  setEntityNewData({
                    ["name"]: "",
                    ["short_code"]: "",
                  })
                );
                form.reset();
                setVoucherType(null);
                setAccountHeadData(null);
                dispatch(setInsertType("create"))
              }, 500);
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
                        {t("VoucherUpdate")}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack right align="flex-end">
                        <>
                          {!saveCreateLoading && isOnline && (
                            <Button
                              size="xs"
                              className={"btnPrimaryBg"}
                              type="submit"
                              id="EntityFormSubmit"
                              leftSection={<IconDeviceFloppy size={16} />}
                            >
                              <Flex direction={`column`} gap={0}>
                                <Text fz={14} fw={400}>
                                  {t("UpdateAndSave")}
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
                  <Grid columns={24}>
                    <Grid.Col span={"auto"}>
                      <ScrollArea
                        h={height}
                        scrollbarSize={2}
                        scrollbars="y"
                        type="never"
                      >
                        <Box>
                          <Box mt={"8"}>
                            <SelectForm
                                tooltip={t("ChooseVoucherType")}
                                label={t("VoucherType")}
                                placeholder={t("ChooseVoucherType")}
                                required={true}
                                nextField={"ledger_account_head_id"}
                                name={"voucher_type_id"}
                                form={form}
                                dropdownValue={voucherDropdown}
                                mt={8}
                                id={"voucher_type_id"}
                                searchable={false}
                                value={voucherType}
                                changeValue={setVoucherType}
                            />
                          </Box>
                          <Box mt={"8"}>
                            <SelectForm
                                tooltip={t("ChooseAccountLedgerHead")}
                                label={t("AccountLedgerHead")}
                                placeholder={t("ChooseAccountLedgerHead")}
                                required={true}
                                nextField={"name"}
                                name={"ledger_account_head_id"}
                                form={form}
                                dropdownValue={accountHeadDropdownData}
                                mt={8}
                                id={"ledger_account_head_id"}
                                searchable={false}
                                value={accountHeadData}
                                changeValue={setAccountHeadData}
                            />
                          </Box>
                          <Box mt={"xs"}>
                            <InputForm
                              tooltip={t("NameValidateMessage")}
                              label={t("Name")}
                              placeholder={t("Name")}
                              required={true}
                              nextField={"short_name"}
                              name={"name"}
                              form={form}
                              mt={0}
                              id={"name"}
                            />
                          </Box>
                          <Box mt={"xs"}>
                            <InputForm
                              tooltip={t("ShortName")}
                              label={t("ShortName")}
                              placeholder={t("ShortName")}
                              required={true}
                              nextField={"short_code"}
                              name={"short_name"}
                              form={form}
                              mt={0}
                              id={"short_name"}
                            />
                          </Box>
                          <Box mt={"xs"}>
                            <InputForm
                              tooltip={t("ShortCode")}
                              label={t("ShortCode")}
                              placeholder={t("ShortCode")}
                              required={true}
                              name={"short_code"}
                              form={form}
                              id={"short_code"}
                              nextField={"mode"}
                              type="number"
                            />
                          </Box>
                          <Box mt={"8"}>
                            <SelectForm
                              tooltip={t("ChooseMode")}
                              label={t("Mode")}
                              placeholder={t("ChooseMode")}
                              required={true}
                              nextField={"status"}
                              name={"mode"}
                              form={form}
                              dropdownValue={[
                                { value: "debit", label: t("Debit") },
                                { value: "credit", label: t("Credit") },
                              ]}
                              mt={8}
                              id={"mode"}
                              searchable={false}
                              value={mode}
                              changeValue={setMode}
                            />
                          </Box>
                        </Box>
                      </ScrollArea>
                    </Grid.Col>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
              <Shortcut
                form={form}
                FormSubmit={"EntityFormSubmit"}
                Name={"method_id"}
                inputType="select"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  );
}
export default VoucherUpdateFrom;
