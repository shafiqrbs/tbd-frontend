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
import getCoreWarehouseDropdownData from "../../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import getVendorDropdownData from "../../../../global-hook/dropdown/getVendorDropdownData.js";
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
    initialValues: {},
    validate: {},
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
  let warehouseDropdownData = getCoreWarehouseDropdownData();
  let vendorDropdownData = getVendorDropdownData();
  const [issueType, setIssueType] = useState("");
  const [factoryId, setFactoryId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [issuedById, setIssuedById] = useState("");
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log("hola", factoryId);
          const tempProducts = localStorage.getItem("temp-production-issue");
          const items = tempProducts ? JSON.parse(tempProducts) : [];
          const createdBy = JSON.parse(localStorage.getItem("user"));

          const transformedArray = items.map((product) => ({
            product_id: product.product_id,
            display_name: product.display_name,
            quantity: product.quantity,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: product.sub_total,
            sales_price: product.sales_price,
          }));
          const options = { year: "numeric", month: "2-digit", day: "2-digit" };
          const formValue = {};
          formValue["created_by_id"] = Number(createdBy?.id);
          formValue["invoice_date"] = values.invoice_date
            ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
            : new Date().toLocaleDateString("en-CA");
          formValue["issued_by"] = form.values.issued_by;
          formValue["issueType"] = issueType;
          if (factoryId) {
            formValue["factory_id"] = form.values.factory_id;
          }
          if (vendorId) {
            formValue["vendor_id"] = form.values.vendor_id;
          }
          if (warehouseId) {
            formValue["warehouse_id"] = form.values.warehouse_id;
          }
          formValue["items"] = transformedArray;

          console.log("Form submission values:", formValue);
          form.reset();
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
                  accessor: "stock",
                  title: t("Stock"),
                  textAlign: "center",
                },
                {
                  accessor: "requirement_stock",
                  title: t("RequirementStock"),
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
              height={height - 44}
            />
          </Box>
        </Box>
        <Box>
          <Grid columns={24} gutter={{ base: 6 }} pt={"6"}>
            <Grid.Col span={8}>
              <Box
                p={"xs"}
                className={genericClass.genericSecondaryBg}
                h={100}
              ></Box>
            </Grid.Col>
            <Grid.Col span={8}>
              <Box className={"borderRadiusAll"}>
                <ScrollArea
                  h={100}
                  scrollbarSize={2}
                  type="never"
                  bg={"gray.1"}
                >
                  <Box
                    pl={"xs"}
                    pt={"xs"}
                    pr={"xs"}
                    className={genericClass.genericSecondaryBg}
                    h={100}
                    pb={"10"}
                  >
                    <Box>
                      <SelectForm
                        tooltip={t("IssuedTo")}
                        label={t("")}
                        placeholder={t("IssuedTo")}
                        required={true}
                        nextField={
                          issueType === "factory"
                            ? "factory_id"
                            : issueType === "vendor"
                            ? "vendor_id"
                            : "warehouse_id"
                        }
                        name={"issued_to_type"}
                        form={form}
                        dropdownValue={[
                          { label: t("Factory"), value: "factory" },
                          { label: t("Vendor"), value: "vendor" },
                          { label: t("Warehouse"), value: "warehouse" },
                        ]}
                        id={"issued_to_type"}
                        mt={1}
                        searchable={false}
                        value={issueType}
                        changeValue={setIssueType}
                      />
                    </Box>

                    {issueType === "factory" && (
                      <Box mt={8}>
                        <SelectForm
                          tooltip={t("ChooseFactory")}
                          label={t("")}
                          placeholder={t("ChooseFactory")}
                          required={true}
                          nextField={"invoice_date"}
                          name={"factory_id"}
                          form={form}
                          dropdownValue={[
                            { label: t("FactoryOne"), value: "1" },
                            { label: t("FactoryTwo"), value: "2" },
                          ]}
                          id={"factory_id"}
                          mt={1}
                          searchable={true}
                          value={factoryId}
                          changeValue={setFactoryId}
                        />
                      </Box>
                    )}

                    {issueType === "vendor" && (
                      <Box mt={8}>
                        <SelectForm
                          tooltip={t("ChooseVendor")}
                          label={t("")}
                          placeholder={t("ChooseVendor")}
                          required={true}
                          nextField={"invoice_date"}
                          name={"vendor_id"}
                          form={form}
                          dropdownValue={vendorDropdownData}
                          id={"vendor_id"}
                          mt={1}
                          searchable={true}
                          value={vendorId}
                          changeValue={setVendorId}
                        />
                      </Box>
                    )}

                    {issueType === "warehouse" && (
                      <Box mt={8}>
                        <SelectForm
                          tooltip={t("ChooseWarehouse")}
                          label={t("")}
                          placeholder={t("ChooseWarehouse")}
                          required={true}
                          nextField={"invoice_date"}
                          name={"warehouse_id"}
                          form={form}
                          dropdownValue={warehouseDropdownData}
                          id={"warehouse_id"}
                          mt={1}
                          searchable={true}
                          value={warehouseId}
                          changeValue={(val) => setWarehouseId(val)}
                        />
                      </Box>
                    )}
                  </Box>
                </ScrollArea>
              </Box>
            </Grid.Col>
            <Grid.Col span={8}>
              <Box className={genericClass.genericSecondaryBg} p={"xs"} h={100}>
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
                    tooltip={t("ChooseIssuedBy")}
                    label=""
                    placeholder={t("ChooseIssuedBy")}
                    required={false}
                    name={"issued_by"}
                    form={form}
                    dropdownValue={salesByDropdownData}
                    id={"issued_by"}
                    nextField={"save"}
                    searchable={false}
                    value={issuedById}
                    changeValue={(val) => setIssuedById(val)}
                  />
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
          <Box mt={"8"} pb={"xs"}>
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
