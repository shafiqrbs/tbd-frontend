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
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import SelectForm from "../../../form-builders/SelectForm";
import _SelectForm from "../../../form-builders/_SelectForm";
import _InputForm from "../../../form-builders/_InputForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

export default function VoucherFormSection(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 215;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [paymentMode, setPaymentMode] = useState("");
    const [ledgerHead, setLedgerHead] = useState("");
    const [paymentMode2, setPaymentMode2] = useState("");
    const [nextField, setNextField] = useState("amount");

    const form = useForm({
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
            narration: (value) => (value ? null : "Narration is required"),
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
        form.setFieldValue("ledger_head", value);
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
                                                    changeValue={(value) => {
                                                        setPaymentMode(value);
                                                        form.setFieldValue("payment_mode", value);
                                                    }}
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
                                                    <Box mt={'xs'}>
                                                        <_InputForm
                                                            tooltip={t('ChequeNo')}
                                                            label={t('ChequeNo')}
                                                            placeholder={t('ChequeNo')}
                                                            required={true}
                                                            nextField={'pay_mode'}
                                                            name={'cheque_no'}
                                                            form={form}
                                                            mt={0}
                                                            id={'cheque_no'}
                                                            ref={chequeNoInputRef}
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
                                                            form={form}
                                                            dropdownValue={paymentModeData2}
                                                            mt={8}
                                                            id={"pay_mode"}
                                                            searchable={false}
                                                            value={paymentMode2}
                                                            changeValue={(value) => {
                                                                setPaymentMode2(value);
                                                                form.setFieldValue("pay_mode", value);
                                                            }}
                                                            ref={payModeInputRef}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <_InputForm
                                                            tooltip={t('BankName')}
                                                            label={t('BankName')}
                                                            placeholder={t('BankName')}
                                                            required={true}
                                                            nextField={'branch_name'}
                                                            name={'bank_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'bank_name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <_InputForm
                                                            tooltip={t('BranchName')}
                                                            label={t('BranchName')}
                                                            placeholder={t('BranchName')}
                                                            required={true}
                                                            nextField={'received_from'}
                                                            name={'branch_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'branch_name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <_InputForm
                                                            tooltip={t('ReceivedFrom')}
                                                            label={t('ReceivedFrom')}
                                                            placeholder={t('ReceivedFrom')}
                                                            required={true}
                                                            nextField={'narration'}
                                                            name={'received_from'}
                                                            form={form}
                                                            mt={0}
                                                            id={'received_from'}
                                                        />
                                                    </Box>
                                                </>
                                            )}
                                            <Box mt={'xs'}>
                                                <TextAreaForm
                                                    tooltip={t('Amount')}
                                                    label={t('Amount')}
                                                    placeholder={t('Amount')}
                                                    required={true}
                                                    nextField={'narration'}
                                                    name={'amount'}
                                                    form={form}
                                                    mt={8}
                                                    id={'amount'}
                                                    ref={amountInputRef}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <TextAreaForm
                                                    tooltip={t('Narration')}
                                                    label={t('Narration')}
                                                    placeholder={t('Narration')}
                                                    required={false}
                                                    nextField={'EntityFormSubmit'}
                                                    name={'narration'}
                                                    form={form}
                                                    mt={8}
                                                    id={'narration'}
                                                />
                                            </Box>
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