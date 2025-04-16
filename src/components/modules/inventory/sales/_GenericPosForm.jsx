import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  Flex,
  ActionIcon,
  TextInput,
  Grid,
  Box,
  Group,
  Text,
  Tooltip,
  rem,
  useMantineTheme,
  SegmentedControl,
  Center,
  Input,
  ScrollArea,
  Switch,
  Stack,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconDeviceFloppy,
  IconPercentage,
  IconSum,
  IconCurrency,
  IconX,
  IconBarcode,
  IconCoinMonero,
  IconSortAscendingNumbers,
  IconPlusMinus,
  IconPlus,
  IconMoneybag,
  IconListDetails,
  IconShoppingBag,
  IconRefresh,
  IconUserCircle,
  IconStackPush,
  IconPrinter,
  IconReceipt,
  IconMessage,
  IconEyeEdit,
  IconCalendar,
  IconCurrencyTaka,
  IconDiscountOff,
  IconDotsVertical,
} from "@tabler/icons-react";
import { getHotkeyHandler, useHotkeys, useToggle } from "@mantine/hooks";
import { hasLength, useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import __SalesForm from "./__SalesForm.jsx";
import { DataTable } from "mantine-datatable";
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
import InputForm from "../../../form-builders/InputForm.jsx";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import __SettingDrawer from "./__SettingsDrawer.jsx";
import __Navigation from "./__Navigation.jsx";

function _GenericPosForm(props) {
  const {
    currencySymbol,
    allowZeroPercentage,
    domainId,
    isSMSActive,
    isZeroReceiveAllow,
    focusFrom,
    isWarehouse,
  } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 360; //TabList height 104
  const heightTransaction = mainAreaHeight - 320; //TabList height 104
  const [fetching, setFetching] = useState(false);
  const formHeight = mainAreaHeight - 638;

  const [searchValue, setSearchValue] = useState("");
  const [productDropdown, setProductDropdown] = useState([]);

  const [tempCardProducts, setTempCardProducts] = useState([]);
  const [loadCardProducts, setLoadCardProducts] = useState(false);

  const [productDrawer, setProductDrawer] = useState(false);

  /*get warehouse dropdown data*/
  let warehouseDropdownData = getCoreWarehouseDropdownData();
  const [warehouseData, setWarehouseData] = useState(null);

  let salesSubTotalAmount =
    tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;
  let totalPurchaseAmount =
    tempCardProducts?.reduce(
      (total, item) => total + item.purchase_price * item.quantity,
      0
    ) || 0;

  const [stockProductRestore, setStockProductRestore] = useState(false);
  useEffect(() => {
    if (stockProductRestore) {
      const local = productsDataStoreIntoLocalStorage();
      console.log(local);
    }
  }, [stockProductRestore]);

  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-sales-products");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);
  // console.log(tempCardProducts)
  useEffect(() => {
    if (searchValue.length > 0) {
      const storedProducts = localStorage.getItem("core-products");
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

      // Filter products where product_nature is not 'raw-materials'
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
      const formattedProductData = productFilterData.map((type) => ({
        label: type.product_name,
        value: String(type.id),
      }));

      setProductDropdown(formattedProductData);
    } else {
      setProductDropdown([]);
    }
  }, [searchValue]);

  function handleAddProductByProductId(values, myCardProducts, localProducts) {
    const addProducts = localProducts.reduce((acc, product) => {
      if (product.id === Number(values.product_id)) {
        acc.push({
          product_id: product.id,
          display_name: product.display_name,
          sales_price: values.sales_price,
          price: values.price,
          percent: values.percent,
          stock: product.quantity,
          quantity: values.quantity,
          unit_name: product.unit_name,
          purchase_price: product.purchase_price,
          sub_total: selectProductDetails.sub_total,
          unit_id: product.unit_id,
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

    updateLocalStorageAndResetForm(addProducts);
  }

  function handleAddProductByBarcode(values, myCardProducts, localProducts) {
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
  }

  function updateLocalStorageAndResetForm(addProducts) {
    localStorage.setItem("temp-sales-products", JSON.stringify(addProducts));
    setSearchValue("");
    setWarehouseData(null);
    form.reset();
    setLoadCardProducts(true);
    document.getElementById("product_id").focus();
  }

  function createProductFromValues(product, values) {
    return {
      product_id: product.id,
      display_name: product.display_name,
      sales_price: product.sales_price,
      price: product.sales_price,
      percent: "",
      stock: product.quantity,
      quantity: 1,
      unit_name: product.unit_name,
      purchase_price: product.purchase_price,
      sub_total: product.sales_price,
      unit_id: product.unit_id,
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
      sales_price: "",
      percent: "",
      barcode: "",
      sub_total: "",
      quantity: "",
      warehouse_id: "",
      bonus_quantity: "",
      category_id: "",
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
      document.getElementById("quantity").focus();
    } else {
      setSelectProductDetails(null);
      form.setFieldValue("price", "");
      form.setFieldValue("sales_price", "");
    }
  }, [form.values.product_id]);

  useEffect(() => {
    const quantity = Number(form.values.quantity);
    const salesPrice = Number(form.values.sales_price);

    if (
      !isNaN(quantity) &&
      !isNaN(salesPrice) &&
      quantity > 0 &&
      salesPrice >= 0
    ) {
      if (!allowZeroPercentage) {
        showNotification({
          color: "pink",
          title: t("WeNotifyYouThat"),
          message: t("ZeroQuantityNotAllow"),
          autoClose: 1500,
          loading: true,
          withCloseButton: true,
          position: "top-center",
          style: { backgroundColor: "mistyrose" },
        });
      } else {
        setSelectProductDetails((prevDetails) => ({
          ...prevDetails,
          sub_total: quantity * salesPrice,
          sales_price: salesPrice,
        }));
        form.setFieldValue("sub_total", quantity * salesPrice);
      }
    }
  }, [form.values.quantity, form.values.sales_price]);

  useEffect(() => {
    if (form.values.quantity && form.values.price) {
      const discountAmount = (form.values.price * form.values.percent) / 100;
      const salesPrice = form.values.price - discountAmount;

      form.setFieldValue("sales_price", salesPrice);
      form.setFieldValue("sub_total", salesPrice);
    }
  }, [form.values.percent]);

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

  const inputRef = useRef(null);
  // useEffect(() => {
  //   const inputElement = document.getElementById("product_id");
  //   if (inputElement) {
  //     inputElement.focus();
  //   }
  // }, []);

  const [leftSide, setLeftSide] = useState(false);

  // vendor data
  const [vendorData, setVendorData] = useState(null);
  const [vendorObject, setVendorObject] = useState({});
  const [defaultVendorId, setDefaultVendorId] = useState(null);
  const [refreshVendorDropdown, setRefreshVendorDropdown] = useState(false);
  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
  useEffect(() => {
    if (vendorData) {
      const coreVendors = JSON.parse(
        localStorage.getItem("core-vendors") || "[]"
      );
      const foundVendors = coreVendors.find((type) => type.id == vendorData);

      if (foundVendors) {
        setVendorObject(foundVendors);
      }
    }
  }, [vendorData]);
  const isDefaultVendor = !vendorData || vendorData == defaultVendorId;

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
      setRefreshVendorDropdown(false);
    };
    fetchVendors();
  }, [refreshVendorDropdown]);
  // End of vendor

  //category
  const [categoryData, setCategoryData] = useState(null);

  //products

  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
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
    setOriginalProducts(filteredProducts);

    // Transform product for dropdown
    const transformedProducts = filteredProducts.map((product) => ({
      label: `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.sales_price}`,
      value: String(product.id),
    }));

    setProductDropdown(transformedProducts);
  }, [categoryData]);

  const [product, setProduct] = useState(null);

  const [salesByBarcode, setSalesByBarcode] = useState(true);
  const [enableSalesByBarcode, setEnableSalesByBarcode] = useState(false);
  const theme = useMantineTheme();

  const [switchValue, setSwitchValue] = useState("product");

  //Customer

  const [customerData, setCustomerData] = useState(null);

  const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false);
  const [customersDropdownData, setCustomersDropdownData] = useState([]);
  const [defaultCustomerId, setDefaultCustomerId] = useState(null);
  const isDefaultCustomer = !customerData || customerData == defaultCustomerId;
  useEffect(() => {
    const fetchCustomers = async () => {
      await customerDataStoreIntoLocalStorage();
      let coreCustomers = localStorage.getItem("core-customers");
      coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : [];
      let defaultId = defaultCustomerId;
      if (coreCustomers && coreCustomers.length > 0) {
        const transformedData = coreCustomers.map((type) => {
          if (type.name === "Default") {
            defaultId = type.id;
          }
          return {
            label: type.mobile + " -- " + type.name,
            value: String(type.id),
          };
        });

        setCustomersDropdownData(transformedData);
        setDefaultCustomerId(defaultId);
      }
      setRefreshCustomerDropdown(false);
    };

    fetchCustomers();
  }, [refreshCustomerDropdown]);
  const customerAddedForm = useForm({
    initialValues: {
      name: "",
      mobile: "",
      customer_group_id: "",
      email: "",
    },
    validate: {
      name: hasLength({ min: 2, max: 20 }),
      mobile: (value) => {
        if (!value) return t("MobileValidationRequired");
        return null;
      },
      email: (value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return true;
        }
        return null;
      },
    },
  });
  const transactionModeData = JSON.parse(
    localStorage.getItem("accounting-transaction-mode")
  )
    ? JSON.parse(localStorage.getItem("accounting-transaction-mode"))
    : [];
  const [hoveredModeId, setHoveredModeId] = useState(false);
  const handleClick = (event) => {
    setLastClicked(event.currentTarget.name);
  };
  const [salesDueAmount, setSalesDueAmount] = useState(salesSubTotalAmount);
  const isDisabled =
    isDefaultCustomer && (isZeroReceiveAllow ? false : salesDueAmount > 0);
  const [salesByDropdownData, setSalesByDropdownData] = useState([]);
  useEffect(() => {
    let coreUsers = localStorage.getItem("core-users")
      ? JSON.parse(localStorage.getItem("core-users"))
      : [];
    if (coreUsers && coreUsers.length > 0) {
      const transformedData = coreUsers.map((type) => {
        return {
          label: type.username + " - " + type.email,
          value: String(type.id),
        };
      });
      setSalesByDropdownData(transformedData);
    }
  }, []);
  const [salesByUser, setSalesByUser] = useState(null);
  const [orderProcess, setOrderProcess] = useState(null);
  const [salesProfitAmount, setSalesProfitAmount] = useState(0);
  const [salesVatAmount, setSalesVatAmount] = useState(0);
  const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
  const [salesTotalAmount, setSalesTotalAmount] = useState(0);
  const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false);
  const [profitShow, setProfitShow] = useState(false);
  const [returnOrDueText, setReturnOrDueText] = useState("Due");
  const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);
  const [settingDrawer, setSettingDrawer] = useState(false);

  const [multiPrice, setMultiPrice] = useState(false);
  const [unitType, setUnitType] = useState(false);
  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={1}>
          <__Navigation />
        </Grid.Col>
        <Grid.Col span={7}>
          <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
            <Box>
              <form
                onSubmit={form.onSubmit((values) => {
                  if (!values.barcode && !values.product_id) {
                    form.setFieldError("barcode", true);
                    form.setFieldError("product_id", true);
                    setTimeout(() => {}, 1000);
                  } else {
                    const cardProducts = localStorage.getItem(
                      "temp-sales-products"
                    );
                    const myCardProducts = cardProducts
                      ? JSON.parse(cardProducts)
                      : [];
                    const storedProducts =
                      localStorage.getItem("core-products");
                    const localProducts = storedProducts
                      ? JSON.parse(storedProducts)
                      : [];

                    if (values.product_id && !values.barcode) {
                      if (!allowZeroPercentage) {
                        showNotification({
                          color: "pink",
                          title: t("WeNotifyYouThat"),
                          message: t("ZeroQuantityNotAllow"),
                          autoClose: 1500,
                          loading: true,
                          withCloseButton: true,
                          position: "top-center",
                          style: { backgroundColor: "mistyrose" },
                        });
                      } else {
                        handleAddProductByProductId(
                          values,
                          myCardProducts,
                          localProducts
                        );
                      }
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
                <Box mb={"xs"}>
                  <Grid columns={12} gutter={{ base: 2 }}>
                    <Grid.Col span={2}>
                      <IconMoneybag
                        style={{ width: rem(42), height: rem(42) }}
                        stroke={2}
                        color={theme.colors.blue[6]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text fz="md" fw={500} className={classes.cardTitle}>
                        {t("Sales")}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={4} align="center">
                      <Group justify="flex-end" align="center" gap={4}>
                        {salesByBarcode && (
                          <SegmentedControl
                            size="xs"
                            styles={{
                              label: { color: "white" },
                            }}
                            bg={"green.6"}
                            withItemsBorders={false}
                            fullWidth
                            color="green.4"
                            value={switchValue}
                            onChange={setSwitchValue}
                            data={[
                              {
                                label: (
                                  <Center style={{ gap: 10 }}>
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
                                  <Center style={{ gap: 10 }}>
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
                          bg={"orange.8"}
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
                  pl={`xs`}
                  pr={8}
                  mb={"xs"}
                  className={"boxBackground borderRadiusAll"}
                >
                  {switchValue === "barcode" && (
                    <Box mt={"xs"}>
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
                  <Box mt={"xs"}>
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
                  {isWarehouse == 1 && (
                    <Box mt={"xs"}>
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

                  <Box mt={"xs"}>
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
                    <Box p={"xs"} bg={"#d7e8cd"} ml={"-xs"} mr={-8}>
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
                  )}
                  <Box mt={switchValue === "product" ? "0" : "xs"}>
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
                              <Text fz={11} fw={400} pr={"xs"} w={50}>
                                {currencySymbol} {data.sales_price}
                              </Text>
                              <Input
                                styles={{
                                  input: {
                                    fontSize: "var(--mantine-font-size-xs)",
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    textAlign: "center",
                                    borderRadius: 0,
                                    borderColor: "green",
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
                                placeholder={t("0")}
                                required={false}
                                nextField={"credit_limit"}
                                name={"quantity"}
                                form={form}
                                id={"quantity"}
                              />
                              <Button
                                size="compact-xs"
                                color={`gray.4`}
                                radius={0}
                                w="50"
                                styles={{
                                  root: {
                                    height: "22px",
                                    borderRadius: 0,
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
                                color={`green.8`}
                                radius={0}
                                w="30"
                                styles={{
                                  root: {
                                    height: "22px",
                                    borderRadius: 0,
                                    borderTopRightRadius:
                                      "var(--mantine-radius-sm)",
                                    borderBottomRightRadius:
                                      "var(--mantine-radius-sm)",
                                  },
                                }}
                                onClick={() => {}}
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
                      height={height - 132}
                    />
                  </Box>
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
                          tooltip={t("SalesPriceValidateMessage")}
                          label=""
                          placeholder={t("SalesPrice")}
                          required={true}
                          nextField={"EntityFormSubmit"}
                          form={form}
                          name={"sales_price"}
                          id={"sales_price"}
                          disabled={form.values.percent}
                          leftSection={
                            <IconPlusMinus size={16} opacity={0.5} />
                          }
                          rightIcon={<IconCurrency size={16} opacity={0.5} />}
                        />
                      </Grid.Col>
                    </Grid>
                  </Box>
                  <Box mt={"4"}>
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
                            <IconSortAscendingNumbers size={16} opacity={0.5} />
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
                          name={"bonous_quantity"}
                          id={"bonous_quantity"}
                          leftSection={
                            <IconSortAscendingNumbers size={16} opacity={0.5} />
                          }
                          rightSection={inputGroupText}
                          rightSectionWidth={50}
                        />
                      </Grid.Col>
                    </Grid>
                  </Box>
                  <Box mt="4" mb="8">
                    <Grid columns={12} gutter={{ base: 8 }}>
                      <Grid.Col span={6}>
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
                            <IconPercentage size={16} opacity={0.5} />
                          }
                          rightIcon={<IconCurrency size={16} opacity={0.5} />}
                          closeIcon={true}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <InputButtonForm
                          tooltip=""
                          label=""
                          placeholder={t("SubTotal")}
                          required={true}
                          nextField={"EntityFormSubmit"}
                          form={form}
                          name={"sub_total"}
                          id={"sub_total"}
                          leftSection={<IconSum size={16} opacity={0.5} />}
                          rightSection={inputGroupCurrency}
                          disabled={
                            selectProductDetails &&
                            selectProductDetails.sub_total
                          }
                          closeIcon={false}
                        />
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Box>
              </form>
            </Box>
            <Box mb="xs">
              <Grid columns={12} justify="space-between" align="center">
                <Grid.Col span={6}>
                  <Box>
                    <Tooltip
                      multiline
                      bg={"orange.8"}
                      position="top"
                      withArrow
                      ta={"center"}
                      offset={{ crossAxis: "-50", mainAxis: "5" }}
                      transitionProps={{ duration: 200 }}
                      label={t("Refresh")}
                    >
                      <ActionIcon
                        variant="transparent"
                        size={"lg"}
                        color="grey.6"
                        mt={"1"}
                        aria-label="Settings"
                        onClick={() => {}}
                      >
                        <IconRefresh
                          style={{ width: "100%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip
                      multiline
                      bg={"orange.8"}
                      position="top"
                      withArrow
                      ta={"center"}
                      offset={{ crossAxis: "-50", mainAxis: "5" }}
                      transitionProps={{ duration: 200 }}
                      label={t("InstantProductCreate")}
                    >
                      <ActionIcon
                        variant="transparent"
                        size={"lg"}
                        color="grey.6"
                        mt={"1"}
                        aria-label="Settings"
                        onClick={() => setProductDrawer(true)}
                      >
                        <IconPlus
                          style={{ width: "100%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Button
                      size="sm"
                      color={`red.5`}
                      type="submit"
                      mt={0}
                      mr={"xs"}
                      w={"100%"}
                      id="EntityFormSubmit"
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
              <Grid columns={24} gutter={{ base: 6 }}>
                <Grid.Col span={16}>
                  <></>
                </Grid.Col>
                <Grid.Col span={8} bg={"white"}></Grid.Col>
              </Grid>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={16}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box
              pl={`xs`}
              pr={8}
              pt={"8"}
              mb={"xs"}
              className={"borderRadiusAll"}
            >
              <Grid columns={24} gutter={{ base: 6 }}>
                <Grid.Col span={8}>
                  <Box mt={"4"}>
                    <SelectForm
                      tooltip={t("CustomerValidateMessage")}
                      label=""
                      placeholder={t("Customer")}
                      required={false}
                      nextField={""}
                      name={"customer_id"}
                      form={form}
                      dropdownValue={customersDropdownData}
                      id={"customer_id"}
                      mt={1}
                      searchable={true}
                      value={customerData}
                      changeValue={setCustomerData}
                    />
                  </Box>
                  <Box mt={"xs"}>
                    <Grid
                      gutter={{ base: 6 }}
                      bg={"red.1"}
                      mt={8}
                      pt={"xs"}
                      pb={"12"}
                    >
                      <Grid.Col span={6}>
                        <Box pl={"md"}>
                          <Text fz={"md"} order={1} fw={"800"}>
                            {currencySymbol + " "}
                            {customerData &&
                            customerObject &&
                            customerData != defaultCustomerId
                              ? Number(customerObject.balance).toFixed(2)
                              : "0.00"}
                          </Text>
                          <Text fz={"xs"} c="dimmed">
                            {t("Outstanding")}
                          </Text>
                        </Box>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Box
                          mt={"8"}
                          mr={"12"}
                          style={{ textAlign: "right", float: "right" }}
                        >
                          <Group>
                            <Tooltip
                              multiline
                              bg={"orange.8"}
                              position="top"
                              ta={"center"}
                              withArrow
                              transitionProps={{ duration: 200 }}
                              label={
                                customerData &&
                                customerData != defaultCustomerId
                                  ? isSMSActive
                                    ? t("SendSms")
                                    : t("PleasePurchaseAsmsPackage")
                                  : t("ChooseCustomer")
                              }
                            >
                              <ActionIcon
                                bg={"white"}
                                variant="outline"
                                color={"red"}
                                disabled={
                                  !customerData ||
                                  customerData == defaultCustomerId
                                }
                                onClick={(e) => {
                                  if (isSMSActive) {
                                    notifications.show({
                                      withCloseButton: true,
                                      autoClose: 1000,
                                      title: t("smsSendSuccessfully"),
                                      message: t("smsSendSuccessfully"),
                                      icon: <IconTallymark1 />,
                                      className: "my-notification-class",
                                      style: {},
                                      loading: true,
                                    });
                                  } else {
                                    setIsShowSMSPackageModel(true);
                                  }
                                }}
                              >
                                <IconMessage size={18} stroke={1.5} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip
                              multiline
                              bg={"orange.8"}
                              position="top"
                              withArrow
                              offset={{ crossAxis: "-45", mainAxis: "5" }}
                              ta={"center"}
                              transitionProps={{ duration: 200 }}
                              label={
                                customerData &&
                                customerData != defaultCustomerId
                                  ? t("CustomerDetails")
                                  : t("ChooseCustomer")
                              }
                            >
                              <ActionIcon
                                variant="filled"
                                color={"red"}
                                disabled={
                                  !customerData ||
                                  customerData == defaultCustomerId
                                }
                                onClick={() => {
                                  setViewDrawer(true);
                                }}
                              >
                                <IconEyeEdit size={18} stroke={1.5} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Box>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Grid.Col>
                <Grid.Col span={8}></Grid.Col>
                <Grid.Col span={8}>
                  <form
                    id="customerAddedForm"
                    onSubmit={customerAddedForm.onSubmit((values) => {
                      modals.openConfirmModal({
                        title: (
                          <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                          <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: {
                          confirm: t("Submit"),
                          cancel: t("Cancel"),
                        },
                        confirmProps: { color: "red" },
                        onCancel: () => console.log("Cancel"),
                        onConfirm: async () => {
                          setSaveCreateLoading(true);
                          const value = {
                            url: "core/customer",
                            data: values,
                          };
                          try {
                            const response = await dispatch(
                              storeEntityData(value)
                            ).unwrap();
                            console.log(
                              "Customer creation response:",
                              response
                            );

                            notifications.show({
                              color: "teal",
                              title: t("CreateSuccessfully"),
                              icon: (
                                <IconCheck
                                  style={{
                                    width: rem(18),
                                    height: rem(18),
                                  }}
                                />
                              ),
                              loading: false,
                              autoClose: 700,
                              style: { backgroundColor: "lightgray" },
                            });
                            if (response && response?.data?.data) {
                              const newCustomer = response?.data?.data;
                              const coreCustomers = localStorage.getItem(
                                "core-customers"
                              )
                                ? JSON.parse(
                                    localStorage.getItem("core-customers")
                                  )
                                : [];
                              const updatedCustomers = [
                                ...coreCustomers,
                                newCustomer,
                              ];
                              localStorage.setItem(
                                "core-customers",
                                JSON.stringify(updatedCustomers)
                              );

                              setCustomerId(newCustomer.id);
                              setCustomerObject(newCustomer);
                            }

                            customerAddedForm.reset();
                            setRefreshCustomerDropdown(true);
                            // setValue("Existing");
                            setCustomerDrawer(false);
                            setSaveCreateLoading(false);
                          } catch (error) {
                            console.error("Error creating customer:", error);
                            notifications.show({
                              color: "red",
                              title: t("CreateFailed"),
                              message:
                                error?.message || t("SomethingWentWrong"),
                              icon: (
                                <IconX
                                  style={{
                                    width: rem(18),
                                    height: rem(18),
                                  }}
                                />
                              ),
                              loading: false,
                              autoClose: 2000,
                              style: { backgroundColor: "lightgray" },
                            });
                            setSaveCreateLoading(false);
                          }
                        },
                      });
                    })}
                  >
                    <Box mt={"4"}>
                      <InputForm
                        tooltip={t("NameValidateMessage")}
                        label={t("")}
                        placeholder={t("CustomerName")}
                        required={true}
                        nextField={"mobile"}
                        form={customerAddedForm}
                        name={"name"}
                        id={"name"}
                        leftSection={<IconUserCircle size={16} opacity={0.5} />}
                        rightIcon={""}
                      />
                    </Box>
                    <Box mt={"4"}>
                      <PhoneNumber
                        tooltip={
                          customerAddedForm.errors.mobile
                            ? customerAddedForm.errors.mobile
                            : t("MobileValidateMessage")
                        }
                        label={t("")}
                        placeholder={t("Mobile")}
                        required={true}
                        nextField={"email"}
                        form={customerAddedForm}
                        name={"mobile"}
                        id={"mobile"}
                        rightIcon={""}
                      />
                    </Box>
                    <Box mt={"4"} mb={4}>
                      <InputForm
                        tooltip={t("InvalidEmail")}
                        label={t("")}
                        placeholder={t("Email")}
                        required={false}
                        nextField={""}
                        name={"email"}
                        form={customerAddedForm}
                        id={"email"}
                      />
                    </Box>
                  </form>
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
                records={tempCardProducts}
                columns={[
                  {
                    accessor: "index",
                    title: t("S/N"),
                    textAlignment: "right",
                    width: "50px",
                    render: (item) => tempCardProducts.indexOf(item) + 1,
                  },
                  {
                    accessor: "display_name",
                    title: t("Name"),
                    width: "200px",
                    footer: (
                      <Group spacing="xs">
                        <IconSum size="1.25em" />
                        <Text mb={-2}>
                          {tempCardProducts.length} {t("Items")}
                        </Text>
                      </Group>
                    ),
                  },
                  {
                    accessor: "price",
                    title: t("Price"),
                    textAlign: "right",
                    render: (item) => {
                      return item.price && Number(item.price).toFixed(2);
                    },
                  },

                  {
                    accessor: "stock",
                    title: t("Stock"),
                    textAlign: "center",
                  },
                  {
                    accessor: "quantity",
                    title: t("Quantity"),
                    textAlign: "center",
                    width: "100px",
                    render: (item) => {
                      const [editedQuantity, setEditedQuantity] = useState(
                        item.quantity
                      );

                      const handleQuantityChange = (e) => {
                        const editedQuantity = e.currentTarget.value;
                        setEditedQuantity(editedQuantity);

                        const tempCardProducts = localStorage.getItem(
                          "temp-sales-products"
                        );
                        const cardProducts = tempCardProducts
                          ? JSON.parse(tempCardProducts)
                          : [];

                        const updatedProducts = cardProducts.map((product) => {
                          if (product.product_id === item.product_id) {
                            return {
                              ...product,
                              quantity: e.currentTarget.value,
                              sub_total:
                                e.currentTarget.value * item.sales_price,
                            };
                          }
                          return product;
                        });

                        localStorage.setItem(
                          "temp-sales-products",
                          JSON.stringify(updatedProducts)
                        );
                        setLoadCardProducts(true);
                      };

                      return (
                        <>
                          <TextInput
                            type="number"
                            label=""
                            size="xs"
                            value={editedQuantity}
                            onChange={handleQuantityChange}
                            onKeyDown={getHotkeyHandler([
                              [
                                "Enter",
                                (e) => {
                                  document
                                    .getElementById(
                                      "inline-update-quantity-" +
                                        item.product_id
                                    )
                                    .focus();
                                },
                              ],
                            ])}
                          />
                        </>
                      );
                    },
                  },
                  {
                    accessor: "unit_name",
                    title: t("UOM"),
                    textAlign: "center",
                  },
                  {
                    accessor: "sales_price",
                    title: t("SalesPrice"),
                    textAlign: "center",
                    width: "100px",
                    render: (item) => {
                      const [editedSalesPrice, setEditedSalesPrice] = useState(
                        item.sales_price
                      );

                      const handleSalesPriceChange = (e) => {
                        const newSalesPrice = e.currentTarget.value;
                        setEditedSalesPrice(newSalesPrice);
                      };

                      useEffect(() => {
                        const timeoutId = setTimeout(() => {
                          const tempCardProducts = localStorage.getItem(
                            "temp-sales-products"
                          );
                          const cardProducts = tempCardProducts
                            ? JSON.parse(tempCardProducts)
                            : [];
                          const updatedProducts = cardProducts.map(
                            (product) => {
                              if (product.product_id === item.product_id) {
                                return {
                                  ...product,
                                  sales_price: editedSalesPrice,
                                  sub_total: editedSalesPrice * item.quantity,
                                };
                              }
                              return product;
                            }
                          );

                          localStorage.setItem(
                            "temp-sales-products",
                            JSON.stringify(updatedProducts)
                          );
                          setLoadCardProducts(true);
                        }, 1000);

                        return () => clearTimeout(timeoutId);
                      }, [editedSalesPrice, item.product_id, item.quantity]);

                      return item.percent ? (
                        Number(item.sales_price).toFixed(2)
                      ) : (
                        <>
                          <TextInput
                            type="number"
                            label=""
                            size="xs"
                            id={"inline-update-quantity-" + item.product_id}
                            value={editedSalesPrice}
                            onChange={handleSalesPriceChange}
                          />
                        </>
                      );
                    },
                  },
                  {
                    accessor: "percent",
                    title: t("Discount"),
                    textAlign: "center",
                    width: "100px",
                    render: (item) => {
                      const [editedPercent, setEditedPercent] = useState(
                        item.percent
                      );
                      const handlePercentChange = (e) => {
                        const editedPercent = e.currentTarget.value;
                        setEditedPercent(editedPercent);

                        const tempCardProducts = localStorage.getItem(
                          "temp-sales-products"
                        );
                        const cardProducts = tempCardProducts
                          ? JSON.parse(tempCardProducts)
                          : [];

                        if (
                          e.currentTarget.value &&
                          e.currentTarget.value >= 0
                        ) {
                          const updatedProducts = cardProducts.map(
                            (product) => {
                              if (product.product_id === item.product_id) {
                                const discountAmount =
                                  (item.price * editedPercent) / 100;
                                const salesPrice = item.price - discountAmount;

                                return {
                                  ...product,
                                  percent: editedPercent,
                                  sales_price: salesPrice,
                                  sub_total: salesPrice * item.quantity,
                                };
                              }
                              return product;
                            }
                          );

                          localStorage.setItem(
                            "temp-sales-products",
                            JSON.stringify(updatedProducts)
                          );
                          setLoadCardProducts(true);
                        }
                      };

                      return item.percent ? (
                        <>
                          <TextInput
                            type="number"
                            label=""
                            size="xs"
                            value={editedPercent}
                            onChange={handlePercentChange}
                            rightSection={
                              editedPercent === "" ? (
                                <>
                                  {item.percent}
                                  <IconPercentage size={16} opacity={0.5} />
                                </>
                              ) : (
                                <IconPercentage size={16} opacity={0.5} />
                              )
                            }
                          />
                        </>
                      ) : (
                        <Text size={"xs"} ta="right">
                          {(
                            Number(item.price) - Number(item.sales_price)
                          ).toFixed(2)}
                        </Text>
                      );
                    },
                    footer: (
                      <Group spacing="xs">
                        <Text fz={"md"} fw={"600"}>
                          {t("SubTotal")}
                        </Text>
                      </Group>
                    ),
                  },

                  {
                    accessor: "sub_total",
                    title: t("SubTotal"),
                    textAlign: "right",
                    render: (item) => {
                      return (
                        item.sub_total && Number(item.sub_total).toFixed(2)
                      );
                    },
                    footer: (
                      <Group spacing="xs">
                        <Text fw={"600"} fz={"md"}>
                          {salesSubTotalAmount.toFixed(2)}
                        </Text>
                      </Group>
                    ),
                  },
                  {
                    accessor: "action",
                    title: t("Action"),
                    textAlign: "right",
                    render: (item) => (
                      <Group gap={4} justify="right" wrap="nowrap">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => {
                            const dataString = localStorage.getItem(
                              "temp-sales-products"
                            );
                            let data = dataString ? JSON.parse(dataString) : [];

                            data = data.filter(
                              (d) => d.product_id !== item.product_id
                            );

                            const updatedDataString = JSON.stringify(data);

                            localStorage.setItem(
                              "temp-sales-products",
                              updatedDataString
                            );
                            setLoadCardProducts(true);
                          }}
                        >
                          <IconX
                            size={16}
                            style={{ width: "70%", height: "70%" }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      </Group>
                    ),
                  },
                ]}
                fetching={fetching}
                totalRecords={100}
                recordsPerPage={10}
                loaderSize="xs"
                loaderColor="grape"
                height={height - 85}
                scrollAreaProps={{ type: "never" }}
              />
            </Box>
          </Box>
          <Box>
            <Grid columns={24} gutter={{ base: 6 }} pt={"6"}>
              <Grid.Col span={8}>
                <Box className={"borderRadiusAll"}>
                  <ScrollArea
                    h={190}
                    scrollbarSize={2}
                    type="never"
                    bg={"gray.1"}
                  >
                    <Box pl={"xs"} pt={"xs"} pr={"xs"} bg={"white"} pb={"10"}>
                      <Grid columns={"16"} gutter="6">
                        {transactionModeData &&
                          transactionModeData.length > 0 &&
                          transactionModeData.map((mode, index) => {
                            return (
                              <Grid.Col span={4} key={index}>
                                <Box bg={"gray.1"} h={"82"}>
                                  <input
                                    type="radio"
                                    name="transaction_mode_id"
                                    id={"transaction_mode_id_" + mode.id}
                                    className="input-hidden"
                                    value={mode.id}
                                    onChange={(e) => {
                                      form.setFieldValue(
                                        "transaction_mode_id",
                                        e.currentTarget.value
                                      );
                                      form.setFieldError(
                                        "transaction_mode_id",
                                        null
                                      );
                                    }}
                                    defaultChecked={
                                      mode.is_selected ? true : false
                                    }
                                  />
                                  <Tooltip
                                    label={mode.name}
                                    opened={hoveredModeId === mode.id}
                                    position="top"
                                    bg={"orange.8"}
                                    offset={12}
                                    withArrow
                                    arrowSize={8}
                                  >
                                    <label
                                      htmlFor={"transaction_mode_id_" + mode.id}
                                      onMouseEnter={() => {
                                        setHoveredModeId(mode.id);
                                      }}
                                      onMouseLeave={() => {
                                        setHoveredModeId(null);
                                      }}
                                    >
                                      <img
                                        src={
                                          isOnline
                                            ? mode.path
                                            : "/images/transaction-mode-offline.jpg"
                                        }
                                        alt={mode.method_name}
                                      />
                                      <Center fz={"xs"} className={"textColor"}>
                                        {mode.authorized_name}
                                      </Center>
                                    </label>
                                  </Tooltip>
                                </Box>
                              </Grid.Col>
                            );
                          })}
                      </Grid>
                    </Box>
                  </ScrollArea>
                </Box>
              </Grid.Col>
              <Grid.Col span={8}>
                <Box className="borderRadiusAll" bg={"white"} p={"xs"} h={192}>
                  <Box>
                    <DatePickerForm
                      tooltip={t("InvoiceDateValidateMessage")}
                      label=""
                      placeholder={t("InvoiceDate")}
                      required={false}
                      nextField={"discount"}
                      form={form}
                      name={"invoice_date"}
                      id={"invoice_date"}
                      leftSection={<IconCalendar size={16} opacity={0.5} />}
                      rightSectionWidth={30}
                      closeIcon={true}
                    />
                  </Box>
                  <Box mt={4}>
                    <SelectForm
                      tooltip={t("ChooseSalesBy")}
                      label=""
                      placeholder={t("SalesBy")}
                      required={false}
                      name={"sales_by"}
                      form={form}
                      dropdownValue={salesByDropdownData}
                      id={"sales_by"}
                      nextField={"order_process"}
                      searchable={false}
                      value={salesByUser}
                      changeValue={setSalesByUser}
                    />
                  </Box>
                  <Box pt={4}>
                    <SelectForm
                      tooltip={t("ChooseOrderProcess")}
                      label=""
                      placeholder={t("OrderProcess")}
                      required={false}
                      name={"order_process"}
                      form={form}
                      dropdownValue={
                        localStorage.getItem("order-process")
                          ? JSON.parse(localStorage.getItem("order-process"))
                          : []
                      }
                      id={"order_process"}
                      nextField={"narration"}
                      searchable={false}
                      value={orderProcess}
                      changeValue={setOrderProcess}
                    />
                  </Box>
                  <Box pt={4}>
                    <TextAreaForm
                      size="xs"
                      tooltip={t("NarrationValidateMessage")}
                      label=""
                      placeholder={t("Narration")}
                      required={false}
                      nextField={"Status"}
                      name={"narration"}
                      form={form}
                      id={"narration"}
                    />
                  </Box>
                </Box>
              </Grid.Col>
              <Grid.Col span={8}>
                {/* outstading section */}
                <Box p={"xs"} className="borderRadiusAll" bg={"white"} h={192}>
                  <Box>
                    <Grid gutter={{ base: 4 }}>
                      <Grid.Col span={3}>
                        <Center fz={"md"} fw={"800"}>
                          {currencySymbol} {salesSubTotalAmount.toFixed(2)}
                        </Center>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Center fz={"md"} fw={"800"}>
                          {" "}
                          {currencySymbol}{" "}
                          {salesDiscountAmount &&
                            Number(salesDiscountAmount).toFixed(2)}
                        </Center>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Center fz={"md"} fw={"800"}>
                          {" "}
                          {currencySymbol} {salesVatAmount.toFixed(2)}
                        </Center>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Center fz={"md"} fw={"800"}>
                          {currencySymbol} {salesTotalAmount.toFixed(2)}
                        </Center>
                      </Grid.Col>
                    </Grid>
                    <Grid gutter={{ base: 4 }}>
                      <Grid.Col span={3}>
                        <Box h={1} ml={"xl"} mr={"xl"} bg={`red.3`}></Box>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Box h={1} ml={"xl"} mr={"xl"} bg={`red.3`}></Box>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Box h={1} ml={"xl"} mr={"xl"} bg={`red.3`}></Box>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Box h={1} ml={"xl"} mr={"xl"} bg={`red.3`}></Box>
                      </Grid.Col>
                    </Grid>
                    <Grid gutter={{ base: 4 }}>
                      <Grid.Col span={3}>
                        <Center fz={"xs"} c="dimmed">
                          {t("SubTotal")}
                        </Center>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Center fz={"xs"} c="dimmed">
                          {t("Discount")}
                        </Center>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Center fz={"xs"} c="dimmed">
                          {t("Vat")}
                        </Center>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Center fz={"xs"} c="dimmed">
                          {t("Total")}
                        </Center>
                      </Grid.Col>
                    </Grid>
                  </Box>
                  {/* Due Section */}
                  <Box className={""} pt={"xs"} mb={"xs"} pb={"xs"}>
                    <Stack h={110} justify="space-between">
                      <Grid columns={18} gutter={{ base: 2 }} pt={"md"}>
                        <Grid.Col span={10} align="flex-start">
                          <Group justify="flex-start" align="center">
                            <Box>
                              <Switch
                                size="lg"
                                w={"100%"}
                                color={"red.3"}
                                ml={"6"}
                                onLabel={t("Profit")}
                                offLabel={t("Hide")}
                                radius="xs"
                                onChange={(event) =>
                                  setProfitShow(event.currentTarget.checked)
                                }
                              />
                            </Box>
                            <Box>
                              <Center fz={"md"} mt={"4"} c={"black.5"}>
                                {currencySymbol}{" "}
                                {profitShow && salesProfitAmount}
                              </Center>
                            </Box>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={8} align="center" justify="center">
                          <Box
                            fz={"xl"}
                            pr={"xs"}
                            c={"red"}
                            style={{ textAlign: "right", float: "right" }}
                            fw={"800"}
                          >
                            {returnOrDueText === "Due" ? t("Due") : t("Return")}{" "}
                            {currencySymbol} {salesDueAmount.toFixed(2)}
                          </Box>
                        </Grid.Col>
                      </Grid>
                      <Box>
                        <Box mt={"4"} h={1} bg={`red.3`}></Box>
                        <Tooltip
                          label={t("MustBeNeedReceiveAmountWithoutCustomer")}
                          opened={isDisabled}
                          position="bottom-end"
                          withArrow
                        >
                          <Grid gutter={{ base: 2 }} mt={"4"}>
                            <Grid.Col span={4} bg={"red.3"} p={2}>
                              <Tooltip
                                label={t("ClickRightButtonForPercentFlat")}
                                px={16}
                                py={2}
                                position="top"
                                bg={"red.4"}
                                c={"white"}
                                withArrow
                                offset={2}
                                zIndex={999}
                                transitionProps={{
                                  transition: "pop-bottom-left",
                                  duration: 500,
                                }}
                              >
                                <TextInput
                                  type="number"
                                  style={{ textAlign: "right" }}
                                  placeholder={t("Discount")}
                                  value={salesDiscountAmount}
                                  size={"sm"}
                                  classNames={{ input: classes.input }}
                                  onChange={(event) => {
                                    form.setFieldValue(
                                      "discount",
                                      event.target.value
                                    );
                                    const newValue = event.target.value;
                                    setSalesDiscountAmount(newValue);
                                    form.setFieldValue("discount", newValue);
                                  }}
                                  rightSection={
                                    <ActionIcon
                                      size={32}
                                      bg={"red.5"}
                                      variant="filled"
                                      onClick={() => setDiscountType()}
                                    >
                                      {discountType === "Flat" ? (
                                        <IconCurrencyTaka size={16} />
                                      ) : (
                                        <IconPercentage size={16} />
                                      )}
                                    </ActionIcon>
                                  }
                                  onBlur={async (event) => {
                                    const data = {
                                      url: "inventory/pos/inline-update",
                                      data: {
                                        invoice_id: tableId,
                                        field_name: "discount",
                                        value: event.target.value,
                                        discount_type: discountType,
                                      },
                                    };
                                    // Dispatch and handle response
                                    try {
                                      const resultAction = await dispatch(
                                        storeEntityData(data)
                                      );

                                      if (
                                        resultAction.payload?.status !== 200
                                      ) {
                                        showNotificationComponent(
                                          resultAction.payload?.message ||
                                            "Error updating invoice",
                                          "red",
                                          "",
                                          "",
                                          true
                                        );
                                      }
                                    } catch (error) {
                                      showNotificationComponent(
                                        "Request failed. Please try again.",
                                        "red",
                                        "",
                                        "",
                                        true
                                      );
                                      console.error(
                                        "Error updating invoice:",
                                        error
                                      );
                                    } finally {
                                      setReloadInvoiceData(true);
                                    }
                                  }}
                                />
                              </Tooltip>
                              {/* <InputButtonForm
                            tooltip={t("DiscountValidateMessage")}
                            label=""
                            placeholder={t("Discount")}
                            required={false}
                            nextField={"receive_amount"}
                            form={form}
                            name={"discount"}
                            id={"discount"}
                            leftSection={
                              <IconDiscountOff size={16} opacity={0.5} />
                            }
                            rightSection={inputGroupCurrency}
                            rightSectionWidth={30}
                          /> */}
                            </Grid.Col>
                            <Grid.Col span={8} bg={"green"} p={2}>
                              <InputNumberForm
                                type="number"
                                tooltip={t("ReceiveAmountValidateMessage")}
                                label=""
                                placeholder={t("Amount")}
                                required={false}
                                nextField={"sales_by"}
                                form={form}
                                name={"receive_amount"}
                                id={"receive_amount"}
                                rightIcon={
                                  <IconCurrency size={16} opacity={0.5} />
                                }
                                leftSection={
                                  <IconPlusMinus size={16} opacity={0.5} />
                                }
                                closeIcon={true}
                              />
                            </Grid.Col>
                          </Grid>
                        </Tooltip>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
            <Box mt={"8"} pb={"xs"}>
              <Button.Group>
                <Button
                  fullWidth={true}
                  variant="filled"
                  leftSection={<IconStackPush size={14} />}
                  color="orange.5"
                >
                  {t("Hold")}
                </Button>
                <Button
                  fullWidth={true}
                  variant="filled"
                  type={"submit"}
                  onClick={handleClick}
                  name="print"
                  leftSection={<IconPrinter size={14} />}
                  color="green.5"
                  disabled={isDisabled}
                  style={{
                    transition: "all 0.3s ease",
                    backgroundColor: isDisabled ? "#f1f3f500" : "",
                  }}
                >
                  {t("Print")}
                </Button>
                <Button
                  fullWidth={true}
                  type={"submit"}
                  onClick={handleClick}
                  name="pos"
                  variant="filled"
                  leftSection={<IconReceipt size={14} />}
                  color="red.5"
                  disabled={isDisabled}
                  style={{
                    transition: "all 0.3s ease",
                    backgroundColor: isDisabled ? "#f1f3f500" : "",
                  }}
                >
                  {t("Pos")}
                </Button>
                <Button
                  fullWidth={true}
                  type={"submit"}
                  onClick={handleClick}
                  name="save"
                  variant="filled"
                  leftSection={<IconDeviceFloppy size={14} />}
                  color="cyan.5"
                  disabled={isDisabled}
                  style={{
                    transition: "all 0.3s ease",
                    backgroundColor: isDisabled ? "#f1f3f500" : "",
                  }}
                >
                  {t("Save")}
                </Button>
              </Button.Group>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
      {settingDrawer && (
        <__SettingDrawer
          settingDrawer={settingDrawer}
          setSettingDrawer={setSettingDrawer}
          module={"sales"}
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
