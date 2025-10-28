import {isNotEmpty, useForm} from "@mantine/form";
import React, {useEffect, useMemo, useState} from "react";
import {
    Box,
    Text,
    ActionIcon,
    Group,
    TextInput,
    Button,
    SimpleGrid,
    Card,
} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {
    IconSum,
    IconX,
    IconRefresh,
    IconPrinter,
    IconDeviceFloppy,
    IconCalendar,
} from "@tabler/icons-react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {useDispatch} from "react-redux";
import genericClass from "../../../../assets/css/Generic.module.css";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import inputCss from "../../../../assets/css/InputField.module.css";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";

export default function __StockTransferSubmitForm(props) {
    const {stockTransferItems, setStockTransferItems, formWarehouseData, editedData} = props;

    const navigate = useNavigate();
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();

    // ✅ Mantine form setup
    const form = useForm({
        initialValues: {
            invoice_date: new Date(),
            warehouse_id: "",
            created_by_id: "",
            remark: "",
        },
        validate: {
            warehouse_id: isNotEmpty(),
            created_by_id: isNotEmpty(),
        },
    });

    // ✅ Pre-fill form when editing
    useEffect(() => {
        if (editedData) {
            if (editedData.created_date)
                form.setFieldValue("invoice_date", new Date(editedData.created_date));
            if (editedData.to_warehouse_id)
                form.setFieldValue("warehouse_id", String(editedData.to_warehouse_id));
            if (editedData.created_by_id)
                form.setFieldValue("created_by_id", String(editedData.created_by_id));
            if (editedData.notes)
                form.setFieldValue("remark", editedData.notes);
        }
    }, [editedData]);

    // ✅ Sales by (user) dropdown
    const [salesByDropdownData, setSalesByDropdownData] = useState([]);
    useEffect(() => {
        const coreUsers = localStorage.getItem("core-users")
            ? JSON.parse(localStorage.getItem("core-users"))
            : [];
        if (coreUsers && coreUsers.length > 0) {
            const transformedData = coreUsers.map((type) => ({
                label: `${type.username} - ${type.email}`,
                value: String(type.id),
            }));
            setSalesByDropdownData(transformedData);
        }
    }, []);

    // ✅ Warehouse dropdown
    let warehouseDropdownData = getCoreWarehouseDropdownData();
    warehouseDropdownData = warehouseDropdownData.filter(
        (store) => store.value !== formWarehouseData
    );

    // ✅ Table columns
    const columns = useMemo(
        () => [
            {
                accessor: "index",
                title: t("S/N"),
                textAlignment: "right",
                width: "50px",
                render: (item) => stockTransferItems.indexOf(item) + 1,
            },
            {
                accessor: "display_name",
                title: t("Name"),
                width: "200px",
                footer: (
                    <Group spacing="xs">
                        <IconSum size="1.25em"/>
                        <Text mb={-2}>
                            {stockTransferItems.length} {t("Items")}
                        </Text>
                    </Group>
                ),
            },
            {
                accessor: "unit_name",
                title: t("UOM"),
                textAlign: "center",
            },
            {
                accessor: "stock_quantity",
                title: t("Stock"),
                textAlign: "center",
            },
            {
                accessor: "quantity",
                title: t("Quantity"),
                textAlign: "center",
                width: "100px",
                render: (item) => {
                    const handleQuantityChange = (e) => {
                        const newQuantity = Number(e.currentTarget.value);
                        if (newQuantity > item.stock_quantity) {
                            showNotificationComponent(
                                "Quantity must be less than or equal to stock quantity",
                                "red",
                                null,
                                false,
                                1000
                            );
                        } else {
                            setStockTransferItems((prevItems) =>
                                prevItems.map((product) =>
                                    product.stock_item_id === item.stock_item_id
                                        ? {
                                            ...product,
                                            quantity: newQuantity,
                                            sub_total: item.purchase_price * newQuantity,
                                        }
                                        : product
                                )
                            );
                        }
                    };

                    return (
                        <TextInput
                            type="number"
                            size="xs"
                            value={item.quantity ?? ""}
                            onChange={handleQuantityChange}
                        />
                    );
                },
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
                            color="var(--theme-primary-color-6)"
                            onClick={() => {
                                const filteredItems = stockTransferItems.filter((i) => i.id !== item.id);
                                setStockTransferItems(filteredItems);
                            }}
                        >
                            <IconX size={16} style={{width: "70%", height: "70%"}} stroke={1.5}/>
                        </ActionIcon>
                    </Group>
                ),
            },
        ],
        [stockTransferItems, setStockTransferItems]
    );

    // ✅ Form submit handler
    const handleFormSubmit = async (values) => {
        const transformedArray = stockTransferItems.map((product) => ({
            stock_item_id: product.stock_item_id,
            display_name: product.display_name,
            purchase_item_id: product.purchase_item_id,
            quantity: product.quantity,
            stock_quantity: product.stock_quantity,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sales_price: product.sales_price,
            from_warehouse_id: product.from_warehouse_id,
            to_warehouse_id: values.warehouse_id,
            sub_total: product.sub_total,
        }));

        const options = {year: "numeric", month: "2-digit", day: "2-digit"};
        const formValue = {
            invoice_date: values.invoice_date
                ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
                : new Date().toLocaleDateString("en-CA"),
            created_by_id: values.created_by_id,
            from_warehouse_id: formWarehouseData,
            to_warehouse_id: values.warehouse_id,
            items: transformedArray,
            notes: values.remark,
        };

        if (editedData && editedData.id) {
            const value = {
                url: 'inventory/stock/transfer/' + editedData.id,
                data: formValue
            };


            const resultAction = await dispatch(updateEntityData(value));

            if (updateEntityData.rejected.match(resultAction)) {
                showNotificationComponent("Fail to update", "red");
            } else if (updateEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t("UpdatedSuccessfully"), "teal");
                setTimeout(() => {
                    setStockTransferItems([]);
                    form.reset();
                    navigate("/inventory/stock-transfer");
                }, 700);
            }
        } else {
            const value = {
                url: "inventory/stock/transfer",
                data: formValue,
            };

            const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.rejected.match(resultAction)) {
                const fieldErrors = resultAction.payload?.errors;
                if (fieldErrors) {
                    const errorObject = {};
                    Object.keys(fieldErrors).forEach((key) => {
                        errorObject[key] = fieldErrors[key][0];
                    });
                    form.setErrors(errorObject);
                }
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t("CreateSuccessfully"), "teal");

                setTimeout(() => {
                    setStockTransferItems([]);
                    form.reset();
                    navigate("/inventory/stock-transfer");
                }, 700);
            }
        }
    };

    // ✅ Render
    return (
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Box bg="white" p="xs" className="borderRadiusAll">
                <Box className="borderRadiusAll">
                    <DataTable
                        classNames={{
                            root: tableCss.root,
                            table: tableCss.table,
                            header: tableCss.header,
                            footer: tableCss.footer,
                            pagination: tableCss.pagination,
                        }}
                        records={stockTransferItems}
                        columns={columns}
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
                <SimpleGrid cols={{base: 1, md: 3}} mt="2" spacing="xs" mb="xs">
                    {/* Warehouse */}
                    <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                          padding="xs">
                        <Box mt={8}>
                            <SelectForm
                                label=""
                                placeholder="Select warehouse"
                                required
                                name="warehouse_id"
                                form={form}
                                dropdownValue={warehouseDropdownData}
                                value={form.values.warehouse_id}        // ✅ ADD THIS LINE
                                changeValue={(val) => form.setFieldValue("warehouse_id", val)}
                                searchable
                            />

                        </Box>
                    </Card>

                    {/* Invoice date + Issued by */}
                    <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                          padding="xs">
                        <Box>
                            <DatePickerForm
                                tooltip={t("InvoiceDateValidateMessage")}
                                placeholder={t("InvoiceDate")}
                                required={false}
                                name="invoice_date"
                                form={form}
                                id="invoice_date"
                                leftSection={<IconCalendar size={16} opacity={0.5}/>}
                            />
                        </Box>
                        <Box mt={8}>
                            <SelectForm
                                tooltip={t("ChooseIssuedBy")}
                                placeholder={t("ChooseIssuedBy")}
                                required
                                name="created_by_id"
                                form={form}
                                dropdownValue={salesByDropdownData}
                                id="created_by_id"
                                searchable
                                value={form.values.created_by_id}
                                changeValue={(val) => form.setFieldValue("created_by_id", val)}
                            />
                        </Box>
                    </Card>

                    {/* Remark */}
                    <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                          padding="xs">
                        <Box>
                            <TextAreaForm
                                tooltip={t("Narration")}
                                placeholder={t("Narration")}
                                name="remark"
                                form={form}
                                id="remark"
                                classNames={inputCss}
                                autosize
                                minRows={3}
                                maxRows={12}
                            />
                        </Box>
                    </Card>
                </SimpleGrid>
            </Box>

            <Box mt="8" pb="xs">
                <Button.Group>
                    <Button
                        fullWidth
                        variant="filled"
                        leftSection={<IconRefresh size={14}/>}
                        className={genericClass.invoiceReset}
                        onClick={() => form.reset()}
                    >
                        {t("Reset")}
                    </Button>

                    <Button
                        fullWidth
                        variant="filled"
                        type="submit"
                        name="print"
                        leftSection={<IconPrinter size={14}/>}
                        className={genericClass.invoicePrint}
                    >
                        {t("Print")}
                    </Button>

                    <Button
                        fullWidth
                        className={genericClass.invoiceSave}
                        type="submit"
                        name="save"
                        variant="filled"
                        leftSection={<IconDeviceFloppy size={14}/>}
                    >
                        {t("Generate")}
                    </Button>
                </Button.Group>
            </Box>
        </form>
    );
}
