import {isNotEmpty, useForm} from "@mantine/form";
import React, {useEffect, useState} from "react";
import __PosCustomerSection from "./__PosCustomerSection";
import {Box, Text, ActionIcon, Group, TextInput, Select} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {IconPercentage, IconSum, IconX} from "@tabler/icons-react";
import {useOutletContext} from "react-router-dom";
import __PosInvoiceSection from "./__PosInvoiceSetion.jsx";
import {useToggle} from "@mantine/hooks";
import useCustomerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useCustomerDataStoreIntoLocalStorage.js";
import {useDispatch} from "react-redux";
import {storeEntityData, updateEntityData} from "../../../../store/inventory/crudSlice.js";
import inputCss from "../../../../assets/css/InlineInputField.module.css";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import genericClass from "../../../../assets/css/Generic.module.css";
import useProductsDataStoreIntoLocalStorage
    from "../../../global-hook/local-storage/useProductsDataStoreIntoLocalStorage.js";

// Utility: Parses localStorage safely
const getJSON = (key, fallback = null) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        console.warn(`Error parsing localStorage key: ${key}`, e);
        return fallback;
    }
};
export default function __PosSalesForm(props) {
    const {
        isSMSActive,
        currencySymbol,
        tempCardProducts,
        setLoadCardProducts,
        salesConfig,
        isWarehouse,
        setSearchValue
    } = props;

    //common hooks
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();

    // transaction mode array
    const transactionModeData = JSON.parse(localStorage.getItem("accounting-transaction-mode")) ? JSON.parse(localStorage.getItem("accounting-transaction-mode")) : [];

    // form
    const form = useForm({
        initialValues: {
            customer_id: "",
            transaction_mode_id: transactionModeData.find(item => item.is_selected === 1)?.id,
            sales_by: "",
            order_process: "",
            narration: "",
            discount: "",
            receive_amount: "",
            name: "",
            mobile: "",
            email: "",
        },
        validate: {
            transaction_mode_id: isNotEmpty(),
        },
    });


    let salesSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;
    const [customersDropdownData, setCustomersDropdownData] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [defaultCustomerId, setDefaultCustomerId] = useState(null);
    // setting defualt customer
    useEffect(() => {
        const fetchCustomers = async () => {
            await useCustomerDataStoreIntoLocalStorage();
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
                if (salesConfig?.default_customer_group_id == '47') {
                    setDefaultCustomerId(defaultId);
                    setCustomerData(String(defaultId));
                    form.setFieldValue("customer_id", defaultId);
                }
            }
        };

        fetchCustomers();
    }, []);

    const [customerObject, setCustomerObject] = useState({});
    const [salesProfitAmount, setSalesProfitAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    const [salesByUser, setSalesByUser] = useState(null);
    const [orderProcess, setOrderProcess] = useState(null);
    const [salesVatAmount, setSalesVatAmount] = useState(0);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(0);
    const [returnOrDueText, setReturnOrDueText] = useState("Due");
    const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);
    const [discount, setDiscount] = useState('')
    // calculate sales total amount after discount and vat change
    useEffect(() => {
        let discountAmount = '';
        if (form.values.discount && Number(form.values.discount) > 0) {
            if (discountType === "Flat") {
                discountAmount = Number(form.values.discount);
                setDiscount(form.values.discount)
            } else if (discountType === "Percent") {
                if (form.values.discount.length < 3) {
                    discountAmount = (salesSubTotalAmount * Number(form.values.discount)) / 100;
                    setDiscount(form.values.discount)
                } else {
                    setDiscount('')
                }
            }

        }
        setSalesDiscountAmount(discountAmount);

        // Calculate total amount after discount and VAT
        const newTotalAmount =
            salesSubTotalAmount - Number(discountAmount) + Number(salesVatAmount);
        setSalesTotalAmount(newTotalAmount);

        let returnOrDueAmount = 0;
        let receiveAmount =
            form.values.receive_amount == "" ? 0 : Number(form.values.receive_amount);
        if (receiveAmount >= 0) {
            const text = newTotalAmount < receiveAmount ? "Return" : "Due";
            setReturnOrDueText(text);
            returnOrDueAmount = newTotalAmount - receiveAmount;
            setSalesDueAmount(returnOrDueAmount);
        }
    }, [
        form.values.discount,
        discountType,
        form.values.receive_amount,
        salesSubTotalAmount,
        salesVatAmount,
    ]);

    const handleFormSubmit = async (values) => {
        const tempProducts = localStorage.getItem("temp-sales-products");
        let items = tempProducts ? JSON.parse(tempProducts) : [];
        let createdBy = JSON.parse(localStorage.getItem("user"));

        let transformedArray = items.map((product) => {
            // Calculate measurement string safely
            const measurementString = product?.measurement_unit?.id
                ? `${product.unit_quantity || 0}*${product.measurement_unit?.quantity || 0}=${(product.unit_quantity || 0) * (product.measurement_unit?.quantity || 0)} ${product.unit_name || ''}`
                : null;

            return {
                product_id: product.product_id,
                item_name: product.display_name,
                sales_price: product.sales_price,
                price: product.price,
                percent: product.percent,
                quantity: product.quantity,
                price_matrix_id: product?.multi_price_item?.id || null,
                measurement_unit_id: product?.measurement_unit?.id || null,
                measurement_unit_quantity: product?.measurement_unit?.id ? product.unit_quantity : null,
                measurement_unit_name: product?.measurement_unit?.id ? product.measurement_unit?.unit_name : null,
                measurement_string: measurementString,
                uom: product.unit_name,
                unit_id: product.unit_id,
                purchase_price: product.purchase_price,
                sub_total: product.sub_total,
                warehouse_id: product.product_warehouse_id,
                purchase_item_id: product.purchase_item_id,
                bonus_quantity: product.bonus_quantity,
            };
        });

        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        const formValue = {};
        formValue["customer_id"] = form.values.customer_id
            ? form.values.customer_id
            : defaultCustomerId;

        // Include manual customer input fields if no customer is selected
        if (
            !form.values.customer_id ||
            form.values.customer_id === defaultCustomerId
        ) {
            formValue["customer_name"] = form.values.name;
            formValue["customer_mobile"] = form.values.mobile;
            formValue["customer_email"] = form.values.email;
        }

        formValue["sub_total"] = salesSubTotalAmount;
        formValue["transaction_mode_id"] = form.values.transaction_mode_id;
        formValue["discount_type"] = discountType;
        formValue["discount"] = salesDiscountAmount;
        formValue["discount_calculation"] = discountType === "Percent" ? form.values.discount : 0;
        formValue["vat"] = 0;
        formValue["total"] = salesTotalAmount;
        formValue["sales_by_id"] = form.values.sales_by;
        formValue["created_by_id"] = Number(createdBy["id"]);
        formValue["process"] = form.values.order_process;
        formValue["narration"] = form.values.narration;
        formValue["invoice_date"] =
            form.values.invoice_date ?
                new Date(form.values.invoice_date).toLocaleDateString(
                    "en-CA",
                    options
                ) : new Date().toLocaleDateString(
                    "en-CA",
                    options
                )
        formValue["items"] = transformedArray ? transformedArray : [];

        const hasReceiveAmount = form.values.receive_amount;
        const isDefaultCustomer =
            !form.values.customer_id ||
            form.values.customer_id === defaultCustomerId;

        formValue["payment"] = hasReceiveAmount ? (form.values.receive_amount > salesTotalAmount ? salesTotalAmount : form.values.receive_amount) : salesConfig?.is_zero_receive_allow && isDefaultCustomer ? salesTotalAmount : 0;

        // Check if default customer needs receive amount
        if (
            isDefaultCustomer &&
            !salesConfig?.is_zero_receive_allow &&
            (!form.values.receive_amount ||
                Number(form.values.receive_amount) <= 0 ||
                Number(form.values.receive_amount) < salesTotalAmount)
        ) {
            form.setFieldError(
                "receive_amount",
                t("Receive amount must cover the total for default customer")
            );

            showNotificationComponent(t("Default customer must pay full amount"), 'red')
            return;
        }

        // Also ensure transaction mode is selected
        if (!form.values.transaction_mode_id) {
            form.setFieldError(
                "transaction_mode_id",
                "Please select a payment method"
            );
            showNotificationComponent("Please select a payment method", 'red')
            return;
        }

        if (items && items.length > 0) {
            const data = {
                url: "inventory/sales",
                data: formValue,
            };

            const resultAction = await dispatch(storeEntityData(data));
            if (storeEntityData.rejected.match(resultAction)) {
                showNotificationComponent('Fail to sales', 'red')
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t("CreateSuccessfully"), 'teal')
                await useProductsDataStoreIntoLocalStorage()

                setTimeout(() => {
                    localStorage.removeItem("temp-sales-products");
                    form.reset();
                    setCustomerData(null);
                    setSalesByUser(null);
                    setOrderProcess(null);
                    setLoadCardProducts(true);
                    setCustomerObject(null);
                    setSearchValue(null)
                }, 500);
            }
        } else {
            showNotificationComponent(t("PleaseChooseItems"), 'red')
        }
    }

    return (
        <>
            <form
                onSubmit={form.onSubmit(handleFormSubmit)}
            >
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <__PosCustomerSection
                        form={form}
                        isSMSActive={isSMSActive}
                        currencySymbol={currencySymbol}
                        customerObject={customerObject}
                        setCustomerObject={setCustomerObject}
                        customerData={customerData}
                        setCustomerData={setCustomerData}
                        customersDropdownData={customersDropdownData}
                        setCustomersDropdownData={setCustomersDropdownData}
                        defaultCustomerId={defaultCustomerId}
                        setDefaultCustomerId={setDefaultCustomerId}
                    />
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
                                },
                                {
                                    accessor: "price",
                                    title: t("Price"),
                                    textAlign: "right",
                                    render: (item) => {
                                        return item.price && Number(item.price).toFixed(2);
                                    },
                                },

                                isWarehouse && {
                                    accessor: "product_warehouse_id",
                                    title: t("Warehouse"),
                                    render: (item) => {
                                        const warehouseValue = String(item.product_warehouse_id || "");
                                        return (
                                            <Select
                                                size="xs"
                                                placeholder="Select"
                                                value={warehouseValue}
                                                data={item?.productWarehouseDropdown}
                                                onChange={(newValue) => {
                                                    const data =
                                                        JSON.parse(
                                                            localStorage.getItem("temp-sales-products") || "[]"
                                                        ) || [];

                                                    const updated = data.map((p) =>
                                                        p.product_id === item.product_id
                                                            ? {
                                                                ...p,
                                                                product_warehouse_id: Number(newValue),
                                                                warehouse_name:
                                                                    item?.productWarehouseDropdown.find(
                                                                        (w) => w.value === newValue
                                                                    )?.label || "",
                                                            }
                                                            : p
                                                    );

                                                    localStorage.setItem(
                                                        "temp-sales-products",
                                                        JSON.stringify(updated)
                                                    );
                                                    setLoadCardProducts(true);
                                                }}
                                            />
                                        );
                                    },
                                },
                                {
                                    accessor: "stock",
                                    title: t("Stock"),
                                    textAlign: "center",
                                },
                                {
                                    accessor: "purchase_item_id",
                                    title: t("PurchaseItem"),
                                    render: (item) => {
                                        const purchaseItemValue = String(item.purchase_item_id || "");
                                        return (
                                            <Select
                                                size="xs"
                                                placeholder="Select"
                                                value={purchaseItemValue}
                                                data={item?.productPurchaseItemDropdown}
                                                onChange={(newValue) => {
                                                    const data =
                                                        JSON.parse(localStorage.getItem("temp-sales-products") || "[]") || [];

                                                    const updated = data.map((p) =>
                                                        p.product_id === item.product_id
                                                            ? {
                                                                ...p,
                                                                purchase_item_id: Number(newValue),
                                                                quantity: null, // reset quantity to 0
                                                                unit_quantity: null,
                                                            }
                                                            : p
                                                    );

                                                    localStorage.setItem("temp-sales-products", JSON.stringify(updated));
                                                    setLoadCardProducts(true);
                                                    const el = document.getElementById("quantity_"+item.id);
                                                    if (!el) return;
                                                    el.focus();
                                                }}
                                            />
                                        );
                                    },
                                },

                                {
                                    accessor: "quantity",
                                    title: t("Quantity"),
                                    textAlign: "center",
                                    width: "140px",
                                    render: (item) => {
                                        const [editedQuantity, setEditedQuantity] = useState(
                                            item.unit_quantity !== undefined && item?.measurement_unit?.quantity
                                                ? item.unit_quantity
                                                : item.quantity
                                        );

                                        // 🔹 Add this effect to sync UI when purchase_item_id or quantity changes
                                        useEffect(() => {
                                            const newValue =
                                                item.unit_quantity !== undefined && item?.measurement_unit?.quantity
                                                    ? item.unit_quantity
                                                    : item.quantity;
                                            setEditedQuantity(newValue || '');
                                        }, [item.purchase_item_id, item.quantity]);

                                        const handleQuantityChange = (e) => {
                                            const newValue = Number(e.currentTarget.value) || 0;
                                            setEditedQuantity(newValue);

                                            const tempCardProducts = localStorage.getItem("temp-sales-products");
                                            const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];

                                            const updatedProducts = cardProducts.map((product) => {
                                                if (product.product_id === item.product_id) {
                                                    let quantity = 0;
                                                    const selectedQuantity = item?.measurement_unit?.quantity;
                                                    const unitId = item?.measurement_unit?.id;

                                                    if (selectedQuantity && unitId) {
                                                        quantity = selectedQuantity * newValue;
                                                    } else {
                                                        quantity = newValue;
                                                    }

                                                    // --- Validation ---
                                                    const productPurchaseItemDropdown = item?.productPurchaseItemDropdown || [];
                                                    const selectedItem = productPurchaseItemDropdown.find(
                                                        (opt) => Number(opt.value) === Number(item.purchase_item_id)
                                                    );

                                                    if (productPurchaseItemDropdown.length > 0 && selectedItem) {
                                                        const match = selectedItem.label.match(/\(stock #(\d+)\)/);
                                                        const stockNumber = match ? Number(match[1]) : null;

                                                        if (stockNumber !== null && quantity > stockNumber) {
                                                            alert(`Quantity exceeds stock limit (${stockNumber})`);
                                                            setEditedQuantity("");
                                                            return product;
                                                        }
                                                    }
                                                    // --- End Validation ---

                                                    return {
                                                        ...product,
                                                        quantity: quantity,
                                                        unit_quantity:
                                                            selectedQuantity && unitId ? newValue || null : null,
                                                        sub_total: quantity * item.sales_price,
                                                    };
                                                }
                                                return product;
                                            });

                                            localStorage.setItem("temp-sales-products", JSON.stringify(updatedProducts));
                                            setLoadCardProducts(true);
                                        };

                                        const handleKeyDown = (e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const nextElement = document.getElementById(
                                                    `inline-update-quantity-${item.product_id}`
                                                );
                                                if (nextElement) nextElement.focus();
                                            }
                                        };

                                        return (
                                            <TextInput
                                                type="number"
                                                label=""
                                                id={`quantity_`+item.id}
                                                classNames={inputCss}
                                                size="xs"
                                                value={editedQuantity}
                                                onChange={handleQuantityChange}
                                                onKeyDown={handleKeyDown}
                                                rightSection={
                                                    <Text
                                                        style={{ textAlign: "right", width: "100%", paddingRight: 16 }}
                                                        fz="xs"
                                                        color={"gray"}
                                                    >
                                                        {item?.measurement_unit?.unit_name || item.unit_name}
                                                    </Text>
                                                }
                                                rightSectionWidth={50}
                                            />
                                        );
                                    },
                                },
                                {
                                    accessor: "unit_name",
                                    title: t("UOM"),
                                    textAlign: "center",
                                    render: (item) => {
                                        if (
                                            item?.unit_quantity &&
                                            item?.measurement_unit &&
                                            item?.unit_quantity > 0 &&
                                            item?.measurement_unit?.unit_name
                                        ) {
                                            const unitName = item.measurement_unit.unit_name;
                                            const unitQty = item.unit_quantity;
                                            const convertedQty = unitQty * item.measurement_unit.quantity;
                                            const baseUnitName = item.unit_name;

                                            return (
                                                <>
                                                    <span style={{color: 'red'}}>
                              {unitQty}*{item.measurement_unit.quantity}={convertedQty} {baseUnitName}
                            </span>
                                                </>
                                            );
                                        } else {
                                            return item.unit_name;
                                        }
                                    }
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
                                                const updatedProducts = cardProducts.map((product) => {
                                                    if (product.product_id === item.product_id) {
                                                        return {
                                                            ...product,
                                                            sales_price: editedSalesPrice,
                                                            sub_total: editedSalesPrice * item.quantity,
                                                        };
                                                    }
                                                    return product;
                                                });

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
                                                    classNames={inputCss}
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

                                            if (e.currentTarget.value && e.currentTarget.value >= 0) {
                                                const updatedProducts = cardProducts.map((product) => {
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
                                                });

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
                                                    classNames={inputCss}
                                                    size="xs"
                                                    value={editedPercent}
                                                    onChange={handlePercentChange}
                                                    rightSection={
                                                        editedPercent === "" ? (
                                                            <>
                                                                {item.percent}
                                                                <IconPercentage size={16} opacity={0.5}/>
                                                            </>
                                                        ) : (
                                                            <IconPercentage size={16} opacity={0.5}/>
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
                                },

                                {
                                    accessor: "sub_total",
                                    title: t("SubTotal"),
                                    textAlign: "right",
                                    render: (item) => {
                                        return item.sub_total && Number(item.sub_total).toFixed(2);
                                    },
                                },
                                {
                                    accessor: "action",
                                    title: t("Action"),
                                    textAlign: "right",
                                    render: (item) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="outline"
                                                radius="xl"
                                                color='var(--theme-remove-color)'
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
                                                    style={{width: "70%", height: "70%"}}
                                                    stroke={1.5}
                                                />
                                            </ActionIcon>
                                        </Group>
                                    ),
                                },
                            ].filter(Boolean)}
                            fetching={fetching}
                            totalRecords={100}
                            recordsPerPage={10}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height - 312}
                        />
                        <Group
                            h={34}
                            justify="space-between"
                            align="center"
                            pt={0}
                            bg='var(--theme-primary-color-2)'

                        >
                            <Group spacing="xs" pl={"xs"}>
                                <IconSum size="1.25em"/>
                                <Text mb={-2}>
                                    {tempCardProducts.length} {t("Items")}
                                </Text>
                            </Group>
                            <Group gap="10" align="center" mr={28}>
                                <IconSum size="16" style={{color: "black"}}/>
                                <Text fw={"600"} fz={"md"}>
                                    {salesSubTotalAmount.toFixed(2)}
                                </Text>
                            </Group>
                        </Group>
                    </Box>
                </Box>
                <Box>
                    <__PosInvoiceSection
                        setCustomersDropdownData={setCustomersDropdownData}
                        customersDropdownData={customersDropdownData}
                        form={form}
                        currencySymbol={currencySymbol}
                        salesDiscountAmount={salesDiscountAmount}
                        salesProfitAmount={salesProfitAmount}
                        setSalesDiscountAmount={setSalesDiscountAmount}
                        setSalesByUser={setSalesByUser}
                        setOrderProcess={setOrderProcess}
                        orderProcess={orderProcess}
                        salesByUser={salesByUser}
                        salesVatAmount={salesVatAmount}
                        salesTotalAmount={salesTotalAmount}
                        discountType={discountType}
                        setDiscountType={setDiscountType}
                        returnOrDueText={returnOrDueText}
                        customerData={customerData}
                        salesConfig={salesConfig}
                        salesDueAmount={salesDueAmount}
                        setLoadCardProducts={setLoadCardProducts}
                        discount={discount}
                        setDiscount={setDiscount}
                    />
                </Box>
            </form>
        </>
    );
}
