import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  ActionIcon,
  Text,
  Menu,
  rem,
  TextInput,
  Tooltip,
  Button,
  Grid,
  Flex,
  ScrollArea,
  Card,
  Image,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconLayoutGrid,
  IconListDetails,
  IconCheck,
  IconSearch,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Table.module.css";
export default function Table() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

  const [tc, setTc] = useState("#333333");
  const [bg, setBg] = useState("#E6F5ED");
  const [selected, setSelected] = useState([]);
  const [grid, setGrid] = useState(null);

  const handleSelect = (productId) => {
    setSelected((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const data = [
    { id: 1, itemName: "All" },
    { id: 2, itemName: "Pizza" },
    { id: 3, itemName: "Burger" },
    { id: 4, itemName: "Set Menu" },
    { id: 5, itemName: "Fries" },
    { id: 6, itemName: "Soup" },
    { id: 7, itemName: "Subway" },
    { id: 8, itemName: "Sandwich" },
    { id: 9, itemName: "Chicken" },
    { id: 10, itemName: "Drinks" },
    { id: 11, itemName: "Pasta" },
    { id: 12, itemName: "Lemonade" },
    { id: 13, itemName: "Juice" },
    { id: 14, itemName: "Summer Special" },
  ];

  const products = [
    {
      id: 1,
      name: "Margarita Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 120,
    },
    {
      id: 2,
      name: "Lemonade Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 130,
    },
    {
      id: 3,
      name: "Barrista Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 110,
    },
    {
      id: 4,
      name: "Jhankar Pizza",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
      price: 120,
    },
    {
      id: 5,
      name: "Uttara Pizza",
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

  const [id, setId] = useState(null);
  const clicked = (id) => {
    setId(id);
  };

  return (
    <>
      <Box p={0} m={0}>
        <Group
          preventGrowOverflow={false}
          grow
          align="flex-start"
          wrap="nowrap"
          gap={4}
        >
          <TextInput
            radius="md"
            leftSection={<IconSearch size={16} opacity={0.5} />}
            size="md"
            placeholder="SearchFood"
            rightSection={
              searchKeyword ? (
                <Tooltip label="Clear" withArrow position="top">
                  <IconX
                    color="red"
                    size={16}
                    opacity={0.5}
                    style={{ cursor: "pointer" }}
                    // onClick={() => setSearchKeyword("")}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  label="Field is required"
                  withArrow
                  position="top"
                  color="red"
                >
                  <IconInfoCircle size={16} opacity={0.5} />
                </Tooltip>
              )
            }
          />
          <ActionIcon
            size="input-md"
            variant="default"
            radius="md"
            aria-label="Settings"
            miw={60}
            maw={60}
            c={"green.8"}
            onClick={() => {
              grid ? setGrid(false) : setGrid(true);
            }}
          >
            {!grid ? (
              <IconListDetails height={"24"} width={"24"} stroke={1.5} />
            ) : (
              <IconLayoutGrid height={"24"} width={"24"} stroke={1.5} />
            )}
          </ActionIcon>
        </Group>
      </Box>
      <Grid columns={12} gutter={{ base: 12 }}>
        <Grid.Col span={2}>
          <Box bg="white" w={"100%"} mt={8} style={{ borderRadius: 8 }}>
            <ScrollArea h={height + 142} type="never" scrollbars="y">
              <Box pt={"4"} pl={"xs"} pr={"xs"} pb={"8"}>
                {data.map((data) => (
                  <Box
                    style={{
                      borderRadius: 4,
                    }}
                    className={classes["pressable-card"]}
                    mih={40}
                    mt={"4"}
                    variant="default"
                    key={data.id}
                    onClick={() => {
                      console.log("Clicked on Table -", data.id);
                      clicked(data.id);
                    }}
                    bg={data.id === id ? "green.8" : "#EAECED"}
                  >
                    <Text
                      size={"md"}
                      pl={14}
                      pt={8}
                      fw={500}
                      c={data.id === id ? "white" : "#333333"}
                    >
                      {data.itemName}
                    </Text>
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </Box>
        </Grid.Col>
        <Grid.Col span={10}>
          <Box
            bg="white"
            w={"100%"}
            h={height + 142}
            mt={8}
            style={{ borderRadius: 8 }}
          >
            <ScrollArea
              h={height + 142}
              type="never"
              pt={"8"}
              pl={"xs"}
              pr={"xs"}
              pb={"6"}
              scrollbars="y"
            >
              {grid ? (
                <Grid columns={12} gutter={8}>
                  {products.map((product) => (
                    <Grid.Col key={product.id} span={6}>
                      <Grid
                        columns={12}
                        gutter={0}
                        p="xs"
                        className={`${classes["pressable-card"]} ${
                          classes["card"]
                        } ${
                          selected.includes(product.id)
                            ? classes["border"]
                            : classes["border-not"]
                        }`}
                        style={{ borderRadius: "4px" }}
                        onClick={() => handleSelect(product.id)}
                      >
                        <Grid.Col span={6}>
                          <Image
                            h={134}
                            w={"100%"}
                            src={product.img}
                            alt={product.name}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={6}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Card
                            w="100%"
                            padding="xl"
                            style={{ height: "100%" }}
                          >
                            <Text fw={600} size="md" mt="sm">
                              {product.name}
                            </Text>
                            <Text mt="xs" fw={500} c="" size="sm">
                              {product.price}
                            </Text>
                          </Card>
                        </Grid.Col>
                      </Grid>
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Grid columns={12} gutter={{ base: 8 }}>
                  {products.map((product) => (
                    <Grid.Col span={3} key={product.id}>
                      <Card
                        p={"md"}
                        radius="sm"
                        onClick={() => {
                          handleSelect(product.id);
                        }}
                        className={`${classes["pressable-card"]} ${
                          classes["card"]
                        }  ${
                          selected.includes(product.id)
                            ? classes["border"]
                            : classes["border-not"]
                        }`}
                      >
                        <Card.Section>
                          <Flex justify={"center"} align={"center"}>
                            <Image
                              mt={2}
                              mb={4}
                              pt={"xs"}
                              pl={"xs"}
                              pr={"xs"}
                              pb={4}
                              src={product.img}
                              height={180}
                              w={180}
                              alt={product.name}
                              fit="cover"
                              radius="lg"
                            />
                          </Flex>
                        </Card.Section>

                        <Text fw={700} size="sm" c={"#333333"} mt={"4"}>
                          {product.name}
                        </Text>

                        <Text fw={800} size="md" c={"#333333"}>
                          ${product.price}
                        </Text>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </ScrollArea>
          </Box>
        </Grid.Col>
      </Grid>
      {/* <Box bg="white" w={"100%"} mt={8} style={{ borderRadius: 8 }}>
        <Group
          grow
          gap={4}
          h={54}
          justify="center"
          align="center"
          pl={8}
          pr={8}
          className="divider"
        >
          <Button
            bg={bg}
            onClick={() => {
              bg === "#E6F5ED" ? setBg("green.8") : setBg("#E6F5ED"),
                tc === "#333333" ? setTc("white") : setTc("#333333");
            }}
          >
            <Text c={tc} size="sm" fw={600}>
              Order
            </Text>
          </Button>
          <Button bg={"#E6F5ED"}>
            <Text c={"#333333"} size="sm" fw={600}>
              Kitchen
            </Text>
          </Button>
          <Button bg={"#E6F5ED"}>
            <Text c={"#333333"} size="sm" fw={600}>
              Hold
            </Text>
          </Button>
          <Button bg={"#E6F5ED"}>
            <Text c={"#333333"} size="sm" fw={600}>
              Reserved
            </Text>
          </Button>
          <Button bg={"#E6F5ED"}>
            <Text c={"#333333"} size="sm" fw={600}>
              Free
            </Text>
          </Button>
        </Group>
      </Box> */}
    </>
  );
}
