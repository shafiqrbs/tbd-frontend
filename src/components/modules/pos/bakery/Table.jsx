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
} from "@tabler/icons-react";
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
import { useDispatch, useSelector } from "react-redux";
import classes from "./Table.module.css";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { DataTable } from "mantine-datatable";
import tableCss from "./Table.module.css";

export default function Table(props) {
  const { quantities, setQuantities, products, enableTable, categoryDropdown } =
    props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);

  const [tc, setTc] = useState("#333333");
  const [bg, setBg] = useState("#E6F5ED");
  const [selected, setSelected] = useState([]);
  const [grid, setGrid] = useState(null);

  const { configData } = getConfigData();

  // console.log(configData)
  const handleSelect = (productId) => {
    setSelected((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  //get products
  const perPage = 50;
  const [page, setPage] = useState(1);
  const productFilterData = useSelector(
    (state) => state.inventoryCrudSlice.productFilterData
  );
  const [indexData, setIndexData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: "inventory/product",
        param: {
          term: searchKeyword,
          name: productFilterData.name,
          alternative_name: productFilterData.alternative_name,
          sku: productFilterData.sku,
          sales_price: productFilterData.sales_price,
          page: page,
          offset: perPage,
          type: "product",
        },
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
          setFetching(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [
    // dispatch,
    // searchKeyword,
    productFilterData,
    // page,
    // perPage,
    // fetchingReload,
  ]);
  // console.log(indexData);
  const handleIncrement = (productId) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      if (!updatedQuantities[productId]) {
        updatedQuantities[productId] = {
          id: productId,
          quantity: 0,
          name:
            products.find((product) => product.id === productId)?.name || "",
          price:
            products.find((product) => product.id === productId)?.price || 0,
        };
      }

      updatedQuantities[productId].quantity += 1;

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

  const calculateSubtotal = (data) => {
    return data.reduce((total, item) => total + item.price * item.qty, 0);
  };
  const subtotal = calculateSubtotal(products);

  return (
    <>
      <Grid columns={12} gutter={{ base: 8 }}>
        <Grid.Col span={2}>
          <Box bg="white" w={"100%"} mt={8} style={{ borderRadius: 4 }}>
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
                    key={data.id}
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
            <Grid columns={16} gutter={{ base: 4 }} grow align="center" mt={6}>
              <Grid.Col span={12}>
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
                  {products.map((product) => (
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
                          h={120}
                          w="auto"
                          fit="cover"
                          src={product.img}
                          alt={product.name}
                        />
                        <Text fw={600} size="sm" fz={"13"} mt={"4"} ta={"left"}>
                          {product.name}
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
                          {configData?.currency?.symbol} {product.price}
                        </Text>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              )}
              {value === "list" && (
                <Grid columns={12} gutter={8}>
                  {products.map((product) => (
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
                                fit="cover"
                                src={product.img}
                                alt={product.name}
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
                                {product.name}
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
                                  {configData?.currency?.symbol} {product.price}
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
                    records={indexData.data}
                    columns={[
                      {
                        accessor: "id",
                        title: "S/N",
                        render: (data, index) => index + 1,
                      },
                      {
                        accessor: "product_name",
                        title: t("Product"),
                      },
                      {
                        accessor: "price",
                        title: t("Price"),
                        textAlign: "center",
                        render: (data) => (
                          <>
                            {configData?.currency?.symbol} {data.purchase_price}
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
