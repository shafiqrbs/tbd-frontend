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
import Invoice from "./Invoice.jsx";
import { notifications } from "@mantine/notifications";

export default function NewSales(props) {
  const { enableTable, categoryDropdown } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104

  const [tc, setTc] = useState("#333333");
  const [bg, setBg] = useState("#E6F5ED");
  const [selected, setSelected] = useState([]);
  const [id, setId] = useState(null);

  //get products

  const [loadCartProducts, setLoadCartProducts] = useState(false);
  const [tempCartProducts, setTempCartProducts] = useState([]);
  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-pos-products");
    setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCartProducts(false);
  }, [loadCartProducts]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
    const filteredProducts = localProducts.filter((product) => {
      if (id) {
        return (
          product.product_nature !== "raw-materials" &&
          product.category_id === Number(id) &&
          product.sales_price !== 0
        );
      }
      return product.product_nature !== "raw-materials";
    });
    setProducts(filteredProducts);
    setOriginalProducts(filteredProducts);
    // console.log("from filter use", filteredProducts);
  }, [id]);
  const { configData } = getConfigData();
  // console.log(products)
  // console.log(configData)
  const handleSelect = (productId) => {
    setSelected((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
    setTimeout(() => {
      setSelected([]);
    }, 50);
  };

  const handleIncrement = (productId) => {
    const cartProducts = localStorage.getItem("temp-pos-products");
    let myCartProducts = cartProducts ? JSON.parse(cartProducts) : [];
    const product = products.find((product) => product.id === productId);
    if (product.sales_price === 0 || product.sales_price === null) {
      notifications.show({
        title: t("Error"),
        position: "bottom-right",
        autoClose: 2000,
        withCloseButton: true,
        message: t("Sales price cant be zero"),
        color: "red",
      });
      return;
    }
    let found = false;

    myCartProducts = myCartProducts.map((item) => {
      if (item.product_id === productId) {
        found = true;
        const newQuantity = Math.min(item.quantity + 1);
        return {
          ...item,
          quantity: newQuantity,
          sub_total: newQuantity * item.sales_price,
        };
      }
      return item;
    });

    if (!found) {
      myCartProducts.push({
        product_id: product.id,
        display_name: product.display_name,
        quantity: 1,
        unit_name: product.unit_name,
        purchase_price: Number(product.purchase_price),
        sub_total: Number(product.sales_price),
        sales_price: Number(product.sales_price),
      });
    }

    localStorage.setItem("temp-pos-products", JSON.stringify(myCartProducts));
    setLoadCartProducts(true);
  };
  const handleDecrement = (productId) => {
    const cartProducts = localStorage.getItem("temp-pos-products");
    let myCartProducts = cartProducts ? JSON.parse(cartProducts) : [];

    myCartProducts = myCartProducts
      .map((item) => {
        if (item.product_id === productId) {
          const newQuantity = Math.max(0, item.quantity - 1);
          return {
            ...item,
            quantity: newQuantity,
            sub_total: newQuantity * item.sales_price,
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    localStorage.setItem("temp-pos-products", JSON.stringify(myCartProducts));
    setLoadCartProducts(true);
  };

  const filterProductsbyCategory = (id) => {
    if (id === "230") {
      setId(null);
    } else {
      setId(id);
    }
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
                          filterProductsbyCategory(data.value);
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
                      {products.length > 0 ? (
                        products?.map((product) => (
                          <Grid.Col span={3} key={product.id}>
                            <Card
                              shadow="md"
                              radius="md"
                              padding="xs"
                              styles={(theme) => ({
                                root: {
                                  cursor: "pointer",
                                  transition: "transform 0.5s ease-in-out",
                                  transform: selected.includes(product.id)
                                    ? "scale(0.97)"
                                    : undefined,
                                  border: selected.includes(product.id)
                                    ? "3px solid #00542b"
                                    : "3px solid #eaeced",
                                },
                              })}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelect(product.id);
                                handleIncrement(product.id);
                              }}
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
                        ))
                      ) : (
                        <>
                          <Flex
                            m={"sm"}
                            h={"100%"}
                            w={"100%"}
                            justify="center"
                            align="center"
                          >
                            <Text
                              ta={"center"}
                              fw={"normal"}
                              fz={"md"}
                              c={"black"}
                            >
                              No product found in this category
                            </Text>
                          </Flex>
                        </>
                      )}
                    </Grid>
                  )}
                  {value === "list" && (
                    <Grid columns={12} gutter={8}>
                      {products.length > 0 ? (
                        products?.map((product) => (
                          <Grid.Col key={product.id} span={6}>
                            <Card
                              shadow="md"
                              radius="md"
                              styles={(theme) => ({
                                root: {
                                  cursor: "pointer",
                                  transform: selected.includes(product.id)
                                    ? "scale(0.97)"
                                    : undefined,
                                  border: selected.includes(product.id)
                                    ? "3px solid #00542b"
                                    : "3px solid #eaeced",
                                },
                              })}
                              padding="xs"
                              onClick={() => {
                                handleSelect(product.id);
                                handleIncrement(product.id);
                              }}
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
                        ))
                      ) : (
                        <>
                          <Flex
                            m={"sm"}
                            h={"100%"}
                            w={"100%"}
                            justify="center"
                            align="center"
                          >
                            <Text
                              ta={"center"}
                              fw={"normal"}
                              fz={"md"}
                              c={"black"}
                            >
                              No product found in this category
                            </Text>
                          </Flex>
                        </>
                      )}
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
                                  {tempCartProducts.find(
                                    (item) => item.product_id === data.id
                                  )?.quantity ?? 0}
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
        </Grid.Col>
        <Grid.Col span={9}>
          <Invoice
            enableTable={enableTable}
            loadCartProducts={loadCartProducts}
            setLoadCartProducts={setLoadCartProducts}
            products={products}
          />
        </Grid.Col>
      </Grid>
    </>
  );
}
