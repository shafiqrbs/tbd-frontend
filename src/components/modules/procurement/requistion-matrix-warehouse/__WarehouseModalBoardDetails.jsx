import {Box, Grid, Progress} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from "mantine-datatable";
import matrixTable from "./Table.module.css";
import {useOutletContext} from "react-router-dom";
import {getIndexEntityData} from "../../../../store/inventory/crudSlice.js";
import {useDispatch} from "react-redux";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";

export default function __WarehouseModalBoardDetails({boardId}) {
    const {t, i18} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const progress = getLoadingProgress();
    const dispatch = useDispatch()
    const tableHeight = mainAreaHeight-30;
    const leftTableRef = useRef(null);
    const centerTableRef = useRef(null);
    const rightTableRef = useRef(null);

    const [fetching, setFetching] = useState(false);
    const [indexData, setIndexData] = useState([]);
    const [customers, setCustomers] = useState([]);

    const fetchData = async () => {
        if (!boardId) return;

        setFetching(true);
        const value = {
            url: 'inventory/requisition/matrix/board/warehouse/' + boardId,
            param: {}
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData(resultAction.payload.data || []);
                setCustomers(resultAction.payload.customers || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false); // Remove the setTimeout!
        }
    };

    useEffect(() => {
        fetchData();
    }, [boardId]);

    const QuantityInput = ({item, shopKey}) => {
        return item[shopKey + "_approved_quantity"] || 0;
    };


    return fetching ? (
        <Progress
            color='var(--theme-primary-color-6)'
            size="sm"
            striped
            animated
            value={progress}
            transitionDuration={200}
        />
    ) : (
        boardId && indexData && customers && (
            <Box className="borderRadiusAll">
                <Grid columns={24} gutter={0}>
                    <Grid.Col span={4}>
                        <DataTable
                            border={1}
                            scrollViewportRef={leftTableRef}
                            classNames={matrixTable}
                            columns={[
                                {
                                    accessor: "warehouse_name",
                                    title: t("Warehouse"),
                                    cellsClassName: matrixTable.idColumnCells,
                                    width: 100,
                                },
                                {
                                accessor: "product",
                                title: t("Product"),
                                cellsClassName: matrixTable.idColumnCells,
                                width: 100,
                            }
                            ]}
                            records={indexData}
                            totalRecords={indexData.length}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={tableHeight}
                            scrollAreaProps={{ type: "never" }}
                        />
                    </Grid.Col>
                    <Grid.Col span={14}>
                        <DataTable
                            border={1}
                            scrollAreaProps={{ type: "hover", scrollHideDelay: 1 }}
                            scrollViewportRef={centerTableRef}
                            classNames={matrixTable}
                            columns={customers.length > 0 ?
                                customers.map(shop => ({
                                    accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                                    title: shop || t("BranchName"),
                                    width: 150,
                                    textAlign: 'center',
                                    render: (item) => {
                                        const shopKey = shop.toLowerCase().replace(/\s+/g, "_");
                                        return <QuantityInput item={item} shopKey={shopKey} />;
                                    },
                                })) :
                                [{
                                    accessor: "",
                                    title: t("BranchName"),
                                }]
                            }
                            records={indexData}
                            totalRecords={indexData.length}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={tableHeight}
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <DataTable
                            border={1}
                            scrollAreaProps={{ type: "never" }}
                            scrollViewportRef={rightTableRef}
                            classNames={matrixTable}
                            columns={[
                                {
                                    accessor: "total_approved_quantity",
                                    title: t("Approved"),
                                    textAlign: 'center'
                                },
                                {
                                    accessor: "vendor_stock_quantity",
                                    title: t("Stock"),
                                    textAlign: 'center'
                                },
                                {
                                    accessor: "remaining_quantity",
                                    title: t("Remaining"),
                                    textAlign: 'center',
                                    render: (item) => {
                                        const quantity = item.remaining_quantity;
                                        return quantity < 0 ? (
                                            <span style={{ color: 'red' }}>({Math.abs(quantity)})</span>
                                        ) : quantity;
                                    }
                                }
                            ]}
                            records={indexData}
                            totalRecords={indexData.length}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={tableHeight}
                        />
                    </Grid.Col>
                </Grid>
            </Box>
        )
    );
}