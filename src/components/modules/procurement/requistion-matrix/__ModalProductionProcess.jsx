import { Box, Grid, Progress, TextInput, Button, Table } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { getIndexEntityData } from "../../../../store/inventory/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import { useDispatch } from "react-redux";
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
                const initialSelectedIds = fetchedItems.filter(item => item.pro_batch_item_id).map(item => item.id);
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

    const handleCheckboxChange = (id, proBatchItemId) => {
        if (proBatchItemId) {
            return;
        }
        setSelectedIds(prevSelectedIds => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(selectedId => selectedId !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
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
                // Call the parent's function to update the main state
                onDemandChange(newQuantity, item.id);

                // The rest of the API call logic remains the same
                const values = {
                    quantity: newQuantity,
                    id: item.id,
                };
                const value = {
                    url: 'inventory/requisition/matrix/board/production/quantity-update',
                    data: values
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

    // Sort the productionItems array before mapping to table rows
    const sortedItems = [...productionItems].sort((a, b) => {
        if (a.pro_batch_id === null && b.pro_batch_id !== null) return 1;
        if (a.pro_batch_id !== null && b.pro_batch_id === null) return -1;
        if (a.pro_batch_id === null && b.pro_batch_id === null) return 0;
        return a.pro_batch_id - b.pro_batch_id;
    });

    const rows = sortedItems.map((item, index) => {
        const isFirstInGroup = index === 0 || sortedItems[index - 1].pro_batch_id !== item.pro_batch_id;
        const groupSize = sortedItems.filter(p => p.pro_batch_id === item.pro_batch_id).length;

        return (
            <Table.Tr key={item.id}>
                <Table.Td style={{ textAlign: 'center' }}>
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id) || !!item.pro_batch_item_id}
                        onChange={() => handleCheckboxChange(item.id, item.pro_batch_item_id)}
                        disabled={!!item.pro_batch_item_id}
                    />
                </Table.Td>
                <Table.Td>{item.product_name}</Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>{item.quantity}</Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>{item.stock_quantity}</Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                    {item.stock_quantity - item.demand_quantity < 0 ? (
                        <span style={{ color: 'red' }}>({Math.abs(item.stock_quantity - item.demand_quantity)})</span>
                    ) : (
                        item.stock_quantity - item.demand_quantity
                    )}
                </Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                    {item.process === 'Created' && !item.approved_by_id ?
                        <QuantityInput item={item} onDemandChange={handleDemandChange} />
                        : item.demand_quantity
                    }
                </Table.Td>
                {isFirstInGroup && item.pro_batch_id && item.process === 'Created' && !item.approved_by_id && (
                    <Table.Td rowSpan={groupSize} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <Button
                            onClick={() => handleApprove(item.pro_batch_id)}
                            size="xs"
                        >
                            Approve
                        </Button>
                    </Table.Td>
                )}
            </Table.Tr>
        );
    });

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
                            {rows}
                        </Table.Tbody>
                    </Table>
                </Grid.Col>
            </Grid>
        </Box>
    );
}