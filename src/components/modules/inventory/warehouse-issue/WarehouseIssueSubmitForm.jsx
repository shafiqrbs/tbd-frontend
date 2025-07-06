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

export default function WarehouseIssueSubmitForm(props) {
    const {
        warehouseIssueItems,
        warehousesIssueData,
        setWarehouseIssueItems
    } = props;

    const {id} = useParams();

    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const [fetching, setFetching] = useState(false);
    const dispatch = useDispatch();

    const form = useForm({
        initialValues: {
            invoice_date: '',
            warehouse_id: '',
            created_by_id: '',
            remark: '',
        },
        validate: {
            warehouse_id: isNotEmpty(),
            created_by_id: isNotEmpty(),
        },
    });

    /*useEffect(() => {
        if (warehousesIssueData) {
            setIssueType(String(warehousesIssueData.issue_type) || null);
            setWarehouseId(String(warehousesIssueData.warehouse_id) || null);
            setIssuedById(String(warehousesIssueData.created_by_id) || null);

            form.setValues({
                invoice_date: warehousesIssueData.invoice_date
                    ? dayjs(warehousesIssueData.invoice_date, 'DD-MM-YYYY').toDate()
                    : new Date(),
                // issued_to_type: warehousesIssueData.issued_to_type || '',
                // vendor_id: warehousesIssueData.vendor_id || '',
                warehouse_id: warehousesIssueData.warehouse_id || '',
                created_by_id: warehousesIssueData.created_by_id || '',
                remark: warehousesIssueData.remark || '',
            });
        }
    }, [warehousesIssueData]);*/

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
    const [issueType, setIssueType] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [issuedById, setIssuedById] = useState("");

    const columns = useMemo(() => [
        {
            accessor: "index",
            title: t("S/N"),
            textAlignment: "right",
            width: "50px",
            render: (item) => warehouseIssueItems.indexOf(item) + 1,
        },
        {
            accessor: "display_name",
            title: t("Name"),
            width: "200px",
            footer: (
                <Group spacing="xs">
                    <IconSum size="1.25em"/>
                    <Text mb={-2}>
                        {warehouseIssueItems.length} {t("Items")}
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
                    setWarehouseIssueItems((prevItems) =>
                        prevItems.map((product) =>
                            product.stock_item_id === item.stock_item_id
                                ? {...product, quantity: newQuantity,sub_total:item.purchase_price*newQuantity}
                                : product
                        )
                    );
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
                            const filteredItems = warehouseIssueItems.filter(i => i.id !== item.id);
                            setWarehouseIssueItems(filteredItems);
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
    ], [warehouseIssueItems, setWarehouseIssueItems]);

    const handleFormSubmit = async (values) => {
        const transformedArray = warehouseIssueItems.map((product) => ({
            stock_item_id: product.stock_item_id,
            product_warehouse_id: product?.warehouse_id || null,
            display_name: product.display_name,
            quantity: product.quantity,
            batch_quantity: product?.total_quantity || null,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: product.quantity * product.purchase_price,
            sales_price: product.sales_price,
        }));
        const options = {year: "numeric", month: "2-digit", day: "2-digit"};
        const formValue = {};
        formValue["invoice_date"] = values.invoice_date
            ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
            : new Date().toLocaleDateString("en-CA");
        formValue["created_by_id"] = form.values.created_by_id;
        formValue["warehouse_id"] = form.values.warehouse_id;
        formValue["items"] = transformedArray;
        formValue["remark"] = form.values.remark;

        formValue["items"] = transformedArray;

        const value = {
            url: 'inventory/warehouse-issue',
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
                setWarehouseIssueItems([])
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
                            records={warehouseIssueItems}
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
