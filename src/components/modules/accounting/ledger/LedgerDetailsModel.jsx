import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer,
    Flex, Modal, Menu, Table, Card, TextInput, Title, Accordion, NavLink
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconDeviceFloppy,
    IconPrinter,
    IconCheck,
    IconX,
    IconDotsVertical,
    IconTrashX,
    IconSearch,
    IconInfoCircle,
    IconCalendar,
    IconFilter,
    IconRestore,
    IconPdf,
    IconFileTypeXls,

} from "@tabler/icons-react";
import {useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {
    deleteEntityData,
    editEntityData, getIndexEntityData, setFetching,
    setFormLoading,
    setInsertType
} from "../../../../store/accounting/crudSlice.js";
import {modals} from "@mantine/modals";
import Navigation from "../common/Navigation.jsx";
import LedgerTable from "./LedgerTable.jsx";
import LedgerForm from "./LedgerForm.jsx";
import LedgerUpdateFrom from "./LedgerUpdateFrom.jsx";
import {showInstantEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import SelectForm from "../../../form-builders-filter/SelectForm";
import DatePickerForm from "../../../form-builders/DatePicker";
import {
    setCategoryGroupFilterData,
    setCustomerFilterData, setFileUploadFilterData,
    setSearchKeyword,
    setUserFilterData,
    setVendorFilterData, setWarehouseFilterData
} from "../../../../store/core/crudSlice";
import {setCategoryFilterData, setProductFilterData} from "../../../../store/inventory/crudSlice";
import {setProductionSettingFilterData} from "../../../../store/production/crudSlice";

function LedgerDetailsModel(props) {
    const configData = localStorage.getItem('config-data');
    const dispatch = useDispatch()

    const adjustment = -28;
    const [opened, { open, close }] = useDisclosure(true);

    const perPage = 50;
    const [page, setPage] = useState(1);
    const entityEditData = useSelector((state => state.crudSlice.entityEditData))
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const [searchValue, setSearchValue] = useState("");
    const { ledgerDetails,setLedgerDetails } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight-72; //TabList height 104
    const [journalItems,setJournalItems] = useState([])
    const form = useForm({
        initialValues: {
            financial_year: "",
            financial_start_date: "",
            financial_end_date: "",
        },
    });

    useEffect(() => {
        const value = {
            url: 'accounting/account-head',
            param: {
                group: 'ledger',
                term: searchKeyword,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultAction = await dispatch(
                    showInstantEntityData(`accounting/account-ledger-wise/journal/${ledgerDetails.id}`)
                );

                if (showInstantEntityData.fulfilled.match(resultAction)) {
                    if (resultAction.payload.data.status === 200) {
                        setJournalItems(resultAction.payload.data.data)
                    } else {
                        showNotificationComponent('Failed to process', 'red', null, false, 1000, true);
                    }
                }
            } catch (error) {
                console.error("Error updating entity:", error);
                showNotificationComponent('Failed to process', 'red', null, false, 1000, true);
            }
        };

        if (ledgerDetails?.id) {
            fetchData();
        }
    }, [ledgerDetails, dispatch]);

    const groupByParentName = (items) => {
        return (Array.isArray(items) ? items : []).reduce((grouped, item) => {
            if (!item.parent_name) return grouped;

            if (!grouped[item.parent_name]) {
                grouped[item.parent_name] = [];
            }

            grouped[item.parent_name].push(item);
            return grouped;
        }, {});
    };

// Example usage (assuming data is in a variable called ⁠ data ⁠)
    const grouped = groupByParentName(indexData?.data || []);
    const entries = Object.entries(grouped);
    /*const rows = journalItems?.ledgerDetails?.flatMap((element) => [
        <Table.Tr key={element.id} bg="red.6">
            <Table.Td>{element.ledger_name}</Table.Td>
            <Table.Td>{element.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>
            <Table.Td>{element.amount}</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
        </Table.Tr>,
        ...(element.childItems || []).map((c) => (
            <Table.Tr key={c.id} bg="red.4">
                <Table.Td>{c.ledger_name}</Table.Td>
                <Table.Td>{c.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>
                <Table.Td>{c.amount}</Table.Td>
                <Table.Td>{c.created_date}</Table.Td>
            </Table.Tr>
        )),
    ]);*/

    const rows2 = journalItems?.ledgerItems2?.map((element,index) => (
        <Table.Tr key={element.id}>
            {/*<Table.Td>{index + 1}.</Table.Td>*/}
            <Table.Td>{element.id}.</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
            {/*<Table.Td>{element.invoice_no}</Table.Td>*/}
            <Table.Td>........</Table.Td>
            <Table.Td>{element.voucher_name}</Table.Td>
            <Table.Td>{element.ledger_name}</Table.Td>
            {/*<Table.Td>{element.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>*/}
            <Table.Td>{element.opening_amount}</Table.Td>
            <Table.Td>{element.mode === 'Debit' && element.amount}</Table.Td>
            <Table.Td>{element.mode === 'Credit' && element.amount}</Table.Td>
            <Table.Td>{element.closing_amount}</Table.Td>

        </Table.Tr>
    ));

    const rows22 = journalItems?.ledgerItems?.map((element,index) => (
        <Table.Tr key={element.id} bg="blue.6">
            <Table.Td>{index + 1}.</Table.Td>
            <Table.Td>{element.created_date}</Table.Td>
            <Table.Td>{element.invoice_no}</Table.Td>
            <Table.Td>{element.voucher_name}</Table.Td>
            <Table.Td>{element.ledger_name}</Table.Td>
            {/*<Table.Td>{element.mode === 'debit' ? 'Debit' : 'Credit'}</Table.Td>*/}
            <Table.Td>{element.opening_amount}</Table.Td>
            <Table.Td>{element.mode === 'debit' && element.amount}</Table.Td>
            <Table.Td>{element.mode === 'credit' && element.amount}</Table.Td>
            <Table.Td>{element.closing_amount
            }</Table.Td>

        </Table.Tr>
    ));
    return (
        <>
            <Modal
                opened={opened}
                onClose={()=>{
                    setLedgerDetails(null)
                    close()
                }}
                title={ledgerDetails?.name || 'Ledger Details'}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                fullScreen
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Box p={'8'}>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={6} >
                            <Box bg={'white'}>
                                <Card shadow="md" radius="md" mb={'xs'}  className={classes.card} padding="xs">
                                    <Box fz="sm" c="dimmed" mt="sm">
                                        <Box className={"boxBackground borderRadiusAll"}>
                                            <Text pt={'xs'} pl={'md'} pb={'xs'}>{t("ManageLedger")}</Text>
                                        </Box>
                                        <ScrollArea h={height-12}
                                                    scrollbarSize={2}
                                                    scrollbars="y"
                                                    bg={'gray.2'}>
                                            <Box ml={'4'} mr={'4'} mt={'4'}>
                                                <Accordion
                                                    chevronIconSize={20}
                                                    variant="default"
                                                    // defaultValue="item-0"
                                                    defaultValue={ledgerDetails.parent_name}
                                                    transitionDuration={1000}
                                                >
                                                    {entries.map(([groupName, children], index) => {
                                                        return (
                                                            <Accordion.Item key={groupName} value={groupName}>
                                                                <Accordion.Control

                                                                >
                                                                    {t(groupName)}
                                                                </Accordion.Control>
                                                                <Accordion.Panel bg={'white'}>
                                                                    {children.map((item) => (
                                                                        <NavLink
                                                                            key={item.id}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setLedgerDetails(item)
                                                                            }}
                                                                            label={item.name} />
                                                                    ))}
                                                                </Accordion.Panel>
                                                            </Accordion.Item>
                                                        );
                                                    })}
                                                </Accordion>
                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={18}>
                            <Box bg={"white"} p={"xs"}  className={"borderRadiusAll"} mb={"8"}>
                                <Box bg={"white"}>
                                    <Box
                                        pl={`xs`}
                                        pr={8}
                                        pt={"4"}
                                        pb={"4"}
                                        mb={"4"}
                                        className={"boxBackground"}
                                    >
                                        <Box>
                                            <Grid columns={24} gutter={{ base: 8 }} justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
                                                <Grid.Col span="3">
                                                    <Box>{t("LedgerName")}</Box>
                                                </Grid.Col>
                                                <Grid.Col span="6">
                                                    <Box>{ledgerDetails?.name || 'Ledger Details'}</Box>
                                                </Grid.Col>
                                                <Grid.Col span="3">
                                                    <Box>{t("AccountHead")}</Box>
                                                </Grid.Col>
                                                <Grid.Col span="6">
                                                    <Box>AccountReceivable</Box>
                                                </Grid.Col>
                                                <Grid.Col span="6">
                                                    <Box>Balance:234234</Box>
                                                </Grid.Col>
                                            </Grid>

                                        </Box>
                                        <Box>
                                            <Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
                                                <Grid.Col span="4">
                                                    <Box>
                                                        <DatePickerForm
                                                            tooltip={t("FinancialStartDateTooltip")}
                                                            label=""
                                                            placeholder={t("FinancialStartDate")}
                                                            required={false}
                                                            nextField={"financial_end_date"}
                                                            form={form}
                                                            name={"financial_start_date"}
                                                            id={"financial_start_date"}
                                                            leftSection={
                                                                <IconCalendar size={16} opacity={0.5} />
                                                            }
                                                            rightSectionWidth={30}
                                                            closeIcon={true}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span="4">
                                                    <Box>
                                                        <DatePickerForm
                                                            tooltip={t("FinancialEndDateTooltip")}
                                                            label=""
                                                            placeholder={t("FinancialEndDate")}
                                                            required={false}
                                                            nextField={"capital_investment_id"}
                                                            form={form}
                                                            name={"financial_end_date"}
                                                            id={"financial_end_date"}
                                                            leftSection={
                                                                <IconCalendar size={16} opacity={0.5} />
                                                            }
                                                            rightSectionWidth={30}
                                                            closeIcon={true}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span="auto">
                                                    <ActionIcon.Group mt={'1'} justify="center">
                                                        <ActionIcon variant="default"
                                                                    c={'red.4'}
                                                                    size="lg" aria-label="Filter"
                                                                    onClick={() => {
                                                                        searchKeyword.length > 0 ?
                                                                            (dispatch(setFetching(true)),
                                                                                setSearchKeywordTooltip(false))
                                                                            :
                                                                            (setSearchKeywordTooltip(true),
                                                                                setTimeout(() => {
                                                                                    setSearchKeywordTooltip(false)
                                                                                }, 1500))
                                                                    }}
                                                        >
                                                            <Tooltip
                                                                label={t('SearchButton')}
                                                                px={16}
                                                                py={2}
                                                                withArrow
                                                                position={"bottom"}
                                                                c={'red'}
                                                                bg={`red.1`}
                                                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                                            >
                                                                <IconSearch style={{ width: rem(18) }} stroke={1.5} />
                                                            </Tooltip>
                                                        </ActionIcon>
                                                        {props.module !== 'category' && props.module !== 'category-group' && props.module !== 'particular' &&(
                                                            <ActionIcon
                                                                variant="default"
                                                                size="lg"
                                                                c={'gray.6'}
                                                                aria-label="Settings"
                                                                onClick={(e) => {
                                                                    setFilterModel(true)
                                                                }}
                                                            >
                                                                <Tooltip
                                                                    label={t("FilterButton")}
                                                                    px={16}
                                                                    py={2}
                                                                    withArrow
                                                                    position={"bottom"}
                                                                    c={'red'}
                                                                    bg={`red.1`}
                                                                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                                                >
                                                                    <IconFilter style={{ width: rem(18) }} stroke={1.0} />
                                                                </Tooltip>
                                                            </ActionIcon>
                                                        )}
                                                        <ActionIcon variant="default" c={'gray.6'}
                                                                    size="lg" aria-label="Settings">
                                                            <Tooltip
                                                                label={t("ResetButton")}
                                                                px={16}
                                                                py={2}
                                                                withArrow
                                                                position={"bottom"}
                                                                c={'red'}
                                                                bg={`red.1`}
                                                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                                            >
                                                                <IconRestore style={{ width: rem(18) }} stroke={1.5} onClick={() => {
                                                                    dispatch(setSearchKeyword(''))
                                                                    dispatch(setFetching(true))

                                                                    if (props.module === 'customer') {
                                                                        dispatch(setCustomerFilterData({
                                                                            ...customerFilterData,
                                                                            financial_start_date: '',
                                                                            financial_end_date: ''
                                                                        }));
                                                                    }
                                                                }} />
                                                            </Tooltip>
                                                        </ActionIcon>
                                                        <ActionIcon variant="default"
                                                                    c={'green.8'}
                                                                    size="lg" aria-label="Filter"
                                                                    onClick={() => {
                                                                        searchKeyword.length > 0 ?
                                                                            (dispatch(setFetching(true)),
                                                                                setSearchKeywordTooltip(false))
                                                                            :
                                                                            (setSearchKeywordTooltip(true),
                                                                                setTimeout(() => {
                                                                                    setSearchKeywordTooltip(false)
                                                                                }, 1500))
                                                                    }}
                                                        >
                                                            <Tooltip
                                                                label={t('DownloadPdfFile')}
                                                                px={16}
                                                                py={2}
                                                                withArrow
                                                                position={"bottom"}
                                                                c={'red'}
                                                                bg={`red.1`}
                                                                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                                            >
                                                                <IconPdf style={{ width: rem(18) }} stroke={1.5} />
                                                            </Tooltip>
                                                        </ActionIcon>

                                                        <ActionIcon variant="default"
                                                                    c={'green.8'}
                                                                    size="lg" aria-label="Filter"
                                                                    onClick={() => {
                                                                        if (props.module === 'stock') {
                                                                            props.setDownloadStockXls(true)
                                                                        }
                                                                    }}
                                                        >
                                                            <Tooltip
                                                                label={t('DownloadExcelFile')}
                                                                px={16}
                                                                py={2}
                                                                withArrow
                                                                position={"bottom"}
                                                                c={'red'}
                                                                bg={`red.1`}
                                                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                                            >
                                                                <IconFileTypeXls style={{width: rem(18)}} stroke={1.5}/>
                                                            </Tooltip>
                                                        </ActionIcon>
                                                        {props.module === 'ledger' &&(
                                                            <ActionIcon.GroupSection onClick={handleSyncAllLedgerMasterdata} variant="default" c={'white'} size="lg" bg='var(--theme-primary-color-6)' miw={60}>
                                                                {t('Sync')}
                                                            </ActionIcon.GroupSection>
                                                        )}
                                                    </ActionIcon.Group>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>

                                    </Box>
                                    <Table.ScrollContainer height={height-24} type="native">
                                        <Table>
                                        <Table.Thead >
                                            <Table.Tr c={'white'} bg="var(--theme-primary-color-5)">
                                                <Table.Th>{t("S/N")}</Table.Th>
                                                <Table.Th>{t("Date")}</Table.Th>
                                                <Table.Th>{t("JVNo")}</Table.Th>
                                                <Table.Th>{t("VoucherType")}</Table.Th>
                                                <Table.Th>{t("Ledger Name")}</Table.Th>
                                                <Table.Th >{t("Opening")}</Table.Th>
                                                <Table.Th>{t("Debit")}</Table.Th>
                                                <Table.Th>{t("Credit")}</Table.Th>
                                                <Table.Th>{t("Closing")}</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody >{rows2}</Table.Tbody>
                                    </Table>
                                    </Table.ScrollContainer>
                                </Box>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>

            </Modal>
        </>

    );
}

export default LedgerDetailsModel;
