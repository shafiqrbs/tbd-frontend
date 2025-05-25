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
  const {
    ledgerHeadDropdownData,
    loadMyItemsFromStorage,
    mainLedgerHeadObject,
    activeVoucher,
    ledgerHead,
    setLedgerHead,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();

  const height = mainAreaHeight - 174;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
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
      amount: (value) => (value ? null : t("AmountIsRequired")),
    },
  });

  // Handle dropdown selection
  const handleLedgerHeadChange = (value) => {
    const selected = activeVoucher?.ledger_account_head_secondary
        ?.reduce((acc, group) => {
          if (Array.isArray(group?.child_account_heads)) {
            return [...acc, ...group.child_account_heads];
          }
          return acc;
        }, [])
        ?.find((x) => x.id == value);

    setLedgerHead(value);
    setLedgerHeadObject(selected || null);
  };

  // Submit handler
  const handleSubmit = (values) => {
    if (!ledgerHead || !values.amount) {
      showNotification({
        title: t("ValidationError"),
        message: t("LedgerHeadAmountarerequired."),
        color: "red",
      });
      return;
    }

    if (!mainLedgerHeadObject) {
      showNotification({
        title: t("MissingEntry"),
        message: t("PleaseSelectCREntryFirst"),
        color: "red",
      });
      return;
    }

    handleAddProductByProductId("ledger", values.amount);
  };

  // Add ledger entry (or update) in localStorage
  const handleAddProductByProductId = (addedType, amount) => {
    const cardProducts = localStorage.getItem("temp-voucher-entry");
    let myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];

    const mode = activeVoucher?.mode === "credit" ? "debit" : "credit";
    const targetId = ledgerHead;

    // Clone data
    const updatedProducts = [...myCardProducts];

    // Check if the item already exists
    const existingIndex = updatedProducts.findIndex(
        (item) => item.id === targetId && item.type === addedType
    );

    if (existingIndex !== -1) {
      updatedProducts[existingIndex].debit = mode === "debit" ? amount : 0;
      updatedProducts[existingIndex].credit = mode === "credit" ? amount : 0;
    } else {
      updatedProducts.push({
        id: targetId,
        mode,
        ledger_name: ledgerHeadObject?.display_name || "",
        account_head: ledgerHeadObject?.display_name || "",
        debit: mode === "debit" ? amount : 0,
        credit: mode === "credit" ? amount : 0,
        type: addedType,
      });
    }

    // ⚖ Auto-balance first row (index 0)
    const restItems = updatedProducts.slice(1);
    const totals = restItems.reduce(
        (acc, item) => {
          acc.debit += Number(item.debit) || 0;
          acc.credit += Number(item.credit) || 0;
          return acc;
        },
        { debit: 0, credit: 0 }
    );

    const diff = totals.debit - totals.credit;

    // Adjust first row
    if (updatedProducts.length > 0) {
      if (diff > 0) {
        updatedProducts[0].credit = diff;
        updatedProducts[0].debit = 0;
      } else if (diff < 0) {
        updatedProducts[0].debit = Math.abs(diff);
        updatedProducts[0].credit = 0;
      } else {
        updatedProducts[0].debit = 0;
        updatedProducts[0].credit = 0;
      }
    }

    updateLocalStorageAndResetForm(updatedProducts, addedType);
  };

  // Final save
  const updateLocalStorageAndResetForm = (data, type) => {
    localStorage.setItem("temp-voucher-entry", JSON.stringify(data));
    voucherForm.reset();
    setLedgerHead(null);
    setLedgerHeadObject(null);
    loadMyItemsFromStorage();
  };

  return (
      <Box>
        <form id="voucherForm" onSubmit={voucherForm.onSubmit(handleSubmit)}>
          <Box p="xs" pt={0} className="borderRadiusAll">
            {/* Top label header */}
            <Box
                pl="xs"
                pr={8}
                pt={6}
                pb={6}
                mb={4}
                mt="xs"
                className="boxBackground borderRadiusAll"
            >
              <Grid>
                <Grid.Col span={9}>
                  <Title order={6} pl={6}>
                    {t("AddLedgerHead")}
                  </Title>
                </Grid.Col>
              </Grid>
            </Box>

            <Box bg="white" pl="xs" pr="xs" className="borderRadiusAll">
              <Grid columns={24}>
                <Grid.Col span="auto">
                  <ScrollArea
                      h={height - 158}
                      scrollbarSize={2}
                      scrollbars="y"
                      type="never"
                      pb="xs"
                  >
                    <Box mt="xs">
                      <SelectForm
                          tooltip={t("LedgerHead")}
                          label=""
                          placeholder={t("ChooseLedgerHead")}
                          required
                          nextField="amount"
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

            {/* Amount Entry and Add Button */}
            <Box
                mt={4}
                pl="xs"
                pr={8}
                pt="xs"
                pb={6}
                mb={4}
                className="boxBackground borderRadiusAll"
            >
              <Grid>
                <Grid.Col span={8}>
                  <InputNumberForm
                      tooltip={t("Amount")}
                      label=""
                      placeholder={t("Amount")}
                      required
                      nextField="voucherFormSubmit"
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
                            leftSection={<IconDeviceFloppy size={16} />}
                            id="voucherFormSubmit"
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
