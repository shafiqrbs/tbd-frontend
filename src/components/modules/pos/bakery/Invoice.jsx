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
import SelectForm from "../../../form-builders/SelectForm";
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
    handleSubmitOrder,
  } = props;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190;
  const calculatedHeight = height - 200; // Set minimum height
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

  // Sales by user state management
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
  const [profitShow, setProfitShow] = useState(false);
  const [discountType, setDiscountType] = useState("Percent");
  const [defaultCustomerId, setDefaultCustomerId] = useState(null);

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

  // Scroll handling
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

  // Form and validation
  const transactionModeData = JSON.parse(
    localStorage.getItem("accounting-transaction-mode")
  )
    ? JSON.parse(localStorage.getItem("accounting-transaction-mode"))
    : [];

  const form = useForm({
    initialValues: {
      customer_id: "",
      transaction_mode_id: "",
      user_id: "",
      receive_amount: "",
      discount: "",
      coupon_code: "",
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
  const [returnOrDueText, setReturnOrDueText] = useState("Due");
  const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
  const [salesTotalAmount, setSalesTotalAmount] = useState(0);
  const [salesDueAmount, setSalesDueAmount] = useState(subtotal);
  useEffect(() => {
    const totalAmount = subtotal - salesDiscountAmount;
    setSalesTotalAmount(totalAmount);
    setSalesDueAmount(totalAmount);
  }, [salesDiscountAmount]);
  useEffect(() => {
    let discountAmount = 0;
    if (form.values.discount && Number(form.values.discount) > 0) {
      if (discountType === "Flat") {
        discountAmount = Number(form.values.discount);
      } else if (discountType === "Percent") {
        discountAmount = (subtotal * Number(form.values.discount)) / 100;
      }
    }
    setSalesDiscountAmount(discountAmount);

    let returnOrDueAmount = 0;
    let receiveAmount =
      form.values.receive_amount == "" ? 0 : form.values.receive_amount;
    if (receiveAmount >= 0) {
      const text = salesTotalAmount < receiveAmount ? "Return" : "Due";
      setReturnOrDueText(text);
      returnOrDueAmount = salesTotalAmount - receiveAmount;
      setSalesDueAmount(returnOrDueAmount);
    }
  }, [
    form.values.discount,
    discountType,
    form.values.receive_amount,
    salesTotalAmount,
  ]);

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

  const handlePrintAll = () => {
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
    let createdBy = JSON.parse(localStorage.getItem("user"));
    const formValue = {};
    enableTable ? (formValue.is_pos = 1) : (formValue.is_pos = 0);
    formValue["customer_id"] = form.values.customer_id
      ? form.values.customer_id
      : defaultCustomerId;
    formValue["sub_total"] = subtotal;
    formValue.transaction_mode_id = id;
    formValue["discount_type"] = discountType;
    formValue["discount"] = salesDiscountAmount;
    formValue["discount_calculation"] =
      discountType === "Percent" ? form.values.discount : 0;
    formValue["vat"] = 0;
    formValue["total"] = salesTotalAmount;
    formValue.user_id = salesByUser;
    formValue["created_by_id"] = Number(createdBy["id"]);
    formValue["invoice_date"] = new Date().toLocaleDateString("en-CA");

    const hasReceiveAmount = form.values.receive_amount;

    formValue["payment"] = hasReceiveAmount;
    let transformedArray = TransformProduct(tempCartProducts);
    formValue["items"] = transformedArray ? transformedArray : [];

    //table calculation

    let tableValue = null;
    if (enableTable && tableId) {
      // Get the selected table
      const selectedTable = tables.find((t) => t.id === tableId);
      // Calculate elapsed time
      tableValue = selectedTable.value;
      // let elapsedTime = "00:00:00";
      // if (selectedTable && selectedTable.currentStatusStartTime) {
      //   const elapsedSeconds = Math.floor(
      //     (new Date() - new Date(selectedTable.currentStatusStartTime)) / 1000
      //   );
      //   const hours = Math.floor(elapsedSeconds / 3600)
      //     .toString()
      //     .padStart(2, "0");
      //   const minutes = Math.floor((elapsedSeconds % 3600) / 60)
      //     .toString()
      //     .padStart(2, "0");
      //   const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
      //   elapsedTime = `${hours}:${minutes}:${seconds}`;
      // }

      // const tableData = {
      //   mainTable: {
      //     id: tableValue,
      //     status: selectedTable?.status || "Unknown",
      //     status_change_time: selectedTable?.statusStartTime || "N/A",
      //     elapsed_time: elapsedTime,
      //   },
      //   additionalTables: Array.from(additionalTableSelections[tableId] || []),
      // };
      formValue["table_value"] = tableValue;
    }

    console.log(formValue);
    setTempCartProducts([]);
    setSalesDiscountAmount(0);
    setSalesTotalAmount(0);
    setSalesDueAmount(0);
    setReturnOrDueText("Due");
    setDiscountType("Percent");
    setChecked(false);
    setAdditionalTableSelections({});
    handleSubmitOrder();
    setSalesByUser(null);
    setSalesByUserName(null);
    setId(null);
    form.reset();

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
    const formValue = {
      invoice_id: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
      invoice_date: new Date().toLocaleDateString("en-CA"),
      invoice_time: new Date().toLocaleTimeString("en-CA"),
      user_id: salesByUser,
      transaction_mode_id: id,
      createdByName: salesByUserName.label,
      grand_total: subtotal,
      is_pos: enableTable ? 1 : 0,
    };
    let transformedArray = TransformProduct(tempCartProducts);

    formValue.items = transformedArray || [];
    if (enableTable && tableId) {
      const selectedTable = tables.find((t) => t.id === tableId);
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

    console.log("Print Data:", formValue);
    tempLocalPosInvoice(formValue);
    setPosData(formValue);
    handleSubmitOrder();

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
        pr={10}
        h={"auto"}
        mih={enableTable ? height + 82 : height + 194}
        mah={enableTable ? height + 82 : height + 194}
        className={classes["box-white"]}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Group
          gap={6}
          mb={4}
          preventGrowOverflow={false}
          grow
          align="flex-start"
          wrap="nowrap"
        >
          <Box pt={8}>
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
              <SelectForm
                pt={"xs"}
                tooltip={t("SalesBy")}
                label=""
                placeholder={enableTable ? t("OrderTakenBy") : t("SalesBy")}
                // required={true}
                name={"user_id"}
                form={form}
                dropdownValue={salesByDropdownData}
                id={"user_id"}
                searchable={true}
                value={salesByUser}
                changeValue={setSalesByUser}
              />
            </Tooltip>
          </Box>

          {enableTable && (
            <Button
              disabled={tempCartProducts.length === 0}
              radius="sm"
              size="sm"
              color="green"
              mt={8}
              miw={122}
              maw={122}
              leftSection={<IconChefHat height={14} width={14} stroke={2} />}
              onClick={printItem}
            >
              <Text fw={600} size="sm">
                {t("Kitchen")}
              </Text>
            </Button>
          )}
          <Button
            // disabled={tempCartProducts.length === 0}
            radius="sm"
            size="sm"
            color="red"
            mt={8}
            miw={122}
            maw={122}
            fullWidth
            leftSection={<IconUserFilled height={14} width={14} stroke={2} />}
            onClick={printItem}
          >
            <Text fw={600} size="sm">
              {t("Customer")}
            </Text>
          </Button>
        </Group>
        <Box>
          <Paper
            h={32}
            p="4"
            radius="4"
            style={{ backgroundColor: checked ? "#4CAF50" : "#E8F5E9" }}
          >
            <Grid align="center">
              <Grid.Col span={11}>
                <Text fz={"sm"} fw={500} c={checked ? "white" : "black"} pl={4}>
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
            <ScrollArea
              h={{ base: "auto", sm: enableTable ? 50 : "auto" }}
              type="never"
              bg={"#E6F5ED99"}
            >
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
                width: 48,
                render: (data, index) => index + 1,
              },
              {
                accessor: "display_name",
                title: t("Product"),
                render: (data) => <Text fz={"xs"}>{data.display_name}</Text>,
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
                textAlign: "right",
                render: (data) => (
                  <>
                    {/*{configData?.currency?.symbol} */}
                    {data.sales_price}
                  </>
                ),
              },
              {
                accessor: "subtotal",
                title: "Subtotal",
                textAlign: "right",
                render: (data) => <>{data.sub_total.toFixed(2)}</>,
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
            height={
              enableTable && checked
                ? calculatedHeight - 170
                : enableTable
                ? calculatedHeight - 120
                : calculatedHeight - 8
            }
            scrollAreaProps={{ type: "never" }}
          />
          <Group
            h={34}
            justify="space-between"
            align="center"
            pt={0}
            style={{
              borderTop: "2px solid #dee2e6",
              background: "#dee2e6",
            }}
          >
            <Text fw={"bold"} fz={"sm"} c={"black"} pl={"10"}>
              {t("SubTotal")}
            </Text>
            <Group gap="10" pr={"sm"} align="center">
              <IconSum size="16" style={{ color: "black" }} />
              <Text fw={"bold"} fz={"sm"} c={"black"}>
                {configData?.currency?.symbol} {salesDueAmount.toFixed(2)}
              </Text>
            </Group>
          </Group>
        </Box>
        <Box
          className={classes["box-border"]}
          pl={4}
          pr={4}
          pb={4}
          pt={2}
          mt={6}
        >
          <Stack
            align="stretch"
            justify={"center"}
            mt={6}
            gap={4}
            pl={4}
            pr={4}
            mb={8}
          >
            <Grid
              columns={12}
              gutter={4}
              justify="center"
              align="center"
              className={classes["box-white"]}
              mr={4}
              ml={4}
              pt={8}
              pb={8}
            >
              <Grid.Col span={6} pl={8}>
                <Grid pl={8} pr={8} bg={"#e8f5e9"}>
                  <Grid.Col span={6}>
                    <Group justify="space-between">
                      <Text fz={"sm"} fw={500} c={"#333333"}>
                        {t("DIS.")}
                      </Text>
                      <Text fz={"sm"} fw={800} c={"#333333"}>
                        {configData?.currency?.symbol}{" "}
                        {salesDiscountAmount.toFixed(2)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fz={"sm"} fw={500} c={"#333333"}>
                        {t("Type")}
                      </Text>
                      <Text fz={"sm"} fw={800} c={"#333333"}>
                        {discountType}
                      </Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group justify="space-between">
                      <Text fz={"sm"} fw={500} c={"#333333"}>
                        {t("VAT")}
                      </Text>
                      <Text fz={"sm"} fw={800} c={"#333333"}>
                        {configData?.currency?.symbol} 0
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fz={"sm"} fw={500} c={"#333333"}>
                        {t("SD")}
                      </Text>
                      <Text fz={"sm"} fw={800} c={"#333333"}>
                        {configData?.currency?.symbol} 0
                      </Text>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack
                  grow
                  gap={0}
                  className={classes["box-border"]}
                  align="center"
                  justify="center"
                  bg={"#30444f"}
                  pt={4}
                  pb={4}
                >
                  <Text fw={800} c={"white"} size={"lg"}>
                    {configData?.currency?.symbol} {subtotal.toFixed(2)}
                  </Text>
                  <Text fw={500} c={"white"} size={"md"}>
                    {t("Total")}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack
                  grow
                  gap={0}
                  className={classes["box-border"]}
                  align="center"
                  justify="center"
                  bg={"red"}
                  pt={4}
                  pb={4}
                  mr={8}
                >
                  <Text fw={800} c={"white"} size={"lg"}>
                    {configData?.currency?.symbol} {salesDueAmount.toFixed(2)}
                  </Text>
                  <Text fw={500} c={"white"} size={"md"}>
                    {returnOrDueText}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
            <Box className={classes["box-white"]} ml={4} mr={4}>
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
                            position="top"
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
            <Box m={4}>
              {/*  <Group
                justify="center"
                grow
                gap={"xs"}
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
              </Group>*/}
              <Grid columns={24} gutter={{ base: 2 }} pl={"4"} pr={"4"}>
                <Grid.Col span={3}>
                  <Switch
                    size="lg"
                    w={"100%"}
                    color={"red.3"}
                    mt={"6"}
                    ml={"6"}
                    onLabel={t("%")}
                    offLabel={t("Flat")}
                    radius="xs"
                    checked={discountType === "Percent"}
                    onChange={(event) => {
                      setDiscountType(
                        event.currentTarget.checked ? "Percent" : "Flat"
                      );
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    type="number"
                    placeholder="0"
                    value={form.values.discount}
                    error={form.errors.discount}
                    size={rem(40)}
                    classNames={{ input: classes.input }}
                    onChange={(event) => {
                      form.setFieldValue("discount", event.target.value);
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    type="text"
                    placeholder={t("CouponCode")}
                    value={form.values.coupon_code}
                    error={form.errors.coupon_code}
                    size={rem(40)}
                    classNames={{ input: classes.input }}
                    onChange={(event) => {
                      form.setFieldValue("coupon_code", event.target.value);
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={6}> &nbsp; </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    type="number"
                    placeholder="0"
                    value={form.values.receive_amount}
                    error={form.errors.receive_amount}
                    size={rem(40)}
                    classNames={{ input: classes.input }}
                    onChange={(event) => {
                      form.setFieldValue("receive_amount", event.target.value);
                    }}
                  />
                </Grid.Col>
              </Grid>
            </Box>
            <Grid columns={12} gutter={{ base: 2 }} pl={"4"} pr={"4"}>
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
                      {t("AllPrint")}
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
                  {t("Pos")}
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
          </Stack>

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
