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
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import { getIndexEntityData, setFetching, setSalesFilterData } from "../../../../store/inventory/crudSlice.js";
import _ShortcutTable from "../../shortcut/_ShortcutTable";
import { ReactToPrint } from "react-to-print";
import _SalesSearch from "./_SalesSearch.jsx";
import { setSearchKeyword } from "../../../../store/core/crudSlice.js";

function _SalesTable() {
    const navigate = useNavigate();
    const printRef = useRef()
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 116; //TabList height 104
    const height = mainAreaHeight - 314; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(setSearchKeyword(''))
    }, [])

    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching)
    const salesFilterData = useSelector((state) => state.inventoryCrudSlice.salesFilterData)
    const indexData = useSelector((state) => state.inventoryCrudSlice.indexEntityData)

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    const [salesViewData, setSalesViewData] = useState({})

    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
    }, [indexData.data])
    useHotkeys([['alt+n', () => {
        navigate('/inventory/sales-invoice');
    }]], []);


    const rows = salesViewData && salesViewData.sales_items && salesViewData.sales_items.map((element, index) => (
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
        dispatch(getIndexEntityData(value))
    }, [fetching]);

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

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={24} >
                        <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                            <Grid>
                                <Grid.Col>
                                    <Stack >
                                        <_SalesSearch checkList={checkList} />
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
                                                <Tooltip label={item.invoice + ' - ' + item.customerName}>
                                                    <Checkbox
                                                        value={item.id}
                                                        checked={!!checkList?.[item.id]}
                                                        variant="outline"
                                                        radius="xl"
                                                        size="md"
                                                        color="red"
                                                        onChange={(e) => CheckItemsHandel(e, item)}
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
                                                            <ActionIcon variant="outline" color="gray.6" radius="xl" aria-label="Settings">
                                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                href={`/inventory/sales/edit/${data.id}`}
                                                                target="_blank"
                                                                component="a"
                                                                w={'200'}
                                                            >
                                                                {t('Edit')}
                                                            </Menu.Item>

                                                            <Menu.Item
                                                                href={``}
                                                                target="_blank"
                                                                component="a"
                                                                w={'200'}
                                                            >
                                                                {t('Show')}
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                href={``}
                                                                target="_blank"
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
                                <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                    <Grid gutter={{ base: 4 }}>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Customer</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.customerName && salesViewData.customerName}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mobile</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.customerMobile && salesViewData.customerMobile}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Address</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.customer_address && salesViewData.customer_address}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Balance</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.balance ? Number(salesViewData.balance).toFixed(2) : 0.00}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.created && salesViewData.created}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created By</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.createdByName && salesViewData.createdByName}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Sales By</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.salesByUser && salesViewData.salesByUser}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mode</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.mode_name && salesViewData.mode_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Process</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.process && salesViewData.process}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <ScrollArea h={height} scrollbarSize={2} type="never" >
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
                                                        {salesViewData && salesViewData.sub_total && Number(salesViewData.sub_total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.discount && Number(salesViewData.discount).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.total && Number(salesViewData.total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.payment && Number(salesViewData.payment).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Due')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.total && (Number(salesViewData.total) - Number(salesViewData.payment)).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                        <Box>
                            <Button.Group fullWidth>

                                <Button
                                    fullWidth
                                    variant="filled"
                                    leftSection={<IconPrinter size={14} />}
                                    color="green.5"
                                >
                                    <ReactToPrint
                                        trigger={() => {
                                            return <a href="#">Print</a>;
                                        }}
                                        content={() => printRef.current}
                                    />
                                </Button>
                                <Button
                                    fullWidth
                                    variant="filled"
                                    leftSection={<IconReceipt size={14} />}
                                    color="red.5"
                                >
                                    <ReactToPrint
                                        trigger={() => {
                                            return <a href="#">Pos</a>;
                                        }}
                                        content={() => printRef.current}
                                    />
                                </Button>

                                <Button
                                    href={`/inventory/sales/edit/${salesViewData?.id}`}
                                    component="a"
                                    fullWidth
                                    variant="filled"
                                    leftSection={<IconEdit size={14} />}
                                    color="cyan.5"
                                >
                                    Edit
                                </Button>
                            </Button.Group>
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
        </>
    );
}

export default _SalesTable;