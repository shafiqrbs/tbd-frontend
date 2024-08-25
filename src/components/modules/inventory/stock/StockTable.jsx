import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    Button,
} from "@mantine/core";

import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
    getIndexEntityData,
    setFetching,
} from "../../../../store/production/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import KeywordSearch from "../../filter/KeywordSearch.jsx";
import { setDeleteMessage } from "../../../../store/inventory/crudSlice.js";
import _StockModal from './_StockModal.jsx'

function StockTable() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 120; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData)
    const entityDataDelete = useSelector((state) => state.inventoryCrudSlice.entityDataDelete)

    const [viewModal, setViewModal] = useState(false);



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

    useEffect(() => {
        dispatch(setDeleteMessage(''))
        if (entityDataDelete === 'success') {
            notifications.show({
                color: 'red',
                title: t('DeleteSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                dispatch(setFetching(true))
            }, 700)
        }
    }, [entityDataDelete]);

    return (
        <>

            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                <KeywordSearch module={'recipe-item'} />
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
                    records={indexData.data}
                    columns={[
                        {
                            accessor: 'index',
                            title: t('S/N'),
                            textAlignment: 'right   ',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        { accessor: 'product_type', title: t("NatureOfProduct") },
                        { accessor: 'category_name', title: t("Category") },
                        { accessor: 'product_name', title: t("Name") },
                        { accessor: 'alternative_name', title: t("AlternativeName") },
                        { accessor: 'unit_name', title: t("Unit") },
                        { accessor: 'quantity', title: t("Quantity") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.3" mr={'4'}
                                        onClick={() => {
                                            setViewModal(true)
                                        }}
                                    >  {t('View')}</Button>
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
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box>
            {viewModal && <_StockModal viewModal={viewModal} setViewModal={setViewModal} />}
        </>
    );
}

export default StockTable;