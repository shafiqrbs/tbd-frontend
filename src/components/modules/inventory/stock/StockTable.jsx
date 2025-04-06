import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  Modal,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getIndexEntityData,
  setFetching,
} from "../../../../store/production/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import __StockSearch from "./__StockSearch.jsx";
import { setDeleteMessage } from "../../../../store/inventory/crudSlice.js";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import { IconCheck, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
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

function StockTable(props) {
  const { categoryDropdown, locationData } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 120; //TabList height 104

  const navigate = useNavigate();
  const perPage = 50;
  const [page, setPage] = useState(1);

  const fetching = useSelector((state) => state.productionCrudSlice.fetching);
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
    const storedConfigData = localStorage.getItem("config-data");
    return storedConfigData ? JSON.parse(storedConfigData) : [];
  });

  const [viewModal, setViewModal] = useState(false);

  // remove this line when api integrated
  const [checked, setChecked] = useState({});

  const [swtichEnable, setSwitchEnable] = useState({});
  const [measurementDrawer, setMeasurementDrawer] = useState(false);
  const [id, setId] = useState("null");

  const handleSwtich = (event, item) => {
    setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    setSwitchEnable((prev) => ({ ...prev, [item.id]: true }));

    setTimeout(() => {
      setSwitchEnable((prev) => ({ ...prev, [item.id]: false }));
    }, 5000);
  };

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
          page: page,
          offset: perPage,
          type: "stock",
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
  }, [fetching, downloadStockXLS]);

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
        dispatch(setFetching(true));
      }, 700);
    }
  }, [entityDataDelete]);

  const [isColor, setColor] = useState(configData?.is_color === 1);
  const [isGrade, setGrade] = useState(configData?.is_grade === 1);
  const [isSize, setSize] = useState(configData?.is_size === 1);
  const [isModel, setModel] = useState(configData?.is_model === 1);
  const [isBrand, setBrand] = useState(configData?.is_brand === 1);

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
  const [locationMap, setLocationMap] = useState({});

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
        <__StockSearch
          module={"stock"}
          setDownloadStockXls={setDownloadStockXls}
          categoryDropdown={categoryDropdown}
        />
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
          records={indexData.data}
          columns={[
            {
              accessor: "index",
              title: t("S/N"),
              textAlignment: "right",
              render: (item) => indexData.data.indexOf(item) + 1 + (page - 1) * perPage,
            },
            // { accessor: "product_type", title: t("NatureOfProduct") },
            { accessor: "category_name", title: t("Category") },
            { accessor: "product_name", title: t("Name") },
            { accessor: "barcode", title: t("Barcode") },
            // { accessor: "alternative_name", title: t("AlternativeName") },
            {
              accessor: "unit_name",
              title: t("Unit"),
              render: (item) => (
                <Text
                  component="a"
                  size="sm"
                  variant="subtle"
                  c="red.4"
                  onClick={() => {
                    setId(item.id);
                    setMeasurementDrawer(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.unit_name}
                </Text>
              ),
            },
            {
              accessor: "purchase_price",
              title: t("PurchasePrice"),
              textAlign: "center",
            },
            {
              accessor: "sales_price",
              title: t("SalesPrice"),
              textAlign: "center",
            },
            {
              accessor: "feature_image",
              textAlign: "center",
              title: t("Image"),
              render: (item) => {
                const [opened, setOpened] = useState(false);
                const autoplay = useRef(Autoplay({ delay: 2000 }));

                const images = [
                  item?.images?.feature_image ? `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${item?.images?.feature_image}` : null,
                  item?.images?.path_one ? `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${item?.images?.path_one}` : null,
                  item?.images?.path_two ? `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${item?.images?.path_two}` : null,
                  item?.images?.path_three ? `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${item?.images?.path_three}` : null,
                  item?.images?.path_four ? `${import.meta.env.VITE_IMAGE_GATEWAY_URL}/${item?.images?.path_four}` : null,
              ].filter(Boolean);

                return (
                  <>
                    <Image
                      mih={50}
                      mah={50}
                      fit="contain"
                      src={
                        images.length > 0
                          ? images[0]
                          : `https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
                              item.product_name
                            )}`
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpened(true)}
                    />

                    <Modal
                      opened={opened}
                      onClose={() => setOpened(false)}
                      size="lg"
                      centered
                      styles={{
                        content: { overflow: "hidden" }, // Ensure modal content doesn't overflow
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
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={img}
                                fit="contain"
                                style={{
                                  transition: "transform 0.3s ease-in-out",
                                  maxWidth: "100%", // Ensure image fits within the slide
                                  maxHeight: "100%",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.transform =
                                    "scale(1.2)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
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
            { accessor: "vat", title: t("Vat") },
            // { accessor: "average_price", title: t("AveragePrice"), textAlign : "center" },
            {
              accessor: "bonus_quantity",
              title: t("BonusQuantityTable"),
              textAlign: "center",
            },
            { accessor: "quantity", title: t("Quantity"), textAlign: "center" },
            {
              accessor: "quantity",
              title: t("RemainQuantity"),
              textAlign: "center",
            },
            { accessor: "brand_name", title: t("Brand"), hidden: !isBrand },
            { accessor: "grade_name", title: t("Grade"), hidden: !isGrade },
            { accessor: "color_name", title: t("Color"), hidden: !isColor },
            { accessor: "size_name", title: t("Size"), hidden: !isSize },
            { accessor: "model_name", title: t("Model"), hidden: !isModel },
            {
              accessor: "status",
              title: t("Status"),
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
                      handleSwtich(event, item);
                    }}
                  />
                </>
              ),
            },
            {
              accessor: "location",
              title: t("Location"),
              textAlign: "center",
              render: (item) => (
                <>
                  <SelectForm
                    tooltip={t("ChooseProductLocation")}
                    placeholder={t("ChooseProductLocation")}
                    required={true}
                    name={"location_id"}
                    form={form}
                    dropdownValue={locationData}
                    id={"location_id"}
                    searchable={true}
                    value={locationMap[item.id] || null}
                    changeValue={(value) => {
                      setLocationMap((prev) => ({
                        ...prev,
                        [item.id]: value,
                      }));
                    }}
                  />
                </>
              ),
            },
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
                    color="red.3"
                    mr={"4"}
                    onClick={() => {
                      dispatch(showEntityData("inventory/product/" + item.id));
                      setViewModal(true);
                    }}
                  >
                    {" "}
                    {t("View")}
                  </Button>
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
                      <Menu.Item
                        onClick={() => {
                          dispatch(setInsertType("update"));
                          dispatch(
                            editEntityData("inventory/product/" + item.id)
                          );
                          dispatch(setFormLoading(true));
                          navigate(`/inventory/product/${item.id}`);
                        }}
                      >
                        {t("Edit")}
                      </Menu.Item>
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
                            labels: { confirm: "Confirm", cancel: "Cancel" },
                            confirmProps: { color: "red.6" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => {
                              console.log("ok pressed");
                            },
                          });
                        }}
                        rightSection={
                          <IconTrashX
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        {t("Delete")}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              ),
            },
          ]}
          fetching={fetching || downloadStockXLS}
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

export default StockTable;
