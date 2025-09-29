import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {ActionIcon, Box, Button, Flex, Grid, Group, ScrollArea, Text, Tooltip,} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconBarcode,
    IconCurrency,
    IconDotsVertical,
    IconPercentage,
    IconPlus,
    IconPlusMinus,
    IconRefresh,
    IconSortAscendingNumbers,
    IconSum,
} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {notifications, showNotification} from "@mantine/notifications";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import useProductsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useProductsDataStoreIntoLocalStorage.js";
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import useVendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useVendorDataStoreIntoLocalStorage.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import SettingDrawer from "../common/SettingDrawer.jsx";
import {useHotkeys} from "@mantine/hooks";
import SelectFormForSalesPurchaseProduct from "../../../form-builders/SelectFormForSalesPurchaseProduct.jsx";
import __PosPurchaseForm from "./__PosPurchaseForm.jsx";

function _GenericInvoiceForm() {
    const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))

    let currencySymbol = domainConfigData?.inventory_config?.currency?.symbol;
    let allowZeroPercentage = true;
    let domainId = domainConfigData?.inventory_config?.domain_id;
    let isSMSActive = domainConfigData?.inventory_config?.is_active_sms;
    const isWarehouse = domainConfigData?.inventory_config.sku_warehouse
    let isPurchaseByPurchasePrice = domainConfigData?.inventory_config?.is_purchase_by_purchase_price;

    let inventory_config = domainConfigData?.inventory_config;
    let configPurchase = inventory_config?.config_purchase;
    let purchaseMode = configPurchase.purchase_mode
    let id = domainConfigData?.id;

    //common hooks and variables
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const itemFromHeight = mainAreaHeight - 198;

    const [settingDrawer, setSettingDrawer] = useState(false);
    const [productDrawer, setProductDrawer] = useState(false);
    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);
    const [vendorData, setVendorData] = useState(null);
    const [unitType, setUnitType] = useState(null);
    const [unitDropdown, setUnitDropdown] = useState([]);
    const [product, setProduct] = useState(null);
    const [productDropdown, setProductDropdown] = useState([]);


    const [categoryData, setCategoryData] = useState(null);
    const [products, setProducts] = useState([]);

    // initial form field value
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

    //product filter based on category id , vendor id and set the dropdown value for product dropdown
    useEffect(() => {
        const storedProducts = localStorage.getItem("core-products");
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
        const domainProductNature = JSON.parse(configPurchase?.purchase_product_nature || '[]');
        let filteredProducts = localProducts.filter((product) => {
            return domainProductNature.includes(product.product_nature_id);

        });

        if (categoryData) {
            filteredProducts = filteredProducts.filter(product => product.category_id == categoryData)
        }
        if (vendorData) {
            filteredProducts = filteredProducts.filter(product => product.vendor_id == vendorData)
        }

        setProducts(filteredProducts);

        const transformedProducts = filteredProducts.map((product) => {
            let label = "";

            if (purchaseMode === "mrp-price") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.sales_price}`;
            } else if (purchaseMode === "purchase-price") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.purchase_price}`;
            } else if (purchaseMode === "split-amount") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name}`;
            }

            return {
                label,
                value: String(product.id),
            };
        });

        setProductDropdown(transformedProducts);
    }, [categoryData, vendorData, settingDrawer]);

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
                    label: unit.unit_name + ' (1 ' + unit.unit_name + '=' + unit.quantity + ' ' + selectedProduct.unit_name + ')',
                    value: String(unit.id),
                }));
                setUnitDropdown(unitDropdown);
            }

            const price = purchaseMode === "mrp-price"
                ? selectedProduct?.sales_price || 0
                : purchaseMode === "purchase-price"
                    ? selectedProduct?.purchase_price || 0
                    : 0;

            form.setFieldValue("price", price);
            form.setFieldValue("purchase_price", price);

            const quantityInput = purchaseMode === "split-amount" ? document.getElementById("total_amount") : document.getElementById("quantity");
            if (quantityInput) quantityInput.focus();

        } else {
            setSelectProductDetails(null);
            form.setFieldValue("price", "");
            form.setFieldValue("purchase_price", "");
        }
    }, [form.values.product_id, purchaseMode]);

    //selected product group text to show in input
    const inputGroupText = (
        <Text style={{textAlign: "right", width: "100%", paddingRight: 16}} color={"gray"}>
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    //input group currency to show in input right section
    const inputGroupCurrency = (
        <Text
            style={{textAlign: "right", width: "100%", paddingRight: 16}}
            color={"gray"}
        >
            {currencySymbol}
        </Text>
    );

    //vendor dropdowndata
    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
    useEffect(() => {
        const fetchVendors = async () => {
            await useVendorDataStoreIntoLocalStorage();
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
            const local = useProductsDataStoreIntoLocalStorage();
        }
    }, [stockProductRestore]);

    //action when quantity or sales price is changed
    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const salesPrice = purchaseMode === "split-amount" ? Number(form.values.total_amount) / Number(form.values.quantity) : Number(form.values.purchase_price);

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
                    style: {backgroundColor: "mistyrose"},
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
    }, [form.values.quantity, form.values.purchase_price, form.values.total_amount]);

    //action when sales percent is changed
    useEffect(() => {
        if (form.values.quantity && form.values.price) {
            const discountAmount = (form.values.price * form.values.percent) / 100;
            const salesPrice = form.values.price - discountAmount;

            form.setFieldValue("purchase_price", salesPrice);
            form.setFieldValue("sub_total", salesPrice);
        }
    }, [form.values.percent]);

    // Helper function to create or update existing product
    function createOrUpdateProduct(values, product, myCardProducts) {
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
                    quantity: quantityToSet, // replace quantity
                    bonus_quantity: bonusQuantityToSet, // replace bonus qty
                    purchase_price: purchasePrice,
                    sales_price: salesPrice,
                    sub_total: subTotal,
                    warehouse_id: values.warehouse_id
                        ? Number(values.warehouse_id)
                        : item.warehouse_id,
                    warehouse_name: values.warehouse_id
                        ? warehouseDropdownData.find((w) => w.value === values.warehouse_id)?.label || ""
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
                    ? warehouseDropdownData.find((w) => w.value === values.warehouse_id)?.label || null
                    : null,
            });
        }

        return updatedProducts;
    }

// Add product by product ID (from dropdown)
    function handleAddProductByProductId(values, myCardProducts, localProducts) {
        const productIdToAdd = Number(values.product_id);

        const product = localProducts.find((p) => p.id === productIdToAdd);
        if (!product) {
            notifications.show({
                color: "red",
                title: "Invalid Product",
                message: "This product doesn't exist in local storage",
            });
            return;
        }

        const finalProducts = createOrUpdateProduct(values, product, myCardProducts);
        setLoadCardProducts(true);
        updateLocalStorageAndResetForm(finalProducts, "productId");
    }

// Add product by barcode
    useEffect(() => {
        const barcodeInput = document.getElementById("barcode");

        if (barcodeInput) {
            const handleKeyDown = (e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // stop form submission

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

            return () => {
                barcodeInput.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [form.values.barcode]);

    function handleAddProductByBarcode(values, myCardProducts, localProducts) {
        const barcode = String(values.barcode).trim();
        const product = localProducts.find(
            (p) => String(p.barcode).trim() === barcode
        );

        if (!product) {
            notifications.show({
                color: "red",
                title: "Product Not Found",
                message: `No product matches the barcode: ${barcode}`,
                autoClose: 2000,
            });
            return;
        }
        form.setFieldValue("product_id", String(product.id));

        const matchedDropdownItem = productDropdown.find(
            (item) => item.value === String(product.id)
        );

        if (matchedDropdownItem) {
            setProduct(matchedDropdownItem);
        } else {
            let label = "";
            if (purchaseMode === "mrp-price") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.sales_price}`;
            } else if (purchaseMode === "purchase-price") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.purchase_price}`;
            } else if (purchaseMode === "split-amount") {
                label = `${product.display_name} [${product.quantity}] ${product.unit_name}`;
            }

            const newOption = {
                label,
                value: String(product.id),
            };

            setProductDropdown((prev) => {
                const updated = [newOption, ...prev];
                return updated;
            });

            setProduct(newOption);
        }

        // Set default price
        let price = 0;
        if (purchaseMode === "mrp-price") {
            price = product.sales_price || 0;
            form.setFieldValue("price", price);
        } else if (purchaseMode === "purchase-price") {
            price = product.purchase_price || 0;
            form.setFieldValue("purchase_price", price);
        }

        // Optional: focus quantity field for next step
        setTimeout(() => {
            if (purchaseMode === "split-amount") {
                document.getElementById("total_amount")?.focus();
            } else {
                document.getElementById("quantity")?.focus();
            }
        }, 200);
    }

    function updateLocalStorageAndResetForm(addProducts, type) {
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
            document.getElementById("product_id")?.focus();
        }, 50);
    }


    const [loadCardProducts, setLoadCardProducts] = useState(false);
    const [tempCardProducts, setTempCardProducts] = useState([]);

    //load cart products from local storage
    useEffect(() => {
        const tempProducts = localStorage.getItem("temp-purchase-products");
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
        setLoadCardProducts(false);
    }, [loadCardProducts, settingDrawer]);
    let categoryDropDownData = getSettingCategoryDropdownData();


    useHotkeys([
            ["alt+n", () => document.getElementById("product_id")?.focus()],
            ["alt+r", () => form.reset()],
            ["alt+s", () => document.getElementById("EntityFormSubmit")?.click()],
        ], []
    );


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
