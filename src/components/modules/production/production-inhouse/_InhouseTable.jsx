import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {Box,TextInput} from "@mantine/core";
import { IconChevronRight, IconBuilding} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import __InhouseAddItem from "./__InhouseAddItem.jsx";
import clsx from "clsx";
import classes from "./NestedTablesExample.module.css";
import {getHotkeyHandler} from "@mantine/hooks";
import {storeEntityData} from "../../../../store/core/crudSlice.js";

function _InhouseTable(props) {
    const {setReloadBatchItemTable} = props
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 120; //TabList height 104
    const editedData = useSelector((state) => state.productionCrudSlice.entityEditData);

    const [expandedCompanyIds, setExpandedCompanyIds] = useState([]);

    const handelInlineUpdateQuantityData = async (quantity, type, batchId, recipeItemId) => {

        const value = {
            url: 'production/batch/item/inline-quantity-update',
            data: {
                "quantity": quantity,
                "type": type,
                "batch_id": batchId,
                "batch_item_id": recipeItemId
            }
        }

        const resultAction = await dispatch(storeEntityData(value));

        if (storeEntityData.rejected.match(resultAction)) {
            const fieldErrors = resultAction.payload.errors;
            console.log(fieldErrors)
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            setReloadBatchItemTable(true)
        }
    }

    return (
        <>

            <Box pb={'xs'} >
                <__InhouseAddItem setReloadBatchItemTable={setReloadBatchItemTable} />
            </Box>
            <Box className={'borderRadiusAll'}>

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
                                    <IconChevronRight
                                        className={clsx(classes.icon, classes.expandIcon, {
                                            [classes.expandIconRotated]: expandedCompanyIds.includes(batchItem.id),
                                        })}
                                    />
                                    <IconBuilding className={classes.icon} />
                                    <span>{batchItem.name}</span>
                                </>
                            ),
                        },
                        { accessor: 'uom', title: t('UOM') },
                        { accessor: 'WorkorderInvoice', title: t('WorkorderInvoice') },
                        {
                            accessor: 'issue_quantity',
                            title: t('IssueQty'),
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
                            title: t('ReceiveQty'),
                            textAlign: "center",
                            width: '100px',
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
                            title: t('DamageQty'),
                            textAlign: "center",
                            width: '100px',
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
                        { accessor: 'stock_qty', title: t('StockQty') },
                        { accessor: 'status', title: t('Status') },
                        { accessor: 'action', title: t('Action') }
                    ]}
                    records={editedData.batch_items}
                    rowExpansion={{
                        allowMultiple: true,
                        trigger: 'always',
                        expanded: { recordIds: expandedCompanyIds, onRecordIdsChange: setExpandedCompanyIds },
                        content: (batchItem) => {
                            return batchItem.record.production_expenses ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <div style={{width: '95%'}}>
                                        <DataTable
                                            withTableBorder
                                            withColumnBorders
                                            highlightOnHover
                                            columns={[
                                                {accessor: 'name', title: t('Item')},
                                                {accessor: 'uom', title: t('UOM')},
                                                {accessor: 'quantity', title: t('Quantity')},
                                                {accessor: 'needed_quantity', title: t('TotalQuantity')},
                                                {accessor: 'stock_quantity', title: t('StockQuantity')},
                                                {accessor: 'less_quantity', title: t('Less')},
                                                {accessor: 'more_quantity', title: t('More')},
                                            ]}
                                            records={batchItem.record.production_expenses}
                                        />
                                    </div>
                                </div>
                                    ) : (
                                    <div>No data</div>
                                    );
                                    },
                                    }}
                                    />

                                </Box>

                        </>
                        )
                            ;
                        }

                        export default _InhouseTable;