import {isNotEmpty, useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import __PosVendorSection from "./__PosVendorSection";
import {Box, Text, ActionIcon, Group, TextInput} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {IconPercentage, IconSum, IconX} from "@tabler/icons-react";
import {useOutletContext} from "react-router-dom";
import __PosPurchaseInvoiceSection from "./__PosPurchaseInvoiceSection.jsx";
import {getHotkeyHandler, useToggle} from "@mantine/hooks";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import {useDispatch} from "react-redux";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import {rem} from "@mantine/core";
import {storeEntityData} from "../../../../store/inventory/crudSlice.js";

export default function __PosPurchaseForm(props) {
    const {
        isSMSActive,
        currencySymbol,
        domainId,
        tempCardProducts,
        setLoadCardProducts,
        isWarehouse,
        domainConfigData,
    } = props;

    //common hooks
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();

    // form
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
            transaction_mode_id: isNotEmpty(),
            vendor_id: isNotEmpty(),
        },
    });

    //calculate subTotal amount
    let purchaseSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

    //customer dropdown data
    const [vendorsDropdownData, setVendorsDropdownData] = useState([]);

    //customer hook
    const [vendorData, setVendorData] = useState(null);

    // setting defualt customer
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

    //default customer hook
    const [defaultVendorId, setDefaultVendorId] = useState(null);

    //Custoemr object hook
    const [vendorObject, setVendorObject] = useState({});

    //sales discount amount hook
    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);

    //order process hook
    const [orderProcess, setOrderProcess] = useState(null);

    //vat amount hook
    const [purchaseVatAmount, setPurchaseVatAmount] = useState(0);

    //sales total amount hook
    const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);

    // sales due amount hook
    const [purchaseDueAmount, setPurchaseDueAmount] = useState(0);

    //return or due text hook
    const [returnOrDueText, setReturnOrDueText] = useState("Due");

    //discount type hook
    const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);

    // calculate sales total amount after discount and vat change
    useEffect(() => {
        let discountAmount = 0;
        if (form.values.discount && Number(form.values.discount) > 0) {
            if (discountType === "Flat") {
                discountAmount = Number(form.values.discount);
            } else if (discountType === "Percent") {
                discountAmount =
                    (purchaseSubTotalAmount * Number(form.values.discount)) / 100;
            }
        }
        setPurchaseDiscountAmount(discountAmount);

        // Calculate total amount after discount and VAT
        const newTotalAmount =
            purchaseSubTotalAmount -
            Number(discountAmount) +
            Number(purchaseVatAmount);
        setPurchaseTotalAmount(newTotalAmount);

        let returnOrDueAmount = 0;
        let receiveAmount =
            form.values.receive_amount == "" ? 0 : Number(form.values.receive_amount);
        if (receiveAmount >= 0) {
            const text = newTotalAmount < receiveAmount ? "Return" : "Due";
            setReturnOrDueText(text);
            returnOrDueAmount = newTotalAmount - receiveAmount;
            setPurchaseDueAmount(returnOrDueAmount);
        }
    }, [
        form.values.discount,
        discountType,
        form.values.receive_amount,
        purchaseSubTotalAmount,
        purchaseVatAmount,
    ]);

    return (
        <>
            <form
                onSubmit={form.onSubmit((values) => {
                    const tempProducts = localStorage.getItem("temp-purchase-products");
                    let items = tempProducts ? JSON.parse(tempProducts) : [];
                    let createdBy = JSON.parse(localStorage.getItem("user"));
                    let transformedArray = items.map((product) => {
                        return {
                            product_id: product.product_id,
                            warehouse_id: product.warehouse_id,
                            quantity: product.quantity,
                            purchase_price: product.purchase_price,
                            sales_price: product.sales_price,
                            bonus_quantity: product.bonus_quantity,
                            sub_total: product.sub_total,
                            name: product.display_name,
                        };
                    });

                    const options = {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    };
                    const formValue = {};
                    formValue["vendor_id"] = form.values.vendor_id
                        ? form.values.vendor_id
                        : defaultVendorId;

                    // Include manual customer input fields if no customer is selected
                    if (
                        !form.values.vendor_id ||
                        form.values.vendor_id == defaultVendorId
                    ) {
                        formValue["vendor_name"] = form.values.name;
                        formValue["vendor_mobile"] = form.values.mobile;
                        formValue["vendor_email"] = form.values.email;
                    }
                    formValue["vendor_id"] = form.values.vendor_id;
                    formValue["sub_total"] = purchaseSubTotalAmount;
                    formValue["transaction_mode_id"] = form.values.transaction_mode_id;
                    formValue["discount_type"] = discountType;
                    formValue["discount"] = purchaseDiscountAmount;
                    formValue["discount_calculation"] =
                        discountType === "Percent" ? form.values.discount : 0;
                    formValue["vat"] = 0;
                    formValue["total"] = purchaseTotalAmount;
                    formValue["payment"] = form.values.receive_amount;
                    // formValue["created_by_id"] = Number(createdBy["id"]);
                    formValue["process"] = form.values.order_process;
                    formValue["narration"] = form.values.narration;
                    formValue["invoice_date"] =
                        form.values.invoice_date &&
                        new Date(form.values.invoice_date).toLocaleDateString(
                            "en-CA",
                            options
                        );
                    formValue["items"] = transformedArray ? transformedArray : [];

                    const data = {
                        url: "inventory/purchase",
                        data: formValue,
                    };
                    dispatch(storeEntityData(data));
                    notifications.show({
                        color: "teal",
                        title: t("CreateSuccessfully"),
                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                        loading: false,
                        autoClose: 700,
                        style: {backgroundColor: "lightgray"},
                    });

                    setTimeout(() => {
                        localStorage.removeItem("temp-purchase-products");
                        form.reset();
                        setVendorData(null);
                        setOrderProcess(null);
                        setLoadCardProducts(true);
                        setVendorObject(null);
                    }, 700);
                })}
            >
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
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
                                    textAlign: "right",
                                    render: (item) => tempCardProducts.indexOf(item) + 1,
                                },
                                {
                                    accessor: "display_name",
                                    title: t("Name"),
                                    width: isWarehouse ? "30%" : "50%",
                                },
                                {
                                    accessor: "warehouse_name",
                                    title: t("Warehouse"),
                                    width: "20%",
                                    hidden: !isWarehouse,
                                },
                                {
                                    accessor: "bonus_quantity",
                                    title: t("BonusQuantityTable"),
                                },
                                {
                                    accessor: "quantity",
                                    title: t("Quantity"),
                                    width: "10%",
                                    render: (item) => {
                                        const [editedQuantity, setEditedQuantity] = useState(
                                            item.quantity
                                        );

                                        const handlQuantityChange = (e) => {
                                            const editedQuantity = e.currentTarget.value;
                                            setEditedQuantity(editedQuantity);

                                            const tempCardProducts = localStorage.getItem(
                                                "temp-purchase-products"
                                            );
                                            const cardProducts = tempCardProducts
                                                ? JSON.parse(tempCardProducts)
                                                : [];

                                            const updatedProducts = cardProducts.map((product) => {
                                                if (product.product_id === item.product_id) {
                                                    return {
                                                        ...product,
                                                        quantity: e.currentTarget.value,
                                                        sub_total: e.currentTarget.value * item.sales_price,
                                                    };
                                                }
                                                return product;
                                            });

                                            localStorage.setItem(
                                                "temp-purchase-products",
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
                                                    onChange={handlQuantityChange}
                                                    onKeyDown={getHotkeyHandler([
                                                        [
                                                            "Enter",
                                                            (e) => {
                                                                document
                                                                    .getElementById(
                                                                        "inline-update-quantity-" + item.product_id
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
                                    width: "10%",
                                    textAlign: "center",
                                },
                                {
                                    accessor: "purchase_price",
                                    title: t("Price"),
                                    width: "10%",
                                    render: (item) => {
                                        const [editedPurchasePrice, setEditedPurchasePrice] =
                                            useState(item.purchase_price);
                                        const handlePurchasePriceChange = (e) => {
                                            const newSalesPrice = e.currentTarget.value;
                                            setEditedPurchasePrice(newSalesPrice);
                                        };
                                        useEffect(() => {
                                            const timeoutId = setTimeout(() => {
                                                const tempCardProducts = localStorage.getItem(
                                                    "temp-purchase-products"
                                                );
                                                const cardProducts = tempCardProducts
                                                    ? JSON.parse(tempCardProducts)
                                                    : [];
                                                const updatedProducts = cardProducts.map((product) => {
                                                    if (product.product_id === item.product_id) {
                                                        return {
                                                            ...product,
                                                            purchase_price: editedPurchasePrice,
                                                            sub_total: editedPurchasePrice * item.quantity,
                                                        };
                                                    }
                                                    return product;
                                                });

                                                localStorage.setItem(
                                                    "temp-purchase-products",
                                                    JSON.stringify(updatedProducts)
                                                );
                                                setLoadCardProducts(true);
                                            }, 1000);

                                            return () => clearTimeout(timeoutId);
                                        }, [editedPurchasePrice, item.product_id, item.quantity]);

                                        return (
                                            <>
                                                <TextInput
                                                    type="number"
                                                    label=""
                                                    size="xs"
                                                    id={"inline-update-quantity-" + item.product_id}
                                                    value={editedPurchasePrice}
                                                    onChange={handlePurchasePriceChange}
                                                />
                                            </>
                                        );
                                    },
                                },

                                {
                                    accessor: "sub_total",
                                    title: t("SubTotal"),
                                    width: "15%",
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
                                                variant="subtle"
                                                color="red"
                                                onClick={() => {
                                                    const dataString = localStorage.getItem(
                                                        "temp-purchase-products"
                                                    );
                                                    let data = dataString ? JSON.parse(dataString) : [];

                                                    data = data.filter(
                                                        (d) => d.product_id !== item.product_id
                                                    );

                                                    const updatedDataString = JSON.stringify(data);

                                                    localStorage.setItem(
                                                        "temp-purchase-products",
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
                            ]}
                            fetching={fetching}
                            totalRecords={100}
                            recordsPerPage={10}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height - 312}
                            scrollAreaProps={{type: "never"}}
                        />
                        <Group
                            h={34}
                            justify="space-between"
                            align="center"
                            pt={0}
                            bg={"#f8eedf"}
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
                                    {purchaseSubTotalAmount.toFixed(2)}
                                </Text>
                            </Group>
                        </Group>
                    </Box>
                </Box>
                <Box>
                    <__PosPurchaseInvoiceSection
                        domainConfigData={domainConfigData}
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
                        isWarehouse={isWarehouse}
                    />
                </Box>
            </form>
        </>
    );
}
