import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Group,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import {
  IconBarcode,
  IconDeviceFloppy,
  IconSum,
  IconX,
} from "@tabler/icons-react";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";
import SelectForm from "../../../form-builders/SelectForm";
import { notifications } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import ShortcutInvoice from "../../shortcut/ShortcutInvoice";

export default function _GenericRequisitionForm(props) {
  const { currencySymbol, allowZeroPercentage, isPurchaseByPurchasePrice } =
    props;
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 150;
  const [fetching, setFetching] = useState(false);

  // form variables

  const form = useForm({
    initialValues: {
      product_id: "",
      price: "",
      purchase_price: "",
      barcode: "",
      sub_total: "",
      quantity: "",
    },
    validate: {
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

  const updateProduct = useCallback(() => {
    const storedProducts = localStorage.getItem("core-products");
    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const filteredProducts = localProducts.filter(
      (product) => product.id === Number(form.values.product_id)
    );
    if (filteredProducts.length > 0) {
      const selectedProduct = filteredProducts[0];
      setSelectProductDetails(selectedProduct);

      form.setFieldValue("price", selectedProduct.sales_price);
      form.setFieldValue("sales_price", selectedProduct.sales_price);
      form.setFieldValue("purchase_price", selectedProduct.purchase_price);
      document.getElementById("quantity").focus();
    } else {
      setSelectProductDetails(null);
      form.setFieldValue("price", "");
      form.setFieldValue("sales_price", "");
      form.setFieldValue("purchase_price", "");
      form.setFieldValue("quantity", "");
      form.setFieldValue("sub_total", "");
    }
  }, [form.values.product_id]);

  useEffect(() => {
    updateProduct();
  }, [updateProduct]);

  const [tempCardProducts, setTempCardProducts] = useState([]);
  const [loadCardProducts, setLoadCardProducts] = useState(false);

  useEffect(() => {
    const tempProducts = localStorage.getItem("temp-requisition-products");
    setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : []);
    setLoadCardProducts(false);
  }, [loadCardProducts]);

  let purchaseSubTotalAmount =
    tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

  let totalPurchaseAmount =
    tempCardProducts?.reduce(
      (total, item) => total + item.purchase_price * item.quantity,
      0
    ) || 0;

  // Update subTotal
  const updateSubTotal = useCallback(() => {
    const quantity = Number(form.values.quantity);
    const purchase_price = Number(form.values.purchase_price);

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
      form.setFieldValue("sub_total", quantity * purchase_price);
    }
  }, [form.values.quantity, form.values.purchase_price]);

  //Update Purchase price by subTotal
  const updatePurchasePrice = useCallback(() => {
    const quantity = Number(form.values.quantity);
    const subTotal = Number(form.values.sub_total);

    if (!isNaN(quantity) && !isNaN(subTotal) && quantity > 0 && subTotal >= 0) {
      setSelectProductDetails((prevDetails) => ({
        ...prevDetails,
        purchase_price: subTotal / quantity,
      }));
      form.setFieldValue("purchase_price", subTotal / quantity);
    }
  }, [form.values.sub_total]);

  // updates local stroage ,resets form, sets focus to product search

  function updateLocalStorageAndResetForm(addProducts, type) {
    localStorage.setItem(
      "temp-requisition-products",
      JSON.stringify(addProducts)
    );
    setSearchValue("");
    form.reset();
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
        });
      }
      return acc;
    }, myCardProducts);
    updateLocalStorageAndResetForm(addProducts, "productId");
  }

  // add product based on barcode

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

  useEffect(() => {
    updateSubTotal();
  }, [updateSubTotal]);

  useEffect(() => {
    updatePurchasePrice();
  }, [updatePurchasePrice]);

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

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
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

  return (
    <Box>
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={15}>
          <Box bg={"white"} p={"xs"} className="borderRadiusAll">
            <Box
              pl={"xs"}
              pr={8}
              pt={"xs"}
              mb={"xs"}
              className="borderRadiusAll boxBackground"
            >
              <SelectForm
                tooltip={t("PurchaseValidateMessage")}
                label=""
                placeholder={t("Vendor")}
                required={false}
                nextField={"barcode"}
                name={"vendor_id"}
                form={form}
                dropdownValue={vendorsDropdownData}
                id={"purchase_vendor_id"}
                mt={1}
                searchable={true}
                value={vendorData}
                changeValue={setVendorData}
              />
              <form
                onSubmit={form.onSubmit((values) => {
                  if (!values.barcode && !values.product_id) {
                    form.setFieldError("barcode", true);
                    form.setFieldError("product_id", true);
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
                          form={form}
                          name={"barcode"}
                          id={"barcode"}
                          leftSection={<IconBarcode size={16} opacity={0.5} />}
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
                          form={form}
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
                          nextField={
                            !isPurchaseByPurchasePrice
                              ? "sub_total"
                              : "purchase_price"
                          }
                          form={form}
                          name={"quantity"}
                          id={"quantity"}
                          type={"number"}
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
                          nextField={
                            isPurchaseByPurchasePrice && "EntityFormSubmit"
                          }
                          form={form}
                          name={"purchase_price"}
                          id={"purchase_price"}
                          type={"number"}
                          rightSection={inputGroupCurrency}
                          closeIcon={true}
                          disabled={!isPurchaseByPurchasePrice}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <InputButtonForm
                          tooltip={t("SubTotalValidateMessage")}
                          label=""
                          placeholder={t("SubTotal")}
                          required={true}
                          nextField={"EntityFormSubmit"}
                          form={form}
                          name={"sub_total"}
                          id={"sub_total"}
                          type={"number"}
                          rightSection={inputGroupCurrency}
                          closeIcon={false}
                          disabled={isPurchaseByPurchasePrice ? true : false}
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
                              sub_total:
                                e.currentTarget.value * item.sales_price,
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
                    render: (item) => {
                      const [editedPurchasePrice, setEditedPurchasePrice] =
                        useState(item.purchase_price);
                      const handlePurchasePriceChange = (e) => {
                        const newSalesPrice = e.currentTarget.value;
                        setEditedPurchasePrice(newSalesPrice);
                      };
                      useEffect(() => {
                        const timeoutId = setTimeout(() => {
                          const tempCardProducts = localStorage.getItem(
                            "temp-purchase-products"
                          );
                          const cardProducts = tempCardProducts
                            ? JSON.parse(tempCardProducts)
                            : [];
                          const updatedProducts = cardProducts.map(
                            (product) => {
                              if (product.product_id === item.product_id) {
                                return {
                                  ...product,
                                  purchase_price: editedPurchasePrice,
                                  sub_total:
                                    editedPurchasePrice * item.quantity,
                                };
                              }
                              return product;
                            }
                          );

                          localStorage.setItem(
                            "temp-purchase-products",
                            JSON.stringify(updatedProducts)
                          );
                          setLoadCardProducts(true);
                        }, 1000);

                        return () => clearTimeout(timeoutId);
                      }, [editedPurchasePrice, item.product_id, item.quantity]);

                      return (
                        <>
                          <TextInput
                            type="number"
                            label=""
                            size="xs"
                            id={"inline-update-quantity-" + item.product_id}
                            value={editedPurchasePrice}
                            onChange={handlePurchasePriceChange}
                          />
                        </>
                      );
                    },
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
                      <Group spacing="xs" textAlign={"right"}>
                        <Group spacing="xs">
                          <IconSum size="1.25em" />
                        </Group>
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
                height={height - 17}
                scrollAreaProps={{ type: "never" }}
              />
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={8}>
          <Box bg={"white"} p={"md"} className={"borderRadiusAll"}></Box>
        </Grid.Col>
        <Grid.Col span={1}>
          <Box bg={"white"} pt={16} className={"borderRadiusAll"}>
            <ShortcutInvoice
              form={form}
              FormSubmit={"EntityFormSubmit"}
              Name={"product_id"}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
