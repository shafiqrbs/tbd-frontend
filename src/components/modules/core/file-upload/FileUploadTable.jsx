import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Menu, rem, Button, LoadingOverlay
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconArrowRight,
    IconCheck,
    IconDotsVertical,
    IconDownload,
    IconGitBranchDeleted, IconHttpDelete,
    IconPhoto, IconSquareArrowLeftFilled,
    IconTrashX
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    getIndexEntityData,
    setDeleteMessage,
    setFetching
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import commonDataStoreIntoLocalStorage from "../../../global-hook/local-storage/commonDataStoreIntoLocalStorage.js";
import orderProcessDropdownLocalDataStore
    from "../../../global-hook/local-storage/orderProcessDropdownLocalDataStore.js";
function FileUploadTable() {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [loading,setLoading] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const entityDataDelete = useSelector((state) => state.crudSlice.entityDataDelete)

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
    const fetchingReload = useSelector((state) => state.crudSlice.fetching)


    useEffect(() => {
        const fetchData = async () => {
            setFetching(true)
            const value = {
                url: 'core/file-upload',
                param: {
                    term: searchKeyword,
                    page: page,
                    offset: perPage
                }
            }

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
    }, [dispatch, searchKeyword, page , fetchingReload,loading]);


    const processUploadFile = (id) => {
        setLoading(true)
        axios({
            method: 'get',
            url: `${import.meta.env.VITE_API_GATEWAY_URL + 'core/file-upload/process'}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            },
            params: {
                file_id : id
            }
        })
            .then(res => {
                if (res.data.status == 200){
                    setLoading(false)
                    setTimeout(() => {
                        notifications.show({
                            color: 'teal',
                            title: 'Process '+res.data.row+' rows successfully',
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 2000,
                            style: { backgroundColor: 'lightgray' },
                        });
                    })
                }
            })
            .catch(function (error) {
                console.log(error.response.data.message)
                setLoading(false)
                if (error?.response?.data?.message){
                    notifications.show({
                        color: 'red',
                        title: error.response.data.message,
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 2000,
                        style: { backgroundColor: 'lightgray' },
                    });
                }
            })
    }

    return (
        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                <KeywordSearch module={'file-upload'} />
            </Box>

            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

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
                        { accessor: 'file_type', title: t("FileType") },
                        { accessor: 'original_name', title: t("FileName") },
                        { accessor: 'created', title: t("Created") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group position="center">
                                    {
                                        !data.is_process &&
                                        <Button leftSection={<IconSquareArrowLeftFilled size={18} />}
                                                onClick={(e) => {
                                                    processUploadFile(data.id)
                                                }}
                                        >
                                            Process
                                        </Button>
                                    }

                                    <Button rightSection={<IconHttpDelete size={18} />} style={{ backgroundColor: 'red' }}>
                                        <IconTrashX style={{ width: rem(18), height: rem(18) }} />
                                    </Button>
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

export default FileUploadTable;