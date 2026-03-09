import { isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Text,
    ActionIcon,
    Group,
    Button,
    SimpleGrid,
    Card,
    NumberInput,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import {
    IconSum,
    IconX,
    IconRefresh,
    IconPrinter,
    IconDeviceFloppy,
    IconCalendar,
} from "@tabler/icons-react";
import {useNavigate, useOutletContext} from "react-router-dom";
import genericClass from "../../../../assets/css/Generic.module.css";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import inputCss from "../../../../assets/css/InputField.module.css";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {useDispatch} from "react-redux";

export default function __SalesReturnSubmitForm({
                                                    returnItems,
                                                    setReturnItems,
                                                    selectedSale,
                                                }) {
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 170;

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            invoice_date: new Date(),
            issue_by_id: "",
            narration: "",
        },
        validate: {
            issue_by_id: isNotEmpty(),
        },
    });

    const [salesByDropdownData, setSalesByDropdownData] = useState(null);

    // -------------------- Populate issued by dropdown --------------------
    useEffect(() => {
        const coreUsers = localStorage.getItem("core-users")
            ? JSON.parse(localStorage.getItem("core-users"))
            : [];

        if (coreUsers.length > 0) {
            setSalesByDropdownData(
                coreUsers.map((user, index) => {
                    if (index === 0) {
                        form.setFieldValue("issue_by_id", user.id);
                    }

                    return {
                        label: `${user.username} - ${user.email}`,
                        value: String(user.id),
                    };
                })
            );
        }
    }, []);

    // -------------------- Update stock entry --------------------
    const handleStockEntryChange = (salesItemId, value) => {
        const newStockQty = Number(value) || 0;

        setReturnItems((prev) =>
            prev.map((item) => {
                if (item.sales_item_id !== salesItemId) return item;

                const newTotal = newStockQty + item.damage_entry_quantity;

                if (newTotal > item.available_return_qty) {
                    showNotificationComponent(
                        `${t("TotalCannotExceed")} ${item.available_return_qty}`,
                        "red"
                    );
                }

                return {
                    ...item,
                    stock_entry_quantity: newStockQty,
                    quantity: newTotal,
                };
            })
        );
    };

    // -------------------- Update damage entry --------------------
    const handleDamageEntryChange = (salesItemId, value) => {
        const newDamageQty = Number(value) || 0;

        setReturnItems((prev) =>
            prev.map((item) => {
                if (item.sales_item_id !== salesItemId) return item;

                const newTotal = item.stock_entry_quantity + newDamageQty;

                if (newTotal > item.available_return_qty) {
                    showNotificationComponent(
                        `${t("TotalCannotExceed")} ${item.available_return_qty}`,
                        "red"
                    );
                }

                return {
                    ...item,
                    damage_entry_quantity: newDamageQty,
                    quantity: newTotal,
                };
            })
        );
    };

    // -------------------- Validation --------------------
    const hasInvalidReturnQty = useMemo(() => {
        return returnItems.some(
            (item) =>
                item.stock_entry_quantity + item.damage_entry_quantity >
                item.available_return_qty
        );
    }, [returnItems]);

    const hasZeroQty = useMemo(() => {
        return returnItems.some((item) => item.quantity <= 0);
    }, [returnItems]);

    // -------------------- Remove item --------------------
    const handleRemoveItem = (salesItemId) => {
        setReturnItems((prev) =>
            prev.filter((item) => item.sales_item_id !== salesItemId)
        );
    };

    // -------------------- Submit --------------------
    const handleFormSubmit = async (values) => {
        if (!selectedSale) {
            showNotificationComponent(t("SelectSaleFirst"), "red");
            return;
        }

        if (returnItems.length === 0) {
            showNotificationComponent(t("NoItemsToReturn"), "red");
            return;
        }

        if (hasInvalidReturnQty || hasZeroQty) {
            showNotificationComponent(t("InvalidQuantity"), "red");
            return;
        }

        const submitData = {
            sales_id: selectedSale.id,
            customer_id: selectedSale.customerId,
            invoice_date: values.invoice_date
                ? new Date(values.invoice_date).toLocaleDateString("en-CA")
                : new Date().toLocaleDateString("en-CA"),
            issue_by_id: values.issue_by_id,
            narration: values.narration,
            items: returnItems.map((item) => ({
                sales_item_id: item.sales_item_id,
                product_id: item.product_id,
                quantity: item.quantity,
                stock_entry_quantity: item.stock_entry_quantity,
                damage_entry_quantity: item.damage_entry_quantity,
                warehouse_id: item.warehouse_id,
            })),
        };

        /*if (editedData && editedData.id){
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
        } else {*/
        const value = {
            url: 'inventory/sales/return',
            data: submitData
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
                form.reset();
            }, 100);
            navigate("/inventory/sales-return");
        }
        // }

        // console.log("Sales Return Submit Data:", submitData);

        // showNotificationComponent(t("CreateSuccessfully"), "teal");
    };

    // -------------------- Table columns --------------------
    const columns = useMemo(
        () => [
            {
                accessor: "index",
                title: t("S/N"),
                textAlign: "right",
                render: (item) => returnItems.indexOf(item) + 1,
            },
            {
                accessor: "product_name",
                title: t("Name"),
                footer: (
                    <Group spacing="xs">
                        <IconSum size="1.25em" />
                        <Text mb={-2}>
                            {returnItems.length} {t("Items")}
                        </Text>
                    </Group>
                ),
            },
            {
                accessor: "quantity",
                title: t("Quantity"),
                textAlign: "center",
            },
            {
                accessor: "stock_entry_quantity",
                title: t("StockEntryQty"),
                textAlign: "center",
                render: (item) => (
                    <NumberInput
                        size="xs"
                        min={0}
                        max={item.available_return_qty}
                        value={item.stock_entry_quantity}
                        onChange={(val) =>
                            handleStockEntryChange(item.sales_item_id, val)
                        }
                        hideControls
                    />
                ),
            },
            {
                accessor: "damage_entry_quantity",
                title: t("DamageEntryQty"),
                textAlign: "center",
                render: (item) => (
                    <NumberInput
                        size="xs"
                        min={0}
                        max={item.available_return_qty}
                        value={item.damage_entry_quantity}
                        onChange={(val) =>
                            handleDamageEntryChange(item.sales_item_id, val)
                        }
                        hideControls
                    />
                ),
            },
            {
                accessor: "action",
                title: t("Action"),
                textAlign: "right",
                render: (item) => (
                    <ActionIcon
                        size="sm"
                        variant="outline"
                        radius="xl"
                        onClick={() => handleRemoveItem(item.sales_item_id)}
                    >
                        <IconX size={16} />
                    </ActionIcon>
                ),
            },
        ],
        [returnItems]
    );

    return (
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Box bg="white" p="xs" className="borderRadiusAll">
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                    }}
                    records={returnItems}
                    columns={columns}
                    height={height - 44}
                />
            </Box>

            <SimpleGrid cols={{ base: 1, md: 3 }} mt="xs">

                <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`} padding="xs">
                    <Box mt={8}></Box>
                </Card>
                <Card padding="xs">
                    <DatePickerForm
                        form={form}
                        name="invoice_date"
                        placeholder={t("InvoiceDate")}
                        leftSection={<IconCalendar size={16} />}
                    />

                    <Box mt={8}>
                        <SelectForm
                            name="issue_by_id"
                            form={form}
                            dropdownValue={salesByDropdownData}
                            value={form.values.issue_by_id}
                            changeValue={(val) =>
                                form.setFieldValue("issue_by_id", val)
                            }
                        />
                    </Box>
                </Card>

                <Card padding="xs">
                    <TextAreaForm
                        name="narration"
                        form={form}
                        placeholder={t("Narration")}
                        classNames={inputCss}
                    />
                </Card>
            </SimpleGrid>

            <Box mt={8}>
                <Button.Group>
                    <Button
                        fullWidth
                        leftSection={<IconRefresh size={14} />}
                        onClick={() => {
                            setReturnItems([]);
                            form.reset();
                        }}
                        type="button"
                    >
                        {t("Reset")}
                    </Button>

                    <Button
                        fullWidth
                        type="submit"
                        name="print"
                        leftSection={<IconPrinter size={14} />}
                    >
                        {t("Print")}
                    </Button>

                    <Button
                        fullWidth
                        type="submit"
                        name="save"
                        leftSection={<IconDeviceFloppy size={14} />}
                        disabled={
                            hasInvalidReturnQty ||
                            hasZeroQty ||
                            returnItems.length === 0
                        }
                    >
                        {t("Save")}
                    </Button>
                </Button.Group>
            </Box>
        </form>
    );
}
