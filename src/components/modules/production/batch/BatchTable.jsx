import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeywordSearch from "../common/KeywordSearch";
import {Box, Switch, Flex, Group, Button, Menu, ActionIcon, rem, Text} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from '../../../../assets/css/Table.module.css';
import { modals } from "@mantine/modals";
import {IconDotsVertical, IconFilePencil, IconTrashX} from '@tabler/icons-react'
import {storeEntityData , getIndexEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

export default function BatchTable(){
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const { isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;
    const [indexData,setIndexData] = useState([])
    const productionBatchFilterData = useSelector((state) => state.productionCrudSlice.productionBatchFilterData);
    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword);
    const fetching = useSelector((state) => state.productionCrudSlice.fetching);
    const [reloadBatchData,setReloadBatchData] = useState(false)

    const perPage = 20;
    const [page,setPage] = useState(1);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'production/batch',
                param: {
                    term: searchKeyword,
                    invoice: productionBatchFilterData.invoice,
                    page: page,
                    offset: perPage
                }
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                // Handle rejected state
                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                }
                // Handle fulfilled state
                else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload)
                }
                setReloadBatchData(false);
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            }
        };

        // Call the async function
        fetchData();
    }, [dispatch, fetching, reloadBatchData]);

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
                                    {/*{
                                        (item.process ==='Approved' ) &&
                                        <Button
                                            component="a"
                                            size="compact-xs"
                                            radius="xs"
                                            variant="filled"
                                            fw={'100'}
                                            fz={'12'}
                                            color="blue.8"
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
                                                            url: 'production/batch/confirm-receive/'+item.id,
                                                            data: {}
                                                        }

                                                        const resultAction = await dispatch(storeEntityData(value));

                                                        if (storeEntityData.rejected.match(resultAction)) {
                                                            showNotificationComponent(
                                                                resultAction.payload?.message || t('ErrorOccurred'),
                                                                'red',
                                                                'lightgray'
                                                            );
                                                        } else if (storeEntityData.fulfilled.match(resultAction)) {
                                                            showNotificationComponent(
                                                                t('ReceivedSuccessfully'),
                                                                'teal',
                                                                'lightgray'
                                                            );
                                                        }
                                                        setReloadBatchData(true)
                                                    },
                                                });
                                            }}
                                        >  {t('ReceiveProduction')}</Button>
                                    }*/}
                                    {/*{
                                        item.process === 'Created' &&
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
                                                            showNotificationComponent(
                                                                resultAction.payload?.message || t('ErrorOccurred'),
                                                                'red',
                                                                'lightgray'
                                                            );
                                                        } else if (storeEntityData.fulfilled.match(resultAction)) {
                                                            showNotificationComponent(
                                                                t('ApprovedSuccessfully'),
                                                                'teal',
                                                                'lightgray'
                                                            );
                                                        }
                                                        setReloadBatchData(true)
                                                    },
                                                });
                                            }}
                                        >  {t('Approved')}</Button>
                                    }*/}

                                    {/*<Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="green.8" mr={'4'}
                                        onClick={() => {
                                            {
                                                // navigate(`/production/recipe-update/${item.id}`)
                                            }
                                        }}
                                    >  {t('Show')}</Button>*/}





                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                    <Menu.Target>
                                        <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                            <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>

                                        {
                                            item.process === 'Approved' &&
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'blue.9'}
                                                c={'blue.1'}
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
                                                                url: 'production/batch/confirm-receive/'+item.id,
                                                                data: {}
                                                            }

                                                            const resultAction = await dispatch(storeEntityData(value));

                                                            if (storeEntityData.rejected.match(resultAction)) {
                                                                showNotificationComponent(
                                                                    resultAction.payload?.message || t('ErrorOccurred'),
                                                                    'red',
                                                                    'lightgray'
                                                                );
                                                            } else if (storeEntityData.fulfilled.match(resultAction)) {
                                                                showNotificationComponent(
                                                                    t('ReceivedSuccessfully'),
                                                                    'teal',
                                                                    'lightgray'
                                                                );
                                                            }
                                                            setReloadBatchData(true)
                                                        },
                                                    });
                                                }}
                                            >
                                                {t('ReceiveProduction')}
                                            </Menu.Item>
                                        }
                                        {
                                            item.process === 'Created' &&
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'yellow.9'}
                                                c={'yellow.1'}
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
                                                                showNotificationComponent(
                                                                    resultAction.payload?.message || t('ErrorOccurred'),
                                                                    'red',
                                                                    'lightgray'
                                                                );
                                                            } else if (storeEntityData.fulfilled.match(resultAction)) {
                                                                showNotificationComponent(
                                                                    t('ApprovedSuccessfully'),
                                                                    'teal',
                                                                    'lightgray'
                                                                );
                                                            }
                                                            setReloadBatchData(true)
                                                        },
                                                    });
                                                }}
                                            >
                                                {t('Approved')}
                                            </Menu.Item>
                                        }

                                        {
                                            item.process === 'Created' &&
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'green.9'}
                                                c={'green.1'}
                                                onClick={() => {
                                                    navigate(`/production/batch/${item.id}`)
                                                }}
                                                rightSection={<IconFilePencil style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>
                                        }

                                        <Menu.Item
                                            target="_blank"
                                            component="a"
                                            w={'200'}
                                            mt={'2'}
                                            bg={'red.9'}
                                            c={'red.1'}
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