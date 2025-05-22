


import React, { useState, useRef } from "react";
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
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import SelectForm from "../../../../form-builders/SelectForm";
import InputNumberForm from "../../../../form-builders/InputNumberForm";
import BankDrawer from "../../common/BankDrawer";

export default function CustomerVoucherForm(props) {
  // Props passed from parent
  const {
    ledgerHeadDropdownData,
    loadMyItemsFromStorage,
    mainLedgerHeadObject,
    activeVoucher,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 174;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [ledgerHead, setLedgerHead] = useState("");
  const [ledgerHeadObject, setLedgerHeadObject] = useState(null);
  const [bankDrawer, setBankDrawer] = useState(false);
  const [loadVoucher, setLoadVoucher] = useState(false);
  const amountInputRef = useRef(null);

  // Form
  const voucherForm = useForm({
    initialValues: {
      amount: "",
    },
    validate: {
      amount: (value) => (value ? null : "Amount is required"),
    },
  });

  // Handle dropdown change
  const handleLedgerHeadChange = (value) => {
    const ledgerObject = activeVoucher?.ledger_account_head?.find(
        (item) => item.id == value
    );
    setLedgerHead(value);
    setLedgerHeadObject(ledgerObject || null);
  };

  // Handle form submit
  const handleSubmit = (values) => {
    if (!ledgerHead || !values.amount) {
      showNotification({
        title: t("Validation Error"),
        message: t("LedgerHead & Amount are required."),
        color: "red",
      });
      return;
    }

    if (!mainLedgerHeadObject) {
      showNotification({
        title: t("Missing Entry"),
        message: t("PleaseSelectCREntryFirst"),
        color: "red",
      });
      return;
    }

    handleAddProductByProductId("ledger", values.amount);
  };

  // Add new item
  const handleAddProductByProductId = (addedType, amount) => {
    const cardProducts = localStorage.getItem("temp-voucher-entry");
    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];

    // Determine DR or CR
    const mode = activeVoucher?.mode === "credit" ?"debit":"credit";

    const newItem = {
      id: ledgerHead,
      mode: mode,
      ledger_name: ledgerHeadObject?.display_name || "",
      account_head: ledgerHeadObject?.display_name || "",
      debit: mode === "debit" ? amount : 0,
      credit: mode === "credit" ? amount : 0,
    };

    const updatedData = [...myCardProducts, newItem];
    updateLocalStorageAndResetForm(updatedData, addedType);
  };

  // Update localStorage and reset form
  const updateLocalStorageAndResetForm = (addProducts, addedType) => {
    localStorage.setItem("temp-voucher-entry", JSON.stringify(addProducts));
    voucherForm.reset(); // clear amount
    setLedgerHead(null); // clear ledger dropdown
    setLedgerHeadObject(null); // reset selected object
    loadMyItemsFromStorage(); // refresh data table via parent
  };

  return (
      <Box>
        <form id="voucherForm" onSubmit={voucherForm.onSubmit(handleSubmit)}>
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
                    {t("AddLedgerHead")}
                  </Title>
                </Grid.Col>
              </Grid>
            </Box>

            <Box bg={"white"}>
              <Box pl={"xs"} pr={"xs"} className={"borderRadiusAll"}>
                <Grid columns={24}>
                  <Grid.Col span={"auto"}>
                    <ScrollArea
                        h={height - 158}
                        scrollbarSize={2}
                        scrollbars="y"
                        type="never"
                        pb={"xs"}
                    >
                      <Box mt={"xs"}>
                        <SelectForm
                            tooltip={t("LedgerHead")}
                            label=""
                            placeholder={t("ChooseLedgerHead")}
                            required
                            nextField={"amount"}
                            name="ledger_head"
                            form={voucherForm}
                            dropdownValue={ledgerHeadDropdownData}
                            mt={8}
                            id="ledger_head"
                            searchable
                            value={ledgerHead}
                            changeValue={handleLedgerHeadChange}
                        />
                      </Box>
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
                      label=""
                      placeholder={t("Amount")}
                      required
                      nextField="EntityFormSubmit"
                      name="amount"
                      form={voucherForm}
                      id="amount"
                      ref={amountInputRef}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack justify="flex-end" align="flex-end">
                    {!saveCreateLoading && isOnline && (
                        <Button
                            mt={2}
                            size="xs"
                            color="green.8"
                            type="submit"
                            form="voucherForm"
                            id="voucherFormSubmit"
                            leftSection={<IconDeviceFloppy size={16} />}
                        >
                          <Flex direction="column" gap={0}>
                            <Text fz={14} fw={400}>
                              {t("AddLedger")}
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

        {/* Optional: Show bank modal interaction */}
        {bankDrawer && (
            <BankDrawer
                bankDrawer={bankDrawer}
                setBankDrawer={setBankDrawer}
                module="CustomerVoucher"
                setLoadVoucher={setLoadVoucher}
                sourceForm="customerVoucher"
                entryType="cash"
            />
        )}
      </Box>
  );
}
