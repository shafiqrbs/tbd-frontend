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
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import tableCss from "./Table.module.css";
import classes from "./Sales.module.css";
import { IconChefHat } from "@tabler/icons-react";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { SalesPrintPos } from "../print/pos/SalesPrintPos";
export default function Sales() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190; //TabList height 104
  const heightHalf = height / 2;

  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { configData } = getConfigData();
  const [printPos, setPrintPos] = useState(false);

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
  const [profitShow, setProfitShow] = useState(false);
  const [tableData, setTableData] = useState([
    { id: 1, name: "Spaghetti Bolognese", qty: 10, price: 1000 },
    { id: 2, name: "Fettuccine Alfredo", qty: 8, price: 1200 },
    { id: 3, name: "Fettuccine Lalamero", qty: 8, price: 1200 },
    { id: 4, name: "Gigichano Alfredo", qty: 8, price: 1200 },
    { id: 5, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 6, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 7, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 8, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 9, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 10, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 11, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 12, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 13, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 14, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 15, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 16, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 17, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 18, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 19, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
    { id: 20, name: "Fettuccine Alfredo Kepukano", qty: 8, price: 1200 },
  ]);
  const [checked, setChecked] = useState(false);

  const [id, setId] = useState(null);
  const clicked = (id) => {
    setId(id);
  };

  const handleIncrement = (id) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id && item.qty > 0 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };
  const handleDelete = (id) => {
    setTableData((prevData) => prevData.filter((item) => item.id !== id));
  };
  const calculateSubtotal = (data) => {
    return data.reduce((total, item) => total + item.price * item.qty, 0);
  };
  const subtotal = calculateSubtotal(tableData);

  // Demo
  const price = 1000;

  const paymentPartners = [
    {
      id: 1,
      name: "Bkash",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 2,
      name: "Nogod",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 3,
      name: "MTB",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 4,
      name: "Google Pay",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 5,
      name: "Wise",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 6,
      name: "SCB",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 7,
      name: "Brac Bank",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 8,
      name: "Trust Bank",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
    {
      id: 9,
      name: "Sonali bank",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    },
  ];

  return (
    <>
      <Box w={"100%"} h={height + 191} className={classes["box-white"]}>
        <Box pl={10} m={0} pr={10}>
          <Group
            preventGrowOverflow={false}
            grow
            align="flex-start"
            wrap="nowrap"
            gap={10}
            mb={8}
          >
            <Select
              pt={10}
              placeholder={t("SalesBy")}
              data={["Rafi", "Foysal", "Mahmud", "Hasan"]}
              clearable
              searchable
              value={value}
              onChange={setValue}
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
                    }}
                  />
                ) : (
                  <IconChevronDown
                    style={{ width: rem(16), height: rem(16) }}
                  />
                )
              }
            />
          </Group>
          <Box>
            <ScrollArea h={heightHalf + 66} type="never" scrollbars="y">
              <Paper
                p="8"
                radius="4"
                style={{ backgroundColor: checked ? "#4CAF50" : "#E8F5E9" }}
              >
                <Grid align="center">
                  <Grid.Col span={11}>
                    <Text weight={500} c={checked ? "white" : "black"}>
                      {t("SelectedItems")}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}></Grid.Col>
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
                  records={tableData}
                  columns={[
                    {
                      accessor: "name",
                      title: t("Product"),
                      footer: <div>Sub Total -</div>,
                    },
                    {
                      accessor: "qty",
                      title: t("Qty"),
                      textAlign: "left",

                      render: (data) => (
                        <Group w={120} gap={8} justify="left">
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
                            {data.qty}
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
                    {
                      accessor: "price",
                      title: t("Price"),
                      textAlign: "center",
                      render: (data) => (
                        <>
                          {configData?.currency?.symbol} {data.price}
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
                            onClick={() => handleDelete(data.id)}
                          >
                            <IconTrash height={20} width={20} stroke={1.5} />
                          </ActionIcon>
                        </Group>
                      ),
                      footer: (
                        <Group gap="0">
                          <Box mb={-4}>
                            <IconSum size="14" />
                          </Box>
                          <div>{subtotal}</div>
                        </Group>
                      ),
                    },
                  ]}
                  loaderSize="xs"
                  loaderColor="grape"
                  height={396}
                  // backgroundColor={'black'}
                  scrollAreaProps={{ type: "never" }}
                />
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
                            {configData?.currency?.symbol} {price}
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
                            {configData?.currency?.symbol} {price}
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
                            {configData?.currency?.symbol} {price}
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
                            {configData?.currency?.symbol} {price}
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
                          console.log("Clicked on method -", mode.id),
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
                            h={"60%"}
                            w={"60%"}
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
                        <Checkbox color="lime" size="lg" onClick={""} />
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
            <Grid columns={12} gutter={{ base: 2 }} pl={"8"} pr={"8"}>
              <Grid.Col span={2}>
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
                    // leftSection={<IconPrinter />}
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
