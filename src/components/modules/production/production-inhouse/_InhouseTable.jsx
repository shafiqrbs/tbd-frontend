import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Table,
    Menu,
    rem
} from "@mantine/core";
import {
    IconEye,
    IconEdit,
    IconTrash,
    IconTrashX,
    IconDotsVertical, IconChevronRight, IconBuilding, IconUsers
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import __InhouseAddItem from "./__InhouseAddItem.jsx";
import clsx from "clsx";
import classes from "./NestedTablesExample.module.css";

function _InhouseTable(props) {
    const {setReloadBatchItemTable} = props
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 120; //TabList height 104
    const editedData = useSelector((state) => state.productionCrudSlice.entityEditData);

    const [expandedCompanyIds, setExpandedCompanyIds] = useState([]);
    const [expandedDepartmentIds, setExpandedDepartmentIds] = useState([]);

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
                        { accessor: 'uom', title: t('WorkorderInvoice') },
                        { accessor: 'issue_quantity', title: t('IssueQty') },
                        { accessor: 'receive_quantity', title: t('ReceiveQty') },
                        { accessor: 'damage_quantity', title: t('DamageQty') },
                        { accessor: 'stock_qty', title: t('StockQty') },
                        { accessor: 'status', title: t('Status') },
                        { accessor: 'action', title: t('Action') }
                    ]}
                    records={editedData.batch_items}
                    rowExpansion={{
                        allowMultiple: true,
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