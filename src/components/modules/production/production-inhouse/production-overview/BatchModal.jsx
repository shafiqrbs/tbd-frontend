import { useDisclosure } from '@mantine/hooks';
import {Modal, Button, Progress, Tabs, Box, Table, LoadingOverlay} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import BatchViewDetails from "./BatchViewDetails";
import {getLoadingProgress} from "../../../../global-hook/loading-progress/getLoadingProgress";
import {editEntityData} from "../../../../../store/production/crudSlice";
import {useDispatch, useSelector} from "react-redux";
import batchTableCss from "../../../../../assets/css/ProductBatchTable.module.css";
import {getIndexEntityData} from "../../../../../store/core/crudSlice";
import {useOutletContext} from "react-router-dom";

export default function BatchModal(props) {

    const { batchId, setViewModal,setBatchId } = props;
    const { t, i18 } = useTranslation();
    const dispatch = useDispatch()
    const progress =    getLoadingProgress();
    const [opened, { open, close }] = useDisclosure(false);
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : [];
    const [activeTab, setActiveTab] = useState('');
    const [editedData, setEditedData] = useState(null);
    const [tableLoading,setTableLoading] = useState(true)

    useEffect(() => {
        setActiveTab('');
    }, []);

   useEffect(  () => {
       const fetchData = async () => {
           try {
               const resultAction = await dispatch(editEntityData(`production/batch/${batchId}`));

               if (editEntityData.rejected.match(resultAction)) {
                   console.error("Error:", resultAction);
               }
               else if (editEntityData.fulfilled.match(resultAction)) {
                   setEditedData(resultAction.payload.data.data)
               }
           } catch (error) {
               console.error("Unexpected error in fetchData:", error);
           } finally {
               setTimeout(() => {
                   setTableLoading(false)
               },1000)
           }
       };

       // Call the async function
       fetchData();
    }, [batchId]);

    const closeModel = () => {
        setBatchId(null)
        setViewModal(false);
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
                        narayangonj_stock: expense.narayangonj_stock || 0,
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
    const { mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight;
    return (
        <>
            <>
                <Modal.Root opened={batchId} onClose={closeModel} fullScreen transitionProps={{ transition: 'fade', duration: 200 }}>
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header>
                            <Modal.Title>{t('ProductionDetails')}</Modal.Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <LoadingOverlay visible={tableLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                            <div
                                className={batchTableCss.responsiveTableWrapper}
                                style={{
                                    height: {height},
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
                                            <Table.Th rowSpan={3} colSpan={3} ta="center"> {t('BasicInformation')}</Table.Th>
                                            <Table.Th ta="center" colSpan={productionItems?.length * 2 || 0}>
                                                {t('IssueProduction')}
                                            </Table.Th>
                                            <Table.Th ta="center" colSpan={4}>
                                                {t('ExpenseMaterial')}
                                            </Table.Th>
                                            <Table.Th ta="center" colSpan={2}>
                                                {t('CurrentStock')}
                                            </Table.Th>
                                        </Table.Tr>
                                        <Table.Tr>
                                            {productionItems?.map((item) => (
                                                <React.Fragment key={`issue-${item.id}`}>
                                                    <Table.Th className={batchTableCss.successBackground}
                                                              ta="center">{t('Issue')}</Table.Th>
                                                    <Table.Th className={batchTableCss.warningBackground}
                                                              ta="center">{t('Receive')}</Table.Th>
                                                </React.Fragment>
                                            ))}
                                            <Table.Th className={batchTableCss.successBackground} rowSpan={3}
                                                      ta="center">{t('Issue')}</Table.Th>
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
                                                        {item['issue_quantity']}
                                                    </Table.Td>
                                                    <Table.Td className={batchTableCss.warningBackground}>
                                                        {item['receive_quantity']}
                                                    </Table.Td>
                                                </React.Fragment>
                                            ))}
                                        </Table.Tr>
                                        <Table.Tr className={batchTableCss.highlightedRow}>
                                            <Table.Th>{t('MaterialItem')}</Table.Th>
                                            <Table.Th>{t('Unit')}</Table.Th>
                                            <Table.Th>Narayangonj</Table.Th>
                                            {productionItems?.map((item) => (
                                                <Table.Th key={`header-${item.id}`} ta="center" colSpan={2} color={'red'}
                                                          style={{fontWeight: 1000}}>
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

                                            const remainingStock = material.stock_quantity - materialTotalExpense
                                            const isNegative = remainingStock < 0
                                            const remainingStockText = isNegative ? `(${Math.abs(remainingStock)})` : remainingStock

                                            return (
                                                <Table.Tr key={material.id}>
                                                    <Table.Td  ta="left">{material.material_name}</Table.Td>
                                                    <Table.Td>{material.unit}</Table.Td>
                                                    <Table.Td>{material.narayangonj_stock}</Table.Td>
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
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            </>
        </>
    );
}