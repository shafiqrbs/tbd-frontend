"use client"

import React, {useEffect, useState} from "react"
import {useOutletContext} from "react-router-dom"
import {Badge, Box, Group, Paper, Table, Text, TextInput, Title, ActionIcon, Menu, Tooltip} from "@mantine/core"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {getHotkeyHandler} from "@mantine/hooks"
import {storeEntityData} from "../../../../store/core/crudSlice.js"
import inputInlineCss from "../../../../assets/css/InlineInputField.module.css"
import __InhouseAddItem from "./__InhouseAddItem.jsx"
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import {
    IconX
} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/inventory/crudSlice";

function _InhouseTable(props) {
    const {setReloadBatchItemTable,batchId} = props
    const dispatch = useDispatch()
    const {t, i18n} = useTranslation()
    const {isOnline, mainAreaHeight} = useOutletContext()
    const height = mainAreaHeight - 260 //TabList height 104
    const editedData = useSelector((state) => state.productionCrudSlice.entityEditData)
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

    const handelInlineUpdateRawElementData = async ({value, expenseId, type}) => {
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

    const createTableData = () => {
        const allMaterials = new Map()
        editedData?.batch_items?.forEach((item) => {
            item?.production_expenses?.forEach((expense) => {
                if (!allMaterials.has(expense.material_id)) {
                    allMaterials.set(expense.material_id, {
                        id: expense.material_id,
                        material_name: expense.name,
                        unit: expense.uom || "KG",
                        opening_stock: expense.opening_quantity || 0,
                        stock_quantity: expense.stock_quantity || 0,
                        total_stock: (expense.opening_quantity || 0) + (expense.narayangonj_stock || 0),
                        productions: {},
                    })
                }
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

    const calculateTotals = () => {
        const totals = {
            opening_stock: 0,
            narayangonj_stock: 0,
            total_stock: 0,
            issue_quantities: {},
            receive_quantities: {},
            total_issue: 0,
            total_expense: 0,
            total_less: 0,
            total_more: 0,
            remaining_stock: 0
        }

        tableData.forEach(material => {
            totals.opening_stock += material.opening_stock
            totals.narayangonj_stock += material.narayangonj_stock
            totals.total_stock += material.total_stock

            let materialTotalIssue = 0
            let materialTotalExpense = 0

            Object.values(material.productions).forEach(production => {
                materialTotalIssue += production.raw_issue_quantity || 0
                materialTotalExpense += production.needed_quantity || 0

                if (!totals.issue_quantities[production.production_item_id]) {
                    totals.issue_quantities[production.production_item_id] = 0
                }
                totals.issue_quantities[production.production_item_id] += production.raw_issue_quantity || 0

                if (!totals.receive_quantities[production.production_item_id]) {
                    totals.receive_quantities[production.production_item_id] = 0
                }
                totals.receive_quantities[production.production_item_id] += production.needed_quantity || 0
            })

            totals.total_issue += materialTotalIssue
            totals.total_expense += materialTotalExpense

            if (materialTotalIssue > materialTotalExpense) {
                totals.total_less += materialTotalIssue - materialTotalExpense
            } else {
                totals.total_more += materialTotalExpense - materialTotalIssue
            }

            totals.remaining_stock += material.total_stock - materialTotalExpense
        })

        return totals
    }

    const totals = calculateTotals()

    return (
        <>
            <Box pb={"xs"}>
                <__InhouseAddItem setReloadBatchItemTable={setReloadBatchItemTable} batchId={batchId}/>
            </Box>
            <Box className={"borderRadiusAll"}>
                <Paper shadow="sm">
                    <div
                        className={batchTableCss.responsiveTableWrapper}
                        style={{
                            height: height,
                            minHeight: "300px",
                            overflowY: "auto",
                            overflowX: "auto",
                        }}
                    >
                        <Table
                            stickyHeader
                            withTableBorder
                            withColumnBorders
                            striped
                            highlightOnHover
                            className={batchTableCss.table}
                        >
                            <Table.Thead>
                                <Table.Tr className={batchTableCss.topRowBackground}>
                                    <Table.Th rowSpan={3} colSpan={2} ta="center"> {t('BasicInformation')}</Table.Th>
                                    <Table.Th ta="center" colSpan={productionItems?.length * 2 || 0}>
                                        {t('IssueProduction')}
                                    </Table.Th>
                                    <Table.Th ta="center" colSpan={4}>
                                        {t('ExpenseMaterial')}
                                    </Table.Th>
                                    <Table.Th ta="center" colSpan={2}>
                                        {t('CurrentStock')} {editedData?.warehouse_name ? `(${editedData.warehouse_name})` : ''}
                                    </Table.Th>
                                </Table.Tr>
                                <Table.Tr>
                                    {productionItems?.map((item) => (
                                        <React.Fragment key={`issue-${item.id}`}>
                                            <Table.Th className={batchTableCss.successBackground}
                                                      ta="center">{t('Demand')}</Table.Th>
                                            <Table.Th className={batchTableCss.warningBackground}
                                                      ta="center">{t('Receive')}</Table.Th>
                                        </React.Fragment>
                                    ))}
                                    <Table.Th className={batchTableCss.successBackground} rowSpan={3}
                                              ta="center">{t('Demand')}</Table.Th>
                                    <Table.Th className={batchTableCss.warningBackground} rowSpan={3}
                                              ta="center">{t('Expense')}</Table.Th>
                                    <Table.Th className={batchTableCss.lessBackground} rowSpan={3}
                                              ta="center">{t('Less')}</Table.Th>
                                    <Table.Th className={batchTableCss.moreBackground} rowSpan={3}
                                              ta="center">{t('More')}</Table.Th>
                                    <Table.Th className={batchTableCss.stockBackground} rowSpan={3} ta="center">{t('StockIn')}</Table.Th>
                                    <Table.Th className={batchTableCss.remainingBackground} rowSpan={3} ta="center">{t('Remaining')}</Table.Th>
                                </Table.Tr>
                                <Table.Tr>
                                    {productionItems?.map((item) => (
                                        <React.Fragment key={`values-${item.id}`}>
                                            <Table.Td className={batchTableCss.successBackground}>
                                                <ProductionItemQuantityInput
                                                    item={item}
                                                    type="issue_quantity"
                                                    handelInlineUpdateQuantityData={handelInlineUpdateQuantityData}
                                                />
                                            </Table.Td>
                                            <Table.Td className={batchTableCss.warningBackground}>
                                                <ProductionItemQuantityInput
                                                    item={item}
                                                    type="receive_quantity"
                                                    handelInlineUpdateQuantityData={handelInlineUpdateQuantityData}
                                                />
                                            </Table.Td>
                                        </React.Fragment>
                                    ))}
                                </Table.Tr>
                                <Table.Tr className={batchTableCss.highlightedRow}>
                                    <Table.Th>{t('MaterialItem')}</Table.Th>
                                    <Table.Th>{t('Unit')}</Table.Th>
                                    {/*<Table.Th>Narayangonj</Table.Th>*/}
                                    {productionItems?.map((item) => (
                                        <Table.Th key={`header-${item.id}`} ta="center" colSpan={2} color={'red'}
                                                  style={{fontWeight:500}}>
                                            <Box
                                                pos="relative"
                                                h={'60'}
                                                align={'left'}
                                            >
                                                <Tooltip arrowOffset={50} arrowSize={8} color="red.6"  offset={{ mainAxis: -2, crossAxis: 0 }} arrowRadius={2} label={t("RemoveItem")} withArrow  >

                                                <ActionIcon variant="transparent" color="red.6" pos="absolute" top={-10}
                                                        right={-12}
                                                        onClick={() => {
                                                            modals.openConfirmModal({
                                                                title: (
                                                                    <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                                ),
                                                                children: (
                                                                    <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                ),
                                                                labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                                confirmProps: { color: 'red.6' },
                                                                onCancel: () => console.log('Cancel'),
                                                                onConfirm: () => {
                                                                    dispatch(deleteEntityData('production/batch/item-delete/' + item.id))
                                                                    setReloadBatchItemTable(true)
                                                                },
                                                            });
                                                        }} >
                                                    <IconX style={{ width: '60%', height: '60%' }} stroke={1.5} />
                                            </ActionIcon>
                                                </Tooltip>
                                            {item.name}
                                            </Box>

                                        </Table.Th>
                                    ))}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {tableData.map((material) => {
                                    let materialTotalIssue = 0
                                    let materialTotalExpense = 0
                                    let materialTotalLess = 0
                                    let materialTotalMore = 0

                                    Object.values(material.productions).forEach(production => {
                                        materialTotalIssue += production.raw_issue_quantity || 0
                                        materialTotalExpense += production.needed_quantity || 0

                                        if (production.raw_issue_quantity > production.needed_quantity) {
                                            materialTotalLess += production.raw_issue_quantity - production.needed_quantity
                                        } else {
                                            materialTotalMore += production.needed_quantity - production.raw_issue_quantity
                                        }
                                    })

                                    const remainingStock = material.stock_quantity - materialTotalExpense
                                    const isNegative = remainingStock < 0
                                    const remainingStockText = isNegative ? `(${Math.abs(remainingStock)})` : remainingStock

                                    return (
                                        <Table.Tr key={material.id}>
                                            <Table.Td  ta="left">{material.material_name}</Table.Td>
                                            <Table.Td>{material.unit}</Table.Td>

                                            {productionItems?.map((item) => {
                                                const production = material.productions[item.production_item_id]
                                                return (
                                                    <React.Fragment key={`prod-${item.id}-${material.id}`}>
                                                        <Table.Td className={batchTableCss.successBackground}>
                                                            {
                                                                production?.raw_issue_quantity
                                                                    ? Number.isInteger(Number(production.raw_issue_quantity))
                                                                    ? Number(production.raw_issue_quantity)
                                                                    : Number(production.raw_issue_quantity).toFixed(2)
                                                                    : '-'
                                                            }
                                                        </Table.Td>
                                                        <Table.Td className={batchTableCss.warningBackground}>
                                                            {production ? (
                                                                <ProductionRawItemQuantityInput
                                                                    material={material}
                                                                    productionItemId={item.production_item_id}
                                                                    type={'raw_issue_quantity'}
                                                                    handelInlineUpdateRawElementData={handelInlineUpdateRawElementData}
                                                                />
                                                            ) : '-'}
                                                        </Table.Td>
                                                    </React.Fragment>
                                                )
                                            })}

                                            <Table.Td className={batchTableCss.successBackground}>
                                                {Number.isInteger(Number(materialTotalIssue)) ? Number(materialTotalIssue) : Number(materialTotalIssue).toFixed(2)}
                                            </Table.Td>

                                            <Table.Td className={batchTableCss.warningBackground}>
                                                {Number.isInteger(Number(materialTotalExpense)) ? Number(materialTotalExpense) : Number(materialTotalExpense).toFixed(2)}
                                            </Table.Td>

                                            <Table.Td className={batchTableCss.lessBackground}>
                                                {Number.isInteger(Number(materialTotalLess)) ? Number(materialTotalLess) : Number(materialTotalLess).toFixed(2)}
                                            </Table.Td>

                                            <Table.Td className={batchTableCss.moreBackground}>
                                                {Number.isInteger(Number(materialTotalMore)) ? Number(materialTotalMore) : Number(materialTotalMore).toFixed(2)}
                                            </Table.Td>
                                            <Table.Td className={batchTableCss.stockBackground}>
                                                {Number.isInteger(Number(material.stock_quantity)) ? Number(material.stock_quantity) : Number(material.stock_quantity).toFixed(2)}
                                            </Table.Td>
                                            <Table.Td className={batchTableCss.remainingBackground}>
                                                {`${Number.isInteger(Number(remainingStock)) ? Number(remainingStock) : Number(remainingStock).toFixed(2)}`}
                                            </Table.Td>
                                        </Table.Tr>
                                    )
                                })}
                            </Table.Tbody>
                        </Table>
                    </div>
                </Paper>
            </Box>
        </>
    )
}

const ProductionItemQuantityInput = ({item, type, handelInlineUpdateQuantityData}) => {
    const [quantity, setQuantity] = useState(item[type])
    const handleQuantityChange = (e) => {
        const value = e.currentTarget.value
        setQuantity(value)
        handelInlineUpdateQuantityData(value, type, item.batch_id, item.id)
    }

    return (
        <TextInput
            type="number"
            classNames={inputInlineCss}
            size="xs"
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
        setValue(Number.isInteger(Number(production?.needed_quantity)) ? Number(production?.needed_quantity) : Number(production?.needed_quantity).toFixed(2) || 0)
        // setValue(production?.needed_quantity || 0)
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
        <>
            <TextInput
                size="xs"
                type="number"
                value={value}
                onBlur={handleChange}
                onChange={(e) => setValue(e.currentTarget.value)}
                className="text-center"
                classNames={{
                    input: "text-xs text-center px-1 py-1",
                }}
            />
        </>
    )
}
export default _InhouseTable



