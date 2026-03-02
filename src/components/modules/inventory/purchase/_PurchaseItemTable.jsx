import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Grid,
    Stack,
    Button,
    ScrollArea,
    Table,
    Menu,
    rem,
    LoadingOverlay, Badge, Tooltip, Flex,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconEdit,
    IconPrinter,
    IconReceipt,
    IconDotsVertical,
    IconPencil,
    IconEyeEdit,
    IconTrashX,
    IconCheck, IconCopy, IconSearch, IconRestore, IconPlus, IconArrowRight,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {
    getIndexEntityData,
    setDeleteMessage,
    setFetching, showInstantEntityData,
} from "../../../../store/inventory/crudSlice.js";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import ShortcutTable from "../../shortcut/ShortcutTable";
import _PurchaseSearch from "./_PurchaseSearch.jsx";
import {PurchasePrintNormal} from "./print-component/PurchasePrintNormal.jsx";
import {PurchasePrintPos} from "./print-component/PurchasePrintPos.jsx";
import {notifications} from "@mantine/notifications";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import __FilterPopover from "../sales/__FilterPopover";
import {setPurchaseFilterData} from "../../../../store/inventory/crudSlice";

function _PurchaseItemTable() {
    const {configData} = useConfigData()
    let isWarehouse = configData?.sku_warehouse

    const printRef = useRef();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 106; //TabList height 104
    const height = mainAreaHeight - 304; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [printA4, setPrintA4] = useState(false);
    const [printPos, setPrintPos] = useState(false);
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState("");
    const [indexData, setIndexData] = useState([])
    const fetching = useSelector((state) => state.inventoryCrudSlice.fetching);
    const purchaseFilterData = useSelector(
        (state) => state.inventoryCrudSlice.purchaseFilterData
    );
    const entityDataDelete = useSelector(
        (state) => state.inventoryCrudSlice.entityDataDelete
    );

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const [purchaseViewData, setPurchaseViewData] = useState({});

    useEffect(() => {
        setPurchaseViewData(
            indexData.data && indexData.data[0] && indexData.data[0]
        );
        setSelectedRow(
            indexData.data && indexData.data[0] && indexData.data[0].invoice
        );
    }, [indexData.data]);

    const rows =
        purchaseViewData &&
        purchaseViewData.purchase_items &&
        purchaseViewData.purchase_items.map((element, index) => (
            <Table.Tr key={`${element.name}-${index}`}>
                <Table.Td fz="xs" width={"20"}>
                    {index + 1}
                </Table.Td>
                <Table.Td ta="left" fz="xs" width={"300"}>
                    {element.item_name}
                </Table.Td>
                {
                    isWarehouse == 1 &&
                    <Table.Td ta="center" fz="xs" width={"60"}>
                        {element.warehouse_name}
                    </Table.Td>
                }
                {/*<Table.Td ta="center" fz="xs" width={"60"}>
                    {element.bonus_quantity}
                </Table.Td>*/}
                <Table.Td ta="center" fz="xs" width={"60"}>
                    {element.quantity}
                </Table.Td>
                <Table.Td ta="right" fz="xs" width={"80"}>
                    {element.purchase_price}
                </Table.Td>
                <Table.Td ta="right" fz="xs" width={"100"}>
                    {element.purchase_price}
                </Table.Td>
                <Table.Td ta="right" fz="xs" width={"100"}>
                    {element.sub_total}
                </Table.Td>
            </Table.Tr>
        ));


    const fetchData = async () => {
        setFetching(true);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };

        const value = {
            url: "inventory/purchase/items",
            param: {
                term: purchaseFilterData.searchKeyword,
                vendor_id: purchaseFilterData.vendor_id,
                start_date:
                    purchaseFilterData.start_date &&
                    new Date(purchaseFilterData.start_date).toLocaleDateString("en-CA", options),
                end_date:
                    purchaseFilterData.end_date &&
                    new Date(purchaseFilterData.end_date).toLocaleDateString("en-CA", options),
                page: page,
                offset: perPage,
            },
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error('Error:', resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData(resultAction.payload);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }finally {
            setFetching(false)
        }
    };

// useEffect now only calls fetchData based on dependencies
    useEffect(() => {
        fetchData();
    }, [purchaseFilterData, page, fetching]);

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={20}>
                        <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'}>
                            <Grid>
                                <Grid.Col>
                                    <Stack>
                                        <_PurchaseSearch/>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Box al={'right'} pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'}  >
                            <Flex
                                gap="md"
                                justify="flex-end"
                                align="center"
                                direction="row"
                                wrap="wrap"
                            >
                                <Button
                                    onClick={(e) => {
                                        navigate("/inventory/purchase");
                                    }}
                                    variant="filled"
                                    rightSection={<IconArrowRight size={14} />}> Purchase
                                </Button>
                            </Flex>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span="auto">
                        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                            <Box className={"borderRadiusAll"}>
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
                                            title: "S/N",
                                            textAlignment: "right",
                                            render: (item) => indexData.data.indexOf(item) + 1,
                                        },
                                        {accessor: "created", title: t("Created")},
                                        {accessor: "expired_date", title: t("Expired")},
                                        {
                                            accessor: "invoice",
                                            title: t("GRN"),
                                        },
                                        {accessor: "warehouse_name", title: t("Store")},
                                        {accessor: "category_name", title: t("Category")},
                                        {accessor: "item_name", title: t("Product")},
                                        {accessor: "unit_name", title: t("Unit")},
                                        {accessor: "opening_quantity", title: t("Opening")},
                                        {accessor: "quantity", title: t("QTY")},
                                        {accessor: "sales_quantity", title: t("Sales")},
                                        {accessor: "sales_return_quantity", title: t("Sales.Return")},
                                        {accessor: "purchase_return_quantity", title: t("Purch.Return")},
                                        {accessor: "damage_quantity", title: t("Damage")},
                                        {accessor: "bonus_quantity", title: t("Bonus")},
                                        {accessor: "remaining_quantity", title: t("Remin")},


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
                                    height={tableHeight}
                                    scrollAreaProps={{type: "never"}}
                                    rowBackgroundColor={(item) => {
                                        if (item.invoice === selectedRow) return "var(--theme-primary-color-1)";
                                    }}
                                    rowColor={(item) => {
                                        if (item.invoice === selectedRow) return "var(--mantine-color-black-9)";
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default _PurchaseItemTable;
