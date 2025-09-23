import {
    Box,
    Grid,
    Text,
    Tooltip,
    ActionIcon,
    Group,
    Button,
    Flex,
    Input,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconDotsVertical,
    IconRefresh,
    IconShoppingBag,
    IconDeviceFloppy,
    IconSearch,
    IconX,
    IconInfoCircle,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showEntityData } from "../../../../store/core/crudSlice.js";
import __PurchaseReturnSubmitForm from "./__PurchaseReturnSubmitForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import Navigation from "../common/Navigation.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import tableCss from "../../../../assets/css/Table.module.css";
import genericClass from "../../../../assets/css/Generic.module.css";

export default function _PurchaseReturnUpdateForm() {
    const { id } = useParams(); // purchase return ID
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 360;

    const form = useForm({ initialValues: {} });

    const [searchValue, setSearchValue] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const [purchaseReturnItems, setPurchaseReturnItems] = useState([]);

    const [data, setData] = useState([]); // full vendor -> purchases -> items payload
    const [selectedReturnType, setSelectedReturnType] = useState(null);

    const [vendorsOptions, setVendorsOptions] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const [purchasesOptions, setPurchasesOptions] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const [itemsOptions, setItemsOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const [editedData, setEditedData] = useState(null);

    // --- Fetch vendors list AND the existing purchase return (edit) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // vendor -> purchases -> items payload
                const result = await dispatch(
                    showEntityData(`inventory/purchase/return/vendor-wise-purchase-item`)
                ).unwrap();

                if (result?.data?.status === 200) {
                    setData(result.data.data);
                } else {
                    showNotificationComponent(t("FailedToFetchData"), "red", null, false, 1000);
                }

                // Fetch the existing purchase return to edit
                const returnRes = await dispatch(
                    showEntityData(`inventory/purchase/return/${id}/edit`)
                ).unwrap();

                if (returnRes?.data?.status === 200) {
                    const returnData = returnRes.data.data;
                    setEditedData(returnData);

                    // set return type first (so dependent effects will run)
                    setSelectedReturnType(String(returnData.return_type));

                    // set vendor/purchase - we set them but they may be validated by the effects below
                    setSelectedVendor(String(returnData.vendor_id));
                    setSelectedPurchase(String(returnData.purchase_id));

                    // load returned items into UI shape
                    const mappedItems = (returnData.purchase_return_items || []).map((it) => ({
                        id: it.purchase_item_id ?? it.id, // depends on API shape
                        display_name: it.item_name,
                        quantity: it.quantity,
                        purchase_quantity: it.purchase_quantity,
                        purchase_price: it.purchase_price,
                        unit_name: it.uom || it.unit_name,
                        sub_total: (it.quantity || 0) * (it.purchase_price || 0),
                    }));
                    setPurchaseReturnItems(mappedItems);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [dispatch, id, t]);

    // --- When return type changes: filter vendors and reset dependents ---
    useEffect(() => {
        if (!selectedReturnType) {
            setVendorsOptions([]);
            setSelectedVendor(null);
            setPurchasesOptions([]);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            setPurchaseReturnItems([]);
            return;
        }

        // filter vendors whose purchases include the matching is_requisition
        const filteredVendors = (data || []).filter((vendor) =>
            vendor.purchases.some((p) =>
                selectedReturnType === "General" ? p.is_requisition === null : p.is_requisition === 1
            )
        ).map((v) => ({ value: String(v.vendor_id), label: v.vendor_name }));

        setVendorsOptions(filteredVendors);

        // if current selectedVendor isn't valid for new return_type, clear vendor & downstream
        const isSelectedVendorValid = filteredVendors.some(v => v.value === String(selectedVendor));
        if (!isSelectedVendorValid) {
            setSelectedVendor(null);
            setPurchasesOptions([]);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            setPurchaseReturnItems([]);
        }
        // else keep existing selectedVendor (useful when loading edited data)
    }, [selectedReturnType, data, selectedVendor]);

    // --- When vendor changes: set purchases (respecting return_type) ---
    useEffect(() => {
        if (!selectedVendor || !selectedReturnType) {
            setPurchasesOptions([]);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }

        const vendor = data.find((v) => String(v.vendor_id) === String(selectedVendor));
        if (!vendor) {
            setPurchasesOptions([]);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }

        const purchases = (vendor.purchases || []).filter((p) =>
            selectedReturnType === "General" ? p.is_requisition === null : p.is_requisition === 1
        ).map((p) => ({
            value: String(p.id),
            label: `${p.invoice} — ${p.created} — ${p.total}`
        }));

        setPurchasesOptions(purchases);

        // if previously selectedPurchase is not in the new list, clear it
        const existingPurchaseValid = purchases.some(p => p.value === String(selectedPurchase));
        if (!existingPurchaseValid) {
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
        }
    }, [selectedVendor, selectedReturnType, data, selectedPurchase]);

    // --- When purchase changes: set itemsOptions ---
    useEffect(() => {
        if (!selectedPurchase || !selectedVendor) {
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }

        const vendor = data.find((v) => String(v.vendor_id) === String(selectedVendor));
        const purchase = vendor?.purchases?.find((p) => String(p.id) === String(selectedPurchase));
        if (!purchase) {
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }

        const items = (purchase.items || []).map((it) => ({
            value: String(it.id),
            label: `${it.item_name} — ${it.quantity}`,
        }));
        setItemsOptions(items);

        // keep selectedItem only if exists in items
        if (!items.some(i => i.value === String(selectedItem))) {
            setSelectedItem(null);
        }
    }, [selectedPurchase, selectedVendor, data, selectedItem]);

    // --- Table items to display ---
    const selectedTableItems = (() => {
        if (!selectedVendor || !selectedPurchase) return [];
        const vendor = data.find((v) => String(v.vendor_id) === String(selectedVendor));
        const purchase = vendor?.purchases?.find((p) => String(p.id) === String(selectedPurchase));
        // Ensure each item contains purchase_quantity if your backend uses that; fallback to quantity
        return (purchase?.items || []).map(it => ({
            ...it,
            purchase_quantity: it.purchase_quantity ?? it.quantity,
        }));
    })();

    // --- Add / Update items in return (AddAll) ---
    const handleFormSubmit = () => {
        const productsToAdd = selectedTableItems.filter(
            (d) => productQuantities[d.id] && Number(productQuantities[d.id]) > 0
        );

        if (!productsToAdd.length) {
            showNotificationComponent(t("WeNotifyYouThat"), "red");
            return;
        }

        setPurchaseReturnItems(prevItems => {
            const updated = [...prevItems];

            productsToAdd.forEach(dataItem => {
                const quantity = Number(productQuantities[dataItem.id]);
                const productToAdd = {
                    id: dataItem.id,
                    display_name: dataItem.item_name,
                    purchase_quantity: Number(dataItem.purchase_quantity ?? dataItem.quantity ?? 0),
                    quantity,
                    unit_name: dataItem.unit_name,
                    purchase_price: dataItem.purchase_price,
                    sub_total: quantity * (dataItem.purchase_price ?? 0),
                };

                const existingIndex = updated.findIndex(it => String(it.id) === String(productToAdd.id));
                if (existingIndex !== -1) {
                    updated[existingIndex] = { ...updated[existingIndex], ...productToAdd };
                } else {
                    updated.push(productToAdd);
                }
            });

            return updated;
        });

        setProductQuantities({});
        showNotificationComponent(t("ProductAddedSuccessfully"), "green");
    };

    // --- UX: Reset vendor/purchase/items but keep return_type ---
    const handleResetVendor = () => {
        setSelectedVendor(null);
        setSelectedPurchase(null);
        setSelectedItem(null);
        setPurchaseReturnItems([]);
        setProductQuantities({});
    };

    return (
        <Box>
            <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={1}>
                    <Navigation />
                </Grid.Col>

                <Grid.Col span={8}>
                    <form onSubmit={form.onSubmit(handleFormSubmit)}>
                        <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
                            <Box mb={"xs"}>
                                <Grid columns={12} gutter={{ base: 2 }}>
                                    <Grid.Col span={7}>
                                        <Text fz="md" fw={500} className={classes.cardTitle}>
                                            {t("PurchaseReturn")}
                                        </Text>
                                    </Grid.Col>

                                    <Grid.Col span={5} align="center">
                                        <Group justify="flex-end" align="center" gap={4}>
                                            <Tooltip
                                                multiline
                                                bg="var( --theme-primary-color-8)"
                                                position="top"
                                                withArrow
                                                ta={"center"}
                                                transitionProps={{ duration: 200 }}
                                                label={t("Settings")}
                                            >
                                                <ActionIcon radius={"xl"} variant="transparent" size={"md"} color="gray" mt={"1"}>
                                                    <IconDotsVertical style={{ width: "100%", height: "70%" }} stroke={1.5} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            <Box mt={"4"}>
                                <SelectForm
                                    tooltip={t("ChooseReturnType")}
                                    label=""
                                    placeholder={t("ChooseReturnType")}
                                    required={false}
                                    nextField={"vendor_id"}
                                    name={"return_type"}
                                    form={form}
                                    dropdownValue={["General", "Requisition"]}
                                    id={"return_type"}
                                    mt={1}
                                    searchable={true}
                                    value={selectedReturnType ? String(selectedReturnType) : ""}
                                    changeValue={(val) => {
                                        setSelectedReturnType(val || null);
                                    }}
                                    clearable={false}
                                    disabled={selectedReturnType}
                                />
                            </Box>

                            <Box mt={"4"}>
                                <SelectForm
                                    tooltip={t("Vendor")}
                                    label=""
                                    placeholder={t("Vendor")}
                                    required={false}
                                    nextField={"purchase_id"}
                                    name={"vendor_id"}
                                    form={form}
                                    dropdownValue={vendorsOptions}
                                    id={"vendor_id"}
                                    mt={2}
                                    searchable={true}
                                    value={selectedVendor ? String(selectedVendor) : ""}
                                    changeValue={setSelectedVendor}
                                    disabled={!selectedReturnType || selectedVendor}
                                    clearable={true}
                                />
                            </Box>

                            <Box mt={"4"}>
                                <SelectForm
                                    tooltip={t("Purchase")}
                                    label=""
                                    placeholder={t("Purchase")}
                                    required={false}
                                    nextField={"item_id"}
                                    name={"purchase_id"}
                                    form={form}
                                    dropdownValue={purchasesOptions}
                                    id={"purchase_id"}
                                    mt={1}
                                    searchable={true}
                                    value={selectedPurchase ? String(selectedPurchase) : ""}
                                    changeValue={setSelectedPurchase}
                                    disabled={!purchasesOptions.length}
                                    clearable={true}
                                />
                            </Box>

                            <Box mt={"xs"}>
                                <DataTable
                                    classNames={{
                                        root: tableCss.root,
                                        table: tableCss.table,
                                        header: tableCss.header,
                                        footer: tableCss.footer,
                                        pagination: tableCss.pagination,
                                    }}
                                    records={selectedTableItems}
                                    columns={[
                                        {
                                            accessor: "item_name",
                                            title: t("Product"),
                                            render: (data, index) => (
                                                <Text fz={11} fw={400}>
                                                    {index + 1}. {data.item_name}
                                                </Text>
                                            ),
                                        },
                                        {
                                            accessor: "purchase_price",
                                            width: 300,
                                            title: t("Quantity / Price / UOM"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group wrap="nowrap" w="100%" gap={0} justify="flex-end" align="center" mx="auto">
                                                    <Button size="compact-xs" color={"#f8eedf"} radius={0} w="80" styles={{ root: { height: "26px", borderRadius: 0 } }}>
                                                        <Text fz={9} fw={400} c={"black"}>{data.purchase_quantity}</Text>
                                                    </Button>
                                                    <Button size="compact-xs" color={"#f8eedf"} radius={0} w="80" styles={{ root: { height: "26px", borderRadius: 0 } }}>
                                                        <Text fz={9} fw={400} c={"black"}>{data.purchase_price}</Text>
                                                    </Button>

                                                    <Button size="compact-xs" color={"#f8eedf"} radius={0} w="50" styles={{ root: { height: "26px", borderRadius: 0 } }}>
                                                        <Text fz={9} fw={400} c={"black"}>{data.unit_name}</Text>
                                                    </Button>

                                                    <Input
                                                        styles={{ input: { fontSize: "var(--mantine-font-size-xs)", fontWeight: 300, lineHeight: 2, textAlign: "center", borderRadius: 0 } }}
                                                        size="xxs"
                                                        w="80"
                                                        type={"number"}
                                                        value={productQuantities[data.id] || ""}
                                                        onChange={(e) => {
                                                            const value = e.currentTarget.value;
                                                            const maxQty = Number(data.purchase_quantity ?? data.quantity ?? 0);
                                                            if (value === "" || Number(value) <= maxQty) {
                                                                setProductQuantities((prev) => ({ ...prev, [data.id]: value }));
                                                            } else {
                                                                showNotificationComponent(`Purchase Quantity ${maxQty} but you return ${value}`, "red");
                                                            }
                                                        }}
                                                    />

                                                    <Button
                                                        size="compact-xs"
                                                        className={genericClass.invoiceAdd}
                                                        radius={0}
                                                        w="30"
                                                        styles={{ root: { height: "26px", borderRadius: 0 } }}
                                                        onClick={() => {
                                                            const quantity = productQuantities[data.id];
                                                            if (quantity && Number(quantity) > 0) {
                                                                const productToAdd = {
                                                                    id: data.id,
                                                                    display_name: data.item_name,
                                                                    quantity: Number(quantity),
                                                                    purchase_quantity: Number(data.purchase_quantity ?? data.quantity ?? 0),
                                                                    unit_name: data.unit_name,
                                                                    purchase_price: data.purchase_price,
                                                                    sub_total: Number(quantity) * (data.purchase_price ?? 0),
                                                                };

                                                                setPurchaseReturnItems(prevItems => {
                                                                    const existingIndex = prevItems.findIndex(item => String(item.id) === String(productToAdd.id));
                                                                    if (existingIndex !== -1) {
                                                                        const updated = [...prevItems];
                                                                        updated[existingIndex] = { ...updated[existingIndex], ...productToAdd };
                                                                        return updated;
                                                                    }
                                                                    return [...prevItems, productToAdd];
                                                                });

                                                                setProductQuantities({});
                                                            } else {
                                                                showNotificationComponent(t('InvalidQuantity'), 'red', null, false, 1000);
                                                            }
                                                        }}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <IconShoppingBag size={12} />
                                                        </Flex>
                                                    </Button>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height + 50}
                                />
                            </Box>

                            <Box mb="xs">
                                <Grid className={genericClass.genericBackground} columns={12} justify="space-between" align="center">
                                    <Grid.Col span={12}>
                                        <Box>
                                            <Tooltip label={t("EnterSearchAnyKeyword")} px={16} py={2} position="top-end" color='var(--theme-primary-color-6)' withArrow offset={2} zIndex={100}>
                                                <TextInput
                                                    leftSection={<IconSearch size={16} opacity={0.5} />}
                                                    size="sm"
                                                    placeholder={t("ChooseProduct")}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    value={searchValue}
                                                    id={"SearchKeyword"}
                                                    rightSection={
                                                        searchValue ? (
                                                            <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                                                                <IconX color={`red`} size={16} opacity={0.5} onClick={() => setSearchValue("")} />
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip label={t("FieldIsRequired")} withArrow position={"bottom"} c={"red"} bg={`red.1`}>
                                                                <IconInfoCircle size={16} opacity={0.5} />
                                                            </Tooltip>
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        </Box>
                                    </Grid.Col>

                                    <Grid.Col span={6}>
                                        <Box pl={"xs"}>
                                            <ActionIcon variant="transparent" size={"lg"} color="grey.6" mt={"1"}>
                                                <IconRefresh style={{ width: "100%", height: "70%" }} stroke={1.5} />
                                            </ActionIcon>
                                        </Box>
                                    </Grid.Col>

                                    <Grid.Col span={4}>
                                        <Box pr={"xs"}>
                                            <Button size="sm" className={genericClass.invoiceAdd} type="submit" mt={0} mr={"xs"} w={"100%"} leftSection={<IconDeviceFloppy size={16} />}>
                                                <Flex direction={`column`} gap={0}>
                                                    <Text fz={12} fw={400}>
                                                        {t("AddAll")}
                                                    </Text>
                                                </Flex>
                                            </Button>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Box>
                    </form>
                </Grid.Col>

                <Grid.Col span={15}>
                    <__PurchaseReturnSubmitForm
                        purchaseReturnItems={purchaseReturnItems}
                        setPurchaseReturnItems={setPurchaseReturnItems}
                        selectedVendor={selectedVendor}
                        selectedReturnType={selectedReturnType}
                        setSelectedVendor={setSelectedVendor}
                        editedData={editedData}
                    />
                </Grid.Col>
            </Grid>
        </Box>
    );
}
