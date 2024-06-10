import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
    Modal, Button, Flex, Progress, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Checkbox, Group, Menu, ActionIcon, rem, Table
} from '@mantine/core';
// import SampleModal from './SampleModal';

import { useTranslation } from 'react-i18next';
import { useEffect, } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconInfoCircle,
    IconDotsVertical,
    IconTrashX
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { DataTable } from 'mantine-datatable';
import tableCss from '../../../../assets/css/Table.module.css';
import { getIndexEntityData, setFetching, setSalesFilterData } from "../../../../store/inventory/crudSlice.js";

function InvoiceBatchModal(props) {
    const theme = useMantineTheme();
    const closeModel = () => {
        props.setBatchViewModal(false)
    }

    useEffect(() => {
        console.log(props.batchViewModal);
    }, []);
    const { currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const tableHeight = mainAreaHeight - 150; //TabList height 104
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const icon = <IconInfoCircle />;
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const indexData = useSelector((state) => state.inventoryCrudSlice.indexEntityData)
    const [salesViewData, setSalesViewData] = useState({})

    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching)
    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
    }, [indexData.data])
    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
    }, [indexData.data])

    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)
    const perPage = 50;
    const [page, setPage] = useState(1);

    let salesSubTotalAmount = 0
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


    const [checkList, setCheckList] = useState({});
    return (
        <>

            <Modal opened={props.batchViewModal} onClose={closeModel} title={t('UserInformation')} fullScreen overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
                opacity: 0.9,
                blur: 3,
            }}>
                <Box>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={7} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Title order={6} pl={'6'}>{t('Item')}</Title>
                                </Box>
                                <Box className={'borderRadiusAll'} h={height}>
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
                                                records={rows}
                                                columns={[
                                                    {
                                                        accessor: 'index',
                                                        title: t('S/N'),
                                                        textAlignment: 'right',
                                                        render: (item) => (
                                                            rows.indexOf(item) + 1
                                                        )
                                                    },

                                                    { accessor: 'name', title: t("Name") },
                                                    {
                                                        accessor: 'invoice',
                                                        title: t("Invoice"),
                                                        render: (item) => (
                                                            <Text
                                                                component="a"
                                                                size="sm"
                                                                variant="subtle"
                                                                c="red.6"
                                                                // onClick={(e) => {
                                                                //     e.preventDefault();
                                                                //     setLoading(true)
                                                                //     setSalesViewData(item)
                                                                // }}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                {item.item_name}
                                                            </Text>

                                                        )
                                                    },
                                                    { accessor: 'customerName', title: t("Customer") },
                                                    {
                                                        accessor: 'total',
                                                        title: t("Total"),
                                                        textAlign: "right",
                                                        render: (item) => (
                                                            <>
                                                                {item.total ? Number(data.total).toFixed(2) : "0.00"}
                                                            </>
                                                        )
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
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Title order={6} pl={'6'}>{t('Transaction')}</Title>
                                </Box>
                                <Box className={'borderRadiusAll'} h={height}>
                                    Body
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={9} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Title order={6} pl={'6'}>{t('Invoice')}</Title>
                                </Box>
                                <Box className={'borderRadiusAll'} h={height}>
                                    Body
                                </Box>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Modal >
        </>
    );
}

export default InvoiceBatchModal;