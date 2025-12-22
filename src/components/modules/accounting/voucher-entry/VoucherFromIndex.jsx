import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Grid, Box, Group, Text, ActionIcon, Stack, Button, Flex, NumberInput, SimpleGrid,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCalendar, IconTrashX, IconDeviceFloppy, IconPlus, IconSum, IconX,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {DataTable} from "mantine-datatable";

import {
    setFetching, setValidationData,
} from "../../../../store/accounting/crudSlice";
import {storeEntityData} from "../../../../store/core/crudSlice";

import {showNotificationComponent} from "../../../core-component/showNotificationComponent";

import tableCss from "../../../../assets/css/Table.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";

import ShortcutVoucher from "../../shortcut/ShortcutVoucher";
import VoucherNavigation from "./VoucherNavigation";
import CustomerVoucherForm from "./voucher-forms/CustomerVoucherForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SelectForm from "../../../form-builders/SelectForm";
import BankDrawer from "../common/BankDrawer";
import Navigation from "../common/Navigation";
import classes from './RowExpansion.module.css';
import DatePickerWithMinMaxRange from "../../../form-builders/DatePickerWithMinMaxRange.jsx";

function VoucherFormIndex({currencySymbol}) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {mainAreaHeight, isOnline} = useOutletContext();
    const height = mainAreaHeight - 162;

    const [activeVoucher, setActiveVoucher] = useState(null);
    const [lastVoucherDate, setLastVoucherDate] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [page, setPage] = useState(1);
    const perPage = 50;
    const fetching = useSelector((state) => state.crudSlice.fetching);
    const indexData = useSelector((state) => state.crudSlice.indexEntityData);

    const [reloadList, setReloadList] = useState(true);
    const [loadVoucher, setLoadVoucher] = useState(false);

    const [allVoucherList, setAllVoucherList] = useState([]);
    const [primaryLedgerDropdownData, setPrimaryLedgerDropdownData] = useState([]);
    const [primaryLedgerHeadData, setPrimaryLedgerHeadData] = useState(null);
    const [primaryLedgerHeadObject, setPrimaryLedgerHeadObject] = useState(null);

    const [secondaryLedgerHeadDropdownData, setSecondaryLedgerHeadDropdownData] = useState([]);
    const [myItems, setMyItems] = useState([]);
    const [secondaryLedgerHead, setSecondaryLedgerHead] = useState("");
    const [primaryLedgerDropdownEnable, setPrimaryLedgerDropdownEnable] = useState(false);
    const [bankDrawer, setBankDrawer] = useState(false);
    const [bankInfo, setBankInfo] = useState({});

    const loadMyItemsFromStorage = () => {
        const saved = localStorage.getItem("temp-voucher-entry");
        const parsed = saved ? JSON.parse(saved) : [];
        setMyItems(parsed);
    };

    useEffect(() => {
        loadMyItemsFromStorage();
    }, []);

    const [bankInfoSubmitPending, setBankInfoSubmitPending] = useState(false);

    useEffect(() => {
        const cardProducts = localStorage.getItem("temp-voucher-entry");
        const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
        setMyItems(myCardProducts);
    }, [primaryLedgerHeadData]);

    useEffect(() => {
        if (primaryLedgerHeadData && primaryLedgerDropdownData.length > 0) {
            const mainLedgerObject = activeVoucher?.ledger_account_head_primary
                ?.reduce((acc, group) => {
                    if (Array.isArray(group?.child_account_heads)) {
                        return [...acc, ...group.child_account_heads];
                    }
                    return acc;
                }, [])
                ?.filter((item) => item.id == primaryLedgerHeadData);

            setPrimaryLedgerHeadObject(mainLedgerObject?.[0]);

            const updatedData = secondaryLedgerHeadDropdownData.map(group => {
                return {
                    ...group, items: group.items.filter(item => item.value !== primaryLedgerHeadData)
                };
            });
            setSecondaryLedgerHeadDropdownData(updatedData)
        }
    }, [primaryLedgerHeadData, primaryLedgerDropdownData]);

    useEffect(() => {
        let isMounted = true;

        const fetchSlug = async () => {
            try {
                if (primaryLedgerHeadObject?.parent_id && primaryLedgerHeadData) {
                    const {parentLedgerSlug} = await getParentLedgerSlugWithDetails(primaryLedgerHeadObject.parent_id);

                    if (isMounted) {
                        if (parentLedgerSlug === 'bank-account') {
                            setBankDrawer(true);
                            setBankInfo(null);
                            setBankInfoSubmitPending(true);
                        } else {
                            setBankDrawer(false);
                            handleAddProductByProductId("main-ledger");
                        }
                    }
                } else {
                    if (isMounted) {
                        setBankDrawer(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching parent ledger slug:', error);
                if (isMounted) setBankDrawer(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSlug();
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            isMounted = false;
        };
    }, [primaryLedgerHeadObject?.parent_id, primaryLedgerHeadData]);


    useEffect(() => {
        if (bankInfoSubmitPending && bankInfo && primaryLedgerHeadObject) {
            handleAddProductByProductId("main-ledger", bankInfo); // now data is saved
            setBankInfoSubmitPending(false);
            setBankDrawer(false);
        }
    }, [bankInfo, bankInfoSubmitPending, primaryLedgerHeadObject]);


    const handleBankInfoSubmit = (info) => {
        setBankInfo(info);
    };

    const getParentLedgerSlugWithDetails = (id) => {
        const topLevelAccounts = activeVoucher?.ledger_account_head_primary.filter(item => !item.pivot?.primary_account_head_id || item.id === id);

        const parentLedgerSlug = topLevelAccounts?.[0]?.slug || null;

        return {parentLedgerSlug, response: null}; // optional response
    };

    const handleAddProductByProductId = (addedType, bankInfo = {}) => {
        const cardProducts = localStorage.getItem("temp-voucher-entry");
        const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];

        const alreadyExists = myCardProducts.some((p) => p.id === primaryLedgerHeadObject?.id);

        if (alreadyExists) return;

        const newEntry = {
            id: primaryLedgerHeadObject?.id,
            mode: activeVoucher?.mode,
            ledger_name: primaryLedgerHeadObject?.display_name,
            account_head: primaryLedgerHeadObject?.display_name,
            debit: 0,
            credit: 0,
            type: addedType, ...(bankInfo && Object.keys(bankInfo).length > 0 ? {bankInfo} : {})
        };

        const updatedProducts = [...myCardProducts, newEntry];

        updateLocalStorageAndResetForm(updatedProducts, addedType);
    };

    const updateLocalStorageAndResetForm = (products, type) => {
        localStorage.setItem("temp-voucher-entry", JSON.stringify(products));
        loadMyItemsFromStorage();
        setPrimaryLedgerDropdownEnable(true);
    };

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...myItems];
        const parsedValue = parseFloat(value) || 0;

        if (field === "debit") {
            updatedItems[index].debit = parsedValue;
            updatedItems[index].credit = 0;
        } else {
            updatedItems[index].credit = parsedValue;
            updatedItems[index].debit = 0;
        }

        const restItems = updatedItems.slice(1);
        const totals = restItems.reduce((acc, item) => {
            acc.debit += Number(item.debit) || 0;
            acc.credit += Number(item.credit) || 0;
            return acc;
        }, {debit: 0, credit: 0});

        const diff = totals.debit - totals.credit;

        if (updatedItems.length > 0) {
            updatedItems[0].credit = diff > 0 ? diff : 0;
            updatedItems[0].debit = diff < 0 ? Math.abs(diff) : 0;
        }

        setMyItems(updatedItems);
        localStorage.setItem("temp-voucher-entry", JSON.stringify(updatedItems));
    };

    const handleDeleteVoucher = (index, type) => {
        if (type === "main-ledger") {
            setPrimaryLedgerHeadObject(null);
            localStorage.removeItem("temp-voucher-entry");
            setPrimaryLedgerHeadData(null);
            setPrimaryLedgerDropdownEnable(false);
            loadMyItemsFromStorage();
        } else {
            const updatedItems = [...myItems];
            updatedItems.splice(index, 1);

            const restItems = updatedItems.slice(1);
            const totals = restItems.reduce((acc, item) => {
                acc.debit += Number(item.debit) || 0;
                acc.credit += Number(item.credit) || 0;
                return acc;
            }, {debit: 0, credit: 0});

            if (updatedItems.length > 0) {
                const diff = totals.debit - totals.credit;
                updatedItems[0].credit = diff > 0 ? diff : 0;
                updatedItems[0].debit = diff < 0 ? Math.abs(diff) : 0;
            }

            setMyItems(updatedItems);
            localStorage.setItem("temp-voucher-entry", JSON.stringify(updatedItems));
        }
    };

    const renderForm = () => {
        return (<CustomerVoucherForm
            secondaryLedgerHeadDropdownData={secondaryLedgerHeadDropdownData}
            loadMyItemsFromStorage={loadMyItemsFromStorage}
            primaryLedgerHeadObject={primaryLedgerHeadObject}
            activeVoucher={activeVoucher}
            setSecondaryLedgerHead={setSecondaryLedgerHead}
            secondaryLedgerHead={secondaryLedgerHead}
        />);
    };

    const options = {year: "numeric", month: "2-digit", day: "2-digit"};

    const form = useForm({
        initialValues: {
            ref_no: "", issue_date: new Date(), description: "",
        }, validate: {
            issue_date: (value) => value ? null : "This field is required",
        },
    });

    const totals = myItems.reduce((acc, item) => {
        acc.debit += Number(item.debit) || 0;
        acc.credit += Number(item.credit) || 0;
        return acc;
    }, {debit: 0, credit: 0});

    const handleFormSubmit = (values) => {
        dispatch(setValidationData(false));

        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: {confirm: "Confirm", cancel: "Cancel"},
            confirmProps: {color: "red"},
            onConfirm: async () => {
                const formValue = {
                    ...form.values,
                    issue_date: values.issue_date ? new Date(values.issue_date).toLocaleDateString("en-CA", options) : new Date().toLocaleDateString("en-CA"),
                    debit: totals.debit,
                    credit: totals.credit,
                    voucher_id: activeVoucher?.id,
                    items: myItems,
                };

                const {parentLedgerSlug} = await getParentLedgerSlugWithDetails(primaryLedgerHeadObject.parent_id);
                let isFormSubmit = false
                if (parentLedgerSlug === 'bank-account') {
                    if (myItems[0] && myItems[0].bankInfo && typeof myItems[0].bankInfo === 'object' && Object.keys(myItems[0].bankInfo).length > 0) {
                        isFormSubmit = true
                    } else {
                        isFormSubmit = false
                        showNotificationComponent('Bank information is empty', 'red')
                    }
                } else {
                    isFormSubmit = true
                }

                if (isFormSubmit === true) {
                    const value = {
                        url: "accounting/voucher-entry", data: formValue,
                    };

                    const resultAction = await dispatch(storeEntityData(value));

                    if (storeEntityData.rejected.match(resultAction)) {
                        const fieldErrors = resultAction.payload.errors;
                        if (fieldErrors) {
                            const errorObject = {};
                            Object.keys(fieldErrors).forEach((key) => {
                                errorObject[key] = fieldErrors[key][0];
                            });
                            form.setErrors(errorObject);
                        }
                    } else if (storeEntityData.fulfilled.match(resultAction)) {
                        showNotificationComponent(t("CreateSuccessfully"), "teal");
                        setTimeout(() => {
                            setReloadList(true);
                            localStorage.removeItem("temp-voucher-entry");
                            setPrimaryLedgerDropdownEnable(false);
                            setPrimaryLedgerHeadObject(null)
                            setPrimaryLedgerHeadData(null);
                            setSecondaryLedgerHead(null);
                            setActiveVoucher(null);
                            loadMyItemsFromStorage();
                            form.reset();
                        }, 700);
                    }
                }
            },
        });
    };

    useHotkeys([["alt+n", () => document.getElementById("main_ledger_head").click()], ["alt+r", () => form.reset()], ["alt+s", () => document.getElementById("EntityFormSubmit")?.click()],], []);

    return (<Box pt={6} bg={"#f0f1f9"}>
        <Box>
            <Grid columns={24} gutter={{base: 6}}>
                <Grid.Col span={1}>
                    <Navigation module={"voucher-entry"}/>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box bg={"white"}>
                        <VoucherNavigation
                            activeVoucher={activeVoucher}
                            setActiveVoucher={setActiveVoucher}
                            setReloadList={setReloadList}
                            reloadList={reloadList}
                            allVoucherList={allVoucherList}
                            setAllVoucherList={setAllVoucherList}
                            loadMyItemsFromStorage={loadMyItemsFromStorage}
                            setPrimaryLedgerHeadObject={setPrimaryLedgerHeadObject}
                            setSecondaryLedgerHeadDropdownData={setSecondaryLedgerHeadDropdownData}
                            setPrimaryLedgerDropdownData={setPrimaryLedgerDropdownData}
                            setSecondaryLedgerHead={setSecondaryLedgerHead}
                            setPrimaryLedgerDropdownEnable={setPrimaryLedgerDropdownEnable}
                            setPrimaryLedgerHeadData={setPrimaryLedgerHeadData}
                            setLastVoucherDate={setLastVoucherDate}
                        />
                    </Box>
                </Grid.Col>
                <Grid.Col span={18}>
                    <Box
                        p={"xs"}
                        style={{borderRadius: 4}}
                        className={`borderRadiusAll ${genericClass.genericSecondaryBg}`}
                        mb={"6"}
                    >
                        <Box p="xs" className={genericClass.genericHighlightedBox}
                             style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            <Box style={{borderRadius: 4, flexGrow: 1}}
                                 className={genericClass.genericHighlightedBox}>
                                <SelectForm
                                    tooltip={t("Head")}
                                    label={t("")}
                                    placeholder={t("ChooseLedgerHead")}
                                    required={true}
                                    nextField={""}
                                    name={"main_ledger_head"}
                                    form={form}
                                    dropdownValue={primaryLedgerDropdownData}
                                    id={"main_ledger_head"}
                                    searchable={true}
                                    value={primaryLedgerHeadData}
                                    changeValue={setPrimaryLedgerHeadData}
                                    disabled={primaryLedgerDropdownEnable}
                                />
                            </Box>

                            {/* Reset icon */}
                            {primaryLedgerHeadData && (
                                <ActionIcon color='var( --theme-remove-color)'
                                            onClick={() => handleDeleteVoucher(1, 'main-ledger')} variant="subtle"
                                            size="sm" aria-label="Reset selection">
                                    <IconX size={16} opacity={0.6}/>
                                </ActionIcon>)}
                        </Box>
                        <Box
                            pl={"4"}
                            pr={"4"}
                            mt={"4"}
                            pt={"8"}
                            pb={"4"}
                            style={{borderRadius: 4}}
                        >
                            <Grid columns={18} gutter={{base: 2}}>
                                <Grid.Col span={3} mt={2}>
                                    <Text ta="left" size="xs" pl={"md"}>
                                        {t("Name")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text ta="left" size="sm">
                                        {primaryLedgerHeadObject?.name}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={3} mt={2}>
                                    <Text ta="left" size="xs" pl={"md"}>
                                        {t("AccountNumber")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {primaryLedgerHeadObject?.name}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={18} gutter={{base: 2}}>
                                <Grid.Col span={3} mt={2}>
                                    <Text ta="left" size="xs" pl={"md"}>
                                        {t("OpeningBalance")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {currencySymbol} {Number(primaryLedgerHeadObject?.opening_balance || 0).toFixed(2)}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={3} mt={2}>
                                    <Text ta="left" size="xs" pl={"md"}>
                                        {t("BranchName")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {primaryLedgerHeadObject?.credit_limit}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Box>
                    <Grid columns={24} gutter={{base: 6}}>
                        <Grid.Col span={8}>
                            <Box>
                                <Box bg={"white"}>{renderForm()}</Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={16}>
                            <form
                                id="indexForm"
                                onSubmit={form.onSubmit(handleFormSubmit)}
                            >
                                <Box p={"xs"} className={"borderRadiusAll"} bg={"white"}>
                                    <Box className="borderRadiusAll">
                                        <DataTable
                                            classNames={{
                                                root: tableCss.root,
                                                table: tableCss.table,
                                                header: tableCss.header,
                                                footer: tableCss.footer,
                                                pagination: tableCss.pagination,
                                            }}
                                            records={myItems}
                                            columns={[{
                                                accessor: "item_index",
                                                title: t("S/N"),
                                                width: 70,
                                                render: (record) => (record?.bankInfo?.amount &&
                                                    <ActionIcon color="red.5" size={"sm"}>
                                                        <IconPlus height={18} width={18} stroke={1.5}/>
                                                    </ActionIcon>),
                                            }, {
                                                accessor: "mode",
                                                title: t("Mode"),
                                                width: 100,
                                                render: (record) => {
                                                    return record.mode === 'debit' ? 'Debit' : 'Credit'
                                                }
                                            }, {
                                                accessor: "ledger_name", title: t("LedgerName"),
                                            }, {
                                                accessor: "account_head", title: t("AccountHead"),
                                            }, {
                                                accessor: "debit",
                                                title: t("Debit"),
                                                width: 120,
                                                render: (record, index) => (<NumberInput
                                                    disabled={record.mode === "credit"}
                                                    hideControls
                                                    size={'xs'}
                                                    ta={"right"}
                                                    value={record.debit}
                                                    onChange={(val) => handleInputChange(index, "debit", val)}
                                                />),
                                                footer: (<Group gap="xs">
                                                    <Box mb={-4}>
                                                        <IconSum size={16}/>
                                                    </Box>
                                                    <div>{totals.debit}</div>
                                                </Group>),
                                            }, {
                                                accessor: "credit",
                                                title: t("Credit"),
                                                width: 120,
                                                resizable: true,
                                                render: (record, index) => (<NumberInput
                                                    disabled={record.mode === "debit"}
                                                    hideControls
                                                    ta={"right"}
                                                    size={'xs'}
                                                    value={record.credit}
                                                    onChange={(val) => handleInputChange(index, "credit", val)}
                                                />),
                                                footer: (<Group gap="xs">
                                                    <Box mb={-4}>
                                                        <IconSum size={16}/>
                                                    </Box>
                                                    <div>{totals.credit}</div>
                                                </Group>),
                                            }, {
                                                accessor: "action",
                                                title: t("Action"),
                                                textAlign: "right",
                                                render: (record, index) => (
                                                    <Group gap={8} justify="right" wrap="nowrap">
                                                        {<ActionIcon
                                                            size={"sm"}
                                                            variant="transparent"
                                                            color="red.5"
                                                            onClick={() => handleDeleteVoucher(index, record.type)}
                                                        >
                                                            <IconTrashX size="xs" stroke={1.5}/>
                                                        </ActionIcon>}
                                                    </Group>),
                                            },]}
                                            rowExpansion={{
                                                collapseProps: {
                                                    transitionDuration: 500,
                                                    animateOpacity: false,
                                                    transitionTimingFunction: 'ease-out',
                                                },
                                                allowMultiple: true,
                                                content: ({record}) => (
                                                    <Stack className={classes.details} p="xs" gap={6}>
                                                        <SimpleGrid cols={2} spacing="sm" verticalSpacing="xs"
                                                                    breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                                                            {record?.bankInfo?.cheque_date && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Cheque Date:
                                                                    </div>
                                                                    <div>
                                                                        {(() => {
                                                                            const date = new Date(record.bankInfo.cheque_date);
                                                                            const formatted = date.toLocaleString('en-US', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric',
                                                                            });
                                                                            return formatted;
                                                                        })()}
                                                                    </div>
                                                                </Group>)}

                                                            {record?.bankInfo?.cross_using && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Cross using:
                                                                    </div>
                                                                    <div>{record.bankInfo.cross_using}</div>
                                                                </Group>)}

                                                            {record?.bankInfo?.amount && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Amount:</div>
                                                                    <div>{record.bankInfo.amount}</div>
                                                                </Group>)}

                                                            {record?.bankInfo?.forwarding_name && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Forwarding
                                                                        name:
                                                                    </div>
                                                                    <div>{record.bankInfo.forwarding_name}</div>
                                                                </Group>)}

                                                            {record?.bankInfo?.pay_mode && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Pay mode:</div>
                                                                    <div>{record.bankInfo.pay_mode}</div>
                                                                </Group>)}

                                                            {record?.bankInfo?.branch_name && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Branch name:
                                                                    </div>
                                                                    <div>{record.bankInfo.branch_name}</div>
                                                                </Group>)}

                                                            {record?.bankInfo?.received_from && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Received from:
                                                                    </div>
                                                                    <div>{record.bankInfo.received_from}</div>
                                                                </Group>)}

                                                            {record?.bankInfo?.cheque_no && (
                                                                <Group gap={6} align="start">
                                                                    <div className={classes.label}>Cheque no:</div>
                                                                    <div>{record.bankInfo.cheque_no}</div>
                                                                </Group>)}
                                                        </SimpleGrid>
                                                    </Stack>)
                                            }}
                                            fetching={fetching}
                                            totalRecords={indexData.total}
                                            key={"item_index"}
                                            recordsPerPage={perPage}
                                            onPageChange={(p) => {
                                                setPage(p);
                                                dispatch(setFetching(true));
                                            }}
                                            loaderSize="xs"
                                            loaderColor="grape"
                                            height={height - 274}
                                            scrollAreaProps={{type: "never"}}
                                        />
                                    </Box>
                                </Box>
                                <Box mt={4}>
                                    <Box p={"xs"} className="borderRadiusAll" bg={"white"}>
                                        <Grid columns={12} gutter={{base: 6}}>
                                            <Grid.Col span={6}>
                                                <Box
                                                    className="borderRadiusAll"
                                                    p={"xs"}
                                                    bg={"white"}
                                                >
                                                    <Box>
                                                        <InputNumberForm
                                                            tooltip={t("VoucherRefNo")}
                                                            label={t("VoucherRefNo")}
                                                            placeholder={t("VoucherRefNo")}
                                                            required={false}
                                                            nextField={"issue_date"}
                                                            name={"ref_no"}
                                                            form={form}
                                                            mt={0}
                                                            id={"ref_no"}
                                                        />
                                                    </Box>
                                                    <Box mt={"xs"}>

                                                        <DatePickerWithMinMaxRange
                                                            tooltip={t("InvoiceDateValidateMessage")}
                                                            label={t("IssueDate")}
                                                            placeholder={t("IssueDate")}
                                                            required={true}
                                                            nextField="discount"
                                                            form={form}
                                                            name="issue_date"
                                                            id="issue_date"
                                                            leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                                            rightSectionWidth={30}
                                                            closeIcon={true}
                                                            minDate={new Date(lastVoucherDate)}
                                                            maxDate={new Date()}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Box
                                                    className="borderRadiusAll"
                                                    pl={"xs"}
                                                    pr={"xs"}
                                                    h={154}
                                                    bg={"white"}
                                                >
                                                    <Box mt={"md"}>
                                                        <TextAreaForm
                                                            autosize={true}
                                                            minRows={4}
                                                            maxRows={4}
                                                            tooltip={t("Narration")}
                                                            label={t("Narration")}
                                                            placeholder={t("Narration")}
                                                            required={false}
                                                            nextField={"EntityFormSubmits"}
                                                            name={"description"}
                                                            form={form}
                                                            mt={8}
                                                            id={"description"}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                        <Box mt={"4"} bg={"white"}>
                                            <Box
                                                mt={4}
                                                pl={`xs`}
                                                pr={8}
                                                pt={"xs"}
                                                pb={"xs"}
                                                mb={"4"}
                                                className={"boxBackground borderRadiusAll"}
                                            >
                                                <Grid>
                                                    <Grid.Col span={9}></Grid.Col>
                                                    <Grid.Col span={3}>
                                                        <Stack right align="flex-end">
                                                            {!saveCreateLoading && isOnline && (<Button
                                                                size="xs"
                                                                color={"green.8"}
                                                                type="submit"
                                                                form={"indexForm"}
                                                                id="EntityFormSubmits"
                                                                leftSection={<IconDeviceFloppy size={16}/>}
                                                                disabled={totals.debit !== totals.credit}
                                                            >
                                                                <Flex direction={"column"} gap={0}>
                                                                    <Text fz={14} fw={400}>
                                                                        {t("AddVoucher")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>)}
                                                        </Stack>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </form>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Box className={"borderRadiusAll"} pt={"16"} bg={"white"}>
                        <ShortcutVoucher
                            form={form}
                            FormSubmit={"EntityFormSubmit"}
                            Name={"method_id"}
                            inputType="select"
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>
        {bankDrawer && (<BankDrawer
            bankDrawer={bankDrawer}
            setBankDrawer={setBankDrawer}
            module={"VoucherEntry"}
            setLoadVoucher={setLoadVoucher}
            sourceForm="main"
            entryType={activeVoucher.mode}
            setBankInfo={setBankInfo}
            onSubmit={handleBankInfoSubmit}
        />)}
    </Box>);
}

export default VoucherFormIndex;
