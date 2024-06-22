import React, { useState, useEffect, useRef } from "react";
import {
    Stack,
    Box,
    Button,
    Grid,
    Title,
    Text,
    Flex,
    Textarea,
    Select,
    TextInput,
    ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import SelectForm from "../../../form-builders/SelectForm";

export default function Dummm(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 215;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [paymentMode, setPaymentMode] = useState("");
    const [ledgerHead, setLedgerHead] = useState("");
    const [paymentMode2, setPaymentMode2] = useState("");
    const [chequeDate, setChequeDate] = useState(null);
    const [nextField, setNextField] = useState("amount"); // Default nextField

    const form = useForm({
        initialValues: {
            payment_mode: "",
            ledger_head: "",
            cheque_no: "",
            chequeDate: null,
            bankName: "",
            branchName: "",
            receivedFrom: "",
            amount: "",
            narration: "",
        },
        validate: {
            amount: (value) => (value ? null : "Amount is required"),
            narration: (value) => (value ? null : "Narration is required"),
        },
    });

    const paymentModeData = ["Debit", "Credit"];
    const paymentModeData2 = ["Cheque", "Cash", "Transfer"];

    const categorizedOptions = [
        {
            group: "Arms & Ammunition",
            items: [
                { value: "arms_ammunition_32", label: ".32 Bore Cartridges" },
                { value: "arms_ammunition_7", label: "7 mm Cartridges" },
            ],
        },
        {
            group: "Account Receivable",
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
            group: "Bank Account",
            items: [
                {
                    value: "bank_account_sonali",
                    label: "Sonali Bank, Gulshan Branch (00115633005315)",
                },
                { value: "bank_account_agran", label: "Agran Bank" },
            ],
        },
    ];

    const amountInputRef = useRef(null);
    const chequeNoInputRef = useRef(null);
    const paymentMode2InputRef = useRef(null);

    useEffect(() => {
        if (ledgerHead.startsWith("bank_account")) {
            chequeNoInputRef.current?.focus();
        } else {
            amountInputRef.current?.focus();
        }
    }, [ledgerHead]);

    useEffect(() => {
        let nextField = "amount";
        if (ledgerHead.startsWith("bank_account")) {
            nextField = "_payment_mode";
        }
        setNextField(nextField);
    }, [ledgerHead, paymentMode2]);

    const handleLedgerHeadChange = (value) => {
        form.setFieldValue("ledger_head", value);
        setLedgerHead(value);
        setPaymentMode2("");
    };

    return (
        <Box>
            <form
                onSubmit={form.onSubmit((values) => {
                    console.log(values);
                })}
            >
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <Box bg={"white"}>
                        <Box
                            pl={"xs"}
                            pb={"xs"}
                            pr={8}
                            pt={"xs"}
                            mb={"xs"}
                            className={"boxBackground borderRadiusAll"}
                        >
                            <Grid>
                                <Grid.Col span={6} h={54}>
                                    <Title order={6} mt={"xs"} pl={"6"}>
                                        {t("CreateNewVoucher")}
                                    </Title>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Stack right align="flex-end">
                                        {!saveCreateLoading && isOnline && (
                                            <Button
                                                size="xs"
                                                color={"red.6"}
                                                type="submit"
                                                mt={4}
                                                id="EntityFormSubmit"
                                                leftSection={<IconDeviceFloppy size={16} />}
                                            >
                                                <Flex direction={'column'} gap={0}>
                                                    <Text fz={12} fw={400}>
                                                        {t("AddVoucher")}
                                                    </Text>
                                                </Flex>
                                            </Button>
                                        )}
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Box pl={"xs"} pr={"xs"} mt={"xs"} className={"borderRadiusAll"}>
                            <Grid columns={24}>
                                <Grid.Col span={"auto"}>
                                    <ScrollArea
                                        h={height + 33}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                        pb={"xs"}
                                    >
                                        <Box>
                                            <Box mt={"xs"}>
                                                <SelectForm
                                                    tooltip={t("PaymentMode")}
                                                    label={t("PaymentMode")}
                                                    placeholder={t("ChoosePaymentMode")}
                                                    required={true}
                                                    nextField={"ledger_head"}
                                                    name={"payment_mode"}
                                                    form={form}
                                                    dropdownValue={paymentModeData}
                                                    mt={8}
                                                    id={"payment_mode"}
                                                    searchable={false}
                                                    value={paymentMode}
                                                    changeValue={setPaymentMode}
                                                />
                                            </Box>
                                            <Box mt={"xs"}>
                                                <SelectForm
                                                    tooltip={t("LedgerHead")}
                                                    label={t("LedgerHead")}
                                                    placeholder={t("ChooseLedgerHead")}
                                                    required={true}
                                                    nextField={nextField}
                                                    name={"ledger_head"}
                                                    form={form}
                                                    dropdownValue={categorizedOptions}
                                                    mt={8}
                                                    id={"ledger_head"}
                                                    searchable={true}
                                                    value={ledgerHead}
                                                    changeValue={handleLedgerHeadChange}
                                                />
                                            </Box>
                                            {ledgerHead && ledgerHead.startsWith("bank_account") && (
                                                <>
                                                    <Box mt={"xs"}>
                                                        <SelectForm
                                                            tooltip={t("PaymentMode")}
                                                            label={t("PaymentMode")}
                                                            placeholder={t("ChoosePaymentMode")}
                                                            required={true}
                                                            nextField={''}
                                                            name={"_payment_mode"}
                                                            form={form}
                                                            dropdownValue={paymentModeData2}
                                                            mt={8}
                                                            id={"_payment_mode"}
                                                            searchable={false}
                                                            value={paymentMode2}
                                                            changeValue={setPaymentMode2}
                                                        />
                                                    </Box>
                                                    <TextInput
                                                        name="cheque_no"
                                                        label="Cheque No"
                                                        placeholder="Cheque no"
                                                        required
                                                        ref={chequeNoInputRef}
                                                    />

                                                    <TextInput
                                                        label="Bank Name"
                                                        placeholder="Bank Name"
                                                        required
                                                    />
                                                    <TextInput
                                                        label="Branch Name"
                                                        placeholder="Branch Name"
                                                        required
                                                    />
                                                    <TextInput
                                                        label="Received From"
                                                        placeholder="Received From"
                                                        required
                                                    />
                                                </>
                                            )}
                                            {!ledgerHead.startsWith("bank_account") && (
                                                <>
                                                    <TextInput
                                                        label="Amount"
                                                        name="amount"
                                                        id="amount"
                                                        placeholder="Enter amount"
                                                        required
                                                        {...form.getInputProps("amount")}
                                                        ref={amountInputRef}
                                                    />
                                                </>
                                            )}
                                            <Textarea
                                                label="Narration"
                                                placeholder="Enter narration"
                                                required
                                                {...form.getInputProps("narration")}
                                            />
                                        </Box>
                                    </ScrollArea>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}