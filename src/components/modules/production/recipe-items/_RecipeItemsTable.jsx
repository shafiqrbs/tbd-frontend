import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Group,
    Box,
    Button, LoadingOverlay, ActionIcon, Menu, Text, rem, ScrollArea, Select,
} from "@mantine/core";

import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
    proItemUpdateStatus,
    setFetching,
} from "../../../../store/production/crudSlice.js";
import KeywordSearch from "../common/KeywordSearch.jsx";
import tableCss from "../../../../assets/css/Table.module.css";

import {
    editEntityData,
    getIndexEntityData,
    setDeleteMessage,
    setFormLoading,
    setInsertType,
} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {deleteEntityData} from "../../../../store/production/crudSlice";
import {IconCheck, IconCopy, IconDotsVertical, IconEyeEdit, IconPencil, IconTrashX, IconX} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import dayjs from "dayjs";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import axios from "axios";
import {notifications} from "@mantine/notifications";
import {storeEntityData} from "../../../../store/inventory/crudSlice.js";
import useProductsDataStoreIntoLocalStorage
    from "../../../global-hook/local-storage/useProductsDataStoreIntoLocalStorage.js";

function _RecipeItemsTable(props) {
    // Load and parse config safely
    let domainConfigData = null;
    try {
        const configRaw = localStorage.getItem('domain-config-data');
        domainConfigData = configRaw ? JSON.parse(configRaw) : null;
    } catch (e) {
        console.error('Failed to parse domain-config-data from localStorage', e);
    }

    const isWarehouse = domainConfigData?.inventory_config.sku_warehouse
    const {fetching,setFetching,layoutLoading,setLayoutLoading} = props
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 120; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword)
    const recipeItemFilterData = useSelector((state) => state.productionCrudSlice.recipeItemFilterData)
    const navigate = useNavigate()

    const warehouseDropdown = getCoreWarehouseDropdownData();
    const formatDate = (dateString, format = "DD-MMM-YYYY") => {
        if (!dateString) return "";
        return dayjs(dateString).format(format);
    };
    const [indexData,setIndexData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'production/recipe-items',
                param: {
                    term: searchKeyword,
                    product_name: recipeItemFilterData.product_name,
                    page: page,
                    offset: perPage
                }
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                    setFetching(false)
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                    setFetching(false)
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            }
            setLayoutLoading(false)
        };

        fetchData();
    }, [dispatch, searchKeyword, recipeItemFilterData, page,fetching]);

    const [downloadFinishGoodsXLS,setDownloadFinishGoodsXLS] = useState(false)

    useEffect(() => {
        if (downloadFinishGoodsXLS) {
            const fetchData = async () => {
                const value = {
                    url: 'production/generate/finish-goods/xlsx',
                    param: {}
                };

                try {
                    const resultAction = await dispatch(getIndexEntityData(value));
                    if (getIndexEntityData.rejected.match(resultAction)) {
                        console.error('Error:', resultAction);
                    } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                        if (resultAction.payload.status===200) {
                            const href = `${import.meta.env.VITE_API_GATEWAY_URL + "finish-goods/download"}`;

                            const anchorElement = document.createElement('a');
                            anchorElement.href = href;
                            document.body.appendChild(anchorElement);
                            anchorElement.click();
                            document.body.removeChild(anchorElement);
                        }else {
                            showNotificationComponent(resultAction.payload.error, 'red')
                        }
                    }
                } catch (err) {
                    console.error('Unexpected error:', err);
                } finally {
                    setDownloadFinishGoodsXLS(false)
                }
            };

            fetchData();
        }
    }, [downloadFinishGoodsXLS, dispatch]);


    return (
        <>
            <LoadingOverlay visible={layoutLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                <KeywordSearch module={'recipe-item'} setDownloadFinishGoodsXLS={setDownloadFinishGoodsXLS} />
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
                            accessor: 'id',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        { accessor: 'product_name', title: t("Item") },
                        { accessor: 'unit_name', title: t("Uom") },
                        isWarehouse && {
                            accessor: "warehouse_id",
                            title: t("Warehouse"),
                            render: (item) => {
                                const warehouseValue = String(item.warehouse_id || "");
                                return (
                                    <Select
                                        size="xs"
                                        placeholder="Select"
                                        value={warehouseValue}
                                        data={warehouseDropdown}
                                        onChange={async (newValue) => {
                                            try {
                                                // Create a new copy of indexData
                                                const updatedData = indexData.data.map((r) =>
                                                    r.id === item.id ? { ...r, warehouse_id: Number(newValue) } : r
                                                );

                                                // Update state so the table re-renders immediately
                                                setIndexData((prev) => ({ ...prev, data: updatedData }));

                                                // Call backend API
                                                const data = {
                                                    url: 'production/recipe-items/update-warehouse',
                                                    data: {
                                                        id: item.id,
                                                        warehouse_id: Number(newValue),
                                                    },
                                                };

                                                const resultAction = await dispatch(proItemUpdateStatus(data));

                                                if (proItemUpdateStatus.rejected.match(resultAction)) {
                                                    showNotificationComponent('Fail to update warehouse', 'red');

                                                    // Rollback if backend fails
                                                    setIndexData((prev) => ({ ...prev, data: indexData.data }));
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}


                                    />
                                );
                            },
                        },
                        { accessor: 'license_date', title: t("LicenseDate") },
                        { accessor: 'initiate_date', title: t("InitiateDate") },
                        { accessor: 'waste_percent', title: t("Wastage%"), textAlign: "center" },
                        { accessor: 'quantity', title: t("Quantity"), textAlign: 'center' },
                        {
                            accessor: 'total',
                            title: t("WastageQuantity"),
                            textAlign: 'center',
                            render: (item) => (
                                <>
                                    {item.quantity && item.waste_percent ? ((Number(item.quantity) * Number(item.waste_percent)) / 100).toFixed(2) : "0.00"}
                                </>
                            )
                        },
                        { accessor: 'waste_amount', title: t("WastageAmount"), textAlign: 'center' },
                        { accessor: 'material_amount', title: t("MaterialValue"), textAlign: 'center' },
                        { accessor: 'value_added_amount', title: t("ValueAdded"), textAlign: 'center' },
                        { accessor: 'sub_total', title: t("Total"), textAlign: 'center' },
                        {
                            accessor: 'process',
                            title: t("Status"),
                            render: (item) => (
                                <>
                                    {item.process === 'created' && 'Created'}
                                    {item.process === 'checked' && 'Checked'}
                                    {item.process === 'approved' && 'Approved'}
                                </>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <>
                                    <Group gap={4} justify="right" wrap="nowrap">
                                    {item.process != 'approved' ?
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <Button component="a" size="compact-xs" radius="xs" variant="filled"
                                                    fw={'100'} fz={'12'} color='var(--theme-primary-color-6)' mr={'4'}
                                                    onClick={() => {
                                                        {
                                                            navigate(`/production/recipe-update/${item.id}`)
                                                        }
                                                    }}
                                            >  {t('Recipe')}</Button>
                                        </Group>
                                        :
                                            <Button component="a" size="compact-xs" radius="xs" variant="filled"
                                                    fw={'100'} fz={'12'} color='var(--theme-reset-btn-color)' mr={'4'}
                                                    onClick={() => {
                                                        {
                                                            navigate(`/production/recipe-update/${item.id}`)
                                                        }
                                                    }}
                                            >  {t('Amendment')}</Button>

                                    }

                                        {item?.is_revised === 1 &&(
                                            <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                            <Menu.Target>
                                                <ActionIcon size="sm" variant="transparent" color='red' radius="xl" aria-label="Settings">
                                                    <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                {item?.item_amendment && item.item_amendment.length > 0 && (
                                                    item.item_amendment.map((amendment, j) => (
                                                        <Menu.Item
                                                            key={j}
                                                            component="a"
                                                            leftSection={
                                                                <IconEyeEdit style={{ width: rem(14), height: rem(14) }} />
                                                            }
                                                            w={200}
                                                        >
                                                            {formatDate(amendment?.created_at)}
                                                        </Menu.Item>
                                                    ))
                                                )}

                                            </Menu.Dropdown>
                                        </Menu>
                                        )}
                                    </Group>
                            </>
                            ),
                        },
                    ].filter(Boolean)}

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
        </>
    );
}

export default _RecipeItemsTable;