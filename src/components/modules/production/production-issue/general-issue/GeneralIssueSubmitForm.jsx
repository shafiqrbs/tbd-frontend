import {useForm} from "@mantine/form";
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
import tableCss from "../../../../../assets/css/Table.module.css";
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
import genericClass from "../../../../../assets/css/Generic.module.css";
import DatePickerForm from "../../../../form-builders/DatePicker.jsx";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import getVendorDropdownData from "../../../../global-hook/dropdown/getVendorDropdownData.js";
import classes from "../../../../../assets/css/FeaturesCards.module.css";
import TextAreaForm from "../../../../form-builders/TextAreaForm";
import inputCss from "../../../../../assets/css/InputField.module.css";
import {showNotificationComponent} from "../../../../core-component/showNotificationComponent.jsx";
import dayjs from "dayjs";
import {updateEntityData} from "../../../../../store/core/crudSlice.js";

export default function GeneralIssueSubmitForm(props) {
    const {
        productionsRecipeItems,
        productionsIssueData,
        setProductionsRecipeItems
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
            issued_to_type: '',
            factory_id: '',
            vendor_id: '',
            warehouse_id: '',
            issued_by_id: '',
            narration: '',
        },
        validate: {
            // issued_to_type: isNotEmpty(t('ChooseIssueType')),
        },
    });

    useEffect(() => {
        if (productionsIssueData) {
            setIssueType(String(productionsIssueData.issue_type) || null);
            setWarehouseId(String(productionsIssueData.issue_warehouse_id) || null);
            setVendorId(String(productionsIssueData.vendor_id) || null);
            setIssuedById(String(productionsIssueData.issued_by_id) || null);

            form.setValues({
                invoice_date: productionsIssueData.invoice_date
                    ? dayjs(productionsIssueData.invoice_date, 'DD-MM-YYYY').toDate()
                    : new Date(),
                issued_to_type: productionsIssueData.issued_to_type || '',
                vendor_id: productionsIssueData.vendor_id || '',
                warehouse_id: productionsIssueData.warehouse_id || '',
                issued_by_id: productionsIssueData.issued_by_id || '',
                narration: productionsIssueData.narration || '',
            });
        }
    }, [productionsIssueData]);

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
    let vendorDropdownData = getVendorDropdownData();
    const [issueType, setIssueType] = useState("");
    const [factoryId, setFactoryId] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [issuedById, setIssuedById] = useState("");

    const columns = useMemo(() => [
        {
            accessor: "index",
            title: t("S/N"),
            textAlignment: "right",
            width: "50px",
            render: (item) => productionsRecipeItems.indexOf(item) + 1,
        },
        {
            accessor: "display_name",
            title: t("Name"),
            width: "200px",
            footer: (
                <Group spacing="xs">
                    <IconSum size="1.25em"/>
                    <Text mb={-2}>
                        {productionsRecipeItems.length} {t("Items")}
                    </Text>
                </Group>
            ),
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
                    setProductionsRecipeItems((prevItems) =>
                        prevItems.map((product) =>
                            product.stock_item_id === item.stock_item_id
                                ? {...product, quantity: newQuantity}
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
                            // const dataString = localStorage.getItem("temp-production-issue");
                            // let data = dataString ? JSON.parse(dataString) : [];
                            //
                            // data = data.filter((d) => d.product_id !== item.product_id);
                            //
                            // const updatedDataString = JSON.stringify(data);

                            // localStorage.setItem("temp-production-issue", updatedDataString);
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
    ], [productionsRecipeItems, setProductionsRecipeItems]);

    const handleFormSubmit = async (values) => {
        const transformedArray = productionsRecipeItems.map((product) => ({
            stock_item_id: product.stock_item_id,
            product_warehouse_id: product?.warehouse_id || null,
            display_name: product.display_name,
            quantity: product.quantity,
            batch_quantity: product?.total_quantity || null,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: product.quantity * product.sales_price,
            sales_price: product.sales_price,
        }));
        const options = {year: "numeric", month: "2-digit", day: "2-digit"};
        const formValue = {};
        formValue["issue_date"] = values.invoice_date
            ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
            : new Date().toLocaleDateString("en-CA");
        formValue["issued_by_id"] = form.values.issued_by_id;
        formValue["issue_type"] = issueType;
        formValue["type"] = 'general';
        if (issueType === "factory") {
            formValue["factory_id"] = form.values.factory_id;
        } else if (issueType === "vendor") {
            formValue["vendor_id"] = form.values.vendor_id;
        } else if (issueType === "warehouse") {
            formValue["issue_warehouse_id"] = form.values.warehouse_id;
        }
        formValue["items"] = transformedArray;
        formValue["narration"] = form.values.narration;

        formValue["items"] = transformedArray;

        const value = {
            url: 'production/issue/' + id,
            data: formValue
        }

        const resultAction = await dispatch(updateEntityData(value));
        if (updateEntityData.rejected.match(resultAction)) {
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
        } else if (updateEntityData.fulfilled.match(resultAction)) {

            showNotificationComponent(t('CreateSuccessfully'), 'teal')

            setTimeout(() => {
                setFactoryId(null)
                setVendorId(null)
                setIssueType(null)
                setWarehouseId(null)
                setIssuedById(null)
                setProductionsRecipeItems([])
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
                            records={productionsRecipeItems}
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
                            <Box>
                                <SelectForm
                                    tooltip={t("IssuedTo")}
                                    label={t("")}
                                    placeholder={t("IssuedTo")}
                                    required={true}
                                    nextField={'dynamic_id'}
                                    name={"issued_to_type"}
                                    form={form}
                                    dropdownValue={[
                                        // {label: t("Factory"), value: "factory"},
                                        {label: t("Vendor"), value: "vendor"},
                                        {label: t("Warehouse"), value: "warehouse"},
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
                                            {label: t("FactoryOne"), value: "1"},
                                            {label: t("FactoryTwo"), value: "2"},
                                        ]}
                                        id={"dynamic_id"}
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
                                        id={"dynamic_id"}
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
                                        id={"dynamic_id"}
                                        mt={1}
                                        searchable={true}
                                        value={warehouseId}
                                        changeValue={(val) => setWarehouseId(val)}
                                    />
                                </Box>
                            )}
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
                                        name={"issued_by_id"}
                                        form={form}
                                        dropdownValue={salesByDropdownData}
                                        id={"issued_by_id"}
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
                                    name={'narration'}
                                    form={form}
                                    mt={8}
                                    id={'narration'}
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
