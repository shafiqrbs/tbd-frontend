import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, rem, Menu
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconEdit, IconTrash, IconCheck,
    IconDotsVertical,
    IconTrashX
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData, getIndexEntityData, setDeleteMessage, setFetching, setFormLoading, setInsertType
} from "../../../../store/inventory/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import tableCss from "../../../../assets/css/Table.module.css";

function CategoryTable() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 128; //TabList height 104
    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.inventoryCrudSlice.indexEntityData)
    const entityDataDelete = useSelector((state) => state.inventoryCrudSlice.entityDataDelete)


    useEffect(() => {
        dispatch(setDeleteMessage(''))
        if (entityDataDelete === 'delete') {
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


    useEffect(() => {
        const value = {
            url: 'inventory/category-group',
            param: {
                term: searchKeyword,
                type: 'category',
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>
            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                <KeywordSearch module={'category'} />
            </Box>
            <Box className={'borderRadiusAll'}>
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
                        { accessor: 'parent_name', title: t("ParentName") },
                        { accessor: 'name', title: t("Name") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon variant="outline" color="gray.6" radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                // href={`/inventory/sales/edit/${data.id}`}
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('inventory/category-group/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                }}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>

                                            <Menu.Item
                                                href={``}
                                                // onClick={() => {
                                                //     dispatch(setInsertType('update'))
                                                //     dispatch(editEntityData('core/user/' + data.id))
                                                //     dispatch(setFormLoading(true))
                                                // }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                // href={``}
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
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('inventory/category-group/' + data.id))
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

        </>
    );
}

export default CategoryTable;