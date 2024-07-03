import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import tableCss from '../../../../assets/css/Table.module.css';
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Grid,
    Button,
    ScrollArea,
    Table,
    Menu,
    rem,
    LoadingOverlay
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconDotsVertical, IconTrashX,
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys, } from "@mantine/hooks";
import {
    getIndexEntityData,
    setFetching,
    setInvoiceBatchFilterData,
    setSalesFilterData
} from "../../../../store/inventory/crudSlice.js";
import _ShortcutTable from "../../shortcut/_ShortcutTable";
import { setSearchKeyword } from "../../../../store/core/crudSlice.js";
import InvoiceBatchModal from "./InvoiceBatchModal.jsx";
import _InvoiceBatchSearch from "./_InvoiceBatchSearch.jsx";
import _AddTransaction from "./drawer/_AddTransaction";
import LegderModal from "./modal/LedgerModal.jsx";

function InvoiceBatchTable() {
    const navigate = useNavigate();
    const printRef = useRef()
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 96; //TabList height 104
    const height = mainAreaHeight - 230; //TabList height 104
    const [batchViewModal, setBatchViewModal] = useState(false);
    const [addTransactionDrawer, setAddTransactionDrawer] = useState(false);
    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching)
    const invoiceBatchFilterData = useSelector((state) => state.inventoryCrudSlice.invoiceBatchFilterData)
    const salesFilterData = useSelector((state) => state.inventoryCrudSlice.salesFilterData)
    const indexData = useSelector((state) => state.inventoryCrudSlice.indexEntityData)

    useEffect(() => {
        dispatch(setSearchKeyword(''))
        dispatch(setSalesFilterData({
            ...salesFilterData,
            ['customer_id']: null
        }));
        dispatch(setInvoiceBatchFilterData({
            ...invoiceBatchFilterData,
            ['customer_id']: '',
            ['start_date']: '',
            ['end_date']: '',
            ['searchKeyword']: '',
        }));
        dispatch(setFetching(true))
    }, [])

    const [selectedRow, setSelectedRow] = useState('');
    const [batchLedgerModal, setBatchLedgerModal] = useState(false);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    const [invoiceBatchData, setInvoiceBatchData] = useState({})

    useEffect(() => {
        setInvoiceBatchData(indexData.data && indexData.data[0] && indexData.data[0])
        setSelectedRow(indexData.data && indexData.data[0] && indexData.data[0].invoice)
    }, [indexData.data])
    useHotkeys([['alt+n', () => {
        navigate('/inventory/sales-invoice');
    }]], []);


    const rows = invoiceBatchData && invoiceBatchData.invoice_batch_items && invoiceBatchData.invoice_batch_items.map((element, index) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{index + 1}</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.item_name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.quantity}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sales_price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sub_total}</Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const value = {
            url: 'inventory/invoice-batch',
            param: {
                term: invoiceBatchFilterData.searchKeyword,
                customer_id: invoiceBatchFilterData.customer_id,
                start_date: invoiceBatchFilterData.start_date && new Date(invoiceBatchFilterData.start_date).toLocaleDateString("en-CA", options),
                end_date: invoiceBatchFilterData.end_date && new Date(invoiceBatchFilterData.end_date).toLocaleDateString("en-CA", options),
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);


    return (
        <>

            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={15} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                                <_InvoiceBatchSearch checkList={[]} />
                            </Box>
                            <Box className={'borderRadiusAll border-top-none'}>

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
                                            accessor: 'invoice',
                                            title: t("Batch No"),
                                            render: (item) => (
                                                <Text
                                                    component="a"
                                                    size="sm"
                                                    variant="subtle"
                                                    c="red.4"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLoading(true)
                                                        setInvoiceBatchData(item)
                                                        setSelectedRow(item.invoice)
                                                    }}
                                                    style={{ cursor: "pointer" }}

                                                >
                                                    {item.invoice}
                                                </Text>

                                            )
                                        },
                                        { accessor: 'customer_name', title: t("Customer") },
                                        {
                                            accessor: 'sub_total',
                                            title: t("SubTotal"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.sub_total ? Number(data.sub_total).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },
                                        {
                                            accessor: 'discount',
                                            title: t("Discount"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.discount ? Number(data.discount).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },
                                        {
                                            accessor: 'total',
                                            title: t("Total"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.total ? Number(data.total).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },
                                        {
                                            accessor: 'received',
                                            title: t("Receive"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.received ? Number(data.received).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },

                                        {
                                            accessor: 'due',
                                            title: t("Due"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.due ? (Number(data.due)).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },
                                        {
                                            accessor: "action",
                                            title: t("Action"),
                                            textAlign: "right",
                                            render: (item) => (

                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    <Button size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.3" mr={'4'}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setAddTransactionDrawer(true)
                                                            setInvoiceBatchData(item)
                                                            setSelectedRow(item.invoice)
                                                        }}
                                                    >  {t('AddBill')}</Button>
                                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                                        <Menu.Target>
                                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                                <IconDotsVertical height={'16'} width={'16'} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setBatchLedgerModal(true)
                                                                }}
                                                                target=""
                                                                component="a"
                                                                w={'200'}
                                                            >
                                                                {t('Test')}
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setLoading(true)
                                                                    setInvoiceBatchData(item)
                                                                    setBatchViewModal(true)
                                                                }}
                                                                target=""
                                                                component="a"
                                                                w={'200'}
                                                            >
                                                                {t('ViewInvoiceBatch')}
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                href={``}
                                                                target=""
                                                                component="a"
                                                                w={'200'}
                                                                mt={'2'}
                                                                bg={'red.1'}
                                                                c={'red.6'}
                                                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                                            >
                                                                {t('Delete')}
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Group>
                                            ),
                                        },
                                    ]
                                    }
                                    fetching={fetching}
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
                                        if (item.invoice === selectedRow) return '#e2c2c263';
                                    }}
                                    rowColor={(item) => {
                                        if (item.invoice === selectedRow) return 'red.6';
                                    }}
                                />
                            </Box>
                        </Box>

                    </Grid.Col>

                    <Grid.Col span={8} >

                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} ref={printRef} pos="relative">
                            {loading &&
                                <LoadingOverlay
                                    visible={loading}
                                    zIndex={1000}
                                    overlayProps={{ radius: "sm", blur: 2 }}
                                    loaderProps={{ color: 'red' }}
                                />
                            }
                            <Box h={'42'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'xs'}  className={'boxBackground textColor borderRadiusAll'} >
                                {t('Invoice')}: {invoiceBatchData && invoiceBatchData.invoice && invoiceBatchData.invoice}
                            </Box>
                            <Box className={'borderRadiusAll border-top-none'} fz={'sm'}  >
                                <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                    <Grid gutter={{ base: 4 }}>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Customer')}</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoiceBatchData && invoiceBatchData.customer_name && invoiceBatchData.customer_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Mobile')}</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoiceBatchData && invoiceBatchData.customer_mobile && invoiceBatchData.customer_mobile}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Address')}</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoiceBatchData && invoiceBatchData.customer_address && invoiceBatchData.customer_address}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Balance')}</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoiceBatchData && invoiceBatchData.balance ? Number(invoiceBatchData.balance).toFixed(2) : 0.00}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Created')}</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoiceBatchData && invoiceBatchData.created && invoiceBatchData.created}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('CreatedBy')}</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoiceBatchData && invoiceBatchData.created_by_name && invoiceBatchData.created_by_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <ScrollArea h={height + 36} scrollbarSize={2} type="never" >
                                    <Box>
                                        <Table stickyHeader >
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>{t('Name')}</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>{t('QTY')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>{t('Price')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>{t('SalesPrice')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>{rows}</Table.Tbody>
                                            <Table.Tfoot>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoiceBatchData && invoiceBatchData.sub_total && Number(invoiceBatchData.sub_total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoiceBatchData && invoiceBatchData.discount && Number(invoiceBatchData.discount).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoiceBatchData && invoiceBatchData.total && Number(invoiceBatchData.total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoiceBatchData && invoiceBatchData.payment && Number(invoiceBatchData.payment).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Due')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoiceBatchData && invoiceBatchData.total && (Number(invoiceBatchData.total) - Number(invoiceBatchData.payment)).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>

                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <_ShortcutTable
                                form=''
                                FormSubmit={'EntityFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            {batchViewModal && <InvoiceBatchModal batchViewModal={batchViewModal} setBatchViewModal={setBatchViewModal} invoiceId={invoiceBatchData.id} />}
            {addTransactionDrawer && <_AddTransaction invoiceBatchData={invoiceBatchData} addTransactionDrawer={addTransactionDrawer} setAddTransactionDrawer={setAddTransactionDrawer} />}
            {batchLedgerModal && <LegderModal batchLedgerModal={batchLedgerModal} setBatchLedgerModal={setBatchLedgerModal} />}
        </>
    );
}

export default InvoiceBatchTable;