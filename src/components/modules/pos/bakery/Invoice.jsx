import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    TextInput,
    Button,
    Grid,
    Flex,
    ScrollArea,
    Image,
    Tooltip,
    Checkbox,
    Paper,
    Switch,
    Stack,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconChevronRight,
    IconChevronLeft,
    IconX,
    IconPlus,
    IconMinus,
    IconTrash,
    IconSum,
    IconUserFilled,
    IconPrinter,
    IconDeviceFloppy,
    IconHandStop,
    IconScissors,
    IconCurrency,
    IconPlusMinus,
    IconTicket, IconCurrencyTaka, IconPercentage,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch} from "react-redux";
import tableCss from "./css/Table.module.css";
import classes from "./css/Invoice.module.css";
import {IconChefHat} from "@tabler/icons-react";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import {SalesPrintPos} from "../print/pos/SalesPrintPos";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {useCartOperations} from "./utils/CartOperations";
import SelectForm from "../../../form-builders/SelectForm";
import {
    storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import AddCustomerDrawer from "../../inventory/sales/drawer-form/AddCustomerDrawer.jsx";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import _CommonDrawer from "./drawer/_CommonDrawer.jsx";
import {useScroll} from "./utils/ScrollOperations";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import {useToggle} from "@mantine/hooks";

export default function Invoice(props) {
    const {
        products,
        tableId,
        tables,
        setLoadCartProducts,
        tableCustomerMap,
        updateTableCustomer,
        clearTableCustomer,
        customerObject,
        setCustomerObject,
        loadCartProducts,
        updateTableSplitPayment,
        clearTableSplitPayment,
        tableSplitPaymentMap,
        invoiceMode,
        invoiceData,
        setTables,
        setReloadInvoiceData,
        setTableId,
        setInvoiceData
    } = props;

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 190;
    const calculatedHeight = height - 200; //

    const {configData} = getConfigData();
    const enableTable = !!(configData?.is_pos && invoiceMode === 'table');
    const [printPos, setPrintPos] = useState(false);
    // Sales by user state management
    const [salesByUser, setSalesByUser] = useState(String(invoiceData?.sales_by_id || ""));
    const [salesByUserName, setSalesByUserName] = useState(null);
    const [salesByDropdownData, setSalesByDropdownData] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    const [returnOrDueText, setReturnOrDueText] = useState(invoiceData?.sub_total > invoiceData?.payment ? "Return" : "Due");
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(invoiceData?.discount);

    const [salesTotalAmount, setSalesTotalAmount] = useState(invoiceData?.sub_total);
    const [salesTotalWithoutDiscountAmount, setSalesTotalWithoutDiscountAmount] = useState(invoiceData?.sub_total - invoiceData?.discount);
    const [salesDueAmount, setSalesDueAmount] = useState(invoiceData?.sub_total - (invoiceData?.payment + invoiceData?.discount));
    // Track additional tables per selected table
    const [additionalTableSelections, setAdditionalTableSelections] = useState(
        {}
    );
    const [checked, setChecked] = useState(false);

    const [transactionModeId, setTransactionModeId] = useState(invoiceData?.transaction_mode_id || "");
    const currentTableKey = tableId || "general";
    const currentTableSplitPayments = tableSplitPaymentMap[currentTableKey] || [];
    const isSplitPaymentActive = currentTableSplitPayments.length > 0;

    const isThisTableSplitPaymentActive = isSplitPaymentActive;

    const [posData, setPosData] = useState(null);
    const [discountType, setDiscountType] = useState("Percent");
    const [defaultCustomerId, setDefaultCustomerId] = useState(null);

    const [disabledDiscountButton, setDisabledDiscountButton] = useState(false);

    const [discountMode, setdiscountMode] = useToggle(['Discount', 'Coupon']);

    const [enableCoupon, setEnableCoupon] = useState("Coupon");

    const [tableReceiveAmounts, setTableReceiveAmounts] = useState({});
    useEffect(() => {
        if (
            enableTable &&
            tableId &&
            tableCustomerMap &&
            tableCustomerMap[tableId]
        ) {
            const tableCustomer = tableCustomerMap[tableId];
            setCustomerId(tableCustomer.id);
            setCustomerObject(tableCustomer);
        } else if (enableTable && tableId) {
            setCustomerId(null);
            setCustomerObject({});
        }
    }, [tableId, enableTable, tableCustomerMap]);
    useEffect(() => {
        let coreUsers = localStorage.getItem("core-users")
            ? JSON.parse(localStorage.getItem("core-users"))
            : [];
        if (coreUsers && coreUsers.length > 0) {
            const transformedData = coreUsers.map((type) => {
                return {
                    label: type.username + " - " + type.email,
                    value: String(type.id),
                };
            });
            setSalesByDropdownData(transformedData);
        }
    }, []);

    const {scrollRef, showLeftArrow, showRightArrow, handleScroll, scroll} =
        useScroll();

    const transactionModeData = JSON.parse(
        localStorage.getItem("accounting-transaction-mode")
    )
        ? JSON.parse(localStorage.getItem("accounting-transaction-mode"))
        : [];

    const form = useForm({
        initialValues: {
            customer_id: "",
            transaction_mode_id: "",
            sales_by_id: "",
            receive_amount: "",
            discount: "",
            coupon_code: "",
        },
        validate: {
            transaction_mode_id: (value) => {
                if (isSplitPaymentActive) return null;
                return !value ? true : null;
            },
            sales_by_id: (value) => (!value ? true : null),
            customer_id: (value) => {
                return !customerId ? true : null;
            },
        },
    });

    useEffect(() => {
        if (transactionModeData && transactionModeData.length > 0) {
            for (let mode of transactionModeData) {
                if (mode.is_selected) {
                    form.setFieldValue(
                        "transaction_mode_id",
                        form.values.transaction_mode_id
                            ? form.values.transaction_mode_id
                            : mode.id
                    );
                    break;
                }
            }
        }
    }, [transactionModeData]);

    const handleTransactionModel = async (id) => {
        setTransactionModeId(id);
        form.setFieldValue("transaction_mode_id", id);

        const data = {
            url: "inventory/pos/inline-update",
            data: {
                invoice_id: tableId,
                field_name: "transaction_mode_id",
                value: id,
            },
        };

        // Dispatch and handle response
        try {
            const resultAction = await dispatch(
                storeEntityData(data)
            );

            if (resultAction.payload?.status !== 200) {
                showNotificationComponent(resultAction.payload?.message ||
                    "Error updating invoice", "red", "", true);
            }
        } catch (error) {
            showNotificationComponent("Request failed. Please try again.", "red", "", true);
            console.error("Error updating invoice:", error);
        } finally {
            setReloadInvoiceData(true)
        }
    };

    const {handleIncrement, handleDecrement, handleDelete} = useCartOperations({
        enableTable,
        tableId,
        products,
        setLoadCartProducts,
        setReloadInvoiceData
    });


    useEffect(() => {
        if (tableId && !additionalTableSelections[tableId]) {
            setAdditionalTableSelections((prev) => ({
                ...prev,
                [tableId]: new Set(),
            }));
        }
    }, [tableId]);

    const handleAdditionalTableCheck = (checkedTableId) => {
        if (!tableId) return;

        setAdditionalTableSelections((prev) => {
            const currentSelections = new Set(prev[tableId] || []);

            if (currentSelections.has(checkedTableId)) {
                currentSelections.delete(checkedTableId);
            } else {
                currentSelections.add(checkedTableId);
            }

            return {
                ...prev,
                [tableId]: currentSelections,
            };
        });
    };

    const getSplitPayment = (splitPayments) => {
        updateTableSplitPayment(currentTableKey, splitPayments);
    };
    useEffect(() => {
        if (form.values.split_amount) {
            const totalAmount = subtotal - salesDiscountAmount;
            let receiveAmount = 0;
            for (let key in form.values.split_amount) {
                receiveAmount += Number(form.values.split_amount[key].partial_amount);
            }
            // console.log(receiveAmount);
            if (receiveAmount >= 0) {
                const text = totalAmount < receiveAmount ? "Return" : "Due";
                setReturnOrDueText(text);
                const returnOrDueAmount = totalAmount - receiveAmount;
                setSalesDueAmount(returnOrDueAmount);
            } else {
                setSalesDueAmount(totalAmount);
            }
        }
    }, [form.values.split_amount]);
    const [indexData, setIndexData] = useState(null);
    const getAdditionalItem = (value) => {
        setIndexData(value);
    };
    const [customerId, setCustomerId] = useState(invoiceData?.customer_id || "");
    const [customerDrawer, setCustomerDrawer] = useState(false);
    const [customersDropdownData, setCustomersDropdownData] = useState([]);
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false);

    const handleCustomerAdd = () => {
        if (enableTable && tableId) {
            form.setErrors({...form.errors, customer_id: null});
            setCustomerDrawer(true);
        } else if (!enableTable) {
            setCustomerDrawer(true);
        } else {
            notifications.show({
                color: "red",
                title: t("Error"),
                message: t("SelectATableFirst"),
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            await customerDataStoreIntoLocalStorage();
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
                setDefaultCustomerId(defaultId);
            }
            setRefreshCustomerDropdown(false);
        };

        fetchCustomers();
    }, [refreshCustomerDropdown]);

    useEffect(() => {
        if (
            enableTable &&
            tableId &&
            customerId &&
            customerObject &&
            Object.keys(customerObject).length > 0
        ) {
            updateTableCustomer(tableId, customerId, customerObject);
        }
    }, [customerId, customerObject, tableId, enableTable, updateTableCustomer]);

    const [commonDrawer, setCommonDrawer] = useState(false);

    const [eventName, setEventName] = useState(null);

    const handleClick = (e) => {
        console.log(e)
        if (e.currentTarget.name === "additionalProductAdd") {
            setEventName(e.currentTarget.name);
            setCommonDrawer(true);
        } else if (e.currentTarget.name === "splitPayment") {
            form.setErrors({...form.errors, transaction_mode_id: null});
            setEventName(e.currentTarget.name);
            setCommonDrawer(true);
        } else if (e.currentTarget.name === "clearSplitPayment") {
            clearSplitPayment();
        } else if (e.currentTarget.name === "kitchen") {
            setEventName(e.currentTarget.name);
            setCommonDrawer(true);
        }
    };

    useEffect(() => {
        const currentAmount = tableReceiveAmounts[currentTableKey] || "";
        form.setFieldValue("receive_amount", currentAmount);
    }, [currentTableKey, tableReceiveAmounts]);

    const clearSplitPayment = () => {
        if (currentTableKey) {
            clearTableSplitPayment(currentTableKey);

            form.setFieldValue(
                "receive_amount",
                tableReceiveAmounts[currentTableKey] || ""
            );

            notifications.show({
                color: "green",
                title: t("Success"),
                message: t("SplitPaymentCleared"),
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        if (tableId) {
            if (tableCustomerMap && tableCustomerMap[tableId]) {
                const tableCustomer = tableCustomerMap[tableId];
                setCustomerId(tableCustomer.id);
                setCustomerObject(tableCustomer);
            } else {
                setCustomerId(null);
                setCustomerObject({});
            }
        }
    }, [tableId]);

    // Foysal code 25/03/2025

    const [currentPaymentInput, setCurrentPaymentInput] = useState(invoiceData?.payment || "");
    useEffect(() => {
        if (invoiceData) {
            setDiscountType(invoiceData.discount_type || "Percent");
            setSalesTotalAmount(invoiceData.sub_total || 0);
            setSalesTotalWithoutDiscountAmount((invoiceData.sub_total || 0) - (invoiceData.discount || 0));
            setSalesDueAmount((invoiceData.sub_total || 0) - ((invoiceData.payment || 0) + (invoiceData.discount || 0)));
            setReturnOrDueText((invoiceData.sub_total || 0) > (invoiceData.payment || 0) ? "Due" : "Return");
            setCurrentPaymentInput(invoiceData?.payment || "");
            setTransactionModeId(invoiceData?.transaction_mode_id || "");
            if (invoiceData.discount_type === "Flat") {
                setSalesDiscountAmount(invoiceData?.discount || 0);
            } else if (invoiceData.discount_type === "Percent") {
                setSalesDiscountAmount(invoiceData?.percentage);
            }
        }
    }, [invoiceData, discountType]);
    const updateTableStatus = async (newStatus) => {
        if (!tableId) return;
        
        setTables(prevTables => 
            prevTables.map(table => 
                table.id === tableId 
                    ? {...table, status: newStatus} 
                    : table
            )
        );
    };
    const handleSave = () => {
        if(!invoiceData.invoice_items || invoiceData.invoice_items.length === 0) {
            showNotificationComponent(t('NoProductAdded'), 'red', '', true, 1000, true)
            return
        }
        if (!salesByUser || salesByUser == 'undefined') {
            showNotificationComponent(t('ChooseUser'), 'red', '', true, 1000, true)
            return
        }

        if (!invoiceData.transaction_mode_id) {
            showNotificationComponent(t('ChooseTransactionMode'), 'red', '', true, 1000, true)
            return
        }

        if (!customerId) {
            showNotificationComponent(t('ChooseCustomer'), 'red', '', true, 1000, true)
            return
        }

        if (!invoiceData.payment) {
            showNotificationComponent(t('PaymentAmount'), 'red', '', true, 1000, true)
            return
        }

        const fetchData = async () => {
            setIsDisabled(true);
            try {
                const resultAction = await dispatch(getIndexEntityData({
                    url: "inventory/pos/sales-complete/" + invoiceData.id,
                    param: {}
                }));
                if (getIndexEntityData.fulfilled.match(resultAction)) {
                    showNotificationComponent(t('SalesComplete'), 'blue', '', true, 1000, true)
                    clearTableCustomer(tableId);
                    setSalesByUser(null);
                    setCustomerId(null);
                    setTransactionModeId(null);
                    setCurrentPaymentInput("");
                    setSalesDiscountAmount(0);
                    setSalesTotalAmount(0);
                    setSalesTotalWithoutDiscountAmount(0);
                    setSalesDueAmount(0);
                    setReturnOrDueText("Due");
                    setDiscountType("Percent");
                    setCustomerObject({});
                    updateTableStatus('Free');
                    setReloadInvoiceData(true);
                    setTableId(null);
                    setIndexData(null);
                    setInvoiceData(null);
                    form.reset()
                } else {
                    console.error("Error fetching data:", resultAction);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setSalesByUser(null)
                setCustomerId(null)
                setCustomerObject(null)
                setReloadInvoiceData(true)

                setIsDisabled(false);
            }
        };
        fetchData();
    }
    return (
        <>
            <Box
                w={"100%"}
                pl={10}
                pr={10}
                h={enableTable ? height + 84 : height + 195}
                className={classes["box-white"]}
                style={{display: "flex", flexDirection: "column"}}
            >
                <Group
                    gap={6}
                    mb={4}
                    preventGrowOverflow={false}
                    grow
                    align="flex-start"
                    wrap="nowrap"
                >
                        <SelectForm
                            pt={"8"}
                            label=""
                            tooltip={"SalesBy"}
                            placeholder={enableTable ? t("OrderTakenBy") : t("SalesBy")}
                            name={"sales_by_id"}
                            form={form}
                            dropdownValue={salesByDropdownData}
                            id={"sales_by_id"}
                            searchable={true}
                            value={salesByUser}
                            changeValue={setSalesByUser}
                            color={"orange.8"}
                            position={"top-start"}
                            inlineUpdate={true}
                            updateDetails={{
                                url: "inventory/pos/inline-update",
                                data: {
                                    invoice_id: tableId,
                                    field_name: "sales_by_id",
                                    value: salesByUser,
                                },
                            }}
                        />
                    {enableTable && (
                        <Tooltip
                            disabled={!(invoiceData?.invoice_items?.length === 0 || !salesByUser)}
                            color="red.6"
                            withArrow
                            px={16}
                            py={2}
                            offset={2}
                            zIndex={999}
                            position="top-end"
                            label={t("SelectProductandUser")}
                        >
                            <Button
                                disabled={invoiceData?.invoice_items?.length === 0 || !salesByUser}
                                radius="sm"
                                size="sm"
                                color="green"
                                name={"kitchen"}
                                mt={8}
                                miw={122}
                                maw={122}
                                leftSection={<IconChefHat height={14} width={14} stroke={2}/>}
                                onClick={handleClick}
                            >
                                <Text fw={600} size="sm">
                                    {t("Kitchen")}
                                </Text>
                            </Button>
                        </Tooltip>
                    )}
                </Group>
                <Box>
                    <Paper h={32} p="4" radius="4" bg={checked ? "green.8" : "green.0"}>
                        <Grid align="center">
                            <Grid.Col span={11} mt={1}>
                                <Text fz={"sm"} fw={500} c={checked ? "white" : "black"} pl={4}>
                                    {enableTable
                                        ? t("SelectAdditionalTable")
                                        : t("SelectedItems")}
                                </Text>
                            </Grid.Col>
                            <Grid.Col span={1}>
                                {enableTable && (
                                    <Tooltip
                                        color="red.6"
                                        disabled={tableId}
                                        withArrow
                                        px={16}
                                        py={2}
                                        offset={2}
                                        zIndex={999}
                                        position="top-end"
                                        label={t("SelectaTabletoChooseAdditional")}
                                    >
                                        <Checkbox
                                            disabled={!tableId}
                                            checked={checked}
                                            color="green.9"
                                            iconColor="dark.8"
                                            onChange={(event) =>
                                                setChecked(event.currentTarget.checked)
                                            }
                                            styles={(theme) => ({
                                                input: {
                                                    borderColor: "green",
                                                },
                                                inputFocus: {
                                                    borderColor: "black",
                                                },
                                            })}
                                        />
                                    </Tooltip>
                                )}
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {checked && (
                        <ScrollArea
                            h={{base: "auto", sm: enableTable ? 50 : "auto"}}
                            type="never"
                            bg={"green.0"}
                        >
                            <Paper p="md" radius="md" bg={"green.0"}>
                                <Grid columns={15} gutter="md">
                                    {tables.map((item) => (
                                        <Grid.Col span={3} key={item.id}>
                                            <Checkbox
                                                label={`Table ${item.id}`}
                                                color="green.8"
                                                checked={additionalTableSelections[tableId]?.has(
                                                    item.id
                                                )}
                                                onChange={() => handleAdditionalTableCheck(item.id)}
                                                disabled={item.id === tableId}
                                                styles={(theme) => ({
                                                    input: {
                                                        border: "1.5px solid #767676",
                                                    },
                                                    label: {
                                                        color: "#333333",
                                                    },
                                                })}
                                            />
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            </Paper>
                        </ScrollArea>
                    )}
                    <DataTable
                        classNames={{
                            root: tableCss.root,
                            table: tableCss.table,
                            header: tableCss.header,
                            footer: tableCss.footer,
                            pagination: tableCss.pagination,
                        }}
                        records={invoiceData ? invoiceData.invoice_items : []}
                        columns={[
                            {
                                accessor: "id",
                                title: "S/N",
                                width: 48,
                                render: (data, index) => index + 1,
                            },
                            {
                                accessor: "display_name",
                                title: t("Product"),
                                render: (data) => (
                                    <Tooltip
                                        multiline
                                        w={220}
                                        label={
                                            indexData
                                                ? Array.isArray(indexData)
                                                    ? indexData
                                                        .map(
                                                            (item) => `${item.display_name} (${item.qty})`
                                                        )
                                                        .join(", ")
                                                    : `${indexData.display_name} (${indexData.qty})`
                                                : data.display_name
                                        }
                                        px={12}
                                        py={2}
                                        bg={"red.6"}
                                        c={"white"}
                                        withArrow
                                        position="top"
                                        offset={{mainAxis: 5, crossAxis: 10}}
                                        zIndex={999}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 500,
                                        }}
                                    >
                                        <Text
                                            variant="subtle"
                                            style={{cursor: "pointer"}}
                                            component="a"
                                            onClick={handleClick}
                                            name="additionalProductAdd"
                                            c={"red"}
                                            fz={"xs"}
                                        >
                                            {data.display_name}
                                        </Text>
                                    </Tooltip>
                                ),
                            },
                            {
                                accessor: "quantity",
                                title: t("Qty"),
                                textAlign: "center",
                                render: (data) => (
                                    <>
                                        <Group gap={8} justify="center">
                                            <ActionIcon
                                                size={"sm"}
                                                bg={"gray.7"}
                                                onClick={() => handleDecrement(data.product_id)}
                                            >
                                                <IconMinus height={"12"} width={"12"}/>
                                            </ActionIcon>
                                            <Text size="sm" ta={"center"} fw={600} maw={30} miw={30}>
                                                {data.quantity}
                                            </Text>
                                            <ActionIcon
                                                size={"sm"}
                                                bg={"gray.7"}
                                                onClick={() => handleIncrement(data.product_id)}
                                            >
                                                <IconPlus height={"12"} width={"12"}/>
                                            </ActionIcon>
                                        </Group>
                                    </>
                                ),
                            },
                            {
                                accessor: "price",
                                title: t("Price"),
                                textAlign: "right",
                                render: (data) => (
                                    <>
                                        {data.sales_price}
                                    </>
                                ),
                            },
                            {
                                accessor: "subtotal",
                                title: "Subtotal",
                                textAlign: "right",
                                render: (data) => <>{data.sub_total.toFixed(2)}</>,
                            },
                            {
                                accessor: "action",
                                title: t(""),
                                textAlign: "right",
                                render: (data) => (
                                    <Group justify="right" wrap="nowrap">
                                        <ActionIcon
                                            size="sm"
                                            variant="white"
                                            color="red.8"
                                            aria-label="Settings"
                                            onClick={() => handleDelete(data.product_id)}
                                        >
                                            <IconTrash height={20} width={20} stroke={1.5}/>
                                        </ActionIcon>
                                    </Group>
                                ),
                            },
                        ]}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={
                            enableTable && checked
                                ? calculatedHeight - 149
                                : enableTable
                                    ? calculatedHeight - 99
                                    : calculatedHeight + 3
                        }
                        scrollAreaProps={{type: "never"}}
                    />
                    <Group
                        h={34}
                        justify="space-between"
                        align="center"
                        pt={0}
                        bg={"gray.4"}
                        style={{
                            borderTop: "2px solid var(--mantine-color-gray-4)",
                        }}
                    >
                        <Text fw={"bold"} fz={"sm"} c={"black"} pl={"10"}>
                            {t("SubTotal")}
                        </Text>
                        <Group gap="10" pr={"sm"} align="center">
                            <IconSum size="16" style={{color: "black"}}/>
                            <Text fw={"bold"} fz={"sm"} c={"black"}>
                                {configData?.currency?.symbol} {salesTotalAmount && salesTotalAmount ? salesTotalAmount.toFixed(2) : 0}
                            </Text>
                        </Group>
                    </Group>
                </Box>
                <Box
                    pr={4}
                    pb={4}
                    pt={2}
                    mt={6}
                >
                    <Stack
                        align="stretch"
                        justify={"center"}
                        mt={6}
                        gap={4}
                        pl={4}
                        pr={2}
                        mb={0}
                    >
                        <Grid
                            columns={12}
                            gutter={4}
                            justify="center"
                            align="center"
                            className={classes["box-white"]}
                            pb={4}
                            bg={"gray.0"}
                        >
                            <Grid.Col span={6} pl={4} pr={4}>
                                <Grid bg={"gray.0"} pl={4} pr={4}>
                                    <Grid.Col span={7}>
                                        <Stack gap={0}>
                                            <Group justify="space-between" gap={0}>
                                                <Text fz={"sm"} fw={500} c={"black"}>
                                                    {t("DIS.")}
                                                </Text>
                                                <Text fz={"sm"} fw={800} c={"black"}>
                                                    {configData?.currency?.symbol}{" "}
                                                    {invoiceData?.discount || 0}
                                                </Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text fz={"sm"} fw={500} c={"black"}>
                                                    {t("Type")}
                                                </Text>
                                                <Text fz={"sm"} fw={800} c={"black"}>
                                                    {discountType === 'Flat' ? t('Flat') : t('Percent')}
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Grid.Col>
                                    <Grid.Col span={5}>
                                        <Group justify="space-between">
                                            <Text fz={"sm"} fw={500} c={"black"}>
                                                {t("VAT")}
                                            </Text>
                                            <Text fz={"sm"} fw={800} c={"black"}>
                                                {configData?.currency?.symbol} 0
                                            </Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fz={"sm"} fw={500} c={"black"}>
                                                {t("SD")}
                                            </Text>
                                            <Text fz={"sm"} fw={800} c={"black"}>
                                                {configData?.currency?.symbol} 0
                                            </Text>
                                        </Group>
                                    </Grid.Col>
                                </Grid>
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <Stack
                                    gap={0}
                                    className={classes["box-border"]}
                                    align="center"
                                    justify="center"
                                    bg={"gray.8"}
                                    pt={4}
                                    pb={4}
                                >
                                    <Text fw={800} c={"white"} size={"lg"}>
                                        {configData?.currency?.symbol} {salesTotalWithoutDiscountAmount.toFixed(2)}
                                    </Text>
                                    <Text fw={500} c={"white"} size={"md"}>
                                        {t("Total")}
                                    </Text>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <Stack
                                    gap={0}
                                    className={classes["box-border"]}
                                    align="center"
                                    justify="center"
                                    bg={"red"}
                                    pt={4}
                                    pb={4}
                                >
                                    <Text fw={800} c={"white"} size={"lg"}>
                                        {configData?.currency?.symbol} {salesDueAmount.toFixed(2)}
                                    </Text>
                                    <Text fw={500} c={"white"} size={"md"}>
                                    {returnOrDueText === 'Due' ? t('Due') : t('Return')}
                                    </Text>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                        <Grid
                            columns={24}
                            gutter={2}
                            align="center"
                            justify="center"
                            className={classes["box-border"]}
                            mb={4}
                            style={{
                                borderRadius: 4,
                                border:
                                    form.errors.transaction_mode_id && !transactionModeId
                                        ? "1px solid red"
                                        : "none",
                            }}
                        >
                            <Grid.Col span={21} className={classes["box-border"]}>
                                <Box

                                   
                                    mr={4}
                                    style={{position: "relative"}}
                                >
                                    <ScrollArea
                                        type="never"
                                        pl={"1"}
                                        pr={"2"}
                                        viewportRef={scrollRef}
                                        onScrollPositionChange={handleScroll}
                                    >
                                        <Tooltip
                                            label={t("TransactionMode")}
                                            opened={!!form.errors.transaction_mode_id}
                                            px={16}
                                            py={2}
                                            bg={"orange.8"}
                                            c={"white"}
                                            withArrow
                                            offset={{mainAxis: 5, crossAxis: -364}}
                                            zIndex={999}
                                            transitionProps={{
                                                transition: "pop-bottom-left",
                                                duration: 500,
                                            }}
                                        >
                                            <Group
                                                m={0}
                                                pt={8}
                                                pb={8}
                                                justify="flex-start"
                                                align="flex-start"
                                                gap="0"
                                                wrap="nowrap"
                                            >
                                                {transactionModeData.map((mode, index) => (
                                                    <Box
                                                        onClick={() => {
                                                            handleTransactionModel(mode.id);
                                                        }}
                                                        key={index}
                                                        p={4}
                                                        style={{
                                                            position: "relative",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Flex
                                                            bg={mode.id === transactionModeId ? "green.8" : "white"}
                                                            direction="column"
                                                            align="center"
                                                            justify="center"
                                                            p={2}
                                                        >
                                                            <Tooltip
                                                                label={mode.name}
                                                                withArrow
                                                                px={16}
                                                                py={2}
                                                                offset={2}
                                                                zIndex={999}
                                                                position="top"
                                                                color="red"
                                                            >
                                                                <Image
                                                                    mih={48}
                                                                    mah={48}
                                                                    w={56}
                                                                    h={48}
                                                                    fit="fit"
                                                                    src={
                                                                        isOnline
                                                                            ? mode.path
                                                                            : "/images/transaction-mode-offline.jpg"
                                                                    }
                                                                    fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
                                                                        mode.name
                                                                    )}`}
                                                                ></Image>
                                                            </Tooltip>
                                                        </Flex>
                                                    </Box>
                                                ))}
                                            </Group>
                                        </Tooltip>
                                    </ScrollArea>
                                    {showLeftArrow && (
                                        <ActionIcon
                                            variant="filled"
                                            color="gray.2"
                                            radius="xl"
                                            size="lg"
                                            h={24}
                                            w={24}
                                            style={{
                                                position: "absolute",
                                                left: 5,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                            }}
                                            onClick={() => scroll("left")}
                                        >
                                            <IconChevronLeft
                                                height={18}
                                                width={18}
                                                stroke={2}
                                                color="black"
                                            />
                                        </ActionIcon>
                                    )}
                                    {showRightArrow && (
                                        <ActionIcon
                                            variant="filled"
                                            color="gray.2"
                                            radius="xl"
                                            size="lg"
                                            h={24}
                                            w={24}
                                            style={{
                                                position: "absolute",
                                                right: 5,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                            }}
                                            onClick={() => scroll("right")}
                                        >
                                            <IconChevronRight
                                                height={18}
                                                width={18}
                                                stroke={2}
                                                color="black"
                                            />
                                        </ActionIcon>
                                    )}
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={3} style={{ 'textAlign':'right'}} pr={'8'} >
                                <Tooltip
                                    label={t("TransactionMode")}
                                    px={16}
                                    py={2}
                                    bg={"gry.8"}
                                    c={"white"}
                                    withArrow
                                    zIndex={999}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 500,
                                    }}
                                >
                                <ActionIcon name={
                                        isThisTableSplitPaymentActive
                                            ? "clearSplitPayment"
                                            : "splitPayment"
                                    } size="xl" bg={isThisTableSplitPaymentActive ? "red.6" : "gray.8"} variant="filled" aria-label="Settings"
                                            onClick={(e) => {
                                                // console.log(e)
                                                if (isThisTableSplitPaymentActive) {
                                                    clearSplitPayment();
                                                } else {
                                                    handleClick(e);
                                                }
                                            }}
                                >
                                    { isThisTableSplitPaymentActive ? <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />  : <IconScissors style={{ width: '70%', height: '70%' }} stroke={1.5} /> }

                                </ActionIcon>
                                </Tooltip>
                                {/*<Button
                                    bg={isThisTableSplitPaymentActive ? "red.6" : "gray.8"}
                                    c={"white"}
                                    size={"sm"}
                                    fullWidth={true}
                                    name={
                                        isThisTableSplitPaymentActive
                                            ? "clearSplitPayment"
                                            : "splitPayment"
                                    }
                                    leftSection={
                                        isThisTableSplitPaymentActive ? <IconX/> : <IconScissors/>
                                    }
                                    onClick={(e) => {
                                        if (isThisTableSplitPaymentActive) {
                                            clearSplitPayment();
                                        } else {
                                            handleClick(e);
                                        }
                                    }}
                                >
                                    {isThisTableSplitPaymentActive ? t("ClearSplit") : t("Split")}
                                </Button>*/}
                            </Grid.Col>
                        </Grid>
                        <Box m={0} mb={'12'}>
                            <Grid
                                columns={24}
                                gutter={{base:8}}
                                pr={"2"}
                                align="center"
                                justify="center"
                            >
                                <Grid.Col span={6}>
                                    <Tooltip
                                        label={t("ChooseCustomer")}
                                        opened={!!form.errors.customer_id}
                                        bg={"orange.8"}
                                        c={"white"}
                                        withArrow
                                        px={16}
                                        py={2}
                                        offset={2}
                                        zIndex={999}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 500,
                                        }}
                                    >
                                        <Button
                                            disabled={!tableId}
                                            fullWidth
                                            size="sm"
                                            color="#0077b6"
                                            leftSection={
                                                customerObject && customerObject.name ? (
                                                    <></>
                                                ) : (
                                                    <IconUserFilled height={14} width={14} stroke={2}/>
                                                )
                                            }
                                            onClick={handleCustomerAdd}
                                        >
                                            <Stack gap={0}>
                                                <Text fw={600} size="xs">
                                                    {customerObject && customerObject.name
                                                        ? customerObject.name
                                                        : t("Customer")}
                                                </Text>
                                                <Text size="xs">
                                                    {customerObject && customerObject.mobile}
                                                </Text>
                                            </Stack>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                                <Grid.Col span={6} >
                                    <Tooltip
                                        label={t("ClickRightButtonForPercentFlat")}
                                        px={16}
                                        py={2}
                                        position="top"
                                        bg={'red.4'}
                                        c={"white"}
                                        withArrow
                                        offset={2}
                                        zIndex={999}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 500,
                                        }}
                                    >
                                    <Button
                                        fullWidth={true}
                                        onClick={() => enableCoupon === "Coupon" ? setEnableCoupon("Discount") : setEnableCoupon("Coupon")}
                                        variant="filled"
                                        fz={'xs'}
                                        leftSection={
                                            enableCoupon === 'Coupon' ? <IconTicket size={14} /> :
                                                <IconPercentage size={14} />
                                        } color="gray">
                                        {enableCoupon === 'Coupon' ? t('Coupon') : t('Discount')}
                                    </Button>
                                    </Tooltip>
                                </Grid.Col>
                                {/*<Grid.Col span={3}>
                                    <Button
                                        p={0}
                                        disabled={disabledDiscountButton}
                                        fullWidth={true}
                                        onClick={async () => {
                                            setDisabledDiscountButton(true)
                                            const newDiscountType = discountType === "Percent" ? "Flat" : "Percent";
                                            setDiscountType(newDiscountType);
                                            const currentDiscountValue = salesDiscountAmount;

                                            const data = {
                                                url: "inventory/pos/inline-update",
                                                data: {
                                                    invoice_id: tableId,
                                                    field_name: "discount_type",
                                                    value: newDiscountType,
                                                    discount_amount: currentDiscountValue
                                                },
                                            };

                                            setSalesDiscountAmount(currentDiscountValue);

                                            try {
                                                const resultAction = await dispatch(
                                                    storeEntityData(data)
                                                );

                                                if (resultAction.payload?.status !== 200) {
                                                    showNotificationComponent(
                                                        resultAction.payload?.message ||
                                                        "Error updating invoice",
                                                        "red",
                                                        "",
                                                        "",
                                                        true
                                                    );
                                                }
                                            } catch (error) {
                                                showNotificationComponent(
                                                    "Request failed. Please try again.",
                                                    "red",
                                                    "",
                                                    "",
                                                    true
                                                );
                                                console.error("Error updating invoice:", error);
                                            } finally {
                                                setReloadInvoiceData(true)
                                                setTimeout(() => {
                                                    setDisabledDiscountButton(false);
                                                }, 500);
                                            }
                                        }}
                                        variant="filled"
                                        fz={'xs'}
                                        color="red.4"
                                        >
                                        <Group m={0} p={0} gap={0} align="center">
                                            {discountType === 'Flat' ? <IconCurrencyTaka size={16} /> :
                                                <IconPercentage  size={14} />}
                                        </Group>
                                        
                                    </Button>
                                     <Switch
                                        size="lg"
                                        w={"100%"}
                                        color={"red.3"}
                                        mt={"2"}
                                        onLabel={t("%")}
                                        offLabel={t("Flat")}
                                        radius="xs"
                                        checked={discountType == "Percent"}
                                        onChange={async (event) => {
                                            const newDiscountType = event.currentTarget.checked ? "Percent" : "Flat";
                                            setDiscountType(newDiscountType);

                                            const currentDiscountValue = salesDiscountAmount;

                                            const data = {
                                                url: "inventory/pos/inline-update",
                                                data: {
                                                    invoice_id: tableId,
                                                    field_name: "discount_type",
                                                    value: newDiscountType,
                                                    discount_amount: currentDiscountValue
                                                },
                                            };

                                            setSalesDiscountAmount(currentDiscountValue);

                                            try {
                                                const resultAction = await dispatch(
                                                    storeEntityData(data)
                                                );

                                                if (resultAction.payload?.status !== 200) {
                                                    showNotificationComponent(
                                                        resultAction.payload?.message ||
                                                        "Error updating invoice",
                                                        "red",
                                                        "",
                                                        "",
                                                        true
                                                    );
                                                }
                                            } catch (error) {
                                                showNotificationComponent(
                                                    "Request failed. Please try again.",
                                                    "red",
                                                    "",
                                                    "",
                                                    true
                                                );
                                                console.error("Error updating invoice:", error);
                                            } finally {
                                                setReloadInvoiceData(true)
                                            }
                                        }}
                                    />
                                </Grid.Col>*/}
                                <Grid.Col span={6} bg={"red.3"}>
                                    {enableCoupon === "Coupon" ? (
                                        <TextInput
                                        type="text"
                                        placeholder={t("CouponCode")}
                                        value={form.values.coupon_code}
                                        error={form.errors.coupon_code}
                                        size={"sm"}
                                        classNames={{input: classes.input}}
                                        onChange={(event) => {
                                            form.setFieldValue("coupon_code", event.target.value);
                                        }}
                                        rightSection={
                                            <>
                                                <Tooltip
                                                    label={t("CouponCode")}
                                                    px={16}
                                                    py={2}
                                                    withArrow
                                                    position={"left"}
                                                    c={"black"}
                                                    bg={`gray.1`}
                                                    transitionProps={{
                                                        transition: "pop-bottom-left",
                                                        duration: 500,
                                                    }}
                                                >
                                                    <IconTicket size={16} opacity={0.5}/>
                                                </Tooltip>
                                            </>
                                        }
                                    /> ) : (
<Tooltip
                                        label={t("ClickRightButtonForPercentFlat")}
                                        px={16}
                                        py={2}
                                        position="top"
                                        bg={'red.4'}
                                        c={"white"}
                                        withArrow
                                        offset={2}
                                        zIndex={999}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 500,
                                        }}
                                    >
                                    <TextInput
                                        type="number"
                                        style={{ 'textAlign': 'right' }}
                                        placeholder={t("Discount")}
                                        value={salesDiscountAmount}
                                        error={form.errors.discount}
                                        size={"sm"}
                                        classNames={{input: classes.input}}
                                        onChange={(event) => {
                                            form.setFieldValue("discount", event.target.value);
                                            const newValue = event.target.value;
                                            setSalesDiscountAmount(newValue);
                                            form.setFieldValue("discount", newValue);
                                        }}
                                        rightSection={

                                            <ActionIcon size={32} bg={'red.5'} variant="filled"
                                                        onClick={async () => {
                                                            setDisabledDiscountButton(true)
                                                            const newDiscountType = discountType === "Percent" ? "Flat" : "Percent";
                                                            setDiscountType(newDiscountType);
                                                            const currentDiscountValue = salesDiscountAmount;

                                                            const data = {
                                                                url: "inventory/pos/inline-update",
                                                                data: {
                                                                    invoice_id: tableId,
                                                                    field_name: "discount_type",
                                                                    value: newDiscountType,
                                                                    discount_amount: currentDiscountValue
                                                                },
                                                            };

                                                            setSalesDiscountAmount(currentDiscountValue);

                                                            try {
                                                                const resultAction = await dispatch(
                                                                    storeEntityData(data)
                                                                );

                                                                if (resultAction.payload?.status !== 200) {
                                                                    showNotificationComponent(resultAction.payload?.message ||
                                                                        "Error updating invoice", "red", "", true);
                                                                }
                                                            } catch (error) {
                                                                showNotificationComponent("Request failed. Please try again.", "red", "", true);
                                                                console.error("Error updating invoice:", error);
                                                            } finally {
                                                                setReloadInvoiceData(true)
                                                                setTimeout(() => {
                                                                    setDisabledDiscountButton(false);
                                                                }, 500);
                                                            }
                                                        }}
                                            >
                                                {discountType === 'Flat' ? <IconCurrencyTaka size={16} /> :
                                                    <IconPercentage  size={16} />}
                                            </ActionIcon>

                                        }
                                        onBlur={async (event) => {
                                            const data = {
                                                url: "inventory/pos/inline-update",
                                                data: {
                                                    invoice_id: tableId,
                                                    field_name: "discount",
                                                    value: event.target.value,
                                                    discount_type: discountType
                                                },
                                            };
                                            // Dispatch and handle response
                                            try {
                                                const resultAction = await dispatch(
                                                    storeEntityData(data)
                                                );

                                                if (resultAction.payload?.status !== 200) {
                                                    showNotificationComponent(resultAction.payload?.message ||
                                                        "Error updating invoice", "red", "", true);
                                                }
                                            } catch (error) {
                                                showNotificationComponent("Request failed. Please try again.", "red", "", true);
                                                console.error("Error updating invoice:", error);
                                            } finally {
                                                setReloadInvoiceData(true)
                                            }
                                        }}
                                    />
                                    </Tooltip>
                                    )}
                                    
                                </Grid.Col>
                                <Grid.Col span={6} bg={"green"}>
                                    <Tooltip
                                        label={t("ReceiveAmountValidateMessage")}
                                        opened={!!form.errors.receive_amount}
                                        px={16}
                                        py={2}
                                        position="top-end"
                                        bg={'#90e0ef'}
                                        c={"white"}
                                        withArrow
                                        offset={2}
                                        zIndex={999}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 500,
                                        }}
                                    >
                                        <TextInput
                                            onBlur={async (event) => {
                                                const data = {
                                                    url: "inventory/pos/inline-update",
                                                    data: {
                                                        invoice_id: tableId,
                                                        field_name: "amount",
                                                        value: event.target.value,
                                                    },
                                                };

                                                // Dispatch and handle response
                                                try {
                                                    const resultAction = await dispatch(
                                                        storeEntityData(data)
                                                    );

                                                    if (resultAction.payload?.status !== 200) {
                                                        showNotificationComponent(resultAction.payload?.message ||
                                                            "Error updating invoice", "red", "", true);
                                                    }
                                                } catch (error) {
                                                    showNotificationComponent("Request failed. Please try again.", "red", "", true);
                                                    console.error("Error updating invoice:", error);
                                                } finally {
                                                    setReloadInvoiceData(true)
                                                }
                                            }}
                                            type="number"
                                            placeholder={
                                                isThisTableSplitPaymentActive
                                                    ? t("SplitPaymentActive")
                                                    : t("Amount")
                                            }
                                            value={currentPaymentInput}
                                            error={form.errors.receive_amount}
                                            size={"sm"}
                                            disabled={isThisTableSplitPaymentActive}
                                            rightSection={
                                                <>
                                                    {form.values.receive_amount ? (
                                                        <Tooltip
                                                            label={t("Close")}
                                                            withArrow
                                                            bg={`red.1`}
                                                            c={"red.3"}
                                                        >
                                                            <IconX
                                                                size={16}
                                                                color={"red"}
                                                                opacity={1}
                                                                onClick={() => {
                                                                    form.setFieldValue("receive_amount", "");
                                                                    setTableReceiveAmounts((prev) => {
                                                                        const updated = {...prev};
                                                                        delete updated[currentTableKey];
                                                                        return updated;
                                                                    });
                                                                    if (isThisTableSplitPaymentActive) {
                                                                        clearTableSplitPayment(currentTableKey);
                                                                    }
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : isSplitPaymentActive ? (
                                                        <Tooltip
                                                            label={t("SplitPaymentActive")}
                                                            withArrow
                                                            position={"left"}
                                                        >
                                                            <IconScissors size={16} opacity={0.7}/>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip
                                                            px={16}
                                                            py={2}
                                                            withArrow
                                                            position={"left"}
                                                            c={"black"}
                                                            bg={`gray.1`}
                                                            transitionProps={{
                                                                transition: "pop-bottom-left",
                                                                duration: 500,
                                                            }}
                                                            label={t("ReceiveAmountValidateMessage")}
                                                        >
                                                            <IconCurrency size={16} opacity={0.5}/>
                                                        </Tooltip>
                                                    )}
                                                </>
                                            }
                                            leftSection={<IconPlusMinus size={16} opacity={0.5}/>}
                                            classNames={{input: classes.input}}
                                            onChange={async (event) => {
                                                if (!isThisTableSplitPaymentActive) {
                                                    const newValue = event.target.value;
                                                    setCurrentPaymentInput(newValue);
                                                    form.setFieldValue("receive_amount", newValue);

                                                    setTableReceiveAmounts((prev) => ({
                                                        ...prev,
                                                        [currentTableKey]: newValue,
                                                    }));
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Grid columns={12} gutter={{base: 2}}>
                            <Grid.Col span={enableTable ? 3 : 4}>
                                <Tooltip
                                    label={t("Hold")}
                                    px={16}
                                    py={2}
                                    color="red"
                                    withArrow
                                    offset={2}
                                    zIndex={100}
                                    transitionProps={{
                                        transition: "pop-bottom-left",
                                        duration: 2000,
                                    }}
                                >
                                    <Button
                                        bg={"white"}
                                        variant="outline"
                                        c={"black"}
                                        color="gray"
                                        size={"lg"}
                                        fullWidth={true}
                                    >
                                       <Text size="md">{t("Hold")}</Text>
                                    </Button>
                                </Tooltip>
                            </Grid.Col>
                            {enableTable && (
                                <Grid.Col span={3}>
                                    <Tooltip
                                        label={t("PrintAll")}
                                        px={16}
                                        py={2}
                                        color="red"
                                        withArrow
                                        offset={2}
                                        zIndex={100}
                                        transitionProps={{
                                            transition: "pop-bottom-left",
                                            duration: 2000,
                                        }}
                                    >
                                        <Button
                                            disabled={isDisabled}
                                            bg={"white"}
                                            variant="outline"
                                            c={"black"}
                                            color="gray"
                                            size={"lg"}
                                            fullWidth={true}
                                            // onClick={handlePrintAll}
                                        >
                                            <Text size="md">{t("AllPrint")}</Text>
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                            )}
                            <Grid.Col span={enableTable ? 3 : 4}>
                                <Button
                                    disabled={isDisabled}
                                    bg={"#264653"}
                                    c={"white"}
                                    size={"lg"}
                                    fullWidth={true}
                                    leftSection={<IconPrinter/>}
                                    // onClick={posPrint}
                                >
                                    {t("Pos")}
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={enableTable ? 3 : 4}>
                                <Button
                                    // disabled={isDisabled}
                                    size={"lg"}
                                    c={"white"}
                                    bg={"#38b000"}
                                    fullWidth={true}
                                    leftSection={<IconDeviceFloppy/>}
                                    onClick={handleSave}
                                >
                                    {t("Save")}
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </Stack>

                    {printPos && (
                        <div style={{display: "none"}}>
                            <SalesPrintPos posData={posData} setPrintPos={setPrintPos}/>
                        </div>
                    )}
                    {customerDrawer && (
                        <AddCustomerDrawer
                            customerObject={customerObject}
                            setCustomerObject={setCustomerObject}
                            setCustomerId={setCustomerId}
                            customersDropdownData={customersDropdownData}
                            setRefreshCustomerDropdown={setRefreshCustomerDropdown}
                            focusField={"customer_id"}
                            fieldPrefix="pos_"
                            customerDrawer={customerDrawer}
                            setCustomerDrawer={setCustomerDrawer}
                            customerId={customerId}
                            enableTable={enableTable}
                            tableId={tableId}
                            updateTableCustomer={updateTableCustomer}
                            clearTableCustomer={clearTableCustomer}
                            setReloadInvoiceData={setReloadInvoiceData}
                        />
                    )}
                    {commonDrawer && (
                        <_CommonDrawer
                            salesByUserName={salesByUserName}
                            setLoadCartProducts={setLoadCartProducts}
                            enableTable={enableTable}
                            tableId={tableId}
                            loadCartProducts={loadCartProducts}
                            getSplitPayment={getSplitPayment}
                            getAdditionalItem={getAdditionalItem}
                            salesDueAmount={salesDueAmount}
                            eventName={eventName}
                            commonDrawer={commonDrawer}
                            setCommonDrawer={setCommonDrawer}
                            currentSplitPayments={currentTableSplitPayments}
                            tableSplitPaymentMap={tableSplitPaymentMap}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
}
