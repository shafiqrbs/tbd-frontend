import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import tableCss from '../../../../assets/css/Table.module.css';
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Grid,
    Stack,
    Button,
    ScrollArea,
    Table,
    Menu,
    rem,
    Checkbox,
    Tooltip,
    LoadingOverlay
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconEdit,
    IconPrinter,
    IconReceipt, IconDotsVertical, IconTrashX,
    IconCheck,
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import {
    deleteEntityData,
    getIndexEntityData,
    setDeleteMessage,
    setFetching,
    setSalesFilterData,
    showInstantEntityData,
} from "../../../../store/inventory/crudSlice.js";
import __ShortcutTable from "../../shortcut/__ShortcutTable";
import _SalesSearch from "./_SalesSearch.jsx";
import { setSearchKeyword } from "../../../../store/core/crudSlice.js";
import { SalesPrintA4 } from "./print-component/SalesPrintA4.jsx";
import { SalesPrintPos } from "./print-component/SalesPrintPos.jsx";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

function _SalesTable() {
    const navigate = useNavigate();
    const printRef = useRef()
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 106; //TabList height 104
    const height = mainAreaHeight - 304; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [selectedRow, setSelectedRow] = useState('');
    const [printA4, setPrintA4] = useState(false);
    const [printPos, setPrintPos] = useState(false);
    const [checked, setChecked] = useState(false);
    const [indexData,setIndexData] = useState([])
    const [fetching,setFetching] = useState(true)



    useEffect(() => {
        dispatch(setSearchKeyword(''))
    }, [])

    const salesFilterData = useSelector((state) => state.inventoryCrudSlice.salesFilterData)
    const entityDataDelete = useSelector((state) => state.inventoryCrudSlice.entityDataDelete)

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    const [salesViewData, setSalesViewData] = useState({})

    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
        setSelectedRow(indexData.data && indexData.data[0] && indexData.data[0].invoice)
    }, [indexData.data])
    useHotkeys([['alt+n', () => {
        navigate('/inventory/sales-invoice');
    }]], []);
    const rows = salesViewData && salesViewData.sales_items && salesViewData.sales_items.map((element, index) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{index + 1}</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.quantity}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.uom}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.sales_price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sub_total}</Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        dispatch(setDeleteMessage(''))
        if (entityDataDelete === 'success') {
            notifications.show({
                color: 'red',
                title: t('DeleteSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                dispatch(setFetching(true))
            }, 700)
        }
    }, [entityDataDelete]);

    const fetchData = async () => {
        setFetching(true)
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const value = {
            url: 'inventory/sales',
            param: {
                term: salesFilterData.searchKeyword,
                customer_id: salesFilterData.customer_id,
                start_date: salesFilterData.start_date && new Date(salesFilterData.start_date).toLocaleDateString("en-CA", options),
                end_date: salesFilterData.end_date && new Date(salesFilterData.end_date).toLocaleDateString("en-CA", options),
                page: page,
                offset: perPage
            }
        }

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error('Error:', resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData(resultAction.payload);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }finally {
            setFetching(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [salesFilterData,page]);

    const [checkList, setCheckList] = useState({});
    const CheckItemsHandel = (e, item) => {
        const value = e.currentTarget.value;
        const isChecked = e.currentTarget.checked;

        if (isChecked) {
            setCheckList(prevCheckList => ({ ...prevCheckList, [value]: Number(value) }));
        } else {
            setCheckList(prevCheckList => {
                delete prevCheckList[value];
                return { ...prevCheckList };
            });
        }

        if ((isChecked && !Object.keys(checkList).length) || (!isChecked && !Object.keys(checkList).length)) {
            dispatch(setSalesFilterData({
                ...salesFilterData,
                ['customer_id']: isChecked ? item.customerId : ''
            }));
            dispatch(setFetching(true));
        }
    }

    const handleDomainCustomerSalesProcess = async (id) => {
        try {
            const resultAction = await dispatch(showInstantEntityData('inventory/sales/domain-customer/' + id));
            if (showInstantEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    // Show success notification
                    showNotificationComponent(t("SalesComplete"), 'teal', 'lightgray', null, false, 1000, true)
                }
            }
        } catch (error) {
            console.error("Error updating entity:", error);
            showNotificationComponent(t("DeleteFailed"), 'red', 'lightgray', null, false, 1000, true)
        }finally {
            fetchData();
        }

    };

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={24} >
                        <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                            <Grid>
                                <Grid.Col>
                                    <Stack >
                                        <_SalesSearch checkList={checkList} customerId={salesFilterData.customer_id} />
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={15} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
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
                                            render: (item) => (
                                                <Tooltip color="green" withArrow={'center'} label={item.invoice + ' - ' + item.customerName}>
                                                    <Checkbox
                                                        value={item.id}
                                                        // checked={!!checkList?.[item.id]}
                                                        checked={!!checkList?.[item.id] || (item?.invoice_batch_id ? true : false)}
                                                        variant="filled"
                                                        radius="xs"
                                                        size="md"
                                                        color="green"
                                                        onChange={(e) => CheckItemsHandel(e, item)}
                                                        disabled={item?.invoice_batch_id ? true : false}
                                                    />
                                                </Tooltip>
                                            )
                                        },

                                        { accessor: 'created', title: t("Created") },
                                        {
                                            accessor: 'invoice',
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
                                                        setSelectedRow(item.invoice)
                                                        item?.invoice_batch_id ? setChecked(true) : setChecked(false)
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {item.invoice}
                                                </Text>

                                            )
                                        },
                                        { accessor: 'customerName', title: t("Customer") },
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
                                            accessor: 'payment',
                                            title: t("Receive"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.payment ? Number(data.payment).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },
                                        {
                                            accessor: 'due',
                                            title: t("Due"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <>
                                                    {data.total ? (Number(data.total) - Number(data.payment)).toFixed(2) : "0.00"}
                                                </>
                                            )
                                        },
                                        {
                                            accessor: "action",
                                            title: t("Action"),
                                            textAlign: "right",
                                            render: (data) => (

                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                                        <Menu.Target>
                                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            {
                                                                data.customer_group=='domain' &&
                                                                <Menu.Item
                                                                    onClick={()=>{
                                                                        modals.openConfirmModal({
                                                                            title: (<Text size="md"> {t("SalesConformation")}</Text>),
                                                                            children: (
                                                                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>),
                                                                            labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                                            onCancel: () => console.log('Cancel'),
                                                                            onConfirm: () => {
                                                                                handleDomainCustomerSalesProcess(data.id)
                                                                            },
                                                                        });
                                                                    }}
                                                                    component="a"
                                                                    w={'200'}
                                                                >
                                                                    {t('CompleteSales')}
                                                                </Menu.Item>
                                                            }
                                                            {
                                                                !data.invoice_batch_id &&
                                                                <Menu.Item
                                                                    onClick={() => {
                                                                        navigate(`/inventory/sales/edit/${data.id}`)
                                                                    }}
                                                                    component="a"
                                                                    w={'200'}
                                                                >
                                                                    {t('Edit')}
                                                                </Menu.Item>
                                                            }
                                                            <Menu.Item
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setLoading(true)
                                                                    setSalesViewData(data)
                                                                    setSelectedRow(data.invoice)
                                                                    data?.invoice_batch_id ? setChecked(true) : setChecked(false)
                                                                }}
                                                                component="a"
                                                                w={'200'}
                                                            >
                                                                {t('Show')}
                                                            </Menu.Item>
                                                            {
                                                                !data.invoice_batch_id &&
                                                                <Menu.Item
                                                                    onClick={() => {
                                                                        modals.openConfirmModal({
                                                                            title: (
                                                                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                                            ),
                                                                            children: (
                                                                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                            ),
                                                                            labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                                            confirmProps: { color: 'red.6' },
                                                                            onCancel: () => console.log('Cancel'),
                                                                            onConfirm: () => {
                                                                                {
                                                                                    dispatch(deleteEntityData('inventory/sales/' + data.id));
                                                                                }
                                                                            },
                                                                        });
                                                                    }}
                                                                    component="a"
                                                                    w={'200'}
                                                                    mt={'2'}
                                                                    bg={'red.1'}
                                                                    c={'red.6'}
                                                                    rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                                                >
                                                                    {t('Delete')}
                                                                </Menu.Item>
                                                            }
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
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                {t('Invoice')}: {salesViewData && salesViewData.invoice && salesViewData.invoice}
                            </Box>
                            <Box className={'borderRadiusAll'} fz={'sm'}  >
                                <ScrollArea h={122} type="never">
                                    <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                        <Grid gutter={{ base: 4 }}>
                                            <Grid.Col span={'6'}>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Customer')}</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.customerName && salesViewData.customerName}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Mobile')}</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.customerMobile && salesViewData.customerMobile}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Address')}</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.customer_address && salesViewData.customer_address}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Balance')}</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.balance ? Number(salesViewData.balance).toFixed(2) : 0.00}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Grid.Col>
                                            <Grid.Col span={'6'}>
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
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </ScrollArea>
                                <ScrollArea h={height} scrollbarSize={2} type="never">
                                    <Box >
                                        <Table stickyHeader>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>{t('Name')}</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>{t('QTY')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>{t('UOM')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>{t('Price')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>{rows}</Table.Tbody>
                                            <Table.Tfoot>
                                                <Table.Tr>
                                                    <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.sub_total && Number(salesViewData.sub_total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.discount && Number(salesViewData.discount).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.total && Number(salesViewData.total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.payment && Number(salesViewData.payment).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Due')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.total && (Number(salesViewData.total) - Number(salesViewData.payment)).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                            <Button.Group mb={'1'}>
                                <Button
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
                                </Button>}

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
            {printA4 && <div style={{ display: "none" }}>
                <SalesPrintA4 salesViewData={salesViewData} setPrintA4={setPrintA4} /></div>}
            {printPos && <div style={{ display: "none" }}>
                <SalesPrintPos salesViewData={salesViewData} setPrintPos={setPrintPos} />
            </div>}
        </>
    );
}

export default _SalesTable;