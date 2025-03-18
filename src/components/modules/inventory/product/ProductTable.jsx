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
    Flex, Image, Modal, Button
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCheck, IconDotsVertical, IconTrashX} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching,
    setFormLoading,
    setInsertType,
    showEntityData,
    deleteEntityData,
    getStatusInlineUpdateData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import _ProductSearch from "./_ProductSearch";
import {modals} from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import ProductViewDrawer from "./ProductViewDrawer.jsx";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import AddMeasurement from "../modal/AddMeasurement.jsx";
import {Carousel} from "@mantine/carousel";
import '@mantine/carousel/styles.css';
import Autoplay from 'embla-carousel-autoplay';


function ProductTable(props) {
    const {categoryDropdown} = props;
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);
    const [viewModal, setViewModal] = useState(false);
    const [measurementDrawer, setMeasurementDrawer] = useState(false)
    const [id, setId] = useState('null')

    const [fetching, setFetching] = useState(true);
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const productFilterData = useSelector(
        (state) => state.inventoryCrudSlice.productFilterData
    );
    const fetchingReload = useSelector((state) => state.crudSlice.fetching);

    const [switchEnable, setSwitchEnable] = useState({});

    const handleSwitch = (event, item) => {
        setSwitchEnable((prev) => ({...prev, [item.id]: true}));
        const value = {
            url: "inventory/product/status/inline-update/" + item.id,
        };
        dispatch(getStatusInlineUpdateData(value));
        setTimeout(() => {
            setSwitchEnable((prev) => ({...prev, [item.id]: false}));
        }, 3000);
    };

    const navigate = useNavigate();

    const [indexData, setIndexData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: "inventory/product",
                param: {
                    term: searchKeyword,
                    name: productFilterData.name,
                    alternative_name: productFilterData.alternative_name,
                    sku: productFilterData.sku,
                    sales_price: productFilterData.sales_price,
                    page: page,
                    offset: perPage,
                    type: "product",
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload);
                    setFetching(false);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchData();
    }, [
        dispatch,
        searchKeyword,
        productFilterData,
        page,
        perPage,
        fetchingReload,
    ]);
    const productDeleteHandle = async (id) => {
        const resultAction = await dispatch(deleteEntityData("inventory/product/" + id));
        if (resultAction.payload.data.status === 200) {
            showNotificationComponent(t("DeleteSuccessfully"), 'red', 'lightgray', '', true, 1000, true)
        } else {
            showNotificationComponent('Something went wrong', 'red', 'lightgray', '', true, 1000, true)
        }
        setFetching(true)
    }
    return (
        <>
            <Box
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"4"}
                className={"boxBackground borderRadiusAll border-bottom-none"}
            >
                <_ProductSearch
                    module={"product"}
                    categoryDropdown={categoryDropdown}
                />
            </Box>
            <Box className={"borderRadiusAll border-top-none"}>
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
                            accessor: "index",
                            title: t("S/N"),
                            textAlignment: "right   ",
                            render: (item) => indexData.data.indexOf(item) + 1,
                        },
                        {accessor: "product_type", title: t("NatureOfProduct")},
                        {accessor: "category_name", title: t("Category")},
                        {accessor: "product_name", title: t("Name")},
                        {accessor: "alternative_name", title: t("DisplayName")},
                        {accessor: "bangla_name", title: t("LanguageName")},
                        {
                            accessor: 'unit_name',
                            title: t("Unit"),
                            render: (item) => (
                                <Text
                                    component="a"
                                    size="sm"
                                    variant="subtle"
                                    c="red.4"
                                    onClick={() => {
                                        setId(item.id)
                                        setMeasurementDrawer(true)
                                    }}
                                    style={{cursor: "pointer"}}

                                >
                                    {item.unit_name}
                                </Text>

                            )
                        },
                        {accessor: "quantity", title: t("Quantity"), textAlign: "center"},
                        {accessor: "bonus_quantity", title: t("BonusQuantity"), textAlign: "center"},
                        {
                            accessor: "feature_image",
                            textAlign: "center",
                            title: t("Image"),
                            width: "100px",

                            render: (item) => {
                                const [opened, setOpened] = useState(false);
                                const autoplay = useRef(Autoplay({delay: 2000}));

                                const images = [
                                    item?.images?.feature_image ? import.meta.env.VITE_IMAGE_GATEWAY_URL + item.images.feature_image : null,
                                    item?.images?.path_one ? import.meta.env.VITE_IMAGE_GATEWAY_URL + item.images.path_one : null,
                                    item?.images?.path_two ? import.meta.env.VITE_IMAGE_GATEWAY_URL + item.images.path_two : null,
                                    item?.images?.path_three ? import.meta.env.VITE_IMAGE_GATEWAY_URL + item.images.path_three : null,
                                    item?.images?.path_four ? import.meta.env.VITE_IMAGE_GATEWAY_URL + item.images.path_four : null,
                                ].filter(Boolean);

                                return (
                                    <>
                                        <Image
                                            mih={50}
                                            mah={50}
                                            fit="contain"
                                            src={images.length > 0 ? images[0] : `https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(item.product_name)}`}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => setOpened(true)}
                                        />

                                        <Modal
                                            opened={opened}
                                            onClose={() => setOpened(false)}
                                            size="lg"
                                            centered
                                            styles={{
                                                content: {overflow: 'hidden'}, // Ensure modal content doesn't overflow
                                            }}
                                        >
                                            <Carousel
                                                withIndicators
                                                height={700}
                                                // plugins={[autoplay.current]}
                                                onMouseEnter={autoplay.current.stop}
                                                onMouseLeave={autoplay.current.reset}
                                            >
                                                {images.map((img, index) => (
                                                    <Carousel.Slide key={index}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: '100%',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <Image
                                                                src={img}
                                                                fit="contain"
                                                                style={{
                                                                    transition: 'transform 0.3s ease-in-out',
                                                                    maxWidth: '100%', // Ensure image fits within the slide
                                                                    maxHeight: '100%',
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            />
                                                        </div>
                                                    </Carousel.Slide>
                                                ))}
                                            </Carousel>
                                        </Modal>
                                    </>
                                );
                            }
                        },
                        {
                            accessor: "status",
                            title: t("Status"),
                            textAlign: "center",
                            render: (item) => (
                                <Flex justify="center" align="center">
                                    <Switch
                                        disabled={switchEnable[item.id] || false || item.parent_id}
                                        defaultChecked={item.status == 1 ? true : false}
                                        color="red"
                                        radius="xs"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(event) => {
                                            handleSwitch(event.currentTarget.checked, item);
                                        }}
                                    />
                                </Flex>
                            ),
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu
                                        position="bottom-end"
                                        offset={3}
                                        withArrow
                                        trigger="hover"
                                        openDelay={100}
                                        closeDelay={400}
                                    >
                                        <Menu.Target>
                                            <ActionIcon
                                                size="sm"
                                                variant="outline"
                                                color="red"
                                                radius="xl"
                                                aria-label="Settings"
                                            >
                                                <IconDotsVertical
                                                    height={"18"}
                                                    width={"18"}
                                                    stroke={1.5}
                                                />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {!data.parent_id && (
                                                <Menu.Item
                                                    onClick={() => {
                                                        dispatch(setInsertType("update"));
                                                        dispatch(
                                                            editEntityData("inventory/product/" + data.id)
                                                        );
                                                        dispatch(setFormLoading(true));
                                                        navigate(`/inventory/product/${data.id}`);
                                                    }}
                                                >
                                                    {t("Edit")}
                                                </Menu.Item>
                                            )}

                                            <Menu.Item
                                                onClick={() => {
                                                    setViewModal(true);
                                                    dispatch(
                                                        showEntityData("inventory/product/" + data.id)
                                                    );
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={"200"}
                                            >
                                                {t("Show")}
                                            </Menu.Item>

                                            {!data.parent_id && (
                                                <Menu.Item
                                                    target="_blank"
                                                    component="a"
                                                    w={"200"}
                                                    mt={"2"}
                                                    bg={"red.1"}
                                                    c={"red.6"}
                                                    onClick={() => {
                                                        modals.openConfirmModal({
                                                            title: (
                                                                <Text size="md">
                                                                    {" "}
                                                                    {t("FormConfirmationTitle")}
                                                                </Text>
                                                            ),
                                                            children: (
                                                                <Text size="sm">
                                                                    {" "}
                                                                    {t("FormConfirmationMessage")}
                                                                </Text>
                                                            ),
                                                            labels: {confirm: "Confirm", cancel: "Cancel"},
                                                            confirmProps: {color: "red.6"},
                                                            onCancel: () => console.log("Cancel"),
                                                            onConfirm: () => {
                                                                productDeleteHandle(data.id)
                                                            },
                                                        });
                                                    }}
                                                    rightSection={
                                                        <IconTrashX
                                                            style={{width: rem(14), height: rem(14)}}
                                                        />
                                                    }
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
                    totalRecords={indexData.total}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        dispatch(setFetching(true));
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{type: "never"}}
                />
            </Box>
            {viewModal && (
                <OverviewModal viewModal={viewModal} setViewModal={setViewModal}/>
            )}
            {measurementDrawer && (
                <AddMeasurement measurementDrawer={measurementDrawer} setMeasurementDrawer={setMeasurementDrawer}
                                id={id}/>
            )}
        </>
    );
}

export default ProductTable;
