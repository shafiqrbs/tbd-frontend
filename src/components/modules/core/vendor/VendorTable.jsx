import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, Menu, rem, Button
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDotsVertical, IconTrashX, IconAlertCircle,IconFolder } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setDeleteMessage,
    setFetching, setFormLoading,
    setInsertType,
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import VendorViewDrawer from "./VendorViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import LedgerViewDrawer from "../../accounting/ledger/LedgerViewDrawer";
import LedgerDetailsModel from "../../accounting/ledger/LedgerDetailsModel";
function VendorTable() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const [fetching,setFetching] = useState(true)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const fetchingReload = useSelector((state) => state.crudSlice.fetching)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)
    const entityDataDelete = useSelector((state) => state.crudSlice.entityDataDelete)
    const coreVendors = JSON.parse(localStorage.getItem('core-vendors') || '[]');

    const [vendorObject, setVendorObject] = useState({});
    const navigate = useNavigate();
    const [viewDrawer, setViewDrawer] = useState(false);


    useEffect(() => {
        dispatch(setDeleteMessage(''))
        if (entityDataDelete.message === 'delete') {
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


    const [indexData,setIndexData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setFetching(true)
            const value = {
                url: 'core/vendor',
                param: {
                    term: searchKeyword,
                    name: vendorFilterData.name,
                    mobile: vendorFilterData.mobile,
                    company_name: vendorFilterData.company_name,
                    page: page,
                    offset: perPage
                }
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                    setFetching(false)
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        };

        fetchData();
    }, [dispatch, searchKeyword, vendorFilterData, page,fetchingReload]);

    const [ledgerViewDrawer, setLedgerViewDrawer] = useState(false)
    const [ledgerDetails,setLedgerDetails] = useState(null)
    return (
        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                <KeywordSearch module={'vendor'} />
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
                        { accessor: 'group_name', title: t("GroupName") },
                        { accessor: 'name', title: t("Name") },
                        { accessor: 'company_name', title: t("CompanyName") },
                        { accessor: 'mobile', title: t("Mobile") },
                        { accessor: 'outstanding', title: t("Outstanding") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button
                                        size="compact-xs"
                                        radius="xs"
                                        variant="filled"
                                        fw={'100'} fz={'12'}  color='var(--theme-primary-color-6)' mr={'4'}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setLedgerDetails(data)
                                        }}
                                    >  {t('Ledger')}</Button>
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color='var(--theme-primary-color-6)' radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                // href={`/inventory/sales/edit/${data.id}`}
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('core/vendor/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                    navigate(`/core/vendor/${data.id}`)
                                                }}

                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>

                                            <Menu.Item
                                                onClick={() => {
                                                    const foundVendors = coreVendors.find(type => type.id == data.id);
                                                    if (foundVendors) {
                                                        setVendorObject(foundVendors);
                                                        setViewDrawer(true)
                                                    }
                                                    else {
                                                        notifications.show({
                                                          color: "red",
                                                          title: t(
                                                            "Something Went wrong , please try again"
                                                          ),
                                                          icon: (
                                                            <IconAlertCircle
                                                              style={{ width: rem(18), height: rem(18) }}
                                                            />
                                                          ),
                                                          loading: false,
                                                          autoClose: 900,
                                                          style: { backgroundColor: "lightgray" },
                                                        });
                                                      }
                                                    // dispatch(showEntityData('core/vendor/' + data.id))
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'red.1'}
                                                c={'red.6'}
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
                                                            dispatch(deleteEntityData('core/vendor/' + data.id))
                                                        },
                                                    });
                                                }}
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
                    height={height}
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box>
            {
                viewDrawer &&
                <VendorViewDrawer
                    viewDrawer={viewDrawer}
                    setViewDrawer={setViewDrawer}
                    vendorObject={vendorObject}
                />
            }
            {ledgerViewDrawer &&
            <LedgerViewDrawer ledgerViewDrawer={ledgerViewDrawer} setLedgerViewDrawer={setLedgerViewDrawer} />
            }
            {ledgerDetails &&
            <LedgerDetailsModel ledgerDetails={ledgerDetails} setLedgerDetails={setLedgerDetails} />
            }
        </>

    );
}

export default VendorTable;