import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
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
import {useTranslation} from "react-i18next";
import {
    IconX,
    IconDeviceFloppy,
    IconSortAscendingNumbers,
    IconCalendar,
} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";

import _SelectForm from "../../../../components/form-builders/_SelectForm";
import _InputForm from "../../../../components/form-builders/_InputForm";
import InputForm from "../../../form-builders/InputForm";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import getBanksDropdownData from "../../../global-hook/dropdown/getBanksDropdownData.js";

function BankDrawer(props) {
    const {bankDrawer, setBankDrawer, module, entryType, onSubmit} = props;
    const {isOnline, mainAreaHeight} = useOutletContext();
    const {t} = useTranslation();
    const height = mainAreaHeight - 100;

    const [payModeValue, setPayModeValue] = useState("");
    const [bankData, setBankData] = useState("");
    const banksDropdownData = getBanksDropdownData()

    const paymentModeOptions = [
        {value: "cash", label: t("Cash")},
        {value: "cheque", label: t("Cheque")},
        {value: "bank_transfer", label: t("BankTransfer")},
    ];

    const closeDrawer = () => {
        setBankDrawer(false);
    };

    const bankForm = useForm({
        initialValues: {
            cheque_date: "",
            cross_using: "",
            amount: "",
            forwarding_name: "",
            pay_mode: "",
            bank_id: "",
            branch_name: "",
            received_from: "",
            cheque_no: "",
        },
        validate: {
            cheque_date: (value) =>
                (entryType === "credit" || entryType === "debit") && !value
                    ? t("ChequeDateRequired")
                    : null,
            cross_using: (value) =>
                entryType === "credit" && !value ? t("CrossUsingRequired") : null,
            pay_mode: (value) =>
                entryType === "debit" && !value ? t("PayModeRequired") : null,
            bank_id: (value) =>
                entryType === "debit" && !value ? t("ChooseBank") : null,
            branch_name: (value) =>
                entryType === "debit" && !value ? t("BranchNameRequired") : null,
            received_from: (value) =>
                entryType === "debit" && !value ? t("ReceivedFromRequired") : null,
            cheque_no: (value) =>
                (entryType === "credit" || entryType === "debit") && !value
                    ? t("ChequeNoRequired")
                    : null,
        },
    });

    const handleSalesFormSubmit = (values) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: t("Submit"), cancel: t("Cancel")},
            confirmProps: {color: "red"},
            onCancel: () => {
            },
            onConfirm: () => handleSalesConfirmSubmit(values),
        });
    };

    const handleSalesConfirmSubmit = async (values) => {
        onSubmit(values);
    };

    const renderCommonFields = () => (
        <>
            <Box mt="xs">
                <DatePickerForm
                    tooltip={t("ChequeDate")}
                    label={t("ChequeDate")}
                    placeholder={t("ChequeDate")}
                    required
                    nextField="cheque_no"
                    form={bankForm}
                    name="cheque_date"
                    id="cheque_date"
                    leftSection={<IconCalendar size={16} opacity={0.5}/>}
                    rightSectionWidth={30}
                    closeIcon
                />
            </Box>

            <Box mt="xs">
                <InputForm
                    tooltip={t("ChequeNo")}
                    label={t("ChequeNo")}
                    placeholder={t("ChequeNo")}
                    required
                    nextField="pay_mode"
                    name="cheque_no"
                    form={bankForm}
                    mt={0}
                    id="cheque_no"
                    type="number"
                    leftSection={<IconSortAscendingNumbers size={16} opacity={0.5}/>}
                />
            </Box>
        </>
    );

    return (
        <Drawer.Root opened={bankDrawer} position="right" onClose={closeDrawer} size={"30%"} offset={8} radius="md">
            <Drawer.Overlay/>
            <Drawer.Content>

                    {/* Drawer Header */}
                    <Flex justify="flex-end" align="center" p="sm">
                        <ActionIcon
                            radius="xl"
                            color="grey.6"
                            size="md"
                            variant="outline"
                            onClick={closeDrawer}
                        >
                            <IconX style={{width: "80%", height: "80%"}} stroke={1.5}/>
                        </ActionIcon>
                    </Flex>

                    {/* Drawer Content */}
                    <Box bg="white" className="borderRadiusAll" mb="md" mt={2}>
                        <Box bg="white">
                            <Box px="xs" pt="sm" pb="sm" mb="sm" className="boxBackground borderRadiusAll">
                                <Grid align="center">
                                    <Grid.Col span={6}>
                                        <Title order={6}>{t(module)}</Title>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Stack align="flex-end">
                                            {isOnline && (
                                                <Button
                                                    size="xs"
                                                    className="btnPrimaryBg"
                                                    id="EntityBankFormSubmit"
                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                    onClick={() => bankForm.onSubmit(handleSalesFormSubmit)()}
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

                            <Box px="xs" className="borderRadiusAll">
                                <form onSubmit={bankForm.onSubmit(handleSalesFormSubmit)}>
                                    <>
                                        <Box mt="xs">
                                            <_SelectForm
                                                tooltip={t("CrossUsing")}
                                                label={t("CrossUsing")}
                                                placeholder={t("CrossUsing")}
                                                required
                                                nextField="bank_amount"
                                                name="cross_using"
                                                form={bankForm}
                                                dropdownValue={paymentModeOptions}
                                                id="cross_using"
                                                searchable={false}
                                                value={payModeValue}
                                                changeValue={(value) => {
                                                    setPayModeValue(value);
                                                    bankForm.setFieldValue("cross_using", value);
                                                }}
                                            />
                                        </Box>
                                    </>
                                    {renderCommonFields()}
                                    {entryType === "credit" && (
                                        <>
                                            <Box mt="xs">
                                                <_InputForm
                                                    tooltip={t("ForwardingName")}
                                                    label={t("ForwardingName")}
                                                    placeholder={t("ForwardingName")}
                                                    nextField="EntityBankFormSubmit"
                                                    name="forwarding_name"
                                                    form={bankForm}
                                                    id="forwarding_name"
                                                />
                                            </Box>
                                        </>
                                    )}

                                    {entryType === "debit" && (
                                        <>

                                            <Box mt="xs">
                                                <_SelectForm
                                                    tooltip={t("ChooseBank")}
                                                    label={t("ChooseBank")}
                                                    placeholder={t("ChooseBank")}
                                                    required
                                                    nextField="bank_amount"
                                                    name="bank_id"
                                                    form={bankForm}
                                                    dropdownValue={banksDropdownData}
                                                    id="bank_id"
                                                    searchable={false}
                                                    value={bankData}
                                                    changeValue={(value) => {
                                                        setBankData(value);
                                                        bankForm.setFieldValue("bank_id", value);
                                                    }}
                                                />
                                            </Box>

                                            <Box mt="xs">
                                                <_InputForm
                                                    tooltip={t("BranchName")}
                                                    label={t("BranchName")}
                                                    placeholder={t("BranchName")}
                                                    required
                                                    nextField="received_from"
                                                    name="branch_name"
                                                    form={bankForm}
                                                    id="branch_name"
                                                />
                                            </Box>

                                            <Box mt="xs">
                                                <_InputForm
                                                    tooltip={t("ReceivedFrom")}
                                                    label={t("ReceivedFrom")}
                                                    placeholder={t("ReceivedFrom")}
                                                    required
                                                    nextField="EntityBankFormSubmit"
                                                    name="received_from"
                                                    form={bankForm}
                                                    id="received_from"
                                                />
                                            </Box>
                                        </>
                                    )}
                                </form>
                            </Box>
                        </Box>
                    </Box>

            </Drawer.Content>
        </Drawer.Root>
    );
}

export default BankDrawer;
