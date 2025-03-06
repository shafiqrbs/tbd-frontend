import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import NewSales from "./NewSales.jsx";
import classes from "./Index.module.css";
import Invoice from "./Invoice.jsx";
import HeaderNavbar from "../HeaderNavbar.jsx";
import { getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import { setDropdownLoad } from "../../../../store/inventory/crudSlice.js";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

export default function BakeryIndex() {
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 130;
  const progress = getLoadingProgress();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { configData, fetchData } = getConfigData();
  // category dropdown
  const dropdownLoad = useSelector(
    (state) => state.inventoryCrudSlice.dropdownLoad
  );
  const categoryDropdownData = useSelector(
    (state) => state.inventoryUtilitySlice.categoryDropdownData
  );

  let categoryDropdown =
    categoryDropdownData && categoryDropdownData.length > 0
      ? categoryDropdownData.map((type, index) => {
          return { label: type.name, value: String(type.id) };
        })
      : [];

  useEffect(() => {
    const value = {
      url: "inventory/select/category",
      param: {
        // type: 'parent'
        type: "all",
      },
    };
    dispatch(getCategoryDropdown(value));
    dispatch(setDropdownLoad(false));
  }, [dropdownLoad]);

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const [tables, setTables] = useState([]);
  const [tableCustomerMap, setTableCustomerMap] = useState({});
  const [customerObject, setCustomerObject] = useState({});

  const updateTableCustomer = (tableId, customerId, customerData) => {
    if (!tableId) return;

    setTableCustomerMap((prev) => ({
      ...prev,
      [tableId]: {
        id: customerId,
        ...customerData,
      },
    }));
  };

  const clearTableCustomer = (tableId) => {
    if (!tableId) return;

    setTableCustomerMap((prev) => {
      const newMap = { ...prev };
      delete newMap[tableId];
      return newMap;
    });
  };

  const tableData = getSettingParticularDropdownData("table");

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const transformedTables = tableData.map((item) => {
        const tableId = parseInt(item.label.split("-")[1]);
        return {
          id: tableId,
          time: time,
          status: "Free",
          statusHistory: [],
          currentStatusStartTime: null,
          elapsedTime: "00:00:00",
          value: item.value,
        };
      });

      setTables(transformedTables);
    }
  }, [tableData]);
  useEffect(() => {
    setTables((prevTables) =>
      prevTables.map((table) => ({
        ...table,
        time: time,
      }))
    );
  }, [time]);

  const [tableId, setTableId] = useState(null);
  useEffect(() => {
    if (tableId && tableCustomerMap[tableId]) {
      if (
        JSON.stringify(customerObject) !==
        JSON.stringify(tableCustomerMap[tableId])
      ) {
        setCustomerObject(tableCustomerMap[tableId]);
      }
    } else if (Object.keys(customerObject).length > 0) {
      setCustomerObject({});
    }
  }, [tableId, tableCustomerMap, customerObject]);
  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          {!!(configData?.is_pos && configData?.is_table_pos) && (
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
            style={{ borderRadius: "4px" }}
            c={"#EAECED"}
            className={classes["body"]}
          >
            <Box pl={"4"}>
              <NewSales
                enableTable={!!(configData?.is_pos && configData?.is_table_pos)}
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
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
