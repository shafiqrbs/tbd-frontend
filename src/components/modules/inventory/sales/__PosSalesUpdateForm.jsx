import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import __PosCustomerSection from "./__PosCustomerSection";
import { Box, Text, ActionIcon, Group, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconPercentage, IconSum, IconX } from "@tabler/icons-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import __PosInvoiceSection from "./__PosInvoiceSetion.jsx";
import { getHotkeyHandler, useToggle } from "@mantine/hooks";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { storeEntityData, updateEntityData } from "../../../../store/inventory/crudSlice.js";

export default function __PosSalesUpdateForm(props) {
  let { id } = useParams();
  const {
    isSMSActive,
    currencySymbol,
    domainId,
    isZeroReceiveAllow,
    tempCardProducts,
    setLoadCardProducts,
    entityEditData,
    lastClicked,
    setLastClicked,
    handleClick,
    isWarehouse,
    setTempCardProducts,
  } = props;
  //common hooks
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 170;
  const [fetching, setFetching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  //discount type hook
  const [discountType, setDiscountType] = useState(
    entityEditData.discount_type
  );

  // form
  const form = useForm({
    initialValues: {
      customer_id: entityEditData?.customer_id,
      transaction_mode_id: entityEditData?.transaction_mode_id,
      sales_by: entityEditData?.sales_by_id,
      order_process: entityEditData?.process_id,
      narration: entityEditData?.narration,
      discount:
        discountType === "Flat"
          ? entityEditData?.discount
          : entityEditData?.discount_calculation,
      receive_amount: entityEditData?.payment,
      name: entityEditData ? entityEditData.customer_name : "",
      mobile: entityEditData ? entityEditData.customer_mobile : "",
      email: entityEditData ? entityEditData.customer_email : "",
    },
    validate: {
      transaction_mode_id: isNotEmpty(),
    },
  });

  //calculate subTotal amount
  let salesSubTotalAmount =
    tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

  let totalPurchaseAmount =
    tempCardProducts?.reduce(
      (total, item) => total + item.purchase_price * item.quantity,
      0
    ) || 0;

  //customer dropdown data
  const [customersDropdownData, setCustomersDropdownData] = useState([]);

  //customer hook
  const [customerData, setCustomerData] = useState(
    entityEditData?.customer_id?.toString()
  );

  // setting defualt customer
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

  //default customer hook
  const [defaultCustomerId, setDefaultCustomerId] = useState(null);

  //Custoemr object hook
  const [customerObject, setCustomerObject] = useState({});

  //profit amount hook
  const [salesProfitAmount, setSalesProfitAmount] = useState(0);

  //sales discount amount hook
  const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);

  // sales by user hook
  const [salesByUser, setSalesByUser] = useState(
    entityEditData?.sales_by_id ? entityEditData?.sales_by_id.toString() : null
  );

  //order process hook
  const [orderProcess, setOrderProcess] = useState(
    entityEditData?.process_id ? entityEditData?.process_id.toString() : null
  );

  //vat amount hook
  const [salesVatAmount, setSalesVatAmount] = useState(0);

  //sales total amount hook
  const [salesTotalAmount, setSalesTotalAmount] = useState(0);

  // sales due amount hook
  const [salesDueAmount, setSalesDueAmount] = useState(0);

  //return or due text hook
  const [returnOrDueText, setReturnOrDueText] = useState("Due");

  // calculate sales total amount after discount and vat change
  useEffect(() => {
    let discountAmount = 0;
    if (form.values.discount && Number(form.values.discount) > 0) {
      if (discountType === "Flat") {
        discountAmount = Number(form.values.discount);
      } else if (discountType === "Percent") {
        discountAmount =
          (salesSubTotalAmount * Number(form.values.discount)) / 100;
      }
    }
    setSalesDiscountAmount(discountAmount);

    // Calculate total amount after discount and VAT
    const newTotalAmount =
      salesSubTotalAmount - Number(discountAmount) + Number(salesVatAmount);
    setSalesTotalAmount(newTotalAmount);

    let returnOrDueAmount = 0;
    let receiveAmount =
      form.values.receive_amount == "" ? 0 : Number(form.values.receive_amount);
    if (receiveAmount >= 0) {
      const text = newTotalAmount < receiveAmount ? "Return" : "Due";
      setReturnOrDueText(text);
      returnOrDueAmount = newTotalAmount - receiveAmount;
      setSalesDueAmount(returnOrDueAmount);
    }
  }, [
    form.values.discount,
    discountType,
    form.values.receive_amount,
    salesSubTotalAmount,
    salesVatAmount,
  ]);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          let createdBy = JSON.parse(localStorage.getItem("user"));
          let transformedArray = tempCardProducts.map((product) => {
            return {
              sale_id: id,
              product_id: product.product_id,
              unit_id: product.unit_id,
              uom: product.uom,
              item_name: product.item_name,
              quantity: product.quantity,
              percent: product.percent,
              sales_price: product.sales_price,
              price: product.price,
              purchase_price: product.purchase_price,
              sub_total: product.sub_total,
              warehouse_id: product.warehouse_id,
              bonus_quantity: product.bonus_quantity,
            };
          });
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          };
          const formValue = {};
          formValue["customer_id"] = form.values.customer_id
            ? form.values.customer_id
            : defaultCustomerId;

          // Include manual customer input fields if no customer is selected
          if (
            !form.values.customer_id ||
            form.values.customer_id == defaultCustomerId
          ) {
            formValue["customer_name"] = form.values.name;
            formValue["customer_mobile"] = form.values.mobile;
            formValue["customer_email"] = form.values.email;
          }

          formValue["sub_total"] = salesSubTotalAmount;
          formValue["transaction_mode_id"] = form.values.transaction_mode_id;
          formValue["discount_type"] = discountType;
          formValue["discount"] = salesDiscountAmount;
          formValue["discount_calculation"] =
            discountType === "Percent" ? form.values.discount : 0;
          formValue["vat"] = 0;
          formValue["total"] = salesTotalAmount;
          formValue["sales_by_id"] = form.values.sales_by;
          formValue["created_by_id"] = Number(createdBy["id"]);
          formValue["process"] = form.values.order_process;
          formValue["narration"] = form.values.narration;
          formValue["invoice_date"] =
            form.values.invoice_date &&
            new Date(form.values.invoice_date).toLocaleDateString(
              "en-CA",
              options
            );
          formValue["items"] = transformedArray ? transformedArray : [];

          const hasReceiveAmount = form.values.receive_amount;
          const isDefaultCustomer =
            !form.values.customer_id ||
            form.values.customer_id == defaultCustomerId;

          formValue["payment"] = hasReceiveAmount
            ? form.values.receive_amount
            : isZeroReceiveAllow && isDefaultCustomer
            ? salesTotalAmount
            : 0;

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

          if (transformedArray && transformedArray.length > 0) {
            const data = {
              url: "inventory/sales/" + id,
              data: formValue,
            };
            dispatch(updateEntityData(data));

            notifications.show({
              color: "teal",
              title: t("UpdatedSuccessfully"),
              icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
              loading: false,
              autoClose: 700,
              style: { backgroundColor: "lightgray" },
            });

            if (lastClicked === "save") {
              navigate("/inventory/sales");
            }
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
          <__PosCustomerSection
            form={form}
            isSMSActive={isSMSActive}
            currencySymbol={currencySymbol}
            customerObject={customerObject}
            setCustomerObject={setCustomerObject}
            customerData={customerData}
            setCustomerData={setCustomerData}
            customersDropdownData={customersDropdownData}
            setCustomersDropdownData={setCustomersDropdownData}
            defaultCustomerId={defaultCustomerId}
            setDefaultCustomerId={setDefaultCustomerId}
          />
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
                  accessor: "item_name",
                  title: t("Name"),
                  width: "200px",
                  footer: (
                    <Group spacing="xs">
                      <IconSum size="1.25em" />
                      <Text mb={-2}>{tempCardProducts.length} Items</Text>
                    </Group>
                  ),
                },
                {
                  accessor: "warehouse_name",
                  title: t("Warehouse"),
                  hidden: !isWarehouse,
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
                  accessor: "bonus_quantity",
                  title: t("BonusQuantityTable"),
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

                    const handlQuantityChange = (e) => {
                      const editedQuantity = e.currentTarget.value;
                      setEditedQuantity(editedQuantity);

                      const updatedProducts = tempCardProducts.map(
                        (product) => {
                          if (product.product_id === item.product_id) {
                            return {
                              ...product,
                              quantity: e.currentTarget.value,
                              sub_total:
                                e.currentTarget.value * item.sales_price,
                            };
                          }
                          return product;
                        }
                      );

                      setTempCardProducts(updatedProducts);
                    };

                    return (
                      <>
                        <TextInput
                          type="number"
                          label=""
                          size="xs"
                          value={editedQuantity}
                          onChange={handlQuantityChange}
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
                  accessor: "uom",
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
                        const updatedProducts = tempCardProducts.map(
                          (product) => {
                            if (product.product_id === item.product_id) {
                              return {
                                ...product,
                                sales_price: editedSalesPrice,
                                sub_total: editedSalesPrice * item.quantity,
                              };
                            }
                            return product;
                          }
                        );

                        setTempCardProducts(updatedProducts);
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

                      if (e.currentTarget.value && e.currentTarget.value >= 0) {
                        const updatedProducts = tempCardProducts.map(
                          (product) => {
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
                          }
                        );
                        setTempCardProducts(updatedProducts);
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
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          let data = tempCardProducts ? tempCardProducts : [];
                          data = data.filter(
                            (d) => d.product_id !== item.product_id
                          );
                          setTempCardProducts(data);
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
              height={height - 264}
              scrollAreaProps={{ type: "never" }}
            />
          </Box>
        </Box>
        <Box>
          <__PosInvoiceSection
            setCustomersDropdownData={setCustomersDropdownData}
            customersDropdownData={customersDropdownData}
            form={form}
            currencySymbol={currencySymbol}
            salesDiscountAmount={salesDiscountAmount}
            salesProfitAmount={salesProfitAmount}
            setSalesDiscountAmount={setSalesDiscountAmount}
            setSalesByUser={setSalesByUser}
            setOrderProcess={setOrderProcess}
            orderProcess={orderProcess}
            salesByUser={salesByUser}
            salesVatAmount={salesVatAmount}
            salesTotalAmount={salesTotalAmount}
            discountType={discountType}
            setDiscountType={setDiscountType}
            returnOrDueText={returnOrDueText}
            customerData={customerData}
            isZeroReceiveAllow={isZeroReceiveAllow}
            salesDueAmount={salesDueAmount}
            setLoadCardProducts={setLoadCardProducts}
            lastClicked={lastClicked}
            setLastClicked={setLastClicked}
            handleClick={handleClick}
            entityEditData={entityEditData}
          />
        </Box>
      </form>
    </>
  );
}
