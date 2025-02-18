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

export default function BakeryIndex() {
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 130;
  const progress = getLoadingProgress();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  const [tables, setTables] = useState(
    Array.from({ length: 18 }, (_, i) => ({
      id: i + 1,
      time: time,
      status: "Free",
    }))
  );
  useEffect(() => {
    setTables((prevTables) =>
      prevTables.map((table) => ({
        ...table,
        time: time, // Update the time in each table object
      }))
    );
  }, [time]);

  const [tableId, setTableId] = useState(null);
  const [enableTable, setEnableTable] = useState(true);

  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          {enableTable && (
            <HeaderNavbar
              pageTitle={t("ManageCustomer")}
              roles={t("Roles")}
              allowZeroPercentage=""
              currencySymbol=""
              tables={tables}
              setTables={setTables}
              tableId={tableId}
              setTableId={setTableId}
            />
          )}
          <Box
            h={height + 4}
            mt={6}
            ml={6}
            mr={6}
            style={{ borderRadius: "4px" }}
            c={"#EAECED"}
            className={classes["body"]}
          >
            <Box pl={"4"}>
              <NewSales
                tables={tables}
                setTables={setTables}
                enableTable={enableTable}
                categoryDropdown={categoryDropdown}
                tableId={tableId}
                setTableId={setTableId}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
