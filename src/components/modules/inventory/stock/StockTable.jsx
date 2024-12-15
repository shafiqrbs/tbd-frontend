import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Group, Box, Button, Switch, Menu, ActionIcon, rem
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
import _StockModal from './_StockModal.jsx';
import { IconCheck, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { showEntityData } from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";

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

    // Sync `configData` with localStorage
    const [configData, setConfigData] = useState(() => {
        const storedConfigData = localStorage.getItem("config-data");
        return storedConfigData ? JSON.parse(storedConfigData) : [];
    });

    const [viewModal, setViewModal] = useState(false);

    // remove this line when api integrated
    const [checked, setChecked] = useState({})

    const [swtichEnable, setSwitchEnable] = useState({});

    const handleSwtich = (event, item) => {
        setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }));
        setSwitchEnable(prev => ({ ...prev, [item.id]: true }));
        // const value = {
        //     url: '',
        //     data: {
        //         status: event.currentTarget.checked,
        //         id: item.id
        //     }
        // }
        // dispatch(inlineUpdateEntityData(value))
        // dispatch(setFetching(true))
        setTimeout(() => {
            setSwitchEnable(prev => ({ ...prev, [item.id]: false }));
        }, 5000)
    }


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


    const [isColor, setColor] = useState((configData?.is_color === 1));
    const [isGrade, setGrade] = useState((configData?.is_grade === 1));
    const [isSize, setSize] = useState((configData?.is_size === 1));
    const [isModel, setModel] = useState((configData?.is_model === 1));
    const [isBrand, setBrand] = useState((configData?.is_brand === 1));

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
                        { accessor: 'brand_name', title: t("Brand"),hidden: !isBrand},
                        { accessor: 'grade_name', title: t("Grade") ,hidden: !isGrade},
                        { accessor: 'color_name', title: t("Color") ,hidden: !isColor},
                        { accessor: 'size_name', title: t("Size") ,hidden: !isSize},
                        { accessor: 'model_name', title: t("Model") ,hidden: !isModel},
                        {
                            accessor: 'status',
                            title: t("Status"),
                            width: 70,
                            render: (item) => (
                                <>
                                    <Switch
                                        disabled={swtichEnable[item.id] || false}
                                        checked={checked[item.id] || item.status == 1}
                                        color="red"
                                        radius="xs"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(event) => {
                                            handleSwtich(event, item)
                                        }}

                                    />
                                </>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.3" mr={'4'}
                                        onClick={() => {
                                            dispatch(showEntityData('inventory/product/' + item.id))
                                            setViewModal(true)
                                        }}
                                    >  {t('View')}</Button>
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    // dispatch(setInsertType('update'))
                                                    // dispatch(editEntityData('inventory/products/' + data.id))
                                                    // dispatch(setFormLoading(true))
                                                    // navigate(`/core/customer-settings/${data.id}`)
                                                }}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'red.1'}
                                                c={'red.6'}
                                                onClick={() => {
                                                    // modals.openConfirmModal({
                                                    //     title: (
                                                    //         <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                    //     ),
                                                    //     children: (
                                                    //         <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                    //     ),
                                                    //     labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                    //     confirmProps: { color: 'red.6' },
                                                    //     onCancel: () => console.log('Cancel'),
                                                    //     onConfirm: () => {
                                                    //         dispatch(deleteEntityData('inventory/particular/' + data.id))
                                                    //         dispatch(setFetching(true))
                                                    //         notifications.show({
                                                    //             color: 'red',
                                                    //             title: t('DeleteSuccessfully'),
                                                    //             icon: <IconCheck
                                                    //                 style={{ width: rem(18), height: rem(18) }} />,
                                                    //             loading: false,
                                                    //             autoClose: 700,
                                                    //             style: { backgroundColor: 'lightgray' },
                                                    //         });
                                                    //     },
                                                    // });
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
            {viewModal && <_StockModal viewModal={viewModal} setViewModal={setViewModal} />}
        </>
    );
}

export default StockTable;