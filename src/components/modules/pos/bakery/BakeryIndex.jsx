import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import Table from "./Table.jsx";
import classes from "./Index.module.css";
import Sales from "./Sales.jsx";
export default function BakeryIndex() {
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 130;
  const progress = getLoadingProgress();

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
  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
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
                <Grid.Col span={16}>
                  <Table
                    quantities={quantities}
                    setQuantities={setQuantities}
                    products={products}
                    />
                </Grid.Col>
                <Grid.Col span={8}>
                  <Box style={{ borderRadius: 8 }}>
                    <Sales
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
