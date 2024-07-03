import {Table,Box} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { DataTable } from 'mantine-datatable';
import tableCss from '../../../../assets/css/Table.module.css';
import classes from './RowExpansion.module.css';

function InvoiceBatchModalInvoice(props) {
    const {batchInvoice} = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 212; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

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
                    records={batchInvoice}
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
                            accessor: 'invoice',
                            title: 'Invoice Number',

                            render: (rowData) => (
                                <Box component="a" size="sm" variant="subtle" c={'red.6'} style={{ cursor: "pointer" }}>
                                    {rowData.invoice}
                                </Box>
                            )
                        },
                        {
                            accessor: 'created_at',
                            title: 'Created Date',
                            render: (rowData) => (
                                <Box component="a" size="sm" variant="subtle">
                                    {rowData.created_at}
                                </Box>
                            )
                        },
                        {
                            accessor: 'total',
                            title: 'Amount',
                            render: (rowData) => (
                                <Box component="a" size="sm" variant="subtle">
                                    {rowData.total}
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
                                        {(record.sales_items)
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
                                                {record.sub_total}
                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>
                                                {record.discount}
                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>
                                                {record.total}
                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>
                                                {record.received}
                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th colSpan={'5'} ta="right" fz="xs" w={'100'}>{t('Due')}</Table.Th>
                                            <Table.Th ta="right" fz="xs" w={'100'}>
                                                {record.due}
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Tfoot>

                                </Table>
                            </Box>
                        ),
                    }}
                    totalRecords={batchInvoice.length}
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

export default InvoiceBatchModalInvoice;
