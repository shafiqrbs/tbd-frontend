

import { Box, Grid, Progress, TextInput, Button, Table } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "../../../../store/inventory/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { storeEntityData } from "../../../../store/core/crudSlice.js";

export default function __ModalProductionProcess({ boardId }) {
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const tableHeight = mainAreaHeight - 160;
    const progress = getLoadingProgress();
    const dispatch = useDispatch();

    const [fetching, setFetching] = useState(false);
    const [productionItems, setProductionItems] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState(null); // ✅ Only one warehouse can be selected

    const fetchData = async () => {
        if (!boardId) return;
        setFetching(true);
        const value = {
            url: 'inventory/requisition/matrix/board/production/' + boardId,
            param: {}
        };
        try {
            const resultAction = await dispatch(getIndexEntityData(value));
            if (getIndexEntityData.fulfilled.match(resultAction)) {
                const fetchedItems = resultAction.payload.data?.production_items || [];
                setProductionItems(fetchedItems);
                const initialSelectedIds = fetchedItems
                    .filter(item => item.pro_batch_item_id)
                    .map(item => item.id);
                setSelectedIds(initialSelectedIds);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [boardId]);

    const handleDemandChange = (newQuantity, itemId) => {
        setProductionItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, demand_quantity: newQuantity }
                    : item
            )
        );
    };

    // ✅ When a checkbox is checked, only allow items from that warehouse
    const handleCheckboxChange = (item) => {
        if (item.pro_batch_item_id) return;

        const warehouse = item.warehouse_name;

        setSelectedIds(prevSelectedIds => {
            const alreadySelected = prevSelectedIds.includes(item.id);

            if (alreadySelected) {
                // If unchecked, remove ID and reset warehouse if empty
                const newSelected = prevSelectedIds.filter(id => id !== item.id);
                const stillHasSameWarehouse = productionItems
                    .filter(i => newSelected.includes(i.id))
                    .some(i => i.warehouse_name === warehouse);

                if (!stillHasSameWarehouse) setActiveWarehouse(null);
                return newSelected;
            } else {
                // If checking a new warehouse item, reset others
                if (activeWarehouse && activeWarehouse !== warehouse) {
                    return [item.id]; // reset to only this warehouse
                } else {
                    setActiveWarehouse(warehouse);
                    return [...prevSelectedIds, item.id];
                }
            }
        });

        if (!activeWarehouse || activeWarehouse !== warehouse) {
            setActiveWarehouse(warehouse);
        }
    };

    const finalItemsToProcess = productionItems.filter(item =>
        item.pro_batch_item_id === null &&
        item.pro_batch_id === null &&
        selectedIds.includes(item.id)
    );

    const finalItemIds = finalItemsToProcess.map(item => item.id);

    const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            showNotificationComponent('Please select at least one item.', 'red');
            return;
        }

        if (finalItemIds.length === 0) {
            showNotificationComponent('No valid items to process.', 'red');
            return;
        }

        const value = {
            url: 'inventory/requisition/matrix/board/production/process',
            data: { item_ids: finalItemIds },
        };

        try {
            const resultAction = await dispatch(storeEntityData(value));
            if (storeEntityData.rejected.match(resultAction)) {
                showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true);
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true);
                    fetchData();
                    setActiveWarehouse(null);
                    setSelectedIds([]);
                } else {
                    showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true);
                }
            }
        } catch (err) {
            console.error('Submission failed:', err);
            showNotificationComponent('An unexpected error occurred.', 'red', true, 1000, true);
        }
    };

    const QuantityInput = ({ item, onDemandChange }) => {
        const [editedQuantity, setEditedQuantity] = useState(item?.demand_quantity ?? '');

        useEffect(() => {
            setEditedQuantity(item?.demand_quantity ?? '');
        }, [item?.demand_quantity]);

        const handleQuantityChange = (e) => {
            const newQuantity = e.currentTarget.value;
            setEditedQuantity(newQuantity);
        };

        const handleQuantityUpdateDB = async () => {
            const newQuantity = Number(editedQuantity);
            if (newQuantity !== item.demand_quantity) {
                onDemandChange(newQuantity, item.id);
                const value = {
                    url: 'inventory/requisition/matrix/board/production/quantity-update',
                    data: { id: item.id, quantity: newQuantity }
                };
                const resultAction = await dispatch(storeEntityData(value));
                if (storeEntityData.rejected.match(resultAction)) {
                    showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true);
                } else if (storeEntityData.fulfilled.match(resultAction)) {
                    if (resultAction.payload.data.status !== 200) {
                        showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true);
                    }
                }
            }
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

    const handleApprove = async (proBatchId) => {
        const value = {
            url: 'inventory/requisition/matrix/board/production/approve/' + proBatchId,
            data: {},
        };

        try {
            const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.fulfilled.match(resultAction)) {
                if (resultAction.payload.data.status === 200) {
                    showNotificationComponent("Approved successfully", 'teal', true, 1000, true);
                    fetchData();
                } else {
                    showNotificationComponent(resultAction.payload.data.message, 'red', true, 1000, true);
                }
            }
        } catch (err) {
            console.error('Approval failed:', err);
            showNotificationComponent('An unexpected error occurred.', 'red', true, 1000, true);
        }
    };

    // ✅ Group items by warehouse
    const groupedItems = useMemo(() => {
        const groups = {};
        productionItems.forEach(item => {
            if (!groups[item.warehouse_name]) {
                groups[item.warehouse_name] = [];
            }
            groups[item.warehouse_name].push(item);
        });
        return groups;
    }, [productionItems]);

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
        <Box className="borderRadiusAll">
            <Grid columns={24} gutter={0}>
                <Grid.Col span={24}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
                        <Button
                            onClick={handleSubmit}
                            disabled={finalItemIds.length === 0}
                            style={{ marginRight: '10px' }}
                        >
                            Process to Production
                        </Button>
                    </div>

                    <Table
                        stickyHeader
                        withTableBorder
                        withColumnBorders
                        striped
                        highlightOnHover
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Warehouse")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Select")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Product")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Approved")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Stock")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Remaining")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("DemandQty")}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>{t("Actions")}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            {Object.entries(groupedItems).map(([warehouse, items]) => (
                                <React.Fragment key={warehouse}>
                                    {items.map((item, index) => (
                                        <Table.Tr key={item.id}>
                                            {index === 0 && (
                                                <Table.Td
                                                    rowSpan={items.length}
                                                    style={{
                                                        verticalAlign: 'middle',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {warehouse}
                                                </Table.Td>
                                            )}

                                            <Table.Td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(item.id) || !!item.pro_batch_item_id}
                                                    onChange={() => handleCheckboxChange(item)}
                                                    /*disabled={
                                                        !!item.pro_batch_item_id ||
                                                        (activeWarehouse && activeWarehouse !== warehouse)
                                                    }*/
                                                    disabled={
                                                        !!item.pro_batch_item_id ||
                                                        (activeWarehouse && activeWarehouse !== warehouse) ||
                                                        item.demand_quantity < item.stock_quantity
                                                    }
                                                />
                                            </Table.Td>

                                            <Table.Td>{item.product_name}</Table.Td>
                                            <Table.Td style={{ textAlign: 'center' }}>{item.quantity}</Table.Td>
                                            <Table.Td style={{ textAlign: 'center' }}>{item.stock_quantity}</Table.Td>

                                            <Table.Td style={{ textAlign: 'center' }}>
                                                {item.stock_quantity - item.demand_quantity < 0 ? (
                                                    <span style={{ color: 'red' }}>
                                                        ({Math.abs(item.stock_quantity - item.demand_quantity)})
                                                    </span>
                                                ) : (
                                                    item.stock_quantity - item.demand_quantity
                                                )}
                                            </Table.Td>

                                            <Table.Td style={{ textAlign: 'center' }}>
                                                {item.process === 'Created' && !item.approved_by_id && !selectedIds.includes(item.id) ? (
                                                    <QuantityInput item={item} onDemandChange={handleDemandChange} />
                                                ) : (
                                                    item.demand_quantity
                                                )}
                                            </Table.Td>

                                            <Table.Td style={{ textAlign: 'center' }}>
                                                {item.pro_batch_id && item.process === 'Created' && !item.approved_by_id && (
                                                    <Button onClick={() => handleApprove(item.pro_batch_id)} size="xs">
                                                        Approve
                                                    </Button>
                                                )}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
