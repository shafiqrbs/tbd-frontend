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

function InvoiceBatchModalTable(props) {
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
        { name: ' Joggers', quantity: 10, price: 100, total: 1000 },
        { name: 'T-Shirt', quantity: 5, price: 50, total: 250 },
        { name: 'Jeans', quantity: 2, price: 400, total: 800 },
    ]
    // const row = element.map((element) => (
    //     <Table.Tr key={element.name}>
    //         <Table.Td>{element.quantity}</Table.Td>
    //         <Table.Td>{element.price}</Table.Td>
    //         <Table.Td>{element.total}</Table.Td>
    //     </Table.Tr>
    // ));
    
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
                            accessor: 'name',
                            title: t("Name"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                // c="red.6"
                                // style={{ cursor: "pointer" }}
                                >
                                    {rowData.name}
                                </Text>

                            )
                        },
                        {
                            accessor: 'quantity',
                            title: t("Quantity"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                // c="red.6"
                                // style={{ cursor: "pointer" }}
                                >
                                    {rowData.quantity}
                                </Text>

                            )
                        },
                        {
                            accessor: 'price',
                            title: t("Price"),
                            render: (rowData) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                // c="red.6"
                                // style={{ cursor: "pointer" }}
                                >
                                    {rowData.price}
                                </Text>
                            )
                        },
                        {
                            accessor: 'total',
                            title: t("Total"),
                            textAlign: "right",
                            render: (rowData) => (
                                <>
                                    {rowData.total}
                                </>
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

export default InvoiceBatchModalTable;