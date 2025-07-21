"use client"

import React, {useEffect, useState} from "react"
import { useOutletContext } from "react-router-dom"
import {ActionIcon, Badge, Box, Group, Paper, ScrollArea, Table, Text, TextInput, Title} from "@mantine/core"
import { DataTable } from "mantine-datatable"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { getHotkeyHandler } from "@mantine/hooks"
import { storeEntityData } from "../../../../store/core/crudSlice.js"
import tableCss from "../../../../assets/css/Table.module.css"
import inputInlineCss from "../../../../assets/css/InlineInputField.module.css"
import __InhouseAddItem from "./__InhouseAddItem.jsx"
import {IconX} from "@tabler/icons-react";
import innerTableCss from "../../../../assets/css/TableInner.module.css";

function _InhouseTable(props) {
    const { setReloadBatchItemTable } = props
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()
    const { isOnline, mainAreaHeight } = useOutletContext()
    const height = mainAreaHeight - 120 //TabList height 104
    const editedData = useSelector((state) => state.productionCrudSlice.entityEditData)
    const [expandedCompanyIds, setExpandedCompanyIds] = useState([])

    const handelInlineUpdateQuantityData = async (quantity, type, batchId, recipeItemId) => {
        const value = {
            url: "production/batch/item/inline-quantity-update",
            data: {
                quantity: quantity,
                type: type,
                batch_id: batchId,
                batch_item_id: recipeItemId,
            },
        }
        const resultAction = await dispatch(storeEntityData(value))
        if (storeEntityData.rejected.match(resultAction)) {
            const fieldErrors = resultAction.payload.errors
            console.log(fieldErrors)
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            setReloadBatchItemTable(true)
        }
    }

    const handelInlineUpdateRawElementData = async ({ value, expenseId, type }) => {
        const requestData = {
            url: "production/batch/raw-item/inline-quantity-update",
            data: {
                value,
                expense_id: expenseId,
                type
            }
        }
        const resultAction = await dispatch(storeEntityData(requestData))
        if (storeEntityData.rejected.match(resultAction)) {
            const fieldErrors = resultAction.payload.errors
            console.log(fieldErrors)
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            setReloadBatchItemTable(true)
        }
    }

    // Create table data structure following PDF format
    const createTableData = () => {
        const allMaterials = new Map()
        // Collect all unique raw materials with their production data
        editedData?.batch_items?.forEach((item) => {
            item?.production_expenses?.forEach((expense) => {
                if (!allMaterials.has(expense.material_id)) {
                    allMaterials.set(expense.material_id, {
                        id: expense.material_id,
                        material_name: expense.name,
                        unit: expense.uom || "KG",
                        opening_stock: expense.opening_quantity || 0,
                        narayangonj_stock: expense.narayangonj_stock || 0, // Add if available
                        total_stock: (expense.opening_quantity || 0) + (expense.narayangonj_stock || 0),
                        productions: {},
                    })
                }
                // Add production data for this material
                const materialData = allMaterials.get(expense.material_id)
                materialData.productions[item.production_item_id] = {
                    ...expense,
                    production_item_name: item.name,
                    batch_item_id: item.id,
                    issue_quantity: item.issue_quantity || 0,
                    receive_quantity: item.receive_quantity || 0,
                    expense_quantity: expense.quantity || 0,
                    less_quantity: expense.less_quantity || 0,
                    more_quantity: expense.more_quantity || 0,
                    remaining_stock: materialData.total_stock - (expense.quantity || 0),
                }
            })
        })
        return Array.from(allMaterials.values())
    }

    const tableData = createTableData()
    const productionItems = editedData?.batch_items


    const columns = [
        {
            accessor: "material_name",
            title: t("Material Element"),
            width: 150
        },
        {
            accessor: "unit",
            title: 'Unit',
            width: 60,
            textAlign: "center"
        },
        {
            accessor: "opening_stock",
            title: 'Opening',
            width: 80,
            textAlign: "center"
        },
        {
            accessor: "narayangonj_stock",
            width: 90,
            textAlign: "center"
        },
        {
            accessor: "total_stock",
            width: 90,
            textAlign: "center"
        },
        ...(Array.isArray(productionItems) ? productionItems.map(item => ({
            accessor: `production_${item.production_item_id}`,
            title: (
                <Box ta="center" style={{}}>
                    <Text weight={600} size="xs" mb={2}>
                        {item.name}
                    </Text>
                    <Group spacing={2} justify="center">
                        <Box ta="center" style={{flex: 1, padding: "2px"}}>
                            <Text size="xs" color="#de074f" mb={2}>
                                Issue Qty
                            </Text>
                            <ProductionItemQuantityInput
                                item={item}
                                type="issue_quantity"
                                handelInlineUpdateQuantityData={handelInlineUpdateQuantityData}
                            />
                        </Box>
                        <Box ta="center" style={{flex: 1, padding: "2px"}}>
                            <Text size="xs" color="#08d108" mb={2}>
                                Receive Qty
                            </Text>
                            <ProductionItemQuantityInput
                                item={item}
                                type="receive_quantity"
                                handelInlineUpdateQuantityData={handelInlineUpdateQuantityData}
                            />
                        </Box>
                    </Group>
                </Box>
            ),
            width: 160,
            render: (material) => {
                const production = material.productions[item.production_item_id]
                if (!production)
                    return (
                        <Text size="xs" color="dimmed" ta="center">
                            -
                        </Text>
                    )
                return (
                    <Box style={{padding: "4px"}}>
                        <Group spacing={2} mb={4} justify="center">
                            <Box ta="center" style={{flex: 1, padding: "2px", borderRadius: "2px"}}>
                                <Text size="xs" weight={500} color="#7b1fa2">
                                    {production.raw_issue_quantity}
                                </Text>
                            </Box>
                            <Box ta="center" style={{flex: 1, padding: "2px", borderRadius: "2px"}}>
                                <ProductionRawItemQuantityInput
                                    material={material}
                                    productionItemId={item.production_item_id}
                                    type={'raw_issue_quantity'}
                                    handelInlineUpdateRawElementData={handelInlineUpdateRawElementData}
                                />
                            </Box>
                        </Group>
                    </Box>
                )
            },
        })) : []),

        {
            accessor: "total_issue_expense",
            title: 'Issue',
            width: 100,
            render: (material) => {
                let totalExpense = 0
                Object?.values(material?.productions)?.forEach((production) => {
                    totalExpense += production.raw_issue_quantity || 0
                })
                return (
                    <Box ta="center" style={{  padding: "4px" }}>
                        <Text size="sm" weight={600} color="#ef6c00">
                            {totalExpense}
                        </Text>
                    </Box>
                )
            },
        },

        {
            accessor: "total_expense_expense",
            title: 'Expense',
            width: 100,
            render: (material) => {
                let totalExpense = 0
                Object?.values(material?.productions)?.forEach((production) => {
                    totalExpense += production.needed_quantity || 0
                })
                return (
                    <Box ta="center" style={{  padding: "4px" }}>
                        <Text size="sm" weight={600} color="#ef6c00">
                            {totalExpense}
                        </Text>
                    </Box>
                )
            },
        },

        {
            accessor: "less",
            title: 'Less',
            width: 100,
            render: (material) => {
                let totalIssue = 0
                let totalExpense = 0
                Object?.values(material?.productions)?.forEach((production) => {
                    totalExpense += production.needed_quantity || 0
                    totalIssue += production.raw_issue_quantity || 0
                })
                return (
                    <Box ta="center" style={{  padding: "4px" }}>
                        <Text size="sm" weight={600} color="#ef6c00">
                            {totalIssue>totalExpense?totalExpense-totalIssue:0}
                        </Text>
                    </Box>
                )
            },
        },

        {
            accessor: "more",
            title: 'More',
            width: 100,
            render: (material) => {
                let totalIssue = 0
                let totalExpense = 0
                Object?.values(material?.productions)?.forEach((production) => {
                    totalExpense += production.needed_quantity || 0
                    totalIssue += production.raw_issue_quantity || 0
                })
                return (
                    <Box ta="center" style={{  padding: "4px" }}>
                        <Text size="sm" weight={600} color="#ef6c00">
                            {totalExpense>totalIssue?totalExpense-totalIssue:0}
                        </Text>
                    </Box>
                )
            },
        },

        {
            accessor: "stock_in",
            title: (
                <Box ta="center" style={{ padding: "4px" }}>
                    <Text weight={600} size="xs">
                        Stock In
                    </Text>
                </Box>
            ),
            width: 90,
            render: (material) => {
                return (
                    <Box ta="center" style={{  padding: "4px" }}>
                        <Text size="sm" weight={500} color="#1976d2">
                            {material.total_stock}
                        </Text>
                    </Box>
                )
            },
        },
        {
            accessor: "remaining_stock",
            title: (
                <Box ta="center" style={{ padding: "4px" }}>
                    <Text weight={600} size="xs">
                        Remaining Stock
                    </Text>
                </Box>
            ),
            width: 120,
            render: (material) => {
                // Calculate total consumption across all productions
                let totalConsumption = 0
                Object?.values(material?.productions)?.forEach((production) => {
                    totalConsumption += production.needed_quantity || 0
                })
                const remainingStock = material.total_stock - totalConsumption
                const isNegative = remainingStock < 0
                const backgroundColor = isNegative ? "#ffebee" : remainingStock === 0 ? "#fff8e1" : "#e8f5e8"
                const textColor = isNegative ? "#d32f2f" : remainingStock === 0 ? "#f57c00" : "#2e7d32"
                return (
                    <Box ta="center" style={{ padding: "6px", borderRadius: "4px" }}>
                        <Text size="sm" weight={600} color={textColor}>
                            {isNegative ? `(${Math.abs(remainingStock)})` : remainingStock}
                        </Text>
                        {isNegative && (
                            <Text size="xs" color="#d32f2f" mt={2}>
                                Shortage
                            </Text>
                        )}
                    </Box>
                )
            },
        }
    ]

    return (
        <>
            <Box pb={"xs"}>
                <__InhouseAddItem setReloadBatchItemTable={setReloadBatchItemTable} />
            </Box>
            <Box className={"borderRadiusAll"}>
                    <Paper shadow="sm" p="md" mb="xl">
                        <Group mb="md">
                            <Title order={2}>Production Batch: {editedData.invoice}</Title>
                            <Badge color="blue" variant="light">
                                {editedData.process}
                            </Badge>
                            <Badge color="green" variant="light">
                                {editedData.mode}
                            </Badge>
                        </Group>
                        <Group>
                            <Text size="sm" color="dimmed">
                                Created: {editedData.created_date}
                            </Text>
                            <Text size="sm" color="dimmed">
                                Issue Date: {editedData.issue_date}
                            </Text>
                        </Group>
                    </Paper>
                    <Paper shadow="sm" p="md">
                        <DataTable
                            withTableBorder
                            withColumnBorders
                            highlightOnHover
                            columns={columns}
                            records={tableData}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height}
                            classNames={{
                                root: tableCss.root,
                                table: tableCss.table,
                                header: tableCss.header,
                                footer: tableCss.footer,
                            }}
                            scrollAreaProps={{ type: "never" }}
                        />
                    </Paper>
            </Box>


            {/*<Box className={'borderRadiusAll'}>

                <DataTable
                    withTableBorder
                    withColumnBorders
                    highlightOnHover
                    columns={[
                        {
                            accessor: 'name',
                            title: t('Item'),
                            noWrap: true,
                            render: (batchItem) => (
                                <>
                                    <span>{batchItem.name}</span>
                                </>
                            ),
                        },
                        {
                            accessor: 'issue_quantity',
                            title: t('Issue'),
                            textAlign: "center",
                            width: '100px',
                            render: (item) => {
                                const [issueQuantity, setIssueQuantity] = useState(item.issue_quantity);

                                const handelIssueQuantityChange = (e) => {
                                    const issueQuantity = e.currentTarget.value;
                                    setIssueQuantity(issueQuantity);
                                    handelInlineUpdateQuantityData(issueQuantity,'issue_quantity',item.batch_id,item.id)
                                };

                                return (
                                    <>
                                        <TextInput
                                            type="number"
                                            label=""
                                            size="xs"
                                            classNames={inputInlineCss}
                                            id={"inline-update-issue-quantity-"+item.id}
                                            value={issueQuantity}
                                            onBlur={handelIssueQuantityChange}
                                            onChange={(e)=>{
                                                setIssueQuantity(e.currentTarget.value)
                                            }}
                                            onKeyDown={getHotkeyHandler([
                                                ['Enter', (e) => {
                                                    document.getElementById('inline-update-receive-quantity-' + item.product_id).focus();
                                                }],
                                            ])}
                                        />
                                    </>
                                );
                            }
                        },
                        {
                            accessor: 'receive_quantity',
                            title: t('Receive'),
                            textAlign: "center",
                            width: '110px',
                            render: (item) => {
                                const [receiveQuantity, setReceiveQuantity] = useState(item.receive_quantity);

                                const handelReceiveQuantityChange = (e) => {
                                    const receiveQuantity = e.currentTarget.value;
                                    setReceiveQuantity(receiveQuantity);

                                    handelInlineUpdateQuantityData(receiveQuantity,'receive_quantity',item.batch_id,item.id)
                                };

                                return (
                                    <>
                                        <TextInput
                                            type="number"
                                            label=""
                                            size="xs"
                                            classNames={inputInlineCss}
                                            id={"inline-update-receive-quantity-"+item.id}
                                            value={receiveQuantity}
                                            onBlur={handelReceiveQuantityChange}
                                            onChange={(e)=>{
                                                setReceiveQuantity(e.currentTarget.value)
                                            }}
                                            onKeyDown={getHotkeyHandler([
                                                ['Enter', (e) => {
                                                    document.getElementById('inline-update-damage-quantity-' + item.product_id).focus();
                                                }],
                                            ])}
                                        />
                                    </>
                                );
                            }
                        },
                        {
                            accessor: 'damage_quantity',
                            title: t('Damage'),
                            textAlign: "center",
                            width: '110px',
                            render: (item) => {
                                const [damageQuantity, setDamageQuantity] = useState(item.damage_quantity);

                                const handelDamageQuantityChange = (e) => {
                                    const damageQuantity = e.currentTarget.value;
                                    setDamageQuantity(damageQuantity);

                                    handelInlineUpdateQuantityData(damageQuantity,'damage_quantity',item.batch_id,item.id)
                                };

                                return (
                                    <>
                                        <TextInput
                                            type="number"
                                            label=""
                                            classNames={inputInlineCss}
                                            size="xs"
                                            id={"inline-update-damage-quantity-"+item.id}
                                            value={damageQuantity}
                                            onBlur={handelDamageQuantityChange}
                                            onChange={(e)=>{
                                                setDamageQuantity(e.currentTarget.value)
                                            }}
                                        />
                                    </>
                                );
                            }
                        },
                        { accessor: 'stock_qty', title: t('Stock') },
                        { accessor: 'uom', title: t('UOM') },
                        { accessor: 'status', title: t('Status') },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <ActionIcon
                                        size="sm"
                                        variant="outline"
                                        radius="xl"
                                        color='var(--theme-remove-color)'
                                        onClick={() => handleSubDomainDelete(item.id)}
                                    >
                                        <IconX
                                            size={16}
                                            style={{width: "70%", height: "70%"}}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Group>
                            ),
                        },
                    ]}
                    records={editedData.batch_items}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer
                    }}
                    scrollAreaProps={{ type: 'never' }}
                    rowExpansion={{
                        allowMultiple: true,
                        trigger: 'always',
                        expanded: { recordIds: expandedCompanyIds, onRecordIdsChange: setExpandedCompanyIds },
                        content: (batchItem) => {
                            return batchItem?.record?.production_expenses ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <div style={{width: '100%'}}>
                                        <DataTable
                                            withTableBorder
                                            withColumnBorders
                                            highlightOnHover
                                            classNames={{
                                                root: innerTableCss.root,
                                                table: innerTableCss.table,
                                                body: innerTableCss.body,
                                                header: innerTableCss.header,
                                                footer: innerTableCss.footer
                                            }}
                                            columns={[
                                                {accessor: 'name', title: t('Item')},
                                                {accessor: 'quantity', title: t('Quantity'), width: '80px'},
                                                {accessor: 'needed_quantity', title: t('Total'), width: '80px'},
                                                {accessor: 'stock_quantity', title: t('Stock'), width: '80px'},
                                                {accessor: 'less_quantity', title: t('Less'), width: '80px'},
                                                {accessor: 'more_quantity', title: t('More'), width: '80px'},
                                            ]}
                                            records={batchItem?.record?.production_expenses}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>No data</div>
                            );
                        },
                    }}
                />

            </Box>*/}
        </>
        /*<>

            <Box pb="xs">
            <__InhouseAddItem setReloadBatchItemTable={setReloadBatchItemTable} />
        </Box>

    <Box className="borderRadiusAll">
        <Paper shadow="sm" p="md" mb="xl">
            <Group mb="md">
                <Title order={2}>Production Batch: {editedData.invoice}</Title>
                <Badge color="blue" variant="light">
                    {editedData.process}
                </Badge>
                <Badge color="green" variant="light">
                    {editedData.mode}
                </Badge>
            </Group>
            <Group>
                <Text size="sm" c="dimmed">
                    Created: {editedData.created_date}
                </Text>
                <Text size="sm" c="dimmed">
                    Issue Date: {editedData.issue_date}
                </Text>
            </Group>
        </Paper>

        <ScrollArea h={height} type="never">
            <Table
                withTableBorder
                withColumnBorders
                style={{ border: '1px solid #ccc' }}
                className="border border-red-700"
                striped
                highlightOnHover
                fontSize="xs"
                verticalSpacing="xs"
                horizontalSpacing="xs"
            >
                <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th rowSpan={2} style={{ width: 150 }}>Material Element</th>
                    <th rowSpan={2} style={{ width: 60, textAlign: 'center' }}>Unit</th>
                    <th rowSpan={2} style={{ width: 80, textAlign: 'center' }}>Opening</th>
                    <th rowSpan={2} style={{ width: 90, textAlign: 'center' }}>N'Ganj Stock</th>
                    <th rowSpan={2} style={{ width: 90, textAlign: 'center' }}>Total Stock</th>

                    {productionItems.map((item) => (
                        <th key={item.production_item_id} colSpan={2} style={{ width: 160, textAlign: 'center' }}>
                            <Text fw={600} size="xs">{item.name}</Text>
                        </th>
                    ))}

                    <th rowSpan={2} style={{ width: 100 }}>Issue</th>
                    <th rowSpan={2} style={{ width: 100 }}>Expense</th>
                    <th rowSpan={2} style={{ width: 100 }}>Less</th>
                    <th rowSpan={2} style={{ width: 100 }}>More</th>
                    <th rowSpan={2} style={{ width: 90 }}>Stock In</th>
                    <th rowSpan={2} style={{ width: 120 }}>Remaining Stock</th>
                </tr>
                <tr style={{ backgroundColor: '#fafafa' }}>
                    {productionItems.map((item) => (
                        <React.Fragment key={`sub-${item.production_item_id}`}>
                            <th style={{ textAlign: 'center' }}>
                                <Text size="xs" c="#de074f">Issue Qty</Text>
                            </th>
                            <th style={{ textAlign: 'center' }}>
                                <Text size="xs" c="#08d108">Receive Qty</Text>
                            </th>
                        </React.Fragment>
                    ))}
                </tr>
                </thead>
                <tbody>
                {tableData.map((material, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{material.material_name}</td>
                        <td style={{ textAlign: 'center' }}>{material.unit}</td>
                        <td style={{ textAlign: 'center' }}>{material.opening_stock}</td>
                        <td style={{ textAlign: 'center' }}>{material.narayangonj_stock}</td>
                        <td style={{ textAlign: 'center' }}>{material.total_stock}</td>

                        {productionItems.map((item) => {
                            const production = material.productions[item.production_item_id];
                            return (
                                <React.Fragment key={`row-${rowIndex}-${item.production_item_id}`}>
                                    <td>
                                        <Text size="xs" fw={500} c="#7b1fa2" ta="center">
                                            {production?.raw_issue_quantity ?? '-'}
                                        </Text>
                                    </td>
                                    <td>
                                        {production?.needed_quantity ? (
                                            <ProductionRawItemQuantityInput
                                                material={material}
                                                productionItemId={item.production_item_id}
                                                type="raw_issue_quantity"
                                                handelInlineUpdateRawElementData={handelInlineUpdateRawElementData}
                                            />
                                        ) : (
                                            <Text size="xs" c="dimmed" ta="center">-</Text>
                                        )}

                                    </td>
                                </React.Fragment>
                            );
                        })}

                        {/!* Issue total *!/}
                        <td style={{ backgroundColor: '#fef6e0', textAlign: 'center' }}>
                            <Text c="#ef6c00" fw={600}>
                                {Object.values(material.productions ?? {}).reduce((sum, p) => sum + (p.raw_issue_quantity || 0), 0)}
                            </Text>
                        </td>

                        {/!* Expense total *!/}
                        <td style={{ backgroundColor: '#fef6e0', textAlign: 'center' }}>
                            <Text c="#ef6c00" fw={600}>
                                {Object.values(material.productions ?? {}).reduce((sum, p) => sum + (p.needed_quantity || 0), 0)}
                            </Text>
                        </td>

                        {/!* Less *!/}
                        <td style={{ backgroundColor: '#fff8e1', textAlign: 'center' }}>
                            <Text c="#ef6c00" fw={600}>
                                {(() => {
                                    const issue = Object.values(material.productions).reduce((s, p) => s + (p.raw_issue_quantity || 0), 0);
                                    const expense = Object.values(material.productions).reduce((s, p) => s + (p.needed_quantity || 0), 0);
                                    return issue > expense ? expense - issue : 0;
                                })()}
                            </Text>
                        </td>

                        {/!* More *!/}
                        <td style={{ backgroundColor: '#fff8e1', textAlign: 'center' }}>
                            <Text c="#ef6c00" fw={600}>
                                {(() => {
                                    const issue = Object.values(material.productions).reduce((s, p) => s + (p.raw_issue_quantity || 0), 0);
                                    const expense = Object.values(material.productions).reduce((s, p) => s + (p.needed_quantity || 0), 0);
                                    return expense > issue ? expense - issue : 0;
                                })()}
                            </Text>
                        </td>

                        {/!* Stock In *!/}
                        <td style={{ textAlign: 'center' }}>
                            <Text size="sm" fw={500} c="#1976d2">
                                {material.total_stock}
                            </Text>
                        </td>

                        {/!* Remaining Stock *!/}
                        <td>
                            {(() => {
                                const totalExpense = Object.values(material.productions || {}).reduce(
                                    (sum, p) => sum + (p.needed_quantity || 0),
                                    0
                                );
                                const remaining = material.total_stock - totalExpense;
                                const isNegative = remaining < 0;
                                const textColor = isNegative ? '#d32f2f' : remaining === 0 ? '#f57c00' : '#2e7d32';

                                return (
                                    <Box ta="center" py={6}>
                                        <Text size="sm" fw={600} c={textColor}>
                                            {isNegative ? `(${Math.abs(remaining)})` : remaining}
                                        </Text>
                                        {isNegative && (
                                            <Text size="xs" c="#d32f2f" mt={2}>
                                                Shortage
                                            </Text>
                                        )}
                                    </Box>
                                );
                            })()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </ScrollArea>
    </Box>
        </>*/
    )
}

