import React, { useState, useEffect, useRef } from "react";
import {
  Stack,
  Box,
  Button,
  Grid,
  Title,
  Text,
  Flex,
  ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { IconDeviceFloppy, IconCalendar } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import _SelectForm from "../../../../form-builders/_SelectForm";
import _InputForm from "../../../../form-builders/_InputForm";
import InputNumberForm from "../../../../form-builders/InputNumberForm";

export default function ContraVoucherForm(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 174;
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [ledgerHead, setLedgerHead] = useState("");
  const [paymentMode2, setPaymentMode2] = useState("");
  const [nextField, setNextField] = useState("amount");

  const voucherForm = useForm({
    initialValues: {
      payment_mode: "",
      ledger_head: "",
      cheque_no: "",
      bank_name: "",
      branch_name: "",
      received_from: "",
      amount: "",
      narration: "",
      pay_mode: "",
    },
    validate: {
      amount: (value) => (value ? null : "Amount is required"),
      ledger_head: isNotEmpty(),
      payment_mode: isNotEmpty(),
    },
  });

  const paymentModeData = ["Debit", "Credit"];
  const paymentModeData2 = ["Cheque", "Cash", "Transfer"];
  const categorizedOptions = [
    {
      group: t("Arms&Ammunition"),
      items: [
        { value: "arms_ammunition_32", label: ".32 Bore Cartridges" },
        { value: "arms_ammunition_7", label: "7 mm Cartridges" },
      ],
    },
    {
      group: t("AccountReceivable"),
      items: [
        {
          value: "account_receivable_asian",
          label: "15th Asian Airgun Championship, Daegu Korea",
        },
        {
          value: "account_receivable_shooting",
          label: "15th Asian Shooting Championship, Korea 2023",
        },
      ],
    },
    {
      group: t("BankAccount"),
      items: [
        {
          value: "bank_account_sonali",
          label: "Sonali Bank, Gulshan Branch (00115633005315)",
        },
        { value: "bank_account_agrani", label: "Agrani Bank" },
      ],
    },
  ];

  const amountInputRef = useRef(null);
  const chequeNoInputRef = useRef(null);
  const payModeInputRef = useRef(null);

  useEffect(() => {
    if (ledgerHead && ledgerHead.startsWith("bank_account")) {
      chequeNoInputRef.current?.focus();
    }
  }, [ledgerHead]);

  useEffect(() => {
    if (nextField === "pay_mode" && payModeInputRef.current) {
      payModeInputRef.current.focus();
    } else if (nextField === "amount" && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [nextField]);

  const handleLedgerHeadChange = (value) => {
    voucherForm.setFieldValue("ledger_head", value);
    setLedgerHead(value);
    setPaymentMode2("");
    if (value && value.startsWith("bank_account")) {
      setNextField("cheque_no");
    } else {
      setNextField("amount");
    }
  };

  return (
    <Box>
      <form
        id="voucherForm"
        onSubmit={voucherForm.onSubmit((values) => {
          console.log("Form submitted with values:", values);
        })}
      >
        <Box p={"xs"} pt={"0"} className={"borderRadiusAll"}>
          <Box
            pl={`xs`}
            pr={8}
            pt={"6"}
            pb={"6"}
            mb={"4"}
            mt={"xs"}
            className={"boxBackground borderRadiusAll"}
          >
            <Grid>
              <Grid.Col span={9}>
                <Title order={6} pl={"6"}>
                  {t("CreateContraVoucher")}
                </Title>
              </Grid.Col>
            </Grid>
          </Box>
          <Box bg={"white"}>
            <Box pl={"xs"} pr={"xs"} className={"borderRadiusAll"}>
              <Grid columns={24}>
                <Grid.Col span={"auto"}>
                  <ScrollArea
                    h={height - 13}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                    pb={"xs"}
                  >
                    <Box></Box>
                  </ScrollArea>
                </Grid.Col>
              </Grid>
            </Box>
          </Box>
          <Box
            mt={4}
            pl={`xs`}
            pr={8}
            pt={"xs"}
            pb={"6"}
            mb={"4"}
            className={"boxBackground borderRadiusAll"}
          >
            <Grid>
              <Grid.Col span={8}>
                <InputNumberForm
                  tooltip={t("Amount")}
                  label={t("")}
                  placeholder={t("Amount")}
                  required={true}
                  nextField={"EntityFormSubmit"}
                  name={"amount"}
                  form={voucherForm}
                  id={"amount"}
                  ref={amountInputRef}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack right align="flex-end">
                  {!saveCreateLoading && isOnline && (
                    <Button
                      mt={4}
                      size="xs"
                      color={"green.8"}
                      type="submit"
                      form="voucherForm"
                      id="voucherFormSubmit"
                      leftSection={<IconDeviceFloppy size={16} />}
                    >
                      <Flex direction={"column"} gap={0}>
                        <Text fz={14} fw={400}>
                          {t("AddVoucher")}
                        </Text>
                      </Flex>
                    </Button>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
