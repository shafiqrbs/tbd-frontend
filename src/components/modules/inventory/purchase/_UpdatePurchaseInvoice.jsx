import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  ActionIcon,
  TextInput,
  Grid,
  Box,
  Group,
  Text,
  SegmentedControl,
  Center,
  Tooltip,
  Flex,
  Input,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconSum,
  IconX,
  IconBarcode,
  IconSortAscendingNumbers,
  IconCoinMonero,
  IconDotsVertical,
  IconRefresh,
  IconPlus,
  IconPlusMinus,
  IconCurrency,
  IconPercentage,
  IconShoppingBag,
} from "@tabler/icons-react";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import Navigation from "../common/Navigation.jsx";

import { DataTable } from "mantine-datatable";
import ShortcutInvoice from "../../shortcut/ShortcutInvoice.jsx";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import SettingDrawer from "../common/SettingDrawer.jsx";
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer.jsx";
import __PosPurchaseUpdateForm from "./__PosPurchaseUpdateForm.jsx";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";

function _UpdatePurchaseInvoice(props) {
  const {
    currencySymbol,
    isPurchaseByPurchasePrice,
    editedData,
    isWarehouse,
    domainId,
    isSMSActive,
  } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 360; //TabList height 104
  const [fetching, setFetching] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [productDropdown, setProductDropdown] = useState([]);

  const [tempCardProducts, setTempCardProducts] = useState([]);
  const [loadCardProducts, setLoadCardProducts] = useState(false);

  /*get warehouse dropdown data*/
  let warehouseDropdownData = getCoreWarehouseDropdownData();
  const [warehouseData, setWarehouseData] = useState(null);

  const [stockProductRestore, setStockProductRestore] = useState(false);
  useEffect(() => {
    if (stockProductRestore) {
      const local = productsDataStoreIntoLocalStorage();
    }
  }, [stockProductRestore]);

  useEffect(() => {
    setTempCardProducts(
      editedData?.purchase_items ? editedData.purchase_items : []
    );
    setLoadCardProducts(false);
  }, []);

  useEffect(() => {
    if (searchValue.length > 0) {
      const storedProducts = localStorage.getItem("core-products");
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

      // Filter products where product_nature is not 'post-production'
      const filteredProducts = localProducts.filter(
        (product) => product.product_nature !== "post-production"
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
      const formattedProductData = productFilterData.map((type) => ({
        label: type.product_name,
        value: String(type.id),
      }));

      setProductDropdown(formattedProductData);
    } else {
      setProductDropdown([]);
    }
  }, [searchValue]);

  /**
   * Adds a product to a collection based on ID, updates the local storage and resets the form
   */
  function handleAddProductByProductId(values, myCardProducts, localProducts) {
    const addProducts = localProducts.reduce((acc, product) => {
      if (product.id === Number(values.product_id)) {
        acc.push({
          product_id: product.id,
          display_name: product.display_name,
          quantity: Number(values.quantity),
          unit_name: product.unit_name,
          purchase_price: Number(values.purchase_price),
          sub_total: Number(values.sub_total),
          sales_price: Number(product.sales_price),
          warehouse_id: values.warehouse_id
            ? Number(values.warehouse_id)
            : null,
          warehouse_name: values.warehouse_id
            ? warehouseDropdownData.find(
                (warehouse) => warehouse.value === values.warehouse_id
              ).label
            : null,
          bonus_quantity: values.bonus_quantity,
        });
      }
      return acc;
    }, myCardProducts);
    setLoadCardProducts(true);
    updateLocalStorageAndResetForm(addProducts, "productId");
  }

  /**
   * Adds a product to a collection based on BARCODE, updates the local storage and resets the form
   */
  function handleAddProductByBarcode(values, myCardProducts, localProducts) {
    const barcodeExists = localProducts.some(
      (product) => product.barcode === values.barcode
    );

    if (barcodeExists) {
      const addProducts = localProducts.reduce(
        (acc, product) => {
          if (String(product.barcode) === String(values.barcode)) {
            acc = [...acc, createProductFromValues(product, values)];
          }
          return acc;
        },
        [...myCardProducts]
      );

      updateLocalStorageAndResetForm(addProducts, "barcode");
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
  }

  /**
   * Updates local storage with new products, resets form, and sets focus on the product search.
   */
  function updateLocalStorageAndResetForm(addProducts, type) {
    setTempCardProducts(addProducts);
    setSearchValue("");
    form.reset();
    setLoadCardProducts(true);
    if (type == "productId") {
      document.getElementById("product_id").focus();
    } else {
      document.getElementById("barcode").focus();
    }
  }

  function createProductFromValues(product, values) {
    return {
      product_id: product.id,
      display_name: product.display_name,
      quantity: 1,
      unit_name: product.unit_name,
      purchase_price: product.purchase_price,
      sub_total: Number(product.purchase_price),
      sales_price: Number(product.sales_price),
      warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
      warehouse_name: values.warehouse_id
        ? warehouseDropdownData.find(
            (warehouse) => warehouse.value === values.warehouse_id
          ).label
        : null,
      bonus_quantity: values.bonus_quantity,
    };
  }

  const form = useForm({
    initialValues: {
      product_id: "",
      price: "",
      purchase_price: "",
      barcode: "",
      sub_total: "",
      quantity: "",
      warehouse_id: "",
      bonus_quantity: "",
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
      purchase_price: (value, values) => {
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

  /*START PRODUCT SELECTED BY PRODUCT ID*/
  const [selectProductDetails, setSelectProductDetails] = useState("");
  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const filteredProducts = localProducts.filter(
      (product) => product.id === Number(form.values.product_id)
    );
    if (filteredProducts.length > 0) {
      const selectedProduct = filteredProducts[0];
      setSelectProductDetails(selectedProduct);

      form.setFieldValue("price", selectedProduct.sales_price);
      form.setFieldValue("sales_price", selectedProduct.sales_price);
      form.setFieldValue("purchase_price", selectedProduct.purchase_price);
      document.getElementById("quantity").focus();
    } else {
      setSelectProductDetails(null);
      form.setFieldValue("price", "");
      form.setFieldValue("sales_price", "");
      form.setFieldValue("purchase_price", "");
    }
  }, [form.values.product_id]);
  /*END PRODUCT SELECTED BY PRODUCT ID*/

  /*START QUANTITY AND PURCHASE PRICE WISE SUB TOTAL*/
  useEffect(() => {
    const quantity = Number(form.values.quantity);
    const purchase_price = Number(form.values.purchase_price);

    if (
      !isNaN(quantity) &&
      !isNaN(purchase_price) &&
      quantity > 0 &&
      purchase_price >= 0
    ) {
      setSelectProductDetails((prevDetails) => ({
        ...prevDetails,
        sub_total: quantity * purchase_price,
      }));
      form.setFieldValue("sub_total", quantity * purchase_price);
    }
  }, [form.values.quantity, form.values.purchase_price]);
  /*END QUANTITY AND PURCHASE PRICE WISE SUB TOTAL*/

  /*START SUBTOTAL WISE PURCHASE PRICE*/
  useEffect(() => {
    const quantity = Number(form.values.quantity);
    const subTotal = Number(form.values.sub_total);

    if (!isNaN(quantity) && !isNaN(subTotal) && quantity > 0 && subTotal >= 0) {
      setSelectProductDetails((prevDetails) => ({
        ...prevDetails,
        purchase_price: subTotal / quantity,
      }));
      form.setFieldValue("purchase_price", subTotal / quantity);
    }
  }, [form.values.sub_total]);
  /*END SUBTOTAL WISE PURCHASE PRICE*/

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("product_id").focus();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );

  const inputGroupText = (
    <Text
      style={{ textAlign: "right", width: "100%", paddingRight: 16 }}
      color={"gray"}
    >
      {selectProductDetails && selectProductDetails.unit_name}
    </Text>
  );

  const inputGroupCurrency = (
    <Text
      style={{ textAlign: "right", width: "100%", paddingRight: 16 }}
      color={"gray"}
    >
      {currencySymbol}
    </Text>
  );
  //unit type hook
  const [unitType, setUnitType] = useState(null);

  //product hook
  const [product, setProduct] = useState(null);

  //product multi price hook
  const [multiPrice, setMultiPrice] = useState(null);
  //segmented control
  const [switchValue, setSwitchValue] = useState("product");

  //setting drawer control
  const [settingDrawer, setSettingDrawer] = useState(false);

  //product drawer control
  const [productDrawer, setProductDrawer] = useState(false);

  //sales by barcode comes from backend now static value
  const [salesByBarcode, setSalesByBarcode] = useState(true);

  //category hook
  const [categoryData, setCategoryData] = useState(null);

  //products hook
  const [products, setProducts] = useState([]);
  // adding product from table
  const [productQuantities, setProductQuantities] = useState({});

  //product filter based on category id and set the dropdown value for product dropdown
  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
    const filteredProducts = localProducts.filter((product) => {
      if (categoryData) {
        return (
          product.product_nature !== "raw-materials" &&
          product.category_id === Number(categoryData) &&
          product.purchase_price !== 0
        );
      }
      return product.product_nature !== "raw-materials";
    });

    setProducts(filteredProducts);

    // Transform product for dropdown
    const transformedProducts = filteredProducts.map((product) => ({
      label: `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.purchase_price}`,
      value: String(product.id),
    }));
    setProductDropdown(transformedProducts);
  }, [categoryData]);
  //vendor hook
  const [vendorData, setVendorData] = useState(null);
  //vendor dropdowndata
  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
  useEffect(() => {
    const fetchVendors = async () => {
      await vendorDataStoreIntoLocalStorage();
      let coreVendors = localStorage.getItem("core-vendors");
      coreVendors = coreVendors ? JSON.parse(coreVendors) : [];

      if (coreVendors && coreVendors.length > 0) {
        const transformedData = coreVendors.map((type) => {
          return {
            label: type.mobile + " -- " + type.name,
            value: String(type.id),
          };
        });
        setVendorsDropdownData(transformedData);
      }
    };
    fetchVendors();
  }, []);

  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={1}>
          <Navigation />
        </Grid.Col>
        <Grid.Col span={7}>
          <form
            onSubmit={form.onSubmit((values) => {
              if (!values.barcode && !values.product_id) {
                form.setFieldError("barcode", true);
                form.setFieldError("product_id", true);
                isWarehouse && form.setFieldError("warehouse_id", true);
                setTimeout(() => {}, 1000);
              } else {
                const cardProducts = localStorage.getItem(
                  "temp-purchase-products"
                );
                const myCardProducts = cardProducts
                  ? JSON.parse(cardProducts)
                  : [];
                const storedProducts = localStorage.getItem("core-products");
                const localProducts = storedProducts
                  ? JSON.parse(storedProducts)
                  : [];

                if (values.product_id && !values.barcode) {
                  handleAddProductByProductId(
                    values,
                    myCardProducts,
                    localProducts
                  );
                } else if (!values.product_id && values.barcode) {
                  handleAddProductByBarcode(
                    values,
                    myCardProducts,
                    localProducts
                  );
                }
              }
            })}
          >
            <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
              <Box>
                <Box mb={"xs"}>
                  <Grid columns={12} gutter={{ base: 2 }}>
                    <Grid.Col span={7}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("Customer Purchase Invoice")}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={5} align="center">
                      <Group justify="flex-end" align="center" gap={4}>
                        {salesByBarcode && (
                          <SegmentedControl
                            size="xs"
                            styles={{
                              label: { color: "#140d05" },
                            }}
                            className={genericClass.genericHighlightedBox}
                            withItemsBorders={false}
                            fullWidth
                            color={"#f8eedf"}
                            value={switchValue}
                            onChange={setSwitchValue}
                            data={[
                              {
                                label: (
                                  <Center pl={"8"} pr={"8"} style={{ gap: 10 }}>
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
                                  <Center pl={"8"} pr={"8"} style={{ gap: 10 }}>
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
                          transitionProps={{ duration: 200 }}
                          label={t("Settings")}
                        >
                          <ActionIcon
                            radius={"xl"}
                            variant="transparent"
                            size={"md"}
                            color="gray"
                            mt={"1"}
                            aria-label="Settings"
                            onClick={() => {
                              setSettingDrawer(true);
                            }}
                          >
                            <IconDotsVertical
                              style={{ width: "100%", height: "70%" }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Box>
                <Box
                  pl={`8`}
                  pr={8}
                  mb={"xs"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Box mt={switchValue === "product" ? "xs" : "xs"}>
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
                                onClick={() => {}}
                              >
                                <IconRefresh
                                  style={{ width: "100%", height: "100%" }}
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
                                {currencySymbol} {data.purchase_price}
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
                                id={"quantity"}
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
                                onClick={() => {}}
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
                                      "temp-purchase-products"
                                    );
                                    const myCardProducts = cardProducts
                                      ? JSON.parse(cardProducts)
                                      : [];

                                    const productToAdd = {
                                      product_id: data.id,
                                      display_name: data.display_name,
                                      quantity: quantity,
                                      unit_name: data.unit_name,
                                      purchase_price: Number(
                                        data.purchase_price
                                      ),
                                      sub_total:
                                        Number(quantity) *
                                        Number(data.purchase_price),
                                      sales_price: Number(data.sales_price),
                                      warehouse_id: form.values.warehouse_id
                                        ? Number(form.values.warehouse_id)
                                        : null,
                                      warehouse_name: form.values.warehouse_id
                                        ? warehouseDropdownData.find(
                                            (warehouse) =>
                                              warehouse.value ===
                                              form.values.warehouse_id
                                          ).label
                                        : null,
                                      bonus_quantity:
                                        form.values.bonus_quantity,
                                    };

                                    // Add to array
                                    myCardProducts.push(productToAdd);

                                    // Update localStorage
                                    localStorage.setItem(
                                      "temp-purchase-products",
                                      JSON.stringify(myCardProducts)
                                    );

                                    // Update both state variables
                                    setTempCardProducts(myCardProducts);  // Add this line
                                    setLoadCardProducts(true);
                                    
                                    // Reset quantity input for this specific product
                                    setProductQuantities((prev) => ({
                                      ...prev,
                                      [data.id]: "",
                                    }));
                                  } else {
                                    // Show error for invalid quantity
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
                                  <IconShoppingBag size={12} />
                                </Flex>
                              </Button>
                            </Group>
                          ),
                        },
                      ]}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={height - 130}
                    />
                  </Box>
                  <Box mt={"8"}>
                    <SelectForm
                      tooltip={t("Vendor")}
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
                  {isWarehouse == 1 && (
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
                  <Box mt={"4"}>
                    <SelectForm
                      tooltip={t("ChooseCategory")}
                      label={""}
                      placeholder={t("ChooseCategory")}
                      required={true}
                      nextField={"product_id"}
                      name={"category_id"}
                      form={form}
                      dropdownValue={getSettingCategoryDropdownData()}
                      id={"category_id"}
                      searchable={true}
                      value={categoryData}
                      changeValue={setCategoryData}
                      comboboxProps={{ withinPortal: false }}
                    />
                  </Box>
                  {switchValue === "product" && (
                    <Box
                      p={"xs"}
                      mt={"8"}
                      className={genericClass.genericHighlightedBox}
                      ml={"-xs"}
                      mr={-8}
                    >
                      <Grid gutter={{ base: 6 }}>
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
                              changeValue={(val) => {
                                setProduct(val);
                              }}
                              comboboxProps={{ withinPortal: false }}
                            />
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={1}>
                          <Box>
                            <Tooltip
                              multiline
                              bg={"#905923"}
                              position="top"
                              withArrow
                              ta={"center"}
                              offset={{ crossAxis: "-50", mainAxis: "5" }}
                              transitionProps={{ duration: 200 }}
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
                                onClick={() => setProductDrawer(true)}
                              >
                                <IconPlus stroke={1} />
                              </ActionIcon>
                            </Tooltip>
                          </Box>
                        </Grid.Col>
                      </Grid>
                    </Box>
                  )}
                  {switchValue === "barcode" && (
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
                        leftSection={<IconBarcode size={16} opacity={0.5} />}
                      />
                    </Box>
                  )}
                  {switchValue === "product" && (
                    <Box
                      ml={"-xs"}
                      p={"xs"}
                      mr={-8}
                      className={genericClass.genericBackground}
                    >
                      <Box mt={"4"}>
                        <Grid columns={12} gutter={{ base: 8 }}>
                          <Grid.Col span={4}>
                            <SelectForm
                              tooltip={t("MultiPriceValidateMessage")}
                              label=""
                              placeholder={t("Price")}
                              required={false}
                              nextField={""}
                              name={"multi_price"}
                              form={form}
                              dropdownValue={["1", "2", "3", "4", "5"]}
                              id={"multi_price"}
                              mt={1}
                              searchable={true}
                              value={multiPrice}
                              changeValue={setMultiPrice}
                            />
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
                                <IconCoinMonero size={16} opacity={0.5} />
                              }
                              rightSectionWidth={30}
                              disabled={true}
                            />
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <InputNumberForm
                              tooltip={t("PurchasePriceValidateMessage")}
                              label=""
                              placeholder={t("PurchasePrice")}
                              required={true}
                              nextField={"EntityFormSubmit"}
                              form={form}
                              name={"purchase_price"}
                              id={"purchase_price"}
                              disabled={!isPurchaseByPurchasePrice}
                              leftSection={
                                <IconPlusMinus size={16} opacity={0.5} />
                              }
                              rightIcon={
                                <IconCurrency size={16} opacity={0.5} />
                              }
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box>
                        <Grid columns={12} gutter={{ base: 8 }}>
                          <Grid.Col span={4}>
                            <SelectForm
                              tooltip={t("UnitValidateMessage")}
                              label=""
                              placeholder={t("Unit")}
                              required={false}
                              nextField={""}
                              name={"unit_id"}
                              form={form}
                              dropdownValue={["pcs", "kg"]}
                              id={"unit_id"}
                              mt={1}
                              searchable={true}
                              value={unitType}
                              changeValue={setUnitType}
                            />
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
                        <Grid columns={12} gutter={{ base: 8 }}>
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
                                  : "purchase_price"
                              }
                              form={form}
                              name={"percent"}
                              id={"percent"}
                              leftSection={
                                <IconPercentage size={16} opacity={0.5} />
                              }
                              rightIcon={
                                <IconCurrency size={16} opacity={0.5} />
                              }
                              closeIcon={true}
                            />
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Box style={{ display: "none" }}>
                              <InputButtonForm
                                tooltip=""
                                label=""
                                placeholder={t("SubTotal")}
                                required={true}
                                nextField={"EntityFormSubmit"}
                                form={form}
                                name={"sub_total"}
                                id={"sub_total"}
                                leftSection={
                                  <IconSum size={16} opacity={0.5} />
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
              <Box mb="xs">
                <Grid
                  className={genericClass.genericHighlightedBox}
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
                        onClick={() => {}}
                      >
                        <IconRefresh
                          style={{ width: "100%", height: "70%" }}
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
                        leftSection={<IconDeviceFloppy size={16} />}
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
          <__PosPurchaseUpdateForm
            tempCardProducts={tempCardProducts}
            currencySymbol={currencySymbol}
            domainId={domainId}
            isSMSActive={isSMSActive}
            setLoadCardProducts={setLoadCardProducts}
            isWarehouse={isWarehouse}
            editedData={editedData}
            setTempCardProducts={setTempCardProducts}
          />
        </Grid.Col>
      </Grid>
      {settingDrawer && (
        <SettingDrawer
          settingDrawer={settingDrawer}
          setSettingDrawer={setSettingDrawer}
          module={"purchase"}
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

export default _UpdatePurchaseInvoice;
