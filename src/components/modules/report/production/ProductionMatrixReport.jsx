import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress";
import {
    Progress,
    Box,
    Grid,
    Table, Title,
} from "@mantine/core";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar";
import ProductionNavigation from "../common/ProductionNavigation";
import {getIndexEntityData} from "../../../../store/report/reportSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import _ProductionReportSearch from "./_ProductionReportSearch.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

export default function ProductionMatrixReport() {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;

    const [batchReloadWithUpload, setBatchReloadWithUpload] = useState(false);

    const [indexData, setIndexData] = useState([])
    const [searchValue, setSearchValue] = useState(false)
    const fetching = useSelector((state) => state.productionCrudSlice.fetching);
    const [reloadBatchData, setReloadBatchData] = useState(false)
    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword)
    const productionIssueFilterData = useSelector((state) => state.reportSlice.productionIssueFilterData);

    const perPage = 20;
    const [page, setPage] = useState(1);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'production/report/matrix/warehouse',
                param: {
                    start_date: productionIssueFilterData.start_date && new Date(productionIssueFilterData.start_date).toLocaleDateString("en-CA", options),
                    end_date: productionIssueFilterData.end_date && new Date(productionIssueFilterData.end_date).toLocaleDateString("en-CA", options),
                    warehouse_id:productionIssueFilterData.warehouse_id,
                    page: page,
                    offset: perPage
                }
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));
                // Handle rejected state
                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                }
                // Handle fulfilled state
                else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload.data)
                }
                setReloadBatchData(false);
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            } finally {
                setSearchValue(false)
            }
        };
        fetchData();
    }, [dispatch, fetching, reloadBatchData, searchValue]);


    const [downloadFile, setDownloadFile] = useState(false)
    const [downloadType, setDownloadType] = useState('xlsx')

    useEffect(() => {
        if (downloadFile) {
            const fetchData = async () => {
                let route = '';
                if (downloadType == 'pdf') {
                    route = 'production/report/matrix/warehouse-pdf'
                } else if (downloadType == 'xlsx') {
                    route = 'production/report/matrix/warehouse-xlsx'
                }
                const value = {
                    url: route,
                    param: {}
                };

                try {
                    const resultAction = await dispatch(getIndexEntityData(value));
                    if (getIndexEntityData.rejected.match(resultAction)) {
                        console.error('Error:', resultAction);
                    } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                        if (resultAction.payload.status === 200) {
                            const href = `${import.meta.env.VITE_API_GATEWAY_URL + "matrix-report/download/"}${downloadType}`;

                            const anchorElement = document.createElement('a');
                            anchorElement.href = href;
                            document.body.appendChild(anchorElement);
                            anchorElement.click();
                            document.body.removeChild(anchorElement);
                        } else {
                            showNotificationComponent(resultAction.payload.error, 'red')
                        }
                    }
                } catch (err) {
                    console.error('Unexpected error:', err);
                } finally {
                    setDownloadFile(false)
                }
            };

            fetchData();
        }
    }, [downloadFile, dispatch]);


    const safeNumber = (value, decimals = 2) => {
        try {
            const num = Number(value);
            if (isNaN(num)) return '-';

            const formatted =
                Number.isInteger(num) ? num.toString() : num.toFixed(decimals);

            return num < 0 ? `-${Math.abs(Number(formatted))}` : formatted;
        } catch (error) {
            console.error('Error formatting number:', error);
            return '-';
        }
    };


    const safeText = (value, fallback = '-') => {
        try {
            return value && value.toString().trim() !== '' ? value.toString() : fallback;
        } catch (error) {
            console.error('Error formatting text:', error);
            return fallback;
        }
    };

    const extractTableData = () => {
        try {
            if (!indexData?.date_wise_data) {
                throw new Error('No date_wise_data found');
            }

            const dates = Object.keys(indexData.date_wise_data);
            if (dates.length === 0) {
                throw new Error('No dates found in data');
            }

            const firstDate = dates[0];
            const dateData = indexData.date_wise_data[firstDate];

            if (!dateData?.data || !Array.isArray(dateData.data)) {
                throw new Error('Invalid data structure');
            }

            return {
                tableData: dateData.data,
                productionItems: indexData.production_items || {},
                warehouseName: indexData.warehouse_name || 'Unknown Warehouse',
                dateFormatted: dateData.date_formatted || firstDate
            };
        } catch (error) {
            console.error('Error extracting table data:', error);
            return {
                tableData: [],
                productionItems: {},
                warehouseName: 'Unknown Warehouse',
                dateFormatted: 'Unknown Date'
            };
        }
    };

    const { tableData, productionItems, warehouseName } = extractTableData();
    const productionItemsArray = Object.values(productionItems);

    const tableStyles = {
        table: {
            fontSize: '12px',
            '& th, & td': {
                padding: '4px 8px',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                fontSize: '11px'
            }
        },
        topRowBackground: {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold'
        },
        successBackground: {
            backgroundColor: '#d4edda'
        },
        warningBackground: {
            backgroundColor: '#fff3cd'
        },
        errorBackground: {
            backgroundColor: '#f8d7da'
        },
        warningDarkBackground: {
            backgroundColor: '#ffc107'
        },
        highlightedCell: {
            backgroundColor: '#e9ecef',
            fontWeight: 'bold'
        },
        highlightedRow: {
            backgroundColor: '#e9ecef',
            fontWeight: 'bold'
        }
    };

    const showEmptyTable = tableData.length === 0;


    return (
        <>
            {progress !== 100 && (
                <Progress
                    color='var(--theme-primary-color-6)'
                    size={"sm"}
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            )}
            {progress === 100 && (
                <Box>
                    <ProductionHeaderNavbar
                        pageTitle={t("ProductionBatch")}
                        roles={t("Roles")}
                        setBatchReloadWithUpload={setBatchReloadWithUpload}
                    />
                    <Box p={8}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <ProductionNavigation module={"batch"}/>
                            </Grid.Col>
                            <Grid.Col span={23}>
                                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                    <Title order={4}>{t("ProductionMatrix")}</Title>
                                    <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'}>
                                        <_ProductionReportSearch
                                            module={'production-matrix'}
                                            setSearchValue={setSearchValue}
                                            setDownloadFile={setDownloadFile}
                                            setDownloadType={setDownloadType}
                                        />
                                    </Box>

                                    <Box className="borderRadiusAll">
                                        <div
                                            className={batchTableCss.responsiveTableWrapper}
                                            style={{
                                                height: height,
                                                minHeight: "300px",
                                                overflowY: "auto",
                                                overflowX: "auto",
                                            }}
                                        >
                                            <Table stickyHeader withTableBorder withColumnBorders striped highlightOnHover style={tableStyles.table}>
                                                <Table.Thead>
                                                    {/* 1st header row */}
                                                    <Table.Tr style={tableStyles.topRowBackground}>
                                                        <Table.Th rowSpan={2}>S.L</Table.Th>
                                                        <Table.Th rowSpan={2}>Date</Table.Th>
                                                        <Table.Th rowSpan={2}>Product Name (English)</Table.Th>
                                                        <Table.Th rowSpan={2}>Unit</Table.Th>
                                                        <Table.Th rowSpan={2}>Present Day Rate</Table.Th>
                                                        <Table.Th rowSpan={2}>Opening Stock</Table.Th>
                                                        <Table.Th rowSpan={2}>In {warehouseName}</Table.Th>
                                                        <Table.Th rowSpan={2}>Total In</Table.Th>
                                                        <Table.Th rowSpan={2}>IN Amount (TK)</Table.Th>

                                                        {/* Dynamic production usage columns */}
                                                        <Table.Th
                                                            colSpan={productionItemsArray.length > 0 ? productionItemsArray.length * 2 : 2}
                                                            style={{ textAlign: 'center', ...tableStyles.successBackground }}
                                                        >
                                                            Production Usage
                                                        </Table.Th>

                                                        {/* Remaining fixed columns */}
                                                        <Table.Th rowSpan={2}>Out</Table.Th>
                                                        <Table.Th rowSpan={2}>Out Amount</Table.Th>
                                                        <Table.Th rowSpan={2}>Closing Stock</Table.Th>
                                                        <Table.Th rowSpan={2}>Closing Amount</Table.Th>
                                                    </Table.Tr>

                                                    {/* 2nd header row for production items */}
                                                    <Table.Tr>
                                                        {productionItemsArray.length > 0 ? (
                                                            productionItemsArray.map(item => (
                                                                <React.Fragment key={`header-${item.production_item_id}`}>
                                                                    <Table.Th style={{ textAlign: 'center', ...tableStyles.successBackground }}>
                                                                        {safeText(item.item_name)} Qty
                                                                    </Table.Th>
                                                                    <Table.Th style={{ textAlign: 'center', ...tableStyles.warningBackground }}>
                                                                        {safeText(item.item_name)} Amount
                                                                    </Table.Th>
                                                                </React.Fragment>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <Table.Th style={{ textAlign: 'center', ...tableStyles.successBackground }}>Production Qty</Table.Th>
                                                                <Table.Th style={{ textAlign: 'center', ...tableStyles.warningBackground }}>Production Amount</Table.Th>
                                                            </>
                                                        )}
                                                    </Table.Tr>
                                                </Table.Thead>

                                                <Table.Tbody>
                                                    {showEmptyTable ? (
                                                        <>
                                                            {[...Array(3)].map((_, index) => (
                                                                <Table.Tr key={`empty-${index}`}>
                                                                    <Table.Td>{index + 1}</Table.Td>
                                                                    <Table.Td style={{ textAlign: 'left' }}>-</Table.Td>
                                                                    <Table.Td style={{ textAlign: 'left' }}>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>

                                                                    {/* Production usage columns */}
                                                                    {productionItemsArray.length > 0 ? (
                                                                        productionItemsArray.map(item => (
                                                                            <React.Fragment key={`empty-usage-${item.production_item_id}-${index}`}>
                                                                                <Table.Td style={tableStyles.successBackground}>-</Table.Td>
                                                                                <Table.Td style={tableStyles.warningBackground}>-</Table.Td>
                                                                            </React.Fragment>
                                                                        ))
                                                                    ) : (
                                                                        <>
                                                                            <Table.Td style={tableStyles.successBackground}>-</Table.Td>
                                                                            <Table.Td style={tableStyles.warningBackground}>-</Table.Td>
                                                                        </>
                                                                    )}

                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td>-</Table.Td>
                                                                    <Table.Td style={tableStyles.errorBackground}>-</Table.Td>
                                                                    <Table.Td style={tableStyles.warningDarkBackground}>-</Table.Td>
                                                                </Table.Tr>
                                                            ))}
                                                            <Table.Tr>
                                                                <Table.Td
                                                                    colSpan={14 + (productionItemsArray.length * 2)}
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        fontStyle: 'italic',
                                                                        color: '#666',
                                                                        padding: '20px'
                                                                    }}
                                                                >
                                                                    No data available. Please load data to see inventory information.
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        </>
                                                    ) : (
                                                        /*Object.entries(indexData?.date_wise_data || {}).map(([dateKey, dateGroup]) => {
                                                            const { date, data: materials } = dateGroup;

                                                            return materials.map((material, index) => {
                                                                try {
                                                                    const isNegativeStock = Number(material.closing_stock || 0) < 0;
                                                                    const isNegativeAmount = Number(material.closing_stock_amount || 0) < 0;

                                                                    return (
                                                                        <Table.Tr key={`${dateKey}-${material.material_id || index}`}>
                                                                            <Table.Td>{safeNumber(material.sl || index + 1, 0)}</Table.Td>
                                                                            <Table.Td style={{ textAlign: 'left' }}>{safeText(date)}</Table.Td>
                                                                            <Table.Td style={{ textAlign: 'left' }}>{safeText(material.product_name_english)}</Table.Td>
                                                                            <Table.Td>{safeText(material.unit)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.present_day_rate)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.opening_stock)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.in_warehouse)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.total_in)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.in_amount)}</Table.Td>

                                                                            {productionItemsArray.map(item => {
                                                                                const usage = material.production_usage?.[item.production_item_id];
                                                                                return (
                                                                                    <React.Fragment key={`usage-${item.production_item_id}-${material.material_id}`}>
                                                                                        <Table.Td style={tableStyles.successBackground}>
                                                                                            {usage ? safeNumber(usage.quantity) : '-'}
                                                                                        </Table.Td>
                                                                                        <Table.Td style={tableStyles.warningBackground}>
                                                                                            {usage ? safeNumber(usage.amount) : '-'}
                                                                                        </Table.Td>
                                                                                    </React.Fragment>
                                                                                );
                                                                            })}

                                                                            <Table.Td>{safeNumber(material.out)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.out_amount)}</Table.Td>
                                                                            <Table.Td
                                                                                style={{
                                                                                    ...tableStyles.errorBackground,
                                                                                    color: isNegativeStock ? 'red' : 'black',
                                                                                    fontWeight: isNegativeStock ? 'bold' : 'normal',
                                                                                }}
                                                                            >
                                                                                {safeNumber(material.closing_stock)}
                                                                            </Table.Td>
                                                                            <Table.Td
                                                                                style={{
                                                                                    ...tableStyles.warningDarkBackground,
                                                                                    color: isNegativeAmount ? 'red' : 'black',
                                                                                    fontWeight: isNegativeAmount ? 'bold' : 'normal',
                                                                                }}
                                                                            >
                                                                                {safeNumber(material.closing_stock_amount)}
                                                                            </Table.Td>
                                                                        </Table.Tr>
                                                                    );
                                                                } catch (err) {
                                                                    console.error('Error rendering row:', err);
                                                                    return (
                                                                        <Table.Tr key={`error-${dateKey}-${index}`}>
                                                                            <Table.Td colSpan={14 + productionItemsArray.length * 2}>
                                                                                Error rendering row data
                                                                            </Table.Td>
                                                                        </Table.Tr>
                                                                    );
                                                                }
                                                            });
                                                        })*/

                                                        /*Object.entries(indexData.date_wise_data || {}).map(([dateKey, dateData], dateIndex) => {
                                                                const date = dateData.date;
                                                                const materials = dateData.data || [];

                                                                // Define alternating background colors for different dates
                                                                const dateBackgroundColor = dateIndex % 2 === 0 ? '#f8f9fa' : '#ffffff';

                                                                return materials.map((material, index) => {
                                                                    const isNegativeStock = material.closing_stock < 0;
                                                                    const isNegativeAmount = material.closing_stock_amount < 0;

                                                                    return (
                                                                        <Table.Tr
                                                                            key={`${dateKey}-${material.material_id || index}`}
                                                                            style={{ backgroundColor: dateBackgroundColor }}
                                                                        >
                                                                            <Table.Td>{safeNumber(material.sl || index + 1, 0)}</Table.Td>
                                                                            <Table.Td
                                                                                style={{
                                                                                    textAlign: 'left',
                                                                                    fontWeight: index === 0 ? 'bold' : 'normal', // Bold for first row of each date
                                                                                    borderLeft: index === 0 ? '4px solid #007bff' : 'none' // Blue border for first row
                                                                                }}
                                                                            >
                                                                                {safeText(date)}
                                                                            </Table.Td>
                                                                            <Table.Td style={{ textAlign: 'left' }}>{safeText(material.product_name_english)}</Table.Td>
                                                                            <Table.Td>{safeText(material.unit)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.present_day_rate)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.opening_stock)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.in_warehouse)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.total_in)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.in_amount)}</Table.Td>
                                                                            {productionItemsArray.map(item => {
                                                                                const usage = material.production_usage?.[item.production_item_id];
                                                                                return (
                                                                                    <React.Fragment key={`usage-${item.production_item_id}-${material.material_id}`}>
                                                                                        <Table.Td style={tableStyles.successBackground}>
                                                                                            {usage ? safeNumber(usage.quantity) : '-'}
                                                                                        </Table.Td>
                                                                                        <Table.Td style={tableStyles.warningBackground}>
                                                                                            {usage ? safeNumber(usage.amount) : '-'}
                                                                                        </Table.Td>
                                                                                    </React.Fragment>
                                                                                );
                                                                            })}
                                                                            <Table.Td>{safeNumber(material.out)}</Table.Td>
                                                                            <Table.Td>{safeNumber(material.out_amount)}</Table.Td>
                                                                            <Table.Td
                                                                                style={{
                                                                                    ...tableStyles.errorBackground,
                                                                                    color: isNegativeStock ? 'red' : 'black',
                                                                                    fontWeight: isNegativeStock ? 'bold' : 'normal',
                                                                                }}
                                                                            >
                                                                                {safeNumber(material.closing_stock)}
                                                                            </Table.Td>
                                                                            <Table.Td
                                                                                style={{
                                                                                    ...tableStyles.warningDarkBackground,
                                                                                    color: isNegativeAmount ? 'red' : 'black',
                                                                                    fontWeight: isNegativeAmount ? 'bold' : 'normal',
                                                                                }}
                                                                            >
                                                                                {safeNumber(material.closing_stock_amount)}
                                                                            </Table.Td>
                                                                        </Table.Tr>
                                                                    );
                                                                });
                                                            })*/

                                                        Object.entries(indexData.date_wise_data || {}).map(([dateKey, dateData], dateIndex) => {
                                                                const date = dateData.date;
                                                                const materials = dateData.data || [];
                                                                const summary = dateData.summary || {};

                                                                return (
                                                                    <React.Fragment key={dateKey}>
                                                                        {/* Date Header Row */}
                                                                        <Table.Tr style={{ backgroundColor: '#e3f2fd', borderTop: '2px solid #1976d2' }}>
                                                                            <Table.Td
                                                                                colSpan={9 + (productionItemsArray.length * 2) + 4}
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: '16px',
                                                                                    color: '#1976d2',
                                                                                    padding: '12px'
                                                                                }}
                                                                            >
                                                                                📅 {dateData.date_formatted || date}
                                                                                <span style={{ marginLeft: '20px', fontSize: '14px', fontWeight: 'normal' }}>
                        Materials: {summary.total_materials} |
                        Total In: {safeNumber(summary.total_in_amount)} |
                        Total Out: {safeNumber(summary.total_out_amount)} |
                        Closing: {safeNumber(summary.total_closing_amount)}
                    </span>
                                                                            </Table.Td>
                                                                        </Table.Tr>

                                                                        {/* Material Rows */}
                                                                        {materials.map((material, index) => {
                                                                            const isNegativeStock = material.closing_stock < 0;
                                                                            const isNegativeAmount = material.closing_stock_amount < 0;

                                                                            return (
                                                                                <Table.Tr key={`${dateKey}-${material.material_id || index}`}>
                                                                                    <Table.Td>{safeNumber(material.sl || index + 1, 0)}</Table.Td>
                                                                                    <Table.Td style={{ textAlign: 'left', color: '#666' }}>
                                                                                        {index === 0 ? safeText(date) : ''} {/* Show date only in first row */}
                                                                                    </Table.Td>
                                                                                    <Table.Td style={{ textAlign: 'left' }}>{safeText(material.product_name_english)}</Table.Td>
                                                                                    <Table.Td>{safeText(material.unit)}</Table.Td>
                                                                                    <Table.Td>{safeNumber(material.present_day_rate)}</Table.Td>
                                                                                    <Table.Td>{safeNumber(material.opening_stock)}</Table.Td>
                                                                                    <Table.Td>{safeNumber(material.in_warehouse)}</Table.Td>
                                                                                    <Table.Td>{safeNumber(material.total_in)}</Table.Td>
                                                                                    <Table.Td>{safeNumber(material.in_amount)}</Table.Td>
                                                                                    {productionItemsArray.map(item => {
                                                                                        const usage = material.production_usage?.[item.production_item_id];
                                                                                        return (
                                                                                            <React.Fragment key={`usage-${item.production_item_id}-${material.material_id}`}>
                                                                                                <Table.Td style={tableStyles.successBackground}>
                                                                                                    {usage ? safeNumber(usage.quantity) : '-'}
                                                                                                </Table.Td>
                                                                                                <Table.Td style={tableStyles.warningBackground}>
                                                                                                    {usage ? safeNumber(usage.amount) : '-'}
                                                                                                </Table.Td>
                                                                                            </React.Fragment>
                                                                                        );
                                                                                    })}
                                                                                    <Table.Td>{safeNumber(material.out)}</Table.Td>
                                                                                    <Table.Td>{safeNumber(material.out_amount)}</Table.Td>
                                                                                    <Table.Td
                                                                                        style={{
                                                                                            ...tableStyles.errorBackground,
                                                                                            color: isNegativeStock ? 'red' : 'black',
                                                                                            fontWeight: isNegativeStock ? 'bold' : 'normal',
                                                                                        }}
                                                                                    >
                                                                                        {safeNumber(material.closing_stock)}
                                                                                    </Table.Td>
                                                                                    <Table.Td
                                                                                        style={{
                                                                                            ...tableStyles.warningDarkBackground,
                                                                                            color: isNegativeAmount ? 'red' : 'black',
                                                                                            fontWeight: isNegativeAmount ? 'bold' : 'normal',
                                                                                        }}
                                                                                    >
                                                                                        {safeNumber(material.closing_stock_amount)}
                                                                                    </Table.Td>
                                                                                </Table.Tr>
                                                                            );
                                                                        })}

                                                                        {/* Optional: Add spacing row between dates */}
                                                                        {dateIndex < Object.keys(indexData.date_wise_data).length - 1 && (
                                                                            <Table.Tr style={{ height: '10px', backgroundColor: '#f5f5f5' }}>
                                                                                <Table.Td colSpan={9 + (productionItemsArray.length * 2) + 4}></Table.Td>
                                                                            </Table.Tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                );
                                                            })
                                                    )}
                                                </Table.Tbody>
                                            </Table>
                                            </div>
                                    </Box>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}
