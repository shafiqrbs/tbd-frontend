import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeywordSearch from "../common/KeywordSearch";
import {Box, Switch, Flex, Group, Button, Menu, ActionIcon, rem, Text} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from '../../../../assets/css/Table.module.css';
import { modals } from "@mantine/modals";
import {IconCheck, IconDotsVertical, IconTrashX} from '@tabler/icons-react'
import {getIndexEntityData} from "../../../../store/production/crudSlice.js";
import {notifications} from "@mantine/notifications";
import {storeEntityData} from "../../../../store/core/crudSlice.js";

export default function BatchTable(){
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const { isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;
    const indexData = useSelector((state) => state.productionCrudSlice.indexEntityData);
    const productionBatchFilterData = useSelector((state) => state.productionCrudSlice.productionBatchFilterData);
    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword);
    const fetching = useSelector((state) => state.productionCrudSlice.fetching);
    const [reloadBatchData,setReloadBatchData] = useState(false)

    const perPage = 20;
    const [page,setPage] = useState(1);
    const navigate = useNavigate()


    useEffect(() => {
        const value = {
            url: 'production/batch',
            param: {
                term: searchKeyword,
                invoice: productionBatchFilterData.invoice,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
        setReloadBatchData(false)
    }, [fetching,reloadBatchData]);

    const [swtichEnable, setSwitchEnable] = useState({});

    const handleSwtich = (event, item) => {
        setSwitchEnable(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setSwitchEnable(prev => ({ ...prev, [item.id]: false }));
        }, 3000)
    }

    return (
        <>
            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                    <KeywordSearch module={'production-batch'} />
            </Box>
            <Box className="borderRadiusAll">
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
                            accessor: 'id',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        { accessor: 'created_date', title: t('CreatedDate') },
                        { accessor: 'issue_date', title: t('IssueDate') },
                        { accessor: 'invoice', title: t('Invoice') },
                        { accessor: 'process', title: t('Process') },
                        { accessor: 'created_by_name', title: t('CreatedBy') },
                        {
                            accessor: 'status',
                            title: t("Status"),
                            textAlign: 'center',
                            render: (item) => (
                                <Flex justify="center" align="center">
                                    <Switch
                                        disabled={swtichEnable[item.id] || false}
                                        defaultChecked={item.status == 1 ? true : false}
                                        color="red"
                                        radius="xs"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(event) => {
                                            handleSwtich(event, item);
                                        }}
                                    />
                                </Flex>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    {
                                        item.process === 'created' &&
                                        <Button
                                            component="a"
                                            size="compact-xs"
                                            radius="xs"
                                            variant="filled"
                                            fw={'100'}
                                            fz={'12'}
                                            color="yellow.8"
                                            mr={'4'}
                                            onClick={(event) => {
                                                modals.openConfirmModal({
                                                    title: (
                                                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                    ),
                                                    children: (
                                                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                    ),
                                                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                                                    onCancel: () => console.log('Cancel'),
                                                    onConfirm: async () => {
                                                        const value = {
                                                            url: 'production/batch/approve/'+item.id,
                                                            data: {}
                                                        }

                                                        const resultAction = await dispatch(storeEntityData(value));

                                                        if (storeEntityData.rejected.match(resultAction)) {
                                                            const fieldErrors = resultAction.payload.errors;
                                                            console.log(fieldErrors)
                                                        } else if (storeEntityData.fulfilled.match(resultAction)) {
                                                            notifications.show({
                                                                color: 'teal',
                                                                title: t('ApproveSuccessfully'),
                                                                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                                                loading: false,
                                                                autoClose: 700,
                                                                style: {backgroundColor: 'lightgray'},
                                                            });
                                                            setReloadBatchData(true)
                                                        }
                                                    },
                                                });
                                            }}
                                        >  {t('Approved')}</Button>
                                    }

                                    <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="green.8" mr={'4'}
                                        onClick={() => {
                                            {
                                                // navigate(`/production/recipe-update/${item.id}`)
                                            }
                                        }}
                                    >  {t('Show')}</Button>

                                    {
                                        item.process === 'created' &&
                                        <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.6" mr={'4'}
                                                onClick={() => {
                                                    {
                                                        navigate(`/production/batch/${item.id}`)
                                                    }
                                                }}
                                        >  {t('Edit')}</Button>
                                    }



                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                    <Menu.Target>
                                        <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                            <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
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
                                                        dispatch(deleteEntityData('inventory/product/' + data.id))
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
                    fetching={fetching || reloadBatchData}
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
        </>
    );
}