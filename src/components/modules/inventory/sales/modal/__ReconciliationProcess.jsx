import React, {useEffect, useState, useRef} from 'react';
import {Box, Button, NumberInput, ScrollArea, Text} from '@mantine/core';
import {useDispatch} from 'react-redux';
import {getIndexEntityData, setFetching} from '../../../../../store/inventory/crudSlice.js';
import {useOutletContext} from 'react-router-dom';
import {modals} from "@mantine/modals";
import {t} from "i18next";
import {storeEntityData} from "../../../../../store/nbr/crudSlice.js";
import {showNotificationComponent} from "../../../../core-component/showNotificationComponent.jsx";

export default function __ReconciliationProcess({closeModel}) {
    const dispatch = useDispatch();
    const {mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 60;
    const scrollableTableRef = useRef(null);
    const fixedTableRef = useRef(null);

    const [rows, setRows] = useState({});
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(false);

    // Sync scroll position between tables
    const handleScroll = (e) => {
        if (scrollableTableRef.current && fixedTableRef.current) {
            if (e.target === scrollableTableRef.current) {
                fixedTableRef.current.scrollTop = e.target.scrollTop;
            } else {
                scrollableTableRef.current.scrollTop = e.target.scrollTop;
            }
        }
    };

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const result = await dispatch(
            getIndexEntityData({
                url: 'inventory/sales/requisition/reconciliation-items',
                param: {},
            })
        );

        if (getIndexEntityData.fulfilled.match(result)) {
            const sales = result.payload.data.sales || {};
            setRows(sales);
            setEditedData(JSON.parse(JSON.stringify(sales)));
        }
        setLoading(false);
    };

    const records = Object.values(editedData);

    const uniqueItemMap = {};
    Object.values(editedData).forEach(row => {
        Object.values(row.items).forEach(item => {
            if (item.quantity > 0) {
                if (!uniqueItemMap[item.name]) uniqueItemMap[item.name] = [];
                uniqueItemMap[item.name].push(item.sales_item_id);
            }
        });
    });
    const itemColumns = Object.keys(uniqueItemMap);

    const uniqueItemStockMap = {};

    Object.values(editedData).forEach(row => {
        Object.values(row.items).forEach(item => {
            if (uniqueItemStockMap[item.name] === undefined) {
                uniqueItemStockMap[item.name] = item.stock_quantity ?? 0;
            }
        });
    });

    // Quantity change
    const handleQuantityChange = (rowIndex, itemId, value) => {
        setEditedData(prev => {
            const updated = {...prev};
            const key = Object.keys(updated)[rowIndex];
            updated[key].items[itemId].quantity = value ?? 0;
            return updated;
        });
    };

    // Approve submit
    const [approveLoading, setApproveLoading] = useState(false);

    const handleApprove = () => {
        modals.openConfirmModal({
            title: (<Text size="md">{t("SalesConformation")}</Text>),
            children: (<Text size="sm">{t("FormConfirmationMessage")}</Text>),
            labels: {confirm: 'Confirm', cancel: 'Cancel'},
            onCancel: () => console.log('Cancel'),
            onConfirm: async (modal) => {
                if (approveLoading) return;
                setApproveLoading(true);

                // Prepare payload
                const payload = Object.values(editedData).map(row => ({
                    sale_id: row.sale_id,
                    invoice: row.invoice,
                    items: Object.values(row.items).map(i => ({
                        sales_item_id: i.sales_item_id,
                        quantity: i.quantity,
                    })),
                }));

                try {
                    // Dispatch only once
                    const resultAction = await dispatch(storeEntityData({
                        url: 'inventory/sales/requisition/reconciliation-items',
                        data: payload
                    }));

                    // Show only **one notification** based on overall API response
                    const message =
                        storeEntityData.fulfilled.match(resultAction)
                            ? resultAction.payload?.data?.message || "Sales approved successfully"
                            : resultAction.payload?.data?.message || "Approval failed";

                    showNotificationComponent(
                        message,
                        storeEntityData.fulfilled.match(resultAction) ? "teal" : "red",
                        "",
                        true
                    );
                    closeModel()

                } catch (error) {
                    showNotificationComponent(
                        "Something went wrong. Please try again.",
                        "red",
                        "",
                        true
                    );
                    closeModel()
                } finally {
                    setApproveLoading(false);
                    dispatch(setFetching(true))
                }
            },
        });
    };

    // Function to calculate row height based on number of inputs - FIXED
    const getRowHeight = (rowIndex) => {
        const rowKey = Object.keys(editedData)[rowIndex];
        const currentRow = editedData[rowKey];
        if (!currentRow) return 45;

        // Find max number of inputs in any item column for this row
        let maxInputs = 1;
        itemColumns.forEach(itemName => {
            const itemIds = uniqueItemMap[itemName] || [];
            let inputCount = 0;
            itemIds.forEach(id => {
                if (currentRow.items?.[id]) inputCount++;
            });
            maxInputs = Math.max(maxInputs, inputCount);
        });

        // Each input takes ~34px (32px height + 2px gap)
        // Minimum 45px, add 32px for each additional input
        return Math.max(45, 32 + ((maxInputs - 1) * 32));
    };

    return (
        <Box style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box style={{
                display: 'flex',
                height: tableHeight,
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <Box style={{
                    flexShrink: 0,
                    borderRight: '2px solid #dee2e6',
                    backgroundColor: 'white',
                    zIndex: 2
                }}>
                    <ScrollArea
                        h={tableHeight}
                        onScrollPositionChange={({y}) => handleScroll({target: {scrollTop: y}})}
                        viewportRef={fixedTableRef}
                    >
                        <Box component="table" style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr style={{height: '45px'}}>
                                <th style={{
                                    width: '150px',
                                    textAlign: 'left',
                                    padding: '8px',
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '2px solid #dee2e6',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1
                                }}>
                                    <Text size="sm" fw={600} style={{whiteSpace: 'nowrap'}}>
                                        Customer
                                    </Text>
                                </th>
                                <th style={{
                                    width: '100px',
                                    textAlign: 'left',
                                    padding: '8px',
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '2px solid #dee2e6',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1
                                }}>
                                    <Text size="sm" fw={600} style={{whiteSpace: 'nowrap'}}>
                                        Invoice
                                    </Text>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr style={{height: `${getRowHeight(0)}px`}}>

                            </tr>
                            {records.map((record, index) => (
                                <tr key={index} style={{height: `${getRowHeight(index)}px`}}>
                                    <td style={{
                                        padding: '8px',
                                        whiteSpace: 'nowrap',
                                        borderBottom: '1px solid #dee2e6',
                                        backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                                    }}>
                                        <Text size="sm" style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: 'block',
                                            lineHeight: 1.5
                                        }}>
                                            {record.customer_name}
                                        </Text>
                                    </td>
                                    <td style={{
                                        padding: '8px',
                                        whiteSpace: 'nowrap',
                                        borderBottom: '1px solid #dee2e6',
                                        backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                                    }}>
                                        <Text size="sm" style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: 'block',
                                            lineHeight: 1.5
                                        }}>
                                            {record.invoice}
                                        </Text>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Box>
                    </ScrollArea>
                </Box>

                <Box style={{
                    flex: 1,
                    overflow: 'auto',
                    minWidth: 0
                }}>
                    <ScrollArea
                        h={tableHeight}
                        onScrollPositionChange={({y}) => handleScroll({target: {scrollTop: y}})}
                        viewportRef={scrollableTableRef}
                    >
                        <Box component="table" style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr style={{height: '45px'}}>
                                {itemColumns.map((itemName, index) => (
                                    <th key={index} style={{
                                        width: '150px',
                                        textAlign: 'center',
                                        padding: '4px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '2px solid #dee2e6',
                                        borderLeft: index === 0 ? 'none' : '1px solid #dee2e6',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1
                                    }}>
                                        <Text
                                            size="sm"
                                            fw={600}
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'block',
                                                textAlign: 'center',
                                                padding: '0 2px'
                                            }}
                                            title={itemName}
                                        >
                                            {itemName}
                                        </Text>
                                    </th>
                                ))}
                            </tr>

                            <tr style={{height: '45px'}}>
                                {itemColumns.map(itemName => (
                                    <th
                                        key={itemName}
                                        style={{
                                            background: '#f1f3f5',
                                            borderBottom: '2px solid #dee2e6',
                                            textAlign: 'center',
                                            fontSize: 15,
                                            whiteSpace: 'nowrap',
                                            color: 'red'
                                        }}
                                    >
                                        {uniqueItemStockMap[itemName]}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {records.map((record, rowIndex) => {
                                const rowKey = Object.keys(editedData)[rowIndex];
                                const currentRow = editedData[rowKey];
                                const rowHeight = getRowHeight(rowIndex);

                                return (
                                    <tr key={rowIndex} style={{height: `${rowHeight}px`}}>
                                        {itemColumns.map((itemName, colIndex) => {
                                            const itemIds = uniqueItemMap[itemName] || [];

                                            return (
                                                <td key={colIndex} style={{
                                                    padding: '4px',
                                                    borderBottom: '1px solid #dee2e6',
                                                    borderLeft: colIndex === 0 ? 'none' : '1px solid #dee2e6',
                                                    backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f8f9fa',
                                                    verticalAlign: 'middle'
                                                }}>
                                                    <Box style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2,
                                                        justifyContent: 'center',
                                                        height: '100%'
                                                    }}>
                                                        {itemIds.map(id => {
                                                            const itemData = currentRow?.items?.[id];
                                                            if (!itemData) return null;
                                                            return (
                                                                <NumberInput
                                                                    key={id}
                                                                    value={itemData.quantity}
                                                                    size="xs"
                                                                    min={0}
                                                                    hideControls
                                                                    styles={{
                                                                        input: {
                                                                            height: 30,
                                                                            textAlign: 'center',
                                                                            padding: '0 4px',
                                                                            width: '100%',
                                                                            fontSize: '13px',
                                                                            minHeight: 30
                                                                        }
                                                                    }}
                                                                    onChange={value => handleQuantityChange(rowIndex, id, value)}
                                                                />
                                                            );
                                                        })}
                                                    </Box>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Box>
                    </ScrollArea>
                </Box>
            </Box>

            <Box style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 16,
                padding: '12px 0',
                borderTop: '1px solid #e9ecef'
            }}>
                <Button
                    color="green"
                    onClick={handleApprove}
                    size="md"
                    style={{minWidth: 120}}
                    disabled={approveLoading}
                >
                    {approveLoading ? 'Processing...' : 'Approve'}
                </Button>

            </Box>
        </Box>
    );
}

