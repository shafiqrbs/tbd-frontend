import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Menu,
    rem,
    TextInput,
    Center,
    Button,
    Grid,
    Flex,
    ScrollArea,
    Divider,
    Image,
    Select,
    SimpleGrid,
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
    IconCheck,
    IconSearch,
    IconChevronDown,
    IconX,
    IconPlus,
    IconMinus,
    IconTrash,
    IconSum,
    IconUserFilled,
    IconPrinter,
    IconDeviceFloppy,
    IconAlertCircle,
    IconHandStop,
    IconScissors,
    IconCurrency,
    IconPlusMinus,
    IconTicket,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import tableCss from "./css/Table.module.css";
import classes from "./css/Invoice.module.css";
import {IconChefHat} from "@tabler/icons-react";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import {SalesPrintPos} from "../print/pos/SalesPrintPos";
import {isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {useCartOperations} from "./utils/CartOperations";
import {TransformProduct} from "./utils/TransformProduct";
import SelectForm from "../../../form-builders/SelectForm";
import {
    getSalesDetails,
    storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import AddCustomerDrawer from "../../inventory/sales/drawer-form/AddCustomerDrawer.jsx";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import _CommonDrawer from "./drawer/_CommonDrawer.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import {useScroll} from "./utils/ScrollOperations";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

export default function Invoice(props) {
    const {
        products,
        tableId,
        tables,
        setLoadCartProducts,
        handleSubmitOrder,
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
        reloadInvoiceData,
        setReloadInvoiceData
    } = props;

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 190;
    const calculatedHeight = height - 200; //

    const {configData} = getConfigData();
    const enableTable = !!(configData?.is_pos && invoiceMode === 'table');
    const [printPos, setPrintPos] = useState(false);
    const [tempCartProducts, setTempCartProducts] = useState([]);

    // Sales by user state management
    const [salesByUser, setSalesByUser] = useState(String(invoiceData?.sales_by_id));
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

    const [transactionModeId, setTransactionModeId] = useState(invoiceData?.transaction_mode_id);

    const currentTableKey = tableId || "general";
    const currentTableSplitPayments = tableSplitPaymentMap[currentTableKey] || [];
    const isSplitPaymentActive = currentTableSplitPayments.length > 0;

    const isThisTableSplitPaymentActive = isSplitPaymentActive;

    const [posData, setPosData] = useState(null);
    const [discountType, setDiscountType] = useState("Percent");
    const [defaultCustomerId, setDefaultCustomerId] = useState(null);

    const [tableReceiveAmounts, setTableReceiveAmounts] = useState({});

    useEffect(() => {
        if (enableTable && tableId) {
            const tableCartKey = `table-${tableId}-pos-products`;
            const tempProducts = localStorage.getItem(tableCartKey);
            setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);
        } else {
            const tempProducts = localStorage.getItem("temp-pos-products");
            setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);
        }
        setLoadCartProducts(false);
    }, [loadCartProducts, tableId, enableTable]);
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
    /*useEffect(() => {
      if (salesByUser) {
        setSalesByUserName(
          salesByDropdownData.find((item) => item.value === salesByUser).label
        );
      }
    }, [salesByUser, salesByDropdownData]);*/
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
    };

    const {handleIncrement, handleDecrement, handleDelete} = useCartOperations({
        enableTable,
        tableId,
        products,
        setLoadCartProducts,
    });

    const subtotal = tempCartProducts.reduce(
        (acc, item) => acc + item.sub_total,
        0
    );


    /*useEffect(() => {
      /!*if (tempCartProducts.length === 0) {
        setSalesDiscountAmount(0);
        setSalesTotalAmount(0);
        setSalesDueAmount(0);
        setReturnOrDueText("Due");
        return;
      }*!/

      let discountAmount = discountAmount;
      if (form.values.discount && Number(form.values.discount) > 0) {
        if (discountType === "Flat") {
          discountAmount = Number(form.values.discount);
        } else if (discountType === "Percent") {
          discountAmount = (subtotal * Number(form.values.discount)) / 100;
        }
      }
      setSalesDiscountAmount(discountAmount);

      const totalAmount = subtotal - discountAmount;
      setSalesTotalAmount(totalAmount);

      const currentReceiveAmount = tableReceiveAmounts[currentTableKey] || "";

      if (isSplitPaymentActive) {
        const splitPaymentTotal = currentTableSplitPayments.reduce(
          (total, payment) => total + Number(payment.partial_amount),
          0
        );

        const text = totalAmount < splitPaymentTotal ? "Return" : "Due";
        setReturnOrDueText(text);
        const returnOrDueAmount = totalAmount - splitPaymentTotal;
        setSalesDueAmount(returnOrDueAmount);
      } else {
        let receiveAmount =
          currentReceiveAmount === "" ? 0 : Number(currentReceiveAmount);
        if (receiveAmount >= 0) {
          const text = totalAmount < receiveAmount ? "Return" : "Due";
          setReturnOrDueText(text);
          const returnOrDueAmount = totalAmount - receiveAmount;
          setSalesDueAmount(returnOrDueAmount);
        } else {
          setSalesDueAmount(totalAmount);
        }
      }

      const isDisabled =
        configData?.is_pay_first &&
        (configData?.isZeroReceiveAllow ? false : salesDueAmount > 0);
      setIsDisabled(isDisabled);
    }, [
      form.values.discount,
      discountType,
      tableReceiveAmounts[currentTableKey],
      currentTableSplitPayments,
      isSplitPaymentActive,
      subtotal,
      configData,
      currentTableKey,
      // tempCartProducts.length,
    ]);*/

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
        console.log(indexData);
    };
    /*const handlePrintAll = () => {
     /!* if (tempCartProducts.length === 0) {
        notifications.show({
          title: t("ValidationError"),
          position: "top-right",
          autoClose: 1000,
          withCloseButton: true,
          message: t("Add at least one product"),
          color: "red",
        });
        return;
      }*!/

      const currentTableKey = tableId || "general";
      const isUsingSplitPayment = isSplitPaymentActive;
      const currentSplitPaymentData = tableSplitPaymentMap[currentTableKey] || [];

      const validation = form.validate();
      if (validation.hasErrors) {
        return;
      }
      let createdBy = JSON.parse(localStorage.getItem("user"));
      const formValue = {};
      configData?.is_pos ? (formValue.is_pos = 1) : (formValue.is_pos = 0);
      formValue["customer_id"] = customerId;
      formValue["sub_total"] = subtotal;
      if (!isUsingSplitPayment) {
        formValue.transaction_mode_id = String(transactionModeId);
      }
      formValue["discount_type"] = discountType;
      formValue["discount"] = salesDiscountAmount;
      formValue["discount_calculation"] =
        discountType === "Percent" ? form.values.discount : 0;
      formValue["vat"] = 0;
      formValue["total"] = salesTotalAmount;
      formValue.sales_by_id = salesByUser;
      formValue["created_by_id"] = Number(createdBy["id"]);
      // formValue["invoice_date"] = new Date().toLocaleDateString("en-CA");
      formValue["process"] = "";
      formValue["narration"] = "";

      const hasReceiveAmount = form.values.receive_amount;

      formValue["payment"] = hasReceiveAmount;
      if (isUsingSplitPayment && currentSplitPaymentData.length > 0) {
        formValue["split_payment_data"] = currentSplitPaymentData;
        formValue["is_split_payment"] = true;
      }
      let transformedArray = TransformProduct(tempCartProducts);
      formValue["items"] = transformedArray ? transformedArray : [];

      //table calculation

      let tableValue = null;
      if (enableTable && tableId) {
        // Get the selected table
        const selectedTable = tables.find((t) => t.id === tableId);
        // Calculate elapsed time
        tableValue = selectedTable.value;
        formValue["table_value"] = tableValue;
      }

      const data = {
        url: "inventory/sales",
        data: formValue,
      };
      dispatch(storeEntityData(data));

      notifications.show({
        color: "teal",
        title: t("CreateSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });
      setTimeout(() => {
        setTempCartProducts([]);
        setSalesDiscountAmount(0);
        setSalesTotalAmount(0);
        setSalesDueAmount(0);
        setReturnOrDueText("Due");
        setDiscountType("Percent");
        setChecked(false);
        setAdditionalTableSelections({});
        handleSubmitOrder();
        setSalesByUser(null);
        setSalesByUserName(null);

        // Clear customer data
        clearTableCustomer(tableId);
        setCustomerObject({});
        setCustomerId(null);

        // Clear split payment data
        clearTableSplitPayment(currentTableKey);

        // Clear receive amount for this table
        setTableReceiveAmounts((prev) => {
          const updated = { ...prev };
          delete updated[currentTableKey];
          return updated;
        });

        setTransactionModeId(null);
        form.reset();
      }, 500);

      if (enableTable) {
        setAdditionalTableSelections((prev) => {
          const newSelections = { ...prev };
          delete newSelections[tableId];
          return newSelections;
        });
        setChecked(false);
      }

      form.reset();
    };*/

    /*const printItem = () => {
      const formValue = {};
      let transformedArray = TransformProduct(tempCartProducts);
      formValue["items"] = transformedArray ? transformedArray : [];
      console.log(formValue);
    };
    if (!localStorage.getItem("temp-requistion-invoice")) {
      localStorage.setItem("temp-requistion-invoice", JSON.stringify([]));
    }*/

    function tempLocalPosInvoice(addInvoice) {
        const existingInvoices = localStorage.getItem("temp-pos-invoice");
        const invoices = existingInvoices ? JSON.parse(existingInvoices) : [];
        localStorage.setItem("temp-pos-print", JSON.stringify(addInvoice));
        invoices.push(addInvoice);
        localStorage.setItem("temp-pos-invoice", JSON.stringify(invoices));
    }

    /*const posPrint = () => {
      if (tempCartProducts.length === 0) {
        notifications.show({
          title: t("ValidationError"),
          position: "top-right",
          autoClose: 1000,
          withCloseButton: true,
          message: t("Add at least one product"),
          color: "red",
        });
        return;
      }
      const validation = form.validate();
      if (validation.hasErrors) {
        return;
      }
      const formValue = {
        invoice_id: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
        invoice_date: new Date().toLocaleDateString("en-CA"),
        invoice_time: new Date().toLocaleTimeString("en-CA"),
        sales_by_id: salesByUser,
        transaction_mode_id: transactionModeId,
        createdByName: salesByUserName,
        grand_total: subtotal,
        is_pos: enableTable ? 1 : 0,
      };
      let transformedArray = TransformProduct(tempCartProducts);

      formValue.items = transformedArray || [];
      if (enableTable && tableId) {
        const selectedTable = tables.find((t) => t.id === tableId);
        const currentTime = new Date();
        let statusHistory = [...(selectedTable.statusHistory || [])];

        if (
          selectedTable.currentStatusStartTime &&
          selectedTable.status !== "Free"
        ) {
          const currentElapsed =
            currentTime - new Date(selectedTable.currentStatusStartTime);
          statusHistory.push({
            status: selectedTable.status,
            startTime: selectedTable.currentStatusStartTime,
            endTime: currentTime,
            elapsedTime: currentElapsed,
          });
        }
        const formattedStatusHistory = statusHistory.map((entry) => {
          const elapsedSeconds = Math.floor(entry.elapsedTime / 1000);
          const hours = Math.floor(elapsedSeconds / 3600)
            .toString()
            .padStart(2, "0");
          const minutes = Math.floor((elapsedSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
          const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

          return {
            status: entry.status,
            elapsed_time: `${hours}:${minutes}:${seconds}`,
            start_time: new Date(entry.startTime).toISOString(),
            end_time: new Date(entry.endTime).toISOString(),
          };
        });
        const totalElapsedMs = statusHistory.reduce(
          (total, entry) => total + entry.elapsedTime,
          0
        );
        const totalSeconds = Math.floor(totalElapsedMs / 1000);
        const totalHours = Math.floor(totalSeconds / 3600)
          .toString()
          .padStart(2, "0");
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const totalSecondsRemainder = (totalSeconds % 60)
          .toString()
          .padStart(2, "0");
        const tableData = {
          mainTable: {
            id: tableId,
            status: selectedTable.status,
            status_change_history: formattedStatusHistory,
            total_elapsed_time: `${totalHours}:${totalMinutes}:${totalSecondsRemainder}`,
          },
          additionalTables: Array.from(additionalTableSelections[tableId] || []),
        };

        formValue.table_data = tableData;
      }

      console.log("Print Data:", formValue);
      tempLocalPosInvoice(formValue);
      setPosData(formValue);
      handleSubmitOrder();

      setSalesByUser(null);
      setSalesByUserName(null);
      setTransactionModeId(null);

      clearTableCustomer(tableId);
      setCustomerObject({});
      setCustomerId(null);
      clearTableSplitPayment(currentTableKey);
      setTableReceiveAmounts((prev) => {
        const updated = { ...prev };
        delete updated[currentTableKey];
        return updated;
      });

      if (enableTable) {
        setAdditionalTableSelections((prev) => {
          const newSelections = { ...prev };
          delete newSelections[tableId];
          return newSelections;
        });
        setChecked(false);
      }

      form.reset();
      setPrintPos(true);
    };*/
    const [customerId, setCustomerId] = useState(invoiceData?.customer_id);
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

            const tableCartKey = `table-${tableId}-pos-products`;
            const tempProducts = localStorage.getItem(tableCartKey);
            setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);

            if (!tempProducts || JSON.parse(tempProducts).length === 0) {
                setSalesDiscountAmount(0);
                setSalesTotalAmount(0);
                setSalesDueAmount(0);
                setReturnOrDueText("Due");
            }
        }
    }, [tableId]);

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
                    <Box pt={8}>
                        <SelectForm
                            pt={"xs"}
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
                    </Box>

                    {enableTable && (
                        <Tooltip
                            disabled={!(invoiceData?.invoice_items.length === 0 || !salesByUser)}
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
                                disabled={invoiceData?.invoice_items.length === 0 || !salesByUser}
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
                        records={invoiceData.invoice_items}
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
                                        {/*{configData?.currency?.symbol} */}
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
                                {configData?.currency?.symbol} {salesTotalAmount.toFixed(2)}
                            </Text>
                        </Group>
                    </Group>
                </Box>
                <Box
                    className={classes["box-border"]}
                    pl={4}
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
                        pr={4}
                        mb={0}
                    >
                        <Grid
                            columns={12}
                            gutter={4}
                            justify="center"
                            align="center"
                            className={classes["box-white"]}
                            mr={4}
                            ml={4}
                            pt={8}
                            pb={8}
                        >
                            <Grid.Col span={6} pl={4} pr={4}>
                                <Grid bg={"green.0"} pl={4} pr={4}>
                                    <Grid.Col span={7}>
                                        <Stack gap={0}>
                                            <Group justify="space-between" gap={0}>
                                                <Text fz={"sm"} fw={500} c={"black"}>
                                                    {t("DIS.")}
                                                </Text>
                                                <Text fz={"sm"} fw={800} c={"black"}>
                                                    {configData?.currency?.symbol}{" "}
                                                    {salesDiscountAmount.toFixed(2)}
                                                </Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text fz={"sm"} fw={500} c={"black"}>
                                                    {t("Type")}
                                                </Text>
                                                <Text fz={"sm"} fw={800} c={"black"}>
                                                    {discountType}
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
                                    grow
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
                                    grow
                                    gap={0}
                                    className={classes["box-border"]}
                                    align="center"
                                    justify="center"
                                    bg={"red"}
                                    pt={4}
                                    pb={4}
                                    mr={8}
                                >
                                    <Text fw={800} c={"white"} size={"lg"}>
                                        {configData?.currency?.symbol} {salesDueAmount.toFixed(2)}
                                    </Text>
                                    <Text fw={500} c={"white"} size={"md"}>
                                        {returnOrDueText}
                                    </Text>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                        <Grid
                            columns={24}
                            gutter={2}
                            align="center"
                            justify="center"
                            style={{
                                borderRadius: 4,
                                border:
                                    form.errors.transaction_mode_id && !transactionModeId
                                        ? "1px solid red"
                                        : "none",
                            }}
                        >
                            <Grid.Col span={18}>
                                <Box
                                    className={classes["box-white"]}
                                    ml={4}
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
                                                            bg={mode.id === transactionModeId ? "red.2" : "white"}
                                                            direction="column"
                                                            align="center"
                                                            justify="center"
                                                            p={6}
                                                            style={{
                                                                width: "100px",
                                                                borderRadius: "8px",
                                                            }}
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
                                                                    mih={50}
                                                                    mah={50}
                                                                    fit="contain"
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
                            <Grid.Col span={6}>
                                <Button
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
                                </Button>
                            </Grid.Col>
                        </Grid>
                        <Box m={0}>
                            <Grid
                                columns={24}
                                gutter={{base: 4}}
                                pl={"4"}
                                pr={"4"}
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
                                            color="red"
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
                                <Grid.Col span={3}>
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
                                            setDiscountType(
                                                event.currentTarget.checked ? "Percent" : "Flat"
                                            );
                                            const data = {
                                                url: "inventory/pos/inline-update",
                                                data: {
                                                    invoice_id: tableId,
                                                    field_name: "discount_type",
                                                    value: event.currentTarget.checked ? "Percent" : "Flat",
                                                    discount_amount: discountType === "Percent" ? invoiceData?.percentage : invoiceData?.discount
                                                },
                                            };

                                            if (discountType == "Flat") {
                                                setSalesDiscountAmount(invoiceData?.discount)
                                            } else if (discountType == "Percent") {
                                                setSalesDiscountAmount((invoiceData?.sub_total * Number(invoiceData?.percentage)) / 100)
                                            }

                                            // Dispatch and handle response
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
                                </Grid.Col>
                                <Grid.Col span={3} bg={"red"}>
                                    <TextInput
                                        type="number"
                                        placeholder={t("Discount")}
                                        value={form.values.discount ? form.values.discount : discountType == 'Percent' ? invoiceData?.percentage : invoiceData?.discount}
                                        error={form.errors.discount}
                                        size={"sm"}
                                        classNames={{input: classes.input}}
                                        onChange={(event) => {
                                            form.setFieldValue("discount", event.target.value);
                                        }}
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
                                </Grid.Col>
                                <Grid.Col span={6} bg={"yellow"}>
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
                                    />
                                </Grid.Col>
                                {/* <Grid.Col span={6}> &nbsp; </Grid.Col> */}
                                <Grid.Col span={6} bg={"green"}>
                                    <Tooltip
                                        label={t("ReceiveAmountValidateMessage")}
                                        opened={!!form.errors.receive_amount}
                                        px={16}
                                        py={2}
                                        position="top-end"
                                        bg={`red.4`}
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
                                            type="number"
                                            placeholder={
                                                isThisTableSplitPaymentActive
                                                    ? t("SplitPaymentActive")
                                                    : t("Amount")
                                            }
                                            value={invoiceData?.payment}
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
                                                    form.setFieldValue(
                                                        "receive_amount",
                                                        event.target.value
                                                    );

                                                    setTableReceiveAmounts((prev) => ({
                                                        ...prev,
                                                        [currentTableKey]: event.target.value,
                                                    }));
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Grid columns={12} gutter={{base: 2}} pl={"4"} pr={"4"}>
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
                                        bg={"red.5"}
                                        c={"white"}
                                        size={"sm"}
                                        fullWidth={true}
                                        leftSection={<IconHandStop/>}
                                    >
                                        {t("Hold")}
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
                                            bg={"green.5"}
                                            size={"sm"}
                                            c={"white"}
                                            fullWidth={true}
                                            leftSection={<IconPrinter/>}
                                            // onClick={handlePrintAll}
                                        >
                                            {t("AllPrint")}
                                        </Button>
                                    </Tooltip>
                                </Grid.Col>
                            )}
                            <Grid.Col span={enableTable ? 3 : 4}>
                                <Button
                                    disabled={isDisabled}
                                    bg={"gray.8"}
                                    c={"white"}
                                    size={"sm"}
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
                                    size={"sm"}
                                    c={"white"}
                                    bg={"green.8"}
                                    fullWidth={true}
                                    leftSection={<IconDeviceFloppy/>}
                                    // onClick={handlePrintAll}
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
