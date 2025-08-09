"use client"

import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress"
import {
    Progress,
    Box,
    Grid,
    Table,
    Title,
    Tabs, LoadingOverlay,
} from "@mantine/core"
import ProductionNavigation from "../common/ProductionNavigation"
import {
    getIndexEntityData,
    setProductionIssueWarehouseFilterData
} from "../../../../store/report/reportSlice.js"
import {useDispatch, useSelector} from "react-redux"
import {useOutletContext} from "react-router-dom"
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css"
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx"
import _InventoryReportSearch from "./_InventoryReportSearch.jsx";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar.jsx";

export default function DailySalesWarehouseReport() {
    const progress = getLoadingProgress()
    const dispatch = useDispatch()
    const {t, i18n} = useTranslation()
    const {isOnline, mainAreaHeight} = useOutletContext()
    const height = mainAreaHeight - 120
    const [batchReloadWithUpload, setBatchReloadWithUpload] = useState(false)
    const [indexData, setIndexData] = useState(null) // Initialize as null to handle loading state
    const [searchValue, setSearchValue] = useState(false)
    const fetching = useSelector((state) => state.productionCrudSlice.fetching)
    const [reloadBatchData, setReloadBatchData] = useState(false)
    const inventorySalesWarehouseFilterData = useSelector((state) => state.reportSlice.inventorySalesWarehouseFilterData)
    const perPage = 20
    const [page, setPage] = useState(1)

    useEffect(() => {
        setProductionIssueWarehouseFilterData({
            ...inventorySalesWarehouseFilterData,
            warehouse_id: '',year: '', month: ''
        })
    }, [progress]);


    useEffect(() => {
        const fetchData = async () => {
            if (!inventorySalesWarehouseFilterData.warehouse_id) {
                return
            }
            if (!inventorySalesWarehouseFilterData.month && !inventorySalesWarehouseFilterData.year) {
                return
            }
            const value = {
                url: "inventory/report/daily/sales",
                param: {
                    warehouse_id: inventorySalesWarehouseFilterData.warehouse_id,
                    month: inventorySalesWarehouseFilterData.month,
                    year: inventorySalesWarehouseFilterData.year,
                    page: page,
                    offset: perPage,
                },
            }
            try {
                const resultAction = await dispatch(getIndexEntityData(value))
                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction)
                    setIndexData(null) // Clear data on error
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload.data)
                }
                setReloadBatchData(false)
            } catch (error) {
                console.error("Unexpected error in fetchData:", error)
                setIndexData(null) // Clear data on unexpected error
            } finally {
                setSearchValue(false)
            }
        }
        fetchData()
    }, [dispatch, fetching, reloadBatchData, searchValue, page])

    const [downloadFile, setDownloadFile] = useState(false)
    const [downloadType, setDownloadType] = useState("xlsx")

    useEffect(() => {
        /*if (downloadFile) {
            const fetchData = async () => {
                if (!inventorySalesWarehouseFilterData.warehouse_id) {
                    return
                }
                let route = ""
                if (downloadType === "pdf") {
                    route = "production/report/matrix/warehouse-pdf"
                } else if (downloadType === "xlsx") {
                    route = "production/report/matrix/warehouse-xlsx"
                }
                const value = {
                    url: route,
                    param: {
                        month: inventorySalesWarehouseFilterData.month,
                        year: inventorySalesWarehouseFilterData.year,
                        warehouse_id: inventorySalesWarehouseFilterData.warehouse_id,
                    }
                }
                try {
                    const resultAction = await dispatch(getIndexEntityData(value))
                    if (getIndexEntityData.rejected.match(resultAction)) {
                        console.error("Error:", resultAction)
                    } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                        if (resultAction.payload.status === 200) {
                            const href = `${import.meta.env.VITE_API_GATEWAY_URL + "matrix-report/download/"}${downloadType}`
                            const anchorElement = document.createElement("a")
                            anchorElement.href = href
                            document.body.appendChild(anchorElement)
                            anchorElement.click()
                            document.body.removeChild(anchorElement)
                        } else {
                            showNotificationComponent(resultAction.payload.error, "red")
                        }
                    }
                } catch (err) {
                    console.error("Unexpected error:", err)
                } finally {
                    setDownloadFile(false)
                }
            }
            fetchData()
        }*/
    }, [downloadFile, dispatch, downloadType])

    const safeNumber = (value, decimals = 2) => {
        try {
            const num = Number(value)
            if (isNaN(num)) return "-"
            const formatted = Number.isInteger(num) ? num.toString() : num.toFixed(decimals)
            return num < 0 ? `-${Math.abs(Number(formatted))}` : formatted
        } catch (error) {
            console.error("Error formatting number:", error)
            return "-"
        }
    }

    const safeText = (value, fallback = "-") => {
        try {
            return value && value.toString().trim() !== "" ? value.toString() : fallback
        } catch (error) {
            console.error("Error formatting text:", error)
            return fallback
        }
    }

    const warehouseName = indexData?.warehouse_name || "All Warehouses"
    const dates = Object.keys(indexData || {})
    // const defaultTabValue = dates.length > 0 ? dates[0] : "no-data" // Set default tab value
    const [activeTab, setActiveTab] = useState(null)

    // Effect to set the active tab when dates data changes
    useEffect(() => {
        if (dates.length > 0 && activeTab === null) {
            // Only set if activeTab is null (initial load)
            setActiveTab(dates[0])
        } else if (dates.length > 0 && !dates.includes(activeTab)) {
            // If current active tab is no longer in dates (e.g., filter changed)
            setActiveTab(dates[0])
        } else if (dates.length === 0 && activeTab !== null) {
            // If no dates are available, clear active tab
            setActiveTab(null)
        }
    }, [dates, activeTab]) // Depend on dates and activeTab

    const tableStyles = {
        table: {
            fontSize: "12px",
            "& th, & td": {
                padding: "4px 8px",
                textAlign: "center",
                border: "1px solid #dee2e6",
                fontSize: "11px",
            },
        },
        topRowBackground: {
            backgroundColor: "#f8f9fa",
            fontWeight: "bold",
        },
        successBackground: {
            backgroundColor: "#d4edda",
        },
        warningBackground: {
            backgroundColor: "#fff3cd",
        },
        errorBackground: {
            backgroundColor: "#f8d7da",
        },
        warningDarkBackground: {
            backgroundColor: "#ffc107",
        },
        highlightedCell: {
            backgroundColor: "#e9ecef",
            fontWeight: "bold",
        },
        highlightedRow: {
            backgroundColor: "#e9ecef",
            fontWeight: "bold",
        },
    }

    return (
        <>
            {progress !== 100 && (
                <Progress
                    color="var(--theme-primary-color-6)"
                    size={"sm"}
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            )}
            {progress === 100 && (
                <Box>
                    <InventoryHeaderNavbar
                        pageTitle={t("InventoryReport")}
                        roles={t("Roles")}
                        setBatchReloadWithUpload={setBatchReloadWithUpload}
                    />
                    <Box p={8}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <ProductionNavigation module={"batch"}/>
                            </Grid.Col>

                            <LoadingOverlay visible={searchValue || downloadFile} zIndex={1000}
                                            overlayProps={{radius: "sm", blur: 2}}/>

                            <Grid.Col span={23}>
                                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                    <Title order={4}>{t("DailySalesWarehouseReport")}</Title>
                                    <Box pl={`xs`} pb={"xs"} pr={8} pt={"xs"} mb={"xs"}
                                         className={"boxBackground borderRadiusAll"}>
                                        <_InventoryReportSearch
                                            module={"inventory-sales"}
                                            isWarehouse={1}
                                            setSearchValue={setSearchValue}
                                            setDownloadFile={setDownloadFile}
                                            setDownloadType={setDownloadType}
                                        />
                                    </Box>

                                    <Box className="borderRadiusAll">
                                {indexData && dates.length > 0 ? (
                                    <Tabs
                                    value={activeTab || dates[0]}
                                    onChange={setActiveTab}
                                    variant="pills"
                                    radius="xl"
                                >
                                    <Tabs.List style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
                                        {dates.map((dateKey) => {
                                            const dateObj = new Date(dateKey)
                                            const day = String(dateObj.getDate()).padStart(2, '0')
                                            return (
                                                <Tabs.Tab value={dateKey} key={dateKey}>
                                                    {day}
                                                </Tabs.Tab>
                                            )
                                        })}

                                    </Tabs.List>

                                    {dates.map((dateKey) => {
                                        const materials = indexData[dateKey] || {}

                                        // Gather all unique customers for that date
                                        const customerSet = new Set()
                                        Object.values(materials).forEach((mat) => {
                                            Object.keys(mat?.customers || {}).forEach((c) => customerSet.add(c))
                                        })
                                        const customerList = Array.from(customerSet)
                                        const dynamicColumnsCount = customerList.length * 2
                                        const staticColumns = 8 // SL, Product, Opening, Receive, Total In, Total Out, Total Amount, Closing
                                        const totalColumns = staticColumns + (dynamicColumnsCount || 2)

                                        return (
                                            <Tabs.Panel value={dateKey} key={dateKey} pt="xs">
                                                <div
                                                    className={batchTableCss.responsiveTableWrapper}
                                                    style={{
                                                        height,
                                                        minHeight: '300px',
                                                        overflowY: 'auto',
                                                        overflowX: 'auto',
                                                    }}
                                                >
                                                    <Table
                                                        stickyHeader
                                                        withTableBorder
                                                        withColumnBorders
                                                        striped
                                                        highlightOnHover
                                                    >
                                                        <Table.Thead>
                                                            {/* HEADER ROW 1 */}
                                                            <Table.Tr>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>S.L</Table.Th>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Product Name</Table.Th>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Opening</Table.Th>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Receive</Table.Th>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Total In</Table.Th>

                                                                <Table.Th
                                                                    colSpan={dynamicColumnsCount > 0 ? dynamicColumnsCount : 2}
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        backgroundColor: '#fdf5c9',
                                                                    }}
                                                                >
                                                                    Customer
                                                                </Table.Th>

                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Total Out</Table.Th>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Total Amount</Table.Th>
                                                                <Table.Th rowSpan={3} style={{textAlign: 'center'}}>Closing</Table.Th>
                                                            </Table.Tr>

                                                            <Table.Tr>
                                                                {customerList.length > 0 && (
                                                                    customerList.map((cust) => (
                                                                        <React.Fragment key={cust}>
                                                                            <Table.Th
                                                                                colSpan={2}
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    backgroundColor: '#e4ffe6',
                                                                                }}
                                                                            >
                                                                                {cust}
                                                                            </Table.Th>
                                                                        </React.Fragment>
                                                                    ))
                                                                )}
                                                            </Table.Tr>
                                                            <Table.Tr>
                                                                {customerList.length > 0 && (
                                                                    customerList.map((cust) => (
                                                                        <React.Fragment key={cust}>
                                                                            <Table.Th
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    backgroundColor: '#e4ffe6',
                                                                                }}
                                                                            >
                                                                                Qty
                                                                            </Table.Th>
                                                                            <Table.Th
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    backgroundColor: '#ffe9e9',
                                                                                }}
                                                                            >
                                                                                Amount
                                                                            </Table.Th>
                                                                        </React.Fragment>
                                                                    ))
                                                                )}
                                                            </Table.Tr>
                                                        </Table.Thead>

                                                        <Table.Tbody>
                                                            {Object.keys(materials).length === 0 ? (
                                                                <Table.Tr>
                                                                    <Table.Td
                                                                        colSpan={totalColumns}
                                                                        style={{
                                                                            textAlign: 'center',
                                                                            fontStyle: 'italic',
                                                                            color: '#666',
                                                                            padding: '20px',
                                                                        }}
                                                                    >
                                                                        No material data available for this date.
                                                                    </Table.Td>
                                                                </Table.Tr>
                                                            ) : (
                                                                Object.entries(materials).map(([productName, mat], index) => {
                                                                    return (
                                                                        <Table.Tr key={`${dateKey}-${productName}`}>
                                                                            <Table.Td style={{textAlign: 'center'}}>{index + 1}</Table.Td>
                                                                            <Table.Td style={{textAlign: 'center'}}>{productName}</Table.Td>
                                                                            <Table.Td style={{textAlign: 'center'}}>{safeNumber(mat.opening)}</Table.Td>
                                                                            <Table.Td style={{textAlign: 'center'}}>{safeNumber(mat.receive)}</Table.Td>
                                                                            <Table.Td style={{textAlign: 'center'}}>{safeNumber(mat.total_in_qty)}</Table.Td>

                                                                            {customerList.length > 0 ? (
                                                                                customerList.map((cust) => {
                                                                                    const rowData = mat.customers?.[cust]
                                                                                    return (
                                                                                        <React.Fragment key={`${productName}-${cust}`}>
                                                                                            <Table.Td style={{ backgroundColor: '#e4ffe6',textAlign: 'center' }}>
                                                                                                {rowData ? safeNumber(rowData.qty) : '-'}
                                                                                            </Table.Td>
                                                                                            <Table.Td style={{ backgroundColor: '#ffe9e9',textAlign: 'center' }}>
                                                                                                {rowData ? safeNumber(rowData.amount) : '-'}
                                                                                            </Table.Td>
                                                                                        </React.Fragment>
                                                                                    )
                                                                                })
                                                                            ) : (
                                                                                <>
                                                                                    <Table.Td style={{ backgroundColor: '#e4ffe6',textAlign: 'center' }}>-</Table.Td>
                                                                                    <Table.Td style={{ backgroundColor: '#ffe9e9',textAlign: 'center' }}>-</Table.Td>
                                                                                </>
                                                                            )}

                                                                            <Table.Td style={{textAlign: 'center'}}>{safeNumber(mat.total_out_qty)}</Table.Td>
                                                                            <Table.Td style={{textAlign: 'center'}}>{safeNumber(mat.total_amount)}</Table.Td>
                                                                            <Table.Td style={{textAlign: 'center'}}>{safeNumber(mat.closing)}</Table.Td>
                                                                        </Table.Tr>
                                                                    )
                                                                })
                                                            )}
                                                        </Table.Tbody>
                                                    </Table>
                                                </div>
                                            </Tabs.Panel>
                                        )
                                    })}
                                </Tabs>
                                ) : (
                                <div
                                    className={batchTableCss.responsiveTableWrapper}
                                    style={{
                                        height,
                                        minHeight: '300px',
                                        overflowY: 'auto',
                                        overflowX: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                        color: '#666',
                                        padding: '20px',
                                    }}
                                >
                                    No data available. Please load data to see inventory information.
                                </div>
                                )}
                    </Box>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    )
}

