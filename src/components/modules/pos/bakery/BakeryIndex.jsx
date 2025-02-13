import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import Table from "./Table.jsx";
import classes from "./Index.module.css";
import Sales from "./Sales.jsx";
import HeaderNavbar from "../HeaderNavbar.jsx";
import { getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import { setDropdownLoad } from "../../../../store/inventory/crudSlice.js";
import {
  editEntityData,
  getIndexEntityData,
  setFetching,
  setFormLoading,
  setInsertType,
  showEntityData,
  deleteEntityData,
  getStatusInlineUpdateData,
  storeEntityData,
} from "../../../../store/core/crudSlice.js";
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

  //get products
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const [indexData, setIndexData] = useState([]);
  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    // Filter products where product_nature is not 'raw-materials'
    const filteredProducts = localProducts.filter(
      (product) => product.product_nature !== "raw-materials"
    );

    setIndexData(filteredProducts);
  }, []);
  const [quantities, setQuantities] = useState({});


  const [tables, setTables] = useState([
    { id: 1, time: "08:01:49 PM" },
    { id: 2, time: "08:01:49 PM" },
    { id: 3, time: "08:01:49 PM" },
    { id: 4, time: "08:01:49 PM" },
    { id: 5, time: "08:01:49 PM" },
    { id: 6, time: "08:01:49 PM" },
    { id: 7, time: "08:01:49 PM" },
    { id: 8, time: "08:01:49 PM" },
    { id: 9, time: "08:01:49 PM" },
    { id: 10, time: "08:01:49 PM" },
    { id: 11, time: "08:01:49 PM" },
    { id: 12, time: "08:01:49 PM" },
    { id: 13, time: "08:01:49 PM" },
    { id: 14, time: "08:01:49 PM" },
    { id: 15, time: "08:01:49 PM" },
    { id: 16, time: "08:01:49 PM" },
    { id: 17, time: "08:01:49 PM" },
    { id: 18, time: "08:01:49 PM" },
  ]);

  const [enableTable, setEnableTable] = useState(false);

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
              <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={15}>
                  <Table
                    enableTable={enableTable}
                    quantities={quantities}
                    setQuantities={setQuantities}
                    products={indexData}
                    categoryDropdown={categoryDropdown}
                  />
                </Grid.Col>
                <Grid.Col span={9}>
                  <Box style={{ borderRadius: 8 }}>
                    <Sales
                      enableTable={enableTable}
                      quantities={quantities}
                      setQuantities={setQuantities}
                      products={indexData}
                    />
                  </Box>
                </Grid.Col>
              </Grid>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
