import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  ActionIcon,
  Group,
  TextInput,
  Grid,
  ScrollArea,
  Center,
  Stack,
  Tooltip,
  Button,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import {
  IconPercentage,
  IconSum,
  IconX,
  IconRefresh,
  IconStackPush,
  IconPrinter,
  IconReceipt,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { getHotkeyHandler, useToggle } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCalendar } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { storeEntityData } from "../../../../../store/inventory/crudSlice.js";
import genericClass from "../../../../../assets/css/Generic.module.css";
import DatePickerForm from "../../../../form-builders/DatePicker.jsx";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
export default function GeneralIssueSubmitForm(props) {
  const {
    isSMSActive,
    currencySymbol,
    domainId,
    isZeroReceiveAllow,
    setLoadCardProducts,
    loadCardProducts,
  } = props;
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 170;
  const [fetching, setFetching] = useState(false);
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      customer_id: "",
      transaction_mode_id: "",
      sales_by: "",
      order_process: "",
      narration: "",
      discount: "",
      receive_amount: "",
      name: "",
      mobile: "",
      email: "",
    },
    validate: {
      transaction_mode_id: isNotEmpty(),
    },
  });
  // temp cart product hook
  const [tempCardProducts, setTempCardProducts] = useState([]);

  //load cart products from local storage
  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-production-issue");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);

  //calculate subTotal amount
  let salesSubTotalAmount =
    tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

  // sales by user hook
  const [salesByUser, setSalesByUser] = useState(null);
  const [salesByDropdownData, setSalesByDropdownData] = useState(null);
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

  const [lastClicked, setLastClicked] = useState(null);
  const handleClick = (event) => {
    const clickedButton = event.currentTarget.name;
    setLastClicked(clickedButton);
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          const tempProducts = localStorage.getItem("temp-production-issue");
          let items = tempProducts ? JSON.parse(tempProducts) : [];
          let createdBy = JSON.parse(localStorage.getItem("user"));

          let transformedArray = items.map((product) => {
            return {
              product_id: product.product_id,
              display_name: product.display_name,
              quantity: product.quantity,
              unit_name: product.unit_name,
              purchase_price: product.purchase_price,
              sub_total: product.sub_total,
              sales_price: product.sales_price,
            };
          });

          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          };
          const formValue = {};
          formValue["total"] = salesTotalAmount;
          formValue["created_by_id"] = Number(createdBy["id"]);
          formValue["invoice_date"] =
            form.values.invoice_date &&
            new Date(form.values.invoice_date).toLocaleDateString(
              "en-CA",
              options
            );
          formValue["items"] = transformedArray ? transformedArray : [];

          // Add console log to display all form values
          console.log("Form submission values:", formValue);

          // Check if default customer needs receive amount
          if (
            isDefaultCustomer &&
            !isZeroReceiveAllow &&
            (!form.values.receive_amount ||
              Number(form.values.receive_amount) <= 0 ||
              Number(form.values.receive_amount) < salesTotalAmount)
          ) {
            form.setFieldError(
              "receive_amount",
              t("Receive amount must cover the total for default customer")
            );

            notifications.show({
              color: "red",
              title: t("Payment Required"),
              message: t("Default customer must pay full amount"),
              loading: false,
              autoClose: 1500,
            });

            return;
          }

          // Also ensure transaction mode is selected
          if (!form.values.transaction_mode_id) {
            form.setFieldError(
              "transaction_mode_id",
              t("Please select a payment method")
            );

            notifications.show({
              color: "red",
              title: t("Missing Payment Method"),
              message: t("Please select a payment method"),
              loading: false,
              autoClose: 1500,
            });

            return;
          }

          if (items && items.length > 0) {
            const data = {
              url: "inventory/sales",
              data: formValue,
            };
            dispatch(storeEntityData(data));

            notifications.show({
              color: "teal",
              title: t("CreateSuccessfully"),
              icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
              loading: false,
              autoClose: 700,
              style: { backgroundColor: "lightgray" },
            });

            setTimeout(() => {
              localStorage.removeItem("temp-production-issue");
              form.reset();
              setCustomerData(null);
              setSalesByUser(null);
              setOrderProcess(null);
              setLoadCardProducts(true);
              setCustomerObject(null);
            }, 500);
          } else {
            notifications.show({
              color: "red",
              title: t("PleaseChooseItems"),
              icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
              loading: false,
              autoClose: 700,
              style: { backgroundColor: "lightgray" },
            });
          }
        })}
      >
        <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
          <Box className={"borderRadiusAll"}>
            <DataTable
              classNames={{
                root: tableCss.root,
                table: tableCss.table,
                header: tableCss.header,
                footer: tableCss.footer,
                pagination: tableCss.pagination,
              }}
              records={tempCardProducts}
              columns={[
                {
                  accessor: "index",
                  title: t("S/N"),
                  textAlignment: "right",
                  width: "50px",
                  render: (item) => tempCardProducts.indexOf(item) + 1,
                },
                {
                  accessor: "display_name",
                  title: t("Name"),
                  width: "200px",
                  footer: (
                    <Group spacing="xs">
                      <IconSum size="1.25em" />
                      <Text mb={-2}>
                        {tempCardProducts.length} {t("Items")}
                      </Text>
                    </Group>
                  ),
                },
                {
                  accessor: "price",
                  title: t("Price"),
                  textAlign: "right",
                  render: (item) => {
                    return item.price && Number(item.price).toFixed(2);
                  },
                },

                {
                  accessor: "stock",
                  title: t("Stock"),
                  textAlign: "center",
                },
                {
                  accessor: "quantity",
                  title: t("Quantity"),
                  textAlign: "center",
                  width: "100px",
                  render: (item) => {
                    const [editedQuantity, setEditedQuantity] = useState(
                      item.quantity
                    );

                    const handleQuantityChange = (e) => {
                      const editedQuantity = e.currentTarget.value;
                      setEditedQuantity(editedQuantity);

                      const tempCardProducts = localStorage.getItem(
                        "temp-production-issue"
                      );
                      const cardProducts = tempCardProducts
                        ? JSON.parse(tempCardProducts)
                        : [];

                      const updatedProducts = cardProducts.map((product) => {
                        if (product.product_id === item.product_id) {
                          return {
                            ...product,
                            quantity: e.currentTarget.value,
                            sub_total: e.currentTarget.value * item.sales_price,
                          };
                        }
                        return product;
                      });

                      localStorage.setItem(
                        "temp-production-issue",
                        JSON.stringify(updatedProducts)
                      );
                      setLoadCardProducts(true);
                    };

                    return (
                      <>
                        <TextInput
                          type="number"
                          label=""
                          size="xs"
                          value={editedQuantity}
                          onChange={handleQuantityChange}
                          onKeyDown={getHotkeyHandler([
                            [
                              "Enter",
                              (e) => {
                                document
                                  .getElementById(
                                    "inline-update-quantity-" + item.product_id
                                  )
                                  .focus();
                              },
                            ],
                          ])}
                        />
                      </>
                    );
                  },
                },
                {
                  accessor: "unit_name",
                  title: t("UOM"),
                  textAlign: "center",
                },
                {
                  accessor: "sales_price",
                  title: t("SalesPrice"),
                  textAlign: "center",
                  width: "100px",
                  render: (item) => {
                    const [editedSalesPrice, setEditedSalesPrice] = useState(
                      item.sales_price
                    );

                    const handleSalesPriceChange = (e) => {
                      const newSalesPrice = e.currentTarget.value;
                      setEditedSalesPrice(newSalesPrice);
                    };

                    useEffect(() => {
                      const timeoutId = setTimeout(() => {
                        const tempCardProducts = localStorage.getItem(
                          "temp-production-issue"
                        );
                        const cardProducts = tempCardProducts
                          ? JSON.parse(tempCardProducts)
                          : [];
                        const updatedProducts = cardProducts.map((product) => {
                          if (product.product_id === item.product_id) {
                            return {
                              ...product,
                              sales_price: editedSalesPrice,
                              sub_total: editedSalesPrice * item.quantity,
                            };
                          }
                          return product;
                        });

                        localStorage.setItem(
                          "temp-production-issue",
                          JSON.stringify(updatedProducts)
                        );
                        setLoadCardProducts(true);
                      }, 1000);

                      return () => clearTimeout(timeoutId);
                    }, [editedSalesPrice, item.product_id, item.quantity]);

                    return item.percent ? (
                      Number(item.sales_price).toFixed(2)
                    ) : (
                      <>
                        <TextInput
                          type="number"
                          label=""
                          size="xs"
                          id={"inline-update-quantity-" + item.product_id}
                          value={editedSalesPrice}
                          onChange={handleSalesPriceChange}
                        />
                      </>
                    );
                  },
                },
                {
                  accessor: "percent",
                  title: t("Discount"),
                  textAlign: "center",
                  width: "100px",
                  render: (item) => {
                    const [editedPercent, setEditedPercent] = useState(
                      item.percent
                    );
                    const handlePercentChange = (e) => {
                      const editedPercent = e.currentTarget.value;
                      setEditedPercent(editedPercent);

                      const tempCardProducts = localStorage.getItem(
                        "temp-production-issue"
                      );
                      const cardProducts = tempCardProducts
                        ? JSON.parse(tempCardProducts)
                        : [];

                      if (e.currentTarget.value && e.currentTarget.value >= 0) {
                        const updatedProducts = cardProducts.map((product) => {
                          if (product.product_id === item.product_id) {
                            const discountAmount =
                              (item.price * editedPercent) / 100;
                            const salesPrice = item.price - discountAmount;

                            return {
                              ...product,
                              percent: editedPercent,
                              sales_price: salesPrice,
                              sub_total: salesPrice * item.quantity,
                            };
                          }
                          return product;
                        });

                        localStorage.setItem(
                          "temp-production-issue",
                          JSON.stringify(updatedProducts)
                        );
                        setLoadCardProducts(true);
                      }
                    };

                    return item.percent ? (
                      <>
                        <TextInput
                          type="number"
                          label=""
                          size="xs"
                          value={editedPercent}
                          onChange={handlePercentChange}
                          rightSection={
                            editedPercent === "" ? (
                              <>
                                {item.percent}
                                <IconPercentage size={16} opacity={0.5} />
                              </>
                            ) : (
                              <IconPercentage size={16} opacity={0.5} />
                            )
                          }
                        />
                      </>
                    ) : (
                      <Text size={"xs"} ta="right">
                        {(
                          Number(item.price) - Number(item.sales_price)
                        ).toFixed(2)}
                      </Text>
                    );
                  },
                  footer: (
                    <Group spacing="xs">
                      <Text fz={"md"} fw={"600"}>
                        {t("SubTotal")}
                      </Text>
                    </Group>
                  ),
                },

                {
                  accessor: "sub_total",
                  title: t("SubTotal"),
                  textAlign: "right",
                  render: (item) => {
                    return item.sub_total && Number(item.sub_total).toFixed(2);
                  },
                  footer: (
                    <Group spacing="xs">
                      <Text fw={"600"} fz={"md"}>
                        {salesSubTotalAmount.toFixed(2)}
                      </Text>
                    </Group>
                  ),
                },
                {
                  accessor: "action",
                  title: t("Action"),
                  textAlign: "right",
                  render: (item) => (
                    <Group gap={4} justify="right" wrap="nowrap">
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        radius="xl"
                        color="red"
                        onClick={() => {
                          const dataString = localStorage.getItem(
                            "temp-production-issue"
                          );
                          let data = dataString ? JSON.parse(dataString) : [];

                          data = data.filter(
                            (d) => d.product_id !== item.product_id
                          );

                          const updatedDataString = JSON.stringify(data);

                          localStorage.setItem(
                            "temp-production-issue",
                            updatedDataString
                          );
                          setLoadCardProducts(true);
                        }}
                      >
                        <IconX
                          size={16}
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Group>
                  ),
                },
              ]}
              fetching={fetching}
              totalRecords={100}
              recordsPerPage={10}
              loaderSize="xs"
              loaderColor="grape"
              height={height - 134}
            />
          </Box>
        </Box>
        <Box>
          <Grid columns={24} gutter={{ base: 6 }} pt={"6"}>
            <Grid.Col span={8}>
              <Box className={"borderRadiusAll"}>
                <ScrollArea
                  h={190}
                  scrollbarSize={2}
                  type="never"
                  bg={"gray.1"}
                >
                  <Box pl={"xs"} pt={"xs"} pr={"xs"} bg={"white"} pb={"10"}>
                    <Grid columns={"16"} gutter="6"></Grid>
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
              </Box>
            </Grid.Col>
            <Grid.Col span={8}>
              {/* outstading section */}
              <Box p={"xs"} className={genericClass.genericSecondaryBg} h={192}>
                <Box
                  pb={"xs"}
                  className={genericClass.genericSecondaryBg}
                ></Box>
                {/* Due Section */}
                <Box>
                  <Stack justify="space-between">
                    <Box className={genericClass.genericHighlightedBox}>
                      <Grid columns={18} gutter={{ base: 2 }}>
                        <Grid.Col span={8} mt={"4"} pl={"6"}></Grid.Col>
                        <Grid.Col
                          span={10}
                          align="center"
                          justify="center"
                        ></Grid.Col>
                      </Grid>
                    </Box>
                  </Stack>
                </Box>
                <Box>
                  <Tooltip
                    label={t("MustBeNeedReceiveAmountWithoutCustomer")}
                    position="top-center"
                    bg={"#905923"}
                    withArrow
                  >
                    <Grid gutter={{ base: 1 }}>
                      <Grid.Col
                        span={10}
                        bg={"#bc924f"}
                        p={"18"}
                        pr={"0"}
                      ></Grid.Col>
                      <Grid.Col
                        span={2}
                        bg={"#bc924f"}
                        p={"18"}
                        pl={"8"}
                      ></Grid.Col>
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
                style={{
                  transition: "all 0.3s ease",
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
                style={{
                  transition: "all 0.3s ease",
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
                style={{
                  transition: "all 0.3s ease",
                }}
              >
                {t("Generate")}
              </Button>
            </Button.Group>
          </Box>
        </Box>
      </form>
    </>
  );
}
