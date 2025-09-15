import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,Image,
    Box,
    ActionIcon, Text, Menu, rem
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconDotsVertical } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
} from "../../../../store/accounting/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import CustomerViewModel from "../../core/customer/CustomerViewModel.jsx";
import useTransactionModeDataStoreIntoLocalStorage
    from "../../../global-hook/local-storage/useTransactionModeDataStoreIntoLocalStorage.js";

function TransactionModeTable(props) {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104
    const perPage = 50;
    const [page, setPage] = useState(1);
    const [customerViewModel, setCustomerViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const navigate = useNavigate()

    useEffect(() => {
        const value = {
            url: 'accounting/transaction-mode',
            param: {
                term: searchKeyword,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
        useTransactionModeDataStoreIntoLocalStorage(JSON.parse(localStorage.getItem('user')).id)
    }, [fetching]);

    return (

        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'}  >
                <KeywordSearch module={'customer'} />
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
                        { accessor: 'name', title: t('Name') },
                        { accessor: 'method_name', title: t('MethodName') },
                        {
                            accessor: 'bank_name',
                            title: t('BankName'),
                            render: (item) => (
                                <span dangerouslySetInnerHTML={{ __html: item.bank_name }} />
                            )
                        },
                        {
                            accessor: 'authorized_name',
                            title: t('Authorised'),
                            render: (item) => (
                                <span dangerouslySetInnerHTML={{ __html: item.authorized_name }} />
                            )
                        },
                        { accessor: 'service_charge', title: t('Charge(%)') },
                        {
                            accessor: 'path',
                            title: t('Image'),
                            width:"100px",
                            render: (item) => (
                                <Image
                                    radius="md"
                                    w="70%"
                                    src={isOnline ? item.path : '/images/transaction-mode-offline.jpg'}
                                    alt={item.method_name}
                                />
                            )
                        },

                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <>

                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                                <Menu.Target>
                                                    <ActionIcon size="sm" variant="outline" color='var(--theme-primary-color-6)' radius="xl" aria-label="Settings">
                                                        <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        onClick={() => {
                                                            dispatch(setInsertType('update'))
                                                            dispatch(editEntityData('accounting/transaction-mode/' + data.id))
                                                            dispatch(setFormLoading(true))
                                                            navigate(`/accounting/transaction-mode/${data.id}`);
                                                        }}
                                                    >
                                                        {t('Edit')}
                                                    </Menu.Item>

                                                    <Menu.Item
                                                        onClick={() => {
                                                            console.log('ok')
                                                        }}
                                                        target="_blank"
                                                        component="a"
                                                        w={'200'}
                                                    >
                                                        {t('Show')}
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Group>

                                    </>

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
                    height={height}
                    scrollAreaProps={{ type: 'never' }}
                />
                {
                    customerViewModel &&
                    <CustomerViewModel customerViewModel={customerViewModel} setCustomerViewModel={setCustomerViewModel} />
                }

            </Box>
        </>

    );
}
export default TransactionModeTable;
