import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import tableCss from '../../../../assets/css/Table.module.css';
import {
    Group,
    Box,
    ActionIcon, Text, Grid, Stack, TextInput, Button, ScrollArea,Table
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconEye,
    IconEdit,
    IconTrash,
    IconSum,
    IconX,
    IconPrinter,
    IconReceipt,
    IconDeviceFloppy, IconStackPush
} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData, setEditEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData
} from "../../../../store/inventory/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import SalesViewModel from "./SalesViewModel.jsx";
import ShortcutTable from "../../shortcut/ShortcutTable";
import KeywordDateRangeSearch from "../../filter/KeywordDateRangeSearch";

const elements = [
    { index: 1, name: 'Monthly Software Service Charge-December (2023)', quantity: 10, price: 120, sales_price: 100, sub_total: '1000.00'},
    { index: 2, name: 'Mokhles Haski Rice - 25 Kg', quantity: 10, price: 120, sales_price: 100, sub_total: '1000.00'},
];

function SalesTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 116; //TabList height 104
    const height = mainAreaHeight - 314; //TabList height 104

    const perPage = 50;
    const [page,setPage] = useState(1);
    const [vendorViewModel,setVendorViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData)

    const [salesViewData,setSalesViewData] =useState({})

    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{element.index}</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.quantity}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sales_price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sub_total}</Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        const value = {
            url: 'inventory/sales',
            param: {
                term: searchKeyword,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);


    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={24} >
                        <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                            <Grid>
                                <Grid.Col>
                                    <Stack >
                                        <KeywordDateRangeSearch/>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base:8}}>
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
                                            title: 'S/N',
                                            textAlignment: 'right',
                                            render: (item) => (indexData.data.indexOf(item) + 1)
                                        },
                                        { accessor: 'created',  title: "Created" },
                                        { accessor: 'invoice',  title: "Invoice" },
                                        { accessor: 'customerName',  title: "Customer" },
                                        { accessor: 'sub_total',  title: "SubTotal" },
                                        { accessor: 'discount',  title: "Dis." },
                                        { accessor: 'total',  title: "Total" },
                                        {
                                            accessor: "action",
                                            title: "Action",
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="green"
                                                        onClick={()=>{
                                                            setSalesViewData(data)
                                                        }}
                                                    >
                                                        <IconEye size={16}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="blue"
                                                        onClick={() => {
                                                            dispatch(setInsertType('update'))
                                                            dispatch(editEntityData('inventory/sales/' + data.id))
                                                            dispatch(setFormLoading(true))
                                                        }}
                                                    >
                                                        <IconEdit size={16}/>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => {
                                                            modals.openConfirmModal({
                                                                title: (
                                                                    <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                                ),
                                                                children: (
                                                                    <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                ),
                                                                labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                                onCancel: () => console.log('Cancel'),
                                                                onConfirm: () => {
                                                                    dispatch(deleteEntityData('vendor/' + data.id))
                                                                    dispatch(setFetching(true))
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        <IconTrash size={16}/>
                                                    </ActionIcon>
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
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                Invoice: {salesViewData && salesViewData.invoice && salesViewData.invoice}
                            </Box>
                            <Box className={'borderRadiusAll'}  fz={'sm'}  >
                                <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'}  pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                    <Grid gutter={{base:4}}>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Customer</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414 sadas asdasd asdasd</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mobile</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Address</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Balance</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">12-04-24</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created By</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Sales By</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mode</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{base:4}}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Process</Text></Grid.Col>
                                                <Grid.Col span={9} ><Text fz="sm" lh="xs">021412414</Text></Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <ScrollArea h={height} scrollbarSize={2} type="never" >
                                <Box>
                                    <Table stickyHeader >
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th fz="xs" w={'20'}>S/N</Table.Th>
                                                <Table.Th fz="xs" ta="left" w={'300'}>Name</Table.Th>
                                                <Table.Th fz="xs" ta="center"  w={'60'}>QTY</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'80'}>Price</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'100'}>SalePrice</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'100'}>SubTotal</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>{rows}</Table.Tbody>
                                        <Table.Tfoot>
                                             <Table.Tr>
                                                <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>SubTotal</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'100'}>1231231</Table.Th>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>Discount</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'100'}>345</Table.Th>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>Total</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'100'}>324234</Table.Th>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>Receive</Table.Th>
                                                <Table.Th ta="right" fz="xs" w={'100'}>324234</Table.Th>
                                            </Table.Tr>
                                        </Table.Tfoot>
                                    </Table>
                                </Box>
                                </ScrollArea>
                                <Box>
                                    <Button.Group fullWidth>
                                        <Button fullWidth variant="filled" leftSection={<IconPrinter size={14}/>}
                                                color="green.5">Print</Button>
                                        <Button fullWidth variant="filled" leftSection={<IconReceipt size={14}/>}
                                                color="red.5">Pos</Button>
                                        <Button fullWidth variant="filled" leftSection={<IconEdit size={14}/>}
                                                color="cyan.5">Edit</Button>
                                    </Button.Group>
                                </Box>
                            </Box>

                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <ShortcutTable
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

export default SalesTable;