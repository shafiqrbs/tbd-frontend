import { isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Text,
    ActionIcon,
    Group,
    TextInput,
    Button,
    SimpleGrid,
    Card
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconSum, IconX, IconRefresh, IconPrinter, IconDeviceFloppy, IconCalendar } from "@tabler/icons-react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import genericClass from "../../../../assets/css/Generic.module.css";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import inputCss from "../../../../assets/css/InputField.module.css";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";

export default function __PurchaseReturnSubmitForm({
                                                       purchaseReturnItems,
                                                       setPurchaseReturnItems,
                                                       selectedVendor,
                                                       setSelectedVendor,
                                                        editedData,
                                                       selectedReturnType
                                                   }) {
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 170;
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            invoice_date: editedData?.invoice_date?new Date(editedData?.invoice_date) : new Date(),
            issue_by_id: editedData?.issue_by_id?String(editedData?.issue_by_id):'',
            narration: editedData?.narration?editedData?.narration:''
        },
        validate: {
            issue_by_id: isNotEmpty(),
        },
    });


    useEffect(() => {
        editedData?.invoice_date && form.setFieldValue('invoice_date',new Date(editedData?.invoice_date))
        editedData?.issue_by_id && form.setFieldValue('issue_by_id',String(editedData?.issue_by_id))
        editedData?.narration && form.setFieldValue('narration',editedData?.narration)
    }, [editedData]);

    const [salesByDropdownData, setSalesByDropdownData] = useState(null);

    // populate issued by
    useEffect(() => {
        const coreUsers = localStorage.getItem("core-users")
            ? JSON.parse(localStorage.getItem("core-users"))
            : [];
        if (coreUsers.length > 0) {
            setSalesByDropdownData(coreUsers.map((user, index) => {
                if (index === 0) {
                    form.setFieldValue('issue_by_id', user.id);
                }
                return {
                    label: `${user.username} - ${user.email}`,
                    value: String(user.id)
                };
            }));
        }
    }, []);

    // DataTable columns
    const columns = useMemo(() => [
        {
            accessor: "index",
            title: t("S/N"),
            textAlignment: "right",
            width: "50px",
            render: (item) => purchaseReturnItems.indexOf(item) + 1,
        },
        {
            accessor: "display_name",
            title: t("Name"),
            width: "200px",
            footer: (
                <Group spacing="xs">
                    <IconSum size="1.25em" />
                    <Text mb={-2}>{purchaseReturnItems.length} {t("Items")}</Text>
                </Group>
            ),
        },
        {
            accessor: "unit_name",
            title: t("UOM"),
            textAlign: "center",
        },
        {
            accessor: "purchase_quantity",
            title: t("PurchaseQuantity"),
            textAlign: "center",
            hidden: selectedReturnType=='General'?true:false
        },
        {
            accessor: "quantity",
            title: t("Quantity"),
            textAlign: "center",
            width: "100px",
            render: (item) => {
                const handleQuantityChange = (e) => {
                    const newQuantity = Number(e.currentTarget.value || 0);
                    if (selectedReturnType=='Requisition') {
                        if (newQuantity <= item.purchase_quantity) {
                            setPurchaseReturnItems((prevItems) =>
                                prevItems.map((product) =>
                                    product.id === item.id
                                        ? {
                                            ...product,
                                            quantity: newQuantity,
                                            sub_total: Number(product.purchase_price || 0) * newQuantity
                                        }
                                        : product
                                )
                            );
                        } else {
                            showNotificationComponent('Purchase Quantity ' + item.purchase_quantity + ' but you return ' + newQuantity, 'red')
                        }
                    }else {
                        setPurchaseReturnItems((prevItems) =>
                            prevItems.map((product) =>
                                product.id === item.id
                                    ? {
                                        ...product,
                                        quantity: newQuantity,
                                        sub_total: Number(product.purchase_price || 0) * newQuantity
                                    }
                                    : product
                            )
                        );
                    }
                };
                return <TextInput type="number" size="xs" value={item.quantity ?? ""} onChange={handleQuantityChange} />;
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
                        onClick={() => setPurchaseReturnItems(prev => prev.filter(i => i.id !== item.id))}
                    >
                        <IconX size={16} style={{ width: "70%", height: "70%" }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            ),
        },
    ], [purchaseReturnItems]);

    // handle form submit
    const handleFormSubmit = async (values) => {
        if (!selectedVendor) {
            showNotificationComponent(t('SelectVendorFirst'), 'red');
            return;
        }

        const transformedArray = purchaseReturnItems.map(product => ({
            id: product.id,
            display_name: product.display_name,
            quantity: product.quantity,
            purchase_quantity: product.purchase_quantity,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: Number(product.quantity || 0) * Number(product.purchase_price || 0),
            sales_price: product.sales_price,
        }));

        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const formValue = {
            invoice_date: values.invoice_date
                ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
                : new Date().toLocaleDateString("en-CA"),
            issue_by_id: form.values.issue_by_id,
            vendor_id: selectedVendor,
            items: transformedArray,
            narration: form.values.narration,
            return_type: selectedReturnType
        };

        if (editedData && editedData.id){
            const value = {
                url: 'inventory/purchase/return/'+editedData.id,
                data: formValue
            };

            const resultAction = await dispatch(updateEntityData(value));

            if (updateEntityData.rejected.match(resultAction)) {
                showNotificationComponent("Fail to update", "red");
            } else if (updateEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t("UpdatedSuccessfully"), "teal");
                navigate("/inventory/purchase-return");
            }
        } else {
            const value = {
                url: 'inventory/purchase/return',
                data: formValue
            };
            const resultAction = await dispatch(storeEntityData(value));
            if (storeEntityData.rejected.match(resultAction)) {
                const fieldErrors = resultAction.payload.errors;
                if (fieldErrors) {
                    const errorObject = {};
                    Object.keys(fieldErrors).forEach(key => {
                        errorObject[key] = fieldErrors[key][0];
                    });
                    form.setErrors(errorObject);
                }
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent(t('CreateSuccessfully'), 'teal');
                setTimeout(() => {
                    setSelectedVendor(null);
                    setPurchaseReturnItems([]);
                    form.reset();
                }, 100);
                navigate("/inventory/purchase-return");
            }
        }
    };

    return (
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
                        records={purchaseReturnItems}
                        columns={columns}
                        fetching={false}
                        totalRecords={purchaseReturnItems.length}
                        recordsPerPage={10}
                        loaderSize="xs"
                        loaderColor="grape"
                        height={height - 44}
                    />
                </Box>
            </Box>

            <SimpleGrid cols={{ base: 1, md: 3 }} mt={'2'} spacing="xs" mb={"xs"}>
                <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`} padding="xs">
                    <Box mt={8}></Box>
                </Card>

                <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`} padding="xs">
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
                                leftSection={<IconCalendar size={16} opacity={0.5} />}
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
                                name={"issue_by_id"}
                                form={form}
                                dropdownValue={salesByDropdownData}
                                id={"issue_by_id"}
                                nextField={"save"}
                                searchable={false}
                                value={form.values.issue_by_id}
                                changeValue={(val) => form.setFieldValue('issue_by_id', val)}
                            />
                        </Box>
                    </Box>
                </Card>

                <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`} padding="xs">
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

            <Box mt={"8"} pb={"xs"}>
                <Button.Group>
                    <Button fullWidth variant="filled" leftSection={<IconRefresh size={14} />} className={genericClass.invoiceReset}>
                        {t("Reset")}
                    </Button>
                    <Button fullWidth variant="filled" type={"submit"} name="print" leftSection={<IconPrinter size={14} />} className={genericClass.invoicePrint}>
                        {t("Print")}
                    </Button>
                    <Button fullWidth className={genericClass.invoiceSave} type={"submit"} name="save" variant="filled" leftSection={<IconDeviceFloppy size={14} />}>
                        {t("Generate")}
                    </Button>
                </Button.Group>
            </Box>
        </form>
    );
}
