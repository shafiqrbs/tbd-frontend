import React, {useEffect, useState, useCallback} from "react";
import {useOutletContext} from "react-router-dom";
import {
  Button,
  Flex,
  ActionIcon,
  Grid,
  Box,
  Group,
  Text,
  Tooltip,
  SegmentedControl,
  Center,
  Input,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
  IconDeviceFloppy,
  IconPercentage,
  IconSum,
  IconCurrency,
  IconBarcode,
  IconCoinMonero,
  IconSortAscendingNumbers,
  IconPlusMinus,
  IconPlus,
  IconShoppingBag,
  IconRefresh,
  IconDotsVertical,
} from "@tabler/icons-react";
import {hasLength, useForm} from "@mantine/form";
import {notifications, showNotification} from "@mantine/notifications";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import __SalesForm from "./__SalesForm.jsx";
import {DataTable} from "mantine-datatable";
import _ShortcutInvoice from "../../shortcut/_ShortcutInvoice";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import AddProductDrawer from "./drawer-form/AddProductDrawer.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import __GenericPosSalesForm from "./__GenericPosSalesForm";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import Navigation from "../common/Navigation.jsx";
import __PosSalesForm from "./__PosSalesForm.jsx";
import {useHotkeys} from "@mantine/hooks";
import SettingDrawer from "../common/SettingDrawer.jsx";

