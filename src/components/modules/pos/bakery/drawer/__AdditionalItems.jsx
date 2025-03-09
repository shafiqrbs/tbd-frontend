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
export default function __AdditionalItems(props) {
  const { closeDrawer, fieldPrefix } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104

  const additionalItemsForm = useForm({});
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false);

  return (
    <form
      onSubmit={additionalItemsForm.onSubmit((values) => {
        modals.openConfirmModal({
          title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
          children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
          labels: { confirm: t("Submit"), cancel: t("Cancel") },
          confirmProps: { color: "red" },
          onCancel: () => console.log("Cancel"),
          onConfirm: () => {
            setSaveCreateLoading(true);
            const value = {
              url: "core/customer",
              data: additionalItemsForm.values,
            };
            dispatch(storeEntityData(value));

            notifications.show({
              color: "teal",
              title: t("CreateSuccessfully"),
              icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
              loading: false,
              autoClose: 700,
              style: { backgroundColor: "lightgray" },
            });

            setTimeout(() => {
              dispatch(storeEntityData(value));
              additionalItemsForm.reset();
              setRefreshCustomerDropdown(true);
              closeDrawer()
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
                    <Box mt={"xs"}>
                      <InputForm
                        tooltip={t("NameValidateMessage")}
                        label={t("Name")}
                        placeholder={t("CustomerName")}
                        required={true}
                        nextField={fieldPrefix + "mobile"}
                        form={additionalItemsForm}
                        name={"name"}
                        id={fieldPrefix + "name"}
                        leftSection={<IconUserCircle size={16} opacity={0.5} />}
                        rightIcon={""}
                      />
                    </Box>
                    <Box mt={"8"}>
                      <PhoneNumber
                        tooltip={
                          additionalItemsForm.errors.mobile
                            ? additionalItemsForm.errors.mobile
                            : t("MobileValidateMessage")
                        }
                        label={t("Mobile")}
                        placeholder={t("Mobile")}
                        required={true}
                        nextField={fieldPrefix + "email"}
                        form={additionalItemsForm}
                        name={"mobile"}
                        id={fieldPrefix + "mobile"}
                        rightIcon={""}
                      />
                    </Box>
                    <Box mt={"8"}>
                      <InputForm
                        tooltip={t("InvalidEmail")}
                        label={t("Email")}
                        placeholder={t("Email")}
                        required={false}
                        nextField={fieldPrefix + "customer_group_id"}
                        name={"email"}
                        form={additionalItemsForm}
                        mt={8}
                        id={fieldPrefix + "email"}
                      />
                    </Box>
                    <Box mt={"8"}>
                      
                    </Box>
                    <Box mt={"8"}>
                      
                    </Box>
                    <Box mt={"8"}>
                      <TextAreaForm
                        tooltip={t("AddressValidateMessage")}
                        label={t("Address")}
                        placeholder={t("Address")}
                        required={false}
                        nextField={fieldPrefix + "EntityCustomerFormSubmit"}
                        name={"address"}
                        form={additionalItemsForm}
                        mt={8}
                        id={fieldPrefix + "address"}
                      />
                    </Box>
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
                        onClick={closeDrawer}
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
                          p={0}
                          onClick={() => {
                            additionalItemsForm.reset();
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
  );
}
