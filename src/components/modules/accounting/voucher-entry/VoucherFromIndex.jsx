import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    rem,
    Grid,
    Box,
    Group,
    Text,
    ActionIcon,
    Menu,
    TextInput,
    Table,
    Title,
    Stack,
    Button,
    Flex
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCalendar,
    IconCheck,
    IconDotsVertical,
    IconTrashX,
    IconDeviceFloppy
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { DataTable } from 'mantine-datatable';
import {
    setFetching,
    setValidationData,
    storeEntityDataWithFile
} from "../../../../store/accounting/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";

import ShortcutVoucher from "../../shortcut/ShortcutVoucher.jsx";
import VoucherDetailSection from "./VoucherDetailSection.jsx";
import VoucherFormSection from "./VoucherFormSection.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { DateInput } from "@mantine/dates";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";

function VoucherFormIndex(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { mainAreaHeight, isOnline } = useOutletContext();
    const height = mainAreaHeight - 215;
    const [opened, { open, close }] = useDisclosure(false);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const perPage = 50;
    const [page, setPage] = useState(1);
    const fetching = useSelector((state) => state.crudSlice.fetching);
    const indexData = useSelector((state) => state.crudSlice.indexEntityData);

    const [files, setFiles] = useState([]);
    const [records, setRecords] = useState([
        {
            'item_index': 0,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '2100',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        },
        {
            'item_index': 1,
            'mode': 'Dr',
            'ledger_name': 'Daily Expenses - Conveyance Exp.',
            'debit': '2040',
            'credit': '900',
        }
    ]);

    const form = useForm({
        initialValues: {
            method_id: '', name: '', short_name: '', authorised_mode_id: '', account_mode_id: '', service_charge: '', account_owner: '', path: ''
        },
        validate: {
            method_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
            short_name: hasLength({ min: 2, max: 20 }),
            authorised_mode_id: isNotEmpty(),
            account_mode_id: isNotEmpty(),
            path: isNotEmpty(),
            service_charge: (value) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('method_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const handleInputChange = (index, field, value) => {
        const updatedRecords = records.map((record, i) =>
            i === index ? { ...record, [field]: value } : record
        );
        setRecords(updatedRecords);
    };

    const totalDebit = records.reduce((acc, record) => acc + parseFloat(record.debit || 0), 0);
    const totalCredit = records.reduce((acc, record) => acc + parseFloat(record.credit || 0), 0);

    const [value, setValue] = useState(null);

    return (
        <Box pt={6} bg={'#f0f1f9'}>
            <form onSubmit={form.onSubmit((values) => {
                dispatch(setValidationData(false));
                modals.openConfirmModal({
                    title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                    children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
                    labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        const formValue = { ...form.values };
                        formValue['path'] = files[0];

                        const data = {
                            url: 'accounting/transaction-mode',
                            data: formValue
                        }
                        dispatch(storeEntityDataWithFile(data))

                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            form.reset();
                            setFiles([]);
                            dispatch(setFetching(true));
                        }, 700)
                    },
                });
            })}>
                <Box >
                    <Grid columns={24} gutter={{ base: 6 }} >
                        <Grid.Col span={2.5}>
                            <Box bg={'white'}>
                                <VoucherDetailSection />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={6.5}>
                            <Box>
                                <Box bg={'white'}>
                                    <VoucherFormSection />
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={14}>
                            <Box p={'xs'} className={'borderRadiusAll'} bg={'white'}>
                                <Box className="borderRadiusAll">
                                    <DataTable
                                        classNames={{
                                            root: tableCss.root,
                                            table: tableCss.table,
                                            header: tableCss.header,
                                            footer: tableCss.footer,
                                            pagination: tableCss.pagination,
                                        }}
                                        records={records}
                                        columns={[
                                            { accessor: 'mode', title: t("Mode") },
                                            { accessor: 'ledger_name', title: t("LedgerName") },
                                            {
                                                accessor: 'debit', title: t("Debit"),
                                                render: (record, index) => (
                                                    <TextInput
                                                        value={record.debit}
                                                        onChange={(e) => handleInputChange(index, 'debit', e.target.value)}
                                                    />
                                                ),
                                            },
                                            {
                                                accessor: 'credit', title: t("Credit"),
                                                render: (record, index) => (
                                                    <TextInput
                                                        value={record.credit}
                                                        onChange={(e) => handleInputChange(index, 'credit', e.target.value)}
                                                    />
                                                ),
                                            },
                                            {
                                                accessor: "action",
                                                title: t("Action"),
                                                textAlign: "right",
                                                render: (record) => (
                                                    <Group gap={4} justify="right" wrap="nowrap">
                                                        <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                                            <Menu.Target>
                                                                <ActionIcon variant="outline" color="gray.6" radius="xl" aria-label="Settings">
                                                                    <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Menu.Target>
                                                            <Menu.Dropdown>
                                                                <Menu.Item onClick={() => console.log('Edit')}>
                                                                    {t('Edit')}
                                                                </Menu.Item>
                                                                <Menu.Item onClick={() => console.log('Show')}>
                                                                    {t('Show')}
                                                                </Menu.Item>
                                                                <Menu.Item
                                                                    target="_blank"
                                                                    component="a"
                                                                    style={{ width: '200px', marginTop: '2px', backgroundColor: 'red.1', color: 'red.6' }}
                                                                    rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                                                    onClick={() => console.log('Delete')}
                                                                >
                                                                    {t('Delete')}
                                                                </Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Group>
                                                ),
                                            },
                                        ]}
                                        fetching={fetching}
                                        totalRecords={indexData.total}
                                        recordsPerPage={perPage}
                                        onPageChange={(p) => {
                                            setPage(p);
                                            dispatch(setFetching(true));
                                        }}
                                        loaderSize="xs"
                                        loaderColor="grape"
                                        height={height - 132}
                                        scrollAreaProps={{ type: 'never' }}
                                        footer={
                                            <Table.Tfoot>
                                                <Table.Tr>
                                                    <td colSpan={2} style={{ textAlign: 'right' }}>Total</td>
                                                    <td>{totalDebit.toFixed(2)}</td>
                                                    <td>{totalCredit.toFixed(2)}</td>
                                                    <td></td>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        }
                                    />
                                </Box>
                            </Box>
                            <Box mt={4} >
                                <Box p={'xs'} className="borderRadiusAll" bg={'white'}>
                                    <Grid columns={12} gutter={{ base: 6 }}>
                                        <Grid.Col span={6}>
                                            <Box className="borderRadiusAll" p={'xs'} bg={'white'}>
                                                <Box >
                                                    <InputNumberForm
                                                        tooltip={t('VoucherRefNo')}
                                                        label={t('VoucherRefNo')}
                                                        placeholder={t('VoucherRefNo')}
                                                        required={true}
                                                        nextField={'pay_mode'}
                                                        name={'cheque_no'}
                                                        form={form}
                                                        mt={0}
                                                        id={'cheque_no'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'} >
                                                    <DateInput
                                                        rightSection={<IconCalendar size={16} opacity={0.5} />}
                                                        clearable
                                                        onChange={setValue}
                                                        value={value}
                                                        label={t('ReceiveVoucherDate')}
                                                        placeholder={t('StartDate')}
                                                        nextField={'payment_mode'}
                                                    />
                                                </Box>
                                                {/* <Box mt={'sm'} pb={4}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('IsSignature')}
                                                                label=''
                                                                nextField={'EntityFormSubmit'}
                                                                name={'is_ignature'}
                                                                form={form}
                                                                color="red"
                                                                id={'is_ignature'}
                                                                position={'left'}
                                                                defaultChecked={0}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={2} >{t('IsSignature')}</Grid.Col>
                                                    </Grid>
                                                </Box> */}
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Box className="borderRadiusAll" pl={'xs'} pr={'xs'} h={154} bg={'white'}>
                                                <Box mt={'md'} >
                                                    <TextAreaForm
                                                        autosize
                                                        minRows={4}
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

                                        </Grid.Col>
                                    </Grid>
                                    <Box mt={'xs'} bg={'white'}>
                                        <Box
                                            pl={"xs"} pb={"xs"} pr={8} pt={"xs"} className={"boxBackground borderRadiusAll"}
                                        >
                                            <Grid>
                                                <Grid.Col span={9} h={54}>

                                                </Grid.Col>
                                                <Grid.Col span={3}>
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
                                    </Box>
                                </Box>

                            </Box>

                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Box className={'borderRadiusAll'} pt={'16'} bg={'white'}>
                                <ShortcutVoucher
                                    form={form}
                                    FormSubmit={'EntityFormSubmit'}
                                    Name={'method_id'}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </form >
        </Box >
    );
}

export default VoucherFormIndex;