// Separate component for quantity inputs to avoid re-rendering issues
const ProductionItemQuantityInput = ({ item, type, handelInlineUpdateQuantityData }) => {
    const [quantity, setQuantity] = useState(item[type])
    const handleQuantityChange = (e) => {
        const value = e.currentTarget.value
        setQuantity(value)
        handelInlineUpdateQuantityData(value, type, item.batch_id, item.id)
    }

    return (
        <TextInput
            type="number"
            size="xs"
            style={{ width: 50 }}
            classNames={inputInlineCss}
            id={`inline-update-${type}-${item.id}`}
            value={quantity}
            onBlur={handleQuantityChange}
            onChange={(e) => setQuantity(e.currentTarget.value)}
            onKeyDown={getHotkeyHandler([
                [
                    "Enter",
                    (e) => {
                        const nextType = type === "issue_quantity" ? "receive_quantity" : "issue_quantity"
                        const nextElement = document.getElementById(`inline-update-${nextType}-${item.id}`)
                        if (nextElement) nextElement.focus()
                    },
                ],
            ])}
        />
    )
}

const ProductionRawItemQuantityInput = ({
                                            material,
                                            productionItemId,
                                            type,
                                            handelInlineUpdateRawElementData,
                                        }) => {
    const production = material.productions[productionItemId]
    const [value, setValue] = useState(production?.needed_quantity || 0)

    // Sync state if parent changes
    useEffect(() => {
        setValue(production?.needed_quantity || 0)
    }, [production?.needed_quantity])

    const handleChange = (event) => {
        const newValue = Number(event.target.value)
        setValue(newValue)
        handelInlineUpdateRawElementData({
            value: newValue,
            expenseId: production.id,
            type
        })
    }

    return (
        <TextInput
            size="xs"
            value={value}
            onBlur={handleChange}
            onChange={(e) => setValue(e.currentTarget.value)}
            className="text-center"
            classNames={{
                input: "text-xs text-center px-1 py-1",
            }}
        />
    )
}
export default _InhouseTable



