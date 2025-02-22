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
import classes from "./Invoice.module.css";
import { IconChefHat } from "@tabler/icons-react";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { SalesPrintPos } from "../print/pos/SalesPrintPos";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCartOperations } from "./utils/CartOperations";
import { TransformProduct } from "./utils/TransformProduct";
export default function Invoice(props) {
  const {
    setLoadCartProducts,
    loadCartProducts,
    products,
    enableTable,
    tables,
    tableId,
    setTableId,
    setTables,
    handleSubmitOrder, // New function passed from parent
  } = props;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190;
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

  // Sales by user state management remains the same
  const [salesByUser, setSalesByUser] = useState(null);
  const [salesByUserName, setSalesByUserName] = useState(null);
  const [salesByDropdownData, setSalesByDropdownData] = useState([]);

  // Track additional tables per selected table
  const [additionalTableSelections, setAdditionalTableSelections] = useState(
    {}
  );
  const [checked, setChecked] = useState(false);

  const [id, setId] = useState(null);

  const [posData, setPosData] = useState(null);

  useEffect(() => {
    if (enableTable && tableId) {
      const tableCartKey = `table-${tableId}-pos-products`;
      const tempProducts = localStorage.getItem(tableCartKey);
      setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);
    } else {
      const tempProducts = localStorage.getItem("temp-pos-products");
      setTempCartProducts(tempProducts ? JSON.parse(tempProducts) : []);
    }
    setLoadCartProducts(false);
  }, [loadCartProducts, tableId, enableTable]);

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

  // Scroll handling remains the same
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
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Form and validation remains the same
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
    },
  });

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

  const clicked = (id) => {
    setId(id);
    form.setFieldValue("transaction_mode_id", id);
  };

  const { handleIncrement, handleDecrement, handleDelete } = useCartOperations({
    enableTable,
    tableId,
    products,
    setLoadCartProducts,
  });

  const subtotal = tempCartProducts.reduce(
    (acc, item) => acc + item.sub_total,
    0
  );

  // Initialize or update selections when table changes
  useEffect(() => {
    if (tableId && !additionalTableSelections[tableId]) {
      setAdditionalTableSelections((prev) => ({
        ...prev,
        [tableId]: new Set(),
      }));
    }
  }, [tableId]);

  const handleAdditionalTableCheck = (checkedTableId) => {
    if (!tableId) return;

    setAdditionalTableSelections((prev) => {
      const currentSelections = new Set(prev[tableId] || []);

      if (currentSelections.has(checkedTableId)) {
        currentSelections.delete(checkedTableId);
      } else {
        currentSelections.add(checkedTableId);
      }

      return {
        ...prev,
        [tableId]: currentSelections,
      };
    });
  };

  // Modified to use the parent handleSubmitOrder function
  const handlePrintAll = () => {
    if (tempCartProducts.length === 0) {
      notifications.show({
        title: t("ValidationError"),
        position: "bottom-right",
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

    let transformedArray = TransformProduct(tempCartProducts);

    formValue["items"] = transformedArray ? transformedArray : [];

    if (enableTable && tableId) {
      // Get the selected table
      const selectedTable = tables.find((t) => t.id === tableId);

      // Calculate elapsed time
      let elapsedTime = "00:00:00";
      if (selectedTable && selectedTable.statusStartTime) {
        const elapsedSeconds = Math.floor(
          (new Date() - new Date(selectedTable.statusStartTime)) / 1000
        );
        const hours = Math.floor(elapsedSeconds / 3600)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((elapsedSeconds % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
        elapsedTime = `${hours}:${minutes}:${seconds}`;
      }

      const tableData = {
        mainTable: {
          id: tableId,
          status: selectedTable?.status || "Unknown",
          status_change_time: selectedTable?.statusStartTime || "N/A",
          elapsed_time: elapsedTime,
        },
        additionalTables: Array.from(additionalTableSelections[tableId] || []),
      };
      formValue["table_data"] = tableData;
    }

    // console.log("Print All Data:", formValue);

    // Call the parent function to handle order submission
    handleSubmitOrder();

    // Reset form and UI state
    setSalesByUser(null);
    setId(null);

    if (enableTable) {
      setAdditionalTableSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[tableId];
        return newSelections;
      });
      setChecked(false);
    }

    form.reset();
  };
  const printItem = () => {
    const formValue = {};
    let transformedArray = TransformProduct(tempCartProducts);
    formValue["items"] = transformedArray ? transformedArray : [];
    console.log(formValue);
  };
  if (!localStorage.getItem("temp-requistion-invoice")) {
    localStorage.setItem("temp-requistion-invoice", JSON.stringify([]));
  }

  function tempLocalPosInvoice(addInvoice) {
    const existingInvoices = localStorage.getItem("temp-pos-invoice");
    const invoices = existingInvoices ? JSON.parse(existingInvoices) : [];
    localStorage.setItem("temp-pos-print", JSON.stringify(addInvoice));
    invoices.push(addInvoice);
    localStorage.setItem("temp-pos-invoice", JSON.stringify(invoices));
  }

  const posPrint = () => {
    // Validate cart has products
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

    // Form validation
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    // Prepare base form value
    const formValue = {
      invoice_id: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
      invoice_date: new Date().toLocaleDateString("en-CA"),
      invoice_time: new Date().toLocaleTimeString("en-CA"),
      user_id: salesByUser,
      transaction_mode_id: id,
      createdByName: salesByUserName.label,
      grand_total: subtotal,
      sales_type: enableTable ? "restaurant" : "bakery",
    };

    // Transform cart products
    let transformedArray = TransformProduct(tempCartProducts);

    formValue.items = transformedArray || [];

    // Handle table-specific details if enabled
    if (enableTable && tableId) {
      const selectedTable = tables.find((t) => t.id === tableId);

      // Calculate current status elapsed time
      const currentTime = new Date();
      let statusHistory = [...(selectedTable.statusHistory || [])];

      if (
        selectedTable.currentStatusStartTime &&
        selectedTable.status !== "Free"
      ) {
        const currentElapsed =
          currentTime - new Date(selectedTable.currentStatusStartTime);
        statusHistory.push({
          status: selectedTable.status,
          startTime: selectedTable.currentStatusStartTime,
          endTime: currentTime,
          elapsedTime: currentElapsed,
        });
      }

      // Format status history for display
      const formattedStatusHistory = statusHistory.map((entry) => {
        const elapsedSeconds = Math.floor(entry.elapsedTime / 1000);
        const hours = Math.floor(elapsedSeconds / 3600)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((elapsedSeconds % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

        return {
          status: entry.status,
          elapsed_time: `${hours}:${minutes}:${seconds}`,
          start_time: new Date(entry.startTime).toISOString(),
          end_time: new Date(entry.endTime).toISOString(),
        };
      });

      // Calculate total elapsed time
      const totalElapsedMs = statusHistory.reduce(
        (total, entry) => total + entry.elapsedTime,
        0
      );
      const totalSeconds = Math.floor(totalElapsedMs / 1000);
      const totalHours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const totalSecondsRemainder = (totalSeconds % 60)
        .toString()
        .padStart(2, "0");

      // Prepare table data
      const tableData = {
        mainTable: {
          id: tableId,
          status: selectedTable.status,
          status_change_history: formattedStatusHistory,
          total_elapsed_time: `${totalHours}:${totalMinutes}:${totalSecondsRemainder}`,
        },
        additionalTables: Array.from(additionalTableSelections[tableId] || []),
      };

      formValue.table_data = tableData;
    }

    // Process the print request
    console.log("Print Data:", formValue);
    tempLocalPosInvoice(formValue);
    setPosData(formValue);
    handleSubmitOrder();

    // Reset form and selections
    setSalesByUser(null);
    setSalesByUserName(null);
    setId(null);

    if (enableTable) {
      setAdditionalTableSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[tableId];
        return newSelections;
      });
      setChecked(false);
    }

    form.reset();
    setPrintPos(true);
  };

  return (
    <>
      <Box
        w={"100%"}
        pl={10}
        m={0}
        pr={10}
        h={enableTable ? height + 82 : height + 195}
        className={classes["box-white"]}
      >
        <Group
          gap={10}
          mb={4}
          preventGrowOverflow={false}
          grow
          align="flex-start"
          wrap="nowrap"
        >
          <Tooltip
            label={t("SalesBy")}
            opened={!!form.errors.user_id}
            bg={"orange.8"}
            c={"white"}
            withArrow
            px={16}
            py={2}
            offset={2}
            zIndex={999}
            position="top-end"
            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
          >
            <Select
              pt={8}
              placeholder={enableTable ? t("OrderTakenBy") : t("SalesBy")}
              data={salesByDropdownData}
              value={form.values.user_id}
              error={form.errors.user_id}
              onChange={(value) => {
                form.setFieldValue("user_id", value);
                const selectedUser = salesByDropdownData.find(
                  (user) => user.value === value
                );
                setSalesByUser(value);
                setSalesByUserName(selectedUser);
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
              disabled={tempCartProducts.length === 0}
              radius="md"
              size="sm"
              color="green"
              mt={8}
              miw={122}
              maw={122}
              leftSection={<IconChefHat height={18} width={18} stroke={2} />}
              onClick={printItem}
            >
              <Text fw={600} size="sm">
                {t("Kitchen")}
              </Text>
            </Button>
          )}
        </Group>
        <Box h={enableTable ? heightHalf + 6 : heightHalf + 117}>
          <Paper
            p="4"
            radius="4"
            style={{ backgroundColor: checked ? "#4CAF50" : "#E8F5E9" }}
          >
            <Grid align="center">
              <Grid.Col span={11}>
                <Text weight={500} c={checked ? "white" : "black"} pl={4}>
                  {enableTable
                    ? t("SelectAdditionalTable")
                    : t("SelectedItems")}
                </Text>
              </Grid.Col>
              <Grid.Col span={1}>
                {enableTable && (
                  <Tooltip
                    color="red.6"
                    disabled={tableId}
                    withArrow
                    px={16}
                    py={2}
                    offset={2}
                    zIndex={999}
                    position="top-end"
                    label={t("SelectaTabletoChooseAdditional")}
                  >
                    <Checkbox
                      disabled={!tableId}
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
                  </Tooltip>
                )}
              </Grid.Col>
            </Grid>
          </Paper>

          {checked && (
            <ScrollArea h={heightHalf / 4} type="never" scrollbars="y">
              <Paper p="md" radius="md" bg={"#E6F5ED99"}>
                <Grid columns={15} gutter="md">
                  {tables.map((item) => (
                    <Grid.Col span={3} key={item.id}>
                      <Checkbox
                        label={`Table ${item.id}`}
                        color="green.8"
                        checked={additionalTableSelections[tableId]?.has(
                          item.id
                        )}
                        onChange={() => handleAdditionalTableCheck(item.id)}
                        disabled={item.id === tableId}
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
            </ScrollArea>
          )}
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
                    <Group gap={8} justify="center">
                      <ActionIcon
                        size={"sm"}
                        bg={"#596972"}
                        onClick={() => handleDecrement(data.product_id)}
                      >
                        <IconMinus height={"12"} width={"12"} />
                      </ActionIcon>
                      <Text size="sm" ta={"center"} fw={600} maw={30} miw={30}>
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
                    {configData?.currency?.symbol} {data.sub_total.toFixed(2)}
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
              },
            ]}
            loaderSize="xs"
            loaderColor="grape"
            height={enableTable && checked ? 158 : enableTable ? 240 : 310}
            // height={enableTable ? 196 : 310}
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
              <IconSum size="16" style={{ color: "black" }} />
              <Text fw={"bold"} fz={"sm"} c={"black"}>
                {configData?.currency?.symbol} {subtotal.toFixed(2)}
              </Text>
            </Group>
          </Group>
        </Box>
        <Box
          className={classes["box-border"]}
          h={heightHalf + 16}
          pl={4}
          pr={4}
          pb={4}
          pt={2}
          mt={6}
        >
          <Stack
            align="stretch"
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
              }}
              placeholder={t("CustomerMobileNumber")}
              leftSection={<IconSearch height={18} width={18} stroke={2} />}
              rightSection={
                <IconUserFilled height={18} width={18} stroke={2} />
              }
            ></TextInput>
            <Grid
              columns={12}
              gutter={4}
              justify="center"
              align="center"
              className={classes["box-white"]}
              pt={8}
              pb={8}
            >
              <Grid.Col span={6} pl={8}>
                <Grid pl={8} pr={8} bg={"#e8f5e9"}>
                  <Grid.Col span={6}>
                    <Group justify="space-between">
                      <Text fw={500} c={"#333333"}>
                        {t("DIS.")}
                      </Text>
                      <Text fw={800} c={"#333333"}>
                        {configData?.currency?.symbol} 0
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500} c={"#333333"}>
                        {t("Type")}
                      </Text>
                      <Text fw={800} c={"#333333"}>
                        Flat
                      </Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group justify="space-between">
                      <Text fw={500} c={"#333333"}>
                        {t("VAT")}
                      </Text>
                      <Text fw={800} c={"#333333"}>
                        {configData?.currency?.symbol} 0
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500} c={"#333333"}>
                        {t("SD")}
                      </Text>
                      <Text fw={800} c={"#333333"}>
                        {configData?.currency?.symbol} 0
                      </Text>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack
                  gap={0}
                  className={classes["box-border"]}
                  align="center"
                  justify="center"
                  bg={"#30444f"}
                  pt={4}
                  pb={4}
                  mr={8}
                >
                  <Text fw={500} c={"white"} size={"md"}>
                    {t("Total")}
                  </Text>
                  <Text fw={800} c={"white"} size={"lg"}>
                    {configData?.currency?.symbol} {subtotal.toFixed(2)}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
          <Box
            className={classes["box-white"]}
            ml={4}
            mr={4}
            style={{ position: "relative" }}
          >
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
                bg={"orange.8"}
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
                  pt={8}
                  pb={8}
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
                        <Tooltip
                          label={mode.name}
                          withArrow
                          px={16}
                          py={2}
                          offset={2}
                          zIndex={999}
                          position="top-end"
                          color="red"
                        >
                          <Image
                            mih={50}
                            mah={50}
                            fit="contain"
                            src={
                              isOnline
                                ? mode.path
                                : "/images/transaction-mode-offline.jpg"
                            }
                            fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
                              mode.name
                            )}`}
                          ></Image>
                        </Tooltip>

                        {/* <Text pt={"4"} c={"#333333"} fw={500}>
                              {mode.name}
                            </Text> */}
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
          <Box m={8}>
            <Group justify="center" grow gap={"xs"} preventGrowOverflow={true}>
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
          <Grid columns={12} gutter={{ base: 2 }} pl={"8"} pr={"8"}>
            <Grid.Col span={enableTable ? 3 : 4}>
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
            {enableTable && (
              <Grid.Col span={3}>
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
                    onClick={handlePrintAll}
                  >
                    {t("All Print")}
                  </Button>
                </Tooltip>
              </Grid.Col>
            )}
            <Grid.Col span={enableTable ? 3 : 4}>
              <Button
                bg={"#30444F"}
                size={"sm"}
                fullWidth={true}
                leftSection={<IconPrinter />}
                onClick={posPrint}
              >
                {t("POS")}
              </Button>
            </Grid.Col>
            <Grid.Col span={enableTable ? 3 : 4}>
              <Button
                size={"sm"}
                bg={"#00994f"}
                fullWidth={true}
                leftSection={<IconDeviceFloppy />}
                onClick={handlePrintAll}
              >
                {t("Save")}
              </Button>
            </Grid.Col>
          </Grid>
          {printPos && (
            <div style={{ display: "none" }}>
              <SalesPrintPos posData={posData} setPrintPos={setPrintPos} />
            </div>
          )}
        </Box>
      </Box>
    </>
  );
}
