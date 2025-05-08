import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ActionIcon,
  Box,
  ScrollArea,
  Drawer,
  Text,
  Flex,
  Grid,
  Button,
  Title,
  Stack,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconX,
  IconDeviceFloppy,
  IconSortAscendingNumbers,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { useForm, isNotEmpty } from "@mantine/form";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import _SelectForm from "../../../../components/form-builders/_SelectForm";
import _InputForm from "../../../../components/form-builders/_InputForm";
import InputForm from "../../../form-builders/InputForm";

function BankDrawer(props) {
  const {
    bankDrawer,
    setBankDrawer,
    module,
    setLoadVoucher,
    sourceForm,
    entryType,
  } = props;
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t } = useTranslation();
  const height = mainAreaHeight - 100;
  const dispatch = useDispatch();

  // Add refs for form inputs
  const chequeNoInputRef = useRef(null);
  const payModeInputRef = useRef(null);

  // Add state for payment mode
  const [paymentMode2, setPaymentMode2] = useState("");

  // Payment mode dropdown data
  const paymentModeData2 = [
    { value: "cash", label: t("Cash") },
    { value: "cheque", label: t("Cheque") },
    { value: "bank_transfer", label: t("BankTransfer") },
  ];

  const closeDrawer = () => {
    setBankDrawer(false);
  };

  const bankForm = useForm({
    initialValues: {
      cheque_no: "",
      amount: "",
      pay_mode: "",
      bank_name: "",
      branch_name: "",
      received_from: "",
    },
    validate: {
      amount: isNotEmpty(),
      cheque_no: isNotEmpty(),
    },
  });

  const showNotificationComponent = (message, color) => {
    showNotification({
      title: message,
      color: color,
    });
  };

  const handleSalesFormSubmit = (values) => {
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => handleSalesConfirmSubmit(values),
    });
  };

  const handleSalesConfirmSubmit = async (values) => {
    try {
      if (sourceForm === "customerVoucher") {
        // Add a new DR entry for customer voucher
        const storedVouchers =
          JSON.parse(localStorage.getItem("vouchers-entry-form")) || [];
        storedVouchers.push({
          name: entryType,
          debit: values.amount,
          credit: 0,
          mode: "DR",
          to: values.bank_name,
          cheque_no: values.cheque_no,
          pay_mode: values.pay_mode,
          bank_name: values.bank_name,
          branch_name: values.branch_name,
          received_from: values.received_from,
        });
        localStorage.setItem(
          "vouchers-entry-form",
          JSON.stringify(storedVouchers)
        );
        showNotificationComponent(t("UpdateSuccessfully"), "teal");
        setLoadVoucher(true);
        closeDrawer();
        return;
      }

      // For main (CR) entries, update existing
      const storageKey =
        sourceForm === "customerVoucher"
          ? "vouchers-entry-form"
          : "vouchers-entry";
      const storedVouchers = JSON.parse(localStorage.getItem(storageKey)) || [];

      const updatedVouchers = storedVouchers.map((voucher) => {
        if (voucher && voucher.name && voucher.name === entryType) {
          return {
            ...voucher,
            credit:
              entryType &&
              entryType.startsWith("bank_account_") &&
              voucher.mode === "CR"
                ? values.amount
                : voucher.credit,
            debit:
              entryType &&
              entryType.startsWith("bank_account_") &&
              voucher.mode === "DR"
                ? values.amount
                : voucher.debit,
            cheque_no: values.cheque_no,
            pay_mode: values.pay_mode,
            bank_name: values.bank_name,
            branch_name: values.branch_name,
            received_from: values.received_from,
          };
        }
        return voucher;
      });

      localStorage.setItem(storageKey, JSON.stringify(updatedVouchers));
      showNotificationComponent(t("UpdateSuccessfully"), "teal");
      setLoadVoucher(true);
      closeDrawer();
    } catch (err) {
      console.error(err);
      showNotificationComponent(t("UpdateFailed"), "red");
    }
  };

  return (
    <>
      <Drawer.Root
        opened={bankDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollArea h={height + 190} scrollbarSize={2} type="never">
            <Flex
              mih={40}
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                mr={"sm"}
                radius="xl"
                color="grey.6"
                size="md"
                variant="outline"
                onClick={closeDrawer}
              >
                <IconX style={{ width: "80%", height: "80%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>
            <Box bg={"white"} className={"borderRadiusAll"} mb={"8"} mt={2}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"3"}
                  pb={"3"}
                  mb={"4"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <Title order={6} pt={"4"}>
                        {t(module)}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack align="flex-end">
                        {isOnline && (
                          <Button
                            size="xs"
                            className={"btnPrimaryBg"}
                            id="EntityBankFormSubmit"
                            leftSection={<IconDeviceFloppy size={16} />}
                            onClick={() =>
                              bankForm.onSubmit(handleSalesFormSubmit)()
                            }
                          >
                            <Text fz={14} fw={400}>
                              {t("UpdateAndSave")}
                            </Text>
                          </Button>
                        )}
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Box>
                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                  <ScrollArea
                    h={height + 71}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                  >
                    <form onSubmit={bankForm.onSubmit(handleSalesFormSubmit)}>
                      <Box>
                        <Box mt={"xs"}>
                          <InputForm
                            tooltip={t("ChequeNo")}
                            label={t("ChequeNo")}
                            placeholder={t("ChequeNo")}
                            required={true}
                            nextField={"amount"}
                            name={"cheque_no"}
                            form={bankForm}
                            mt={0}
                            id={"cheque_no"}
                            type="number"
                            leftSection={
                              <IconSortAscendingNumbers
                                size={16}
                                opacity={0.5}
                              />
                            }
                          />
                        </Box>
                        <Box mt={"xs"}>
                          <InputForm
                            tooltip={t("Amount")}
                            label={t("Amount")}
                            placeholder={t("Amount")}
                            required={true}
                            nextField={"pay_mode"}
                            name={"amount"}
                            form={bankForm}
                            mt={0}
                            id={"amount"}
                            type="number"
                            leftSection={
                              <IconSortAscendingNumbers
                                size={16}
                                opacity={0.5}
                              />
                            }
                          />
                        </Box>
                        <Box mt={"xs"}>
                          <_SelectForm
                            tooltip={t("PaymentMode")}
                            label={t("PaymentMode")}
                            placeholder={t("ChoosePaymentMode")}
                            required={true}
                            nextField={"bank_name"}
                            name={"pay_mode"}
                            form={bankForm}
                            dropdownValue={paymentModeData2}
                            mt={8}
                            id={"pay_mode"}
                            searchable={false}
                            value={paymentMode2}
                            changeValue={(value) => {
                              setPaymentMode2(value);
                              bankForm.setFieldValue("pay_mode", value);
                            }}
                            ref={payModeInputRef}
                          />
                        </Box>
                        <Box mt={"xs"}>
                          <_InputForm
                            tooltip={t("BankName")}
                            label={t("BankName")}
                            placeholder={t("BankName")}
                            required={true}
                            nextField={"branch_name"}
                            name={"bank_name"}
                            form={bankForm}
                            mt={0}
                            id={"bank_name"}
                          />
                        </Box>
                        <Box mt={"xs"}>
                          <_InputForm
                            tooltip={t("BranchName")}
                            label={t("BranchName")}
                            placeholder={t("BranchName")}
                            required={true}
                            nextField={"received_from"}
                            name={"branch_name"}
                            form={bankForm}
                            mt={0}
                            id={"branch_name"}
                          />
                        </Box>
                        <Box mt={"xs"}>
                          <_InputForm
                            tooltip={t("ReceivedFrom")}
                            label={t("ReceivedFrom")}
                            placeholder={t("ReceivedFrom")}
                            required={true}
                            nextField={"EntityBankFormSubmit"}
                            name={"received_from"}
                            form={bankForm}
                            mt={0}
                            id={"received_from"}
                          />
                        </Box>
                      </Box>
                    </form>
                  </ScrollArea>
                </Box>
              </Box>
            </Box>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default BankDrawer;
