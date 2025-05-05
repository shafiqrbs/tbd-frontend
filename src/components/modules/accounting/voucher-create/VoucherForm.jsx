import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
  SimpleGrid,
  Image,
  Tooltip,
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
  setFetching,
  setValidationData,
  storeEntityData,
} from "../../../../store/accounting/crudSlice.js";
import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";

function VoucherForm(props) {
  const { voucherDropdown } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [voucherType, setVoucherType] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      short_name: "",
      short_code: "",
      status: 1,
      mode: "",
      voucher_type_id: "",
    },
    validate: {
      name: isNotEmpty(),
      voucher_type_id : isNotEmpty(),
      short_code : isNotEmpty()
    },
  });

  const [mode, setMode] = useState(null);

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
                url: "accounting/voucher",
                data: form.values,
              };

              try {
                const action = await dispatch(storeEntityData(data));
                const payload = action.payload;
                if (payload?.status === 200 && payload?.data?.data?.id) {
                  showNotificationComponent(
                    t("Voucher created successfully"),
                    "green"
                  );
                } else {
                  showNotificationComponent(t("Something went wrong"), "red");
                }
              } catch (error) {
                console.error("Error updating domain status", error);
                showNotificationComponent(t("Request failed"), "red");
              } finally {
                form.reset();
                dispatch(setFetching(true));
                setVoucherType(null);
                setSaveCreateLoading(false);
              }
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
                        {t("Voucher")}
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
                              nextField={"name"}
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
                          <Box mt={"xs"}>
                            <Grid gutter={{ base: 1 }}>
                              <Grid.Col span={2}>
                                <SwitchForm
                                  tooltip={t("Status")}
                                  label=""
                                  nextField={"EntityFormSubmit"}
                                  name={"status"}
                                  form={form}
                                  color="red"
                                  id={"status"}
                                  position={"left"}
                                  defaultChecked={1}
                                />
                              </Grid.Col>
                              <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                {t("Status")}
                              </Grid.Col>
                            </Grid>
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
export default VoucherForm;
