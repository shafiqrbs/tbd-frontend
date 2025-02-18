import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Menu,
    rem,
    Button,
    LoadingOverlay, Flex, Switch, Chip, Text,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconArrowRight,
    IconCheck,
    IconDotsVertical,
    IconDownload,
    IconGitBranchDeleted,
    IconHttpDelete,
    IconLoader,
    IconPhoto,
    IconSquareArrowLeftFilled,
    IconTrashX,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {
    getIndexEntityData,
    setDeleteMessage,
    setFetching,
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import {notifications} from "@mantine/notifications";
import axios from "axios";
import commonDataStoreIntoLocalStorage from "../../../global-hook/local-storage/commonDataStoreIntoLocalStorage.js";
import orderProcessDropdownLocalDataStore
    from "../../../global-hook/local-storage/orderProcessDropdownLocalDataStore.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {modals} from "@mantine/modals";

function FileUploadTable() {
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104
    const {configData, fetchData} = getConfigData();

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetching = useSelector((state) => state.crudSlice.fetching);
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const entityDataDelete = useSelector(
        (state) => state.crudSlice.entityDataDelete
    );

    const [indexData, setIndexData] = useState([]);
    const fetchingReload = useSelector((state) => state.crudSlice.fetching);

    useEffect(() => {
        const fetchFileData = async () => {
            setFetching(true);
            const value = {
                url: "core/file-upload",
                param: {
                    term: searchKeyword,
                    page: page,
                    offset: perPage,
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                    setFetching(false);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchFileData();
    }, [dispatch, searchKeyword, page, fetchingReload, loading]);

    const processUploadFile = (id) => {
        setLoading(true);
        axios({
            method: "get",
            url: `${
                import.meta.env.VITE_API_GATEWAY_URL + "core/file-upload/process"
            }`,
            headers: {
                Accept: `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": "*",
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem("user")).id,
            },
            params: {
                file_id: id,
            },
        })
            .then((res) => {
                if (res.data.status == 200) {
                    productsDataStoreIntoLocalStorage();
                    setLoading(false);
                    setTimeout(() => {
                        notifications.show({
                            color: "teal",
                            title: "Process " + res.data.row + " rows successfully",
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 2000,
                            style: {backgroundColor: "lightgray"},
                        });
                    });
                }
            })
            .catch(function (error) {
                console.log(error.response.data.message);
                setLoading(false);
                if (error?.response?.data?.message) {
                    notifications.show({
                        color: "red",
                        title: error.response.data.message,
                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                        loading: false,
                        autoClose: 2000,
                        style: {backgroundColor: "lightgray"},
                    });
                }
            });
    };

    const uploadFileDeleteHandle = async (id) => {
        const resultAction = await dispatch(deleteEntityData("core/file-upload/" + id));
        if (resultAction.payload.data.status === 200) {
            showNotificationComponent(t("DeleteSuccessfully"), 'red', 'lightgray', '', true, 1000, true)
        } else {
            showNotificationComponent('Something went wrong', 'red', 'lightgray', '', true, 1000, true)
        }
        setFetching(true)
    }

    return (
        <>
            <Box
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"4"}
                className={"boxBackground borderRadiusAll border-bottom-none"}
            >
                <KeywordSearch module={"file-upload"}/>
            </Box>

            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{radius: "sm", blur: 2}}
            />

            <Box className={"borderRadiusAll border-top-none"}>
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
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            render: (item) => indexData.data.indexOf(item) + 1,
                        },
                        {accessor: "file_type", title: t("FileType")},
                        {accessor: "original_name", title: t("FileName")},
                        {accessor: "created", title: t("Created")},
                        {
                            accessor: "is_process",
                            title: t("Status"),
                            render: (item) => (
                                <Chip
                                    defaultChecked
                                    color={item.is_process === 1 ? "green" : "red"}
                                    variant="light"
                                >
                                    {item.is_process === 1 ? "Completed" : "Created"}
                                </Chip>
                            ),
                        },
                        {
                            accessor: "process_row",
                            title: t("TotalItem"),
                            textAlign: "center",
                            render: (item) => (
                                item.process_row > 0 &&
                                <Button variant="subtle" color="red" radius="xl">{item.process_row}</Button>
                            ),
                        },

                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu
                                        position="bottom-end"
                                        offset={3}
                                        withArrow
                                        trigger="hover"
                                        openDelay={100}
                                        closeDelay={400}
                                    >
                                        <Menu.Target>
                                            <ActionIcon
                                                size="sm"
                                                variant="outline"
                                                color="red"
                                                radius="xl"
                                                aria-label="Settings"
                                            >
                                                <IconDotsVertical
                                                    height={"18"}
                                                    width={"18"}
                                                    stroke={1.5}
                                                />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {!data.is_process && (
                                                <Menu.Item
                                                    target="_blank"
                                                    component="a"
                                                    w={"200"}
                                                    mt={"2"}
                                                    bg={"#d7e8cd"}
                                                    c={"black"}
                                                    rightSection={
                                                        <IconLoader
                                                            style={{width: rem(14), height: rem(14)}}
                                                        />
                                                    }
                                                    onClick={(e) => {
                                                        processUploadFile(data.id);
                                                    }}
                                                >
                                                    {t("Process")}
                                                </Menu.Item>
                                            )}
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={"200"}
                                                mt={"2"}
                                                bg={"red.1"}
                                                c={"red.6"}
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md">
                                                                {" "}
                                                                {t("FormConfirmationTitle")}
                                                            </Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm">
                                                                {" "}
                                                                {t("FormConfirmationMessage")}
                                                            </Text>
                                                        ),
                                                        labels: {confirm: "Confirm", cancel: "Cancel"},
                                                        confirmProps: {color: "red.6"},
                                                        onCancel: () => console.log("Cancel"),
                                                        onConfirm: () => {
                                                            uploadFileDeleteHandle(data.id)
                                                        },
                                                    });
                                                }}
                                                rightSection={
                                                    <IconTrashX
                                                        style={{width: rem(14), height: rem(14)}}
                                                    />
                                                }
                                            >
                                                {t("Delete")}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            ),
                        },
                    ]}
                    fetching={fetching}
                    totalRecords={indexData.total}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        dispatch(setFetching(true));
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{type: "never"}}
                />
            </Box>
        </>
    );
}

export default FileUploadTable;
