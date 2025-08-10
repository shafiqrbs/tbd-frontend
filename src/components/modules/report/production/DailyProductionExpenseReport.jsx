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
    Tabs, LoadingOverlay, Text,
} from "@mantine/core"
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar"
import ProductionNavigation from "../common/ProductionNavigation"
import {
    getIndexEntityData,
    setProductionIssueFilterData,
    setProductionIssueWarehouseFilterData
} from "../../../../store/report/reportSlice.js"
import {useDispatch, useSelector} from "react-redux"
import {useOutletContext} from "react-router-dom"
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css"
import _ProductionReportSearch from "./_ProductionReportSearch.jsx"
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx"
import RequisitionNavigation from "../../procurement/common/RequisitionNavigation";
import ReportNavigation from "../ReportNavigation";

export default function DailyProductionExpenseReport() {
    const progress = getLoadingProgress()
    const dispatch = useDispatch()
    const {t, i18n} = useTranslation()
    const {isOnline, mainAreaHeight} = useOutletContext()
    const height = mainAreaHeight - 112;
    const [batchReloadWithUpload, setBatchReloadWithUpload] = useState(false)
    const [indexData, setIndexData] = useState(null) // Initialize as null to handle loading state
    const [searchValue, setSearchValue] = useState(false)
    const fetching = useSelector((state) => state.productionCrudSlice.fetching)
    const [reloadBatchData, setReloadBatchData] = useState(false)
    const productionIssueFilterData = useSelector((state) => state.reportSlice.productionIssueFilterData)
    const perPage = 20
    const [page, setPage] = useState(1)

    useEffect(() => {
        setProductionIssueFilterData({
            ...productionIssueFilterData,
            year: '', month: ''
        })
    }, [progress]);

    useEffect(() => {
        const fetchData = async () => {
            if (!productionIssueFilterData.month && !productionIssueFilterData.year) {
                return
            }
            const value = {
                url: "production/report/matrix/warehouse",
                param: {
                    month: productionIssueFilterData.month,
                    year: productionIssueFilterData.year,
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
            } catch (error) {
                console.error("Unexpected error in fetchData:", error)
                setIndexData(null) // Clear data on unexpected error
            } finally {
                setSearchValue(false)
                setReloadBatchData(false)
            }
        }
        fetchData()
    }, [dispatch, fetching, reloadBatchData, searchValue, page])

    const [downloadFile, setDownloadFile] = useState(false)
    const [downloadType, setDownloadType] = useState("xlsx")

    useEffect(() => {
        if (downloadFile) {
            const fetchData = async () => {
                if (!productionIssueFilterData.warehouse_id) {
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
                        month: productionIssueFilterData.month,
                        year: productionIssueFilterData.year,
                        warehouse_id: productionIssueFilterData.warehouse_id,
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
        }
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
    const dates = Object.keys(indexData?.date_wise_data || {})
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
                    <LoadingOverlay visible={searchValue || downloadFile} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>
                    <Box p={'xs'}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={4}>
                                <ReportNavigation/>
                            </Grid.Col>
                            <Grid.Col span={20}>
                                <Box className={"boxBackground borderRadiusAll"}>
                                    <Grid columns={24} gutter={{base:8}}>
                                        <Grid.Col span={8}>
                                            <Text pt={'xs'} pl={'md'} pb={'xs'}>{t("ManageReports")}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={16} mt={'4'}>
                                            <_ProductionReportSearch
                                                module={"production-matrix"}
                                                isWarehouse={0}
                                                setSearchValue={setSearchValue}
                                                setDownloadFile={setDownloadFile}
                                                setDownloadType={setDownloadType}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box bg={"white"}  className={"borderRadiusAll"}>
                                    <Box className="borderRadiusAll" m={'8'}>
                                        {indexData && dates.length > 0 ? (
                                            <Tabs value={activeTab} onChange={setActiveTab}>
                                                {/*<Tabs defaultValue={defaultTabValue} variant="pills" radius="xl">*/}
                                                <Tabs.List style={{overflowX: "auto", flexWrap: "nowrap"}}>
                                                    {dates.map((dateKey) => {
                                                        const dateData = indexData.date_wise_data[dateKey]
                                                        return (
                                                            <Tabs.Tab value={dateKey} key={dateKey}>
                                                                {dateData.date_formatted || dateData.date}
                                                            </Tabs.Tab>
                                                        )
                                                    })}
                                                </Tabs.List>

                                                {dates.map((dateKey) => {
                                                    const dateData = indexData.date_wise_data[dateKey]
                                                    const materials = dateData.data || []
                                                    // Use production_items_on_date for dynamic columns for this specific date
                                                    const productionItemsForThisDate = Object.values(dateData.production_items_on_date || {})

                                                    // Calculate total columns for colspan
                                                    const totalFixedColumns = 11 // S.L, Product Name, Unit, Rate, Opening, In, Total In, In Amount, Out, Out Amount, Closing, Closing Amount (excluding Date column)
                                                    const dynamicColumnsCount = productionItemsForThisDate.length * 2
                                                    const totalColumns = totalFixedColumns + (dynamicColumnsCount > 0 ? dynamicColumnsCount : 2) // Add 2 for default Production Qty/Amount if no items

                                                    return (
                                                        <Tabs.Panel value={dateKey} key={dateKey} pt="xs">
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
                                                                    style={tableStyles.table}
                                                                >
                                                                    <Table.Thead>
                                                                        {/*1st header row*/}
                                                                        <Table.Tr style={tableStyles.topRowBackground}>
                                                                            <Table.Th rowSpan={3}>S.L</Table.Th>
                                                                            {/*Date column removed as it's handled by tabs*/}
                                                                            <Table.Th rowSpan={3}>Product Name
                                                                                (English)</Table.Th>
                                                                            <Table.Th rowSpan={3}>Unit</Table.Th>
                                                                            <Table.Th rowSpan={3}>Present Day
                                                                                Rate</Table.Th>
                                                                            <Table.Th rowSpan={3}>Opening
                                                                                Stock</Table.Th>
                                                                            <Table.Th
                                                                                rowSpan={3}>In {warehouseName}</Table.Th>
                                                                            <Table.Th rowSpan={3}>Total In</Table.Th>
                                                                            <Table.Th rowSpan={3}>IN Amount
                                                                                (TK)</Table.Th>
                                                                            {/*Dynamic production usage columns*/}
                                                                            <Table.Th
                                                                                colSpan={dynamicColumnsCount > 0 ? dynamicColumnsCount : 2}
                                                                                style={{textAlign: "center", ...tableStyles.warningDarkBackground}}
                                                                            >
                                                                                Production Usage
                                                                            </Table.Th>
                                                                            {/*Remaining fixed columns*/}
                                                                            <Table.Th rowSpan={3}>Out</Table.Th>
                                                                            <Table.Th rowSpan={3}>Out Amount</Table.Th>
                                                                            <Table.Th rowSpan={3}>Closing
                                                                                Stock</Table.Th>
                                                                            <Table.Th rowSpan={3}>Closing
                                                                                Amount</Table.Th>
                                                                        </Table.Tr>
                                                                        {/*2nd header row for production items*/}
                                                                        <Table.Tr>
                                                                            {productionItemsForThisDate.length > 0 ? (
                                                                                productionItemsForThisDate.map((item) => (
                                                                                    <React.Fragment
                                                                                        key={`header-${item.production_item_id}`}>
                                                                                        <Table.Th
                                                                                            style={{textAlign: "center", ...tableStyles.errorBackground}}
                                                                                            colSpan={2}>
                                                                                            {safeText(item.item_name)}
                                                                                        </Table.Th>
                                                                                    </React.Fragment>
                                                                                ))
                                                                            ) : (
                                                                                <>
                                                                                    <Table.Th
                                                                                        style={{textAlign: "center", ...tableStyles.successBackground}}>
                                                                                        Production Qty
                                                                                    </Table.Th>
                                                                                    <Table.Th
                                                                                        style={{textAlign: "center", ...tableStyles.warningBackground}}>
                                                                                        Production Amount
                                                                                    </Table.Th>
                                                                                </>
                                                                            )}
                                                                        </Table.Tr>

                                                                        <Table.Tr>
                                                                            {productionItemsForThisDate.length > 0 ? (
                                                                                productionItemsForThisDate.map((item) => (
                                                                                    <React.Fragment
                                                                                        key={`header-${item.production_item_id}`}>
                                                                                        <Table.Th
                                                                                            style={{textAlign: "center", ...tableStyles.successBackground}}>
                                                                                            Qty
                                                                                        </Table.Th>
                                                                                        <Table.Th
                                                                                            style={{textAlign: "center", ...tableStyles.warningBackground}}>
                                                                                            Amount
                                                                                        </Table.Th>
                                                                                    </React.Fragment>
                                                                                ))
                                                                            ) : (
                                                                                <>
                                                                                    <Table.Th
                                                                                        style={{textAlign: "center", ...tableStyles.successBackground}}>
                                                                                        Production Qty
                                                                                    </Table.Th>
                                                                                    <Table.Th
                                                                                        style={{textAlign: "center", ...tableStyles.warningBackground}}>
                                                                                        Production Amount
                                                                                    </Table.Th>
                                                                                </>
                                                                            )}
                                                                        </Table.Tr>
                                                                    </Table.Thead>
                                                                    <Table.Tbody>
                                                                        {materials.length === 0 ? (
                                                                            <Table.Tr>
                                                                                <Table.Td
                                                                                    colSpan={totalColumns}
                                                                                    style={{
                                                                                        textAlign: "center",
                                                                                        fontStyle: "italic",
                                                                                        color: "#666",
                                                                                        padding: "20px",
                                                                                    }}
                                                                                >
                                                                                    No material data available for this
                                                                                    date.
                                                                                </Table.Td>
                                                                            </Table.Tr>
                                                                        ) : (
                                                                            materials.map((material, index) => {
                                                                                const isNegativeStock = Number(material.closing_stock || 0) < 0
                                                                                const isNegativeAmount = Number(material.closing_stock_amount || 0) < 0
                                                                                return (
                                                                                    <Table.Tr
                                                                                        key={`${dateKey}-${material.material_id || index}`}>
                                                                                        <Table.Td>{safeNumber(material.sl || index + 1, 0)}</Table.Td>
                                                                                        <Table.Td
                                                                                            style={{textAlign: "left"}}>
                                                                                            {safeText(material.product_name_english)}
                                                                                        </Table.Td>
                                                                                        <Table.Td>{safeText(material.unit)}</Table.Td>
                                                                                        <Table.Td>{safeNumber(material.present_day_rate)}</Table.Td>
                                                                                        <Table.Td>{safeNumber(material.opening_stock)}</Table.Td>
                                                                                        <Table.Td>{safeNumber(material.in_warehouse)}</Table.Td>
                                                                                        <Table.Td>{safeNumber(material.total_in)}</Table.Td>
                                                                                        <Table.Td>{safeNumber(material.in_amount)}</Table.Td>
                                                                                        {productionItemsForThisDate.map((item) => {
                                                                                            const usage = material.production_usage?.[item.production_item_id]
                                                                                            return (
                                                                                                <React.Fragment
                                                                                                    key={`usage-${item.production_item_id}-${material.material_id}`}
                                                                                                >
                                                                                                    <Table.Td
                                                                                                        style={tableStyles.successBackground}>
                                                                                                        {usage ? safeNumber(usage.quantity) : "-"}
                                                                                                    </Table.Td>
                                                                                                    <Table.Td
                                                                                                        style={tableStyles.warningBackground}>
                                                                                                        {usage ? safeNumber(usage.amount) : "-"}
                                                                                                    </Table.Td>
                                                                                                </React.Fragment>
                                                                                            )
                                                                                        })}
                                                                                        <Table.Td>{safeNumber(material.out)}</Table.Td>
                                                                                        <Table.Td>{safeNumber(material.out_amount)}</Table.Td>
                                                                                        <Table.Td
                                                                                            style={{
                                                                                                ...tableStyles.errorBackground,
                                                                                                color: isNegativeStock ? "red" : "black",
                                                                                                fontWeight: isNegativeStock ? "bold" : "normal",
                                                                                            }}
                                                                                        >
                                                                                            {safeNumber(material.closing_stock)}
                                                                                        </Table.Td>
                                                                                        <Table.Td
                                                                                            style={{
                                                                                                ...tableStyles.warningDarkBackground,
                                                                                                color: isNegativeAmount ? "red" : "black",
                                                                                                fontWeight: isNegativeAmount ? "bold" : "normal",
                                                                                            }}
                                                                                        >
                                                                                            {safeNumber(material.closing_stock_amount)}
                                                                                        </Table.Td>
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
                                                    height: height,
                                                    minHeight: "300px",
                                                    overflowY: "auto",
                                                    overflowX: "auto",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    textAlign: "center",
                                                    fontStyle: "italic",
                                                    color: "#666",
                                                    padding: "20px",
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

