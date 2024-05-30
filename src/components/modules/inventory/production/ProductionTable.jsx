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
    IconDotsVertical,
    IconTrashX
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
    editEntityData,
    getIndexEntityData,
    setFetching,
    setFormLoading,
    setInsertType,
    showEntityData,
    deleteEntityData
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";

import tableCss from "../../../../assets/css/Table.module.css";

function ProductionTable() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 128; //TabList height 104

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
    const data = [
        {
            'item_index': 0,
            'item_name': 'Printed Aluminium Blister Foil (20 Micron)',
            'item_uom': 'kg',
            'item_license_date': '01-01-2022',
            'item_initiate_date': '01-01-2022',
            'item_wastage': '0%',
            'item_quantity': '1.12',
            'item_wastage_quantity': '0.02',
            'item_wastage_amount': '9.00',
            'item_material_value': '611.75',
            'item_value_added': '239.25',
            'item_total': '860',
            'item_status': 'Amendment',
        },
        {
            'item_index': 1,
            'item_name': 'Printed Aluminium Blister Foil (25 Micron)',
            'item_uom': 'kg',
            'item_license_date': '01-01-2022',
            'item_initiate_date': '01-01-2022',
            'item_wastage': '0%',
            'item_quantity': '1.12',
            'item_wastage_quantity': '0.02',
            'item_wastage_amount': '9.00',
            'item_material_value': '611.75',
            'item_value_added': '239.25',
            'item_total': '860',
            'item_status': 'Amendment',
        },
        {
            'item_index': 2,
            'item_name': 'Printed Aluminium Blister Foil (30 Micron)',
            'item_uom': 'kg',
            'item_license_date': '01-01-2022',
            'item_initiate_date': '01-01-2022',
            'item_wastage': '0%',
            'item_quantity': '1.12',
            'item_wastage_quantity': '0.02',
            'item_wastage_amount': '9.00',
            'item_material_value': '611.75',
            'item_value_added': '239.25',
            'item_total': '860',
            'item_status': 'Amendment',
        }
    ]
    return (
        <>

            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                <KeywordSearch module={'product'} />
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
                    records={data}
                    columns={[
                        {
                            accessor: 'item_index',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: index => (index.item_index + 1)
                        },
                        { accessor: 'item_name', title: t("Item") },
                        { accessor: 'item_uom', title: t("Uom") },
                        { accessor: 'item_license_date', title: t("LicenseDate") },
                        { accessor: 'item_initiate_date', title: t("InitiateDate") },
                        { accessor: 'item_wastage', title: t("Wastage") },
                        { accessor: 'item_quantity', title: t("Quantity") },
                        { accessor: 'item_wastage_quantity', title: t("WastageQuantity") },
                        { accessor: 'item_wastage_amount', title: t("WastageAmount") },
                        { accessor: 'item_material_value', title: t("MaterialValue") },
                        { accessor: 'item_value_added', title: t("ValueAdded") },
                        { accessor: 'item_total', title: t("Total") },
                        { accessor: 'item_status', title: t("Status") },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (datas) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon variant="outline" color="gray.6" radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                // href={`/inventory/sales/edit/${data.id}`}
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('inventory/product/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                }}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>

                                            <Menu.Item
                                                href={``}
                                                onClick={() => {
                                                    setProductViewModel(true)
                                                    dispatch(showEntityData('inventory/product/' + data.id))
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                // href={``}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'red.1'}
                                                c={'red.6'}
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('inventory/product/' + data.id))
                                                            dispatch(setFetching(true))
                                                        },
                                                    });
                                                }}
                                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                {t('Delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
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
            {/* {
                productViewModel &&
                <ProductViewModel productViewModel={productViewModel} setProductViewModel={setProductViewModel} />
            } */}
        </>
    );
}

export default ProductionTable;