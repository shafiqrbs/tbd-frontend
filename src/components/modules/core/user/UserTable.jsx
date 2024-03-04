import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Tooltip,
    Box,
    TextInput, Grid, ActionIcon, rem, Text
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconFilter,
    IconSearch,
    IconInfoCircle,
    IconEye,
    IconEdit,
    IconTrash,
    IconRestore,
    IconX
} from "@tabler/icons-react";
import axios from "axios";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {deleteEntityData, getIndexEntityData, setFetching} from "../../../../store/core/crudSlice.js";
import {modals} from "@mantine/modals";
import UserSearch from "./UserSearch.jsx";


function UserTable() {
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104
    // const [searchKeyword, setSearchKeyword] = useState(null)
    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)


    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const perPage = 50;
    const [page,setPage] = useState(1);
    console.log(indexData)
    useEffect(() => {
        const value = {
            url: 'user',
            param: {
                term: searchKeyword,
                page: page,
                offset : perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>
            <Box>
                <Box bg={`white`}>
                    <UserSearch />
                </Box>
                <Box>
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
                                { accessor: 'name',  title: "Name" },
                                { accessor: 'username',  title: "User Name" },
                                { accessor: 'email',  title: "Email" },
                                { accessor: 'mobile',  title: "Mobile" },
                                {
                                    accessor: "action",
                                    title: "Action",
                                    textAlign: "right",
                                    render: (data) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="green"
                                            >
                                                <IconEye size={16}/>
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="blue"
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
                                                            dispatch(deleteEntityData('user/' + data.id))
                                                            dispatch(setFetching(true))
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
                            scrollAreaProps={{ type: 'never' }}
                        />

                </Box>
            </Box>
        </>
    );
}

export default UserTable;