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
  SimpleGrid,
  Card,
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
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData";

export default function __PosPurchaseInvoiceSection(props) {
  const {
    form,
    currencySymbol,
    purchaseDiscountAmount,
    setPurchaseDiscountAmount,
    setOrderProcess,
    orderProcess,
    purchaseVatAmount,
    purchaseTotalAmount,
    discountType,
    setDiscountType,
    returnOrDueText,
    vendorData,
    purchaseDueAmount,
    setLoadCardProducts,
    setVendorsDropdownData,
    vendorsDropdownData,
    editedData,
    lastClicked,
    setLastClicked,
    handleClick,
    isWarehouse,
    domainConfigData
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

  // transaction modes hover hook
  const [hoveredModeId, setHoveredModeId] = useState(false);

  //default customer id hook
  const [defaultVendorId, setDefaultVendorId] = useState(null);

  let warehouseDropdownData = getCoreWarehouseDropdownData();
  const [warehouseData, setWarehouseData] = useState(null);

  // get default customer id
  useEffect(() => {
    const fetchVendors = async () => {
      await vendorDataStoreIntoLocalStorage();
      let coreVendors = localStorage.getItem("core-vendors");
      coreVendors = coreVendors ? JSON.parse(coreVendors) : [];

      if (coreVendors && coreVendors.length > 0) {
        const transformedData = coreVendors.map((type) => {
          return {
            label: type.mobile + " -- " + type.name,
            value: String(type.id),
          };
        });
        setVendorsDropdownData(transformedData);
      }
    };
    fetchVendors();
  }, []);

  //submit disabled based on default customer check and zeroreceive
  const isDefaultVendor = !vendorData || vendorData == defaultVendorId;

  const isDisabled = isDefaultVendor;
  // Calculate remaining amount dynamically based on receive_amount
  const receiveAmount = form.values.receive_amount
    ? Number(form.values.receive_amount)
    : 0;
  const remainingAmount = purchaseTotalAmount - receiveAmount;
  const isReturn = remainingAmount < 0;
  const displayAmount = Math.abs(remainingAmount).toFixed(2);


  /*START FOR TRANSACTION MODE DEFAULT SELECT*/
  useEffect(() => {
    if (transactionModeData && transactionModeData.length > 0) {
      for (let mode of transactionModeData) {
        if (mode.is_selected) {
          form.setFieldValue('transaction_mode_id', form.values.transaction_mode_id ? form.values.transaction_mode_id : mode.id);
          break;
        }
      }
    }
  }, [transactionModeData, form]);
  /*END FOR TRANSACTION MODE DEFAULT SELECT*/

  return (
    <>
      <Box>
        <SimpleGrid cols={{ base: 1, md: 3 }} mt={"8"} spacing="xs">
          <Card shadow="md" radius="4" className={"borderRadiusAll"}>
            <Box>
              <ScrollArea scrollbarSize={2} type="never" bg={"gray.1"}>
                <Box bg={"white"}>
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
                                  editedData?.transaction_mode_id
                                    ? editedData?.transaction_mode_id == mode.id
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
          </Card>
          <Card
            shadow="md"
            radius="4"
            className={genericClass.genericSecondaryBg}
          >
            <Box className={genericClass.genericSecondaryBg}>
              <Box className={genericClass.genericSecondaryBg}>
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
                { domainConfigData?.inventory_config?.config_purchase?.is_warehouse == 1 && (
                  <Box mt={"4"}>
                    <SelectForm
                      tooltip={t("Warehouse")}
                      label=""
                      placeholder={t("Warehouse")}
                      required={false}
                      name={"warehouse_id"}
                      form={form}
                      dropdownValue={warehouseDropdownData}
                      id={"warehouse_id"}
                      mt={1}
                      searchable={true}
                      value={warehouseData}
                      changeValue={setWarehouseData}
                    />
                  </Box>
                )}
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
            </Box>
          </Card>
          <Card
            shadow="md"
            radius="4"
            className={genericClass.genericSecondaryBg}
          >
            <Box className={genericClass.genericSecondaryBg}>
              <Box pb={"xs"} className={genericClass.genericSecondaryBg}>
                <Grid gutter={{ base: 4 }}>
                  <Grid.Col span={4}>
                    <Center fz={"md"} ta="center" fw={"800"}>
                      {" "}
                      {currencySymbol}{" "}
                      {purchaseDiscountAmount &&
                        Number(purchaseDiscountAmount).toFixed(2)}
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center fz={"md"} ta="center" fw={"800"}>
                      {" "}
                      {currencySymbol} {purchaseVatAmount.toFixed(2)}
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center fz={"md"} ta="center" fw={"800"}>
                      {currencySymbol} {purchaseTotalAmount.toFixed(2)}
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
                      <Grid.Col span={6} mt={"4"} pl={"6"}>
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
                            value={purchaseDiscountAmount}
                            size={"sm"}
                            classNames={{ input: classes.input }}
                            onChange={(event) => {
                              form.setFieldValue(
                                "discount",
                                event.target.value
                              );
                              const newValue = event.target.value;
                              setPurchaseDiscountAmount(newValue);
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
                          />
                        </Tooltip>
                      </Grid.Col>
                      <Grid.Col span={12} align="center" justify="center">
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
                            : purchaseTotalAmount.toFixed(2)}
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
                    <Grid.Col span={10} bg={"#bc924f"} p={"14"} pr={"0"}>
                      <InputNumberForm
                        type="number"
                        tooltip={t("ReceiveAmountValidateMessage")}
                        label=""
                        placeholder={t("Amount")}
                        required={isDefaultVendor}
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
                    <Grid.Col span={2} bg={"#bc924f"} p={"14"} pl={"8"}>
                      
                    </Grid.Col>
                  </Grid>
                </Tooltip>
              </Box>
            </Box>
          </Card>
        </SimpleGrid>
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
