import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
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
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import { DataTable } from "mantine-datatable";
import _ShortcutInvoice from "../../shortcut/_ShortcutInvoice";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import __RequistionForm from "./__RequistionForm";
import { useHotkeys } from "@mantine/hooks";
import AddProductDrawer from "../../inventory/sales/drawer-form/AddProductDrawer.jsx";
import SettingDrawer from "../../inventory/common/SettingDrawer.jsx";
import Navigation from "../../inventory/common/Navigation.jsx";

function _GenericRequisitionForm(props) {
  const {
    currencySymbol,
    allowZeroPercentage,
    domainId,
    isSMSActive,
    isZeroReceiveAllow,
  } = props;

  //common hooks and variables
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 360;

  //segmented control
  const [switchValue, setSwitchValue] = useState("product");

  //setting drawer control
  const [settingDrawer, setSettingDrawer] = useState(false);

  //product drawer control
  const [productDrawer, setProductDrawer] = useState(false);

  //sales by barcode comes from backend now static value
  const [salesByBarcode, setSalesByBarcode] = useState(true);

  //warehosue dropdown data
  let warehouseDropdownData = getCoreWarehouseDropdownData();

  //warehouse hook
  const [warehouseData, setWarehouseData] = useState(null);

  //vendor hook
  const [vendorData, setVendorData] = useState(null);

  //unit type hook
  const [unitType, setUnitType] = useState(null);

  //product hook
  const [product, setProduct] = useState(null);

  //product search hook
  const [searchValue, setSearchValue] = useState("");

  //product dropdown hook
  const [productDropdown, setProductDropdown] = useState([]);

  const [vendorObject, setVendorObject] = useState({});

  //product dropdown update based on searchValue
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

  //input group currency to show in input right section
  const inputGroupCurrency = (
    <Text
      style={{ textAlign: "right", width: "100%", paddingRight: 16 }}
      color={"gray"}
    >
      {currencySymbol}
    </Text>
  );

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

  //no use code
  const [stockProductRestore, setStockProductRestore] = useState(false);
  useEffect(() => {
    if (stockProductRestore) {
      const local = productsDataStoreIntoLocalStorage();
      console.log(local);
    }
  }, [stockProductRestore]);

  //product add form

  const form = useForm({
    initialValues: {
      vendor_id: "",
      product_id: "",
      price: "",
      purchase_price: "",
      barcode: "",
      sub_total: "",
      quantity: "",
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
    },
  });

  //actions when product is selected from table or form
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

  //selected product group text to show in input
  const inputGroupText = (
    <Text
      style={{ textAlign: "right", width: "100%", paddingRight: 16 }}
      color={"gray"}
    >
      {selectProductDetails && selectProductDetails.unit_name}
    </Text>
  );

  //action when quantity or sales price is changed
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

  //action when sales percent is changed
  useEffect(() => {
    if (form.values.quantity && form.values.price) {
      const discountAmount = (form.values.price * form.values.percent) / 100;
      const salesPrice = form.values.price - discountAmount;

      form.setFieldValue("sales_price", salesPrice);
      form.setFieldValue("sub_total", salesPrice);
    }
  }, [form.values.percent]);

  // adding product from table
  const [productQuantities, setProductQuantities] = useState({});

  //handle add product by product Id
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
        });
      }
      return acc;
    }, myCardProducts);
    setVendorData(null);
    setLoadCardProducts(true);
    updateLocalStorageAndResetForm(addProducts, "productId");
  }

  // handle prodcut by barcode id
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
      setLoadCardProducts(true);
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
  function createProductFromValues(product, values) {
    return {
      product_id: product.product_id,
      display_name: product.display_name,
      quantity: values?.quantity,
      purchase_price: product.purchase_price,
      sales_price: product.sales_price,
      sub_total: values.quantity * product.purchase_price,
    };
  }

  //category hook
  const [categoryData, setCategoryData] = useState(null);

  //products hook
  const [products, setProducts] = useState([]);

  //product filter based on category id and set the dropdown value for product dropdown
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

    // Transform product for dropdown
    const transformedProducts = filteredProducts.map((product) => ({
      label: `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.sales_price}`,
      value: String(product.id),
    }));
    setProductDropdown(transformedProducts);
  }, [categoryData]);

  //update local storage and reset form values
  function updateLocalStorageAndResetForm(addProducts) {
    localStorage.setItem("temp-requisition-products", JSON.stringify(addProducts));
    setSearchValue("");
    setWarehouseData(null);
    setProduct(null);
    form.reset();
    document.getElementById("product_id").focus();
  }

  //load cart product hook
  const [loadCardProducts, setLoadCardProducts] = useState(false);

  // temp cart product hook
  const [tempCardProducts, setTempCardProducts] = useState([]);

  //load cart products from local storage
  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-requisition-products");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);
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
  // change subtotal by quantity
  const changeSubTotalByQuantity = (event) => {
    const quantity = Number(event.target.value);
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
  };

  //change subtotal by price
  const changeSubTotalByPrice = (event) => {
    const purchase_price = Number(event.target.value);
    const quantity = Number(form.values.quantity);
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
  };

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
                setTimeout(() => {}, 1000);
              } else {
                const cardProducts = localStorage.getItem(
                  "temp-requisition-products"
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
                        {t("NewRequisition")}
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
                                      "temp-requisition-products"
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
                                      quantity: quantity,
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
                                          )?.label
                                        : null,
                                      bonus_quantity: 0,
                                    };

                                    myCardProducts.push(productToAdd);

                                    // Update localStorage and reset form values
                                    localStorage.setItem(
                                      "temp-requisition-products",
                                      JSON.stringify(myCardProducts)
                                    );

                                    // Show success notification
                                    notifications.show({
                                      color: "green",
                                      title: t("ProductAdded"),
                                      message: t("ProductAddedSuccessfully"),
                                      autoClose: 1500,
                                      withCloseButton: true,
                                    });
                                    //update the sales table
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
                      height={height - 45}
                    />
                  </Box>

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
                      <>
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
                              className={genericClass.genericPrimaryBg}
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
                                bg={"#905923"}
                                onClick={() => setProductDrawer(true)}
                              >
                                <IconPlus stroke={1} />
                              </ActionIcon>
                            </Tooltip>
                          </Box>
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Box
                      p={"xs"}
                      mt={"8"}
                      className={genericClass.genericHighlightedBox}
                      ml={"-xs"}
                      mr={-8}
                    >
                      <Grid gutter={{ base: 6 }}>
                        <Grid.Col span={12}>
                          <Box>
                    <SelectForm
                    tooltip={t("VendorValidateMessage")}
                    label=""
                    placeholder={t("warehouse")}
                    required={false}
                    nextField={"warehouse_id"}
                    name={"vendor_id"}
                    form={form}
                    dropdownValue={vendorsDropdownData}
                    id={"vendor_id"}
                    mt={1}
                    searchable={true}
                    value={vendorData}
                    changeValue={setVendorData}
                    />
                          </Box>
                        </Grid.Col>

                      </Grid>
                    </Box>
                    </>
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
                          <Grid.Col span={6}>
                            <InputButtonForm
                              tooltip={t("QuantityValidateMessage")}
                              label=""
                              placeholder={t("Quantity")}
                              required={true}
                              nextField={"EntityFormSubmit"}
                              form={form}
                              name={"quantity"}
                              id={"quantity"}
                              type={"number"}
                              onChange={changeSubTotalByQuantity}
                              rightSection={inputGroupText}
                              rightSectionWidth={50}
                              leftSection={
                                <IconSortAscendingNumbers
                                  size={16}
                                  opacity={0.5}
                                />
                              }
                            />
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <InputNumberForm
                              type="number"
                              tooltip={t("PurchasePriceValidateMessage")}
                              label=""
                              placeholder={t("PurchasePrice")}
                              required={true}
                              form={form}
                              name={"purchase_price"}
                              id={"purchase_price"}
                              rightIcon={
                                <IconCurrency size={16} opacity={0.5} />
                              }
                              closeIcon={true}
                              disabled={true}
                              onChange={changeSubTotalByPrice}
                              leftSection={
                                <IconCoinMonero size={16} opacity={0.5} />
                              }
                            />
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box>
                        <Grid columns={12} gutter={{ base: 8 }}>
                          <Grid.Col span={4}></Grid.Col>
                          <Grid.Col span={4}></Grid.Col>
                          <Grid.Col span={4}>
                            <Box style={{ display: "none" }}>
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
          <__RequistionForm
            currencySymbol={currencySymbol}
            domainId={domainId}
            isSMSActive={isSMSActive}
            isZeroReceiveAllow={isZeroReceiveAllow}
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

export default _GenericRequisitionForm;
