import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {ActionIcon, Box, Button, Group, Text, TextInput} from "@mantine/core";
import {IconChevronRight, IconBuilding, IconX} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import __InhouseAddItem from "./__InhouseAddItem.jsx";
import clsx from "clsx";
import classes from "./NestedTablesExample.module.css";
import {getHotkeyHandler} from "@mantine/hooks";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import innerTableCss from "../../../../assets/css/TableInner.module.css";
import inputInlineCss from "../../../../assets/css/InlineInputField.module.css";
import inputCss from "../../../../assets/css/InlineInputField.module.css";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";

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

    const handleSubDomainDelete = async (id) => {
        modals.openConfirmModal({
            title: (
                <Text size="md"> {t("FormConfirmationTitle")}</Text>
            ),
            children: (
                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'blue' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {

                try {
                    const action = await dispatch(deleteEntityData(`production/batch/item/destroy/`+id));
                    const payload = action.payload;
                    if (payload?.status === 200) {
                        showNotificationComponent(t("Account head deleted successfully"), "green");
                    } else {
                        showNotificationComponent(t("Something went wrong"), "red");
                    }
                } catch (error) {
                    showNotificationComponent(t("Request failed"), "red");
                } finally {
                    // optional cleanup or state update
                }
            },
        });
    };

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
                                   {/* <IconChevronRight
                                        className={clsx(classes.icon, classes.expandIcon, {
                                            [classes.expandIconRotated]: expandedCompanyIds.includes(batchItem.id),
                                        })}
                                    />
                                    <IconBuilding className={classes.icon} />*/}
                                    <span>{batchItem.name}</span>
                                </>
                            ),
                        },
                        {
                            accessor: 'issue_quantity',
                            title: t('Issue'),
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
                                            classNames={inputInlineCss}
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
                            title: t('Receive'),
                            textAlign: "center",
                            width: '110px',
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
                                            classNames={inputInlineCss}
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
                            title: t('Damage'),
                            textAlign: "center",
                            width: '110px',
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
                                            classNames={inputInlineCss}
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
                        { accessor: 'stock_qty', title: t('Stock') },
                        { accessor: 'uom', title: t('UOM') },
                        { accessor: 'status', title: t('Status') },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <ActionIcon
                                        size="sm"
                                        variant="outline"
                                        radius="xl"
                                        color='var(--theme-remove-color)'
                                        onClick={() => handleSubDomainDelete(item.id)}
                                        >
                                        <IconX
                                            size={16}
                                            style={{width: "70%", height: "70%"}}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Group>
                            ),
                        },
                    ]}
                    records={editedData.batch_items}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer
                    }}
                    scrollAreaProps={{ type: 'never' }}
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
                                    <div style={{width: '100%'}}>
                                        <DataTable
                                            withTableBorder
                                            withColumnBorders
                                            highlightOnHover
                                            classNames={{
                                                root: innerTableCss.root,
                                                table: innerTableCss.table,
                                                body: innerTableCss.body,
                                                header: innerTableCss.header,
                                                footer: innerTableCss.footer
                                            }}
                                            columns={[
                                                {accessor: 'name', title: t('Item')},
                                                {accessor: 'quantity', title: t('Quantity'), width: '80px'},
                                                {accessor: 'needed_quantity', title: t('Total'), width: '80px'},
                                                {accessor: 'stock_quantity', title: t('Stock'), width: '80px'},
                                                {accessor: 'less_quantity', title: t('Less'), width: '80px'},
                                                {accessor: 'more_quantity', title: t('More'), width: '80px'},
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