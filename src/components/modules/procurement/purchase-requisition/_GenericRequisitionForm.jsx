import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Group,
  TextInput,
  ActionIcon,
  Input,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import {
  IconBarcode,
  IconDeviceFloppy,
  IconSum,
  IconX,
  IconPrinter,
  IconStackPush,
  IconCalendar,
} from "@tabler/icons-react";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";
import SelectForm from "../../../form-builders/SelectForm";
import { notifications } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import ShortcutInvoice from "../../shortcut/ShortcutInvoice";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import DatePickerForm from "../../../form-builders/DatePicker";

export default function _GenericRequisitionForm(props) {
  const { currencySymbol, allowZeroPercentage, isPurchaseByPurchasePrice } =
    props;
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 150;
  const [fetching, setFetching] = useState(false);

  // form variables

  const productForm = useForm({
    initialValues: {
      vendor_id: "",
      product_id: "",
      price: "",
      purchase_price: "",
      barcode: "",
      sub_total: "",
      quantity: "",
    },
    validate: {
      vendor_id: isNotEmpty(),
      product_id: (value, values) => {
        const isDigitsOnly = /^\d+$/.test(value);
        if (!isDigitsOnly && values.product_id) {
          return true;
        }
        return null;
      },
      quantity: (value, values) => {
        if (values.product_id) {
          const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
          if (!isNumberOrFractional) {
            return true;
          }
        }
        return null;
      },
      purchase_price: (value, values) => {
        if (values.product_id) {
          const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
          if (!isNumberOrFractional) {
            return true;
          }
        }
        return null;
      },
    },
  });

  //second form

  const requisitionForm = useForm({
    initialValues: {
      order_process: "",
      narration: "",
      expected_date: "",
    },
    validate: {
      expected_date: isNotEmpty(),
    },
  });

  // vendor dropdown

  const [vendorData, setVendorData] = useState(null);
  const [vendorsDropdownData, setVendorsDropdownData] = useState([]);

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
  useEffect(() => {
    fetchVendors();
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [productDropdown, setProductDropdown] = useState([]);

  useEffect(() => {
    if (searchValue.length > 0) {
      const storedProducts = localStorage.getItem("core-products");
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
      const lowerCaseSearchTerm = searchValue.toLowerCase();
      const fieldsToSearch = ["product_name"];
      const productFilterData = localProducts.filter((product) =>
        fieldsToSearch.some(
          (field) =>
            product[field] &&
            String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
      const formattedProductData = productFilterData.map((type) => ({
        label: type.product_name,
        value: String(type.id),
      }));
      setProductDropdown(formattedProductData);
    } else {
      setProductDropdown([]);
    }
  }, [searchValue]);

  const [selectProductDetails, setSelectProductDetails] = useState("");

  // form update based on product selection

  useEffect(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const filteredProducts = localProducts.filter(
      (product) => product.id === Number(productForm.values.product_id)
    );
    if (filteredProducts.length > 0) {
      const selectedProduct = filteredProducts[0];
      setSelectProductDetails(selectedProduct);

      productForm.setFieldValue("price", selectedProduct.sales_price);
      productForm.setFieldValue("sales_price", selectedProduct.sales_price);
      productForm.setFieldValue(
        "purchase_price",
        selectedProduct.purchase_price
      );
      document.getElementById("quantity").focus();
    } else {
      setSelectProductDetails(null);
      productForm.setFieldValue("price", "");
      productForm.setFieldValue("sales_price", "");
      productForm.setFieldValue("purchase_price", "");
      productForm.setFieldValue("quantity", "");
      productForm.setFieldValue("sub_total", "");
    }
  }, [productForm.values.product_id]);

  const [tempCardProducts, setTempCardProducts] = useState([]);
  const [loadCardProducts, setLoadCardProducts] = useState(false);

  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-requisition-products");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);

  let purchaseSubTotalAmount =
    tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

  // let totalPurchaseAmount =
  //   tempCardProducts?.reduce(
  //     (total, item) => total + item.purchase_price * item.quantity,
  //     0
  //   ) || 0;

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
  const changeSubTotalbyPrice = (event) => {
    const purchase_price = Number(event.target.value);
    const quantity = Number(productForm.values.quantity);
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

  const changePricebySubtotal = (event) => {
    const subTotal = Number(event.target.value);
    const quantity = Number(productForm.values.quantity);

    if (!isNaN(quantity) && !isNaN(subTotal) && quantity > 0 && subTotal >= 0) {
      setSelectProductDetails((prevDetails) => ({
        ...prevDetails,
        purchase_price: subTotal / quantity,
      }));
      productForm.setFieldValue("purchase_price", subTotal / quantity);
    }
  };

  // temporary requisition invoice create later remove

  if (!localStorage.getItem("temp-requistion-invoice")) {
    localStorage.setItem("temp-requistion-invoice", JSON.stringify([]));
  }
  // if (localStorage.getItem("temp-requistion-invoice")) {
  //   localStorage.removeItem("temp-requistion-invoice");
  // }
  function tempLocalRequisitionInvoice(addInvoice) {
    const existingInvoices = localStorage.getItem("temp-requistion-invoice");
    const invoices = existingInvoices ? JSON.parse(existingInvoices) : [];

    invoices.push(addInvoice);
    localStorage.setItem("temp-requistion-invoice", JSON.stringify(invoices));
  }

  // function tempLocalInvoice()

  // updates local stroage ,resets form, sets focus to product search

  function updateLocalStorageAndResetForm(addProducts, type) {
    localStorage.setItem(
      "temp-requisition-products",
      JSON.stringify(addProducts)
    );
    setSearchValue("");
    productForm.reset();
    setLoadCardProducts(true);
    if (type == "productId") {
      document.getElementById("product_id").focus();
    } else {
      document.getElementById("barcode").focus();
    }
  }

  // Add product based on product id

  function handleAddProductByProductId(values, myCardProducts, localProducts) {
    const addProducts = localProducts.reduce((acc, product) => {
      if (product.id === Number(values.product_id)) {
        acc.push({
          product_id: product.id,
          display_name: product.display_name,
          quantity: Number(values.quantity),
          unit_name: product.unit_name,
          purchase_price: Number(values.purchase_price),
          sub_total: Number(values.sub_total),
          sales_price: Number(product.sales_price),
          vendor_id: productForm.values.vendor_id,
        });
      }
      return acc;
    }, myCardProducts);
    setVendorData(null);
    updateLocalStorageAndResetForm(addProducts, "productId");
  }

  // add product based on barcode
  function createProductFromValues(product) {
    return {
      product_id: product.product_id,
      quantity: product.quantity,
      purchase_price: product.purchase_price,
      sales_price: product.sales_price,
      sub_total: product.sub_total,
      vendor_id: product.vendorId,
    };
  }
  function handleAddProductByBarcode(values, myCardProducts, localProducts) {
    const barcodeExists = localProducts.some(
      (product) => product.barcode === values.barcode
    );
    if (barcodeExists) {
      const addProducts = localProducts.reduce((acc, product) => {
        if (String(product.barcode) === String(values.barcode)) {
          acc.push(createProductFromValues(product));
        }
        return acc;
      }, myCardProducts);
      updateLocalStorageAndResetForm(addProducts, "barcode");
    } else {
      notifications.show({
        loading: true,
        color: "red",
        title: "Product not found with this barcode",
        message: "Data will be loaded in 3 seconds, you cannot close this yet",
        autoClose: 1000,
        withCloseButton: true,
      });
    }
  }

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("product_id").focus();
        },
      ],
    ],
    []
  );

  // focus on choose product on mount
  useEffect(() => {
    const inputElement = document.getElementById("product_id");
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          productForm.reset();
          requisitionForm.reset();
        },
      ],
    ],
    []
  );
  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );
  const inputGroupText = (
    <Text
      ta={"right"}
      style={{ width: "100%", paddingRight: 16 }}
      color={"grey"}
    >
      {selectProductDetails && selectProductDetails.unit_name}
    </Text>
  );

  const inputGroupCurrency = (
    <Text
      ta={"right"}
      style={{ width: "100%", paddingRight: 16, color: "grey" }}
    >
      {currencySymbol}
    </Text>
  );

  const handleClick = () => {};

  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={23}>
          <Grid columns={23} gutter={{ base: 8 }}>
            <Grid.Col span={23}>
              <Box bg={"white"} p={"xs"} className="borderRadiusAll">
                <Grid columns={23} gutter={{ base: 8 }}>
                  <Grid.Col span={15}>
                    <Box
                      pl={"xs"}
                      pr={8}
                      pt={"xs"}
                      mb={"xs"}
                      className="borderRadiusAll boxBackground"
                    >
                      <form
                        onSubmit={productForm.onSubmit((values) => {
                          if (!values.barcode && !values.product_id) {
                            productForm.setFieldError("barcode", true);
                            productForm.setFieldError("product_id", true);
                            setTimeout(() => {}, 1000);
                          } else {
                            const cardProducts = localStorage.getItem(
                              "temp-requisition-products"
                            );
                            const myCardProducts = cardProducts
                              ? JSON.parse(cardProducts)
                              : [];
                            const storedProducts =
                              localStorage.getItem("core-products");
                            const localProducts = storedProducts
                              ? JSON.parse(storedProducts)
                              : [];

                            if (values.product_id && !values.barcode) {
                              handleAddProductByProductId(
                                values,
                                myCardProducts,
                                localProducts
                              );
                            } else if (!values.product_id && values.barcode) {
                              handleAddProductByBarcode(
                                values,
                                myCardProducts,
                                localProducts
                              );
                            }
                          }
                        })}
                      >
                        <SelectForm
                          tooltip={t("ChooseVendor")}
                          label=""
                          placeholder={t("Vendor")}
                          required={false}
                          nextField={"barcode"}
                          name={"vendor_id"}
                          form={productForm}
                          dropdownValue={vendorsDropdownData}
                          id={"purchase_vendor_id"}
                          mt={1}
                          searchable={true}
                          value={vendorData}
                          changeValue={setVendorData}
                        />
                        <Box pt={"xs"}>
                          <Box pb="xs">
                            <Grid columns={24} gutter={{ base: 6 }}>
                              <Grid.Col span={4}>
                                <InputNumberForm
                                  tooltip={t("BarcodeValidateMessage")}
                                  label=""
                                  placeholder={t("Barcode")}
                                  required={true}
                                  nextfield={t("EntityFormSubmit")}
                                  form={productForm}
                                  name={"barcode"}
                                  id={"barcode"}
                                  leftSection={
                                    <IconBarcode size={16} opacity={0.5} />
                                  }
                                />
                              </Grid.Col>
                              <Grid.Col span={8}>
                                <SelectServerSideForm
                                  tooltip={t("ChooseStockProduct")}
                                  lable=""
                                  placeholder={t("ChooseStockProduct")}
                                  required={true}
                                  nextfield={"quantity"}
                                  name={"product_id"}
                                  form={productForm}
                                  id={"product_id"}
                                  searchable={true}
                                  searchValue={searchValue}
                                  setSearchValue={setSearchValue}
                                  dropdownValue={productDropdown}
                                />
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <InputButtonForm
                                  tooltip={t("QuantityValidateMessage")}
                                  label=""
                                  placeholder={t("Quantity")}
                                  required={true}
                                  nextField={"EntityFormSubmit"}
                                  form={productForm}
                                  name={"quantity"}
                                  id={"quantity"}
                                  type={"number"}
                                  onChange={changeSubTotalbyQuantity}
                                  rightSection={inputGroupText}
                                  rightSectionWidth={50}
                                />
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <InputButtonForm
                                  tooltip={t("PurchasePriceValidateMessage")}
                                  label=""
                                  placeholder={t("PurchasePrice")}
                                  required={true}
                                  form={productForm}
                                  name={"purchase_price"}
                                  id={"purchase_price"}
                                  rightSection={inputGroupCurrency}
                                  closeIcon={true}
                                  disabled={true}
                                  onChange={changeSubTotalbyPrice}
                                />
                              </Grid.Col>
                              <Grid.Col span={4}>
                                <InputButtonForm
                                  tooltip={t("SubTotalValidateMessage")}
                                  label=""
                                  placeholder={t("SubTotal")}
                                  required={true}
                                  // nextField={"EntityFormSubmit"}
                                  form={productForm}
                                  name={"sub_total"}
                                  id={"sub_total"}
                                  type={"number"}
                                  rightSection={inputGroupCurrency}
                                  onChange={changePricebySubtotal}
                                  closeIcon={false}
                                  disabled={true}
                                />
                              </Grid.Col>
                              <Grid.Col span={2}>
                                <>
                                  <Button
                                    size="sm"
                                    color={"red.5"}
                                    type="submit"
                                    mt={0}
                                    fullWidth={true}
                                    id={"EntityFormSubmit"}
                                    leftSection={<IconDeviceFloppy size={16} />}
                                  >
                                    <Flex direction={"column"} gap={0}>
                                      <Text fz={12} fw={400}>
                                        {t("Add")}
                                      </Text>
                                    </Flex>
                                  </Button>
                                </>
                              </Grid.Col>
                            </Grid>
                          </Box>
                        </Box>
                      </form>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={8} pb="14">
                    <Box h={"100%"} className="borderRadiusAll boxBackground">
                      <form
                        id="requisitionForm"
                        onSubmit={requisitionForm.onSubmit((values) => {
                          const tempProducts = localStorage.getItem(
                            "temp-requisition-products"
                          );
                          let items = tempProducts
                            ? JSON.parse(tempProducts)
                            : [];
                          let createdBy = JSON.parse(
                            localStorage.getItem("user")
                          );
                          let transformedArray = items.map((product) => {
                            return {
                              product_id: product.product_id,
                              quantity: product.quantity,
                              purchase_price: product.purchase_price,
                              sales_price: product.sales_price,
                              sub_total: product.sub_total,
                              vendor_id: product.vendor_id,
                            };
                          });
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formValue = {};
                          formValue["invoice_id"] =
                            Math.floor(Math.random() * (999999 - 100000 + 1)) +
                            100000;
                          formValue["invoice_date"] =
                            new Date().toLocaleDateString("en-CA");
                          formValue["expected_date"] =
                            requisitionForm.values.expected_date &&
                            new Date(
                              requisitionForm.values.expected_date
                            ).toLocaleDateString("en-CA", options);
                          formValue["narration"] =
                            requisitionForm.values.narration;
                          formValue["created_by_id"] = Number(createdBy["id"]);
                          formValue["items"] = transformedArray
                            ? transformedArray
                            : [];
                          formValue["status"] = "New";

                          console.log(formValue);
                          tempLocalRequisitionInvoice(formValue);
                          localStorage.removeItem("temp-requisition-products");
                          productForm.reset();
                          requisitionForm.reset();
                          setVendorData(null);
                          setLoadCardProducts(true);
                          // const data = {
                          //   url: "inventory/purchase",
                          //   data: formValue,
                          // };

                          // dispatch(storeEntityData(data));
                          // notifications.show({
                          //   color: "teal",
                          //   title: t("CreateSuccessfully"),
                          //   icon: (
                          //     <IconCheck
                          //       style={{ width: rem(18), height: rem(18) }}
                          //     />
                          //   ),
                          //   loading: false,
                          //   autoClose: 700,
                          //   style: { backgroundColor: "lightgray" },
                          // });

                          // setTimeout(() => {
                          //   localStorage.removeItem(
                          //     "temp-requisition-products"
                          //   );
                          //   productForm.reset();
                          //   requisitionForm.reset();
                          //   setVendorData(null);
                          // }, 700);
                        })}
                      >
                        <Grid columns={12} gutter={0}>
                          <Grid.Col span={6}>
                            <Box pt={"xs"} pl="xs" pr="xs">
                              <DatePickerForm
                                tooltip={t("SelectInvoiceDate")}
                                label=""
                                placeholder={t("InvoiceDate")}
                                required={true}
                                nextField={"expected_date"}
                                form={requisitionForm}
                                name={"invoice_date"}
                                id={"invoice_date"}
                                leftSection={
                                  <IconCalendar size={16} opacity={0.5} />
                                }
                                rightSection={
                                  <IconCalendar size={16} opacity={0.5} />
                                }
                                rightSectionWidth={30}
                                closeIcon={true}
                              />
                            </Box>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Box pt={"xs"} pr="xs">
                              <DatePickerForm
                                tooltip={t("SelectExpectedDate")}
                                label=""
                                placeholder={t("ExpectedDate")}
                                required={true}
                                nextField={"narration"}
                                form={requisitionForm}
                                name={"expected_date"}
                                id={"expected_date"}
                                leftSection={
                                  <IconCalendar size={16} opacity={0.5} />
                                }
                                rightSection={
                                  <IconCalendar size={16} opacity={0.5} />
                                }
                                rightSectionWidth={30}
                                closeIcon={true}
                              />
                            </Box>
                          </Grid.Col>
                        </Grid>
                        <Box pt={"xs"} pr="xs" pl="xs">
                          <TextAreaForm
                            tooltip={t("Narration")}
                            label=""
                            style={"style"}
                            placeholder={t("Narration")}
                            required={false}
                            nextField={"requisitionFormSubmit"}
                            name={"narration"}
                            form={requisitionForm}
                            id={"narration"}
                          />
                        </Box>
                      </form>
                    </Box>
                  </Grid.Col>
                </Grid>
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

                            const updatedProducts = cardProducts.map(
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
                                          "inline-update-quantity-" +
                                            item.product_id
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
                        // render: (item) => {
                        //   const [editedPurchasePrice, setEditedPurchasePrice] =
                        //     useState(item.purchase_price);
                        //   const handlePurchasePriceChange = (e) => {
                        //     const newSalesPrice = e.currentTarget.value;
                        //     setEditedPurchasePrice(newSalesPrice);
                        //   };
                        //   useEffect(() => {
                        //     const timeoutId = setTimeout(() => {
                        //       const tempCardProducts = localStorage.getItem(
                        //         "temp-requisition-products"
                        //       );
                        //       const cardProducts = tempCardProducts
                        //         ? JSON.parse(tempCardProducts)
                        //         : [];
                        //       const updatedProducts = cardProducts.map(
                        //         (product) => {
                        //           if (product.product_id === item.product_id) {
                        //             return {
                        //               ...product,
                        //               purchase_price: editedPurchasePrice,
                        //               sub_total:
                        //                 editedPurchasePrice * item.quantity,
                        //             };
                        //           }
                        //           return product;
                        //         }
                        //       );

                        //       localStorage.setItem(
                        //         "temp-requisition-products",
                        //         JSON.stringify(updatedProducts)
                        //       );
                        //       setLoadCardProducts(true);
                        //     }, 1000);

                        //     return () => clearTimeout(timeoutId);
                        //   }, [
                        //     editedPurchasePrice,
                        //     item.product_id,
                        //     item.quantity,
                        //   ]);

                        //   return (
                        //     <>
                        //       <TextInput
                        //         type="number"
                        //         label=""
                        //         size="xs"
                        //         id={"inline-update-quantity-" + item.product_id}
                        //         value={editedPurchasePrice}
                        //         onChange={handlePurchasePriceChange}
                        //       />
                        //     </>
                        //   );
                        // },
                      },

                      {
                        accessor: "sub_total",
                        title: t("SubTotal"),
                        width: "15%",
                        textAlign: "right",
                        render: (item) => {
                          return (
                            item.sub_total && Number(item.sub_total).toFixed(2)
                          );
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
                                let data = dataString
                                  ? JSON.parse(dataString)
                                  : [];

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
                    height={height - 83} // 17
                    scrollAreaProps={{ type: "never" }}
                  />
                </Box>
                <Box
                  mt={"xs"}
                  p={"9"}
                  className="borderRadiusAll boxBackground"
                >
                  <Grid columns={23}>
                    <Grid.Col span={15}></Grid.Col>
                    <Grid.Col span={8}>
                      <Button.Group>
                        <Button
                          fullWidth={true}
                          variant="filled"
                          leftSection={<IconStackPush size={14} />}
                          color="orange.5"
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
                          color="green.5"
                          // disabled={isDisabled}
                          // style={{
                          //     transition: "all 0.3s ease",
                          //     backgroundColor: isDisabled ? "#f1f3f500" : ""
                          // }}
                        >
                          {t("Print")}
                        </Button>

                        <Button
                          fullWidth={true}
                          type="submit"
                          form="requisitionForm"
                          name="save"
                          id="requisitionFormSubmit"
                          variant="filled"
                          leftSection={<IconDeviceFloppy size={14} />}
                          color="cyan.5"
                          // disabled={isDisabled}
                          // style={{
                          //     transition: "all 0.3s ease",
                          //     backgroundColor: isDisabled ? "#f1f3f500" : ""
                          // }}
                        >
                          {t("Save")}
                        </Button>
                      </Button.Group>
                    </Grid.Col>
                  </Grid>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={1}>
          <Box bg={"white"} pt={16} className={"borderRadiusAll"}>
            <ShortcutInvoice
              form={productForm}
              FormSubmit={"EntityFormSubmit"}
              Name={"product_id"}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
