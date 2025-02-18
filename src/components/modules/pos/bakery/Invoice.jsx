import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  ActionIcon,
  Text,
  Menu,
  rem,
  TextInput,
  Center,
  Button,
  Grid,
  Flex,
  ScrollArea,
  Divider,
  Image,
  Select,
  SimpleGrid,
  Tooltip,
  Checkbox,
  Paper,
  Switch,
  Stack,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconChevronRight,
  IconChevronLeft,
  IconCheck,
  IconSearch,
  IconChevronDown,
  IconX,
  IconPlus,
  IconMinus,
  IconTrash,
  IconSum,
  IconUserFilled,
  IconPrinter,
  IconDeviceFloppy,
  IconAlertCircle,
  IconHandStop,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import tableCss from "./Table.module.css";
import classes from "./Sales.module.css";
import { IconChefHat } from "@tabler/icons-react";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { SalesPrintPos } from "../print/pos/SalesPrintPos";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
export default function Invoice(props) {
  const { setLoadCartProducts, loadCartProducts, products, enableTable } =
    props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104
  const heightHalf = height / 2;
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { configData } = getConfigData();
  const [printPos, setPrintPos] = useState(false);

  const [tempCartProducts, setTempCartProducts] = useState([]);
  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-pos-products");
    setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCartProducts(false);
  }, [loadCartProducts]);

  /*START GET SALES BY / USERS DROPDOWN FROM LOCAL STORAGE*/
  const [salesByUser, setSalesByUser] = useState(null);
  const [salesByDropdownData, setSalesByDropdownData] = useState([]);
  useEffect(() => {
    let coreUsers = localStorage.getItem("core-users")
      ? JSON.parse(localStorage.getItem("core-users"))
      : [];
    if (coreUsers && coreUsers.length > 0) {
      const transformedData = coreUsers.map((type) => {
        return {
          label: type.username + " - " + type.email,
          value: String(type.id),
        };
      });
      setSalesByDropdownData(transformedData);
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };
  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const transactionModeData = JSON.parse(
    localStorage.getItem("accounting-transaction-mode")
  )
    ? JSON.parse(localStorage.getItem("accounting-transaction-mode"))
    : [];

  const form = useForm({
    initialValues: {
      transaction_mode_id: null,
      user_id: null,
    },
    validate: {
      transaction_mode_id: (value) =>
        !value ? t("Please select transaction mode") : null,
      user_id: (value) => (!value ? true : null),
      // items: (value) =>
      //   filteredProducts.length === 0
      //     ? t("Please add at least one product")
      //     : null,
    },
  });
  const [errors, setErrors] = useState({
    products: false,
    user_id: false,
    transaction_mode: false,
  });
  const validateForm = () => {
    const newErrors = {
      user_id: !salesByUser,
      transaction_mode: !id,
    };

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some((error) => error);
  };
  useEffect(() => {
    if (transactionModeData && transactionModeData.length > 0) {
      for (let mode of transactionModeData) {
        if (mode.is_selected) {
          form.setFieldValue(
            "transaction_mode_id",
            form.values.transaction_mode_id
              ? form.values.transaction_mode_id
              : mode.id
          );
          break;
        }
      }
    }
  }, [transactionModeData]);

  const [checked, setChecked] = useState(false);

  const [id, setId] = useState(null);
  const clicked = (id) => {
    setId(id);
    form.setFieldValue("transaction_mode_id", id);
  };

  const handleDelete = (productId) => {
    const cartProducts = localStorage.getItem("temp-pos-products");
    let myCartProducts = cartProducts ? JSON.parse(cartProducts) : [];

    myCartProducts = myCartProducts.filter(
      (item) => item.product_id !== productId
    );

    localStorage.setItem("temp-pos-products", JSON.stringify(myCartProducts));
    setLoadCartProducts(true);
  };
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

  const vat = 5;
  const sd = 5;
  const discount = 5;

  const data = [
    { id: 1, name: "T-1" },
    { id: 2, name: "T-2" },
    { id: 3, name: "T-3" },
    { id: 4, name: "T-4" },
    { id: 5, name: "T-5" },
    { id: 6, name: "T-6" },
    { id: 7, name: "T-7" },
    { id: 8, name: "T-8" },
    { id: 9, name: "T-9" },
    { id: 10, name: "T-10" },
    { id: 11, name: "T-11" },
    { id: 12, name: "T-12" },
    { id: 13, name: "T-13" },
    { id: 14, name: "T-14" },
    { id: 15, name: "T-15" },
  ];
  const handleSubmit = () => {
    if (tempCartProducts.length === 0) {
      notifications.show({
        title: t("ValidationError"),
        position: "top-right",
        autoClose: 1000,
        withCloseButton: true,
        message: t("Add at least one product"),
        color: "red",
      });
      return;
    }
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    const formValue = {};
    formValue.user_id = salesByUser;
    formValue.transaction_mode_id = id;
    enableTable
      ? (formValue.sales_type = "restaurant")
      : (formValue.sales_type = "bakery");
    let transformedArray = tempCartProducts.map((product) => {
      return {
        product_id: product.id,
        quantity: product.quantity,
        purchase_price: product.purchase_price,
        sales_price: product.sales_price,
        sub_total: product.sub_total,
      };
    });
    formValue["items"] = transformedArray ? transformedArray : [];
    localStorage.removeItem("temp-pos-products")
    setLoadCartProducts(true);
    setSalesByUser(null)
    setId(null)
    form.reset()
    console.log(formValue);
  };

  const handleIncrement = (productId) => {
    const cartProducts = localStorage.getItem("temp-pos-products");
    let myCartProducts = cartProducts ? JSON.parse(cartProducts) : [];
    const product = products.find((product) => product.id === productId);

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
  // let subtotal = 0;
  // const findSubtotal = () =>
  //   tempCartProducts.map((item) => {
  //     subtotal += item.sub_total;
  //   });
  // findSubtotal();

  const subtotal = tempCartProducts.reduce(
    (acc, item) => acc + item.sub_total,
    0
  );

  return (
    <>
      <Box
        w={"100%"}
        h={enableTable ? height + 73 : height + 191}
        className={classes["box-white"]}
      >
        <Box pl={10} m={0} pr={10}>
          <Group
            gap={10}
            mb={8}
            preventGrowOverflow={false}
            grow
            align="flex-start"
            wrap="nowrap"
          >
            <Tooltip
              label={t("SalesBy")}
              opened={!!form.errors.user_id}
              px={16}
              py={2}
              position="top-end"
              bg={`red.4`}
              c={"white"}
              withArrow
              offset={2}
              zIndex={999}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Select
                pt={10}
                placeholder={enableTable ? t("OrderTakenBy") : t("SalesBy")}
                data={salesByDropdownData}
                value={form.values.user_id}
                error={form.errors.user_id}
                onChange={(value) => {
                  form.setFieldValue("user_id", value);
                  setSalesByUser(value);
                }}
                clearable
                searchable
                nothingFoundMessage="Nothing found..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                rightSection={
                  value || searchValue ? (
                    <IconX
                      style={{
                        width: rem(16),
                        height: rem(16),
                        cursor: "pointer",
                      }}
                      onMouseDown={() => {
                        setValue("");
                        form.setFieldValue("user_id", null);
                      }}
                    />
                  ) : (
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  )
                }
              />
            </Tooltip>

            {enableTable && (
              <Button
                radius="md"
                size="sm"
                color="green"
                mt={10}
                miw={122}
                maw={122}
                leftSection={<IconChefHat height={18} width={18} stroke={2} />}
              >
                <Text fw={600} size="sm">
                  {t("Kitchen")}
                </Text>
              </Button>
            )}
          </Group>
          <Box>
            <ScrollArea
              h={enableTable ? heightHalf - 48 : heightHalf + 66}
              type="never"
              scrollbars="y"
            >
              <Paper
                p="8"
                radius="4"
                style={{ backgroundColor: checked ? "#4CAF50" : "#E8F5E9" }}
              >
                <Grid align="center">
                  <Grid.Col span={11}>
                    <Text weight={500} c={checked ? "white" : "black"}>
                      {enableTable
                        ? t("SelectAdditionalTable")
                        : t("SelectedItems")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    {enableTable && (
                      <Checkbox
                        checked={checked}
                        color="green.8"
                        onChange={(event) =>
                          setChecked(event.currentTarget.checked)
                        }
                        styles={(theme) => ({
                          input: {
                            borderColor: "white",
                          },
                        })}
                      />
                    )}
                  </Grid.Col>
                </Grid>
              </Paper>

              {checked && (
                <Paper p="md" radius="md" bg={"#E6F5ED99"}>
                  <Grid columns={15} gutter="md">
                    {data.map((item) => (
                      <Grid.Col span={3} key={item.id}>
                        <Checkbox
                          label={item.name}
                          color="green.8"
                          styles={(theme) => ({
                            input: {
                              border: "1.5px solid #767676",
                            },
                            label: {
                              color: "#333333",
                            },
                          })}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </Paper>
              )}
              <Box>
                <DataTable
                  classNames={{
                    root: tableCss.root,
                    table: tableCss.table,
                    header: tableCss.header,
                    footer: tableCss.footer,
                    pagination: tableCss.pagination,
                  }}
                  records={tempCartProducts}
                  columns={[
                    {
                      accessor: "id",
                      title: "S/N",
                      render: (data, index) => index + 1,
                      // footer: (
                      //   <>
                      //     <Text
                      //       fw={"bold"}
                      //       fz={"xs"}
                      //       pos="absolute"
                      //       style={{ top: 10, left: 10, zIndex: 1000 }}
                      //     >
                      //       {t("SubTotal")}
                      //     </Text>
                      //   </>
                      // ),
                    },
                    {
                      accessor: "display_name",
                      title: t("Product"),
                    },
                    {
                      accessor: "quantity",
                      title: t("Qty"),
                      textAlign: "center",
                      render: (data) => (
                        <>
                          <Group gap={8} justify="center" >
                            <ActionIcon
                              size={"sm"}
                              bg={"#596972"}
                              onClick={() => handleDecrement(data.product_id)}
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
                              {data.quantity}
                            </Text>
                            <ActionIcon
                              size={"sm"}
                              bg={"#596972"}
                              onClick={() => handleIncrement(data.product_id)}
                            >
                              <IconPlus height={"12"} width={"12"} />
                            </ActionIcon>
                          </Group>
                        </>
                      ),
                    },
                    {
                      accessor: "price",
                      title: t("Price"),
                      textAlign: "center",
                      render: (data) => (
                        <>
                          {configData?.currency?.symbol} {data.sales_price}
                        </>
                      ),
                    },
                    {
                      accessor: "subtotal",
                      title: "Subtotal",
                      textAlign: "center",
                      render: (data) => (
                        <>
                          {configData?.currency?.symbol}{" "}
                          {data.sub_total.toFixed(2)}
                        </>
                      ),
                    },
                    {
                      accessor: "action",
                      title: t(""),
                      textAlign: "right",
                      render: (data) => (
                        <Group justify="right" wrap="nowrap">
                          <ActionIcon
                            size="sm"
                            variant="white"
                            color="#FF0000"
                            aria-label="Settings"
                            onClick={() => handleDelete(data.product_id)}
                          >
                            <IconTrash height={20} width={20} stroke={1.5} />
                          </ActionIcon>
                        </Group>
                      ),
                      // footer: (
                      //   <Group
                      //     gap="10"
                      //     pos="absolute"
                      //     style={{ top: 10, right: 10, zIndex: 1000 }}
                      //   >
                      //     <Box mb={-4}>
                      //       <IconSum size="16" />
                      //     </Box>
                      //     <Box>
                      //       <Text fw={"bold"} fz={"sm"}>
                      //         {configData?.currency?.symbol}{" "}
                      //         {subtotal.toFixed(2)}
                      //       </Text>
                      //     </Box>
                      //   </Group>
                      // ),
                    },
                  ]}
                  loaderSize="xs"
                  loaderColor="grape"
                  height={enableTable ? 196 : 310}
                  // backgroundColor={'black'}
                  scrollAreaProps={{ type: "never" }}
                />
                <Group
                  justify="space-between"
                  align="center"
                  pt={4}
                  style={{
                    borderTop: "1px solid #dee2e6", 
                  }}
                >
                  <Text fw={"bold"} fz={"sm"} c={"black"} pl={"10"}>
                    {t("SubTotal")}
                  </Text>
                  <Group gap="10" pr={"sm"} align="center">
                    <Box mt={4}>
                      <IconSum  size="16" style={{ color: "black" }} />
                    </Box>
                    <Box>
                      <Text fw={"bold"} fz={"sm"} c={"black"}>
                        {configData?.currency?.symbol} {subtotal.toFixed(2)}
                      </Text>
                    </Box>
                  </Group>
                </Group>
              </Box>
            </ScrollArea>
          </Box>
          <Box
            className={classes["box-border"]}
            h={heightHalf + 52}
            pl={4}
            pr={4}
            pb={4}
            pt={2}
            mt={6}
          >
            <Box>
              <Flex
                h={heightHalf - 142}
                direction={"column"}
                w={"100%"}
                justify={"center"}
                gap={0}
                pl={4}
                pr={4}
                mb={8}
              >
                <TextInput
                  pb={4}
                  size={"sm"}
                  w={"100%"}
                  pt={"xs"}
                  onChange={(e) => {
                    e.preventDefault();
                    setCustomerMobile(e.currentTarget.value);
                    console.log(customerMobile);
                  }}
                  placeholder={t("CustomerMobileNumber")}
                  leftSection={<IconSearch height={18} width={18} stroke={2} />}
                  rightSection={
                    <IconUserFilled height={18} width={18} stroke={2} />
                  }
                ></TextInput>
                <Box className={classes["box-white"]} p={"4"} w={"100%"}>
                  <Grid columns={12} gutter={0} pt={4} pl={12} pr={12}>
                    <Grid.Col span={6}>
                      <Grid columns={12} gutter={0}>
                        <Grid.Col span={2}>
                          <Text fw={500} c={"#333333"}>
                            {t("VAT")}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                          <Text fw={800} c={"#333333"}>
                            {configData?.currency?.symbol} 0
                          </Text>
                        </Grid.Col>
                      </Grid>
                      <Grid columns={12} gutter={0} pt={0}>
                        <Grid.Col span={2}>
                          <Text fw={500} c={"#333333"}>
                            {t("SD")}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                          <Text fw={800} c={"#333333"}>
                            {configData?.currency?.symbol} 0
                          </Text>
                        </Grid.Col>
                      </Grid>
                      <Grid columns={12} gutter={0} pt={0}>
                        <Grid.Col span={2}>
                          <Text fw={500} c={"#333333"}>
                            {t("DIS.")}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                          <Text fw={800} c={"#333333"}>
                            {configData?.currency?.symbol} 0
                          </Text>
                        </Grid.Col>
                      </Grid>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box className={classes["box-border"]} p={6}>
                        <Flex
                          direction={"column"}
                          justify={"center"}
                          align={"center"}
                          h={"100%"}
                          p={2}
                        >
                          <Text fw={500} c={"#333333"} size={"md"}>
                            {t("Total")}
                          </Text>
                          <Text fw={800} c={"#00542B"} size={"lg"}>
                            {configData?.currency?.symbol} {subtotal.toFixed(2)}
                          </Text>
                        </Flex>
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Box>
              </Flex>
            </Box>
            <Box className={classes["box-white"]} ml={4} mr={4}>
              <Box style={{ position: "relative" }}>
                <ScrollArea
                  type="never"
                  pl={"sm"}
                  pr={"sm"}
                  viewportRef={scrollRef}
                  onScrollPositionChange={handleScroll}
                  style={{
                    borderRadius: 4,
                    border:
                      form.errors.transaction_mode_id && !id
                        ? "1px solid red"
                        : "none",
                  }}
                >
                  <Tooltip
                    label={t("TransactionMode")}
                    opened={!!form.errors.transaction_mode_id}
                    px={16}
                    py={2}
                    position="top-end"
                    bg={`red.4`}
                    c={"white"}
                    withArrow
                    offset={{ mainAxis: 5, crossAxis: 12 }}
                    zIndex={999}
                    transitionProps={{
                      transition: "pop-bottom-left",
                      duration: 500,
                    }}
                  >
                    <Group
                      m={0}
                      p={0}
                      justify="flex-start"
                      align="flex-start"
                      gap="0"
                      wrap="nowrap"
                    >
                      {transactionModeData.map((mode, index) => (
                        <Box
                          onClick={() => {
                            // console.log("Clicked on method -", mode.id),
                            clicked(mode.id);
                          }}
                          key={index}
                          p={4}
                          style={{
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          <Flex
                            bg={mode.id === id ? "#E6F5ED" : "white"}
                            direction="column"
                            align="center"
                            justify="center"
                            p={4}
                            style={{
                              width: "100px",
                              borderRadius: "8px",
                            }}
                          >
                            <Image
                              mih={"60%"}
                              miw={"60%"}
                              mah={"60%"}
                              maw={"60%"}
                              fit="contain"
                              src={
                                isOnline
                                  ? mode.path
                                  : "/images/transaction-mode-offline.jpg"
                              }
                              alt={mode.method_name}
                            ></Image>
                            <Text pt={"4"} c={"#333333"} fw={500}>
                              {mode.name}
                            </Text>
                          </Flex>
                        </Box>
                      ))}
                    </Group>
                  </Tooltip>
                </ScrollArea>
                {showLeftArrow && (
                  <ActionIcon
                    variant="filled"
                    color="#EAECED"
                    radius="xl"
                    size="lg"
                    h={24}
                    w={24}
                    style={{
                      position: "absolute",
                      left: 5,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    onClick={() => scroll("left")}
                  >
                    <IconChevronLeft
                      height={18}
                      width={18}
                      stroke={2}
                      color="#30444F"
                    />
                  </ActionIcon>
                )}
                {showRightArrow && (
                  <ActionIcon
                    variant="filled"
                    color="#EAECED"
                    radius="xl"
                    size="lg"
                    h={24}
                    w={24}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    onClick={() => scroll("right")}
                  >
                    <IconChevronRight
                      height={18}
                      width={18}
                      stroke={2}
                      color="#30444F"
                    />
                  </ActionIcon>
                )}
              </Box>
            </Box>
            <Box m={8}>
              <Group
                justify="center"
                grow
                gap={"xs"}
                preventGrowOverflow={true}
              >
                <Box className={classes["box-green"]}>
                  <Grid columns={12} gutter={0}>
                    <Grid.Col span={4}>
                      <Flex h={40} justify={"center"} align={"center"}>
                        <Checkbox
                          color="lime"
                          size="lg"
                          onChange={(event) => {
                            console.log(
                              "Checkbox clicked:",
                              event.currentTarget.checked
                            );
                          }}
                        />
                      </Flex>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <Flex h={40} justify={"center"} align={"center"}>
                        <Text>{t("Flat")}</Text>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </Box>
                <TextInput
                  type="number"
                  placeholder="0"
                  size={rem(40)}
                  classNames={{ input: classes.input }}
                />
                <TextInput
                  type="number"
                  placeholder="0"
                  size={rem(40)}
                  classNames={{ input: classes.input }}
                />
              </Group>
            </Box>
            <Grid columns={18} gutter={{ base: 2 }} pl={"8"} pr={"8"}>
            <Grid.Col span={4}>
                <Tooltip
                  label={t("PrintAll")}
                  px={16}
                  py={2}
                  position="top-end"
                  color="red"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 2000,
                  }}
                >
                  <Button
                    bg={"green.5"}
                    size={"sm"}
                    fullWidth={true}
                    leftSection={<IconPrinter />}
                  >
                    {t("Print All")}
                  </Button>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={4}>
                <Tooltip
                  label={t("Hold")}
                  px={16}
                  py={2}
                  position="top-end"
                  color="red"
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 2000,
                  }}
                >
                  <Button
                    bg={"red.5"}
                    size={"sm"}
                    fullWidth={true}
                    leftSection={<IconHandStop />}
                  >
                    {t("Hold")}
                  </Button>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={5}>
                <Button
                  bg={"#30444F"}
                  size={"sm"}
                  fullWidth={true}
                  leftSection={<IconPrinter />}
                  onClick={() => {
                    setPrintPos(true);
                  }}
                >
                  {t("POS Print")}
                </Button>
              </Grid.Col>
              <Grid.Col span={5}>
                <Button
                  size={"sm"}
                  bg={"#00994f"}
                  fullWidth={true}
                  leftSection={<IconDeviceFloppy />}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {t("Save")}
                </Button>
              </Grid.Col>
            </Grid>
            {/* <Group
              grow
              gap={"xs"}
              p={8}
              mb={"0"}
              pt={6}
              style={{ borderTop: "#c0c0c0 solid 2px" }}
              className="divider"
            >
              <Button
                bg={"red.5"}
                size={"sm"}
                leftSection={<IconPrinter />}
              >
                {t("Hold")}
              </Button>
              <Button
                bg={"#30444F"}
                size={"sm"}
                fullWidth={true}
                leftSection={<IconPrinter />}
              >
                {t("POS Print")}
              </Button>
              <Button
                size={"sm"}
                bg={"#00994f"}
                fullWidth={true}
                leftSection={<IconDeviceFloppy />}
              >
                {t("Save")}
              </Button>
            </Group> */}
            {printPos && (
              <div style={{ display: "none" }}>
                <SalesPrintPos setPrintPos={setPrintPos} />
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
