import React, {useEffect, useMemo, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {Group, Box, Button, Grid, Tabs} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getIndexEntityData, showEntityData} from "../../../../store/core/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import __StockSearch from "./__StockSearch.jsx";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import {IconListDetails, IconListCheck, IconList} from "@tabler/icons-react";

function StockMatrixTable({categoryDropdown}) {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;
    const perPage = 50;

    const fetchingReload = useSelector((state) => state.crudSlice.fetching);
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

    const [indexData, setIndexData] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all-stock");
    const [viewModal, setViewModal] = useState(false);

    // API call whenever activeTab, searchKeyword, or page changes
    useEffect(() => {
        const fetchData = async () => {
            setFetching(true);
            const value = {
                url: "inventory/stock-item/matrix",
                param: {
                    term: searchKeyword,
                    page: searchKeyword ? 1 : page,
                    offset: perPage,
                    product_nature: activeTab,
                },
            };
            try {
                const resultAction = await dispatch(getIndexEntityData(value));
                if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                } else {
                    console.error("Error:", resultAction);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [activeTab, searchKeyword, page]);

    // Sorting logic
    const [sortStatus, setSortStatus] = useState({columnAccessor: "product_name", direction: "asc"});
    const sortedRecords = useMemo(() => {
        if (!indexData?.data) return [];
        return [...indexData.data].sort((a, b) => {
            const aVal = a[sortStatus.columnAccessor];
            const bVal = b[sortStatus.columnAccessor];

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            const valA = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
            const valB = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

            if (valA < valB) return sortStatus.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortStatus.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [indexData?.data, sortStatus]);

    // Dynamic warehouse columns
    const warehouseColumns = Array.isArray(indexData?.warehouses)
        ? indexData.warehouses.map((wh) => ({
            accessor: `warehouse_${wh.id}`,
            title: wh.name,
            textAlign: "right",
            sortable: true,
            render: (item) => item.warehouses?.[wh.id]?.quantity ?? 0,
            cellsStyle: () => (theme) => ({
                background: '#fff3cd',
            }),
        }))
        : [];

    return (
        <>
            <Box pl="xs" pb="xs" pr={8} pt="xs" mb="xs" className="boxBackground borderRadiusAll">
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={12}>
                        <Tabs
                            value={activeTab}
                            onChange={(value) => setActiveTab(value)}
                        >
                            <Tabs.List grow>
                                <Tabs.Tab value="all-stock" leftSection={<IconListCheck size={16}/>}>
                                    {t("AllStocks")}
                                </Tabs.Tab>
                                <Tabs.Tab value="production" leftSection={<IconListCheck size={16}/>}>
                                    {t("Production")}
                                </Tabs.Tab>
                                <Tabs.Tab value="stockable" leftSection={<IconList size={16}/>}>
                                    {t("Stockable")}
                                </Tabs.Tab>
                                <Tabs.Tab value="raw-material" leftSection={<IconListDetails size={16}/>}>
                                    {t("RawMaterials")}
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <__StockSearch module="stock" categoryDropdown={categoryDropdown}/>
                    </Grid.Col>
                </Grid>
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
                    records={sortedRecords}
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            render: (_row, index) => index + 1 + (page - 1) * perPage,
                        },
                        {accessor: "category_name", title: t("Category"), sortable: true},
                        {accessor: "name", title: t("Name"), sortable: true},
                        {accessor: "unit_name", title: t("Unit"), textAlign: 'center'},
                        {accessor: "barcode", title: t("barcode"), textAlign: 'center'},
                        {accessor: "product_nature", title: t("ProductNature"), textAlign: 'center'},
                        {accessor: "sales_price", title: t("SalesPrice"), textAlign: 'right'},
                        {accessor: "purchase_price", title: t("PurchasePrice"), textAlign: 'right'},
                        ...warehouseColumns,
                        {
                            accessor: "quantity",
                            title: t("Quantity"),
                            sortable: true,
                            textAlign: 'right',
                            cellsStyle: () => (theme) => ({
                                background: '#e6fffa',
                            }),
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button
                                        component="a"
                                        size="compact-xs"
                                        radius="xs"
                                        variant="filled"
                                        fw={"100"}
                                        fz={"12"}
                                        color="var(--theme-primary-color-6)"
                                        mr={4}
                                        onClick={() => {
                                            dispatch(showEntityData("inventory/product/" + item.product_id));
                                            setViewModal(true);
                                        }}
                                    >
                                        {t("View")}
                                    </Button>
                                </Group>
                            ),
                        },
                    ]}
                    fetching={fetching || fetchingReload}
                    totalRecords={indexData.total}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        setFetching(true);
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{type: "never"}}
                />
            </Box>

            {viewModal && <OverviewModal viewModal={viewModal} setViewModal={setViewModal}/>}
        </>
    );
}

export default StockMatrixTable;
