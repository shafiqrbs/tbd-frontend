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
  Input, ScrollArea, TextInput,
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
  IconDotsVertical, IconSearch, IconX, IconInfoCircle,
} from "@tabler/icons-react";
import { hasLength, useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import { DataTable } from "mantine-datatable";
import _ShortcutInvoice from "../../shortcut/_ShortcutInvoice";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import Navigation from "../common/Navigation.jsx";
import __PosPurchaseForm from "./__PosPurchaseForm.jsx";
import SettingDrawer from "../common/SettingDrawer.jsx";
import { useHotkeys } from "@mantine/hooks";

function _GenericInvoiceForm(props) {
 // const { domainConfigData } = props;

  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))

  let currencySymbol = domainConfigData?.inventory_config?.currency?.symbol;
  // let allowZeroPercentage = domainConfigData?.inventory_config?.zero_stock;
  let allowZeroPercentage = true;
  let domainId = domainConfigData?.inventory_config?.domain_id;
  let isSMSActive = domainConfigData?.inventory_config?.is_active_sms;
  let isWarehouse =
    domainConfigData?.inventory_config?.config_purchase?.search_by_warehouse;
  let isPurchaseByPurchasePrice =
    domainConfigData?.inventory_config?.is_purchase_by_purchase_price;

  let inventory_config = domainConfigData?.inventory_config;
  let configPurchase = inventory_config?.config_purchase;
  let id = domainConfigData?.id;

  //common hooks and variables
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 360;
  const itemFromHeight = mainAreaHeight - 198;

  //segmented control
  const [switchValue, setSwitchValue] = useState("product");

  //setting drawer control
  const [settingDrawer, setSettingDrawer] = useState(false);

  //product drawer control
  const [productDrawer, setProductDrawer] = useState(false);



  //warehosue dropdown data
  let warehouseDropdownData = getCoreWarehouseDropdownData();

  //warehouse hook
  const [warehouseData, setWarehouseData] = useState(null);

  //vendor hook
  const [vendorData, setVendorData] = useState(null);

  //unit type hook
  const [unitType, setUnitType] = useState(null);
  const [selectUnitDetails, setSelectUnitDetails] = useState(null);
  const [unitDropdown, setUnitDropdown] = useState([]);



  //product hook
  const [product, setProduct] = useState(null);

  //product multi price hook
  const [multiPrice, setMultiPrice] = useState(null);

  //product search hook
  const [searchValue, setSearchValue] = useState("");

  //product dropdown hook
  const [productDropdown, setProductDropdown] = useState([]);



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
    }
  }, [stockProductRestore]);

  //product add form

  const form = useForm({
    initialValues: {
      multi_price: "",
      price: "",
      purchase_price: "",
      unit_id: "",
      quantity: "",
      bonus_quantity: "",
      percent: "",
      product_id: "",
      barcode: "",
      sub_total: "",
      warehouse_id: "",
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
      if (configPurchase?.is_measurement_enable === 1 && selectedProduct.measurements) {
        const unitDropdown = selectedProduct.measurements.map((unit) => ({
          label: unit.unit_name+' (1 '+unit.unit_name+'='+unit.quantity+' '+selectedProduct.unit_name+')',
          value: String(unit.id),
        }));
        setUnitDropdown(unitDropdown);
      }

      form.setFieldValue("price", selectedProduct.purchase_price);
      form.setFieldValue("purchase_price", selectedProduct.purchase_price);
      document.getElementById("quantity").focus();
    } else {
      setSelectProductDetails(null);
      form.setFieldValue("price", "");
      form.setFieldValue("purchase_price", "");
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
    const salesPrice = Number(form.values.purchase_price);

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
          purchase_price: salesPrice,
        }));
        form.setFieldValue("sub_total", quantity * salesPrice);
      }
    }
  }, [form.values.quantity, form.values.purchase_price]);

  //action when sales percent is changed
  useEffect(() => {
    if (form.values.quantity && form.values.price) {
      const discountAmount = (form.values.price * form.values.percent) / 100;
      const salesPrice = form.values.price - discountAmount;

      form.setFieldValue("purchase_price", salesPrice);
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

  //category hook
  const [categoryData, setCategoryData] = useState(null);

  //products hook
  const [products, setProducts] = useState([]);

  //product filter based on category id and set the dropdown value for product dropdown
  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
    let filteredProducts = localProducts.filter((product) => {
      // return product.product_nature !== "raw-materials";
      return product;
    });

    console.log(configPurchase);
    if (searchValue) {
      const searchValueLower = searchValue.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
          product.name?.toString().toLowerCase().includes(searchValueLower) ||
          product.unit_name?.toString().toLowerCase().includes(searchValueLower) ||
          product.quantity?.toString().toLowerCase().includes(searchValueLower)
      );
    }
    setProducts(filteredProducts);


    // Transform product for dropdown
    const transformedProducts = filteredProducts.map((product) => ({
      label: `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.purchase_price}`,
      value: String(product.id),
    }));
    setProductDropdown(transformedProducts);
  }, [categoryData]);

  //update local storage and reset form values
  function updateLocalStorageAndResetForm(addProducts, type) {
    localStorage.setItem("temp-purchase-products", JSON.stringify(addProducts));
    setSearchValue("");
    setWarehouseData(null);
    setProduct(null);
    form.reset();
    setLoadCardProducts(true);
    document.getElementById("product_id").focus();

  }

  //load cart product hook
  const [loadCardProducts, setLoadCardProducts] = useState(false);

  // temp cart product hook
  const [tempCardProducts, setTempCardProducts] = useState([]);

  //load cart products from local storage
  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-purchase-products");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);
  let categoryDropDownData = getSettingCategoryDropdownData();
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
  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={1}>
          <Navigation module={'module'} />
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
                        {t("VendorPurchaseInvoice")}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={5} align="center">
                      <Group justify="flex-end" align="center" gap={4}>
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
                                value: "list",
                              },
                            ]}
                        />
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
                <Box className="boxBackground">
                  <Box  pt={'0'}>
                <Box>
                  {switchValue === "product" && (
                      <>
                      <ScrollArea h={itemFromHeight} scrollbarSize={2} scrollbars="y" type="never">
                        {configPurchase?.is_barcode === 1 && (
                            <Box  p={"xs"} className={genericClass.genericHighlightedBox}>
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
                        <Box  pl={"xs"} pr={'xs'}>
                        {configPurchase?.search_by_vendor === 1 && (
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
                        )}

                        {configPurchase?.search_by_category === 1 && (
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
                                  comboboxProps={{ withinPortal: false }}
                              />
                            </Box>
                        )}
                      </Box>
                        <Box
                            p={"xs"}
                            mt={"4"}
                            className={genericClass.genericHighlightedBox}>
                          <Grid gutter={{ base: 6 }}>
                    <Grid.Col span={11}>
                    <Box>
                    <SelectForm
                    tooltip={t("ChooseProduct")}
                    label={""}
                    placeholder={t("ChooseProduct")}
                    required={true}
                    nextField={"purchase_price"}
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
                        <Box  pl={"xs"} pr={'xs'}>
                          {configPurchase?.is_warehouse === 1 && (
                              <Box  mt={"4"}>
                                <Grid columns={24} gutter={{ base: 1 }}>
                              <Grid.Col span={10} fz="sm" mt={8}>
                                {t("Warehouse")}
                              </Grid.Col>
                              <Grid.Col span={14}>
                                <SelectForm
                                    tooltip={t("Warehouse")}
                                    label=""
                                    placeholder={t("Warehouse")}
                                    required={false}
                                    nextField={"purchase_price"}
                                    name={"warehouse_id"}
                                    form={form}
                                    dropdownValue={warehouseDropdownData}
                                    id={"warehouse_id"}
                                    mt={1}
                                    searchable={true}
                                    value={warehouseData}
                                    changeValue={setWarehouseData}
                                />
                              </Grid.Col>
                            </Grid>
                              </Box>
                          )}
                          <Box  mt={"4"}>
                            <Grid columns={24} gutter={{ base: 1 }}>
                            <Grid.Col span={10} fz="sm" mt={8}>
                              {t("PurchasePrice")}
                            </Grid.Col>
                            <Grid.Col span={14}>
                              <InputNumberForm
                                  tooltip={t("PurchasePriceValidateMessage")}
                                  label=""
                                  placeholder={t("PurchasePrice")}
                                  required={true}
                                  nextField={ configPurchase?.item_percent === 1 ? "price" : 'quantity' }
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
                            {configPurchase?.item_percent === 1 && (
                                <Box  mt={"4"}>
                                <Grid columns={24} gutter={{ base: 1 }}>
                                  <Grid.Col span={10} fz="sm" mt={8}>
                                    {t("ItemPercent")}
                                  </Grid.Col>
                                  <Grid.Col span={14}>
                                    <InputNumberForm
                                        tooltip={t("PercentValidateMessage")}
                                        label=""
                                        placeholder={t("Percent")}
                                        required={true}
                                        nextField={"price"}
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
                                </Grid>
                              </Box>
                            )}
                            <Box  mt={"4"}>
                                <Grid columns={24} gutter={{ base: 1 }}>
                              <Grid.Col span={10} fz="sm" mt={8}>
                                {t("Price")}
                              </Grid.Col>
                              <Grid.Col span={14}>
                                <InputNumberForm
                                    tooltip={t("SalesPriceValidateMessage")}
                                    label=""
                                    placeholder={t("SalesPrice")}
                                    required={true}
                                    nextField={ configPurchase?.is_measurement_enable === 1 ? "unit_id" : 'quantity' }
                                    form={form}
                                    name={"price"}
                                    id={"price"}
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
                            {configPurchase?.is_measurement_enable === 1 && (
                                <Box  mt={"4"}>
                                  <Grid columns={24} gutter={{ base: 1 }}>
                                    <Grid.Col span={10} fz="sm" mt={8}>
                                      {t("UnitMeasurement")}
                                    </Grid.Col>
                                    <Grid.Col span={14}>
                                      <SelectForm
                                          tooltip={t("UnitValidateMessage")}
                                          label=""
                                          placeholder={t("UnitMeasurement")}
                                          required={false}
                                          nextField={"quantity"}
                                          name={"unit_id"}
                                          form={form}
                                          dropdownValue={unitDropdown}
                                          id={"unit_id"}
                                          mt={1}
                                          searchable={false}
                                          value={unitType}
                                          changeValue={(e)=>{
                                            setUnitType(e)
                                          }}
                                      />
                                    </Grid.Col>
                                  </Grid>
                                </Box>
                            )}

                            <Box  mt={"4"}>
                            <Grid columns={24} gutter={{ base: 1 }}>
                              <Grid.Col span={10} fz="sm" mt={8}>
                                {t("Quantity")}
                              </Grid.Col>
                              <Grid.Col span={14}>
                                <InputButtonForm
                                    type="number"
                                    tooltip={t("BonusQuantityValidateMessage")}
                                    label=""
                                    placeholder={t("Quantity")}
                                    required={true}
                                    nextField={ configPurchase?.is_bonus_quantity === 1 ? "bonus_quantity" : 'EntityFormSubmit' }
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
                            </Grid>
                          </Box>
                          {configPurchase?.is_bonus_quantity === 1 && (
                              <Box  mt={"4"}>
                                <Grid columns={24} gutter={{ base: 1 }}>
                              <Grid.Col span={10} fz="sm" mt={8}>
                                {t("BonusQuantity")}
                              </Grid.Col>
                              <Grid.Col span={14}>
                                <InputButtonForm
                                    type="number"
                                    tooltip={t("PercentValidateMessage")}
                                    label=""
                                    placeholder={t("BonusQuantity")}
                                    required={true}
                                    nextField={"EntityFormSubmit"}
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
                          )}
                        </Box>
                      </ScrollArea>
                      </>
                  )}
                </Box>
                  {switchValue === "list" && (
                    <Box>
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
                                      const quantity =
                                          productQuantities[data.id];
                                      if (quantity && Number(quantity) > 0) {
                                        const cardProducts =
                                            localStorage.getItem(
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
                                          warehouse_name: form.values
                                              .warehouse_id
                                              ? warehouseDropdownData.find(
                                                  (warehouse) =>
                                                      warehouse.value ===
                                                      form.values.warehouse_id
                                              ).label
                                              : null,
                                          bonus_quantity:
                                          form.values.bonus_quantity,
                                        };

                                        myCardProducts.push(productToAdd);

                                        // Update localStorage and reset form values
                                        localStorage.setItem(
                                            "temp-purchase-products",
                                            JSON.stringify(myCardProducts)
                                        );
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
                                          message: t(
                                              "PleaseEnterValidQuantity"
                                          ),
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
                      height={itemFromHeight+52}
                      scrollAreaProps={{
                        scrollbarSize: 8,
                      }}
                  />
                </Box>
                  )}
                </Box>
                </Box>
                {switchValue === "product" && (
                <>
                  <Box p={"xs"} className={genericClass.genericHighlightedBox}>
                    <Grid columns={24} gutter={{ base: 1 }}>
                      <Grid.Col span={10} fz="sm" fw={'800'} mt={8}>
                        {t("SubTotal")}
                      </Grid.Col>
                      <Grid.Col span={14}>
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
                        <Text ta="right" mt={"8"} fw={'800'} pr={'xs'}>
                          {currencySymbol}{" "}
                          {selectProductDetails
                              ? selectProductDetails.sub_total
                              : 0}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Box>
                  <Box mt="2"  className="" pl={'xs'} pt={'4'} pb={'6'}>
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
                              id={'EntityFormSubmit'}
                              mt={0}
                              mr={"xs"}
                              w={"100%"}
                              leftSection={<IconPlus size={16}/>}>
                            <Flex direction={`column`} gap={0}>
                              <Text fz={12} fw={400}>
                                {t("Add")}
                              </Text>
                              <Flex direction={`column`} align={'center'} fz={'12'} c={'gray.5'}>alt+a</Flex>
                            </Flex>
                          </Button>
                        </Box>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </>
                )}
                {switchValue === "list" && (
                    <>
                      <Box mt="2"  className="" pl={'xs'} pt={'4'} pb={'6'}>
                        <Grid
                            className={genericClass.genericBackground}
                            columns={12}
                            justify="space-between"
                            align="center"
                        >
                          <Grid.Col span={8}>
                            <Box>
                              <Tooltip
                                  label={t("EnterSearchAnyKeyword")}
                                  px={16}
                                  py={2}
                                  position="top-end"
                                  color="red"
                                  withArrow
                                  offset={2}
                                  zIndex={100}
                                  transitionProps={{
                                    transition: "pop-bottom-left",
                                    duration: 1000,
                                  }}
                              >
                                <TextInput
                                    leftSection={
                                      <IconSearch size={16} opacity={0.5} />
                                    }
                                    size="sm"
                                    placeholder={t("ChooseProduct")}
                                    onChange={(e) => {
                                      setSearchValue(e.target.value);
                                    }}
                                    value={searchValue}
                                    id={"SearchKeyword"}
                                    rightSection={
                                      searchValue ? (
                                          <Tooltip
                                              label={t("Close")}
                                              withArrow
                                              bg={`red.5`}
                                          >
                                            <IconX
                                                color={`red`}
                                                size={16}
                                                opacity={0.5}
                                                onClick={() => {
                                                  setSearchValue("");
                                                }}
                                            />
                                          </Tooltip>
                                      ) : (
                                          <Tooltip
                                              label={t("FieldIsRequired")}
                                              withArrow
                                              position={"bottom"}
                                              c={"red"}
                                              bg={`red.1`}
                                          >
                                            <IconInfoCircle size={16} opacity={0.5} />
                                          </Tooltip>
                                      )
                                    }
                                />
                              </Tooltip>
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
                                    {t("AddAll")}
                                  </Text>
                                </Flex>
                              </Button>
                            </Box>
                          </Grid.Col>
                        </Grid>
                      </Box>
                    </>
                )}

              </Box>
            </Box>
          </form>
        </Grid.Col>
        <Grid.Col span={16}>
          <__PosPurchaseForm
            currencySymbol={currencySymbol}
            domainId={domainId}
            isSMSActive={isSMSActive}
            tempCardProducts={tempCardProducts}
            setLoadCardProducts={setLoadCardProducts}
            isWarehouse={isWarehouse}
            domainConfigData={domainConfigData}
          />
        </Grid.Col>
      </Grid>
      {settingDrawer && (
        <SettingDrawer
          settingDrawer={settingDrawer}
          setSettingDrawer={setSettingDrawer}
          module={"Purchase"}
          domainConfigData={domainConfigData}
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

export default _GenericInvoiceForm;
