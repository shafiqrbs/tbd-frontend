import React, {useState, useRef, useEffect} from "react";
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
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import {IconDeviceFloppy} from "@tabler/icons-react";
import {useForm} from "@mantine/form";

import SelectForm from "../../../../form-builders/SelectForm";
import InputNumberForm from "../../../../form-builders/InputNumberForm";
import BankDrawer from "../../common/BankDrawer";
import {showNotificationComponent} from "../../../../core-component/showNotificationComponent.jsx";

export default function BranchCustomerVoucherForm(props) {
    const {
        secondaryLedgerHeadDropdownData,
        loadMyItemsFromStorage,
        primaryLedgerHeadObject,
        activeVoucher,
        secondaryLedgerHead,
        setSecondaryLedgerHead,
    } = props;

    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 140;

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [ledgerHeadObject, setLedgerHeadObject] = useState(null);
    const [bankDrawer, setBankDrawer] = useState(false);
    const [bankInfo, setBankInfo] = useState({});
    const [bankInfoSubmitPending, setBankInfoSubmitPending] = useState(false);

    const amountInputRef = useRef(null);

    const voucherForm = useForm({
        initialValues: {amount: "", ledger_head: null},
        validate: {
            ledger_head: (value) => (value ? null : t("SelectSecendoryLedger")),
            amount: (value) => (value ? null : t("AmountIsRequired")),
        },
    });

    // Set ledger head object based on selected dropdown
    useEffect(() => {
        if (secondaryLedgerHead && secondaryLedgerHeadDropdownData.length > 0) {
            const selected = activeVoucher?.ledger_account_head_secondary
                ?.reduce((acc, group) => {
                    if (Array.isArray(group?.child_account_heads)) {
                        return [...acc, ...group.child_account_heads];
                    }
                    return acc;
                }, [])
                ?.find((x) => x.id == secondaryLedgerHead);

            setLedgerHeadObject(selected || null);
        }
    }, [secondaryLedgerHead, secondaryLedgerHeadDropdownData]);

    const getParentLedgerSlugWithDetails = (id) => {
        const topLevelAccounts = activeVoucher?.ledger_account_head_secondary.filter(
            (item) => !item.pivot?.secondary_account_head_id || item.id === id
        );
        const parentLedgerSlug = topLevelAccounts?.[0]?.slug || null;
        return {parentLedgerSlug, response: null};
    };

    // Open or close bank drawer depending on ledger account parent
    useEffect(() => {
        let isMounted = true;

        const fetchLedgerTypeAndSetUI = async () => {
            try {
                if (ledgerHeadObject?.parent_id && secondaryLedgerHead) {
                    const {parentLedgerSlug} = getParentLedgerSlugWithDetails(ledgerHeadObject.parent_id);
                    if (isMounted) {
                        if (parentLedgerSlug === "bank-account") {
                            setBankDrawer(true);
                            setBankInfo(null);
                            setBankInfoSubmitPending(true);
                        } else {
                            setBankDrawer(false);
                        }
                    }
                } else {
                    if (isMounted) setBankDrawer(false);
                }
            } catch (error) {
                console.error("Error fetching parent ledger slug:", error);
                if (isMounted) setBankDrawer(false);
            }
        };

        const timeoutId = setTimeout(fetchLedgerTypeAndSetUI, 300);

        return () => {
            clearTimeout(timeoutId);
            isMounted = false;
        };
    }, [ledgerHeadObject?.parent_id, secondaryLedgerHead]);

    const handleBankInfoSubmit = (info) => {
        setBankDrawer(false);
        setBankInfo(info);

        if (!secondaryLedgerHead) {
            showNotificationComponent(t("LedgerHeadAmountarerequired."), "red")
            return;
        }

        if (!primaryLedgerHeadObject) {
            showNotificationComponent(t("PleaseSelectCREntryFirst"), "red")
            return;
        }

        const {parentLedgerSlug} = getParentLedgerSlugWithDetails(ledgerHeadObject?.parent_id);
        let isFormSubmit = false;

        if (parentLedgerSlug === "bank-account") {
            if (info && typeof info === "object" && Object.keys(info).length > 0) {
                isFormSubmit = true;
            } else {
                showNotificationComponent("Bank information is empty", "red");
                return;
            }
        } else {
            isFormSubmit = true;
        }

        // Proceed to add to storage
        if (isFormSubmit) {
            handleAddProductByProductId("ledger", info.amount, info);
        }
    };

    const handleSubmit = async (values) => {

        if (!primaryLedgerHeadObject) {
            showNotificationComponent(t("PleaseSelectCREntryFirst"), "red")
            return;
        }

        const {parentLedgerSlug} = getParentLedgerSlugWithDetails(ledgerHeadObject?.parent_id);
        let isFormSubmit = false;

        if (parentLedgerSlug === "bank-account") {
            if (bankInfo && typeof bankInfo === "object" && Object.keys(bankInfo || {}).length > 0) {
                isFormSubmit = true;
            } else {
                showNotificationComponent("Bank information is empty", "red");
                return;
            }
        } else {
            isFormSubmit = true;
        }

        // Proceed to add to storage
        if (isFormSubmit) {
            handleAddProductByProductId("ledger", values.amount, bankInfo);
        }
    };

    const handleAddProductByProductId = (type, amount = 0, bankInfo = {}) => {
        const cardProducts = localStorage.getItem("temp-branch-voucher-entry");
        let items = cardProducts ? JSON.parse(cardProducts) : [];

        const mode = activeVoucher?.mode === "credit" ? "debit" : "credit";
        const targetId = secondaryLedgerHead;

        const existingIndex = items.findIndex(
            (item) => item.id === targetId && item.type === type
        );

        if (existingIndex !== -1) {
            items[existingIndex].debit = mode === "debit" ? amount : 0;
            items[existingIndex].credit = mode === "credit" ? amount : 0;
            if (Object.keys(bankInfo || {}).length > 0) {
                items[existingIndex].bankInfo = {
                    ...(items[existingIndex].bankInfo || {}),
                    ...bankInfo,
                };
            }
        } else {
            items.push({
                id: targetId,
                mode,
                ledger_name: ledgerHeadObject?.display_name || "",
                account_head: ledgerHeadObject?.display_name || "",
                debit: mode === "debit" ? amount : 0,
                credit: mode === "credit" ? amount : 0,
                type,
                ...(Object.keys(bankInfo || {}).length > 0 ? {bankInfo} : {}),
            });
        }

        // Balance the first row automatically
        const restItems = items.slice(1);
        const totals = restItems.reduce(
            (acc, item) => {
                acc.debit += Number(item.debit) || 0;
                acc.credit += Number(item.credit) || 0;
                return acc;
            },
            {debit: 0, credit: 0}
        );

        const diff = totals.debit - totals.credit;

        if (items.length > 0) {
            if (diff > 0) {
                items[0].credit = diff;
                items[0].debit = 0;
            } else if (diff < 0) {
                items[0].debit = Math.abs(diff);
                items[0].credit = 0;
            } else {
                items[0].debit = 0;
                items[0].credit = 0;
            }
        }

        updateLocalStorageAndResetForm(items, type);
    };

    const updateLocalStorageAndResetForm = (data, type) => {
        localStorage.setItem("temp-branch-voucher-entry", JSON.stringify(data));
        voucherForm.reset();
        setSecondaryLedgerHead(null);
        setLedgerHeadObject(null);
        loadMyItemsFromStorage();
    };

    return (
        <Box>
            <form id="voucherForm" onSubmit={voucherForm.onSubmit(handleSubmit)}>
                <Box p="xs" pt={0} >
                    <Grid columns={18}>
                        <Grid.Col span={10}>
                            <SelectForm
                                tooltip={t("LedgerHead")}
                                placeholder={t("ChooseLedgerHead")}
                                required
                                disabled={primaryLedgerHeadObject ? false : true}
                                nextField="amount"
                                name="ledger_head"
                                form={voucherForm}
                                dropdownValue={secondaryLedgerHeadDropdownData}
                                id="ledger_head"
                                searchable
                                value={secondaryLedgerHead}
                                changeValue={setSecondaryLedgerHead}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <InputNumberForm
                                tooltip={t("Amount")}
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
                                        color="blue.8"
                                        type="submit"
                                        leftSection={<IconDeviceFloppy size={16}/>}
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
            </form>

            {bankDrawer && (
                <BankDrawer
                    bankDrawer={bankDrawer}
                    setBankDrawer={setBankDrawer}
                    module="Bank Information"
                    setLoadVoucher={() => {
                    }}
                    sourceForm="customerVoucher"
                    entryType={activeVoucher.mode === "debit" ? "credit" : "debit"}
                    onSubmit={handleBankInfoSubmit}
                />
            )}
        </Box>
    );
}
