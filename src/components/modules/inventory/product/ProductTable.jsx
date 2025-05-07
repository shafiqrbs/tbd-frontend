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
                                    .map((img) => `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${img}`);

                                return (
                                    <>
                                        <Image
                                            mih={50}
                                            mah={50}
                                            fit="contain"
                                            src={
                                                images[0] ||
                                                `https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(item.product_name)}`
                                            }
                                            style={{cursor: "pointer"}}
                                            onClick={() => setOpened(true)}
                                        />
                                        <Modal
                                            opened={opened}
                                            onClose={() => setOpened(false)}
                                            size="lg"
                                            centered
                                            styles={{content: {overflow: "hidden"}}}
                                        >
                                            <Carousel withIndicators height={700} onMouseEnter={autoplay.current.stop}
                                                      onMouseLeave={autoplay.current.reset}>
                                                {images.map((img, index) => (
                                                    <Carousel.Slide key={index}>
                                                        <div className="centered-slide">
                                                            <Image
                                                                src={img}
                                                                fit="contain"
                                                                style={{
                                                                    transition: "transform 0.3s ease-in-out",
                                                                    maxWidth: "100%",
                                                                    maxHeight: "100%",
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                            />
                                                        </div>
                                                    </Carousel.Slide>
                                                ))}
                                            </Carousel>
                                        </Modal>
                                    </>
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
                                    <Menu position="bottom-end" withArrow trigger="hover" openDelay={100}
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
                                Scroll to bottom to load more...
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



/*

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
  Center,
  Loader,
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
  const [loading, setLoading] = useState(true);

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

  // Improved data fetching function with better error handling and loading state management
  const fetchData = async (loadPage = 1, reset = false) => {
    setLoading(true);

    // Add small delay to ensure loading state is properly registered
    await new Promise(resolve => setTimeout(resolve, 50));

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
        console.error("Error fetching data:", resultAction.error);
        showNotificationComponent("Failed to load data. Please try again.", "red");
      } else if (getIndexEntityData.fulfilled.match(resultAction)) {
        const newData = resultAction.payload?.data ?? [];
        const total = resultAction.payload?.total ?? 0;

        if (reset) {
          setIndexData({data: newData, total});
        } else {
          setIndexData(prev => ({
            data: [...prev.data, ...newData],
            total
          }));
        }

        setPage(loadPage);
        setAllDataLoaded(newData.length < perPage);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      showNotificationComponent("An unexpected error occurred", "red");
    } finally {
      // Add small delay before removing loading state to ensure smoother transitions
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  // Handle filter changes - reset and reload data
  useEffect(() => {
    setPage(1);
    setAllDataLoaded(false);
    fetchData(1, true);
  }, [searchKeyword, productFilterData, fetchingReload]);

  const handleScrollToBottom = () => {
    if (!loading && !allDataLoaded) {
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

  // Use a wrapper component to improve image loading performance
  const ProductImage = ({ item }) => {
    const [opened, setOpened] = useState(false);
    const autoplay = useRef(Autoplay({ delay: 2000 }));
    const [imageLoaded, setImageLoaded] = useState(false);

    const images = [
      item?.images?.feature_image,
      item?.images?.path_one,
      item?.images?.path_two,
      item?.images?.path_three,
      item?.images?.path_four,
    ]
        .filter(Boolean)
        .map((img) => `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${img}`);

    const placeholderUrl = `https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(item.product_name)}`;

    return (
        <>
          <div style={{ position: 'relative', width: '50px', height: '50px' }}>
            {!imageLoaded && (
                <Center style={{ width: '100%', height: '100%' }}>
                  <Loader size="xs" color="gray" />
                </Center>
            )}
            <Image
                mih={50}
                mah={50}
                fit="contain"
                src={images[0] || placeholderUrl}
                style={{
                  cursor: "pointer",
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
                onLoad={() => setImageLoaded(true)}
                onClick={() => setOpened(true)}
                loading="lazy"
            />
          </div>

          <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              size="lg"
              centered
              styles={{ content: { overflow: "hidden" } }}
          >
            <Carousel
                withIndicators
                height={700}
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
            >
              {images.map((img, index) => (
                  <Carousel.Slide key={index}>
                    <div className="centered-slide">
                      <Image
                          src={img}
                          fit="contain"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>
                  </Carousel.Slide>
              ))}
            </Carousel>
          </Modal>
        </>
    );
  };

  return (
      <>
        <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
          <_ProductSearch module="product" categoryDropdown={categoryDropdown}/>
        </Box>

        <Box className="borderRadiusAll border-top-none" pos="relative">
          {indexData.data.length === 0 && loading && (
              <Center style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, background: 'rgba(255,255,255,0.8)' }}>
                <Loader color="grape" />
              </Center>
          )}

          <DataTable
              classNames={{
                ...tableCss,
                // Add specific class overrides for smoother scrolling
                table: `${tableCss.table || ''} smooth-scroll-table`,
                scrollContainer: `${tableCss.scrollContainer || ''} smooth-scroll-container`,
              }}
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
                  render: (item) => <ProductImage item={item} />
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
                        <Menu position="bottom-end" withArrow trigger="hover" openDelay={100}
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
              fetching={indexData.data.length > 0 && loading}
              loaderSize="xs"
              loaderColor="grape"
              height={height}
              scrollViewportRef={scrollViewportRef}
              onScrollToBottom={handleScrollToBottom}
              // Add CSS styles inline to improve scroll performance
              style={{
                // Hardware acceleration hints
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitOverflowScrolling: 'touch', // smoother momentum scrolling for iOS
              }}
          />

          <Paper p="md" mt="sm" withBorder>
            <Group justify="space-between">
              <Text size="sm">
                Showing <b>{indexData.data.length}</b> of <b>{indexData.total}</b> products
              </Text>
              {loading && indexData.data.length > 0 && (
                  <Group>
                    <Loader size="xs" color="grape" />
                    <Text size="xs" color="dimmed">Loading more...</Text>
                  </Group>
              )}
              {allDataLoaded && indexData.data.length > 0 && (
                  <Text size="xs" color="dimmed">
                    All products loaded
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

// Add this style to your CSS or in a style tag in your HTML
const smoothScrollStyles = `
.smooth-scroll-container {
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
}
.smooth-scroll-table {
    will-change: transform;
}
`;

export default ProductTable;
*/

/*

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  Paper,
  LoadingOverlay
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
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
import { modals } from "@mantine/modals";
import tableCss from "../../../../assets/css/Table.module.css";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import AddMeasurement from "../modal/AddMeasurement.jsx";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import Autoplay from "embla-carousel-autoplay";
import __DrawerAddon from "./__DrawerAddon";
import { useDebouncedCallback } from "use-debounce";

function ProductTable({ categoryDropdown }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 155;

  const scrollViewportRef = useRef(null);
  const autoplayRefs = useRef({});
  const isMounted = useRef(true);

  const navigate = useNavigate();
  const perPage = 50;
  const [page, setPage] = useState(1);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const [indexData, setIndexData] = useState({ data: [], total: 0 });
  const [fetching, setFetching] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoized Switch component
  const MemoizedSwitch = React.memo(({ item, switchEnable }) => (
      <Switch
          disabled={switchEnable[item.product_id] || item.parent_id}
          defaultChecked={item.status === 1}
          color="red"
          radius="xs"
          size="md"
          onLabel="ON"
          offLabel="OFF"
          onChange={(e) => handleSwitch(e, item)}
      />
  ));

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
    if (fetching || !isMounted.current) return;
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
        console.error("Error:", resultAction.error);
        showNotificationComponent(t("FailedToLoadProducts"), "red");
      } else if (getIndexEntityData.fulfilled.match(resultAction)) {
        const newData = resultAction.payload?.data ?? [];
        const total = resultAction.payload?.total ?? 0;

        if (reset) {
          setIndexData({ data: newData, total });
          setPage(1);
          setAllDataLoaded(false);
        } else {
          setIndexData((prev) => ({
            data: [...prev.data, ...newData],
            total
          }));
          setPage(loadPage);
        }

        if (newData.length < perPage || newData.length === 0) {
          setAllDataLoaded(true);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      showNotificationComponent(t("NetworkError"), "red");
    } finally {
      if (isMounted.current) {
        setFetching(false);
      }
    }
  };

  useEffect(() => {
    fetchData(1, true);
  }, [searchKeyword, productFilterData, fetchingReload]);

  const handleScroll = useDebouncedCallback(() => {
    if (!scrollViewportRef.current || fetching || allDataLoaded) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current;
    const threshold = 100;

    if (scrollHeight - (scrollTop + clientHeight) < threshold) {
      fetchData(page + 1);
    }
  }, 200);

  const handleSwitch = (event, item) => {
    setSwitchEnable((prev) => ({ ...prev, [item.product_id]: true }));
    dispatch(getStatusInlineUpdateData({
      url: "inventory/product/status/inline-update/" + item.product_id,
    }));
    setTimeout(() => {
      setSwitchEnable((prev) => ({ ...prev, [item.product_id]: false }));
    }, 3000);
  };

  const productDeleteHandle = async (id) => {
    const resultAction = await dispatch(deleteEntityData(`inventory/product/${id}`));
    const status = resultAction?.payload?.data?.status;
    if (status === 200) {
      showNotificationComponent(t("DeleteSuccessfully"), "red");
      fetchData(1, true);
    } else {
      showNotificationComponent(t("DeleteFailed"), "red");
    }
  };

  const ProductImage = React.memo(({ item }) => {
    const [opened, setOpened] = useState(false);
    const images = [
      item?.images?.feature_image,
      item?.images?.path_one,
      item?.images?.path_two,
      item?.images?.path_three,
      item?.images?.path_four,
    ]
        .filter(Boolean)
        .map((img) => `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${img}`);

    if (!autoplayRefs.current[item.product_id]) {
      autoplayRefs.current[item.product_id] = Autoplay({ delay: 2000 });
    }

    return (
        <>
          <Image
              mih={50}
              mah={50}
              fit="contain"
              src={
                  images[0] ||
                  `https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(item.product_name)}`
              }
              style={{ cursor: "pointer" }}
              onClick={() => setOpened(true)}
              loading="lazy"
              alt={item.product_name}
          />
          <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              size="lg"
              centered
              styles={{ content: { overflow: "hidden" } }}
          >
            <Carousel
                withIndicators
                height={700}
                plugins={[autoplayRefs.current[item.product_id]]}
                onMouseEnter={autoplayRefs.current[item.product_id].stop}
                onMouseLeave={autoplayRefs.current[item.product_id].reset}
            >
              {images.map((img, index) => (
                  <Carousel.Slide key={index}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%"
                    }}>
                      <Image
                          src={img}
                          fit="contain"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>
                  </Carousel.Slide>
              ))}
            </Carousel>
          </Modal>
        </>
    );
  });

  return (
      <>
        <Box pl="xs" pr={8} pt="6" pb="4" className="boxBackground borderRadiusAll border-bottom-none">
          <_ProductSearch module="product" categoryDropdown={categoryDropdown} />
        </Box>

        <Box className="borderRadiusAll border-top-none" pos="relative">
          <LoadingOverlay visible={fetching && page === 1} overlayBlur={2} />

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
                { accessor: "product_type", title: t("NatureOfProduct") },
                { accessor: "category_name", title: t("Category") },
                { accessor: "product_name", title: t("Name") },
                { accessor: "alternative_name", title: t("DisplayName") },
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
                          style={{ cursor: "pointer" }}
                      >
                        {item.unit_name}
                      </Text>
                  ),
                },
                { accessor: "quantity", title: t("Quantity"), textAlign: "center" },
                {
                  accessor: "feature_image",
                  title: t("Image"),
                  textAlign: "center",
                  width: "100px",
                  render: (item) => <ProductImage item={item} />,
                },
                {
                  accessor: "status",
                  title: t("Status"),
                  textAlign: "center",
                  render: (item) => (
                      <Flex justify="center" align="center">
                        <MemoizedSwitch item={item} switchEnable={switchEnable} />
                      </Flex>
                  ),
                },
                {
                  accessor: "action",
                  title: t("Action"),
                  textAlign: "right",
                  render: (item) => (
                      <Group gap={4} justify="right" wrap="nowrap">
                        <Menu position="bottom-end" withArrow trigger="hover" openDelay={100}
                              closeDelay={400}>
                          <Menu.Target>
                            <ActionIcon size="sm" variant="outline" color="red" radius="xl">
                              <IconDotsVertical height={18} width={18} stroke={1.5} />
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
                                              labels: { confirm: t("Confirm"), cancel: t("Cancel") },
                                              confirmProps: { color: "red.6" },
                                              onConfirm: () => productDeleteHandle(item.product_id),
                                            })
                                        }
                                        rightSection={<IconTrashX
                                            style={{ width: rem(14), height: rem(14) }} />}
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
              fetching={fetching && page > 1}
              loaderSize="xs"
              loaderColor="grape"
              height={height}
              scrollViewportRef={scrollViewportRef}
              onScroll={handleScroll}
              styles={{
                scrollViewport: {
                  overflow: 'auto',
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#ced4da',
                    borderRadius: '4px',
                  },
                },
                table: {
                  willChange: 'transform',
                }
              }}
          />

          <Paper p="md" mt="sm" withBorder>
            <Group justify="space-between">
              <Text size="sm">
                {t("Showing")} <b>{indexData.data.length}</b> {t("of")} <b>{indexData.total}</b> {t("products")}
              </Text>
              {!allDataLoaded && !fetching && (
                  <Text size="xs" color="dimmed">
                    {t("ScrollToLoadMore")}
                  </Text>
              )}
              {fetching && !allDataLoaded && (
                  <Text size="xs" color="dimmed">
                    {t("LoadingMoreProducts")}...
                  </Text>
              )}
            </Group>
          </Paper>
        </Box>

        {viewModal && (
            <OverviewModal viewModal={viewModal} setViewModal={setViewModal} />
        )}
        {measurementDrawer && (
            <AddMeasurement
                measurementDrawer={measurementDrawer}
                setMeasurementDrawer={setMeasurementDrawer}
                id={id}
            />
        )}
        {addonDrawer && (
            <__DrawerAddon addonDrawer={addonDrawer} setAddonDrawer={setAddonDrawer} id={id} />
        )}
      </>
  );
}

export default React.memo(ProductTable);*/
