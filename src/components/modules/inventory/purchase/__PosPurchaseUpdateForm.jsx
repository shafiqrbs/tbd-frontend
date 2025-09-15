import {isNotEmpty, useForm} from "@mantine/form";
import {useEffect, useMemo, useState} from "react";
import __PosVendorSection from "./__PosVendorSection.jsx";
import {Box, ActionIcon, TextInput, Select} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {IconX} from "@tabler/icons-react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {useToggle} from "@mantine/hooks";
import useVendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useVendorDataStoreIntoLocalStorage.js";
import {useDispatch} from "react-redux";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData";
import __PosPurchaseInvoiceSection from "./__PosPurchaseInvoiceSection.jsx";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

export default function __PosPurchaseUpdateForm(props) {
    const {id} = useParams();
    const {
        isSMSActive,
        currencySymbol,
        tempCardProducts,
        setLoadCardProducts,
        isWarehouse,
        editedData,
        setTempCardProducts,
        domainConfigData,
    } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;

    const warehouseDropdown = getCoreWarehouseDropdownData();
    const [fetching, setFetching] = useState(false);

    const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);

    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);
    const [vendorData, setVendorData] = useState(null);
    const [defaultVendorId, setDefaultVendorId] = useState(null);
    const [vendorObject, setVendorObject] = useState({});
    const [orderProcess, setOrderProcess] = useState(editedData?.order_process || "");
    const [warehouseData, setWarehouseData] = useState(String(editedData?.warehouse_id) || null);

    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);
    const [purchaseVatAmount, setPurchaseVatAmount] = useState(0);
    const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);
    const [purchaseDueAmount, setPurchaseDueAmount] = useState(0);
    const [returnOrDueText, setReturnOrDueText] = useState("Due");

    const [lastClicked, setLastClicked] = useState(null);

    const toNumber = (val) => (isNaN(Number(val)) ? 0 : Number(val));

    const purchaseSubTotalAmount = tempCardProducts?.reduce(
        (total, item) => total + Number(item.sub_total || 0),
        0
    );

    // Load vendor data
    const loadVendors = async () => {
        await useVendorDataStoreIntoLocalStorage();
        const coreVendors = JSON.parse(localStorage.getItem("core-vendors") || "[]");

        const transformed = coreVendors.map((vendor) => ({
            label: `${vendor.mobile} -- ${vendor.name}`,
            value: String(vendor.id),
        }));
        setVendorsDropdownData(transformed);

        const defaultVendor = coreVendors.find((v) => v.name === "Default");
        if (defaultVendor) setDefaultVendorId(String(defaultVendor.id));

        const selectedVendor = coreVendors.find((v) => String(v.id) === String(editedData?.vendor_id));
        if (selectedVendor) {
            setVendorObject(selectedVendor);
            setVendorData({
                label: `${selectedVendor.mobile} -- ${selectedVendor.name}`,
                value: String(selectedVendor.id),
            });
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const initialDatabaseDiscountType =
        editedData?.discount_type === "Percent" ? "Percent" : "Flat";

    const initialDiscountValue = useMemo(() => {
        setDiscountType(initialDatabaseDiscountType);
        return initialDatabaseDiscountType === "Flat"
            ? editedData?.discount || ""
            : editedData?.discount_calculation || "";
    }, [initialDatabaseDiscountType, editedData]);

    const form = useForm({
        initialValues: {
            vendor_id: String(editedData?.vendor_id || ""),
            transaction_mode_id: editedData?.transaction_mode_id || "",
            order_process: editedData?.order_process || "",
            narration: editedData?.narration || "",
            discount: initialDiscountValue,
            receive_amount: editedData?.payment || "",
            name: editedData?.vendor_name || "",
            mobile: editedData?.vendor_mobile || "",
            email: editedData?.vendor_email || "",
            warehouse_id: editedData?.warehouse_id || "",
        },
        validate: {
            transaction_mode_id: isNotEmpty(),
            vendor_id: isNotEmpty(),
            warehouse_id: (value) => {
                if (!isWarehouse) return null;
                const missing = tempCardProducts?.some((item) => !item.warehouse_id);
                return missing ? "Warehouse is required for all products." : null;
            },
        },
    });

    useEffect(() => {
        const discountValue = toNumber(form.values.discount);
        let discountAmount = 0;

        if (discountType === "Flat") {
            discountAmount = discountValue;
        } else if (discountType === "Percent" && discountValue <= 100) {
            discountAmount = (purchaseSubTotalAmount * discountValue) / 100;
        }

        discountAmount = Math.min(discountAmount, purchaseSubTotalAmount);

        setPurchaseDiscountAmount(discountAmount);

        const total = purchaseSubTotalAmount - discountAmount + Number(purchaseVatAmount);
        setPurchaseTotalAmount(total);

        const received = toNumber(form.values.receive_amount);
        setReturnOrDueText(received < total ? "Due" : "Return");
        setPurchaseDueAmount(total - received);
    }, [
        form.values.discount,
        form.values.receive_amount,
        discountType,
        purchaseSubTotalAmount,
        purchaseVatAmount,
    ]);

    const handleClick = (e) => setLastClicked(e.currentTarget.name);

    const handleFormSubmit = async (values) => {
        const createdBy = JSON.parse(localStorage.getItem("user"));
        const transformedArray = tempCardProducts.map((product) => ({
            product_id: product.product_id,
            quantity: Number(product.quantity),
            purchase_price: Number(product.purchase_price),
            sales_price: Number(product.sales_price),
            sub_total: Number(product.sub_total),
            bonus_quantity: Number(product.bonus_quantity),
            warehouse_id: Number(product.warehouse_id),
        }));

        if (!transformedArray.length) {
            showNotificationComponent(t("PleaseChooseItems"), "red");
            return;
        }

        const payload = {
            vendor_id: values.vendor_id || defaultVendorId,
            vendor_name: values.name,
            vendor_mobile: values.mobile,
            vendor_email: values.email,
            sub_total: purchaseSubTotalAmount,
            transaction_mode_id: values.transaction_mode_id,
            discount_type: discountType,
            discount: purchaseDiscountAmount,
            discount_calculation: discountType === "Percent" ? values.discount : 0,
            vat: 0,
            total: purchaseTotalAmount,
            payment: values.receive_amount > purchaseTotalAmount ? purchaseTotalAmount : values.receive_amount,
            created_by_id: createdBy?.id,
            process: orderProcess,
            narration: values.narration,
            warehouse_id: values.warehouse_id,
            items: transformedArray,
        };

        const result = await dispatch(updateEntityData({url: `inventory/purchase/${id}`, data: payload}));

        if (updateEntityData.rejected.match(result)) {
            showNotificationComponent("Fail to update", "red");
        } else if (updateEntityData.fulfilled.match(result)) {
            showNotificationComponent(t("UpdatedSuccessfully"), "teal");
            localStorage.removeItem("temp-purchase-products");
            if (lastClicked === "save") {
                navigate("/inventory/purchase");
            }
        }
    };

    const handleQuantityChange = (id, value) => {
        const updated = tempCardProducts.map((p) =>
            p.id === id
                ? {...p, quantity: Number(value), sub_total: Number(p.purchase_price) * value}
                : p
        );
        setTempCardProducts(updated);
    };

    const handlePriceChange = (id, value) => {
        const updated = tempCardProducts.map((p) =>
            p.id === id
                ? {...p, purchase_price: Number(value), sub_total: Number(p.quantity) * value}
                : p
        );
        setTempCardProducts(updated);
    };

    return (
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Box bg="white" p="xs" className="borderRadiusAll">
                <__PosVendorSection
                    form={form}
                    isSMSActive={isSMSActive}
                    currencySymbol={currencySymbol}
                    vendorObject={vendorObject}
                    setVendorObject={setVendorObject}
                    vendorData={vendorData}
                    setVendorData={setVendorData}
                    vendorsDropdownData={vendorsDropdownData}
                    setVendorsDropdownData={setVendorsDropdownData}
                    defaultVendorId={defaultVendorId}
                    setDefaultVendorId={setDefaultVendorId}
                />

                <DataTable
                    classNames={tableCss}
                    records={tempCardProducts}
                    fetching={fetching}
                    scrollAreaProps={{type: "never"}}
                    height={height - 264}
                    columns={[
                        {
                            accessor: "index",
                            title: t("S/N"),
                            render: (item, index) => index + 1,
                        },
                        {
                            accessor: "display_name",
                            title: t("Product"),
                        },
                        isWarehouse && {
                            accessor: "warehouse_id",
                            title: t("Warehouse"),
                            render: (item) => (
                                <Select
                                    key={item.id}
                                    size="xs"
                                    value={String(item.warehouse_id || "")}
                                    data={warehouseDropdown}
                                    onChange={(newValue) => {
                                        const updated = tempCardProducts.map((product) =>
                                            product.id === item.id
                                                ? {
                                                    ...product,
                                                    warehouse_id: Number(newValue),
                                                    warehouse_name:
                                                        warehouseDropdown.find((w) => w.value === newValue)?.label || "",
                                                }
                                                : product
                                        );
                                        setTempCardProducts(updated);
                                    }}
                                />
                            ),
                        },
                        {
                            accessor: "quantity",
                            title: t("Quantity"),
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.currentTarget.value)}
                                    type="number"
                                />
                            ),
                        },
                        {
                            accessor: "purchase_price",
                            title: t("Price"),
                            render: (item) => (
                                <TextInput
                                    size="xs"
                                    value={item.purchase_price}
                                    onChange={(e) => handlePriceChange(item.id, e.currentTarget.value)}
                                    type="number"
                                />
                            ),
                        },
                        {
                            accessor: "sub_total",
                            title: t("SubTotal"),
                            render: (item) => Number(item.sub_total || 0).toFixed(2),
                        },
                        {
                            accessor: "action",
                            title: "",
                            render: (item) => (
                                <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    onClick={() => {
                                        const filtered = tempCardProducts.filter((x) => x.id !== item.id);
                                        setTempCardProducts(filtered);
                                    }}
                                >
                                    <IconX size={16}/>
                                </ActionIcon>
                            ),
                        },
                    ].filter(Boolean)}
                />
            </Box>

            <__PosPurchaseInvoiceSection
                lastClicked={lastClicked}
                setLastClicked={setLastClicked}
                handleClick={handleClick}
                setVendorsDropdownData={setVendorsDropdownData}
                vendorsDropdownData={vendorsDropdownData}
                form={form}
                currencySymbol={currencySymbol}
                purchaseDiscountAmount={purchaseDiscountAmount}
                setPurchaseDiscountAmount={setPurchaseDiscountAmount}
                setOrderProcess={setOrderProcess}
                orderProcess={orderProcess}
                purchaseVatAmount={purchaseVatAmount}
                purchaseTotalAmount={purchaseTotalAmount}
                discountType={discountType}
                setDiscountType={setDiscountType}
                returnOrDueText={returnOrDueText}
                vendorData={vendorData}
                purchaseDueAmount={purchaseDueAmount}
                setLoadCardProducts={setLoadCardProducts}
                editedData={editedData}
                isWarehouse={isWarehouse}
                domainConfigData={domainConfigData}
                setWarehouseData={setWarehouseData}
                warehouseData={warehouseData}
            />
        </form>
    );
}

