import React, {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate, useOutletContext,Link } from "react-router-dom";
import {
  Group,
  Box,
  Button,
  Switch,
  Menu,
  ActionIcon,
  rem,
  Text,
  Image,
  Modal, Grid,Tabs
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getIndexEntityData,
  setFetching,
} from "../../../../store/core/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import classes from "../../../../assets/css/TabCustomize.module.css";
import __StockSearch from "./__StockSearch.jsx";
import { setDeleteMessage } from "../../../../store/inventory/crudSlice.js";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import { IconCheck, IconDotsVertical, IconTrashX ,IconListDetails,IconListCheck,IconList} from "@tabler/icons-react";
import { showEntityData } from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import {
  editEntityData,
  setFormLoading,
  setInsertType,
} from "../../../../store/core/crudSlice.js";
import { modals } from "@mantine/modals";
import AddMeasurement from "../modal/AddMeasurement.jsx";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useForm } from "@mantine/form";
import {useParams} from "react-router";

function StockMatrixTable(props) {
  const { categoryDropdown, locationData } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 120; //TabList height 104
  const navigate = useNavigate();
  const perPage = 50;
  const [page, setPage] = useState(1);
  const {warehouse} = useParams();
  const [selectedDomainId, setSelectedDomainId] = useState(warehouse);
  const fetchingReload = useSelector((state) => state.crudSlice.fetching);
  const [fetching, setFetching] = useState(true);
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const [indexData, setIndexData] = useState([]);
  const productFilterData = useSelector(
    (state) => state.inventoryCrudSlice.productFilterData
  );
  const entityDataDelete = useSelector(
    (state) => state.inventoryCrudSlice.entityDataDelete
  );

  // Sync `configData` with localStorage
  const [configData, setConfigData] = useState(() => {
    const storedConfigData = localStorage.getItem("domain-config-data");
    return storedConfigData ? JSON.parse(storedConfigData) : [];
  });
  const product_config = configData?.inventory_config?.config_product;

  const [viewModal, setViewModal] = useState(false);

  // remove this line when api integrated
  const [checked, setChecked] = useState({});

  const [swtichEnable, setSwitchEnable] = useState({});
  const [measurementDrawer, setMeasurementDrawer] = useState(false);
  const [id, setId] = useState("null");

  const handleSwtich = (event, item) => {
    setChecked((prev) => ({ ...prev, [item.product_id]: !prev[item.product_id] }));
    setSwitchEnable((prev) => ({ ...prev, [item.product_id]: true }));

    setTimeout(() => {
      setSwitchEnable((prev) => ({ ...prev, [item.product_id]: false }));
    }, 5000);
  };

  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(slug || "allstocks");

  useEffect(() => {
    if (slug) setActiveTab(slug);
  }, [slug]);
  const [downloadStockXLS, setDownloadStockXls] = useState(false);
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
          product_type_id: productFilterData.product_type_id,
          category_id: productFilterData.category_id,
          page: searchKeyword ? 1: page,
          offset: perPage,
          type: "stock",
          product_nature: activeTab,
        },
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
          setFetching(false)
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [fetching, activeTab,downloadStockXLS, searchKeyword, productFilterData, page]);
  useEffect(() => {
    dispatch(setDeleteMessage(""));
    if (entityDataDelete === "success") {
      notifications.show({
        color: "red",
        title: t("DeleteSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      setTimeout(() => {
        setFetching(true)
      }, 700);
    }
  }, [entityDataDelete]);

  const [isColor, setColor] = useState(product_config?.sku_color === 1);
  const [isGrade, setGrade] = useState(product_config?.sku_grade === 1);
  const [isSize, setSize] = useState(product_config?.sku_size === 1);
  const [isModel, setModel] = useState(product_config?.sku_model === 1);
  const [isBrand, setBrand] = useState(product_config?.sku_brand === 1);

  useEffect(() => {
    if (downloadStockXLS) {
      const fetchData = async () => {
        const value = {
          url: "inventory/generate/stock-item/xlsx",
          param: {},
        };

        try {
          const resultAction = await dispatch(getIndexEntityData(value));
          if (getIndexEntityData.rejected.match(resultAction)) {
            console.error("Error:", resultAction);
          } else if (getIndexEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload.status === 200) {
              const href = `${
                import.meta.env.VITE_API_GATEWAY_URL + "stock-item/download"
              }`;

              const anchorElement = document.createElement("a");
              anchorElement.href = href;
              document.body.appendChild(anchorElement);
              anchorElement.click();
              document.body.removeChild(anchorElement);
            } else {
              showNotificationComponent(resultAction.payload.error, "red");
            }
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        } finally {
          setDownloadStockXls(false);
        }
      };

      fetchData();
    }
  }, [downloadStockXLS, dispatch]);

  // Location Dropdown
  const form = useForm({
    initialValues: {
      location_id: "",
    },
  });

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
      <Box
        pl={`xs`}
        pb={"xs"}
        pr={8}
        pt={"xs"}
        mb={"xs"}
        className={"boxBackground borderRadiusAll"}
      >
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={12}>
            <Tabs variant="unstyled" defaultValue={activeTab} classNames={classes}>
              <Tabs defaultValue="allstocks">
                <Tabs.List grow>
                  <Tabs.Tab
                      value="allstocks"
                      component={Link}
                      to={"/inventory/stock/matrix/allstocks"}
                      leftSection={<IconListCheck size={16} />}
                  >
                    {t('AllStocks')}
                  </Tabs.Tab>
                  <Tabs.Tab
                      value="production"
                      component={Link}
                      to={"/inventory/stock/matrix/production"}
                      leftSection={<IconListCheck size={16} />}
                  >

                    {t('Production')}
                  </Tabs.Tab>
                  <Tabs.Tab
                      value="stockable"
                      component={Link}
                      to={"/inventory/stock/matrix/stockable"}
                      leftSection={<IconList size={16} />}
                  >{t('Stockable')}
                  </Tabs.Tab>
                  <Tabs.Tab
                      value="rawmaterial"
                      component={Link}
                      to={"/inventory/stock/matrix/rawmaterial"}
                      leftSection={<IconListDetails size={16} />}
                  >
                    {t('RawMaterial')}
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </Tabs>
          </Grid.Col>
          <Grid.Col span={12}>
            <__StockSearch
                module={"stock"}
                setDownloadStockXls={setDownloadStockXls}
                categoryDropdown={categoryDropdown}
            />
          </Grid.Col>
        </Grid>
      </Box>
      <Box className={"borderRadiusAll"}>
        <DataTable
          classNames={{
            root: tableCss.root,
            table: tableCss.table,
            header: tableCss.header,
            footer: tableCss.footer,
            pagination: tableCss.pagination,
          }}
          records={sortedRecords}
          columns={[
            {
              accessor: "index",
              title: t("S/N"),
              textAlignment: "right",
              render: (_row, index) => index + 1 + (page - 1) * perPage,
            },
            { accessor: "category_name", title: t("Category"),sortable: true },
            { accessor: "product_name", title: t("Name"),sortable: true },
            {
              accessor: 'product_code',
              title: t('ProductCode'),
              sortable: true
            },
            { accessor: "brand_name", title: t("Brand"), hidden: !isBrand },
            { accessor: "grade_name", title: t("Grade"), hidden: !isGrade },
            { accessor: "color_name", title: t("Color"), hidden: !isColor },
            { accessor: "size_name", title: t("Size"), hidden: !isSize },
            { accessor: "model_name", title: t("Model"), hidden: !isModel },
            {
              accessor: "unit_name",
              title: t("Unit"),
            },
            { accessor: "rem_quantity", title: t("Narayangonj"), textAlign: "center" },
            {
              accessor: "action",
              title: t("Action"),
              textAlign: "right",
              render: (item) => (
                <Group gap={4} justify="right" wrap="nowrap">
                  <Button
                    component="a"
                    size="compact-xs"
                    radius="xs"
                    variant="filled"
                    fw={"100"}
                    fz={"12"}
                    color='var(--theme-primary-color-6)'
                    mr={"4"}
                    onClick={() => {
                      dispatch(showEntityData("inventory/product/" + item.product_id));
                      setViewModal(true);
                    }}
                  >
                    {" "}
                    {t("View")}
                  </Button>
                </Group>
              ),
            },
          ]}
          fetching={fetching || downloadStockXLS || fetchingReload}
          totalRecords={indexData.total}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          recordsPerPage={perPage}
          page={page}
          onPageChange={(p) => {
            setPage(p);
            setFetching(true)
          }}
          loaderSize="xs"
          loaderColor="grape"
          height={height}
          scrollAreaProps={{ type: "never" }}
        />
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
    </>
  );
}

export default StockMatrixTable;
