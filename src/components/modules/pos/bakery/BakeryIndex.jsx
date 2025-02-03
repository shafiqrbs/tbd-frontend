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
export default function BakeryIndex() {
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 130;
  const progress = getLoadingProgress();
  const { t } = useTranslation();
  const dispatch = useDispatch()

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

  const products = [
    {
      id: 1,
      name: "Margarita Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 120.25,
    },
    {
      id: 2,
      name: "Lemonade Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 130.5,
    },
    {
      id: 3,
      name: "Barrista Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 110.75,
    },
    {
      id: 4,
      name: "Jhankar Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 12000.25,
    },
    {
      id: 5,
      name: "Uttara Pizza githubusercontent githubusercontent mantine demo",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 200,
    },
    {
      id: 6,
      name: "Chikni Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 220,
    },
    {
      id: 7,
      name: "Dambu Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 300,
    },
    {
      id: 8,
      name: "Gambu Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 400,
    },
    {
      id: 9,
      name: "Chontu Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 50,
    },
    {
      id: 10,
      name: "Pontu Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 100,
    },
    {
      id: 11,
      name: "Chintu Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 210,
    },
    {
      id: 12,
      name: "Kintu Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 220,
    },
    {
      id: 13,
      name: "Asta Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 240,
    },
    {
      id: 14,
      name: "Beef Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 300,
    },
    {
      id: 15,
      name: "Chicken Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 400,
    },
    {
      id: 16,
      name: "Mango Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 500,
    },
    {
      id: 17,
      name: "Django Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 180,
    },
    {
      id: 18,
      name: "Vue Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 790,
    },
  ];

  const [quantities, setQuantities] = useState(
    products.reduce(
      (acc, product) => ({
        ...acc,
        [product.id]: {
          id: product.id,
          name: product.name,
          quantity: 0,
          price: product.price,
        },
      }),
      {}
    )
  );

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
                    products={products}
                    categoryDropdown={categoryDropdown}
                  />
                </Grid.Col>
                <Grid.Col span={9}>
                  <Box style={{ borderRadius: 8 }}>
                    <Sales
                      enableTable={enableTable}
                      quantities={quantities}
                      setQuantities={setQuantities}
                      products={products}
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
