import { useForm, isNotEmpty } from "@mantine/form";
import React, { useEffect, useState } from "react";
import __PosVendorSection from "./__PosVendorSection";
import {
    Box,
    Text,
    ActionIcon,
    Group,
    TextInput,
    Select,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconSum, IconX, IconCheck } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import __PosPurchaseInvoiceSection from "./__PosPurchaseInvoiceSection.jsx";
import { useToggle } from "@mantine/hooks";
import useVendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useVendorDataStoreIntoLocalStorage.js";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { rem } from "@mantine/core";
import { storeEntityData } from "../../../../store/inventory/crudSlice.js";
import useProductsDataStoreIntoLocalStorage
    from "../../../global-hook/local-storage/useProductsDataStoreIntoLocalStorage.js";

export default function __PosPurchaseForm(props) {
    const {
        isSMSActive,
        currencySymbol,
        tempCardProducts,
        setLoadCardProducts,
        isWarehouse,
        domainConfigData,
    } = props;

    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();
    const [warehouseData, setWarehouseData] = useState(null);

    const warehouseDropdown = getCoreWarehouseDropdownData();

    const form = useForm({
        initialValues: {
            vendor_id: "",
            transaction_mode_id: "",
            order_process: "",
            narration: "",
            discount: "",
            receive_amount: "",
            name: "",
            mobile: "",
            email: "",
            warehouse_id: "",
        },
        validate: {
            // transaction_mode_id: isNotEmpty(),
            vendor_id: isNotEmpty(),
            warehouse_id: (value) => {
                if (!isWarehouse) return null;

                if (value) return null;

                const missing = tempCardProducts?.some(
                    (item) => !item.warehouse_id || item.warehouse_id === ""
                );

                if (missing) {
                    return "Warehouse is required for all products.";
                }

                return null;
            }
        },
    });

    const purchaseSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
    const [vendorData, setVendorData] = useState(null);
    const [defaultVendorId, setDefaultVendorId] = useState(null);
    const [vendorObject, setVendorObject] = useState({});
    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);
    const [orderProcess, setOrderProcess] = useState(null);
    const [purchaseVatAmount, setPurchaseVatAmount] = useState(0);
    const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);
    const [purchaseDueAmount, setPurchaseDueAmount] = useState(0);
    const [returnOrDueText, setReturnOrDueText] = useState("Due");
    const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);

    useEffect(() => {
        let discountAmount = 0;
        if (form.values.discount && Number(form.values.discount) > 0) {
            discountAmount =
                discountType === "Flat"
                    ? Number(form.values.discount)
                    : (purchaseSubTotalAmount * Number(form.values.discount)) / 100;
        }

        setPurchaseDiscountAmount(discountAmount);
        const newTotalAmount =
            purchaseSubTotalAmount - discountAmount + Number(purchaseVatAmount);
        setPurchaseTotalAmount(newTotalAmount);

        const receiveAmount = Number(form.values.receive_amount || 0);
        setReturnOrDueText(newTotalAmount < receiveAmount ? "Return" : "Due");
        setPurchaseDueAmount(newTotalAmount - receiveAmount);
    }, [
        form.values.discount,
        form.values.receive_amount,
        discountType,
        purchaseSubTotalAmount,
        purchaseVatAmount,
    ]);

    // Set vendor dropdown initially
    useEffect(() => {
        const fetchVendors = async () => {
            await useVendorDataStoreIntoLocalStorage();
            let vendors = localStorage.getItem("core-vendors");
            vendors = vendors ? JSON.parse(vendors) : [];

            const transformed = vendors.map((vendor) => ({
                label: vendor.mobile + " -- " + vendor.name,
                value: String(vendor.id),
            }));
            setVendorsDropdownData(transformed);
        };
        fetchVendors();
    }, []);

    return (
        <form
            onSubmit={form.onSubmit(async (values) => {
                const tempProducts = localStorage.getItem("temp-purchase-products");
                let items = tempProducts ? JSON.parse(tempProducts) : [];
                const transformedItems = items.map((product) => ({
                    product_id: product.product_id,
                    warehouse_id: product.warehouse_id,
                    quantity: product.quantity,
                    purchase_price: product.purchase_price,
                    sales_price: product.sales_price,
                    bonus_quantity: product.bonus_quantity,
                    sub_total: product.sub_total,
                    name: product.display_name,
                }));

                const data = {
                    url: "inventory/purchase",
                    data: {
                        vendor_id: form.values.vendor_id || defaultVendorId,
                        vendor_name: form.values.name,
                        vendor_mobile: form.values.mobile,
                        vendor_email: form.values.email,
                        sub_total: purchaseSubTotalAmount,
                        transaction_mode_id: form.values.transaction_mode_id || null,
                        discount_type: discountType,
                        discount: purchaseDiscountAmount,
                        discount_calculation:
                            discountType === "Percent" ? form.values.discount : 0,
                        vat: 0,
                        total: purchaseTotalAmount,
                        payment: form.values.receive_amount,
                        process: form.values.order_process,
                        narration: form.values.narration,
                        warehouse_id: form.values.warehouse_id,
                        invoice_date: new Date().toLocaleDateString("en-CA"),
                        items: transformedItems,
                    },
                };
                dispatch(storeEntityData(data));
                notifications.show({
                    color: "teal",
                    title: t("CreateSuccessfully"),
                    icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                    autoClose: 700,
                    style: {backgroundColor: "#e6fff2"},
                });
                await useProductsDataStoreIntoLocalStorage()

                setTimeout(() => {
                    localStorage.removeItem("temp-purchase-products");
                    form.reset();
                    setVendorData(null);
                    setOrderProcess(null);
                    setWarehouseData(null);
                    setLoadCardProducts(true);
                }, 500);
            })}
        >
            <Box bg="white" p="xs" className="borderRadiusAll">
                <__PosVendorSection
                    form={form}
                    vendorObject={vendorObject}
                    setVendorObject={setVendorObject}
                    vendorData={vendorData}
                    setVendorData={setVendorData}
                    vendorsDropdownData={vendorsDropdownData}
                    setVendorsDropdownData={setVendorsDropdownData}
                    defaultVendorId={defaultVendorId}
                    setDefaultVendorId={setDefaultVendorId}
                    isSMSActive={isSMSActive}
                    currencySymbol={currencySymbol}
                />

                <Box className="borderRadiusAll">
                    <DataTable
                        classNames={tableCss}
                        records={tempCardProducts}
                        columns={[
                            {
                                accessor: "index",
                                title: t("S/N"),
                                render: (item) => tempCardProducts.indexOf(item) + 1,
                            },
                            {
                                accessor: "display_name",
                                title: t("Product"),
                            },
                            isWarehouse && {
                                accessor: "warehouse_id",
                                title: t("Warehouse"),
                                render: (item) => {
                                    const warehouseValue = String(item.warehouse_id || "");
                                    return (
                                        <Select
                                            size="xs"
                                            placeholder="Select"
                                            value={warehouseValue}
                                            data={warehouseDropdown}
                                            onChange={(newValue) => {
                                                const data =
                                                    JSON.parse(
                                                        localStorage.getItem("temp-purchase-products") || "[]"
                                                    ) || [];

                                                const updated = data.map((p) =>
                                                    p.product_id === item.product_id
                                                        ? {
                                                            ...p,
                                                            warehouse_id: Number(newValue),
                                                            warehouse_name:
                                                                warehouseDropdown.find(
                                                                    (w) => w.value === newValue
                                                                )?.label || "",
                                                        }
                                                        : p
                                                );

                                                localStorage.setItem(
                                                    "temp-purchase-products",
                                                    JSON.stringify(updated)
                                                );
                                                setLoadCardProducts(true);
                                            }}
                                        />
                                    );
                                },
                            },
                            {
                                accessor: "quantity",
                                title: t("Qty"),
                                render: (item) => {
                                    const onQtyChange = (val) => {
                                        const data = JSON.parse(localStorage.getItem("temp-purchase-products") || "[]");
                                        const updated = data.map((p) =>
                                            p.product_id === item.product_id
                                                ? { ...p, quantity: val, sub_total: val * p.purchase_price }
                                                : p
                                        );
                                        localStorage.setItem("temp-purchase-products", JSON.stringify(updated));
                                        setLoadCardProducts(true);
                                    };

                                    return (
                                        <TextInput
                                            size="xs"
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => onQtyChange(Number(e.currentTarget.value))}
                                        />
                                    );
                                }
                            },

                            {
                                accessor: "purchase_price",
                                title: t("Price"),
                                render: (item) => {
                                    const [price, setPrice] = useState(item.purchase_price);
                                    useEffect(() => {
                                        const timeout = setTimeout(() => {
                                            const data = JSON.parse(localStorage.getItem("temp-purchase-products") || "[]");
                                            const updated = data.map((p) =>
                                                p.product_id === item.product_id
                                                    ? { ...p, purchase_price: price, sub_total: price * item.quantity }
                                                    : p
                                            );
                                            localStorage.setItem("temp-purchase-products", JSON.stringify(updated));
                                            setLoadCardProducts(true); // ✅
                                        }, 600);
                                        return () => clearTimeout(timeout);
                                    }, [price]);

                                    return (
                                        <TextInput
                                            size="xs"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.currentTarget.value))}
                                        />
                                    );
                                },
                            },
                            {
                                accessor: "sub_total",
                                title: t("SubTotal"),
                                render: (item) => Number(item.sub_total || 0).toFixed(2),
                            },
                            {
                                accessor: "action",
                                title: t(""),
                                render: (item) => (
                                    <ActionIcon
                                        size="sm"
                                        color="red"
                                        onClick={() => {
                                            const data = JSON.parse(localStorage.getItem("temp-purchase-products") || "[]");
                                            const filtered = data.filter((x) => x.product_id !== item.product_id);
                                            localStorage.setItem("temp-purchase-products", JSON.stringify(filtered));
                                            setLoadCardProducts(true);
                                        }}
                                    >
                                        <IconX size={16} />
                                    </ActionIcon>
                                ),
                            },
                        ].filter(Boolean)} // Filter undefined when isWarehouse is false
                        height={height - 305}
                        scrollAreaProps={{ type: "never" }}
                    />

                    <Group bg="var(--theme-primary-color-2)" h={34} justify="space-between">
                        <Group pl="xs">
                            <IconSum size="1.25rem" />
                            <Text>{tempCardProducts.length} {t("Items")}</Text>
                        </Group>
                        <Group mr={28}>
                            <Text fw="600">{purchaseSubTotalAmount.toFixed(2)}</Text>
                        </Group>
                    </Group>
                </Box>
            </Box>

            <__PosPurchaseInvoiceSection
                domainConfigData={domainConfigData}
                vendorData={vendorData}
                currencySymbol={currencySymbol}
                form={form}
                setOrderProcess={setOrderProcess}
                orderProcess={orderProcess}
                setPurchaseDiscountAmount={setPurchaseDiscountAmount}
                purchaseDiscountAmount={purchaseDiscountAmount}
                purchaseVatAmount={purchaseVatAmount}
                purchaseTotalAmount={purchaseTotalAmount}
                purchaseDueAmount={purchaseDueAmount}
                setDiscountType={setDiscountType}
                discountType={discountType}
                returnOrDueText={returnOrDueText}
                warehouseData={warehouseData}
                setWarehouseData={setWarehouseData}
                setLoadCardProducts={setLoadCardProducts}
                setVendorsDropdownData={setVendorsDropdownData}
                vendorsDropdownData={vendorsDropdownData}
            />
        </form>
    );
}
