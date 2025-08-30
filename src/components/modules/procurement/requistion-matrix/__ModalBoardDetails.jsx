import {Box, Grid} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import React, {useRef} from 'react';
import {DataTable} from "mantine-datatable";
import matrixTable from "./Table.module.css";
import {useOutletContext} from "react-router-dom";

export default function __ModalBoardDetails({indexData, customers}) {
    const {t, i18} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 160;
    const leftTableRef = useRef(null);
    const centerTableRef = useRef(null);
    const rightTableRef = useRef(null);

    const QuantityInput = ({item, shopKey}) => {
        return item[shopKey + "_approved_quantity"] || 0;
    };

    return (
        <Box className="borderRadiusAll">
            <Grid columns={24} gutter={0}>
                <Grid.Col span={4}>
                    <DataTable
                        border={1}
                        scrollViewportRef={leftTableRef}
                        classNames={{
                            root: matrixTable.root,
                            table: matrixTable.table,
                            header: matrixTable.header,
                            footer: matrixTable.footer,
                            pagination: matrixTable.pagination,
                        }}
                        columns={[
                            {
                                accessor: "product",
                                title: t("Product"),
                                cellsClassName: matrixTable.idColumnCells,
                                width: 100,
                            },
                        ]}
                        records={indexData}
                        totalRecords={indexData.length}
                        loaderSize="xs"
                        // fetching={fetching}
                        loaderColor="grape"
                        height={tableHeight}
                        scrollAreaProps={{type: "never"}}
                    />
                </Grid.Col>
                <Grid.Col span={14}>
                    <DataTable
                        border={1}
                        scrollAreaProps={{type: "hover", scrollHideDelay: 1}}
                        scrollViewportRef={centerTableRef}
                        classNames={{
                            root: matrixTable.root,
                            table: matrixTable.table,
                            header: matrixTable.header,
                            footer: matrixTable.footer,
                            pagination: matrixTable.pagination,
                        }}
                        columns={
                            customers.length > 0 ? customers.map((shop) => ({
                                    accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                                    title: shop ? shop : t("BranchName"),
                                    width: 150,
                                    textAlign: 'center',
                                    render: (item) => {
                                        const shopKey = shop.toLowerCase().replace(/\s+/g, "_");
                                        return <QuantityInput item={item} shopKey={shopKey}/>;
                                    },
                                })) :
                                [

                                    {
                                        accessor: "",
                                        title: t("BranchName"),
                                    }
                                ]
                        }

                        records={indexData}
                        totalRecords={indexData.length}
                        // fetching={fetching}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={tableHeight}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <DataTable
                        border={1}
                        scrollAreaProps={{type: "never"}}
                        scrollViewportRef={rightTableRef}
                        classNames={{
                            root: matrixTable.root,
                            table: matrixTable.table,
                            header: matrixTable.header,
                            footer: matrixTable.footer,
                            pagination: matrixTable.pagination,
                        }}
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
                                    if (quantity < 0) {
                                        return (
                                            <span style={{color: 'red'}}>
                                                ({Math.abs(quantity)})
                                            </span>
                                        );
                                    }
                                    return quantity;
                                }
                            }
                        ]}
                        records={indexData}
                        totalRecords={indexData.length}
                        loaderSize="xs"
                        loaderColor="grape"
                        // fetching={fetching}
                        height={tableHeight}
                    />
                </Grid.Col>
            </Grid>
        </Box>
    );
}