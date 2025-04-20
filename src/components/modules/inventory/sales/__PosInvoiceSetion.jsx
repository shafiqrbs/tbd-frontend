import {
  Box,
  Grid,
  ScrollArea,
  Tooltip,
  Center,
  Stack,
  TextInput,
  ActionIcon,
  Button,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import DatePickerForm from "../../../form-builders/DatePicker";
import genericClass from "../../../../assets/css/Generic.module.css";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import {
  IconCalendar,
  IconCurrencyTaka,
  IconCurrency,
  IconPlusMinus,
  IconDotsVertical,
  IconRefresh,
  IconStackPush,
  IconPrinter,
  IconReceipt,
  IconDeviceFloppy,
  IconPercentage,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage";

export default function __PosInvoiceSection(props) {
  const {
    form,
    currencySymbol,
    salesDiscountAmount,
    salesProfitAmount,
    setSalesDiscountAmount,
    setSalesByUser,
    setOrderProcess,
    orderProcess,
    salesByUser,
    salesVatAmount,
    salesTotalAmount,
    discountType,
    setDiscountType,
    returnOrDueText,
    customerData,
    isZeroReceiveAllow,
    salesDueAmount,
    setLoadCardProducts,
    setCustomersDropdownData,
    customersDropdownData,
    lastClicked,
    handleClick,entityEditData
  } = props;

  //common hooks
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t } = useTranslation();

  // transaction mode array
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
  }, [transactionModeData, form]);
  // transaction modes hover hook
  const [hoveredModeId, setHoveredModeId] = useState(false);

  //sales by dropdown hook
  const [salesByDropdownData, setSalesByDropdownData] = useState([]);

  //useEffect to load salesByDropdownData
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

  //default customer id hook
  const [defaultCustomerId, setDefaultCustomerId] = useState(null);

  // get default customer id
  useEffect(() => {
    const fetchCustomers = async () => {
      await customerDataStoreIntoLocalStorage();
      let coreCustomers = localStorage.getItem("core-customers");
      coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : [];
      let defaultId = defaultCustomerId;
      if (coreCustomers && coreCustomers.length > 0) {
        const transformedData = coreCustomers.map((type) => {
          if (type.name === "Default") {
            defaultId = type.id;
          }
          return {
            label: type.mobile + " -- " + type.name,
            value: String(type.id),
          };
        });

        setCustomersDropdownData(transformedData);
        setDefaultCustomerId(defaultId);
      }
    };

    fetchCustomers();
  }, []);

  //submit disabled based on default customer check and zeroreceive
  const isDefaultCustomer = !customerData || customerData == defaultCustomerId;
  const isDisabled =
    isDefaultCustomer && (isZeroReceiveAllow ? false : salesDueAmount > 0);

  // Calculate remaining amount dynamically based on receive_amount
  const receiveAmount = form.values.receive_amount
    ? Number(form.values.receive_amount)
    : 0;
  const remainingAmount = salesTotalAmount - receiveAmount;
  const isReturn = remainingAmount < 0;
  const displayAmount = Math.abs(remainingAmount).toFixed(2);

  return (
    <>
      <Box>
        <Grid columns={24} gutter={{ base: 6 }} pt={"6"}>
          <Grid.Col span={8}>
            <Box className={"borderRadiusAll"}>
              <ScrollArea h={190} scrollbarSize={2} type="never" bg={"gray.1"}>
                <Box pl={"xs"} pt={"xs"} pr={"xs"} bg={"white"} pb={"10"}>
                  <Grid columns={"16"} gutter="6">
                    {transactionModeData &&
                      transactionModeData.length > 0 &&
                      transactionModeData.map((mode, index) => {
                        return (
                          <Grid.Col span={4} key={index}>
                            <Box bg={"gray.1"} h={"82"}>
                              <input
                                type="radio"
                                name="transaction_mode_id"
                                id={"transaction_mode_id_" + mode.id}
                                className="input-hidden"
                                value={mode.id}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    "transaction_mode_id",
                                    e.currentTarget.value
                                  );
                                  form.setFieldError(
                                    "transaction_mode_id",
                                    null
                                  );
                                }}
                                defaultChecked={
                                  entityEditData?.transaction_mode_id
                                    ? entityEditData?.transaction_mode_id ==
                                      mode.id
                                    : mode.is_selected
                                    ? true
                                    : false
                                }
                              />
                              <Tooltip
                                label={mode.name}
                                opened={hoveredModeId === mode.id}
                                position="top"
                                bg={"orange.8"}
                                offset={12}
                                withArrow
                                arrowSize={8}
                              >
                                <label
                                  htmlFor={"transaction_mode_id_" + mode.id}
                                  onMouseEnter={() => {
                                    setHoveredModeId(mode.id);
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredModeId(null);
                                  }}
                                >
                                  <img
                                    src={
                                      isOnline
                                        ? mode.path
                                        : "/images/transaction-mode-offline.jpg"
                                    }
                                    alt={mode.method_name}
                                  />
                                  <Center fz={"xs"} className={"textColor"}>
                                    {mode.authorized_name}
                                  </Center>
                                </label>
                              </Tooltip>
                            </Box>
                          </Grid.Col>
                        );
                      })}
                  </Grid>
                </Box>
              </ScrollArea>
            </Box>
          </Grid.Col>
          <Grid.Col span={8}>
            <Box className={genericClass.genericSecondaryBg} p={"xs"} h={192}>
              <Box>
                <DatePickerForm
                  tooltip={t("InvoiceDateValidateMessage")}
                  label=""
                  placeholder={t("InvoiceDate")}
                  required={false}
                  nextField={"discount"}
                  form={form}
                  name={"invoice_date"}
                  id={"invoice_date"}
                  leftSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSectionWidth={30}
                  closeIcon={true}
                />
              </Box>
              <Box mt={4}>
                <SelectForm
                  tooltip={t("ChooseSalesBy")}
                  label=""
                  placeholder={t("SalesBy")}
                  required={false}
                  name={"sales_by"}
                  form={form}
                  dropdownValue={salesByDropdownData}
                  id={"sales_by"}
                  nextField={"order_process"}
                  searchable={false}
                  value={salesByUser}
                  changeValue={setSalesByUser}
                />
              </Box>
              <Box pt={4}>
                <SelectForm
                  tooltip={t("ChooseOrderProcess")}
                  label=""
                  placeholder={t("OrderProcess")}
                  required={false}
                  name={"order_process"}
                  form={form}
                  dropdownValue={
                    localStorage.getItem("order-process")
                      ? JSON.parse(localStorage.getItem("order-process"))
                      : []
                  }
                  id={"order_process"}
                  nextField={"narration"}
                  searchable={false}
                  value={orderProcess}
                  changeValue={setOrderProcess}
                />
              </Box>
              <Box pt={4}>
                <TextAreaForm
                  size="xs"
                  tooltip={t("NarrationValidateMessage")}
                  label=""
                  placeholder={t("Narration")}
                  required={false}
                  nextField={"Status"}
                  name={"narration"}
                  form={form}
                  id={"narration"}
                />
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={8}>
            {/* outstading section */}
            <Box p={"xs"} className={genericClass.genericSecondaryBg} h={192}>
              <Box pb={"xs"} className={genericClass.genericSecondaryBg}>
                <Grid gutter={{ base: 4 }}>
                  <Grid.Col span={4}>
                    <Center fz={"md"} ta="center" fw={"800"}>
                      {" "}
                      {currencySymbol}{" "}
                      {salesDiscountAmount &&
                        Number(salesDiscountAmount).toFixed(2)}
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center fz={"md"} ta="center" fw={"800"}>
                      {" "}
                      {currencySymbol} {salesVatAmount.toFixed(2)}
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center fz={"md"} ta="center" fw={"800"}>
                      {currencySymbol} {salesTotalAmount.toFixed(2)}
                    </Center>
                  </Grid.Col>
                </Grid>
                <Grid gutter={{ base: 4 }}>
                  <Grid.Col span={4}>
                    <Box h={1} ml={"xl"} mr={"xl"} bg={"#905a23"}></Box>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Box h={1} ml={"xl"} mr={"xl"} bg={"#905a23"}></Box>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Box h={1} ml={"xl"} mr={"xl"} bg={"#905a23"}></Box>
                  </Grid.Col>
                </Grid>
                <Grid gutter={{ base: 4 }}>
                  <Grid.Col span={4}>
                    <Center fz={"xs"} c="dimmed">
                      {t("Discount")}
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center fz={"xs"} c="dimmed">
                      {t("Vat")}
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center fz={"xs"} c="dimmed">
                      {t("Total")}
                    </Center>
                  </Grid.Col>
                </Grid>
              </Box>
              {/* Due Section */}
              <Box>
                <Stack justify="space-between">
                  <Box className={genericClass.genericHighlightedBox}>
                    <Grid columns={18} gutter={{ base: 2 }}>
                      <Grid.Col span={8} mt={"4"} pl={"6"}>
                        <Tooltip
                          label={t("ClickRightButtonForPercentFlat")}
                          px={16}
                          py={2}
                          position="top"
                          bg={"red.4"}
                          c={"white"}
                          withArrow
                          offset={2}
                          zIndex={999}
                          transitionProps={{
                            transition: "pop-bottom-left",
                            duration: 500,
                          }}
                        >
                          <TextInput
                            type="number"
                            style={{ textAlign: "right" }}
                            placeholder={t("Discount")}
                            value={salesDiscountAmount}
                            size={"sm"}
                            classNames={{ input: classes.input }}
                            onChange={(event) => {
                              form.setFieldValue(
                                "discount",
                                event.target.value
                              );
                              const newValue = event.target.value;
                              setSalesDiscountAmount(newValue);
                              form.setFieldValue("discount", newValue);
                            }}
                            rightSection={
                              <ActionIcon
                                size={32}
                                bg={"red.5"}
                                variant="filled"
                                onClick={() => setDiscountType()}
                              >
                                {discountType === "Flat" ? (
                                  <IconCurrencyTaka size={16} />
                                ) : (
                                  <IconPercentage size={16} />
                                )}
                              </ActionIcon>
                            }
                            // onBlur={async (event) => {
                            //   const data = {
                            //     url: "inventory/pos/inline-update",
                            //     data: {
                            //       invoice_id: tableId,
                            //       field_name: "discount",
                            //       value: event.target.value,
                            //       discount_type: discountType,
                            //     },
                            //   };
                            //   // Dispatch and handle response
                            //   try {
                            //     const resultAction = await dispatch(
                            //       storeEntityData(data)
                            //     );

                            //     if (resultAction.payload?.status !== 200) {
                            //       showNotificationComponent(
                            //         resultAction.payload?.message ||
                            //           "Error updating invoice",
                            //         "red",
                            //         "",
                            //         "",
                            //         true
                            //       );
                            //     }
                            //   } catch (error) {
                            //     showNotificationComponent(
                            //       "Request failed. Please try again.",
                            //       "red",
                            //       "",
                            //       "",
                            //       true
                            //     );
                            //     console.error("Error updating invoice:", error);
                            //   } finally {
                            //     setReloadInvoiceData(true);
                            //   }
                            // }}
                          />
                        </Tooltip>
                      </Grid.Col>
                      <Grid.Col span={10} align="center" justify="center">
                        <Box
                          fz={"md"}
                          p={"xs"}
                          style={{ textAlign: "right", float: "right" }}
                          fw={"800"}
                        >
                          {receiveAmount > 0
                            ? isReturn
                              ? t("Return")
                              : t("Due")
                            : returnOrDueText === "Due"
                            ? t("Due")
                            : t("Return")}{" "}
                          {currencySymbol}{" "}
                          {receiveAmount > 0
                            ? displayAmount
                            : salesTotalAmount.toFixed(2)}
                        </Box>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Tooltip
                  label={t("MustBeNeedReceiveAmountWithoutCustomer")}
                  opened={isDisabled && form.errors.receive_amount}
                  position="top-center"
                  bg={"#905923"}
                  withArrow
                >
                  <Grid gutter={{ base: 1 }}>
                    <Grid.Col span={10} bg={"#bc924f"} p={"18"} pr={"0"}>
                      <InputNumberForm
                        type="number"
                        tooltip={t("ReceiveAmountValidateMessage")}
                        label=""
                        placeholder={t("Amount")}
                        required={isDefaultCustomer && !isZeroReceiveAllow}
                        nextField={"sales_by"}
                        form={form}
                        name={"receive_amount"}
                        id={"receive_amount"}
                        rightIcon={<IconCurrency size={16} opacity={0.5} />}
                        leftSection={<IconPlusMinus size={16} opacity={0.5} />}
                        closeIcon={true}
                        onChange={(value) => {
                          // Force the component to re-render when amount changes
                          form.setFieldValue("receive_amount", value);
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={2} bg={"#bc924f"} p={"18"} pl={"8"}>
                      <Tooltip
                        multiline
                        bg={"#905923"}
                        position="top"
                        withArrow
                        ta={"center"}
                        transitionProps={{ duration: 200 }}
                        label={`${t("Profit")}: ${currencySymbol} ${Number(
                          salesProfitAmount
                        ).toFixed(2)}`}
                      >
                        <ActionIcon
                          radius={"xl"}
                          variant="transparent"
                          size={"md"}
                          color="white"
                          mt={"2"}
                          aria-label="Settings"
                          onClick={() => {
                            setSettingDrawer(true);
                          }}
                        >
                          <IconDotsVertical
                            style={{ width: "100%", height: "70%" }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      </Tooltip>
                    </Grid.Col>
                  </Grid>
                </Tooltip>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
        <Box mt={"8"} pb={"xs"} pr={"xs"}>
          <Button.Group>
            <Button
              fullWidth={true}
              variant="filled"
              leftSection={<IconRefresh size={14} />}
              className={genericClass.invoiceReset}
            >
              {t("Reset")}
            </Button>
            <Button
              fullWidth={true}
              variant="filled"
              leftSection={<IconStackPush size={14} />}
              className={genericClass.invoiceHold}
            >
              {t("Hold")}
            </Button>
            <Button
              fullWidth={true}
              variant="filled"
              type={"submit"}
              onClick={handleClick}
              name="print"
              leftSection={<IconPrinter size={14} />}
              className={genericClass.invoicePrint}
              disabled={isDisabled}
              style={{
                transition: "all 0.3s ease",
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              {t("Print")}
            </Button>
            <Button
              fullWidth={true}
              type={"submit"}
              onClick={handleClick}
              name="pos"
              variant="filled"
              leftSection={<IconReceipt size={14} />}
              className={genericClass.invoicePos}
              disabled={isDisabled}
              style={{
                transition: "all 0.3s ease",
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              {t("Pos")}
            </Button>
            <Button
              fullWidth={true}
              className={genericClass.invoiceSave}
              type={"submit"}
              onClick={handleClick}
              name="save"
              variant="filled"
              leftSection={<IconDeviceFloppy size={14} />}
              disabled={isDisabled}
              style={{
                transition: "all 0.3s ease",
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              {t("Save")}
            </Button>
          </Button.Group>
        </Box>
      </Box>
    </>
  );
}
