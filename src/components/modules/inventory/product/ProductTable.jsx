import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon, Text
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconEye, IconEdit, IconTrash} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/core/crudSlice";
import ProductViewModel from "./ProductViewModel.jsx";

function ProductTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [productViewModel, setProductViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData)

    useEffect(() => {
        const value = {
            url: 'inventory/product',
            param: {
                term: searchKeyword,
                name: productFilterData.name,
                alternative_name: productFilterData.alternative_name,
                sku: productFilterData.sku,
                sales_price: productFilterData.sales_price,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>
            <Box>
                <Box bg={`white`}>
                    <Box pt={'xs'} pb={`xs`} pl={`md`} pr={'xl'}>
                        <KeywordSearch module={'product'}/>
                    </Box>
                </Box>
                <Box bg={`white`}>

                    <Box pb={`xs`} pl={`md`} pr={'md'}>
                        <DataTable
                            withTableBorder
                            records={indexData.data}
                            columns={[
                                {
                                    accessor: 'index',
                                    title: 'S/N',
                                    textAlignment: 'right',
                                    render: (item) => (indexData.data.indexOf(item) + 1)
                                },
                                {accessor: 'product_name', title: "Name"},
                                {accessor: 'category_name', title: "Category"},
                                {accessor: 'unit_name', title: "Unit"},
                                {accessor: 'brand_name', title: "Brand"},
                                {accessor: 'purchase_price', title: "Purchase Price"},
                                {accessor: 'sales_price', title: "Sales Price"},
                                {
                                    accessor: "action",
                                    title: "Action",
                                    textAlign: "right",
                                    render: (data) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="green"
                                                onClick={() => {
                                                    setProductViewModel(true)
                                                    dispatch(showEntityData('inventory/product/' + data.id))
                                                }}
                                            >
                                                <IconEye size={16}/>
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('inventory/product/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                }}
                                            >
                                                <IconEdit size={16}/>
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="red"
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('inventory/product/' + data.id))
                                                            dispatch(setFetching(true))
                                                        },
                                                    });
                                                }}
                                            >
                                                <IconTrash size={16}/>
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
                            height={height}
                            scrollAreaProps={{type: 'never'}}
                        />
                    </Box>
                </Box>
            </Box>
            {
                productViewModel &&
                <ProductViewModel productViewModel={productViewModel} setProductViewModel={setProductViewModel}/>
            }
        </>
    );
}

export default ProductTable;