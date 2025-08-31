import {Box, Grid, TextInput} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import React, {useRef, useState} from 'react';
import {DataTable} from "mantine-datatable";
import matrixTable from "./Table.module.css";
import {useOutletContext} from "react-router-dom";

export default function __ModalProductionProcess(props) {
    const {boardId, indexData} = props;
    const {t, i18} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 160;
    const leftTableRef = useRef(null);

    const QuantityInput = ({item}) => {
        const [editedQuantity, setEditedQuantity] = useState(null);

        const handleQuantityChange = (e) => {
            const newQuantity = e.currentTarget.value;
            setEditedQuantity(newQuantity);
        };

        const handleQuantityUpdateDB = async () => {
            const indexKey = shopKey + "_id";
            const values = {
                quantity: editedQuantity,
                id: item[indexKey],
            };
            if (editedQuantity === item[shopKey]){
                return
            }

            /*const value = {
                url: 'inventory/requisition/matrix/board/quantity-update',
                data: values
            }

            const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.rejected.match(resultAction)) {
                showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    setFetching(true)
                    // showNotificationComponent(resultAction.payload.data.message, 'teal', 'lightgray', true, 1000, true)
                } else {
                    showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                }
            }*/
        };

        return (
            <TextInput
                type="number"
                size="xs"
                value={editedQuantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityUpdateDB}
            />
        );
    };


    return (
        <Box className="borderRadiusAll">
            <Grid columns={24} gutter={0}>
                <Grid.Col span={24}>
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
                            },
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
                            },
                            {
                                accessor: 'demand_qty',
                                title: t("DemandQty"),
                                width: 150,
                                render: (item) => {
                                    // const shopKey = shop.toLowerCase().replace(/\s+/g, "_");
                                    return <QuantityInput item={item}/>;
                                }
                            }
                        ]}
                        records={indexData}
                        totalRecords={indexData.length}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={tableHeight}
                        scrollAreaProps={{type: "never"}}
                    />
                </Grid.Col>
            </Grid>
        </Box>
    );
}