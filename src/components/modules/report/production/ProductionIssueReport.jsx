import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress";
import {
    Progress,
    Box,
    Grid,
    Table, Text, ScrollArea, Accordion, NavLink, LoadingOverlay
} from "@mantine/core";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar";
import ProductionNavigation from "../common/ProductionNavigation";
import {getIndexEntityData} from "../../../../store/report/reportSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import _ProductionReportSearch from "./_ProductionReportSearch.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {IconChevronRight, IconGauge, IconHome2} from "@tabler/icons-react";
import RequisitionNavigation from "../../procurement/common/RequisitionNavigation";
import ReportNavigation from "../ReportNavigation";

export default function ProductionIssueReport() {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 66;
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
                url: 'production/report/issue',
                param: {
                    start_date: productionIssueFilterData.start_date && new Date(productionIssueFilterData.start_date).toLocaleDateString("en-CA", options),
                    end_date: productionIssueFilterData.end_date && new Date(productionIssueFilterData.end_date).toLocaleDateString("en-CA", options),
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
                setReloadBatchData(false);
            } catch (error) {
                console.error("Unexpected error in fetchData:", error);
            } finally {
                setSearchValue(false)
            }
        };
        fetchData();
    }, [dispatch, fetching, reloadBatchData, searchValue]);
    const createTableData = (batches) => {
        const allMaterials = new Map();

        batches?.forEach((batch) => {
            batch?.batch_items?.forEach((item) => {
                item?.production_expenses?.forEach((expense) => {
                    if (!allMaterials.has(expense.material_id)) {
                        allMaterials.set(expense.material_id, {
                            id: expense.material_id,
                            material_name: expense.name,
                            unit: expense.uom || "KG",
                            opening_stock: expense.opening_quantity || 0,
                            // narayangonj_stock: expense.narayangonj_stock || 0,
                            // total_stock: (expense.opening_quantity || 0) + (expense.narayangonj_stock || 0),
                            total_stock: (expense.stock_quantity || 0) ,
                            productions: {},
                        });
                    }

                    const materialData = allMaterials.get(expense.material_id);

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
                    };
                });
            });
        });

        return Array.from(allMaterials.values());
    };
    const tableData = createTableData(indexData?.data || []);
    const getUniqueProductionItemsWithTotals = (batches) => {
        const productionMap = new Map();

        batches?.forEach((batch) => {
            batch?.batch_items?.forEach((item) => {
                const existing = productionMap.get(item.production_item_id);

                if (existing) {
                    existing.issue_quantity += item.issue_quantity || 0;
                    existing.receive_quantity += item.receive_quantity || 0;
                } else {
                    productionMap.set(item.production_item_id, {
                        id: item.id,
                        name: item.name,
                        production_item_id: item.production_item_id,
                        issue_quantity: item.issue_quantity || 0,
                        receive_quantity: item.receive_quantity || 0,
                    });
                }
            });
        });

        return Array.from(productionMap.values());
    };
    const productionItems = getUniqueProductionItemsWithTotals(indexData?.data);
    const [activeTab, setActiveTab] = useState("Accounting");
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
                                    <Grid.Col span={8}>
                                        <Text pt={'xs'} pl={'md'} pb={'xs'}>{t("ManageReports")}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={16} mt={'4'}>
                                        <_ProductionReportSearch
                                            module={'production-issue'}
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
                                                    <Table.Th rowSpan={3} colSpan={2} ta="center">Basic
                                                        Information</Table.Th>
                                                    <Table.Th ta="center"
                                                              colSpan={productionItems?.length * 2 || 0}>
                                                        Issue Production Quantity
                                                    </Table.Th>
                                                    <Table.Th ta="center" colSpan={4}>
                                                        Total Expense Material
                                                    </Table.Th>
                                                    <Table.Th ta="center" colSpan={2}>
                                                        {t('CurrentStock')} {indexData?.warehouse_name ? `(${indexData.warehouse_name})` : ''}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    {productionItems?.map((item) => (
                                                        <React.Fragment key={`issue-${item.id}`}>
                                                            <Table.Th className={batchTableCss.successBackground}
                                                                      ta="center">Issue</Table.Th>
                                                            <Table.Th className={batchTableCss.warningBackground}
                                                                      ta="center">Receive</Table.Th>
                                                        </React.Fragment>
                                                    ))}
                                                    <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                                              ta="center">Issue</Table.Th>
                                                    <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                                              ta="center">Expense</Table.Th>
                                                    <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                                              ta="center">Less</Table.Th>
                                                    <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                                              ta="center">More</Table.Th>
                                                    <Table.Th className={batchTableCss.errorBackground} rowSpan={3}
                                                              ta="center">Stock</Table.Th>
                                                    <Table.Th className={batchTableCss.warningDarkBackground}
                                                              rowSpan={3} ta="center">Remaining</Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    {productionItems?.map((item) => (
                                                        <React.Fragment key={`values-${item.id}`}>
                                                            <Table.Td className={batchTableCss.successBackground}>
                                                                {Number.isInteger(Number(item.issue_quantity)) ? Number(item.issue_quantity) : Number(item.issue_quantity).toFixed(2)}
                                                            </Table.Td>
                                                            <Table.Td className={batchTableCss.warningBackground}>
                                                                {Number.isInteger(Number(item.receive_quantity)) ? Number(item.receive_quantity) : Number(item.receive_quantity).toFixed(2)}
                                                            </Table.Td>
                                                        </React.Fragment>
                                                    ))}
                                                </Table.Tr>
                                                <Table.Tr className={batchTableCss.highlightedRow}>
                                                    <Table.Th>Material Item</Table.Th>
                                                    <Table.Th>Unit</Table.Th>
                                                    {productionItems?.map((item) => (
                                                        <Table.Th key={`header-${item.id}`} ta="center" colSpan={2}
                                                                  color={'red'} style={{fontWeight: 1000}}>
                                                            {item.name}
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

                                                    const remainingStock = material.total_stock - materialTotalExpense
                                                    const isNegative = remainingStock < 0
                                                    const remainingStockText = isNegative ? `(${Math.abs(remainingStock)})` : remainingStock

                                                    return (
                                                        <Table.Tr key={material.id}>
                                                            <Table.Td>{material.material_name}</Table.Td>
                                                            <Table.Td>{material.unit}</Table.Td>

                                                            {productionItems?.map((item) => {
                                                                const production = material.productions[item.production_item_id]
                                                                return (
                                                                    <React.Fragment
                                                                        key={`prod-${item.id}-${material.id}`}>
                                                                        <Table.Td
                                                                            className={batchTableCss.successBackground}>
                                                                            {
                                                                                production?.raw_issue_quantity
                                                                                    ? Number.isInteger(Number(production.raw_issue_quantity))
                                                                                    ? Number(production.raw_issue_quantity)
                                                                                    : Number(production.raw_issue_quantity).toFixed(2)
                                                                                    : '-'
                                                                            }
                                                                        </Table.Td>
                                                                        <Table.Td
                                                                            className={batchTableCss.warningBackground}>
                                                                            {
                                                                                production?.needed_quantity
                                                                                    ? Number.isInteger(Number(production.needed_quantity))
                                                                                    ? Number(production.needed_quantity)
                                                                                    : Number(production.needed_quantity).toFixed(2)
                                                                                    : '-'
                                                                            }
                                                                        </Table.Td>
                                                                    </React.Fragment>
                                                                )
                                                            })}

                                                            <Table.Td>{materialTotalIssue ? (Number.isInteger(materialTotalIssue) ? Number(materialTotalIssue) : Number(materialTotalIssue).toFixed(2)) : '-'}</Table.Td>
                                                            <Table.Td>{materialTotalExpense ? (Number.isInteger(materialTotalExpense) ? Number(materialTotalExpense) : Number(materialTotalExpense).toFixed(2)) : '-'}</Table.Td>
                                                            <Table.Td>{materialTotalLess ? (Number.isInteger(materialTotalLess) ? Number(materialTotalLess) : Number(materialTotalLess).toFixed(2)) : '-'}</Table.Td>
                                                            <Table.Td>{materialTotalMore ? (Number.isInteger(materialTotalMore) ? Number(materialTotalMore) : Number(materialTotalMore).toFixed(2)) : '-'}</Table.Td>
                                                            <Table.Td className={batchTableCss.errorBackground}>
                                                                {material.total_stock ? (Number.isInteger(material.total_stock) ? Number(material.total_stock) : Number(material.total_stock).toFixed(2)) : 0}
                                                                {/*{Number.isInteger(Number(material.stock_quantity)) ? Number(material.stock_quantity) : Number(material.stock_quantity).toFixed(2)}*/}

                                                            </Table.Td>
                                                            <Table.Td
                                                                className={batchTableCss.warningDarkBackground}>
                                                                {`${isNegative ? '-' : ''}${Math.abs(remainingStock)}`}
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    )
                                                })}
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
