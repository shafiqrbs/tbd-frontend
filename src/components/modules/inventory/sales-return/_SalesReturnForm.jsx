import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Text,
    Button,
    Input,
    Group,
    TextInput,
    ActionIcon,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import {
    IconRefresh,
    IconShoppingBag,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showEntityData } from "../../../../store/core/crudSlice.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useCustomers } from "../../../global-hook/hooks/useCustomers.js";
import Navigation from "../common/Navigation.jsx";
import genericClass from "../../../../assets/css/Generic.module.css";
import tableCss from "../../../../assets/css/Table.module.css";
import __SalesReturnSubmitForm from "./__SalesReturnSubmitForm.jsx";

export default function _SalesReturnForm() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 360;

    const form = useForm({ initialValues: {} });

    // -------------------- Filters --------------------
    const { data: customers } = useCustomers();
    const [customersDropdownData, setCustomersDropdownData] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [invoiceSearch, setInvoiceSearch] = useState("");

    // -------------------- Sales --------------------
    const [salesData, setSalesData] = useState([]);
    const [salesOptions, setSalesOptions] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [salesItems, setSalesItems] = useState([]);

    // -------------------- Return quantities (left side inputs) --------------------
    const [returnQuantities, setReturnQuantities] = useState({});

    // -------------------- Selected return items (right side) --------------------
    const [returnItems, setReturnItems] = useState([]);

    // -------------------- Customers Dropdown --------------------
    useEffect(() => {
        if (!customers) return;
        const transformed = customers.map((c) => ({
            label: `${c.mobile} -- ${c.name}`,
            value: String(c.id),
        }));
        setCustomersDropdownData(transformed);
    }, [customers]);

    // -------------------- Fetch Sales API --------------------
    const fetchSales = async () => {
        try {
            const params = new URLSearchParams();
            if (customerData) params.append("customer_id", customerData);
            if (selectedDate) {
                const formattedDate = selectedDate.toLocaleDateString("en-CA");
                params.append("date", formattedDate);
            }
            if (invoiceSearch) params.append("invoice", invoiceSearch);

            const result = await dispatch(
                showEntityData(`inventory/sales/return/sales-item?${params}`)
            ).unwrap();

            if (result?.data?.status === 200) {
                const sales = result.data.data || [];
                setSalesData(sales);

                const options = sales.map((s) => ({
                    value: String(s.id),
                    label: `${s.invoice} | ${s.customerName} | ${s.created}`,
                }));
                setSalesOptions(options);
                setSelectedSale(null);
                setSalesItems([]);
            }
        } catch (error) {
            console.error(error);
            showNotificationComponent(t("FailedToFetchData"), "red");
        }
    };

    // -------------------- Auto-fetch when filter changes --------------------
    useEffect(() => {
        if (customerData || selectedDate || invoiceSearch) {
            fetchSales();
        }
    }, [customerData, selectedDate, invoiceSearch]);

    // -------------------- Load items for selected sale --------------------
    useEffect(() => {
        if (!selectedSale) {
            setSalesItems([]);
            setReturnQuantities({});
            return;
        }
        const sale = salesData.find((s) => String(s.id) === String(selectedSale));
        if (sale) {
            setSalesItems(sale.sales_items || []);
            setReturnQuantities({});
        }
    }, [selectedSale, salesData]);

    // -------------------- Get selected sale object --------------------
    const getSelectedSaleObject = () => {
        return salesData.find((s) => String(s.id) === String(selectedSale)) || null;
    };

    // -------------------- Update return quantity with validation --------------------
    const handleReturnQuantityChange = (itemId, value, availableQty) => {
        const qty = Number(value) || 0;
        if (qty > availableQty) {
            showNotificationComponent(
                `${t("MaxReturnQuantity")}: ${availableQty}`,
                "red"
            );
            return;
        }
        setReturnQuantities((prev) => ({
            ...prev,
            [itemId]: qty,
        }));
    };

    // -------------------- Build return item object --------------------
    const buildReturnItem = (item, qty) => ({
        sales_item_id: item.id,
        product_id: item.product_id,
        product_name: item.name,
        uom: item.uom,
        quantity: qty,
        stock_entry_quantity: qty,
        damage_entry_quantity: 0,
        available_return_qty: item.available_return_qty,
        warehouse_id: item.warehouse_id,
        price: item.price,
    });

    // -------------------- Add or update item in return list --------------------
    const addToReturnList = (returnItem) => {
        setReturnItems((prev) => {
            const existingIndex = prev.findIndex(
                (ri) => ri.sales_item_id === returnItem.sales_item_id
            );
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = returnItem;
                return updated;
            }
            return [...prev, returnItem];
        });
    };

    // -------------------- Add single item (inline button) --------------------
    const handleAddSingleItem = (item) => {
        const qty = Number(returnQuantities[item.id]) || 0;
        if (qty <= 0 || qty > item.available_return_qty) return;
        addToReturnList(buildReturnItem(item, qty));
        setReturnQuantities((prev) => ({ ...prev, [item.id]: "" }));
    };

    // -------------------- Add all items (form submit) --------------------
    const handleFormSubmit = () => {
        const itemsToAdd = salesItems.filter(
            (item) =>
                returnQuantities[item.id] &&
                Number(returnQuantities[item.id]) > 0 &&
                Number(returnQuantities[item.id]) <= item.available_return_qty
        );

        if (itemsToAdd.length === 0) {
            showNotificationComponent(t("InvalidQuantity"), "red");
            return;
        }

        setReturnItems((prev) => {
            const updated = [...prev];
            itemsToAdd.forEach((item) => {
                const qty = Number(returnQuantities[item.id]);
                const returnItem = buildReturnItem(item, qty);
                const existingIndex = updated.findIndex(
                    (ri) => ri.sales_item_id === item.id
                );
                if (existingIndex !== -1) {
                    updated[existingIndex] = returnItem;
                } else {
                    updated.push(returnItem);
                }
            });
            return updated;
        });

        setReturnQuantities({});
        showNotificationComponent(t("ProductAddedSuccessfully"), "green");
    };

    return (
        <Box>
            <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={1}>
                    <Navigation />
                </Grid.Col>

                {/* ==================== LEFT SIDE ==================== */}
                <Grid.Col span={8}>
                    <form onSubmit={form.onSubmit(handleFormSubmit)}>
                        <Box bg={"white"} className={"borderRadiusAll"}>
                            {/* Header */}
                            <Box m={"xs"}>
                                <Text fz="md" fw={500} className={genericClass.cardTitle}>
                                    {t("SalesReturn")}
                                </Text>
                            </Box>
                            <Box pl={8} pr={8} mb={"xs"} className={"boxBackground borderRadiusAll"}>
                                {/* Customer */}
                                <Box mt={"4"}>
                                    <SelectForm
                                        placeholder={t("ChooseCustomer")}
                                        name={"customer_id"}
                                        form={form}
                                        dropdownValue={customersDropdownData}
                                        value={customerData ? String(customerData) : ""}
                                        changeValue={setCustomerData}
                                        clearable
                                        searchable
                                    />
                                </Box>

                                {/* Date */}
                                <Box mt={"4"}>
                                    <DateInput
                                        placeholder={t("ChooseDate")}
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        valueFormat="YYYY-MM-DD"
                                        clearable
                                    />
                                </Box>

                                {/* Invoice Search */}
                                <Box mt={"4"}>
                                    <TextInput
                                        placeholder={t("SearchInvoice")}
                                        value={invoiceSearch}
                                        onChange={(e) => setInvoiceSearch(e.target.value)}
                                    />
                                </Box>

                                {/* Sales Dropdown */}
                                <Box mt={"4"}>
                                    <SelectForm
                                        placeholder={t("ChooseSale")}
                                        name={"sales_id"}
                                        form={form}
                                        dropdownValue={salesOptions}
                                        value={selectedSale ? String(selectedSale) : ""}
                                        changeValue={setSelectedSale}
                                        clearable
                                        searchable
                                    />
                                </Box>

                                {/* Sales Items Table */}
                                <Box mt={"xs"}>
                                    <DataTable
                                        classNames={{
                                            root: tableCss.root,
                                            table: tableCss.table,
                                            header: tableCss.header,
                                            footer: tableCss.footer,
                                            pagination: tableCss.pagination,
                                        }}
                                        records={salesItems}
                                        height={height + 54}
                                        columns={[
                                            {
                                                accessor: "name",
                                                title: t("Product"),
                                                render: (data, index) => <Text fz={11}>{index + 1}. {data.name}</Text>,
                                            },
                                            {
                                                accessor: "price",
                                                title: t("Quantity / Available / UOM"),
                                                textAlign: "right",
                                                render: (data) => (
                                                    <Group justify="flex-end">
                                                        <Button size="compact-xs">{data.quantity}</Button>
                                                        <Button size="compact-xs">{data.available_return_qty}</Button>
                                                        <Button size="compact-xs">{data.uom}</Button>

                                                        <Input
                                                            w={80}
                                                            type="number"
                                                            min={0}
                                                            max={data.available_return_qty}
                                                            value={returnQuantities[data.id] || ""}
                                                            onChange={(e) => {
                                                                const val = Number(e.currentTarget.value) || 0;
                                                                if (val > data.available_return_qty) {
                                                                    showNotificationComponent(
                                                                        `${t("MaxReturnQuantity")}: ${data.available_return_qty}`,
                                                                        "red"
                                                                    );
                                                                    return;
                                                                }
                                                                setReturnQuantities((prev) => ({
                                                                    ...prev,
                                                                    [data.id]: e.currentTarget.value,
                                                                }));
                                                            }}
                                                        />

                                                        <Button
                                                            size="compact-xs"
                                                            onClick={() => handleAddSingleItem(data)}
                                                        >
                                                            <IconShoppingBag size={12} />
                                                        </Button>
                                                    </Group>
                                                ),
                                            },
                                        ]}
                                    />
                                </Box>

                                {/* Footer Buttons */}
                                <Box mb="xs">
                                    <Grid columns={12}>
                                        <Grid.Col span={6}>
                                            <ActionIcon variant="transparent" size="lg" onClick={fetchSales}>
                                                <IconRefresh />
                                            </ActionIcon>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Button
                                                size="sm"
                                                className={genericClass.invoiceAdd}
                                                type="submit"
                                                w="100%"
                                                leftSection={<IconDeviceFloppy size={16} />}
                                            >
                                                {t("AddAll")}
                                            </Button>
                                        </Grid.Col>
                                    </Grid>
                                </Box>

                            </Box>
                        </Box>
                    </form>
                </Grid.Col>

                {/* ==================== RIGHT SIDE ==================== */}
                <Grid.Col span={15}>
                    <__SalesReturnSubmitForm
                        returnItems={returnItems}
                        setReturnItems={setReturnItems}
                        selectedSale={getSelectedSaleObject()}
                    />
                </Grid.Col>
            </Grid>
        </Box>
    );
}
