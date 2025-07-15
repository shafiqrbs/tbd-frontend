import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
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
  Divider,
  Badge,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconRefreshDot,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import InputForm from "../../../../form-builders/InputForm.jsx";
import InputNumberForm from "../../../../form-builders/InputNumberForm.jsx";

export default function __SplitPayment(props) {
  const {
    closeDrawer,
    salesDueAmount,
    getSplitPayment,
    currentSplitPayments,
    tableSplitPaymentMap,
  } = props;
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;
  const [id, setId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(salesDueAmount);

  const transactionModeData =
    JSON.parse(localStorage.getItem("accounting-transaction-mode")) || [];

  const initialValues = transactionModeData.reduce((acc, mode) => {
    acc[`partial_amount_${mode.id}`] = "";
    acc[`remarks_${mode.id}`] = "";
    return acc;
  }, {});

  const splitPaymentForm = useForm({
    initialValues,
  });

  const clicked = (id) => {
    if (formSubmitted) return;
    setId(id);
  };

  const [splitPayments, setSplitPayments] = useState([]);
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    let totalPaidAmount = 0;
    const payments = [];

    transactionModeData.forEach((mode) => {
      const amountField = `partial_amount_${mode.id}`;
      const remarksField = `remarks_${mode.id}`;
      const amount = splitPaymentForm.values[amountField];

      if (amount && Number(amount) > 0) {
        totalPaidAmount += Number(amount);

        payments.push({
          transaction_mode_id: mode.id,
          partial_amount: Number(amount),
          remarks: splitPaymentForm.values[remarksField] || "",
        });
      }
    });

    setSplitPayments(payments);
    if (salesDueAmount !== 0) {
      setRemainingAmount((salesDueAmount - totalPaidAmount).toFixed(2));
    } else {
      setRemainingAmount(0);
    }

    // Enable save button only when amounts match exactly
    const amountMatches = Math.abs(totalPaidAmount - salesDueAmount) < 0.01;
    setSaveDisabled(!amountMatches || payments.length === 0);
  }, [splitPaymentForm.values, salesDueAmount]);

  const handleFormSubmit = () => {
    if (saveDisabled) return;

    // Pass split payment data back to parent
    getSplitPayment(splitPayments);
    setFormSubmitted(true);
  };

  useEffect(() => {
    if (currentSplitPayments && currentSplitPayments.length > 0) {
      const values = { ...initialValues };

      currentSplitPayments.forEach((payment) => {
        values[`partial_amount_${payment.transaction_mode_id}`] =
          payment.partial_amount;
        values[`remarks_${payment.transaction_mode_id}`] =
          payment.remarks || "";
      });

      splitPaymentForm.setValues(values);

      setSplitPayments(currentSplitPayments);

      const totalPaid = currentSplitPayments.reduce(
        (sum, payment) => sum + Number(payment.partial_amount),
        0
      );
      setRemainingAmount((salesDueAmount - totalPaid).toFixed(2));
    }
  }, []);
  return (
    <form onSubmit={splitPaymentForm.onSubmit(handleFormSubmit)}>
      <Box mb={0}>
        <Grid columns={9} gutter={{ base: 6 }}>
          <Grid.Col span={9}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"0"}
                pb={"6"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid columns={12} align="center" justify="right">
                  <Grid.Col span={6}>
                    <Title order={6} pt={"6"}>
                      {t("SplitPayment")}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={2}></Grid.Col>
                  <Grid.Col span={4}>
                    <Badge
                      mt={6}
                      h={26}
                      w={160}
                      color={
                        Number(remainingAmount) > 0
                          ? "red"
                          : Number(remainingAmount) < 0
                          ? "orange"
                          : "green"
                      }
                      size="md"
                    >
                      {t("Remaining")}: {remainingAmount}
                    </Badge>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                <ScrollArea
                  h={height + 18}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                  pt={"xs"}
                >
                  {transactionModeData.map((mode, index) => (
                    <React.Fragment key={index}>
                      <Grid
                        align="center"
                        justify="center"
                        columns={24}
                        gutter={{ base: 8 }}
                        onClick={() => {
                          clicked(mode.id);
                        }}
                        opacity={formSubmitted ? 0.8 : 1}
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
                                cursor: formSubmitted ? "default" : "pointer",
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
                                  color='var(--theme-primary-color-6)'
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
                              nextField={`remarks_${mode.id}`}
                              name={`partial_amount_${mode.id}`}
                              form={splitPaymentForm}
                              id={`partial_amount_${mode.id}`}
                              disabled={formSubmitted}
                            />
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={10}>
                          <Box>
                            <InputForm
                              tooltip={t("Remarks")}
                              label={t("")}
                              placeholder={t("Remarks")}
                              required={false}
                              nextField={"EntitySplitFormSubmit"}
                              form={splitPaymentForm}
                              name={`remarks_${mode.id}`}
                              id={`remarks_${mode.id}`}
                              leftSection={
                                <IconUserCircle size={16} opacity={0.5} />
                              }
                              rightIcon={""}
                              disabled={formSubmitted}
                            />
                          </Box>
                        </Grid.Col>
                      </Grid>
                      <Divider my="xs" />
                    </React.Fragment>
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
                      color='var( --theme-remove-color)'
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
                      {!formSubmitted && (
                        <Button
                          variant="transparent"
                          size="xs"
                          color="red.4"
                          type="reset"
                          id=""
                          p={0}
                          onClick={() => {
                            splitPaymentForm.reset();
                            setRemainingAmount(salesDueAmount);
                          }}
                          rightSection={
                            <IconRefreshDot
                              style={{ width: "100%", height: "60%" }}
                              stroke={1.5}
                            />
                          }
                        ></Button>
                      )}
                    </Flex>
                    <Stack align="flex-start">
                      <>
                        {!formSubmitted && (
                          <Button
                            disabled={saveDisabled}
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
                        {formSubmitted && (
                          <Button
                            size="xs"
                            color="blue.6"
                            onClick={closeDrawer}
                          >
                            <Text fz={14} fw={400}>
                              {t("Close")}
                            </Text>
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
