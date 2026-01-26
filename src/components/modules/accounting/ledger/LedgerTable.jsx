import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {Group, Box, ActionIcon, Text, rem, Menu, Button, Flex, Switch} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconDotsVertical, IconTrashX} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {editEntityData, getIndexEntityData, setFetching, setFormLoading, setInsertType, deleteEntityData} from "../../../../store/accounting/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {modals} from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import LedgerViewDrawer from "./LedgerViewDrawer.jsx";
import LedgerDetailsModel from "./LedgerDetailsModel.jsx";

function LedgerTable() {
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104
    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const [indexData, setIndexData] = useState([])
    const [ledgerDetails, setLedgerDetails] = useState(null)
    const [switchEnable, setSwitchEnable] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'accounting/account-head',
                param: {
                    group: 'ledger',
                    term: searchKeyword,
                    page: page,
                    offset: perPage
                }
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                }
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            }
        };

        fetchData();
    }, [fetching]);


    const handleSwitch = (event, item) => {
        setSwitchEnable((prev) => ({ ...prev, [item.id]: true }));
        dispatch(
            editEntityData(
                `accounting/account-head/status-update/${item.id}`
            )
        );
    };


    const navigate = useNavigate()
    const [ledgerViewDrawer, setLedgerViewDrawer] = useState(false)

    return (
        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'}>
                <KeywordSearch module={'ledger'}/>
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
                        {accessor: 'parent_name', title: t('ParentHead')},
                        {accessor: 'name', title: t('Name')},
                        {accessor: 'code', title: t('AccountCode')},
                        {
                            accessor: 'amount',
                            title: t('Amount'),
                            render: (item) => Math.round(item.amount),
                        },
                        {
                            accessor: "status",
                            title: t("Status"),
                            textAlign: "center",
                            render: (data) => (
                                <>
                                    <Flex justify="center" align="center">
                                        <Switch
                                            defaultChecked={data.status == 1 ? true : false}
                                            color='var(--theme-primary-color-6)'
                                            radius="xs"
                                            size="md"
                                            onLabel="Enable"
                                            offLabel="Disable"
                                            onChange={(event) => {
                                                handleSwitch(event.currentTarget.checked, data);
                                            }}
                                        />
                                    </Flex>
                                </>
                            ),
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <>
                                    <Group gap={4} justify="right" wrap="nowrap">

                                        <Button
                                            size="compact-xs"
                                            radius="xs"
                                            variant="filled"
                                            fw={'100'} fz={'12'} color='var(--theme-secondary-color-6)' mr={'4'}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setLedgerDetails(data)
                                            }}
                                        >  {t('Ledger')}</Button>

                                        <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100}
                                              closeDelay={400}>
                                            <Menu.Target>
                                                <ActionIcon size="sm" variant="outline"
                                                            color='var(--theme-primary-color-6)' radius="xl"
                                                            aria-label="Settings">
                                                    <IconDotsVertical height={'18'} width={'18'} stroke={1.5}/>
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                {/*{data.is_private !== 1 &&(*/}
                                                <Menu.Item
                                                    onClick={() => {
                                                        dispatch(setInsertType('update'))
                                                        dispatch(editEntityData('accounting/account-head/' + data.id))
                                                        dispatch(setFormLoading(true))
                                                        navigate(`/accounting/ledger/${data.id}`)
                                                    }}
                                                >
                                                    {t('Edit')}
                                                </Menu.Item>
                                                {/*)}*/}


                                                <Menu.Item
                                                    onClick={() => {
                                                        navigate(`/accounting/ledger/view/${data.id}`)
                                                    }}
                                                    target="_blank"
                                                    component="a"
                                                    w={'200'}
                                                >
                                                    {t('Show')}
                                                </Menu.Item>
                                                {data.is_private !== 1 && (
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
                                                                    <Text
                                                                        size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                ),
                                                                labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                                onCancel: () => console.log('Cancel'),
                                                                confirmProps: {color: 'red.6'},
                                                                onConfirm: () => {
                                                                    dispatch(deleteEntityData('accounting/account-head/' + data.id))
                                                                    dispatch(setFetching(true))
                                                                },
                                                            });
                                                        }}
                                                        rightSection={<IconTrashX
                                                            style={{width: rem(14), height: rem(14)}}/>}
                                                    >
                                                        {t('Delete')}
                                                    </Menu.Item>
                                                )}
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
                    scrollAreaProps={{type: 'never'}}
                />
            </Box>
            {ledgerViewDrawer &&
                <LedgerViewDrawer ledgerViewDrawer={ledgerViewDrawer} setLedgerViewDrawer={setLedgerViewDrawer}/>
            }
            {ledgerDetails &&
                <LedgerDetailsModel ledgerDetails={ledgerDetails} setLedgerDetails={setLedgerDetails}/>
            }
        </>

    );
}

export default LedgerTable;
