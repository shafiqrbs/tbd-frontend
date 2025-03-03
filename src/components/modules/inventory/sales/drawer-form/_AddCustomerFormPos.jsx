import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  rem,
  Flex,
  Grid,
  Box,
  ScrollArea,
  Text,
  Title,
  Stack,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconDeviceFloppy,
  IconRefreshDot,
  IconUserCircle,
  IconX,
  IconXboxX,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { storeEntityData } from "../../../../../store/inventory/crudSlice.js";
import InputForm from "../../../../form-builders/InputForm.jsx";
import PhoneNumber from "../../../../form-builders/PhoneNumberInput.jsx";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../../form-builders/TextAreaForm.jsx";

function _AddCustomerFormPos(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const effectRan = useRef(false);
  const [customerGroupData, setCustomerGroupData] = useState(null);
  const [locationData, setLocationData] = useState(null);

  const {
    setCustomerDrawer,
    setRefreshCustomerDropdown,
    focusField,
    fieldPrefix,
    customersDropdownData,
    setCustomerId,
    customerId,
  } = props;

  useEffect(() => {
    !effectRan.current &&
      (setTimeout(() => {
        const element = document.getElementById(fieldPrefix + "name");
        if (element) {
          element.focus();
        }
      }, 100),
      (effectRan.current = true));
  }, []);
  const customerAddedForm = useForm({
    initialValues: {
      name: "",
      mobile: "",
    },
    validate: {
      name: hasLength({ min: 2, max: 20 }),
      mobile: (value) => {
        if (!value) return t("MobileValidationRequired");
        return null;
      },
    },
  });
  const closeModel = () => {
    setCustomerDrawer(false);
  };
  console.log(customerId);
  return (
    <>
      <Box>
        <form
          onSubmit={customerAddedForm.onSubmit((values) => {
            modals.openConfirmModal({
              title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
              children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
              labels: { confirm: t("Submit"), cancel: t("Cancel") },
              confirmProps: { color: "red" },
              onCancel: () => console.log("Cancel"),
              onConfirm: () => {
                const CustomerForm = {};
                CustomerForm["name"] = customerAddedForm.values.name;
                CustomerForm["mobile"] = customerAddedForm.values.mobile;
                setSaveCreateLoading(true);
                const value = {
                  url: "core/customer",
                  data: CustomerForm,
                };
                dispatch(storeEntityData(value));

                notifications.show({
                  color: "teal",
                  title: t("CreateSuccessfully"),
                  icon: (
                    <IconCheck style={{ width: rem(18), height: rem(18) }} />
                  ),
                  loading: false,
                  autoClose: 700,
                  style: { backgroundColor: "lightgray" },
                });

                setTimeout(() => {
                  dispatch(storeEntityData(value));
                  customerAddedForm.reset();
                  setRefreshCustomerDropdown(true);
                  setCustomerDrawer(false);
                  document.getElementById(focusField).focus();
                }, 700);
              },
            });
          })}
        >
          <Box mb={0}>
            <Grid columns={9} gutter={{ base: 6 }}>
              <Grid.Col span={9}>
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                  <Box bg={"white"}>
                    <Box
                      pl={`xs`}
                      pr={8}
                      pt={"4"}
                      pb={"6"}
                      mb={"4"}
                      className={"boxBackground borderRadiusAll"}
                    >
                      <Grid columns={12}>
                        <Grid.Col span={6}>
                          <Title order={6} pt={"6"}>
                            {t("InstantCustomerCreate")}
                          </Title>
                        </Grid.Col>
                        <Grid.Col span={2} p={0}></Grid.Col>
                        <Grid.Col span={4}></Grid.Col>
                      </Grid>
                    </Box>
                    <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                      <ScrollArea
                        h={height + 18}
                        scrollbarSize={2}
                        scrollbars="y"
                        type="never"
                      >
                        <Box pt={"6"}>
                          <SelectForm
                            tooltip={t("CustomerValidateMessage")}
                            label=""
                            placeholder={t("Customer")}
                            required={false}
                            nextField={"name"}
                            name={"customer_id"}
                            form={customerAddedForm}
                            dropdownValue={customersDropdownData}
                            id={"customer_id"}
                            mt={1}
                            // onChange={(e) => {
                            //   console.log("oasd");
                            //   setCustomerId(e);
                            //   setCustomerDrawer(false);
                            // }}
                            searchable={true}
                            value={customerId}
                            changeValue={setCustomerId}
                          />
                        </Box>
                        <Box mt={"xs"}>
                          <InputForm
                            tooltip={t("NameValidateMessage")}
                            label={t("Name")}
                            placeholder={t("CustomerName")}
                            required={true}
                            nextField={fieldPrefix + "mobile"}
                            form={customerAddedForm}
                            name={"name"}
                            id={fieldPrefix + "name"}
                            leftSection={
                              <IconUserCircle size={16} opacity={0.5} />
                            }
                            rightIcon={""}
                          />
                        </Box>
                        <Box mt={"8"}>
                          <PhoneNumber
                            tooltip={
                              customerAddedForm.errors.mobile
                                ? customerAddedForm.errors.mobile
                                : t("MobileValidateMessage")
                            }
                            label={t("Mobile")}
                            placeholder={t("Mobile")}
                            required={true}
                            nextField={fieldPrefix + "email"}
                            form={customerAddedForm}
                            name={"mobile"}
                            id={fieldPrefix + "mobile"}
                            rightIcon={""}
                          />
                        </Box>
                      </ScrollArea>
                    </Box>
                    <Box
                      pl={`xs`}
                      pr={8}
                      pt={"6"}
                      pb={"6"}
                      mb={"2"}
                      mt={4}
                      className={"boxBackground borderRadiusAll"}
                    >
                      <Group justify="space-between">
                        <Flex
                          gap="md"
                          justify="center"
                          align="center"
                          direction="row"
                          wrap="wrap"
                        >
                          <ActionIcon
                            variant="transparent"
                            size="sm"
                            color="red.6"
                            onClick={closeModel}
                            ml={"4"}
                          >
                            <IconX
                              style={{ width: "100%", height: "100%" }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Flex>

                        <Group gap={8}>
                          <Flex justify="flex-end" align="center" h="100%">
                            <Button
                              variant="transparent"
                              size="xs"
                              color="red.4"
                              type="reset"
                              id=""
                              comboboxProps={{ withinPortal: false }}
                              p={0}
                              onClick={() => {
                                customerAddedForm.reset();
                              }}
                              rightSection={
                                <IconRefreshDot
                                  style={{ width: "100%", height: "60%" }}
                                  stroke={1.5}
                                />
                              }
                            ></Button>
                          </Flex>
                          <Stack align="flex-start">
                            <>
                              {!saveCreateLoading && isOnline && (
                                <Button
                                  size="xs"
                                  color={`green.8`}
                                  type="submit"
                                  id={fieldPrefix + "EntityCustomerFormSubmit"}
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
                        </Group>
                      </Group>
                    </Box>
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default _AddCustomerFormPos;
