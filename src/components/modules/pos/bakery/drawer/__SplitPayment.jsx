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
import InputNumberForm from "../../../../form-builders/InputNumberForm.jsx";
export default function __SplitPayment(props) {
  const { closeDrawer } = props;
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
  const splitPaymentForm = useForm({
    initialValues: {},
  });
  const clicked = (id) => {
    setId(id);
  };
  return (
    <form
      onSubmit={splitPaymentForm.onSubmit((values) => {
        const allValues = transactionModeData.map((mode) => ({
          transaction_mode_id: mode.id,
          partial_amount: values[`partial_amount_${mode.id}`],
          remarks: values[`remarks_${mode.id}`],
        }));
        console.log("allValues", allValues);
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
                  {transactionModeData.map((mode, index) => (
                    <Grid
                      align="center"
                      justify="center"
                      columns={24}
                      gutter={{ base: 8 }}
                      key={index}
                      onClick={() => {
                          clicked(mode.id);
                      }}
                    >
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
                          <Box
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
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <Box>
                          <InputNumberForm
                            tooltip={t("PartialAmount")}
                            label={t("")}
                            placeholder={t("PartialAmount")}
                            required={false}
                            nextField={"remarks"}
                            name={`partial_amount_${mode.id}`}
                            form={splitPaymentForm}
                            id={`partial_amount_${mode.id}`}
                          />
                        </Box>
                      </Grid.Col>
                      <Grid.Col span={10}>
                        <Box>
                          <InputForm
                            tooltip={t("Remarks")}
                            label={t("")}
                            placeholder={t("Remarks")}
                            required={true}
                            nextField={"EntitySplitFormSubmit"}
                            form={splitPaymentForm}
                            name={`remarks_${mode.id}`}
                            id={`remarks_${mode.id}`}
                            leftSection={
                              <IconUserCircle size={16} opacity={0.5} />
                            }
                            rightIcon={""}
                          />
                        </Box>
                      </Grid.Col>
                    </Grid>
                  ))}
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
                          splitPaymentForm.reset();
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
                            id={"EntitySplitFormSubmit"}
                            leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {t("Save")}
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
