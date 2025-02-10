import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  ActionIcon,
  Text,
  Menu,
  Center,
  TextInput,
  Tooltip,
  Button,
  Grid,
  Flex,
  Stack,
  ScrollArea,
  Card,
  Image,
  SegmentedControl,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconLayoutGrid,
  IconListDetails,
  IconBaselineDensitySmall,
  IconSearch,
  IconInfoCircle,
  IconSum,
  IconMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Table.module.css";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { DataTable } from "mantine-datatable";
import tableCss from "./Table.module.css";
import Sales from "./Sales";

export default function Table(props) {
  const { enableTable, categoryDropdown } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104

  const [tc, setTc] = useState("#333333");
  const [bg, setBg] = useState("#E6F5ED");
  const [selected, setSelected] = useState([]);

  //get products

  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
    const filteredProducts = localProducts.filter(
      (product) => product.product_nature !== "raw-materials"
    );
    setProducts(filteredProducts);
    setOriginalProducts(filteredProducts);
  }, []);

  const { configData } = getConfigData();
  // console.log(products)
  // console.log(configData)
  const handleSelect = (productId) => {
    setSelected((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  // changes
  const [quantities, setQuantities] = useState({});

  const changeSubTotalbyQuantity = (event) => {
    const quantity = Number(event.target.value);
    const purchase_price = Number(productForm.values.purchase_price);
    if (
      !isNaN(quantity) &&
      !isNaN(purchase_price) &&
      quantity > 0 &&
      purchase_price >= 0
    ) {
      setSelectProductDetails((prevDetails) => ({
        ...prevDetails,
        sub_total: quantity * purchase_price,
      }));
      productForm.setFieldValue("sub_total", quantity * purchase_price);
    }
  };
  const handleIncrement = (productId) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      if (!updatedQuantities[productId]) {
        updatedQuantities[productId] = {
          id: productId,
          quantity: 0,
          display_name:
            products.find((product) => product.id === productId)
              ?.display_name || "",
          sales_price:
            products.find((product) => product.id === productId)?.sales_price ||
            0,
          sub_total: 0,
        };
      }

      updatedQuantities[productId].quantity += 1;
      updatedQuantities[productId].sub_total =
        updatedQuantities[productId].quantity *
        updatedQuantities[productId].sales_price;
      return updatedQuantities;
    });
  };

  const handleDecrement = (productId) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };

      if (updatedQuantities[productId]) {
        updatedQuantities[productId] = {
          ...updatedQuantities[productId],
          quantity: Math.max(0, updatedQuantities[productId].quantity - 1),
        };
      }

      return updatedQuantities;
    });
  };

  const [id, setId] = useState(null);
  const clicked = (id) => {
    setId(id);
  };
  const [value, setValue] = useState("grid");

  // const calculateSubtotal = (data) => {
  //   return data.reduce((total, item) => total + item.price * item.qty, 0);
  // };
  // const subtotal = calculateSubtotal(products);

  // search functionality

  const [searchValue, setSearchValue] = useState("");

  const filterList = (searchValue) => {
    if (!searchValue) {
      setProducts(originalProducts);
      return;
    }

    const updatedList = originalProducts.filter((product) => {
      return product.display_name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setProducts(updatedList);
  };
  // useEffect(() => {
  //   console.log(products.length);
  //   console.log(products);
  // }, [products]);

  return (
    <>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={15}>
          <Grid columns={12} gutter={{ base: 8 }}>
            <Grid.Col span={2}>
              <Box bg="white" w={"100%"} mt={6} style={{ borderRadius: 4 }}>
                <ScrollArea
                  h={enableTable ? height + 3 : height + 183}
                  type="never"
                  scrollbars="y"
                >
                  <Box pt={"6"} pl={"xs"} pr={"xs"} pb={"8"}>
                    {categoryDropdown.map((data) => (
                      <Box
                        style={{
                          borderRadius: 4,
                        }}
                        className={classes["pressable-card"]}
                        mih={40}
                        mt={"4"}
                        variant="default"
                        key={data.value}
                        onClick={() => {
                          console.log("Clicked on Table -", data.value);
                          clicked(data.value);
                        }}
                        bg={data.value === id ? "green.8" : "#EAECED"}
                      >
                        <Text
                          size={"md"}
                          pl={14}
                          pt={8}
                          fw={500}
                          c={data.value === id ? "white" : "#333333"}
                        >
                          {data.label}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </ScrollArea>
              </Box>
            </Grid.Col>
            <Grid.Col span={10}>
              <Box p={0} m={0}>
                <Grid
                  columns={16}
                  gutter={{ base: 4 }}
                  grow
                  align="center"
                  mt={6}
                >
                  <Grid.Col span={12}>
                    <TextInput
                      radius="md"
                      leftSection={<IconSearch size={16} opacity={0.5} />}
                      size="md"
                      placeholder="SearchFood"
                      rightSection={
                        searchValue ? (
                          <Tooltip label="Clear" withArrow position="top">
                            <IconX
                              color="red"
                              size={16}
                              opacity={0.5}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSearchValue("");
                                filterList("");
                              }}
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
                      onChange={(event) => {
                        setSearchValue(event.target.value);
                        filterList(event.target.value);
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <SegmentedControl
                      bg={"white"}
                      withItemsBorders={false}
                      fullWidth
                      color="green.6"
                      value={value}
                      onChange={setValue}
                      data={[
                        {
                          label: (
                            <Center style={{ gap: 10 }}>
                              <IconLayoutGrid
                                height={"24"}
                                width={"24"}
                                stroke={1.5}
                              />
                            </Center>
                          ),
                          value: "grid",
                        },
                        {
                          label: (
                            <Center style={{ gap: 10 }}>
                              <IconListDetails
                                height={"24"}
                                width={"24"}
                                stroke={1.5}
                              />
                            </Center>
                          ),
                          value: "list",
                        },
                        {
                          label: (
                            <Center style={{ gap: 10 }}>
                              <IconBaselineDensitySmall
                                height={"24"}
                                width={"24"}
                                stroke={1.5}
                              />
                              {/* <span>Minimal</span> */}
                            </Center>
                          ),
                          value: "minimal",
                        },
                      ]}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
              <Box
                bg="white"
                w={"100%"}
                h={enableTable ? height - 45 : height + 135}
                mt={8}
                style={{ borderRadius: 4 }}
              >
                <ScrollArea
                  h={enableTable ? height - 45 : height + 135}
                  type="never"
                  pt={"8"}
                  pl={"xs"}
                  pr={"xs"}
                  pb={"6"}
                  scrollbars="y"
                >
                  {value === "grid" && (
                    <Grid columns={12} gutter={{ base: 8 }}>
                      {products?.map((product) => (
                        <Grid.Col span={3} key={product.id}>
                          <Card
                            shadow="md"
                            radius="md"
                            padding="xs"
                            styles={(theme) => ({
                              root: {
                                cursor: "pointer",
                                transition: "transform 0.1s ease-in-out",
                                transform: selected.includes(product.id)
                                  ? "scale(0.97)"
                                  : undefined,
                                border: selected.includes(product.id)
                                  ? "3px solid #00542b"
                                  : "3px solid #eaeced",
                              },
                            })}
                            onClick={() => handleSelect(product.id)}
                          >
                            <Image
                              radius="sm"
                              mih={120}
                              mah={120}
                              w="auto"
                              fit="cover"
                              // src={product.img}
                              src={`${
                                import.meta.env.VITE_IMAGE_GATEWAY_URL
                              }/uploads/inventory/product/feature_image/${
                                product.feature_image
                              }`}
                              fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                product.display_name
                              )}`}
                            />
                            <Text
                              fw={600}
                              size="sm"
                              fz={"13"}
                              mt={"4"}
                              ta={"left"}
                            >
                              {product.display_name}
                            </Text>

                            <Text
                              styles={{
                                root: {
                                  marginTop: "auto", // This pushes the price to the bottom
                                },
                              }}
                              ta={"right"}
                              fw={900}
                              fz={"18"}
                              size="md"
                              c={"green.9"}
                            >
                              {configData?.currency?.symbol}{" "}
                              {product.sales_price}
                            </Text>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  )}
                  {value === "list" && (
                    <Grid columns={12} gutter={8}>
                      {products?.map((product) => (
                        <Grid.Col key={product.id} span={6}>
                          <Card
                            shadow="md"
                            radius="md"
                            styles={(theme) => ({
                              root: {
                                cursor: "pointer",
                                transition: "transform 0.1s ease-in-out",
                                transform: selected.includes(product.id)
                                  ? "scale(0.97)"
                                  : undefined,
                                border: selected.includes(product.id)
                                  ? "3px solid #00542b"
                                  : "3px solid #eaeced",
                              },
                            })}
                            padding="xs"
                            onClick={() => handleSelect(product.id)}
                          >
                            <Grid columns={12}>
                              <Grid.Col span={6}>
                                <Card p={0}>
                                  <Image
                                    mih={120}
                                    mah={120}
                                    miw={70}
                                    fit="cover"
                                    // src={product.img}
                                    src={`${
                                      import.meta.env.VITE_IMAGE_GATEWAY_URL
                                    }/uploads/inventory/product/feature_image/${
                                      product.feature_image
                                    }`}
                                    fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                      product.display_name
                                    )}`}
                                  />
                                </Card>
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <Stack
                                  radius="md"
                                  mih={"118"}
                                  bg="var(--mantine-color-body)"
                                  align="stretch"
                                  justify="space-between"
                                  gap="md"
                                >
                                  <Text fw={600} size="sm" fz={"13"} mt={"4"}>
                                    {product.display_name}
                                  </Text>
                                  <Flex
                                    gap="md"
                                    justify="flex-end"
                                    align="flex-end"
                                    direction="row"
                                    wrap="nowrap"
                                  >
                                    <Text
                                      ta={"right"}
                                      fw={900}
                                      fz={"18"}
                                      size="md"
                                      c={"green.9"}
                                    >
                                      {configData?.currency?.symbol}{" "}
                                      {product.sales_price}
                                    </Text>
                                  </Flex>
                                </Stack>
                              </Grid.Col>
                            </Grid>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  )}
                  {value === "minimal" && (
                    <>
                      <DataTable
                        classNames={{
                          root: tableCss.root,
                          table: tableCss.table,
                          header: tableCss.header,
                          footer: tableCss.footer,
                          pagination: tableCss.pagination,
                        }}
                        // withTableBorder={true}
                        // withColumnBorders={true}
                        records={products}
                        columns={[
                          {
                            accessor: "id",
                            title: "S/N",
                            render: (data, index) => index + 1,
                          },
                          {
                            accessor: "display_name",
                            title: t("Product"),
                          },
                          {
                            accessor: "price",
                            title: t("Price"),
                            textAlign: "center",
                            render: (data) => (
                              <>
                                {configData?.currency?.symbol}{" "}
                                {data.sales_price}
                              </>
                            ),
                          },
                          {
                            accessor: "qty",
                            title: t("Qty"),
                            textAlign: "center",
                            backgroundColor: "blue",
                            render: (data) => (
                              <Group gap={8} justify="center" align="center">
                                <ActionIcon
                                  size={"sm"}
                                  bg={"#596972"}
                                  onClick={() => handleDecrement(data.id)}
                                >
                                  <IconMinus height={"12"} width={"12"} />
                                </ActionIcon>
                                <Text
                                  size="sm"
                                  ta={"center"}
                                  fw={600}
                                  maw={30}
                                  miw={30}
                                >
                                  {quantities[data.id]?.quantity ?? 0}
                                </Text>
                                <ActionIcon
                                  size={"sm"}
                                  bg={"#596972"}
                                  onClick={() => handleIncrement(data.id)}
                                >
                                  <IconPlus height={"12"} width={"12"} />
                                </ActionIcon>
                              </Group>
                            ),
                          },
                        ]}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height + 120}
                        // backgroundColor={'black'}
                        scrollAreaProps={{ type: "never" }}
                      />
                    </>
                  )}
                </ScrollArea>
              </Box>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={9}>
          <Sales
            enableTable={enableTable}
            quantities={quantities}
            setQuantities={setQuantities}
            products={products}
          />
        </Grid.Col>
      </Grid>
      {enableTable && (
        <Box bg="white" w={"100%"} mt={8} style={{ borderRadius: 4 }}>
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
        </Box>
      )}
    </>
  );
}
