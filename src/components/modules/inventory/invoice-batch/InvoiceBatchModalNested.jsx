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

    const element = [
        { invoiceNumber: ' 7984564654', createdDate: '10/5/15', amount: 100 },
        { invoiceNumber: ' 7984564654', createdDate: '10/5/15', amount: 100 },
        { invoiceNumber: ' 7984564654', createdDate: '10/5/15', amount: 100 },
    ]

    const element1 = [
        { item_name: 'Joggers', quantity: 10, price: 100, sales_price: 110, sub_total: '1110' },
        { item_name: 'Joggers', quantity: 10, price: 100, sales_price: 110, sub_total: '1110' },
        { item_name: 'Joggers', quantity: 10, price: 100, sales_price: 110, sub_total: '1110' }
    ]

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
                    records={element}
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
                            accessor: 'invoiceNumber',
                            title: t("InvoiceNumber"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                // c="red.6"
                                // style={{ cursor: "pointer" }}
                                >
                                    {rowData.invoiceNumber}
                                </Text>

                            )
                        },
                        {
                            accessor: 'createdDate',
                            title: t("CreatedDate"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                // c="red.6"
                                // style={{ cursor: "pointer" }}
                                >
                                    {rowData.createdDate}
                                </Text>

                            )
                        },
                        {
                            accessor: 'amount',
                            title: t("Amount"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                // c="red.6"
                                // style={{ cursor: "pointer" }}
                                >
                                    {rowData.amount}
                                </Text>
                            )
                        },


                    ]
                    }
                    // fetching={fetching}
                    totalRecords={element.length}
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
        </>
    );
}

export default InvoiceBatchModalNested;