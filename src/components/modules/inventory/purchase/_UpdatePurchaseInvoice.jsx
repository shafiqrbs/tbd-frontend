import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    ActionIcon,
    Box,
    Button,
    Flex,
    Grid,
    Group,
    ScrollArea,
    Text,
    Tooltip,
} from "@mantine/core";
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
import {useHotkeys} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";

import InputButtonForm from "../../../form-builders/InputButtonForm.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SelectFormForSalesPurchaseProduct from "../../../form-builders/SelectFormForSalesPurchaseProduct.jsx";

import SettingDrawer from "../common/SettingDrawer.jsx";
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer.jsx";
import __PosPurchaseUpdateForm from "./__PosPurchaseUpdateForm.jsx";

import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";

import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";

function _UpdatePurchaseInvoice({editedData, domainConfigData: initialDomainConfig}) {
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const itemFromHeight = mainAreaHeight - 198;

    const [domainConfigData, setDomainConfigData] = useState(initialDomainConfig);

    const inventoryConfig = domainConfigData?.inventory_config;
    const purchaseConfig = inventoryConfig?.config_purchase;

    const currencySymbol = inventoryConfig?.currency?.symbol;
    const safeCurrencySymbol = typeof currencySymbol === "string" ? currencySymbol : "";
    const purchaseMode = purchaseConfig?.purchase_mode;
    const domainId = inventoryConfig?.domain_id;
    const isWarehouse = purchaseConfig?.is_warehouse;
    const isSMSActive = inventoryConfig?.is_active_sms;
    const isPurchaseByPurchasePrice = inventoryConfig?.is_purchase_by_purchase_price;

    const warehouseDropdownData = getCoreWarehouseDropdownData();
    const categoryDropDownData = getSettingCategoryDropdownData();

    const [productDropdown, setProductDropdown] = useState([]);
    const [tempCardProducts, setTempCardProducts] = useState([]);
    const [loadCardProducts, setLoadCardProducts] = useState(false);
    const [warehouseData, setWarehouseData] = useState(null);
    const [unitDropdown, setUnitDropdown] = useState([]);
    const [vendorData, setVendorData] = useState(null);
    const [products, setProducts] = useState(null);
    const [product, setProduct] = useState(null);

    const [settingDrawer, setSettingDrawer] = useState(false);
    const [productDrawer, setProductDrawer] = useState(false);
    const [categoryData, setCategoryData] = useState(null);
    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
    const [selectProductDetails, setSelectProductDetails] = useState("");
    const [unitType, setUnitType] = useState(null);
    const [stockProductRestore, setStockProductRestore] = useState(false);

    const inputGroupText = (
        <Text className="text-right pr-4 text-gray-600 w-full">
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text className="text-right pr-4 text-gray-600 w-full">{safeCurrencySymbol}</Text>
    );

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
            product_id: (value) => (/^\d+$/.test(value) ? null : true),
            quantity: (value, values) => {
                if (values.product_id && !/^-?\d+(\.\d+)?$/.test(value)) {
                    return true;
                }
                return null;
            },
            purchase_price: (value, values) => {
                if (values.product_id && !/^-?\d+(\.\d+)?$/.test(value)) {
                    return true;
                }
                return null;
            },
        },
    });

    // fetch core-vendors dropdown
    useEffect(() => {
        const fetchVendors = async () => {
            await vendorDataStoreIntoLocalStorage();
            let vendors = localStorage.getItem("core-vendors");
            vendors = vendors ? JSON.parse(vendors) : [];

            if (Array.isArray(vendors) && vendors.length > 0) {
                setVendorsDropdownData(
                    vendors.map((v) => ({
                        label: `${v.mobile} -- ${v.name}`,
                        value: String(v.id),
                    }))
                );
            }
        };

        fetchVendors();
    }, []);

    // update domainConfigData on setting drawer close
    useEffect(() => {
        if (!settingDrawer) {
            const freshConfig = localStorage.getItem("domain-config-data");
            if (freshConfig) {
                setDomainConfigData(JSON.parse(freshConfig));
            }
        }
    }, [settingDrawer]);

    // refresh local products if stock restored
    useEffect(() => {
        if (stockProductRestore) {
            productsDataStoreIntoLocalStorage();
        }
    }, [stockProductRestore]);

    // load edited data into local
    useEffect(() => {
        localStorage.setItem("temp-purchase-products", JSON.stringify(editedData?.purchase_items || []));
        setTempCardProducts(editedData?.purchase_items || []);
        setLoadCardProducts(false);
    }, []);

    // reload temp products if needed
    useEffect(() => {
        if (loadCardProducts) {
            const data = localStorage.getItem("temp-purchase-products");
            setTempCardProducts(data ? JSON.parse(data) : []);
            setLoadCardProducts(false);
        }
    }, [loadCardProducts]);

    // prepare filtered & mapped productDropdown
    useEffect(() => {
        const storedProducts = localStorage.getItem("core-products");
        const allProducts = storedProducts ? JSON.parse(storedProducts) : [];

        let filtered = [...allProducts];

        const allowedNatures = JSON.parse(purchaseConfig?.purchase_product_nature || "[]");
        if (Array.isArray(allowedNatures) && allowedNatures.length > 0) {
            filtered = filtered.filter((p) => allowedNatures.includes(p.product_nature_id));
        }

        if (categoryData) {
            filtered = filtered.filter((p) => p.category_id === Number(categoryData));
        }

        if (vendorData) {
            filtered = filtered.filter((p) => p.vendor_id === Number(vendorData));
        }

        setProductDropdown(
            filtered.map((product) => {
                let label = "";
                if (purchaseMode === "mrp-price") {
                    label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${safeCurrencySymbol}${product.sales_price}`;
                } else if (purchaseMode === "purchase-price") {
                    label = `${product.display_name} [${product.quantity}] ${product.unit_name} - ${safeCurrencySymbol}${product.purchase_price}`;
                } else {
                    label = `${product.display_name} [${product.quantity}] ${product.unit_name}`;
                }

                return {
                    label,
                    value: String(product.id),
                };
            })
        );

        setProducts(filtered);
    }, [categoryData, vendorData, purchaseConfig]);

    // auto fetch price/subtotal based on product_id
    useEffect(() => {
        const storedProducts = localStorage.getItem("core-products");
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const matched = localProducts.find((p) => p.id === Number(form.values.product_id));
        if (matched) {
            setSelectProductDetails(matched);
            form.setValues({
                price: matched.sales_price,
                sales_price: matched.sales_price,
                purchase_price: matched.purchase_price,
            });
            const quantityInput = purchaseMode === "split-amount" ? document.getElementById("total_amount") : document.getElementById("quantity");
            if (quantityInput) quantityInput.focus();
        } else {
            setSelectProductDetails(null);
            form.setValues({price: "", sales_price: "", purchase_price: ""});
        }
    }, [form.values.product_id]);

    // skip sub_total update if split-amount mode is active
    useEffect(() => {
        if (purchaseMode === "split-amount") return;

        const quantity = Number(form.values.quantity);
        const purchase_price = Number(form.values.purchase_price);

        if (!isNaN(quantity) && !isNaN(purchase_price) && quantity > 0) {
            const sub_total = quantity * purchase_price;
            form.setFieldValue("sub_total", sub_total);
            setSelectProductDetails((prev) => ({
                ...prev,
                sub_total,
            }));
        }
    }, [form.values.quantity, form.values.purchase_price, purchaseMode]);


    // auto calc purchase price = subTotal / quantity
    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const subTotal = Number(form.values.sub_total);
        if (!isNaN(quantity) && !isNaN(subTotal) && quantity > 0 && subTotal >= 0) {
            const price = subTotal / quantity;
            setSelectProductDetails((prev) => ({...prev, purchase_price: price}));
            form.setFieldValue("purchase_price", price);
        }
    }, [form.values.sub_total]);

    // 🛠 1. Skip sub_total override in split-amount mode
    useEffect(() => {
        if (purchaseMode === "split-amount") return;

        const quantity = Number(form.values.quantity);
        const purchase_price = Number(form.values.purchase_price);

        if (!isNaN(quantity) && !isNaN(purchase_price) && quantity > 0 && purchase_price >= 0) {
            const subTotal = quantity * purchase_price;
            form.setFieldValue("sub_total", subTotal);
            setSelectProductDetails((prev) => ({
                ...prev,
                sub_total: subTotal,
            }));
        }
    }, [form.values.quantity, form.values.purchase_price, purchaseMode]);

    // 🛠 2. Compute purchase_price from total_amount in split-amount mode
    useEffect(() => {
        if (purchaseMode !== "split-amount") return;

        const quantity = Number(form.values.quantity);
        const totalAmount = Number(form.values.total_amount);

        if (!isNaN(quantity) && quantity > 0 && !isNaN(totalAmount) && totalAmount >= 0) {
            const price = totalAmount / quantity;

            form.setFieldValue("purchase_price", price);
            form.setFieldValue("sub_total", totalAmount);

            setSelectProductDetails((prev) => ({
                ...prev,
                purchase_price: price,
                sub_total: totalAmount,
            }));
        }
    }, [form.values.quantity, form.values.total_amount, purchaseMode]);


    useEffect(() => {
        const barcodeInput = document.getElementById("barcode");
        if (!barcodeInput) return;

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                const barcode = form.values.barcode?.toString().trim();
                if (!barcode) return;

                const localProducts = JSON.parse(localStorage.getItem("core-products") || "[]");
                const matched = localProducts.find((p) => p.barcode?.toString().trim() === barcode);

                if (!matched) {
                    notifications.show({
                        title: t("Product Not Found"),
                        message: t("No product matched this barcode."),
                        color: "red",
                    });
                    return;
                }

                setProduct({
                    label: matched.display_name,
                    value: String(matched.id),
                });

                form.setValues({
                    ...form.values,
                    product_id: String(matched.id),
                    purchase_price: matched.purchase_price,
                    price: matched.sales_price,
                });

                setSelectProductDetails(matched);

                setTimeout(() => {
                    const el = document.getElementById("quantity");
                    if (el) el.focus();
                }, 50);
            }
        };

        barcodeInput.addEventListener("keydown", handleKeyDown);
        return () => barcodeInput.removeEventListener("keydown", handleKeyDown);
    }, [form.values.barcode]);


    const handleBarcodeEnter = () => {
        const barcode = String(form.values.barcode).trim();
        if (!barcode) return;

        const products = JSON.parse(localStorage.getItem("core-products") || "[]");

        const match = products.find(
            (p) => String(p.barcode).trim() === barcode
        );

        if (!match) {
            notifications.show({
                color: "red",
                title: t("Not Found"),
                message: t("No product found for this barcode."),
            });
            return;
        }

        // -> Auto-fill the form with product info
        form.setValues({
            ...form.values,
            product_id: String(match.id),
            price: match.sales_price,
            purchase_price: match.purchase_price,
        });

        // Also set selected dropdown value so dropdown reflects the match
        setProduct({
            label: match.display_name,
            value: String(match.id),
        });

        // Set details state
        setSelectProductDetails(match);

        setTimeout(() => {
            const qtyInput = document.getElementById("quantity");
            if (qtyInput) qtyInput.focus();
        }, 100);
    };

    useEffect(() => {
        const barcodeInput = document.getElementById("barcode");
        if (!barcodeInput) return;

        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleBarcodeEnter();
            }
        };

        barcodeInput.addEventListener("keydown", handleKeyDown);
        return () => barcodeInput.removeEventListener("keydown", handleKeyDown);
    }, [form.values.barcode]);

    const handleFormSubmit = (values) => {
        if (!values.product_id) {
            form.setFieldError("product_id", true);
            return;
        }

        const cardProducts = JSON.parse(localStorage.getItem("temp-purchase-products") || "[]");
        const allProducts = JSON.parse(localStorage.getItem("core-products") || "[]");

        const matched = allProducts.find((p) => p.id === Number(values.product_id));

        if (!matched) {
            notifications.show({
                color: "red",
                title: t("Invalid Product"),
                message: t("This product doesn't exist in local storage"),
                autoClose: 2000,
            });
            return;
        }

        // prepare new product object with all required data
        const qty = Number(values.quantity || 0);
        const price = Number(values.purchase_price || 0);
        const bonusQty = Number(values.bonus_quantity || 0);
        const warehouseId = values.warehouse_id ? Number(values.warehouse_id) : null;

        const warehouseName = warehouseId
            ? warehouseDropdownData.find((w) => w.value === values.warehouse_id)?.label || ""
            : "";

        const sub_total = purchaseMode === 'split-amount'
            ? Number(values.total_amount || 0)
            : qty * price;

        const newProduct = {
            product_id: matched.id,
            display_name: matched.display_name,
            quantity: qty,
            unit_name: matched.unit_name,
            purchase_price: price,
            bonus_quantity: bonusQty,
            sales_price: Number(values.price) || matched.sales_price || 0,
            sub_total,
            warehouse_id: warehouseId,
            warehouse_name: warehouseName,
        };

        // update or add product to list
        const updated = [...cardProducts];
        const index = updated.findIndex((item) => item.product_id === newProduct.product_id);

        if (index !== -1) {
            updated[index] = {...updated[index], ...newProduct};
        } else {
            updated.push(newProduct);
        }

        localStorage.setItem("temp-purchase-products", JSON.stringify(updated));
        setLoadCardProducts(true);

        // reset form
        form.reset();
        setProduct(null);
        setWarehouseData(null);
        setUnitType(null);
        setSelectProductDetails(null);

        // refocus product field after slight delay
        setTimeout(() => {
            document.getElementById("product_id")?.focus();
        }, 100);
    };


    // keyboard hotkeys support
    useHotkeys([
        ["alt+n", () => document.getElementById("product_id")?.focus()],
        ["alt+r", () => form.reset()],
        ["alt+s", () => document.getElementById("EntityFormSubmit")?.click()],
    ]);

    return (
        <Box>
            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={7}>
                    <form onSubmit={form.onSubmit(handleFormSubmit)}>
                        <Box bg="white" p="md" pb="0" className="borderRadiusAll">
                            <Grid mb="xs" columns={12}>
                                <Grid.Col span={7}>
                                    <Text fz="md" fw={500} className={classes.cardTitle}>
                                        {t("VendorPurchaseInvoice")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <Group justify="flex-end" align="center" gap={4}>
                                        <Tooltip label={t("Settings")} withArrow>
                                            <ActionIcon
                                                aria-label="Settings"
                                                onClick={() => setSettingDrawer(true)}
                                                variant="transparent"
                                                radius="xl"
                                                size="md"
                                                color="gray"
                                            >
                                                <IconDotsVertical size={18}/>
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Grid.Col>
                            </Grid>

                            {/* Product Form Section */}
                            <Box className="boxBackground">
                                <Box pt={'0'}>
                                    <ScrollArea h={itemFromHeight} scrollbarSize={2} scrollbars="y" type="never">
                                        {purchaseConfig?.is_barcode === 1 && (
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
                                            {purchaseConfig?.search_by_vendor === 1 && (
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

                                            {purchaseConfig?.search_by_category === 1 && (
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
                                            {domainConfigData?.inventory_config?.sku_warehouse === 1 && purchaseConfig?.is_warehouse === 1 && (
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
                                                                nextField={purchaseConfig?.item_percent === 1 ? "price" : 'quantity'}
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
                                                                nextField={purchaseConfig?.is_measurement_enable === 1 ? "unit_id" : 'quantity'}
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
                                                                nextField={purchaseConfig?.is_measurement_enable === 1 ? "unit_id" : 'quantity'}
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


                                            {purchaseConfig?.item_percent === 1 && (
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

                                            {purchaseConfig?.is_measurement_enable === 1 && (
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
                                                            nextField={purchaseConfig?.is_bonus_quantity === 1 ? "bonus_quantity" : 'EntityFormSubmit'}
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
                                            {purchaseConfig?.is_bonus_quantity === 1 && (
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
                            {/* Subtotal Display */}
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
                    </form>
                </Grid.Col>

                <Grid.Col span={17}>
                    <__PosPurchaseUpdateForm
                        currencySymbol={safeCurrencySymbol}
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
                    module="Purchase"
                />
            )}
            {productDrawer && (
                <AddProductDrawer
                    productDrawer={productDrawer}
                    setProductDrawer={setProductDrawer}
                    setStockProductRestore={setStockProductRestore}
                    focusField="product_id"
                    fieldPrefix="sales_"
                />
            )}
        </Box>
    );
}

export default _UpdatePurchaseInvoice;

