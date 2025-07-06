import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    rem,
    Menu,
    Text
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconCheck,
    IconDotsVertical,
    IconTrashX,
    IconAlertCircle
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFormLoading,
    setInsertType,
    deleteEntityData,
    setFetching
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import tableCss from "../../../../assets/css/Table.module.css";
import _WarehouseViewDrawer from "./_WarehouseViewDrawer.jsx";

function WarehouseTable() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();

    const height = mainAreaHeight - 98;
    const perPage = 50;

    // States
    const [page, setPage] = useState(1);
    const [fetching, setFetchingState] = useState(true);
    const [indexData, setIndexData] = useState([]);
    const [viewDrawer, setViewDrawer] = useState(false);
    const [warehouseObject, setWarehouseObject] = useState({});

    // Selectors from Redux Store
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const fetchingReload = useSelector((state) => state.crudSlice.fetching);
    const warehouseFilterData = useSelector((state) => state.crudSlice.warehouseFilterData);

    const navigate = useNavigate();

    /** Fetch warehouse data */
    useEffect(() => {
        const fetchData = async () => {
            setFetchingState(true);
            const requestData = {
                url: "core/warehouse",
                param: {
                    term: searchKeyword,
                    ...warehouseFilterData,
                    page,
                    offset: perPage,
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(requestData));

                if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                } else {
                    console.error("Error fetching warehouse data:", resultAction);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
            } finally {
                setFetchingState(false);
            }
        };

        fetchData();
    }, [dispatch, searchKeyword, warehouseFilterData, page, fetchingReload]);

    return (
        <>
            <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
                <KeywordSearch module="warehouse" />
            </Box>

            <Box className="borderRadiusAll border-top-none">
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={indexData?.data || []}
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            render: (_, index) => index + 1, // Optimized index calculation
                        },
                        { accessor: "name", title: t("Name") },
                        { accessor: "location", title: t("Location") },
                        { accessor: "contract_person", title: t("ContractPerson") },
                        { accessor: "mobile", title: t("Mobile") },
                        { accessor: "email", title: t("Email") },
                        { accessor: "address", title: t("Address") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlignment: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color='var(--theme-primary-color-6)' radius="xl" aria-label="Settings">
                                                <IconDotsVertical height="18" width="18" stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    dispatch(setInsertType("update"));
                                                    dispatch(editEntityData(`core/warehouse/${data.id}`));
                                                    dispatch(setFormLoading(true));
                                                    navigate(`/core/warehouse/${data.id}`);
                                                }}
                                                w="200"
                                            >
                                                {t("Edit")}
                                            </Menu.Item>

                                            <Menu.Item
                                                onClick={() => {
                                                    const foundWarehouse = indexData.data.find((warehouse) => warehouse.id === data.id);
                                                    if (foundWarehouse) {
                                                        setWarehouseObject(foundWarehouse);
                                                        setViewDrawer(true);
                                                    } else {
                                                        notifications.show({
                                                            color: "red",
                                                            title: t("Something Went wrong, please try again"),
                                                            icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
                                                            loading: false,
                                                            autoClose: 900,
                                                            style: { backgroundColor: "lightgray" },
                                                        });
                                                    }
                                                }}
                                                w="200"
                                            >
                                                {t("Show")}
                                            </Menu.Item>

                                            <Menu.Item
                                                w="200"
                                                bg="red.1"
                                                c="red.6"
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
                                                        children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
                                                        labels: { confirm: "Confirm", cancel: "Cancel" },
                                                        confirmProps: { color: "red.6" },
                                                        onConfirm: async () => {
                                                            try {
                                                                const resultAction = await dispatch(deleteEntityData(`core/warehouse/${data.id}`));

                                                                if (deleteEntityData.fulfilled.match(resultAction)) {
                                                                    // setIndexData(resultAction.payload);
                                                                    notifications.show({
                                                                        color: "red",
                                                                        title: t("DeleteSuccessfully"),
                                                                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                                                        loading: false,
                                                                        autoClose: 700,
                                                                        style: { backgroundColor: "lightgray" },
                                                                    });
                                                                } else {
                                                                    console.error("Error fetching warehouse data:", resultAction);
                                                                }
                                                            } catch (error) {
                                                                console.error("Unexpected error:", error);
                                                            } finally {
                                                                setFetchingState(false);
                                                            }
                                                        }
                                                    });
                                                }}
                                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
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
                    totalRecords={indexData?.total || 0}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        dispatch(setFetching(true));
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{ type: "never" }}
                />
            </Box>

            {viewDrawer && (
                <_WarehouseViewDrawer
                    viewDrawer={viewDrawer}
                    setViewDrawer={setViewDrawer}
                    warehouseObject={warehouseObject}
                />
            )}
        </>
    );
}

export default WarehouseTable;