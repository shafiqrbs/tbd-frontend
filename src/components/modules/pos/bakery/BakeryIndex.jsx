import React, {useEffect, useMemo, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {Box, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import NewSales from "./NewSales.jsx";
import classes from "./css/Index.module.css";
import HeaderNavbar from "../HeaderNavbar.jsx";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";

export default function BakeryIndex() {
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 130;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const progress = getLoadingProgress();
    const {configData, fetchData} = getConfigData();

    // ✅ Redux Store Data
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad);
    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData);

    console.log(categoryDropdownData)

    // ✅ Local State
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [tables, setTables] = useState([]);
    const [tableCustomerMap, setTableCustomerMap] = useState({});
    const [customerObject, setCustomerObject] = useState({});
    const [tableSplitPaymentMap, setTableSplitPaymentMap] = useState({});
    const [indexData, setIndexData] = useState([]);
    const [invoiceMode, setInvoiceMode] = useState(null);
    const [tableId, setTableId] = useState(null);

    // ✅ Optimized Category Dropdown Fetching

    useEffect(() => {
        const value = {
            url: "inventory/select/category",
            param: {
                type: "all",
            },
        };
        dispatch(getCategoryDropdown(value));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad]);

    // ✅ Category Dropdown Data Transformation (Using `useMemo`)
    const categoryDropdown = useMemo(() => {
        return categoryDropdownData.length > 0
            ? categoryDropdownData.map(({name, id}) => ({label: name, value: String(id)}))
            : [];
    }, [categoryDropdownData]);

    // ✅ Optimized Time Update Using `setInterval`
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000); // Update time every second instead of every 100ms

        return () => clearInterval(intervalId);
    }, []);

    // ✅ Optimized Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultAction = await dispatch(getIndexEntityData({
                    url: "inventory/pos/check/invoice-mode",
                    param: {}
                }));
                if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setInvoiceMode(resultAction.payload.invoice_mode);
                    setIndexData(resultAction.payload.data);
                } else {
                    console.error("Error fetching data:", resultAction);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };
        fetchData();
    }, [dispatch]);

    // ✅ Memoized Active Table Extraction
    const tableIdMemoized = useMemo(() => {
        return indexData.find((item) => item.is_active)?.id || null;
    }, [indexData]);

    useEffect(() => {
        setTableId(tableIdMemoized);
    }, [tableIdMemoized]);

    // ✅ Memoized Transformed Table Data
    const transformedTables = useMemo(() => {
        return indexData.map(({id, particular_name, username, name, customer_id, is_active}) => {
            let particularName =
                invoiceMode === "table"
                    ? `${particular_name} ${id}`
                    : invoiceMode === "user"
                        ? `${username} ${id}`
                        : invoiceMode === "customer"
                            ? `${name} ${customer_id}`
                            : `Unknown ${id}`;

            return {
                id,
                status: is_active,
                statusHistory: [],
                currentStatusStartTime: null,
                elapsedTime: "00:00:00",
                value: particularName,
            };
        });
    }, [indexData, invoiceMode]);

    // ✅ Efficient `tables` State Update
    useEffect(() => {
        setTables(transformedTables);
    }, [transformedTables]);

    // ✅ Time Update in Tables
    useEffect(() => {
        setTables((prevTables) =>
            prevTables.map((table) => (table.time !== time ? {...table, time: time} : table))
        );
    }, [time]);

    // ✅ Memoized Selected Customer Object
    const selectedCustomer = useMemo(() => tableCustomerMap[tableId] || {}, [tableId, tableCustomerMap]);

    // ✅ Optimized Customer Object State Update
    useEffect(() => {
        if (tableId && selectedCustomer && JSON.stringify(customerObject) !== JSON.stringify(selectedCustomer)) {
            setCustomerObject(selectedCustomer);
        } else if (!tableId && Object.keys(customerObject).length > 0) {
            setCustomerObject({});
        }
    }, [tableId, selectedCustomer]);

    // ✅ Utility Functions for Table Operations
    const updateTableCustomer = (tableId, customerId, customerData) => {
        if (!tableId) return;
        setTableCustomerMap((prev) => ({...prev, [tableId]: {id: customerId, ...customerData}}));
    };

    const clearTableCustomer = (tableId) => {
        if (!tableId) return;
        setTableCustomerMap((prev) => {
            const newMap = {...prev};
            delete newMap[tableId];
            return newMap;
        });
    };

    const updateTableSplitPayment = (tableId, splitPayments) => {
        if (!tableId) return;
        setTableSplitPaymentMap((prev) => ({...prev, [tableId]: splitPayments}));
    };

    const clearTableSplitPayment = (tableId) => {
        if (!tableId) return;
        setTableSplitPaymentMap((prev) => {
            const newMap = {...prev};
            delete newMap[tableId];
            return newMap;
        });
    };


    return (
        <>
            {progress !== 100 && (
                <Progress color="red" size={"sm"} striped animated value={progress}/>
            )}
            {progress === 100 && (
                <>
                    {!!(configData?.is_pos && configData?.pos_invoice_mode?.slug) && (
                        <HeaderNavbar
                            pageTitle={t("ManageCustomer")}
                            roles={t("Roles")}
                            tables={tables}
                            tableId={tableId}
                            setTables={setTables}
                            setTableId={setTableId}
                            tableCustomerMap={tableCustomerMap}
                            setCustomerObject={setCustomerObject}
                        />
                    )}
                    <Box
                        h={height + 4}
                        mt={6}
                        ml={6}
                        mr={12}
                        style={{borderRadius: "4px"}}
                        c={"#EAECED"}
                        className={classes["body"]}
                    >
                        <Box pl={"4"}>
                            <NewSales
                                categoryDropdown={categoryDropdown}
                                tableId={tableId}
                                setTableId={setTableId}
                                tables={tables}
                                setTables={setTables}
                                tableCustomerMap={tableCustomerMap}
                                updateTableCustomer={updateTableCustomer}
                                clearTableCustomer={clearTableCustomer}
                                customerObject={customerObject}
                                setCustomerObject={setCustomerObject}
                                updateTableSplitPayment={updateTableSplitPayment}
                                clearTableSplitPayment={clearTableSplitPayment}
                                tableSplitPaymentMap={tableSplitPaymentMap}
                            />
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}
