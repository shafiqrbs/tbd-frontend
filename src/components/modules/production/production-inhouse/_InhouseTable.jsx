"use client"

import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Badge, Box, Group, Paper, Text, TextInput, Title } from "@mantine/core"
import { DataTable } from "mantine-datatable"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { getHotkeyHandler } from "@mantine/hooks"
import { storeEntityData } from "../../../../store/core/crudSlice.js"
import tableCss from "../../../../assets/css/Table.module.css"
import inputInlineCss from "../../../../assets/css/InlineInputField.module.css"
import __InhouseAddItem from "./__InhouseAddItem.jsx"

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

    // Create table data structure following PDF format
    const createTableData = () => {
        const allMaterials = new Map()
        // Collect all unique raw materials with their production data
        editedData.batch_items.forEach((item) => {
            item.production_expenses.forEach((expense) => {
                if (!allMaterials.has(expense.material_id)) {
                    allMaterials.set(expense.material_id, {
                        id: expense.material_id,
                        material_name: expense.name,
                        unit: expense.unit || "KG",
                        opening_stock: expense.stock_quantity || 0,
                        narayangonj_stock: expense.narayangonj_stock || 0, // Add if available
                        total_stock: (expense.stock_quantity || 0) + (expense.narayangonj_stock || 0),
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
    const productionItems = editedData.batch_items

    // Define consistent background colors for columns
    const columnColors = {
        material: "#de074f", // Light blue-grey
        stockGreen: "#08d108", // Light green
        stockBlue: "#0463ca", // Light blue
        stockOrange: "#d68205", // Light orange
        lessMoreGreen: "#90c907", // Very light green
    }

    const columns = [
        {
            accessor: "material_name",
            title: t("Material Element"),
            width: 150,
            /*render: (material) => (
                <Box style={{ backgroundColor: columnColors.material, padding: "4px" }}>
                    <Text weight={500} size="sm">
                        {material.material_name}
                    </Text>
                </Box>
            ),*/
        },
        {
            accessor: "unit",
            /*title: (
                <Box ta="center" style={{ backgroundColor: columnColors.material, padding: "4px" }}>
                    <Text weight={600} size="xs">
                        {t("Unit")}
                    </Text>
                </Box>
            ),*/
            width: 60,
            textAlign: "center",
            /*render: (material) => (
                <Box ta="center" style={{ backgroundColor: columnColors.material, padding: "4px" }}>
                    <Text size="sm">{material.unit}</Text>
                </Box>
            ),*/
        },
        {
            accessor: "opening_stock",
            title: 'Opening',
            /*title: (
                <Box ta="center" style={{ backgroundColor: columnColors.stockGreen, padding: "4px" }}>
                    <Text weight={600} size="xs" color="#2e7d32">
                        {t("Opening")}
                    </Text>
                </Box>
            ),*/
            width: 80,
            textAlign: "center",
            /*render: (material) => (
                <Box ta="center" style={{ backgroundColor: columnColors.stockGreen, padding: "4px" }}>
                    <Text size="sm" color="#2e7d32">
                        {material.opening_stock}
                    </Text>
                </Box>
            ),*/
        },
        {
            accessor: "narayangonj_stock",
            /*title: (
                <Box ta="center" style={{ backgroundColor: columnColors.stockBlue, padding: "4px" }}>
                    <Text weight={600} size="xs" color="#1976d2">
                        {t("Narayangonj")}
                    </Text>
                </Box>
            ),*/
            width: 90,
            textAlign: "center",
            /*render: (material) => (
                <Box ta="center" style={{ backgroundColor: columnColors.stockBlue, padding: "4px" }}>
                    <Text size="sm" color="#1976d2">
                        {material.narayangonj_stock}
                    </Text>
                </Box>
            ),*/
        },
        {
            accessor: "total_stock",
            /*title: (
                <Box ta="center" style={{ backgroundColor: columnColors.stockOrange, padding: "4px" }}>
                    <Text weight={600} size="xs" color="#f57c00">
                        {t("Total Stock")}
                    </Text>
                </Box>
            ),*/
            width: 90,
            textAlign: "center",
            /*render: (material) => (
                <Box ta="center" style={{ backgroundColor: columnColors.stockOrange, padding: "4px" }}>
                    <Text size="sm" weight={600} color="#f57c00">
                        {material.total_stock}
                    </Text>
                </Box>
            ),*/
        },
        ...productionItems.map((item) => ({
            accessor: `production_${item.production_item_id}`,
            title: (
                <Box ta="center" style={{ backgroundColor: "#f3e5f5" }}>
                    <Text weight={600} size="xs" mb={2} color="#1976d2">
                        {item.name}
                    </Text>
                    <Group spacing={2} justify="center">
                        <Box ta="center" style={{ flex: 1, padding: "2px", backgroundColor: "#f3e5f5" }}>
                            <Text size="xs" color="#7b1fa2" mb={2}>
                                Issue Qty
                            </Text>
                            <ProductionItemQuantityInput
                                item={item}
                                type="issue_quantity"
                                handelInlineUpdateQuantityData={handelInlineUpdateQuantityData}
                            />
                        </Box>
                        <Box ta="center" style={{ flex: 1, padding: "2px", backgroundColor: "#f3e5f5" }}>
                            <Text size="xs" color="#388e3c" mb={2}>
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
                    <Box style={{ backgroundColor: columnColors.stockBlue, padding: "4px" }}>
                        <Group spacing={2} mb={4} justify="center">
                            <Box ta="center" style={{ flex: 1, backgroundColor: "#f3e5f5", padding: "2px", borderRadius: "2px" }}>
                                <Text size="xs" weight={500} color="#7b1fa2">
                                    {production.issue_quantity}
                                </Text>
                            </Box>
                            <Box ta="center" style={{ flex: 1, backgroundColor: "#e8f5e8", padding: "2px", borderRadius: "2px" }}>
                                <Text size="xs" weight={500} color="#388e3c">
                                    {production.receive_quantity}
                                </Text>
                            </Box>
                        </Group>
                        <Group spacing={4} justify="center" mb={2}>
                            <Box ta="center" style={{ backgroundColor: "#fff3e0", padding: "2px", borderRadius: "2px" }}>
                                <Text size="xs" color="#f57c00">
                                    Expense: {production.expense_quantity}
                                </Text>
                            </Box>
                        </Group>
                        {(production.less_quantity > 0 || production.more_quantity > 0) && (
                            <Group spacing={4} justify="center" mt={2}>
                                {production.less_quantity > 0 && (
                                    <Box ta="center" style={{ backgroundColor: "#ffebee", padding: "2px", borderRadius: "2px" }}>
                                        <Text size="xs" color="#d32f2f" weight={500}>
                                            Less: {production.less_quantity}
                                        </Text>
                                    </Box>
                                )}
                                {production.more_quantity > 0 && (
                                    <Box ta="center" style={{ backgroundColor: "#e8f5e8", padding: "2px", borderRadius: "2px" }}>
                                        <Text size="xs" color="#2e7d32" weight={500}>
                                            More: {production.more_quantity}
                                        </Text>
                                    </Box>
                                )}
                            </Group>
                        )}
                    </Box>
                )
            },
        })),
      /*  {
            accessor: "total_expense",
            title: (
                <Box ta="center" style={{ backgroundColor: columnColors.stockOrange, padding: "4px" }}>
                    <Text weight={600} size="xs" color="#ef6c00">
                        Total Expense
                    </Text>
                </Box>
            ),
            width: 100,
            render: (material) => {
                let totalExpense = 0
                Object.values(material.productions).forEach((production) => {
                    totalExpense += production.expense_quantity || 0
                })
                return (
                    <Box ta="center" style={{ backgroundColor: columnColors.stockOrange, padding: "4px" }}>
                        <Text size="sm" weight={600} color="#ef6c00">
                            {totalExpense}
                        </Text>
                    </Box>
                )
            },
        },
        {
            accessor: "less_more",
            title: (
                <Box ta="center" style={{ backgroundColor: columnColors.lessMoreGreen, padding: "4px" }}>
                    <Group justify="center" spacing={8}>
                        <Text weight={600} size="xs" color="#d32f2f">
                            Less
                        </Text>
                        <Text weight={600} size="xs" color="#2e7d32">
                            More
                        </Text>
                    </Group>
                </Box>
            ),
            width: 120,
            render: (material) => {
                let totalLess = 0
                let totalMore = 0
                Object.values(material.productions).forEach((production) => {
                    totalLess += production.less_quantity || 0
                    totalMore += production.more_quantity || 0
                })
                return (
                    <Box style={{ backgroundColor: columnColors.lessMoreGreen, padding: "4px" }}>
                        <Group justify="center" spacing={8}>
                            <Box
                                ta="center"
                                style={{ backgroundColor: "#ffebee", padding: "2px 6px", borderRadius: "3px", minWidth: "40px" }}
                            >
                                <Text size="sm" weight={600} color="#d32f2f">
                                    {totalLess}
                                </Text>
                            </Box>
                            <Box
                                ta="center"
                                style={{ backgroundColor: "#e8f5e8", padding: "2px 6px", borderRadius: "3px", minWidth: "40px" }}
                            >
                                <Text size="sm" weight={600} color="#2e7d32">
                                    {totalMore}
                                </Text>
                            </Box>
                        </Group>
                    </Box>
                )
            },
        },
        {
            accessor: "stock_in",
            title: (
                <Box ta="center" style={{ backgroundColor: columnColors.stockBlue, padding: "4px" }}>
                    <Text weight={600} size="xs" color="#1976d2">
                        Stock In
                    </Text>
                </Box>
            ),
            width: 90,
            render: (material) => {
                // Stock In can be calculated as total_stock or opening + received
                return (
                    <Box ta="center" style={{ backgroundColor: columnColors.stockBlue, padding: "4px" }}>
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
                <Box ta="center" style={{ backgroundColor: columnColors.stockOrange, padding: "4px" }}>
                    <Text weight={600} size="xs" color="#f57c00">
                        Remaining Stock
                    </Text>
                </Box>
            ),
            width: 120,
            render: (material) => {
                // Calculate total consumption across all productions
                let totalConsumption = 0
                Object.values(material.productions).forEach((production) => {
                    totalConsumption += production.expense_quantity || 0
                })
                const remainingStock = material.total_stock - totalConsumption
                const isNegative = remainingStock < 0
                const backgroundColor = isNegative ? "#ffebee" : remainingStock === 0 ? "#fff8e1" : "#e8f5e8"
                const textColor = isNegative ? "#d32f2f" : remainingStock === 0 ? "#f57c00" : "#2e7d32"
                return (
                    <Box ta="center" style={{ backgroundColor, padding: "6px", borderRadius: "4px" }}>
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
        },*/
    ]

    return (
        <>
            <Box pb={"xs"}>
                <__InhouseAddItem setReloadBatchItemTable={setReloadBatchItemTable} />
            </Box>
            <Box className={"borderRadiusAll"}>
                <Box p="md">
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
                    {/* Production Batch Matrix Table - PDF Format */}
                    <Paper shadow="sm" p="md">
                        <Title order={3} mb="md">
                            {t("Stock Issue Production Quantity Total Expense Material Current Stock Status")}
                        </Title>
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
                            /*styles={{
                                // Removed general table background to allow column-wise backgrounds to show through
                                header: {
                                    borderBottom: "2px solid #dee2e6",
                                },
                                table: {
                                    fontSize: "12px",
                                },
                                root: {
                                    border: "2px solid #dee2e6",
                                },
                            }}*/
                        />
                    </Paper>
                </Box>
            </Box>
        </>
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

export default _InhouseTable



