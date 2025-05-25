import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    Grid,
    ActionIcon,
    Text,
    Title,
    Stack,
    rem,
    Menu,
    NumberInput,
    Button,
    Flex,
    Tooltip,
    Checkbox,
    LoadingOverlay,
    ScrollArea,
    Table
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconEye,
    IconEdit,
    IconTrash,
    IconDotsVertical,
    IconTrashX,
    IconPlus,
    IconSum,
    IconCalendar, IconDeviceFloppy, IconChevronsRight, IconPencil, IconEyeEdit, IconPrinter, IconReceipt
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData,
    deleteEntityData
} from "../../../../../store/accounting/crudSlice.js";
import KeywordSearch from "../../../filter/KeywordSearch.jsx";
import { modals } from "@mantine/modals";
import tableCss from "../../../../../assets/css/Table.module.css";
import Navigation from "../../common/Navigation.jsx";
import ShortcutVoucher from "../../../shortcut/ShortcutVoucher.jsx";
import __ShortcutTable from "../../../shortcut/__ShortcutTable.jsx";


function _VoucherTable(props) {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const perPage = 50;
    const [page, setPage] = useState(1);
    const { isOnline, mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 106; //TabList height 104
    const height = mainAreaHeight - 304; //TabList height 104
    const [loading, setLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState('');


    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const [indexData,setIndexData] = useState([])
    const [reloadData,setReloadData] = useState(true)

    const [salesViewData, setSalesViewData] = useState({})

    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
        setSelectedRow(indexData.data && indexData.data[0] && indexData.data[0].invoice_no)
    }, [indexData.data])

    console.log(salesViewData)

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'accounting/voucher-entry',
                param: {
                    term: searchKeyword,
                    page: page,
                    offset: perPage
                }
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                // Handle rejected state
                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                }
                // Handle fulfilled state
                else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload)
                }
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            }finally {
                setReloadData(false);
                setLoading(false)

            }
        };

        // Call the async function
        fetchData();
    }, [dispatch, fetching, reloadData]);

    const navigate = useNavigate()
    const [ledgerViewDrawer, setLedgerViewDrawer] = useState(false)

    const rows = salesViewData && salesViewData.journal_items && salesViewData.journal_items.map((element, index) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{index + 1}</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.ledger_name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.amount}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.debit}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.credit}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Box pt={6} bg={"#f0f1f9"}>
            <Box>
                {/*<Grid columns={24} gutter={{ base: 6 }}>*/}
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={1} ><Navigation module={"voucher-entry"}/></Grid.Col>
                        <Grid.Col span={14} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                                    <KeywordSearch module={'customer'} />
                                </Box>
                                <Box className={'borderRadiusAll'}>
                                    <DataTable
                                        classNames={{
                                            root: tableCss.root,
                                            table: tableCss.table,
                                            header: tableCss.header,
                                            footer: tableCss.footer,
                                            pagination: tableCss.pagination,
                                        }}
                                        records={indexData.data}
                                            columns={[
                                            {
                                                accessor: 'index',
                                                title: t('S/N'),
                                                textAlignment: 'right',
                                            render: (item) => (indexData.data.indexOf(item) + 1)

                                        },

                                            { accessor: 'created', title: t("Created") },
                                            {
                                                accessor: 'invoice_no',
                                                title: t("Invoice"),
                                                render: (item) => (
                                                    <Text
                                                        component="a"
                                                        size="sm"
                                                        variant="subtle"
                                                        c="red.6"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setLoading(true)
                                                            setSalesViewData(item)
                                                            setSelectedRow(item.invoice_no)
                                                            setLoading(false)
                                                        }}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {item.invoice_no}
                                                    </Text>

                                                )
                                            },
                                    { accessor: 'voucher_name', title: t('VoucherName') },
                                    { accessor: 'process', title: t('Process') },
                                    { accessor: 'debit', title: t('Debit') },
                                    { accessor: 'credit', title: t('Credit') },
                                    { accessor: 'issue_date', title: t('IssueDate') },
                                            {
                                                accessor: "action",
                                                title: t("Action"),
                                                textAlign: "right",
                                                render: (data) => (
                                                    <></>
                                                ),
                                            },
                                        ]
                                        }
                                        fetching={reloadData}
                                        totalRecords={indexData.total}
                                        recordsPerPage={perPage}
                                        page={page}
                                        onPageChange={(p) => {
                                            setPage(p)
                                            dispatch(setFetching(true))
                                        }}
                                        loaderSize="xs"
                                        loaderColor="grape"
                                        height={tableHeight}
                                        scrollAreaProps={{ type: 'never' }}
                                        rowBackgroundColor={(item) => {
                                            if (item.invoice_no === selectedRow) return '#e2c2c263';
                                        }}
                                        rowColor={(item) => {
                                            if (item.invoice_no === selectedRow) return 'red.6';
                                        }}
                                    />
                                </Box>
                            </Box>

                        </Grid.Col>

                        <Grid.Col span={8} >

                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} pos="relative">
                                {loading &&
                                    <LoadingOverlay
                                        visible={loading}
                                        zIndex={1000}
                                        overlayProps={{ radius: "sm", blur: 2 }}
                                        loaderProps={{ color: 'red' }}
                                    />
                                }
                                <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                    {t('Invoice')}: {salesViewData && salesViewData.invoice && salesViewData.invoice}
                                </Box>
                                <Box className={'borderRadiusAll'} fz={'sm'}  >
                                    <ScrollArea h={122} type="never">
                                        <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                            <Grid gutter={{ base: 4 }}>
                                                <Grid.Col span={'6'}>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Voucher')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.voucher_name && salesViewData.voucher_name}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Mode')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.voucher_mode && salesViewData.voucher_mode}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('InvoiceNo')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.invoice_no && salesViewData.invoice_no}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('issueDate')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData?.issue_date}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Grid.Col>
                                                {/*<Grid.Col span={'6'}>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Created')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.created && salesViewData.created}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('CreatedBy')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.createdByName && salesViewData.createdByName}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('SalesBy')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.salesByUser && salesViewData.salesByUser}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Mode')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.mode_name && salesViewData.mode_name}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={15} gutter={{ base: 4 }}>
                                                        <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Process')}</Text></Grid.Col>
                                                        <Grid.Col span={9} >
                                                            <Text fz="sm" lh="xs">
                                                                {salesViewData && salesViewData.process && salesViewData.process}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Grid.Col>*/}
                                            </Grid>
                                        </Box>
                                    </ScrollArea>
                                    <ScrollArea h={height} scrollbarSize={2} type="never">
                                        <Box >
                                            <Table stickyHeader>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                        <Table.Th fz="xs" ta="left" w={'300'}>{t('LedgerName')}</Table.Th>

                                                        <Table.Th fz="xs" ta="center" w={"60"}>
                                                            {t("Amount")}
                                                        </Table.Th>
                                                        <Table.Th fz="xs" ta="center" w={'60'}>{t('Debit')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'80'}>{t('Credit')}</Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>{rows}</Table.Tbody>
                                                <Table.Tfoot>
                                                    <Table.Tr>
                                                        <Table.Th colSpan={'4'} ta="right" fz="xs" w={'100'}>{t('Debit')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>
                                                            {salesViewData && salesViewData.debit && Number(salesViewData.debit).toFixed(2)}
                                                        </Table.Th>
                                                    </Table.Tr>
                                                    <Table.Tr>
                                                        <Table.Th colSpan={'4'} ta="right" fz="xs" w={'100'}>{t('Credit')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>
                                                            {salesViewData && salesViewData.credit && Number(salesViewData.credit).toFixed(2)}
                                                        </Table.Th>
                                                    </Table.Tr>
                                                </Table.Tfoot>
                                            </Table>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                                <Button.Group mb={'1'}>
                                    {/*<Button
                                        fullWidth={true}
                                        variant="filled"
                                        leftSection={<IconPrinter size={14} />}
                                        color="green.5"
                                        onClick={() => {
                                            setPrintA4(true)
                                        }}
                                    >
                                        {t('Print')}
                                    </Button>
                                    <Button
                                        fullWidth={true}
                                        variant="filled"
                                        leftSection={<IconReceipt size={14} />}
                                        color="red.5"
                                        onClick={() => {
                                            setPrintPos(true);
                                        }}
                                    >
                                        {t('Pos')}
                                    </Button>
                                    {!checked && <Button
                                        onClick={() => navigate(`/inventory/sales/edit/${salesViewData?.id}`)}
                                        component="a"
                                        fullWidth={true}
                                        variant="filled"
                                        leftSection={<IconEdit size={14} />}
                                        color="cyan.5"
                                    >{t('Edit')}
                                    </Button>}*/}

                                </Button.Group>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={1} >
                            <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                <__ShortcutTable
                                    form=''
                                    FormSubmit={'EntityFormSubmit'}
                                    Name={'CompanyName'}
                                />
                            </Box>
                        </Grid.Col>
                </Grid>
            </Box>
        </Box>

    );
}
export default _VoucherTable;
