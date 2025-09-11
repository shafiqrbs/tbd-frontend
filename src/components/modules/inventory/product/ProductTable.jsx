import React, {useEffect, useState, useRef, useMemo} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Menu,
    rem,
    Switch,
    Flex,
    Image,
    Modal,
    Button, Paper, Grid, Tabs,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCheck, IconDotsVertical, IconList, IconListCheck, IconListDetails, IconTrashX} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {
    getIndexEntityData,
    deleteEntityData,
    editEntityData,
    showEntityData,
    setInsertType,
    setFormLoading,
    getStatusInlineUpdateData,
} from "../../../../store/core/crudSlice.js";
import _ProductSearch from "./_ProductSearch";
import {modals} from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import ProductViewDrawer from "./ProductViewDrawer.jsx";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import AddMeasurement from "../modal/AddMeasurement.jsx";
import {Carousel} from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import Autoplay from "embla-carousel-autoplay";
import __DrawerAddon from "./__DrawerAddon";
import {data} from "../../accounting/balance-entry/BalanceBarChart.jsx";
import {useParams} from "react-router";
import classes from "../../../../assets/css/TabCustomize.module.css";

function ProductTable({categoryDropdown}) {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 150;

    const scrollViewportRef = useRef(null);

    const navigate = useNavigate();
    const perPage = 50;
    const [page, setPage] = useState(1);
    const [allDataLoaded, setAllDataLoaded] = useState(false);

    const [indexData, setIndexData] = useState({data: [], total: 0});

    const [fetching, setFetching] = useState(false);

    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData);
    const fetchingReload = useSelector((state) => state.crudSlice.fetching);

    const [viewModal, setViewModal] = useState(false);
    const [measurementDrawer, setMeasurementDrawer] = useState(false);
    const [addonDrawer, setAddonDrawer] = useState(false);
    const [id, setId] = useState(null);
    const [switchEnable, setSwitchEnable] = useState({});
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState(slug || "allstocks");

    useEffect(() => {
        if (slug) setActiveTab(slug);
    }, [slug]);

    // Load user role
    const [userRole] = useState(() => {
        try {
            const userData = localStorage.getItem("user");
            if (!userData) return [];
            const user = JSON.parse(userData);

            if (Array.isArray(user.access_control_role)) return user.access_control_role;
            if (typeof user.access_control_role === "string") {
                return user.access_control_role.trim() ? JSON.parse(user.access_control_role) : [];
            }
            return [];
        } catch {
            return [];
        }
    });

    const handleSwitch = (event, item) => {
        setSwitchEnable((prev) => ({...prev, [item.product_id]: true}));
        dispatch(getStatusInlineUpdateData({
            url: "inventory/product/status/inline-update/" + item.product_id,
        }));
        setTimeout(() => {
            setSwitchEnable((prev) => ({...prev, [item.product_id]: false}));
        }, 3000);
    };

    const productDeleteHandle = async (id) => {
        const resultAction = await dispatch(deleteEntityData(`inventory/product/${id}`));
        const status = resultAction?.payload?.data?.status;
        if (status === 200) {
            showNotificationComponent(t("DeleteSuccessfully"), "red");
            fetchData(1, true);
        } else {
            showNotificationComponent("Something went wrong", "red");
        }
    };

    const fetchData = async (loadPage = 1, reset = false) => {
        setFetching(true);

        const value = {
            url: "inventory/product",
            param: {
                term: searchKeyword,
                name: productFilterData.name,
                alternative_name: productFilterData.alternative_name,
                sku: productFilterData.sku,
                sales_price: productFilterData.sales_price,
                product_type_id: productFilterData.product_type_id,
                category_id: productFilterData.category_id,
                page: loadPage,
                offset: perPage,
                type: "product",
                product_nature: activeTab,
            },
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.rejected.match(resultAction)) {
                console.error("Error:", resultAction);
            } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                const newData = resultAction.payload?.data ?? [];
                const total = resultAction.payload?.total ?? 0;

                if (reset) {
                    setIndexData({data: newData, total});
                } else {
                    setIndexData((prev) => ({
                        ...prev,
                        data: [...prev.data, ...newData],
                    }));
                }

                setPage(loadPage);
                if (newData.length < perPage || indexData.data.length + newData.length >= total) {
                    setAllDataLoaded(true);
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setAllDataLoaded(false);
        fetchData(1, true);
    }, [searchKeyword, productFilterData, activeTab,fetchingReload]);

    const handleScrollToBottom = () => {
        if (!fetching && !allDataLoaded) {
            fetchData(page + 1);
        }
    };

    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'product_name',
        direction: 'asc'
    });

    // Memoized Sorted Data
    const sortedRecords = useMemo(() => {
        if (!indexData?.data) return [];

        return [...indexData.data].sort((a, b) => {
            const aVal = a[sortStatus.columnAccessor];
            const bVal = b[sortStatus.columnAccessor];

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            const valA = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
            const valB = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;

            if (valA < valB) return sortStatus.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortStatus.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [indexData?.data, sortStatus]);


    return (
        <>
            <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
                <Grid columns={12} gutter={{ base: 8 }}>
                    <Grid.Col span={12}>
                        <Tabs variant="unstyled" defaultValue={activeTab} classNames={classes}>
                            <Tabs defaultValue="allstocks">
                                <Tabs.List grow>
                                    <Tabs.Tab
                                        value="allstocks"
                                        component={Link}
                                        to="/inventory/product/allstocks"
                                        leftSection={<IconListCheck size={16} />}
                                    >
                                        {t('AllStocks')}
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        value="production"
                                        component={Link}
                                        to="/inventory/product/production"
                                        leftSection={<IconListCheck size={16} />}
                                    >

                                        {t('Production')}
                                    </Tabs.Tab>

                                    <Tabs.Tab
                                        value="stockable"
                                        component={Link}
                                        to="/inventory/product/stockable"
                                        leftSection={<IconList size={16} />}
                                    >{t('Stockable')}

                                    </Tabs.Tab>

                                    <Tabs.Tab
                                        value="rawmaterial"
                                        component={Link}
                                        to="/inventory/product/rawmaterial"
                                        leftSection={<IconListDetails size={16} />}
                                    >
                                        {t('RawMaterial')}
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Tabs>
                        </Tabs>
                    </Grid.Col>
                </Grid>
                <Box>
                    <_ProductSearch module="product" categoryDropdown={categoryDropdown}/>
                </Box>
            </Box>

            <Box className="borderRadiusAll border-top-none">
                <DataTable
                    records={sortedRecords}
                    classNames={{ thead: 'custom-header', tbody: 'custom-body' }} // replace with actual tableCss if needed
                    columns={[
                        {
                            accessor: 'index',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (sortedRecords.indexOf(item) ?? -1) + 1
                        },
                        {
                            accessor: 'product_type',
                            title: t('NatureOfProduct'),
                            sortable: true
                        },
                        {
                            accessor: 'category_name',
                            title: t('Category'),
                            sortable: true
                        },
                        {
                            accessor: 'product_name',
                            title: t('Name'),
                            sortable: true
                        },
                        {
                            accessor: 'unit_name',
                            title: t('Unit'),
                            sortable: true,
                            render: (item) => (
                                <Button
                                    component="a"
                                    size="compact-xs"
                                    radius="xs"
                                    color="var(--theme-primary-color-4)"
                                    variant="filled"
                                    fw="100"
                                    fz="12"
                                    onClick={() => {
                                        setId(item.product_id);
                                        setMeasurementDrawer(true);
                                    }}
                                >
                                    {item.unit_name}
                                </Button>
                            )
                        },
                        {
                            accessor: 'quantity',
                            title: t('Quantity'),
                            textAlign: 'center'
                        },
                        {
                            accessor: 'feature_image',
                            title: t('Image'),
                            textAlign: 'center',
                            width: '100px',
                            render: (item) => {
                                const [opened, setOpened] = useState(false);
                                const autoplay = useRef(Autoplay({ delay: 2000 }));

                                const images = [
                                    item?.images?.feature_image,
                                    item?.images?.path_one,
                                    item?.images?.path_two,
                                    item?.images?.path_three,
                                    item?.images?.path_four
                                ]
                                    .filter(Boolean)
                                    .map(img => `${img}`);

                                return (
                                    images?.[0] && (
                                        <Image
                                            mih={50}
                                            mah={50}
                                            fit="contain"
                                            src={`${import.meta.env.VITE_IMAGE_GATEWAY_URL}/storage/${images[0]}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setOpened(true)}
                                        />
                                    )
                                );
                            }
                        },
                        {
                            accessor: 'status',
                            title: t('Status'),
                            textAlign: 'center',
                            render: (item) => (
                                <Flex justify="center" align="center">
                                    <Switch
                                        disabled={switchEnable[item.product_id] || item.parent_id}
                                        defaultChecked={item.status === 1}
                                        color="var(--theme-primary-color-6)"
                                        radius="xs"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(e) => handleSwitch(e, item)}
                                    />
                                </Flex>
                            )
                        },
                        {
                            accessor: 'action',
                            title: t('Action'),
                            textAlign: 'right',
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu
                                        position="bottom-end"
                                        withArrow
                                        trigger="hover"
                                        width={200}
                                        openDelay={100}
                                        closeDelay={400}
                                    >
                                        <Menu.Target>
                                            <ActionIcon
                                                size="sm"
                                                variant="outline"
                                                color="var(--theme-primary-color-6)"
                                                radius="xl"
                                            >
                                                <IconDotsVertical height={18} width={18} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {!item.parent_id &&
                                                ['role_inventory_manager', 'role_domain'].some((role) =>
                                                    userRole.includes(role)
                                                ) && (
                                                    <Menu.Item
                                                        onClick={() => {
                                                            dispatch(setInsertType('update'));
                                                            dispatch(editEntityData(`inventory/product/${item.product_id}`));
                                                            dispatch(setFormLoading(true));
                                                            navigate(`/inventory/product/${item.product_id}`);
                                                        }}
                                                    >
                                                        {t('Edit')}
                                                    </Menu.Item>
                                                )}
                                            <Menu.Item
                                                onClick={() => {
                                                    setViewModal(true);
                                                    dispatch(showEntityData(`inventory/product/${item.product_id}`));
                                                }}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => {
                                                    setId(item.product_id);
                                                    setAddonDrawer(true);
                                                }}
                                            >
                                                {t('Addon')}
                                            </Menu.Item>
                                            {!item.parent_id &&
                                                ['role_inventory_manager', 'role_domain'].some((role) =>
                                                    userRole.includes(role)
                                                ) && (
                                                    <Menu.Item
                                                        bg="red.1"
                                                        c="var(--theme-primary-color-6)"
                                                        onClick={() =>
                                                            modals.openConfirmModal({
                                                                title: <Text size="md">{t('FormConfirmationTitle')}</Text>,
                                                                children: (
                                                                    <Text size="sm">{t('FormConfirmationMessage')}</Text>
                                                                ),
                                                                labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                                confirmProps: { color: 'red.6' },
                                                                onConfirm: () => productDeleteHandle(item.product_id)
                                                            })
                                                        }
                                                        rightSection={
                                                            <IconTrashX style={{ width: rem(14), height: rem(14) }} />
                                                        }
                                                    >
                                                        {t('Delete')}
                                                    </Menu.Item>
                                                )}
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            )
                        }
                    ]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height-40}
                    scrollViewportRef={scrollViewportRef}
                    onScrollToBottom={handleScrollToBottom}
                />

                {/* Footer */}
                <Paper p="xs" mt="xs" withBorder>
                    <Group justify="space-between">
                        <Text size="sm">
                            Showing <b>{sortedRecords.length}</b> of{' '}
                            <b>{indexData?.total || 0}</b> products
                        </Text>
                        {!fetching && sortedRecords.length === 0 && (
                            <Text size="xs" color="dimmed">
                                {t('No products found')}
                            </Text>
                        )}
                        {!fetching && sortedRecords.length !== 0 && !fetching && (
                            <Text size="xs" color="dimmed">
                                {t('Scroll to load more...')}
                            </Text>
                        )}
                        {fetching && (
                            <Text size="xs" color="dimmed">
                                {t('LoadingProducts')}...
                            </Text>
                        )}
                    </Group>
                </Paper>
            </Box>

            {viewModal && (
                <OverviewModal viewModal={viewModal} setViewModal={setViewModal}/>
            )}
            {measurementDrawer && (
                <AddMeasurement
                    measurementDrawer={measurementDrawer}
                    setMeasurementDrawer={setMeasurementDrawer}
                    id={id}
                />
            )}
            {addonDrawer && (
                <__DrawerAddon addonDrawer={addonDrawer} setAddonDrawer={setAddonDrawer} id={id}/>
            )}
        </>
    );
}

export default ProductTable;
