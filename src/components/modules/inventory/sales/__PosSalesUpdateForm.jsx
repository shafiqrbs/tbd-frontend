import {isNotEmpty, useForm} from "@mantine/form";
import React, {useEffect, useMemo, useState} from "react";
import __PosCustomerSection from "./__PosCustomerSection";
import {Box, Text, ActionIcon, Group, TextInput} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {IconPercentage, IconSum, IconX} from "@tabler/icons-react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import __PosInvoiceSection from "./__PosInvoiceSetion.jsx";
import {getHotkeyHandler, useToggle} from "@mantine/hooks";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import {useDispatch} from "react-redux";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

const toNumber = value => isNaN(Number(value)) ? 0 : Number(value);
export default function __PosSalesUpdateForm(props) {
    const {id} = useParams();
    const {
        isSMSActive,
        currencySymbol,
        isZeroReceiveAllow,
        tempCardProducts,
        setTempCardProducts,
        setLoadCardProducts,
        entityEditData,
        lastClicked,
        setLastClicked,
        handleClick,
        isWarehouse,
        salesConfig,
    } = props;

    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);

    // Utility function for safe number conversion
    const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));

    // Initial discount type from database
    const initialDatabaseDiscountType = entityEditData?.discount_type === "Percent" ? "Percent" : "Flat";
    // Local state: Discount type toggle (controlled after form init)
    const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);

    // Calculate initial discount value based on DB & type
    const initialDiscountValue = useMemo(() => {
        setDiscountType(initialDatabaseDiscountType)
        return initialDatabaseDiscountType === "Flat"
            ? entityEditData?.discount || 0
            : entityEditData?.discount_calculation || 0;
    }, [initialDatabaseDiscountType, entityEditData]);

    // Form initialization
    const form = useForm({
        initialValues: {
            customer_id: entityEditData?.customer_id,
            transaction_mode_id: entityEditData?.transaction_mode_id,
            sales_by: entityEditData?.sales_by_id,
            order_process: entityEditData?.process_id,
            narration: entityEditData?.narration,
            discount: initialDiscountValue,
            receive_amount: entityEditData?.payment || 0,
            name: entityEditData?.customer_name || "",
            mobile: entityEditData?.customer_mobile || "",
            email: entityEditData?.customer_email || "",
        },
        validate: {
            transaction_mode_id: isNotEmpty(),
            discount: (value) => {
                const num = Number(value);
                if (discountType === "Percent") {
                    if (num > 100) return "Percent cannot exceed 100";
                }
                if (num < 0) return "Discount can’t be negative";
                return null;
            },
        },
    });

    // Customer Dropdown Options
    const [customersDropdownData, setCustomersDropdownData] = useState([]);
    const [defaultCustomerId, setDefaultCustomerId] = useState(null);
    const [customerData, setCustomerData] = useState(
        entityEditData?.customer_id?.toString()
    );
    const [customerObject, setCustomerObject] = useState({});

    // Other hooks and states
    const [salesByUser, setSalesByUser] = useState(
        entityEditData?.sales_by_id?.toString() || null
    );
    const [orderProcess, setOrderProcess] = useState(
        entityEditData?.process_id?.toString() || null
    );
    const [salesProfitAmount, setSalesProfitAmount] = useState(0);
    const [salesVatAmount, setSalesVatAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(0);
    const [returnOrDueText, setReturnOrDueText] = useState("Due");

    // Calculate subtotal and total purchase amount on tempCardProducts
    const salesSubTotalAmount = useMemo(() => {
        return tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;
    }, [tempCardProducts]);

    const totalPurchaseAmount = useMemo(() => {
        return tempCardProducts?.reduce(
            (total, item) => total + item.purchase_price * item.quantity,
            0
        ) || 0;
    }, [tempCardProducts]);

    // Fetch customer dropdown data from local storage
    useEffect(() => {
        const fetchCustomers = async () => {
            await customerDataStoreIntoLocalStorage();
            let coreCustomers = localStorage.getItem("core-customers");
            coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : [];

            let defaultId = defaultCustomerId;

            if (coreCustomers.length > 0) {
                const dropdown = coreCustomers.map((cust) => {
                    if (cust.name === "Default") {
                        defaultId = cust.id;
                    }
                    return {
                        label: `${cust.mobile} -- ${cust.name}`,
                        value: String(cust.id),
                    };
                });

                setCustomersDropdownData(dropdown);
                setDefaultCustomerId(defaultId);
            }
        };

        fetchCustomers();
    }, []);

    // Reset discount value in form when discount type toggles
    useEffect(() => {
        const newDiscount =
            discountType === "Flat"
                ? entityEditData?.discount || 0
                : entityEditData?.discount_calculation || 0;

        form.setFieldValue("discount", newDiscount);
    }, [discountType]);

    // Calculate discount amount, total amount, and due/return text
    useEffect(() => {
        const discountValue = toNumber(form.values.discount);
        let discountAmount = 0;

        if (discountType === "Flat") {
            discountAmount = discountValue;
        } else if (discountType === "Percent" && discountValue <= 100) {
            discountAmount = (salesSubTotalAmount * discountValue) / 100;
        }

        if (discountAmount > salesSubTotalAmount) {
            discountAmount = 0;
        }

        setSalesDiscountAmount(discountAmount);

        const total = salesSubTotalAmount - discountAmount + Number(salesVatAmount);
        setSalesTotalAmount(total);

        const received = toNumber(form.values.receive_amount || 0);
        setReturnOrDueText(received < total ? "Due" : "Return");
        setSalesDueAmount(total - received);
    }, [
        form.values.discount,
        discountType,
        form.values.receive_amount,
        salesSubTotalAmount,
        salesVatAmount,
    ]);

    const handleFormSubmit = async (values) => {
        let createdBy = JSON.parse(localStorage.getItem("user"));
        let transformedArray = tempCardProducts.map((product) => {
            return {
                sale_id: id,
                product_id: product.product_id,
                unit_id: product.unit_id,
                uom: product.uom,
                item_name: product.item_name,
                quantity: product.quantity,
                percent: product.percent,
                sales_price: product.sales_price,
                price: product.price,
                purchase_price: product.purchase_price,
                sub_total: product.sub_total,
                warehouse_id: product.warehouse_id,
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
            form.values.customer_id == defaultCustomerId
        ) {
            formValue["customer_name"] = form.values.name;
            formValue["customer_mobile"] = form.values.mobile;
            formValue["customer_email"] = form.values.email;
        }

        formValue["sub_total"] = salesSubTotalAmount;
        formValue["transaction_mode_id"] = form.values.transaction_mode_id;
        formValue["discount_type"] = discountType;
        formValue["discount"] = salesDiscountAmount;
        formValue["discount_calculation"] =
            discountType === "Percent" ? form.values.discount : 0;
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
            form.values.customer_id == defaultCustomerId;

        formValue["payment"] = hasReceiveAmount ? (form.values.receive_amount > salesTotalAmount ? salesTotalAmount : form.values.receive_amount) : salesConfig?.is_zero_receive_allow && isDefaultCustomer ? salesTotalAmount : 0;

        // Check if default customer needs receive amount
        if (
            isDefaultCustomer &&
            !isZeroReceiveAllow &&
            (!form.values.receive_amount ||
                Number(form.values.receive_amount) <= 0 ||
                Number(form.values.receive_amount) < salesTotalAmount)
        ) {
            form.setFieldError(
                "receive_amount",
                t("Receive amount must cover the total for default customer")
            );
            showNotificationComponent('Default customer must pay full amount', 'red')
            return;
        }

        // Also ensure transaction mode is selected
        if (!form.values.transaction_mode_id) {
            form.setFieldError(
                "transaction_mode_id",
                t("Please select a payment method")
            );
            showNotificationComponent("Please select a payment method", "red")
            return;
        }

        if (transformedArray && transformedArray.length > 0) {
            const data = {
                url: "inventory/sales/" + id,
                data: formValue,
            };

            const resultAction = await dispatch(updateEntityData(data));
            if (updateEntityData.rejected.match(resultAction)) {
              showNotificationComponent('Fail to update','red')
            } else if (updateEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t("UpdatedSuccessfully"), 'teal')
                if (lastClicked === "save") {
                    navigate("/inventory/sales");
                }
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
                                    accessor: "item_name",
                                    title: t("Name"),
                                    width: "200px",
                                    footer: (
                                        <Group spacing="xs">
                                            <IconSum size="1.25em"/>
                                            <Text mb={-2}>{tempCardProducts.length} Items</Text>
                                        </Group>
                                    ),
                                },
                                {
                                    accessor: "warehouse_name",
                                    title: t("Warehouse"),
                                    hidden: !isWarehouse,
                                },
                                {
                                    accessor: "price",
                                    title: t("Price"),
                                    textAlign: "right",
                                    render: (item) => {
                                        return item.price && Number(item.price).toFixed(2);
                                    },
                                },

                                {
                                    accessor: "stock",
                                    title: t("Stock"),
                                    textAlign: "center",
                                },
                                {
                                    accessor: "bonus_quantity",
                                    title: t("BonusQuantityTable"),
                                    textAlign: "center",
                                },
                                {
                                    accessor: "quantity",
                                    title: t("Quantity"),
                                    textAlign: "center",
                                    width: "100px",
                                    render: (item) => {
                                        const [editedQuantity, setEditedQuantity] = useState(
                                            item.quantity
                                        );

                                        const handlQuantityChange = (e) => {
                                            const editedQuantity = e.currentTarget.value;
                                            setEditedQuantity(editedQuantity);

                                            const updatedProducts = tempCardProducts.map(
                                                (product) => {
                                                    if (product.product_id === item.product_id) {
                                                        return {
                                                            ...product,
                                                            quantity: e.currentTarget.value,
                                                            sub_total:
                                                                e.currentTarget.value * item.sales_price,
                                                        };
                                                    }
                                                    return product;
                                                }
                                            );

                                            setTempCardProducts(updatedProducts);
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
                                    accessor: "uom",
                                    title: t("UOM"),
                                    textAlign: "center",
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
                                                const updatedProducts = tempCardProducts.map(
                                                    (product) => {
                                                        if (product.product_id === item.product_id) {
                                                            return {
                                                                ...product,
                                                                sales_price: editedSalesPrice,
                                                                sub_total: editedSalesPrice * item.quantity,
                                                            };
                                                        }
                                                        return product;
                                                    }
                                                );

                                                setTempCardProducts(updatedProducts);
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

                                            if (e.currentTarget.value && e.currentTarget.value >= 0) {
                                                const updatedProducts = tempCardProducts.map(
                                                    (product) => {
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
                                                    }
                                                );
                                                setTempCardProducts(updatedProducts);
                                            }
                                        };

                                        return item.percent ? (
                                            <>
                                                <TextInput
                                                    type="number"
                                                    label=""
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
                                    footer: (
                                        <Group spacing="xs">
                                            <Text fz={"md"} fw={"600"}>
                                                {t("SubTotal")}
                                            </Text>
                                        </Group>
                                    ),
                                },

                                {
                                    accessor: "sub_total",
                                    title: t("SubTotal"),
                                    textAlign: "right",
                                    render: (item) => {
                                        return item.sub_total && Number(item.sub_total).toFixed(2);
                                    },
                                    footer: (
                                        <Group spacing="xs">
                                            <Text fw={"600"} fz={"md"}>
                                                {salesSubTotalAmount.toFixed(2)}
                                            </Text>
                                        </Group>
                                    ),
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
                                                    let data = tempCardProducts ? tempCardProducts : [];
                                                    data = data.filter(
                                                        (d) => d.product_id !== item.product_id
                                                    );
                                                    setTempCardProducts(data);
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
                            height={height - 264}
                            scrollAreaProps={{type: "never"}}
                        />
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
                        isZeroReceiveAllow={isZeroReceiveAllow}
                        salesDueAmount={salesDueAmount}
                        setLoadCardProducts={setLoadCardProducts}
                        lastClicked={lastClicked}
                        setLastClicked={setLastClicked}
                        handleClick={handleClick}
                        entityEditData={entityEditData}
                        salesConfig={salesConfig}
                    />
                </Box>
            </form>
        </>
    );
}
