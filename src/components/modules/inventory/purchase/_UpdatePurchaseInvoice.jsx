import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
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
    Input, ScrollArea,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
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
    IconShoppingBag, IconSearch, IconInfoCircle,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import InputButtonForm from "../../../form-builders/InputButtonForm.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import Navigation from "../common/Navigation.jsx";

import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import SettingDrawer from "../common/SettingDrawer.jsx";
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer.jsx";
import __PosPurchaseUpdateForm from "./__PosPurchaseUpdateForm.jsx";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import SelectFormForSalesPurchaseProduct from "../../../form-builders/SelectFormForSalesPurchaseProduct.jsx";
import __PosPurchaseForm from "./__PosPurchaseForm.jsx";

function _UpdatePurchaseInvoice(props) {

    const { editedData } = props;
    const [domainConfigData, setDomainConfigData] = useState(props.domainConfigData);
    //common hooks and variables
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const itemFromHeight = mainAreaHeight - 198;
    let currencySymbol = domainConfigData?.inventory_config?.currency?.symbol;
    let isWarehouse = domainConfigData?.inventory_config?.config_purchase?.is_warehouse;
    let categoryDropDownData = getSettingCategoryDropdownData();

    let inventory_config = domainConfigData?.inventory_config;

    let configPurchase = inventory_config?.config_purchase;
    let purchaseMode = configPurchase.purchase_mode
    let domainId = domainConfigData?.inventory_config?.domain_id;

    let allowZeroPercentage = true;
    let isSMSActive = domainConfigData?.inventory_config?.is_active_sms;
    let isPurchaseByPurchasePrice = domainConfigData?.inventory_config?.is_purchase_by_purchase_price;



    const [searchValue, setSearchValue] = useState("");
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([]);
    const [loadCardProducts, setLoadCardProducts] = useState(false);

    /*get warehouse dropdown data*/
    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);
    const [unitDropdown, setUnitDropdown] = useState([]);



    const [stockProductRestore, setStockProductRestore] = useState(false);
    useEffect(() => {
        if (stockProductRestore) {
            const local = productsDataStoreIntoLocalStorage();
        }
    }, [stockProductRestore]);

    useEffect(() => {
        localStorage.removeItem("temp-purchase-products");
        localStorage.setItem(
            "temp-purchase-products",
            JSON.stringify(editedData?.purchase_items || [])
        );
        setTempCardProducts(
            editedData?.purchase_items ? editedData.purchase_items : []
        );
        setLoadCardProducts(false);
    }, []);
    useEffect(() => {
        if (loadCardProducts) {
            const cardProducts = localStorage.getItem("temp-purchase-products");
            setTempCardProducts(cardProducts ? JSON.parse(cardProducts) : []);
            setLoadCardProducts(false);
        }
    }, [loadCardProducts]);

    useEffect(() => {
        if (searchValue.length > 0) {
            const storedProducts = localStorage.getItem("core-products");
            const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

            const domainProductNature = JSON.parse(configPurchase?.purchase_product_nature || '[]');
            let filteredProducts = localProducts.filter((product) => {
                const isAllowedNature = domainProductNature.includes(product.product_nature_id);

                if (!isAllowedNature) return false;
                return true;
            });

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

    // Keyboard shortcuts
    useHotkeys([
        ['alt+n', () => document.getElementById('product_id')?.focus()],
        ['alt+r', () => form.reset()],
        ['alt+s', () => document.getElementById('EntityFormSubmit')?.click()]
    ]);
    const inputGroupText = (
        <Text
            style={{textAlign: "right", width: "100%", paddingRight: 16}}
            color={"gray"}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text
            style={{textAlign: "right", width: "100%", paddingRight: 16}}
            color={"gray"}
        >
            {domainConfigData?.currency?.symbol}
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
        if (!settingDrawer) {
            // drawer closed: re-fetch latest domain config
            const latestDomainConfig = JSON.parse(localStorage.getItem("domain-config-data"));
            if (latestDomainConfig) {
                setDomainConfigData(latestDomainConfig);
            }
        }
    }, [settingDrawer]);

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

    // Filter products by vendor and category
    useEffect(() => {
        const storedProducts = localStorage.getItem("core-products");
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const domainProductNature = JSON.parse(configPurchase?.purchase_product_nature || '[]');
        let filteredProducts = localProducts.filter((product) =>
            domainProductNature.includes(product.product_nature_id)
        );

        if (categoryData) {
            filteredProducts = filteredProducts.filter(
                (product) => product.category_id === Number(categoryData.value)
            );
        }
        if (vendorData) {
            filteredProducts = filteredProducts.filter(
                (product) => product.vendor_id === Number(vendorData.value)
            );
        }

        setProducts(filteredProducts);

        // Build dropdown
        const formatted = filteredProducts.map((product) => {
            let label = "";

            if (purchaseMode === "mrp-price") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.sales_price}`;
            } else if (purchaseMode === "purchase-price") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.purchase_price}`;
            } else {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name}`;
            }

            return {
                label,
                value: String(product.id),
            };
        });

        setProductDropdown(formatted);
    }, [categoryData, vendorData, configPurchase]);


    const handleFormSubmit = (values) => {
        if (!values.barcode && !values.product_id) {
            form.setFieldError("barcode", true);
            form.setFieldError("product_id", true);
            isWarehouse && form.setFieldError("warehouse_id", true);
            setTimeout(() => {
            }, 1000);
        } else {
            const cardProducts = localStorage.getItem("temp-purchase-products");
            const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
            const storedProducts = localStorage.getItem("core-products");
            const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

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
    }
// Detect Enter key in barcode field to auto-add product
    useEffect(() => {
        const barcodeInput = document.getElementById("barcode");
        if (!barcodeInput) return;

        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                const cardProducts = JSON.parse(
                    localStorage.getItem("temp-purchase-products") || "[]"
                );
                const localProducts = JSON.parse(
                    localStorage.getItem("core-products") || "[]"
                );

                if (form.values.barcode) {
                    handleAddProductByBarcode(form.values, cardProducts, localProducts);
                }
            }
        };

        barcodeInput.addEventListener("keydown", handleKeyDown);
        return () => barcodeInput.removeEventListener("keydown", handleKeyDown);
    }, [form.values.barcode]);


    // Create or Update product in cart
    const createOrUpdateProduct = (
        values,
        product,
        myCardProducts,
        warehouseDropdownData,
        purchaseMode
    ) => {
        const quantityToSet = Number(values.quantity) || 1;
        const bonusQuantityToSet = Number(values.bonus_quantity) || 0;
        const totalAmount = Number(values.total_amount) || 0;

        const purchasePrice =
            purchaseMode === "split-amount"
                ? totalAmount / quantityToSet
                : Number(values.purchase_price || product.purchase_price || 0);

        const salesPrice =
            purchaseMode === "split-amount"
                ? totalAmount / quantityToSet
                : Number(values.price || product.sales_price || 0);

        const subTotal =
            purchaseMode === "split-amount"
                ? totalAmount
                : quantityToSet * purchasePrice;

        let updated = false;

        const updatedProducts = myCardProducts.map((item) => {
            if (item.product_id === product.id) {
                updated = true;

                return {
                    ...item,
                    quantity: quantityToSet,
                    bonus_quantity: bonusQuantityToSet,
                    purchase_price: purchasePrice,
                    sales_price: salesPrice,
                    sub_total: subTotal,
                    warehouse_id: values.warehouse_id
                        ? Number(values.warehouse_id)
                        : item.warehouse_id,
                    warehouse_name: values.warehouse_id
                        ? warehouseDropdownData.find(
                        (w) => w.value === values.warehouse_id
                    )?.label || ""
                        : item.warehouse_name,
                };
            }
            return item;
        });

        if (!updated) {
            updatedProducts.push({
                product_id: product.id,
                display_name: product.display_name,
                quantity: quantityToSet,
                bonus_quantity: bonusQuantityToSet,
                unit_name: product.unit_name,
                purchase_price: purchasePrice,
                sales_price: salesPrice,
                sub_total: subTotal,
                warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
                warehouse_name: values.warehouse_id
                    ? warehouseDropdownData.find((w) => w.value === values.warehouse_id)
                    ?.label || null
                    : null,
            });
        }

        return updatedProducts;
    };

// Add product by product_id dropdown
    const handleAddProductByProductId = (
        values,
        myCardProducts,
        localProducts
    ) => {
        const productIdToAdd = Number(values.product_id);

        const product = localProducts.find((p) => p.id === productIdToAdd);
        if (!product) {
            notifications.show({
                color: "red",
                title: t("Invalid Product"),
                message: t("This product doesn't exist in local storage"),
                autoClose: 2000,
            });
            return;
        }

        const finalProducts = createOrUpdateProduct(
            values,
            product,
            myCardProducts,
            warehouseDropdownData,
            purchaseMode
        );

        setLoadCardProducts(true);
        updateLocalStorageAndResetForm(finalProducts, "productId");
    };

// Add product by barcode
    const handleAddProductByBarcode = (
        values,
        myCardProducts,
        localProducts
    ) => {
        const barcode = String(values.barcode).trim();
        const product = localProducts.find(
            (p) => String(p.barcode).trim() === barcode
        );

        if (!product) {
            showNotificationComponent("Product not found with this barcode", "red");
            return;
        }

        form.setFieldValue("product_id", String(product.id));

        const updatedProducts = createOrUpdateProduct(
            values,
            product,
            myCardProducts,
            warehouseDropdownData,
            purchaseMode
        );

        setLoadCardProducts(true);
        updateLocalStorageAndResetForm(updatedProducts, "barcode");
    };

// Reset form & update localstorage
    const updateLocalStorageAndResetForm = (addProducts, type) => {
        localStorage.setItem("temp-purchase-products", JSON.stringify(addProducts));
        form.setFieldValue("quantity", "");
        form.setFieldValue("barcode", "");
        form.setFieldValue("sub_total", "");
        form.setFieldValue("product_id", "");
        form.setFieldValue("warehouse_id", "");
        if (configPurchase?.is_bonus_quantity === 1) {
            form.setFieldValue("bonus_quantity", "");
        }

        setProduct(null);
        setWarehouseData(null);
        setUnitType(null);
        setLoadCardProducts(true);

        setTimeout(() => {
            if (type === "productId") {
                document.getElementById("product_id")?.focus();
            } else {
                document.getElementById("barcode")?.focus();
            }
        }, 50);
    };

    return (
        <Box>
            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={7}>
                    <form
                        onSubmit={form.onSubmit((values) => {
                            if (!values.product_id) {
                                form.setFieldError("product_id", true);
                                if (isWarehouse) form.setFieldError("warehouse_id", true);
                                return;
                            }

                            const cardProducts = JSON.parse(
                                localStorage.getItem("temp-purchase-products") || "[]"
                            );
                            const localProducts = JSON.parse(
                                localStorage.getItem("core-products") || "[]"
                            );

                            handleAddProductByProductId(values, cardProducts, localProducts);
                        })}
                    >


                        <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
                            <Box>
                                <Box mb={"xs"}>
                                    <Grid columns={12} gutter={{base: 2}}>
                                        <Grid.Col span={7}>
                                            <Text fz="md" fw={500} className={classes.cardTitle}>
                                                {t("VendorPurchaseInvoice")}
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={5} align="center">
                                            <Group justify="flex-end" align="center" gap={4}>
                                                <Tooltip
                                                    multiline
                                                    bg='var( --theme-primary-color-8)'
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
                                                        onClick={() => {
                                                            setSettingDrawer(true);
                                                        }}
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

                                {/*item added for purchase*/}
                                <Box className="boxBackground">
                                    <Box pt={'0'}>
                                        <ScrollArea h={itemFromHeight} scrollbarSize={2} scrollbars="y" type="never">
                                            {configPurchase?.is_barcode === 1 && (
                                                <Box p={"xs"}
                                                     className={genericClass.genericHighlightedBox}>
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
                                            <Box pl={"xs"} pr={'xs'}>
                                                {configPurchase?.search_by_vendor === 1 && (
                                                    <Box mt={"8"}>
                                                        <SelectForm
                                                            tooltip={t("Vendor")}
                                                            label=""
                                                            placeholder={t("Vendor")}
                                                            required={false}
                                                            nextField={"product_id"}
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
                                                            comboboxProps={{withinPortal: false}}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box
                                                p={"xs"}
                                                mt={"4"}
                                                className={genericClass.genericHighlightedBox}>
                                                <Grid gutter={{base: 6}}>
                                                    <Grid.Col span={11}>
                                                        <Box>

                                                            <SelectFormForSalesPurchaseProduct
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
                                                                changeValue={setProduct}
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
                                                                    bg='var( --theme-primary-color-8)'
                                                                    onClick={() => setProductDrawer(true)}
                                                                >
                                                                    <IconPlus stroke={1}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box pl={"xs"} pr={'xs'}>
                                                {domainConfigData?.inventory_config?.sku_warehouse === 1 && configPurchase?.is_warehouse === 1 && (
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
                                                            <Grid.Col span={10} fz="sm" mt={8}>
                                                                {t("Warehouse")}
                                                            </Grid.Col>
                                                            <Grid.Col span={14}>
                                                                <SelectFormForSalesPurchaseProduct
                                                                    tooltip={t("Warehouse")}
                                                                    label=""
                                                                    placeholder={t("Warehouse")}
                                                                    required={false}
                                                                    nextField={"quantity"}
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

                                                {
                                                    purchaseMode === 'purchase-price' &&
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
                                                            <Grid.Col span={10} fz="sm" mt={8}>
                                                                {t("PurchasePrice")}
                                                            </Grid.Col>
                                                            <Grid.Col span={14}>
                                                                <InputNumberForm
                                                                    tooltip={t("PurchasePriceValidateMessage")}
                                                                    label=""
                                                                    placeholder={t("PurchasePrice")}
                                                                    required={true}
                                                                    nextField={configPurchase?.item_percent === 1 ? "price" : 'quantity'}
                                                                    form={form}
                                                                    name={"purchase_price"}
                                                                    id={"purchase_price"}
                                                                    disabled={!isPurchaseByPurchasePrice}
                                                                    leftSection={
                                                                        <IconPlusMinus size={16} opacity={0.5}/>
                                                                    }
                                                                    rightIcon={
                                                                        <IconCurrency size={16} opacity={0.5}/>
                                                                    }
                                                                />
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                }
                                                {
                                                    purchaseMode === 'mrp-price' &&
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
                                                            <Grid.Col span={10} fz="sm" mt={8}>
                                                                {t("SalesPrice")}
                                                            </Grid.Col>
                                                            <Grid.Col span={14}>
                                                                <InputNumberForm
                                                                    tooltip={t("SalesPriceValidateMessage")}
                                                                    label=""
                                                                    placeholder={t("SalesPrice")}
                                                                    required={true}
                                                                    nextField={configPurchase?.is_measurement_enable === 1 ? "unit_id" : 'quantity'}
                                                                    form={form}
                                                                    name={"price"}
                                                                    id={"price"}
                                                                    disabled={!isPurchaseByPurchasePrice}
                                                                    leftSection={
                                                                        <IconPlusMinus size={16} opacity={0.5}/>
                                                                    }
                                                                    rightIcon={
                                                                        <IconCurrency size={16} opacity={0.5}/>
                                                                    }
                                                                />
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                }


                                                {
                                                    purchaseMode === 'split-amount' &&
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
                                                            <Grid.Col span={10} fz="sm" mt={8}>
                                                                {t("TotalAmount")}
                                                            </Grid.Col>
                                                            <Grid.Col span={14}>
                                                                <InputNumberForm
                                                                    tooltip={t("TotalAmountValidateMessage")}
                                                                    label=""
                                                                    placeholder={t("TotalAmount")}
                                                                    required={true}
                                                                    nextField={configPurchase?.is_measurement_enable === 1 ? "unit_id" : 'quantity'}
                                                                    form={form}
                                                                    name={"total_amount"}
                                                                    id={"total_amount"}
                                                                    leftSection={
                                                                        <IconPlusMinus size={16} opacity={0.5}/>
                                                                    }
                                                                    rightIcon={
                                                                        <IconCurrency size={16} opacity={0.5}/>
                                                                    }
                                                                />
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                }


                                                {configPurchase?.item_percent === 1 && (
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
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
                                                                        <IconPercentage size={16}
                                                                                        opacity={0.5}/>
                                                                    }
                                                                    rightIcon={
                                                                        <IconCurrency size={16}
                                                                                      opacity={0.5}/>
                                                                    }
                                                                    closeIcon={true}
                                                                />
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                )}

                                                {configPurchase?.is_measurement_enable === 1 && (
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
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
                                                                    changeValue={(e) => {
                                                                        setUnitType(e)
                                                                    }}
                                                                />
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                )}

                                                <Box mt={"4"}>
                                                    <Grid columns={24} gutter={{base: 1}}>
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
                                                                nextField={configPurchase?.is_bonus_quantity === 1 ? "bonus_quantity" : 'EntityFormSubmit'}
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
                                                    <Box mt={"4"}>
                                                        <Grid columns={24} gutter={{base: 1}}>
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
                                    </Box>
                                </Box>

                                {/* calculate sub total*/}
                                <Box p={"xs"} className={genericClass.genericHighlightedBox}>
                                    <Grid columns={24} gutter={{base: 1}}>
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
                                <Box mt="2" className="" pt={'4'} pb={'6'}>
                                    <Grid
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
                                                        <Flex direction={`column`} align={'center'} fz={'12'}
                                                              c={'gray.5'}>alt+a</Flex>
                                                    </Flex>
                                                </Button>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>

                            </Box>
                        </Box>
                    </form>
                </Grid.Col>
                <Grid.Col span={17}>
                    <__PosPurchaseUpdateForm
                        currencySymbol={currencySymbol}
                        domainId={domainId}
                        isSMSActive={isSMSActive}
                        tempCardProducts={tempCardProducts}
                        setTempCardProducts={setTempCardProducts}
                        setLoadCardProducts={setLoadCardProducts}
                        isWarehouse={isWarehouse}
                        domainConfigData={domainConfigData}
                        editedData={editedData}
                    />
                </Grid.Col>
            </Grid>
            {settingDrawer && (
                <SettingDrawer
                    settingDrawer={settingDrawer}
                    setSettingDrawer={setSettingDrawer}
                    module={"Purchase"}
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


