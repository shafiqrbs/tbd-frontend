import {Box,Text} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { DataTable } from 'mantine-datatable';
import tableCss from '../../../../assets/css/Table.module.css';
import { setFetching } from "../../../../store/inventory/crudSlice.js";

function InvoiceBatchModalTable(props) {
    const {invoiceBatchItems} = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 212; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    return (
        <>
            <Box className='borderRadiusAll' p={'xs'}>
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={invoiceBatchItems}
                    columns={[
                        {
                            accessor: 'index',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (rowData, rowIndex) => (
                                rowIndex + 1
                            )
                        },
                        {
                            accessor: 'name',
                            title: t("Name"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                >
                                    {rowData.name}
                                </Text>

                            )
                        },
                        {
                            accessor: 'quantity',
                            textAlign: "center",
                            title: t("Quantity"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                >
                                    {rowData.quantity}
                                </Text>

                            )
                        },
                        {
                            accessor: 'uom',
                            textAlign: "center",
                            title: t("UOM"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                >
                                    {rowData.quantity}
                                </Text>

                            )
                        },
                        {
                            accessor: 'price',
                            title: t("Price"),
                            textAlign: "right",
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                >
                                    {rowData.price}
                                </Text>
                            )
                        },
                        {
                            accessor: 'sub_total',
                            title: t("SubTotal"),
                            textAlign: "right",
                            render: (rowData) => (
                                <>
                                    {rowData.sub_total}
                                </>
                            )
                        },

                    ]
                    }

                    loaderSize="xs"
                    loaderColor="grape"
                    height={tableHeight}
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box>
        </>
    );
}

export default InvoiceBatchModalTable;