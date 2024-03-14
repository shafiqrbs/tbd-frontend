import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text, rem
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconEdit, IconTrash, IconCheck} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData, getIndexEntityData, setDeleteMessage, setFetching, setFormLoading, setInsertType
} from "../../../../store/inventory/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import {notifications} from "@mantine/notifications";

function CategoryTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

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
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: 'lightgray'},
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
            <Box>
                <Box bg={`white`}>
                    <Box pt={'xs'} pb={`xs`} pl={`md`} pr={'xl'}>
                        <KeywordSearch module={'category'}/>
                    </Box>
                </Box>
                <Box bg={`white`}>

                    <Box pb={`xs`} pl={`md`} pr={'md'}>
                        <DataTable
                            withTableBorder
                            records={indexData.data}
                            columns={[
                                {
                                    accessor: 'index',
                                    title: 'S/N',
                                    textAlignment: 'right',
                                    render: (item) => (indexData.data.indexOf(item) + 1)
                                },
                                {accessor: 'parent_name', title: "Parent Name"},
                                {accessor: 'name', title: "Name"},
                                {
                                    accessor: "action",
                                    title: "Action",
                                    textAlign: "right",
                                    render: (data) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('inventory/category-group/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                }}
                                            >
                                                <IconEdit size={16}/>
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="red"
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('inventory/category-group/' + data.id))
                                                        },
                                                    });
                                                }}
                                            >
                                                <IconTrash size={16}/>
                                            </ActionIcon>
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
                            scrollAreaProps={{type: 'never'}}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default CategoryTable;