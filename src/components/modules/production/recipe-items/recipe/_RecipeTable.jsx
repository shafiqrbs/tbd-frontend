import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text, TextInput, Switch
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconX, IconPercentage
} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    getIndexEntityData,
    setFetching, deleteEntityData, storeEntityData, inlineUpdateEntityData
} from "../../../../../store/production/crudSlice.js";
import tableCss from "../../../../../assets/css/Table.module.css";
import __RecipeAddItem from "./__RecipeAddItem.jsx";

function _RecipeTable() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 120; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.productionCrudSlice.fetching)
    const indexData = useSelector((state) => state.productionCrudSlice.indexEntityData)

    let totalQuantity = indexData.data?.reduce((total, item) => {
        if (item.status === 1) {
            return total + item.quantity;
        }
        return total;
    }, 0) || 0;

    let totalSubTotal = indexData.data?.reduce((total, item) => {
        if (item.status === 1) {
            return total + item.sub_total;
        }
        return total;
    }, 0) || 0;

    let totalWastageQuantity = indexData.data?.reduce((total, item) => {
        if (item.status === 1) {
            return total + item.wastage_quantity;
        }
        return total;
    }, 0) || 0;

    let totalWastageAmount = indexData.data?.reduce((total, item) => {
        if (item.status === 1) {
            return total + item.wastage_amount;
        }
        return total;
    }, 0) || 0;

    useEffect(() => {
        const value = {
            url: 'production/recipe',
            param: {
                page: page,
                offset: perPage,
                pro_item_id : id
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);


    return (
        <>
            <Box pb={'xs'}>
                <__RecipeAddItem/>
            </Box>
            <Box className={'borderRadiusAll'}>
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    withTableBorder={1}
                    records={indexData.data}
                    columns={[
                        {
                            accessor: 'index',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        {
                            accessor: 'product_name',
                            title: t("Item"),
                            footer: (
                                <Group spacing="xs" >
                                    <Text fz={'md'} fw={'600'}>{t('Total')}</Text>
                                </Group>
                            ),
                        },
                        {accessor: 'unit_name', title: t("Uom")},
                        {
                            accessor: 'quantity',
                            title: t('Quantity'),
                            textAlign: "center",
                            width: '100px',
                            render: (item) => {
                                const [editedQuantity, setEditedQuantity] = useState(item.quantity);
                                const handleQuantityChange = (e) => {
                                    const editedQuantity = e.currentTarget.value;
                                    setEditedQuantity(editedQuantity);

                                    if (e.currentTarget.value && e.currentTarget.value >= 0) {
                                        const values = {
                                            inv_stock_id: item.material_id,
                                            price: item.price,
                                            quantity: e.currentTarget.value,
                                            percent: item.wastage_percent,
                                            item_id: id,
                                        }

                                        const data = {
                                            url: 'production/recipe',
                                            data: values
                                        }
                                        dispatch(storeEntityData(data))
                                        dispatch(setFetching(true))
                                    }
                                };

                                return (
                                    <TextInput
                                        type="number"
                                        label=""
                                        size="xs"
                                        value={editedQuantity}
                                        onChange={handleQuantityChange}
                                        rightSection={
                                            editedQuantity === '' ?
                                                <>{item.quantity}<IconPercentage size={16} opacity={0.5} /></>
                                                :
                                                <IconPercentage size={16} opacity={0.5} />
                                        }
                                    />
                                );
                            },
                            footer: (
                                <Group spacing="xs" >
                                    <Text fz={'md'} fw={'600'}>{totalQuantity.toFixed(2)}</Text>
                                </Group>
                            ),
                        },

                        {
                            accessor: 'price',
                            title: t('Price'),
                            textAlign: "center",
                            width: '100px',
                            render: (item) => {
                                const [editedPrice, setEditedPrice] = useState(item.price);
                                const handlePriceChange = (e) => {
                                    const editedPrice = e.target.value;
                                    setEditedPrice(editedPrice);

                                    if (e.target.value && e.target.value >= 0) {
                                        const values = {
                                            inv_stock_id: item.material_id,
                                            price: e.target.value,
                                            quantity: item.quantity,
                                            percent: item.wastage_percent,
                                            item_id: id,
                                        }

                                        const data = {
                                            url: 'production/recipe',
                                            data: values
                                        }
                                        dispatch(storeEntityData(data))
                                        dispatch(setFetching(true))
                                    }
                                };

                                return (
                                    <TextInput
                                        type="number"
                                        label=""
                                        size="xs"
                                        value={editedPrice}
                                        onChange={handlePriceChange}
                                        rightSection={
                                            editedPrice === '' ?
                                                <>{item.price}<IconPercentage size={16} opacity={0.5} /></>
                                                :
                                                <IconPercentage size={16} opacity={0.5} />
                                        }
                                    />
                                );
                            },
                        },

                        {
                            accessor: 'sub_total',
                            title: t("SubTotal"),
                            textAlign: 'center',
                            footer: (
                                <Group spacing="xs">
                                    <Text fz={'md'} fw={'600'}>{totalSubTotal.toFixed(2)}</Text>
                                </Group>
                            ),
                        },

                        {
                            accessor: 'wastage_percent',
                            title: t('Wastage%'),
                            textAlign: "center",
                            width: '100px',
                            render: (item) => {
                                const [editedPercent, setEditedPercent] = useState(item.wastage_percent);
                                const handlePercentChange = (e) => {
                                    const editedPercent = e.currentTarget.value;
                                    setEditedPercent(editedPercent);

                                    if (e.currentTarget.value && e.currentTarget.value >= 0) {
                                        const values = {
                                            inv_stock_id: item.material_id,
                                            price: item.price,
                                            quantity: item.quantity,
                                            percent: e.currentTarget.value,
                                            item_id: id,
                                        }

                                        const data = {
                                            url: 'production/recipe',
                                            data: values
                                        }
                                        dispatch(storeEntityData(data))
                                        dispatch(setFetching(true))
                                    }
                                };

                                return (
                                    <TextInput
                                        type="number"
                                        label=""
                                        size="xs"
                                        value={editedPercent}
                                        onChange={handlePercentChange}
                                        rightSection={
                                            editedPercent === '' ?
                                                <>{item.wastage_percent}<IconPercentage size={16} opacity={0.5} /></>
                                                :
                                                <IconPercentage size={16} opacity={0.5} />
                                        }
                                    />
                                );
                            }
                        },

                        {
                            accessor: 'wastage_quantity',
                            title: t("WastageQuantity"),
                            textAlign: 'center',
                            footer: (
                                <Group spacing="xs" >
                                    <Text fz={'md'} fw={'600'}>{totalWastageQuantity.toFixed(2)}</Text>
                                </Group>
                            ),
                        },
                        {
                            accessor: 'wastage_amount',
                            title: t("WastageAmount"),
                            textAlign: 'center',
                            footer: (
                                <Group spacing="xs" >
                                    <Text fz={'md'} fw={'600'}>{totalWastageAmount.toFixed(2)}</Text>
                                </Group>
                            ),
                        },
                        {
                            accessor: 'status',
                            title: t("Status"),
                            render: (item) => (
                                <>
                                    <Switch
                                        defaultChecked={item.status==1?true:false}
                                        color="red"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(event) => {
                                            const value ={
                                                url:'production/inline-update-element-status',
                                                data:{
                                                    status : event.currentTarget.checked,
                                                    id : item.id
                                                }
                                            }
                                            dispatch(inlineUpdateEntityData(value))
                                            dispatch(setFetching(true))
                                        }}

                                    />
                                </>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="red"
                                        onClick={() => {
                                            dispatch(deleteEntityData('production/recipe/'+data.id))
                                            dispatch(setFetching(true))
                                        }}
                                    >
                                        <IconX size={16} style={{ width: '70%', height: '70%' }}
                                               stroke={1.5} />
                                    </ActionIcon>
                                </Group>
                            ),
                        },
                    ]
                    }
                    fetching={fetching}
                    totalRecords={indexData.total}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p)
                        dispatch(setFetching(true))
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={tableHeight}
                    scrollAreaProps={{type: 'never'}}
                />
            </Box>
        </>
    );
}

export default _RecipeTable;