function _GenericPosForm({domainConfigData}) {
  // Constants
  const currencySymbol = domainConfigData?.inventory_config?.currency?.symbol;
  const domainId = domainConfigData?.inventory_config?.domain_id;
  const isSMSActive = domainConfigData?.inventory_config?.is_active_sms;
  const salesConfig = domainConfigData?.inventory_config?.config_sales;
  const id = domainConfigData?.id;
  const categoryDropDownData = getSettingCategoryDropdownData();

  // Hooks
  const {t, i18n} = useTranslation();
  const {isOnline, mainAreaHeight} = useOutletContext();
  const height = mainAreaHeight - 360;

  // State
  const [productSalesMode, setProductSalesMode] = useState("product");
  const [settingDrawer, setSettingDrawer] = useState(false);
  const [productDrawer, setProductDrawer] = useState(false);
  const [salesByBarcode, setSalesByBarcode] = useState(true);
  const [warehouseData, setWarehouseData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [unitType, setUnitType] = useState(null);
  const [product, setProduct] = useState(null);
  const [multiPrice, setMultiPrice] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [productDropdown, setProductDropdown] = useState([]);
  const [multiPriceDropdown, setMultiPriceDropdown] = useState([]);
  const [unitDropdown, setUnitDropdown] = useState([]);
  const [selectProductDetails, setSelectProductDetails] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadCardProducts, setLoadCardProducts] = useState(false);
  const [tempCardProducts, setTempCardProducts] = useState([]);
  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
  const [stockProductRestore, setStockProductRestore] = useState(false);

  // Data
  const warehouseDropdownData = getCoreWarehouseDropdownData();

  // Form setup
  const form = useForm({
    initialValues: {
      multi_price: "",
      price: "",
      sales_price: "",
      unit_id: "",
      quantity: "",
      bonus_quantity: "",
      percent: "",
      product_id: "",
      barcode: "",
      sub_total: "",
      warehouse_id: "",
      category_id: "",
      vendor_id: "",
    },
    validate: {
      product_id: (value, values) => {
        const isDigitsOnly = /^\d+$/.test(value);
        if (!isDigitsOnly && values.product_id) {
          return true;
        }
        return null;
      },
      quantity: (value, values) => {
        if (values.product_id) {
          const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
          if (!isNumberOrFractional) {
            return true;
          }
        }
        return null;
      },
      percent: (value, values) => {
        if (value && values.product_id) {
          const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
          if (!isNumberOrFractional) {
            return true;
          }
        }
        return null;
      },
      sales_price: (value, values) => {
        if (values.product_id) {
          const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
          if (!isNumberOrFractional) {
            return true;
          }
        }
        return null;
      },
    },
  });

  // Input group components
  const inputGroupCurrency = (
      <Text style={{textAlign: "right", width: "100%", paddingRight: 16}} color={"gray"}>
        {currencySymbol}
      </Text>
  );

  const inputGroupText = (
      <Text style={{textAlign: "right", width: "100%", paddingRight: 16}} color={"gray"}>
        {selectProductDetails?.unit_name}
      </Text>
  );

  // Effects
  useEffect(() => {
    const fetchVendors = async () => {
      await vendorDataStoreIntoLocalStorage();
      const coreVendors = localStorage.getItem("core-vendors");
      const parsedVendors = coreVendors ? JSON.parse(coreVendors) : [];

      if (parsedVendors && parsedVendors.length > 0) {
        const transformedData = parsedVendors.map((vendor) => ({
          label: `${vendor.mobile} -- ${vendor.name}`,
          value: String(vendor.id),
        }));
        setVendorsDropdownData(transformedData);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    if (stockProductRestore) {
      productsDataStoreIntoLocalStorage();
    }
  }, [stockProductRestore]);

  useEffect(() => {
    if (searchValue.length > 0) {
      const storedProducts = localStorage.getItem("core-products");
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

      const filteredProducts = localProducts.filter(
          (product) => product.product_nature !== "raw-materials"
      );

      const lowerCaseSearchTerm = searchValue.toLowerCase();
      const fieldsToSearch = ["product_name"];
      const productFilterData = filteredProducts.filter((product) =>
          fieldsToSearch.some(
              (field) =>
                  product[field] &&
                  String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
          )
      );

      const formattedProductData = productFilterData.map((product) => ({
        label: product.product_name || "",
        value: String(product.id),
      }));

      setProductDropdown(formattedProductData);
    } else {
      setProductDropdown([]);
    }
  }, [searchValue]);

  useEffect(() => {
    form.setFieldValue("price", form.values.multi_price);
    form.setFieldValue("sales_price", form.values.multi_price);
    setMultiPrice(form.values.multi_price);
    document.getElementById("quantity")?.focus();
  }, [form.values.multi_price]);

  useEffect(() => {
    form.setFieldValue("quantity", form.values.unit_id);
    setUnitType(form.values.unit_id);
  }, [form.values.unit_id]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const filteredProducts = localProducts.filter(
        (product) => product.id === Number(form.values.product_id)
    );

    if (filteredProducts.length > 0) {
      const selectedProduct = filteredProducts[0];
      setSelectProductDetails(selectedProduct);

      if (salesConfig?.is_multi_price === 1 && selectedProduct.multi_price) {
        const priceDropdown = selectedProduct.multi_price.map((price) => ({
          label: `${currencySymbol} ${price.price}`,
          value: String(price.price),
        }));
        setMultiPriceDropdown(priceDropdown);
      }

      if (salesConfig?.is_measurement_enable === 1 && selectedProduct.measurements) {
        const unitDropdown = selectedProduct.measurements.map((unit) => ({
          label: unit.unit_name,
          value: String(unit.quantity),
        }));
        setUnitDropdown(unitDropdown);
      }

      form.setFieldValue("price", selectedProduct.sales_price);
      form.setFieldValue("sales_price", selectedProduct.sales_price);

      if (salesConfig?.is_multi_price) {
        document.getElementById("multi_price")?.focus();
      } else {
        document.getElementById("quantity")?.focus();
      }
    } else {
      setSelectProductDetails(null);
      form.setFieldValue("price", "");
      form.setFieldValue("sales_price", "");
    }
  }, [form.values.product_id]);

  useEffect(() => {
    const quantity = Number(form.values.quantity);
    const salesPrice = Number(form.values.sales_price);

    if (!isNaN(quantity) && !isNaN(salesPrice) && quantity > 0 && salesPrice >= 0) {
      if (!salesConfig?.zero_stock) {
        showNotification({
          color: "pink",
          title: t("WeNotifyYouThat"),
          message: t("ZeroQuantityNotAllow"),
          autoClose: 1500,
          loading: true,
          withCloseButton: true,
          position: "top-center",
          style: {backgroundColor: "mistyrose"},
        });
      } else if (selectProductDetails) {
        setSelectProductDetails({
          ...selectProductDetails,
          sub_total: quantity * salesPrice,
          sales_price: salesPrice,
        });
        form.setFieldValue("sub_total", quantity * salesPrice);
      }
    }
  }, [form.values.quantity, form.values.sales_price]);

  useEffect(() => {
    if (form.values.quantity && form.values.price) {
      const discountAmount = (Number(form.values.price) * Number(form.values.percent)) / 100;
      const salesPrice = Number(form.values.price) - discountAmount;

      form.setFieldValue("sales_price", salesPrice.toString());
      form.setFieldValue("sub_total", (salesPrice * Number(form.values.quantity)).toString());
    }
  }, [form.values.percent]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
    const filteredProducts = localProducts.filter((product) => {
      if (categoryData) {
        return (
            product.product_nature !== "raw-materials" &&
            product.category_id === Number(categoryData) &&
            product.sales_price !== 0
        );
      }
      return product.product_nature !== "raw-materials";
    });

    setProducts(filteredProducts);

    const transformedProducts = filteredProducts.map((product) => ({
      label: `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.sales_price}`,
      value: String(product.id),
    }));
    setProductDropdown(transformedProducts);
  }, [categoryData]);

  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-sales-products");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);

  // Hotkeys
  useHotkeys([
    ["alt+n", () => document.getElementById("product_id")?.focus()],
    ["alt+r", () => form.reset()],
    ["alt+s", () => document.getElementById("EntityFormSubmit")?.click()],
  ]);

  // Helper functions
  const updateLocalStorageAndResetForm = useCallback((products) => {
    localStorage.setItem("temp-sales-products", JSON.stringify(products));
    setSearchValue("");
    setWarehouseData(null);
    setProduct(null);
    setMultiPrice(null);
    setUnitType(null);
    form.reset();
    document.getElementById("product_id")?.focus();
  }, [form]);

  const createProductFromValues = useCallback((product, values) => {
    return {
      product_id: product.id,
      display_name: product.display_name,
      sales_price: Number(values.sales_price),
      price: Number(values.price),
      percent: values.percent,
      stock: product.quantity,
      quantity: Number(values.quantity),
      unit_name: product.unit_name,
      purchase_price: product.purchase_price,
      sub_total: Number(values.quantity) * Number(values.sales_price),
      unit_id: product.unit_id,
      warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
      warehouse_name: values.warehouse_id
          ? warehouseDropdownData.find((warehouse) => warehouse.value === values.warehouse_id)?.label || null
          : null,
      bonus_quantity: Number(values.bonus_quantity) || 0,
    };
  }, [warehouseDropdownData]);

  const handleAddProductByProductId = useCallback((values, myCardProducts, localProducts) => {
    const addProducts = localProducts.reduce((acc, product) => {
      if (product.id === Number(values.product_id)) {
        acc.push({
          product_id: product.id,
          display_name: product.display_name,
          sales_price: Number(values.sales_price),
          price: Number(values.price),
          percent: values.percent,
          stock: product.quantity,
          quantity: Number(values.quantity),
          unit_name: product.unit_name,
          purchase_price: product.purchase_price,
          sub_total: Number(values.quantity) * Number(values.sales_price),
          unit_id: product.unit_id,
          warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
          warehouse_name: values.warehouse_id
              ? warehouseDropdownData.find((warehouse) => warehouse.value === values.warehouse_id)?.label || null
              : null,
          bonus_quantity: Number(values.bonus_quantity) || 0,
        });
      }
      return acc;
    }, myCardProducts);

    setLoadCardProducts(true);
    updateLocalStorageAndResetForm(addProducts);
  }, [updateLocalStorageAndResetForm, warehouseDropdownData]);

  const handleAddProductByBarcode = useCallback((values, myCardProducts, localProducts) => {
    const barcodeExists = localProducts.some(
        (product) => product.barcode === values.barcode
    );

    if (barcodeExists) {
      const addProducts = localProducts.reduce((acc, product) => {
        if (String(product.barcode) === String(values.barcode)) {
          acc.push(createProductFromValues(product, values));
        }
        return acc;
      }, myCardProducts);

      updateLocalStorageAndResetForm(addProducts);
    } else {
      notifications.show({
        loading: true,
        color: "red",
        title: "Product not found with this barcode",
        message: "Data will be loaded in 3 seconds, you cannot close this yet",
        autoClose: 1000,
        withCloseButton: true,
      });
    }
  }, [createProductFromValues, updateLocalStorageAndResetForm]);

  const handleSubmit = useCallback((values) => {
    if (!values.barcode && !values.product_id) {
      form.setFieldError("barcode", true);
      form.setFieldError("product_id", true);
      return;
    }

    const cardProducts = localStorage.getItem("temp-sales-products");
    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    if (values.product_id && !values.barcode) {
      if (!salesConfig?.zero_stock) {
        showNotification({
          color: "pink",
          title: t("WeNotifyYouThat"),
          message: t("ZeroQuantityNotAllow"),
          autoClose: 1500,
          loading: true,
          withCloseButton: true,
          position: "top-center",
          style: {backgroundColor: "mistyrose"},
        });
      } else {
        handleAddProductByProductId(values, myCardProducts, localProducts);
      }
    } else if (!values.product_id && values.barcode) {
      handleAddProductByBarcode(values, myCardProducts, localProducts);
    }
  }, [form, handleAddProductByBarcode, handleAddProductByProductId, salesConfig?.zero_stock, t]);

  return (
      <Box>
        <Grid columns={24} gutter={{base: 8}}>
          <Grid.Col span={1}>
            <Navigation/>
          </Grid.Col>
          <Grid.Col span={7}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
                <Box>
                  <Box mb={"xs"}>
                    <Grid columns={12} gutter={{base: 2}}>
                      <Grid.Col span={7}>
                        <Text fz="md" fw={500} className={classes.cardTitle}>
                          {t("Customer Sales Invoice")}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={5} align="center">
                        <Group justify="flex-end" align="center" gap={4}>
                          {salesByBarcode && (
                              <SegmentedControl
                                  size="xs"
                                  styles={{
                                    label: {color: "#140d05"},
                                  }}
                                  className={genericClass.genericHighlightedBox}
                                  withItemsBorders={false}
                                  fullWidth
                                  color={"#f8eedf"}
                                  value={productSalesMode}
                                  onChange={setProductSalesMode}
                                  data={[
                                    {
                                      label: (
                                          <Center pl={"8"} pr={"8"} style={{gap: 10}}>
                                            <IconCoinMonero
                                                height={"18"}
                                                width={"18"}
                                                stroke={1.5}
                                            />
                                          </Center>
                                      ),
                                      value: "product",
                                    },
                                    {
                                      label: (
                                          <Center pl={"8"} pr={"8"} style={{gap: 10}}>
                                            <IconBarcode
                                                height={"18"}
                                                width={"18"}
                                                stroke={1.5}
                                            />
                                          </Center>
                                      ),
                                      value: "barcode",
                                    },
                                  ]}
                              />
                          )}
                          <Tooltip
                              multiline
                              bg={"#905923"}
                              position="top"
                              withArrow
                              ta={"center"}
                              transitionProps={{duration: 200}}
                              label={t("Settings")}
                          >
                            <ActionIcon
                                radius={"xl"}
                                variant="transparent"
                                size={"md"}
                                color="gray"
                                mt={"1"}
                                aria-label="Settings"
                                onClick={() => setSettingDrawer(true)}
                            >
                              <IconDotsVertical
                                  style={{width: "100%", height: "70%"}}
                                  stroke={1.5}
                              />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </Box>
                  <Flex
                      mih={height + 224}
                      direction="column"
                      gap={0}
                      bg="white"
                      wrap="wrap"
                      justify="flex-end"
                      align="flex-end"
                  >
                    <Box
                        pl={`8`}
                        pr={8}
                        mb={"xs"}
                        className={"borderRadiusAll"}
                        w={"100%"}
                    >
                      <Box
                          h={(() => {
                            let availableHeight = height - 118;

                            if (productSalesMode === "barcode") {
                              if (
                                  !salesConfig?.search_by_vendor &&
                                  !salesConfig?.search_by_warehouse &&
                                  !salesConfig?.search_by_category
                              ) {
                                availableHeight += 260;
                              } else {
                                availableHeight += 264;
                              }
                            } else {
                              if (!salesConfig?.search_by_vendor) availableHeight += 40;
                              if (!salesConfig?.search_by_warehouse) availableHeight += 40;
                              if (!salesConfig?.search_by_category) availableHeight += 40;
                            }

                            return availableHeight;
                          })()}
                      >
                        {salesConfig?.show_product === 1 && (
                            <DataTable
                                classNames={{
                                  root: tableCss.root,
                                  table: tableCss.table,
                                  header: tableCss.header,
                                  footer: tableCss.footer,
                                  pagination: tableCss.pagination,
                                }}
                                records={products}
                                columns={[
                                  {
                                    accessor: "display_name",
                                    title: t("Product"),
                                    render: (data, index) => (
                                        <Text fz={11} fw={400}>
                                          {index + 1}. {data.display_name}
                                        </Text>
                                    ),
                                  },
                                  {
                                    accessor: "qty",
                                    width: 200,
                                    title: (
                                        <Group
                                            justify={"flex-end"}
                                            spacing="xs"
                                            noWrap
                                            pl={"sm"}
                                            ml={"sm"}
                                        >
                                          <Box pl={"4"}>{t("")}</Box>
                                          <ActionIcon
                                              mr={"sm"}
                                              radius="xl"
                                              variant="transparent"
                                              color="grey"
                                              size="xs"
                                              onClick={() => {
                                              }}
                                          >
                                            <IconRefresh
                                                style={{width: "100%", height: "100%"}}
                                                stroke={1.5}
                                            />
                                          </ActionIcon>
                                        </Group>
                                    ),
                                    textAlign: "right",
                                    render: (data) => (
                                        <Group
                                            wrap="nowrap"
                                            w="100%"
                                            gap={0}
                                            justify="flex-end"
                                            align="center"
                                            mx="auto"
                                        >
                                          <Text fz={11} fw={400} pr={"xs"} w={70}>
                                            {currencySymbol} {data.sales_price}
                                          </Text>
                                          <Input
                                              styles={{
                                                input: {
                                                  fontSize: "var(--mantine-font-size-xs)",
                                                  fontWeight: 300,
                                                  lineHeight: 2,
                                                  textAlign: "center",
                                                  borderRadius: 0,
                                                  borderColor: "#905923",
                                                  borderTopLeftRadius:
                                                      "var(--mantine-radius-sm)",
                                                  borderBottomLeftRadius:
                                                      "var(--mantine-radius-sm)",
                                                },
                                                placeholder: {
                                                  fontSize: "var(--mantine-font-size-xs)",
                                                  fontWeight: 300,
                                                },
                                              }}
                                              size="xxs"
                                              w="50"
                                              type={"number"}
                                              tooltip={""}
                                              label={""}
                                              value={productQuantities[data.id] || ""}
                                              onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setProductQuantities((prev) => ({
                                                  ...prev,
                                                  [data.id]: value,
                                                }));
                                              }}
                                              required={false}
                                              nextField={"credit_limit"}
                                              name={"quantity"}
                                              id={"quantity" + data.id}
                                          />
                                          <Button
                                              size="compact-xs"
                                              color={"#f8eedf"}
                                              radius={0}
                                              w="50"
                                              styles={{
                                                root: {
                                                  height: "26px",
                                                  borderRadius: 0,
                                                  borderTopColor: "#905923",
                                                  borderBottomColor: "#905923",
                                                },
                                              }}
                                              onClick={() => {
                                              }}
                                          >
                                            <Text fz={9} fw={400} c={"black"}>
                                              {data.unit_name}
                                            </Text>
                                          </Button>
                                          <Button
                                              size="compact-xs"
                                              className={genericClass.invoiceAdd}
                                              radius={0}
                                              w="30"
                                              styles={{
                                                root: {
                                                  height: "26px",
                                                  borderRadius: 0,
                                                  borderTopRightRadius:
                                                      "var(--mantine-radius-sm)",
                                                  borderBottomRightRadius:
                                                      "var(--mantine-radius-sm)",
                                                },
                                              }}
                                              onClick={() => {
                                                const quantity = productQuantities[data.id];
                                                if (quantity && Number(quantity) > 0) {
                                                  const cardProducts = localStorage.getItem(
                                                      "temp-sales-products"
                                                  );
                                                  const myCardProducts = cardProducts
                                                      ? JSON.parse(cardProducts)
                                                      : [];

                                                  const productToAdd = {
                                                    product_id: data.id,
                                                    display_name: data.display_name,
                                                    sales_price: data.sales_price,
                                                    price: data.sales_price,
                                                    percent: "",
                                                    stock: data.quantity,
                                                    quantity: Number(quantity),
                                                    unit_name: data.unit_name,
                                                    purchase_price: data.purchase_price,
                                                    sub_total:
                                                        Number(quantity) *
                                                        Number(data.sales_price),
                                                    unit_id: data.unit_id,
                                                    warehouse_id: form.values.warehouse_id
                                                        ? Number(form.values.warehouse_id)
                                                        : null,
                                                    warehouse_name: form.values.warehouse_id
                                                        ? warehouseDropdownData.find(
                                                        (warehouse) =>
                                                            warehouse.value ===
                                                            form.values.warehouse_id
                                                    )?.label || null
                                                        : null,
                                                    bonus_quantity: 0,
                                                  };

                                                  myCardProducts.push(productToAdd);

                                                  localStorage.setItem(
                                                      "temp-sales-products",
                                                      JSON.stringify(myCardProducts)
                                                  );
                                                  setLoadCardProducts(true);
                                                  setProductQuantities((prev) => ({
                                                    ...prev,
                                                    [data.id]: "",
                                                  }));
                                                } else {
                                                  notifications.show({
                                                    color: "red",
                                                    title: t("InvalidQuantity"),
                                                    message: t("PleaseEnterValidQuantity"),
                                                    autoClose: 1500,
                                                    withCloseButton: true,
                                                  });
                                                }
                                              }}
                                          >
                                            <Flex direction={`column`} gap={0}>
                                              <IconShoppingBag size={12}/>
                                            </Flex>
                                          </Button>
                                        </Group>
                                    ),
                                  },
                                ]}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={"100%"}
                                scrollAreaProps={{
                                  scrollbarSize: 8,
                                }}
                            />
                        )}
                      </Box>
                      <Box className="borderRadiusAll">
                        {productSalesMode === "product" && (
                            <Box>
                              {salesConfig?.search_by_vendor === 1 && (
                                  <Box mt={"8"}>
                                    <SelectForm
                                        tooltip={t("PurchaseValidateMessage")}
                                        label=""
                                        placeholder={t("Vendor")}
                                        required={false}
                                        nextField={"warehouse_id"}
                                        name={"vendor_id"}
                                        form={form}
                                        dropdownValue={vendorsDropdownData}
                                        id={"purchase_vendor_id"}
                                        mt={1}
                                        searchable={true}
                                        value={vendorData}
                                        changeValue={setVendorData}
                                    />
                                  </Box>
                              )}
                              {salesConfig?.search_by_warehouse === 1 && (
                                  <Box mt={"4"}>
                                    <SelectForm
                                        tooltip={t("Warehouse")}
                                        label=""
                                        placeholder={t("Warehouse")}
                                        required={false}
                                        nextField={"category_id"}
                                        name={"warehouse_id"}
                                        form={form}
                                        dropdownValue={warehouseDropdownData}
                                        id={"warehouse_id"}
                                        mt={1}
                                        searchable={true}
                                        value={warehouseData}
                                        changeValue={setWarehouseData}
                                    />
                                  </Box>
                              )}
                              {salesConfig?.search_by_category === 1 && (
                                  <Box mt={"4"}>
                                    <SelectForm
                                        tooltip={t("ChooseCategory")}
                                        label={""}
                                        placeholder={t("ChooseCategory")}
                                        required={true}
                                        nextField={"product_id"}
                                        name={"category_id"}
                                        form={form}
                                        dropdownValue={categoryDropDownData}
                                        id={"category_id"}
                                        searchable={true}
                                        value={categoryData}
                                        changeValue={setCategoryData}
                                        comboboxProps={{withinPortal: false}}
                                    />
                                  </Box>
                              )}
                            </Box>
                        )}
                        {productSalesMode === "product" && (
                            <Box
                                p={"xs"}
                                mt={"4"}
                                className={genericClass.genericHighlightedBox}
                                ml={"-xs"}
                                mr={-8}
                            >
                              <Grid gutter={{base: 6}}>
                                <Grid.Col span={11}>
                                  <Box>
                                    <SelectForm
                                        tooltip={t("ChooseProduct")}
                                        label={""}
                                        placeholder={t("ChooseProduct")}
                                        required={true}
                                        nextField={"quantity"}
                                        name={"product_id"}
                                        form={form}
                                        dropdownValue={productDropdown}
                                        id={"product_id"}
                                        searchable={true}
                                        value={product}
                                        changeValue={(val) => setProduct(val)}
                                        comboboxProps={{withinPortal: false}}
                                    />
                                  </Box>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                  <Box>
                                    <Tooltip
                                        multiline
                                        className={genericClass.genericPrimaryBg}
                                        position="top"
                                        withArrow
                                        ta={"center"}
                                        offset={{crossAxis: "-50", mainAxis: "5"}}
                                        transitionProps={{duration: 200}}
                                        label={t("InstantProductCreate")}
                                    >
                                      <ActionIcon
                                          variant="outline"
                                          radius="xl"
                                          size={"sm"}
                                          mt={"8"}
                                          ml={"8"}
                                          color="white"
                                          aria-label="Settings"
                                          bg={"#905923"}
                                          onClick={() => setProductDrawer(true)}
                                      >
                                        <IconPlus stroke={1}/>
                                      </ActionIcon>
                                    </Tooltip>
                                  </Box>
                                </Grid.Col>
                              </Grid>
                            </Box>
                        )}
                        {productSalesMode === "barcode" && (
                            <Box
                                p={"xs"}
                                mt={"8"}
                                className={genericClass.genericHighlightedBox}
                                ml={"-xs"}
                                mr={-8}
                            >
                              <InputNumberForm
                                  tooltip={t("BarcodeValidateMessage")}
                                  label=""
                                  placeholder={t("Barcode")}
                                  required={true}
                                  nextField={""}
                                  form={form}
                                  name={"barcode"}
                                  id={"barcode"}
                                  leftSection={<IconBarcode size={16} opacity={0.5}/>}
                              />
                            </Box>
                        )}
                        {productSalesMode === "product" && (
                            <Box
                                ml={"-xs"}
                                p={"xs"}
                                mr={-8}
                                className={genericClass.genericBackground}
                            >
                              <Box mt={"4"}>
                                <Grid columns={12} gutter={{base: 8}}>
                                  <Grid.Col span={4}>
                                    {salesConfig?.is_multi_price == 1 && (
                                        <SelectForm
                                            tooltip={t("MultiPriceValidateMessage")}
                                            label=""
                                            placeholder={t("Price")}
                                            required={false}
                                            nextField={""}
                                            name={"multi_price"}
                                            form={form}
                                            dropdownValue={multiPriceDropdown}
                                            id={"multi_price"}
                                            mt={1}
                                            searchable={true}
                                            value={multiPrice}
                                            changeValue={setMultiPrice}
                                        />
                                    )}
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <InputButtonForm
                                        type="number"
                                        tooltip=""
                                        label=""
                                        placeholder={t("Price")}
                                        required={true}
                                        form={form}
                                        name={"price"}
                                        id={"price"}
                                        rightSection={inputGroupCurrency}
                                        leftSection={
                                          <IconCoinMonero size={16} opacity={0.5}/>
                                        }
                                        rightSectionWidth={30}
                                        disabled={true}
                                    />
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <InputNumberForm
                                        tooltip={t("SalesPriceValidateMessage")}
                                        label=""
                                        placeholder={t("SalesPrice")}
                                        required={true}
                                        nextField={"EntityFormSubmit"}
                                        form={form}
                                        name={"sales_price"}
                                        id={"sales_price"}
                                        disabled={!!form.values.percent}
                                        leftSection={
                                          <IconPlusMinus size={16} opacity={0.5}/>
                                        }
                                        rightIcon={<IconCurrency size={16} opacity={0.5}/>}
                                    />
                                  </Grid.Col>
                                </Grid>
                              </Box>
                              <Box>
                                <Grid columns={12} gutter={{base: 8}}>
                                  <Grid.Col span={4}>
                                    {salesConfig?.is_measurement_enable === 1 && (
                                        <SelectForm
                                            tooltip={t("UnitValidateMessage")}
                                            label=""
                                            placeholder={t("Unit")}
                                            required={false}
                                            nextField={""}
                                            name={"unit_id"}
                                            form={form}
                                            dropdownValue={unitDropdown}
                                            id={"unit_id"}
                                            mt={1}
                                            searchable={true}
                                            value={unitType}
                                            changeValue={setUnitType}
                                        />
                                    )}
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <InputButtonForm
                                        type="number"
                                        tooltip={t("PercentValidateMessage")}
                                        label=""
                                        placeholder={t("Quantity")}
                                        required={true}
                                        nextField={"percent"}
                                        form={form}
                                        name={"quantity"}
                                        id={"quantity"}
                                        leftSection={
                                          <IconSortAscendingNumbers
                                              size={16}
                                              opacity={0.5}
                                          />
                                        }
                                        rightSection={inputGroupText}
                                        rightSectionWidth={50}
                                    />
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <InputButtonForm
                                        type="number"
                                        tooltip={t("PercentValidateMessage")}
                                        label=""
                                        placeholder={t("BonusQuantity")}
                                        required={true}
                                        nextField={"percent"}
                                        form={form}
                                        name={"bonus_quantity"}
                                        id={"bonus_quantity"}
                                        leftSection={
                                          <IconSortAscendingNumbers
                                              size={16}
                                              opacity={0.5}
                                          />
                                        }
                                        rightSection={inputGroupText}
                                        rightSectionWidth={50}
                                    />
                                  </Grid.Col>
                                </Grid>
                              </Box>
                              <Box>
                                <Grid columns={12} gutter={{base: 8}}>
                                  <Grid.Col span={4}></Grid.Col>
                                  <Grid.Col span={4}>
                                    <InputNumberForm
                                        tooltip={t("PercentValidateMessage")}
                                        label=""
                                        placeholder={t("Percent")}
                                        required={true}
                                        nextField={
                                          form.values.percent
                                              ? "EntityFormSubmit"
                                              : "sales_price"
                                        }
                                        form={form}
                                        name={"percent"}
                                        id={"percent"}
                                        leftSection={
                                          <IconPercentage size={16} opacity={0.5}/>
                                        }
                                        rightIcon={<IconCurrency size={16} opacity={0.5}/>}
                                        closeIcon={true}
                                    />
                                  </Grid.Col>
                                  <Grid.Col span={4}>
                                    <Box style={{display: "none"}}>
                                      <InputButtonForm
                                          tooltip=""
                                          label=""
                                          type=""
                                          placeholder={t("SubTotal")}
                                          required={true}
                                          nextField={"EntityFormSubmit"}
                                          form={form}
                                          name={"sub_total"}
                                          id={"sub_total"}
                                          leftSection={
                                            <IconSum size={16} opacity={0.5}/>
                                          }
                                          rightSection={inputGroupCurrency}
                                          disabled={
                                            selectProductDetails &&
                                            selectProductDetails.sub_total
                                          }
                                          closeIcon={false}
                                      />
                                    </Box>
                                    <Text ta="right" mt={"8"}>
                                      {currencySymbol}{" "}
                                      {selectProductDetails
                                          ? selectProductDetails.sub_total
                                          : 0}
                                    </Text>
                                  </Grid.Col>
                                </Grid>
                              </Box>
                            </Box>
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </Box>
                <Box mb="xs">
                  <Grid
                      className={genericClass.genericBackground}
                      columns={12}
                      justify="space-between"
                      align="center"
                  >
                    <Grid.Col span={6}>
                      <Box pl={"xs"}>
                        <ActionIcon
                            variant="transparent"
                            size={"lg"}
                            color="grey.6"
                            mt={"1"}
                            onClick={() => {
                            }}
                        >
                          <IconRefresh
                              style={{width: "100%", height: "70%"}}
                              stroke={1.5}
                          />
                        </ActionIcon>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Box pr={"xs"}>
                        <Button
                            size="sm"
                            className={genericClass.invoiceAdd}
                            type="submit"
                            mt={0}
                            mr={"xs"}
                            w={"100%"}
                            leftSection={<IconDeviceFloppy size={16}/>}
                        >
                          <Flex direction={`column`} gap={0}>
                            <Text fz={12} fw={400}>
                              {t("Add")}
                            </Text>
                          </Flex>
                        </Button>
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Box>
              </Box>
            </form>
          </Grid.Col>
          <Grid.Col span={16}>
            <__PosSalesForm
                currencySymbol={currencySymbol}
                domainId={domainId}
                isSMSActive={isSMSActive}
                is_zero_receive_allow={salesConfig?.is_zero_receive_allow}
                tempCardProducts={tempCardProducts}
                setLoadCardProducts={setLoadCardProducts}
                setTempCardProducts={setTempCardProducts}
            />
          </Grid.Col>
        </Grid>
        {settingDrawer && (
            <SettingDrawer
                settingDrawer={settingDrawer}
                setSettingDrawer={setSettingDrawer}
                module={"Sales"}
                domainConfigData={domainConfigData}
                id={id}
            />
        )}
        {productDrawer && (
            <AddProductDrawer
                productDrawer={productDrawer}
                setProductDrawer={setProductDrawer}
                setStockProductRestore={setStockProductRestore}
                focusField={"product_id"}
                fieldPrefix="sales_"
            />
        )}
      </Box>
  );
}

export default _GenericPosForm;