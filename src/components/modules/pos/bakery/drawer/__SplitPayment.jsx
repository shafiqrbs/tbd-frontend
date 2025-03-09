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
  Tooltip,
  Image,
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
export default function __SplitPayment(props) {
  const { closeDrawer, fieldPrefix } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100; //TabList height 104
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [id, setId] = useState(null);
  const transactionModeData = JSON.parse(
    localStorage.getItem("accounting-transaction-mode")
  )
    ? JSON.parse(localStorage.getItem("accounting-transaction-mode"))
    : [];
  useEffect(() => {
    if (transactionModeData && transactionModeData.length > 0) {
      for (let mode of transactionModeData) {
        if (mode.is_selected) {
          form.setFieldValue(
            "transaction_mode_id",
            form.values.transaction_mode_id
              ? form.values.transaction_mode_id
              : mode.id
          );
          break;
        }
      }
    }
  }, [transactionModeData]);
  const customerAddedForm = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      notes: "",
    },
  });
  return (
    <form
      onSubmit={customerAddedForm.onSubmit((values) => {
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
              data: customerAddedForm.values,
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
                      {t("SplitPayment")}
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
                  <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={6}>
                      <Stack
                        m={0}
                        pt={8}
                        pb={8}
                        justify="flex-start"
                        align="flex-start"
                        gap="0"
                        wrap="nowrap"
                      >
                        {transactionModeData.map((mode, index) => (
                          <Box
                            onClick={() => {
                              // console.log("Clicked on method -", mode.id),
                              clicked(mode.id);
                            }}
                            key={index}
                            p={4}
                            style={{
                              position: "relative",
                              cursor: "pointer",
                            }}
                          >
                            <Flex
                              bg={mode.id === id ? "green.0" : "white"}
                              direction="column"
                              align="center"
                              justify="center"
                              p={4}
                              style={{
                                width: "100px",
                                borderRadius: "8px",
                                border: "1px solid black",
                              }}
                              h={70}
                            >
                              <Tooltip
                                label={mode.name}
                                withArrow
                                px={16}
                                py={2}
                                offset={2}
                                zIndex={999}
                                position="top"
                                color="red"
                              >
                                <Image
                                  mih={50}
                                  mah={50}
                                  fit="contain"
                                  src={
                                    isOnline
                                      ? mode.path
                                      : "/images/transaction-mode-offline.jpg"
                                  }
                                  fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
                                    mode.name
                                  )}`}
                                ></Image>
                              </Tooltip>
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={18}></Grid.Col>
                  </Grid>
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
          </Grid.Col>
        </Grid>
      </Box>
    </form>
  );
}
