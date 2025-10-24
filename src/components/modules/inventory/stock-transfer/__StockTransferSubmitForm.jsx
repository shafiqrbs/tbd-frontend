import {isNotEmpty, useForm} from "@mantine/form";
import React, {useEffect, useMemo, useState} from "react";
import {
    Box,
    Text,
    ActionIcon,
    Group,
    TextInput,
    Button, SimpleGrid, Card
} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {
    IconSum,
    IconX,
    IconRefresh,
    IconPrinter,
    IconDeviceFloppy
} from "@tabler/icons-react";
import {useOutletContext, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {IconCalendar} from "@tabler/icons-react";
import genericClass from "../../../../assets/css/Generic.module.css";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import inputCss from "../../../../assets/css/InputField.module.css";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import dayjs from "dayjs";
import {storeEntityData, updateEntityData} from "../../../../store/core/crudSlice.js";
import {data} from "../../accounting/balance-entry/BalanceBarChart.jsx";

export default function __StockTransferSubmitForm(props) {
    const {
        stockTransferItems,
        warehousesIssueData,
        setStockTransferItems,
        formWarehouseData
    } = props;

    const {id} = useParams();

    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();

    const form = useForm({
        initialValues: {
            invoice_date: new Date(),
            warehouse_id: '',
            created_by_id: '',
            remark: '',
        },
        validate: {
            warehouse_id: isNotEmpty(),
            created_by_id: isNotEmpty(),
        },
    });


    // sales by user hook
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

    let warehouseDropdownData = getCoreWarehouseDropdownData();
    // Remove the object where value = "2"
    warehouseDropdownData = warehouseDropdownData.filter(store => store.value !== formWarehouseData);

    const [issueType, setIssueType] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [issuedById, setIssuedById] = useState("");

    const columns = useMemo(() => [
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

                    if (item.stock_quantity <=  newQuantity){
                        showNotificationComponent("Quantity must be less than or equal stock quantity", "red", null, false, 1000);
                        return;
                    } else {
                        setStockTransferItems((prevItems) =>
                            prevItems.map((product) =>
                                product.stock_item_id === item.stock_item_id
                                    ? {...product, quantity: newQuantity, sub_total: item.purchase_price * newQuantity}
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
            accessor: "sub_total",
            title: t("Subtotal"),
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
                        color='var(--theme-primary-color-6)'
                        onClick={() => {
                            const filteredItems = stockTransferItems.filter(i => i.id !== item.id);
                            setStockTransferItems(filteredItems);
                        }}
                    >
                        <IconX
                            size={16}
                            style={{width: "70%", height: "70%"}}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Group>
            ),
        },
    ], [stockTransferItems, setStockTransferItems]);

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
        const formValue = {};
        formValue["invoice_date"] = values.invoice_date
            ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
            : new Date().toLocaleDateString("en-CA");
        formValue["created_by_id"] = values.created_by_id;
        formValue["from_warehouse_id"] = formWarehouseData;
        formValue["to_warehouse_id"] = values.warehouse_id;
        formValue["items"] = transformedArray;
        formValue["notes"] = values.remark;

        formValue["items"] = transformedArray;

        const value = {
            url: 'inventory/stock/transfer',
            data: formValue
        }

        const resultAction = await dispatch(storeEntityData(value));
        if (storeEntityData.rejected.match(resultAction)) {
            const fieldErrors = resultAction.payload.errors;
            // Check if there are field validation errors and dynamically set them
            if (fieldErrors) {
                const errorObject = {};
                Object.keys(fieldErrors).forEach(key => {
                    errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                });
                // Display the errors using your form's `setErrors` function dynamically
                form.setErrors(errorObject);
            }
        } else if (storeEntityData.fulfilled.match(resultAction)) {

            showNotificationComponent(t('CreateSuccessfully'), 'teal')

            setTimeout(() => {
                setWarehouseId(null)
                setIssuedById(null)
                setStockTransferItems([])
                form.reset();
            }, 700)
        }
    }


    return (
        <>
            <form onSubmit={form.onSubmit(handleFormSubmit)}>
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
                    <SimpleGrid cols={{base: 1, md: 3}} mt={'2'} spacing="xs" mb={"xs"}>
                        <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                              padding="xs">
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
                                    id={"dynamic_id"}
                                    mt={1}
                                    searchable={true}
                                    value={warehouseId}
                                    changeValue={(val) => setWarehouseId(val)}
                                />
                            </Box>
                        </Card>
                        <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                              padding="xs">
                            <Box className={"borderRadiusAll"}>
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
                                        leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                        rightSectionWidth={30}
                                        closeIcon={true}
                                    />
                                </Box>
                                <Box mt={8}>
                                    <SelectForm
                                        tooltip={t("ChooseIssuedBy")}
                                        label=""
                                        placeholder={t("ChooseIssuedBy")}
                                        required={false}
                                        name={"created_by_id"}
                                        form={form}
                                        dropdownValue={salesByDropdownData}
                                        id={"created_by_id"}
                                        nextField={"save"}
                                        searchable={false}
                                        value={issuedById}
                                        changeValue={(val) => setIssuedById(val)}
                                    />
                                </Box>
                            </Box>
                        </Card>
                        <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                              padding="xs">
                            <Box>
                                <TextAreaForm
                                    tooltip={t('Narration')}
                                    label=""
                                    placeholder={t('Narration')}
                                    required={false}
                                    nextField={'EntityFormSubmit'}
                                    name={'remark'}
                                    form={form}
                                    mt={8}
                                    id={'remark'}
                                    classNames={inputCss}
                                    autosize
                                    minRows={3}
                                    maxRows={12}
                                />
                            </Box>

                        </Card>
                    </SimpleGrid>
                </Box>
                <Box>

                    <Box mt={"8"} pb={"xs"}>
                        <Button.Group>
                            <Button
                                fullWidth={true}
                                variant="filled"
                                leftSection={<IconRefresh size={14}/>}
                                className={genericClass.invoiceReset}
                            >
                                {t("Reset")}
                            </Button>
                            <Button
                                fullWidth={true}
                                variant="filled"
                                type={"submit"}
                                name="print"
                                leftSection={<IconPrinter size={14}/>}
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
                                name="save"
                                variant="filled"
                                leftSection={<IconDeviceFloppy size={14}/>}
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
