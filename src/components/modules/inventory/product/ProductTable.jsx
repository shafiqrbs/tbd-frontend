import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
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
    Button, Paper,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCheck, IconDotsVertical, IconTrashX} from "@tabler/icons-react";
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

function ProductTable({categoryDropdown}) {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 155;

    const scrollViewportRef = useRef(null);

    const navigate = useNavigate();
    const perPage = 50;
    const [page, setPage] = useState(1);
    const [allDataLoaded, setAllDataLoaded] = useState(false);

    const [indexData, setIndexData] = useState({data: [], total: 0});
    const [fetching, setFetching] = useState(false);

    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const productFilterData = useSelector(
        (state) => state.inventoryCrudSlice.productFilterData
    );
    const fetchingReload = useSelector((state) => state.crudSlice.fetching);

    const [viewModal, setViewModal] = useState(false);
    const [measurementDrawer, setMeasurementDrawer] = useState(false);
    const [addonDrawer, setAddonDrawer] = useState(false);
    const [id, setId] = useState(null);
    const [switchEnable, setSwitchEnable] = useState({});

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
                page: loadPage,
                offset: perPage,
                type: "product",
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
    }, [searchKeyword, productFilterData, fetchingReload]);

    const handleScrollToBottom = () => {
        if (!fetching && !allDataLoaded) {
            fetchData(page + 1);
        }
    };

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

    return (
        <>
            <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
                <_ProductSearch module="product" categoryDropdown={categoryDropdown}/>
            </Box>

            <Box className="borderRadiusAll border-top-none">
                <DataTable
                    classNames={tableCss}
                    records={indexData.data}
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right",
                            render: (item) => indexData.data.indexOf(item) + 1,
                        },
                        {accessor: "product_type", title: t("NatureOfProduct")},
                        {accessor: "category_name", title: t("Category")},
                        {accessor: "product_name", title: t("Name")},
                        {accessor: "alternative_name", title: t("DisplayName")},
                        {
                            accessor: "unit_name",
                            title: t("Unit"),
                            render: (item) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                    color="red.4"
                                    onClick={() => {
                                        setId(item.product_id);
                                        setMeasurementDrawer(true);
                                    }}
                                    style={{cursor: "pointer"}}
                                >
                                    {item.unit_name}
                                </Text>
                            ),
                        },
                        {accessor: "quantity", title: t("Quantity"), textAlign: "center"},
                        {
                            accessor: "feature_image",
                            title: t("Image"),
                            textAlign: "center",
                            width: "100px",
                            render: (item) => {
                                const [opened, setOpened] = useState(false);
                                const autoplay = useRef(Autoplay({delay: 2000}));
                                const images = [
                                    item?.images?.feature_image,
                                    item?.images?.path_one,
                                    item?.images?.path_two,
                                    item?.images?.path_three,
                                    item?.images?.path_four,
                                ]
                                    .filter(Boolean)
                                    .map((img) => `${img}`);

                                return (
                                    images && images[0] &&
                                    <Image
                                        mih={50}
                                        mah={50}
                                        fit="contain"
                                        src={
                                            import.meta.env.VITE_IMAGE_GATEWAY_URL + '/storage/' + images[0]
                                        }
                                        style={{cursor: "pointer"}}
                                        onClick={() => setOpened(true)}
                                    />

                                );
                            },
                        },
                        {
                            accessor: "status",
                            title: t("Status"),
                            textAlign: "center",
                            render: (item) => (
                                <Flex justify="center" align="center">
                                    <Switch
                                        disabled={switchEnable[item.product_id] || item.parent_id}
                                        defaultChecked={item.status === 1}
                                        color="red"
                                        radius="xs"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(e) => handleSwitch(e, item)}
                                    />
                                </Flex>
                            ),
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" withArrow trigger="hover"  width={200}s openDelay={100}
                                          closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl">
                                                <IconDotsVertical height={18} width={18} stroke={1.5}/>
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {!item.parent_id &&
                                            ["role_inventory_manager", "role_domain"].some(role => userRole.includes(role)) && (
                                                <Menu.Item
                                                    onClick={() => {
                                                        dispatch(setInsertType("update"));
                                                        dispatch(editEntityData(`inventory/product/${item.product_id}`));
                                                        dispatch(setFormLoading(true));
                                                        navigate(`/inventory/product/${item.product_id}`);
                                                    }}
                                                >
                                                    {t("Edit")}
                                                </Menu.Item>
                                            )}
                                            <Menu.Item
                                                onClick={() => {
                                                    setViewModal(true);
                                                    dispatch(showEntityData(`inventory/product/${item.product_id}`));
                                                }}
                                            >
                                                {t("Show")}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => {
                                                    setId(item.product_id);
                                                    setAddonDrawer(true);
                                                }}
                                            >
                                                {t("Addon")}
                                            </Menu.Item>
                                            {!item.parent_id &&
                                            ["role_inventory_manager", "role_domain"].some(role => userRole.includes(role)) && (
                                                <Menu.Item
                                                    bg="red.1"
                                                    c="red.6"
                                                    onClick={() =>
                                                        modals.openConfirmModal({
                                                            title: <Text
                                                                size="md">{t("FormConfirmationTitle")}</Text>,
                                                            children: <Text
                                                                size="sm">{t("FormConfirmationMessage")}</Text>,
                                                            labels: {confirm: "Confirm", cancel: "Cancel"},
                                                            confirmProps: {color: "red.6"},
                                                            onConfirm: () => productDeleteHandle(item.product_id),
                                                        })
                                                    }
                                                    rightSection={<IconTrashX
                                                        style={{width: rem(14), height: rem(14)}}/>}
                                                >
                                                    {t("Delete")}
                                                </Menu.Item>
                                            )}
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            ),
                        },
                    ]}

                    fetching={fetching}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollViewportRef={scrollViewportRef}
                    onScrollToBottom={handleScrollToBottom}
                />
                <Paper p="md" mt="sm" withBorder>
                    <Group justify="space-between">
                        <Text size="sm">
                            Showing <b>{indexData.data.length}</b> of <b>{indexData.total}</b> products
                        </Text>
                        {!allDataLoaded && (
                            <Text size="xs" color="dimmed">
                                {fetching && !allDataLoaded && (
                                    <Text size="xs" color="dimmed">
                                        {t("LoadingProducts")}...
                                    </Text>
                                )}
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
