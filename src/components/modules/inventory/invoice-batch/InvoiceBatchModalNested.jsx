import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
    Modal, Button, Flex, Progress, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Checkbox, Group, Menu, ActionIcon, rem, Table, Stack
} from '@mantine/core';
// import SampleModal from './SampleModal';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
import classes from './RowExpansion.module.css';

function InvoiceBatchModalNested(props) {
    const theme = useMantineTheme();

    // useEffect(() => {
    //     console.log(props.batchViewModal);
    // }, []);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const tableHeight = mainAreaHeight - 122; //TabList height 104
    const navigate = useNavigate();

    const perPage = 50;
    const [page, setPage] = useState(1);

    const [expnadedInvoice, setExpandedInvoice] = useState([]);

    const element = [
        { invoiceNumber: '7984564654', createdDate: '10/5/15', amount: 100 },
        { invoiceNumber: '7984564655', createdDate: '10/5/15', amount: 100 },
        { invoiceNumber: '7984564656', createdDate: '10/5/15', amount: 100 },
    ];

    const element1 = [
        { invoiceNumber: '7984564654', item_name: 'Joggers', quantity: 10, price: 100, sales_price: 110, sub_total: '1110' },
        { invoiceNumber: '7984564655', item_name: 'Jeans', quantity: 10, price: 100, sales_price: 110, sub_total: '1110' },
        { invoiceNumber: '7984564656', item_name: 'T-Shirt', quantity: 10, price: 100, sales_price: 110, sub_total: '1110' }
    ];

    return (
        <>
            <Box p={'xs'}>
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={element}
                    idAccessor="invoiceNumber"
                    columns={[
                        {
                            accessor: 'index',
                            title: 'S/N',
                            textAlignment: 'right',
                            render: (rowData, rowIndex) => (
                                rowIndex + 1
                            )
                        },
                        {
                            accessor: 'invoiceNumber',
                            title: 'Invoice Number',

                            render: (rowData) => (
                                <Box component="a" size="sm" variant="subtle" c={'red.6'} style={{ cursor: "pointer" }}>
                                    {rowData.invoiceNumber}
                                </Box>
                            )
                        },
                        {
                            accessor: 'createdDate',
                            title: 'Created Date',
                            render: (rowData) => (
                                <Box component="a" size="sm" variant="subtle">
                                    {rowData.createdDate}
                                </Box>
                            )
                        },
                        {
                            accessor: 'amount',
                            title: 'Amount',
                            render: (rowData) => (
                                <Box component="a" size="sm" variant="subtle">
                                    {rowData.amount}
                                </Box>
                            )
                        },
                    ]}
                    rowExpansion={{
                        content: ({ record }) => (
                            <Box className={classes.details} p="xs" gap={6}>
                                <Table stickyHeader>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>S/N</Table.Th>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>QTY</Table.Th>
                                            <Table.Th>Price</Table.Th>
                                            <Table.Th>SalesPrice</Table.Th>
                                            <Table.Th>SubTotal</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {element1
                                            .filter((data) => data.invoiceNumber === record.invoiceNumber)
                                            .map((data, index) => (
                                                <Table.Tr key={index}>
                                                    <Table.Td>{index + 1}</Table.Td>
                                                    <Table.Td>{data.item_name}</Table.Td>
                                                    <Table.Td>{data.quantity}</Table.Td>
                                                    <Table.Td>{data.price}</Table.Td>
                                                    <Table.Td>{data.sales_price}</Table.Td>
                                                    <Table.Td>{data.sub_total}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                    </Table.Tbody>
                                    <Table.Tfoot>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>

                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>

                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>

                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>

                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Due')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>

                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Tfoot>

                                </Table>
                            </Box>
                        ),
                    }}
                    totalRecords={element.length}
                    recordsPerPage={perPage}
                    onPageChange={(p) => {
                        setPage(p);
                        dispatch(setFetching(true));
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={tableHeight}
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box >
        </>
    );
}

export default InvoiceBatchModalNested;
