import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Box, Text, ActionIcon, Group, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconPercentage, IconSum, IconX } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { getHotkeyHandler, useToggle } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { storeEntityData } from "../../../../store/inventory/crudSlice.js";
import __RequistionInvoiceoSection from "./__RequistionInvoiceSection.jsx";

export default function __RequistionForm(props) {
  const {
    isSMSActive,
    currencySymbol,
    domainId,
    isZeroReceiveAllow,
    tempCardProducts,
    setLoadCardProducts,
  } = props;

  //common hooks
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 170;
  const [fetching, setFetching] = useState(false);
  const dispatch = useDispatch();

  // form
  const form = useForm({
    initialValues: {
      vendor_id: "",
      order_process: "",
      narration: "",
      expected_date: "",
    },
    validate: {
      vendor_id: isNotEmpty(),
      expected_date: isNotEmpty(),
    },
  });
  // requistion

  let purchaseSubTotalAmount =
    tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

  const [defaultVendorId, setDefaultVendorId] = useState(null);

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const tempProducts = localStorage.getItem(
            "temp-requisition-products"
          );
          let items = tempProducts ? JSON.parse(tempProducts) : [];
          let createdBy = JSON.parse(localStorage.getItem("user"));
          let transformedArray = items.map((product) => {
            return {
              product_id: product.product_id,
              display_name: product.display_name,
              unit_name: product.unit_name,
              quantity: product.quantity,
              purchase_price: product.purchase_price,
              sales_price: product.sales_price,
              sub_total: product.sub_total,
            };
          });

          const options = { year: "numeric", month: "2-digit", day: "2-digit" };
          const formValue = {};

          formValue["invoice_date"] = values.invoice_date
            ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
            : new Date().toLocaleDateString("en-CA");
          formValue["expected_date"] =
            values.expected_date &&
            new Date(values.expected_date).toLocaleDateString("en-CA", options);
          formValue["remark"] = values.narration;
          formValue["created_by_id"] = createdBy?.id;
          formValue["items"] = transformedArray ? transformedArray : [];
          formValue["process"] = "New";
          formValue["vendor_id"] = form.values.vendor_id;

          const value = {
            url: "inventory/requisition",
            data: formValue,
          };

          const resultAction = await dispatch(storeEntityData(value));

          if (storeEntityData.rejected.match(resultAction)) {
            showNotificationComponent(
              resultAction.payload.message,
              "red",
              "lightgray",
              true,
              1000,
              true
            );
          } else if (storeEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload.data.status === 200) {
              showNotificationComponent(
                resultAction.payload.data.message,
                "teal",
                "lightgray",
                true,
                1000,
                true
              );
              setTimeout(() => {
                localStorage.removeItem("temp-requisition-products");
                form.reset();
                setVendorData(null);
                setVendorObject(null);
                setLoadCardProducts(true);
              }, 700);
            } else {
              showNotificationComponent(
                resultAction.payload.data.message,
                "teal",
                "lightgray",
                true,
                1000,
                true
              );
            }
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
                  textAlign: "right",
                  render: (item) => tempCardProducts.indexOf(item) + 1,
                },
                {
                  accessor: "display_name",
                  title: t("Name"),
                  width: "50%",
                },
                {
                  accessor: "quantity",
                  title: t("Quantity"),
                  width: "10%",
                  render: (item) => {
                    const [editedQuantity, setEditedQuantity] = useState(
                      item.quantity
                    );
                    const handlQuantityChange = (e) => {
                      const editedQuantity = e.currentTarget.value;
                      setEditedQuantity(editedQuantity);

                      const tempCardProducts = localStorage.getItem(
                        "temp-requisition-products"
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
                        "temp-requisition-products",
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
                  accessor: "unit_name",
                  title: t("UOM"),
                  width: "10%",
                  textAlign: "center",
                },
                {
                  accessor: "purchase_price",
                  title: t("Price"),
                  width: "10%",
                  textAlign: "center",
                },

                {
                  accessor: "sub_total",
                  title: t("SubTotal"),
                  width: "15%",
                  textAlign: "right",
                  render: (item) => {
                    return item.sub_total && Number(item.sub_total).toFixed(2);
                  },
                  footer: (
                    <Group spacing="xs" justify="flex-end">
                      <IconSum size="1.25em" />
                      <Text fw={"600"} fz={"md"}>
                        {purchaseSubTotalAmount.toFixed(2)}
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
                          const dataString = localStorage.getItem(
                            "temp-requisition-products"
                          );
                          let data = dataString ? JSON.parse(dataString) : [];

                          data = data.filter(
                            (d) => d.product_id !== item.product_id
                          );

                          const updatedDataString = JSON.stringify(data);

                          localStorage.setItem(
                            "temp-requisition-products",
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
              height={height - 88} // 17
              scrollAreaProps={{ type: "never" }}
            />
          </Box>
        </Box>
        <Box>
          <__RequistionInvoiceoSection
            purchaseSubTotalAmount={purchaseSubTotalAmount}
            form={form}
            currencySymbol={currencySymbol}
            setLoadCardProducts={setLoadCardProducts}
            isSMSActive={isSMSActive}
            defaultVendorId={defaultVendorId}
            setDefaultVendorId={setDefaultVendorId}
          />
        </Box>
      </form>
    </>
  );
}
