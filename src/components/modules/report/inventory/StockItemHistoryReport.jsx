import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress";
import {
    Progress,
    Box,
    Grid,
    Table, Text, LoadingOverlay
} from "@mantine/core";
import {getIndexEntityData} from "../../../../store/report/reportSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useOutletContext} from "react-router-dom";
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import ReportNavigation from "../ReportNavigation";
import _InventoryReportSearch from "./_InventoryReportSearch.jsx";

export default function StockItemHistoryReport() {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 66;

    const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))
    const isWarehouse = domainConfigData?.inventory_config.sku_warehouse

    const [indexData, setIndexData] = useState([])
    const [searchValue, setSearchValue] = useState(false)
    const [reloadHistoryData, setReloadHistoryData] = useState(false)
    const inventoryStockItemHistoryFilterData = useSelector((state) => state.reportSlice.inventoryStockItemHistoryFilterData);

    const perPage = 500;
    const [page, setPage] = useState(1);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'inventory/report/stock-item/history',
                param: {
                    start_date: inventoryStockItemHistoryFilterData.start_date && new Date(inventoryStockItemHistoryFilterData.start_date).toLocaleDateString("en-CA", options),
                    end_date: inventoryStockItemHistoryFilterData.end_date && new Date(inventoryStockItemHistoryFilterData.end_date).toLocaleDateString("en-CA", options),
                    warehouse_id: inventoryStockItemHistoryFilterData.warehouse_id ,
                    stock_item_id: inventoryStockItemHistoryFilterData.stock_item_id ,
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
                    setIndexData(resultAction.payload)
                }
                setReloadHistoryData(false);
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            } finally {
                setSearchValue(false)
            }
        };

        if ((isWarehouse && inventoryStockItemHistoryFilterData.warehouse_id && inventoryStockItemHistoryFilterData.start_date) || (!isWarehouse && inventoryStockItemHistoryFilterData.start_date)) {
            fetchData();
        }
    }, [dispatch, reloadHistoryData, searchValue]);


    const [downloadFile, setDownloadFile] = useState(false)
    const [downloadType, setDownloadType] = useState('xlsx')

    useEffect(() => {
        if (downloadFile) {
            const fetchData = async () => {
                let route = '';
                if (downloadType == 'pdf') {
                    route = 'production/report/issue-pdf'
                } else if (downloadType == 'xlsx') {
                    route = 'production/report/issue-xlsx'
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
                            const href = `${import.meta.env.VITE_API_GATEWAY_URL + "issue-xlsx/download/"}${downloadType}`;

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
                    <LoadingOverlay visible={searchValue || downloadFile} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>
                    <Box p={'xs'}>
                        <Grid columns={24} gutter={{base: 8}}>
                        <Grid.Col span={4}>
                            <ReportNavigation height={height} />
                        </Grid.Col>
                        <Grid.Col span={20}>
                            <Box className={"boxBackground borderRadiusAll"}>
                                <Grid columns={24} gutter={{base:8}}>
                                    <Grid.Col span={4}>
                                        <Text pt={'xs'} pl={'md'} pb={'xs'}>{t("ItemStockHistory")}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={20} mt={'4'}>
                                        <_InventoryReportSearch
                                            module={"inventory"}
                                            reportName={"stock-item-history"}
                                            isWarehouse={isWarehouse}
                                            setSearchValue={setSearchValue}
                                            setDownloadFile={setDownloadFile}
                                            setDownloadType={setDownloadType}
                                        />
                                </Grid.Col>
                                </Grid>
                            </Box>
                            <Box bg={'white'} className="borderRadiusAll" p={'8'}>
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
                                                    <Table.Th colSpan={4} ta="center">Basic Information</Table.Th>
                                                    <Table.Th ta="center" colSpan={2}>Price</Table.Th>
                                                    <Table.Th ta="center" colSpan={3}>Quantity</Table.Th>
                                                    <Table.Th ta="center" colSpan={4}>Balance</Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th
                                                        className={batchTableCss.highlightedCell}
                                                        rowSpan={indexData?.data?.length || 1} // ✅ dynamic rowspan
                                                        ta="center"
                                                    >
                                                        Item Name
                                                    </Table.Th>
                                                    <Table.Th
                                                        className={batchTableCss.highlightedCell}
                                                        rowSpan={indexData?.data?.length || 1} // ✅ dynamic rowspan
                                                        ta="center"
                                                    >
                                                        Unit
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.highlightedCell} ta="center">
                                                        Mode
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.highlightedCell} ta="center">
                                                        Date
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.stockBackground} ta="center">
                                                        Sales Price
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.stockBackground} ta="center">
                                                        Purchase Price
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.errorBackground} ta="center">
                                                        Opening Qty
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.errorBackground} ta="center">
                                                        Quantity
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.errorBackground} ta="center">
                                                        Closing Qty
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.warningDarkBackground} ta="center">
                                                        Opening Balance
                                                    </Table.Th>
                                                    <Table.Th className={batchTableCss.warningDarkBackground} ta="center">
                                                        Closing Balance
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>

                                            <Table.Tbody>
                                                {indexData?.data?.length > 0 ? (
                                                    indexData.data.map((item, index) => (
                                                        <Table.Tr key={item.id}>
                                                            {/* ✅ only render item_name and uom for the first row (rowSpan handled by Thead) */}
                                                            {index === 0 && (
                                                                <>
                                                                    <Table.Td
                                                                        rowSpan={indexData.data.length}
                                                                        style={{ verticalAlign: "middle", fontWeight: 500 }}
                                                                    >
                                                                        {item.item_name}
                                                                    </Table.Td>
                                                                    <Table.Td
                                                                        rowSpan={indexData.data.length}
                                                                        style={{ verticalAlign: "middle" }}
                                                                    >
                                                                        {item.uom}
                                                                    </Table.Td>
                                                                </>
                                                            )}

                                                            <Table.Td ta="center">{item.mode}</Table.Td>
                                                            <Table.Td ta="center">{item.created_date}</Table.Td>
                                                            <Table.Td ta="center">{item.sales_price}</Table.Td>
                                                            <Table.Td ta="center">{item.purchase_price}</Table.Td>
                                                            <Table.Td ta="center">{item.opening_quantity}</Table.Td>
                                                            <Table.Td ta="center">{item.quantity}</Table.Td>
                                                            <Table.Td ta="center">{item.closing_quantity}</Table.Td>
                                                            <Table.Td ta="center">{item.opening_balance}</Table.Td>
                                                            <Table.Td ta="center">{item.closing_balance}</Table.Td>
                                                        </Table.Tr>
                                                    ))
                                                ) : (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={10} ta="center">
                                                            No data found
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                            </Table.Tbody>
                                        </Table>

                                    </div>
                                </Box>

                        </Grid.Col>
                    </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}
