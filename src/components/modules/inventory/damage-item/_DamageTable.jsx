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
    Loader,
    Menu,
    rem,
    LoadingOverlay, Badge, Flex,
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
    IconCheck, IconChevronsRight, IconX, IconCopy, IconPlus, IconArrowRight,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {
    getIndexEntityData,
    setDeleteMessage,
    setFetching, setValidationData, showInstantEntityData, updateEntityData,
} from "../../../../store/inventory/crudSlice.js";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import ShortcutTable from "../../shortcut/ShortcutTable";
import {notifications} from "@mantine/notifications";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {PurchasePrintNormal} from "../purchase/print-component/PurchasePrintNormal.jsx";
import {PurchasePrintPos} from "../purchase/print-component/PurchasePrintPos.jsx";
import _SalesReturnSearch from "./_SalesReturnSearch.jsx";
import _PurchaseSearch from "../purchase/_PurchaseSearch";

function _DamageTable() {
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
    const [fetching, setFetching] = useState(false)

    const purchaseReturnFilterData = useSelector(
        (state) => state.inventoryCrudSlice.purchaseReturnFilterData
    );
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const fetchData = async () => {
        setFetching(true);

        const value = {
            url: "inventory/damage-item",
            param: {
                term: purchaseReturnFilterData.searchKeyword,
                vendor_id: purchaseReturnFilterData.vendor_id,
                start_date: purchaseReturnFilterData.start_date
                    ? new Date(purchaseReturnFilterData.start_date).toLocaleDateString("en-CA")
                    : null,
                end_date: purchaseReturnFilterData.end_date
                    ? new Date(purchaseReturnFilterData.end_date).toLocaleDateString("en-CA")
                    : null,
                page,
                limit: perPage,
            },
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));
            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error("Error:", resultAction);
            } else {
                setIndexData(resultAction.payload);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, purchaseReturnFilterData]);

    const records = indexData?.data;

    console.log(records?.entities);



    return (
        <>
            <Box>
                <Box pl={`xs`} pb={'4'} pr={'xs'} pt={'4'} mb={'4'} >
                    <Grid>
                        <Grid.Col>
                            <Stack>
                                <_PurchaseSearch/>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Box>
            <Box>
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
                            records={records?.entities}
                            columns={[
                                {
                                    accessor: "index",
                                    title: "S/N",
                                    textAlignment: "right",
                                    render: (item) => records?.entities.indexOf(item) + 1,
                                },
                                {accessor: "created", title: t("Created")},
                                {accessor: "expired_date", title: t("Expired")},
                                {accessor: "warehouse_name", title: t("Store")},
                                {accessor: "category_name", title: t("Category")},
                                {accessor: "item_name", title: t("Product")},
                                {accessor: "quantity", title: t("Quantity")},
                                {accessor: "unit_name", title: t("Unit")},
                                {accessor: "sub_total", title: t("Total")},
                            ]}
                            fetching={fetching}
                            totalRecords={records?.count}
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

                        />
                    </Box>
                </Box>
            </Box>

        </>
    );
}

export default _DamageTable;
