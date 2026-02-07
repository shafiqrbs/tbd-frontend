import React, {useEffect, useState, useMemo, useCallback} from "react";
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
    Input, TextInput, ScrollArea,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconDeviceFloppy,
    IconSum,
    IconCurrency,
    IconBarcode,
    IconCoinMonero,
    IconSortAscendingNumbers,
    IconPlus,
    IconShoppingBag,
    IconRefresh,
    IconDotsVertical, IconSearch, IconX, IconInfoCircle,
} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";
import __RequistionForm from "./__RequistionForm";
import {useHotkeys} from "@mantine/hooks";
import AddProductDrawer from "../../inventory/sales/drawer-form/AddProductDrawer.jsx";
import SettingDrawer from "../../inventory/common/SettingDrawer.jsx";
import RequisitionNavigation from "../common/RequisitionNavigation";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";

function _GenericRequisitionForm(props) {
    const {
        currencySymbol,
        domainId,
        isSMSActive,
        isZeroReceiveAllow,
        isWarehouse
    } = props;

    //common hooks and variables
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const itemFormHeight = mainAreaHeight - 270;

    const [switchValue, setSwitchValue] = useState("product");
    const [settingDrawer, setSettingDrawer] = useState(false);
    const [productDrawer, setProductDrawer] = useState(false);
    const [loadCardProducts, setLoadCardProducts] = useState(false);
    const [fetchingProductsTable, setFetchingProductsTable] = useState(false);
    const [vendorData, setVendorData] = useState(null);
    const [product, setProduct] = useState(null);
    const [vendorObject, setVendorObject] = useState({});
    const [searchValue, setSearchValue] = useState("");
    const [productDropdown, setProductDropdown] = useState([]);
    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
    const [selectProductDetails, setSelectProductDetails] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const [products, setProducts] = useState([]);
    const [tempCardProducts, setTempCardProducts] = useState([]);
    const categoryDropDownData = getSettingCategoryDropdownData();
    const [categoryData, setCategoryData] = useState(null);

    // get local product
    const localProducts = useMemo(() => {
        const storedProducts = localStorage.getItem("core-products");
        return storedProducts ? JSON.parse(storedProducts) : [];
    }, []);

    // get local vendor
    const coreVendors = useMemo(() => {
        const storedVendors = localStorage.getItem("core-vendors");
        return storedVendors ? JSON.parse(storedVendors) : [];
    }, []);

    //vendor dropdown data
    useEffect(() => {
        const filteredVendors = coreVendors.filter(vendor => vendor.sub_domain_id != null);
        const transformedData = filteredVendors.map((type) => {
            return {
                label: type.mobile + " -- " + type.name,
                value: String(type.id),
            };
        });
        setVendorsDropdownData(transformedData);
    }, [coreVendors]);

    // product filter by keyword
    const filterProductsBySearch = useCallback((products, searchTerm) => {
        if (!searchTerm || searchTerm.length === 0) return products;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const fieldsToSearch = ["product_name"];

        return products.filter((product) =>
            fieldsToSearch.some((field) =>
                product[field] &&
                String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
            )
        );
    }, []);

    // vendor wise product
    useEffect(() => {
        setFetchingProductsTable(true)
        if (!vendorData) {
            setProductDropdown([]);
            setVendorObject(null);
            return;
        }

        // Filter products by vendor and purchase price
        let filteredProducts = localProducts.filter(product =>
            String(product.vendor_id) === vendorData &&
            product.purchase_price > 0
        );

        if (categoryData) {
            filteredProducts = filteredProducts.filter(product =>
                product.category_id === Number(categoryData)
            );
        }

        // Apply search filter
        filteredProducts = filterProductsBySearch(filteredProducts, searchValue);

        // Format product data for dropdown
        const formattedProductData = filteredProducts.map((product) => ({
            label: `${product.display_name} [${product.quantity}] ${product.unit_name} - ${currencySymbol}${product.purchase_price}`,
            value: String(product.id),
        }));

        setProductDropdown(formattedProductData);
        setProducts(filteredProducts)

        // Set vendor object
        const foundVendor = coreVendors.find((vendor) => String(vendor.id) === vendorData);
        setVendorObject(foundVendor || null);
        setFetchingProductsTable(false)

    }, [vendorData, searchValue, localProducts, coreVendors, filterProductsBySearch, currencySymbol, fetchingProductsTable,categoryData]);

    // form initialization
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

    // select product
    useEffect(() => {
        const filteredProducts = localProducts.filter(
            (product) => product.id === Number(form.values.product_id)
        );

        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];

            setSelectProductDetails(selectedProduct);

            form.setFieldValue("price", selectedProduct.purchase_price);
            form.setFieldValue("purchase_price", selectedProduct.purchase_price);
            document.getElementById("quantity").focus();
        } else {
            setSelectProductDetails(null);
            form.setFieldValue("price", "");
            form.setFieldValue("purchase_price", "");
        }
    }, [form.values.product_id]);

    // change subtotal by quantity
    const changeSubTotalByQuantity = (event) => {
        const quantity = Number(event.target.value);
        const purchase_price = Number(form.values.purchase_price);
        if (!isNaN(quantity) && !isNaN(purchase_price) && quantity > 0 && purchase_price >= 0) {
            setSelectProductDetails((prevDetails) => ({
                ...prevDetails,
                sub_total: quantity * purchase_price,
            }));
            form.setFieldValue("sub_total", quantity * purchase_price);
        }
    };

    function handleAddProductByProductId(values, myCardProducts, localProducts, quantity = 1, addedType = null) {
        const productId = values.product_id ? Number(values.product_id) : Number(values.id);
        const quantityToAdd = Number(quantity);
        const purchasePrice = Number(values.purchase_price);
        const subTotal = Number(purchasePrice * quantityToAdd);

        // Find the product in localProducts
        const product = localProducts.find(item => item.id === productId);
        if (!product) return;

        // Check if product already exists in the cart
        const existingProductIndex = myCardProducts.findIndex(item => item.product_id === productId);

        let updatedProducts;
        if (existingProductIndex !== -1) {
            // Product already in cart, update quantity and subtotal
            updatedProducts = [...myCardProducts];
            const existingProduct = updatedProducts[existingProductIndex];

            const newQuantity = quantityToAdd;
            const newSubTotal = newQuantity * purchasePrice;

            updatedProducts[existingProductIndex] = {
                ...existingProduct,
                quantity: newQuantity,
                purchase_price: purchasePrice, // keep price as per latest input
                sub_total: newSubTotal
            };
        } else {
            // Product not in cart, add new entry
            updatedProducts = [
                ...myCardProducts,
                {
                    product_id: product.id,
                    display_name: product.display_name,
                    quantity: quantityToAdd,
                    unit_name: product.unit_name,
                    purchase_price: purchasePrice,
                    sub_total: subTotal,
                    sales_price: Number(product.sales_price),
                }
            ];
        }
        updateLocalStorageAndResetForm(updatedProducts, addedType);
    }

    //update local storage and reset form values
    function updateLocalStorageAndResetForm(addProducts, addedType) {
        localStorage.setItem("temp-requisition-products", JSON.stringify(addProducts));
        setSearchValue("");
        setProduct(null);
        form.reset();
        setLoadCardProducts(true);
        addedType && document.getElementById(addedType).focus();
    }

    //input group currency to show in input right section
    const inputGroupCurrency = (
        <Text
            style={{textAlign: "right", width: "100%", paddingRight: 16}}
            color={"gray"}
        >
            {currencySymbol}
        </Text>
    );

    //selected product group text to show in input
    const inputGroupText = (
        <Text
            style={{textAlign: "right", width: "100%", paddingRight: 16}}
            color={"gray"}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

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
            showNotificationComponent('Product not found with this barcode', 'red')
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

    //load cart products from local storage
    useEffect(() => {
        const tempProducts = localStorage.getItem("temp-requisition-products");
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
        setLoadCardProducts(false);
    }, [loadCardProducts]);

    const handleFormSubmit = (values) => {
        if (!values.barcode && !values.product_id) {
            form.setFieldError("barcode", true);
            form.setFieldError("product_id", true);
            setTimeout(() => {
            }, 1000);
        } else {
            const cardProducts = localStorage.getItem("temp-requisition-products");
            const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];

            if (values.product_id && !values.barcode) {
                handleAddProductByProductId(
                    values,
                    myCardProducts,
                    localProducts,
                    values.quantity,
                    'product_id'
                );
            } else if (!values.product_id && values.barcode) {
                handleAddProductByBarcode(
                    values,
                    myCardProducts,
                    localProducts,
                    'barcode'
                );
            }
        }
    }

    useHotkeys([["alt+n", () => document.getElementById("product_id").focus()]], []);
    useHotkeys([["alt+r", () => form.reset()]], []);
    useHotkeys([["alt+s", () => document.getElementById("EntityFormSubmit").click()]], []);

    return (
        <Box>
            <Grid columns={24} gutter={{base: 8}}>
                <Grid.Col span={1}>
                    <RequisitionNavigation/>
                </Grid.Col>
                <Grid.Col span={7}>
                    <form onSubmit={form.onSubmit(handleFormSubmit)}
                    >
                        <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
                            <Box>
                                <Box mb={"xs"}>
                                    <Grid columns={12} gutter={{base: 2}}>
                                        <Grid.Col span={7}>
                                            <Text fz="md" fw={500} className={classes.cardTitle}>
                                                {t("NewRequisition")}
                                            </Text>
                                        </Grid.Col>
                                        {/*<Grid.Col span={5} align="center">
                                            <Group justify="flex-end" align="center" gap={4}>

                                                <SegmentedControl
                                                    size="xs"
                                                    styles={{
                                                        label: {color: "#140d05"},
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
                                                            value: "list",
                                                        },
                                                    ]}
                                                />
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
                                        </Grid.Col>*/}
                                    </Grid>
                                </Box>
                                <Box
                                    mb={"xs"}
                                    className={"boxBackground borderRadiusAll"}
                                >

                                    <Box
                                        p={"xs"}
                                        mt={"4"}
                                        className={genericClass.genericHighlightedBox}>
                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={12}>
                                                <Box>
                                                    <SelectForm
                                                        tooltip={t("ChooseVendor")}
                                                        label={""}
                                                        placeholder={t("ChooseVendor")}
                                                        required={true}
                                                        nextField={"product_id"}
                                                        name={"vendor_id"}
                                                        form={form}
                                                        dropdownValue={vendorsDropdownData}
                                                        id={"vendor_id"}
                                                        searchable={true}
                                                        value={vendorData}
                                                        changeValue={(val) => {
                                                            setVendorData(val);
                                                        }}
                                                        comboboxProps={{withinPortal: false}}
                                                    />
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
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
                                                                        const cardProducts = localStorage.getItem("temp-requisition-products");
                                                                        const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
                                                                        if (quantity) {
                                                                            handleAddProductByProductId(
                                                                                data,
                                                                                myCardProducts,
                                                                                localProducts,
                                                                                quantity,
                                                                                ''
                                                                            );
                                                                        } else {
                                                                            showNotificationComponent('PleaseEnterValidQuantity', 'red')
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
                                                height={itemFormHeight}
                                                fetching={fetchingProductsTable}
                                            />
                                        </Box>
                                    )}

                                    {switchValue === "product" && (
                                        <>
                                            <Box className="boxBackground">
                                                <Box pt={'0'}>
                                                    <ScrollArea h={itemFormHeight} scrollbarSize={2} scrollbars="y" type="never">
                                                        {/*<Box
                                                            p={"xs"}
                                                            mt={"4"}
                                                            className={genericClass.genericHighlightedBox}
                                                        >
                                                            <InputNumberForm
                                                                disabled={!vendorData}
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
                                                        </Box>*/}
                                                        <Box
                                                            p={"xs"}
                                                            mt={"4"}
                                                            className={genericClass.genericHighlightedBox}>
                                                            <Grid gutter={{base: 6}}>
                                                                <Grid.Col span={12}>
                                                                    <Box>
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
                                                                </Grid.Col>
                                                                <Grid.Col span={12}>
                                                                    <Box>
                                                                        <SelectForm
                                                                            disabled={!vendorData}
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
                                                                            comboboxProps={{withinPortal: false}}
                                                                        />
                                                                    </Box>
                                                                </Grid.Col>
                                                                {/*<Grid.Col span={1}>
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
                                                                </Grid.Col>*/}
                                                            </Grid>
                                                        </Box>
                                                        <Box p={"xs"} className={'boxBackground'}>
                                                            <Box mt={'4'}>
                                                                <Grid columns={24} gutter={{base: 1}}>
                                                                    <Grid.Col span={10} fz="sm" mt={8}>
                                                                        {t("RequestQuantity")}
                                                                    </Grid.Col>
                                                                    <Grid.Col span={14}>
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
                                                                </Grid>
                                                            </Box>
                                                            <Box mt={'4'}>
                                                                <Grid columns={24} gutter={{base: 1}}>
                                                                    <Grid.Col span={10} fz="sm" mt={8}>
                                                                        {t("PurchasePrice")}
                                                                    </Grid.Col>
                                                                    <Grid.Col span={14}>
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
                                                                                <IconCurrency size={16} opacity={0.5}/>
                                                                            }
                                                                            closeIcon={true}
                                                                            disabled={true}
                                                                            onChange={''}
                                                                            leftSection={
                                                                                <IconCoinMonero size={16}
                                                                                                opacity={0.5}/>
                                                                            }
                                                                        />
                                                                    </Grid.Col>
                                                                </Grid>
                                                            </Box>
                                                        </Box>
                                                    </ScrollArea>
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>
                            {switchValue === "product" && (
                                <>
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
                                    <Box mt="2" className="" pl={'xs'} pt={'4'} pb={'6'}>
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
                                </>
                            )}
                            {switchValue === "list" && (
                                <>
                                    <Box mt="2" className="" pl={'xs'} pt={'4'} pb={'6'}>
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
                                                        color='var(--theme-primary-color-6)'
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
                                                                <IconSearch size={16} opacity={0.5}/>
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
                                                                            color='var( --theme-remove-color)'
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
                                                                        <IconInfoCircle size={16} opacity={0.5}/>
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
                                                        leftSection={<IconDeviceFloppy size={16}/>}
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
                        loadCardProducts={loadCardProducts}
                        setTempCardProducts={setTempCardProducts}
                        vendorData={vendorData}
                        vendorObject={vendorObject}
                        vendorsDropdownData={vendorsDropdownData}
                        isWarehouse={isWarehouse}
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
