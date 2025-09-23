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

import {useForm} from "@mantine/form";
import {
    IconDotsVertical,
    IconRefresh,
    IconShoppingBag,
    IconDeviceFloppy,
    IconSearch,
    IconX,
    IconInfoCircle,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import React, {useEffect, useState} from "react";
import genericClass from "../../../../assets/css/Generic.module.css";
import __PurchaseReturnSubmitForm from "./__PurchaseReturnSubmitForm.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";
import {showEntityData} from "../../../../store/core/crudSlice.js";
import Navigation from "../common/Navigation.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";

export default function _PurchaseReturnForm(props) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 360;
    const form = useForm({ initialValues: {} });

    const [searchValue, setSearchValue] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const [purchaseReturnItems, setPurchaseReturnItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]); // vendors array from backend

    const [vendorsOptions, setVendorsOptions] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const [purchasesOptions, setPurchasesOptions] = useState([]);
    const [selectedReturnType, setSelectedReturnType] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const [itemsOptions, setItemsOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch vendors + purchases
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(
                    showEntityData(`inventory/purchase/return/vendor-wise-purchase-item`)
                ).unwrap();

                if (result?.data?.status === 200) {
                    setData(result?.data?.data);
                } else {
                    showNotificationComponent(
                        t("FailedToFetchData"),
                        "red",
                        null,
                        false,
                        1000
                    );
                }
            } catch (error) {
                console.error("Fetch issue data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    // Filter vendors when return type changes
    useEffect(() => {
        if (!selectedReturnType) {
            setVendorsOptions([]);
            setSelectedVendor(null);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            setPurchaseReturnItems([]);
            return;
        }

        let filteredVendors = [];
        if (selectedReturnType === "General") {
            filteredVendors = data
                .filter((vendor) =>
                    vendor.purchases.some((p) => p.is_requisition === null)
                )
                .map((v) => ({ value: String(v.vendor_id), label: v.vendor_name }));
        } else if (selectedReturnType === "Requisition") {
            filteredVendors = data
                .filter((vendor) =>
                    vendor.purchases.some((p) => p.is_requisition === 1)
                )
                .map((v) => ({ value: String(v.vendor_id), label: v.vendor_name }));
        }

        setVendorsOptions(filteredVendors);
        setSelectedVendor(null);
        setSelectedPurchase(null);
        setItemsOptions([]);
        setSelectedItem(null);
        setPurchaseReturnItems([]);
    }, [selectedReturnType, data]);

    // Filter purchases when vendor changes
    useEffect(() => {
        if (!selectedVendor || !selectedReturnType) {
            setPurchasesOptions([]);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }

        const vendor = data.find(
            (v) => String(v.vendor_id) === String(selectedVendor)
        );
        if (vendor) {
            const purchases = vendor.purchases
                .filter((p) =>
                    selectedReturnType === "General"
                        ? p.is_requisition === null
                        : p.is_requisition === 1
                )
                .map((p) => ({
                    value: String(p.id),
                    label: `${p.invoice} — ${p.created} — ${p.total}`,
                }));

            setPurchasesOptions(purchases);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
        }
    }, [selectedVendor, selectedReturnType, data]);

    // Items when purchase changes
    useEffect(() => {
        if (!selectedPurchase || !selectedVendor) {
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }

        const vendor = data.find(
            (v) => String(v.vendor_id) === String(selectedVendor)
        );
        if (!vendor) return;

        const purchase = vendor.purchases.find(
            (p) => String(p.id) === String(selectedPurchase)
        );
        if (purchase) {
            const items = purchase.items.map((it) => ({
                value: String(it.id),
                label: `${it.item_name} — ${it.quantity}`,
            }));
            setItemsOptions(items);
            setSelectedItem(null);
        }
    }, [selectedPurchase, selectedVendor, data]);

    // Table items
    const selectedTableItems = (() => {
        if (!selectedVendor || !selectedPurchase) return [];
        const vendor = data.find(
            (v) => String(v.vendor_id) === String(selectedVendor)
        );
        if (!vendor) return [];
        const purchase = vendor.purchases.find(
            (p) => String(p.id) === String(selectedPurchase)
        );
        return purchase ? purchase.items : [];
    })();

    // Add all
    const handleFormSubmit = () => {
        const productsToAdd = selectedTableItems.filter(
            (data) => productQuantities[data.id] && Number(productQuantities[data.id]) > 0
        );

        if (productsToAdd.length === 0) {
            showNotificationComponent(t("WeNotifyYouThat"), "red");
            return;
        }

        setPurchaseReturnItems((prevItems) => {
            const updatedItems = [...prevItems];

            productsToAdd.forEach((data) => {
                const quantity = Number(productQuantities[data.id]);

                const productToAdd = {
                    id: data.id,
                    display_name: data.item_name,
                    quantity: Number(quantity),
                    purchase_quantity: Number(data.purchase_quantity),
                    unit_name: data.unit_name,
                    purchase_price: data.purchase_price,
                    sub_total: Number(quantity) * (data.purchase_price ?? 0),
                };

                const existingIndex = updatedItems.findIndex(
                    (item) => String(item.id) === String(productToAdd.id)
                );

                if (existingIndex !== -1) {
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        ...productToAdd,
                    };
                } else {
                    updatedItems.push(productToAdd);
                }
            });

            return updatedItems;
        });
        setProductQuantities({});
        showNotificationComponent(t("ProductAddedSuccessfully"), "green");
    };

    return (
        <>
            <Box>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={1}>
                        <Navigation/>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <form onSubmit={form.onSubmit(handleFormSubmit)}>
                            <Box bg={"white"} p={"md"} pb="0" className={"borderRadiusAll"}>
                                <Box>
                                    <Box mb={"xs"}>
                                        <Grid columns={12} gutter={{base: 2}}>
                                            <Grid.Col span={7}>
                                                <Text fz="md" fw={500} className={classes.cardTitle}>
                                                    {t("PurchaseReturn")}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={5} align="center">
                                                <Group justify="flex-end" align="center" gap={4}>
                                                    <Tooltip
                                                        multiline
                                                        bg='var( --theme-primary-color-8)'
                                                        position="top"
                                                        withArrow
                                                        ta={"center"}
                                                        transitionProps={{duration: 200}}
                                                        label={t("Settings")}
                                                    >
                                                        <ActionIcon
                                                            radius={"xl"}
                                                            variant="transparent"
                                                            size={"md"}
                                                            color="gray"
                                                            mt={"1"}
                                                            aria-label="Settings"
                                                            onClick={() => {}}
                                                        >
                                                            <IconDotsVertical
                                                                style={{width: "100%", height: "70%"}}
                                                                stroke={1.5}
                                                            />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>

                                    <Box pl={`8`} pr={8} mb={"xs"} className={"boxBackground borderRadiusAll"}>
                                        <Box mt={"4"}>
                                            <SelectForm
                                                tooltip={t("ChooseReturnType")}
                                                label=""
                                                placeholder={t("ChooseReturnType")}
                                                required={false}
                                                nextField={"vendor_id"}
                                                name={"return_type"}
                                                form={form}
                                                dropdownValue={['General','Requisition']}
                                                id={"return_type"}
                                                mt={1}
                                                searchable={true}
                                                value={selectedReturnType ? String(selectedReturnType) : ""}
                                                changeValue={setSelectedReturnType}
                                                clearable={false}
                                                disabled={!!selectedReturnType}
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
                                                disabled={!!selectedVendor || !selectedReturnType}
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
                                                                <Button
                                                                    size="compact-xs"
                                                                    color={"#f8eedf"}
                                                                    radius={0}
                                                                    w="80"
                                                                    styles={{
                                                                        root: {
                                                                            height: "26px",
                                                                            borderRadius: 0,
                                                                            borderTopColor: "#905923",
                                                                            borderBottomColor: "#905923",
                                                                            borderRightColor: "#905923",
                                                                            borderLeftColor: "#905923",
                                                                            borderTopLeftRadius: "var(--mantine-radius-sm)",
                                                                            borderBottomLeftRadius: "var(--mantine-radius-sm)",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Text fz={9} fw={400} c={"black"}>
                                                                        {data.purchase_quantity}
                                                                    </Text>
                                                                </Button>
                                                                <Button
                                                                    size="compact-xs"
                                                                    color={"#f8eedf"}
                                                                    radius={0}
                                                                    w="80"
                                                                    styles={{
                                                                        root: {
                                                                            height: "26px",
                                                                            borderRadius: 0,
                                                                            borderTopColor: "#905923",
                                                                            borderBottomColor: "#905923",
                                                                            borderRightColor: "#905923",
                                                                            borderLeftColor: "#905923",
                                                                            borderTopLeftRadius: "var(--mantine-radius-sm)",
                                                                            borderBottomLeftRadius: "var(--mantine-radius-sm)",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Text fz={9} fw={400} c={"black"}>
                                                                        {data.purchase_price}
                                                                    </Text>
                                                                </Button>
                                                                <Button
                                                                    size="compact-xs"
                                                                    color={"#f8eedf"}
                                                                    radius={0}
                                                                    w="50"
                                                                    styles={{
                                                                        root: {
                                                                            height: "26px",
                                                                            borderRadius: 0,
                                                                            borderTopColor: "#905923",
                                                                            borderBottomColor: "#905923",
                                                                            borderRightColor: "#905923",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Text fz={9} fw={400} c={"black"}>
                                                                        {data.unit_name}
                                                                    </Text>
                                                                </Button>
                                                                <Input
                                                                    styles={{
                                                                        input: {
                                                                            fontSize: "var(--mantine-font-size-xs)",
                                                                            fontWeight: 300,
                                                                            lineHeight: 2,
                                                                            textAlign: "center",
                                                                            borderRadius: 0,
                                                                            borderTopColor: "#905923",
                                                                            borderBottomColor: "#905923",
                                                                        },
                                                                    }}
                                                                    size="xxs"
                                                                    w="80"
                                                                    type={"number"}
                                                                    value={productQuantities[data.id] || ""}
                                                                    onChange={(e) => {
                                                                        const value = e.currentTarget.value;
                                                                        if (selectedReturnType=='Requisition') {
                                                                            if (value <= data.purchase_quantity) {
                                                                                setProductQuantities((prev) => ({
                                                                                    ...prev,
                                                                                    [data.id]: value,
                                                                                }));
                                                                            } else {
                                                                                showNotificationComponent('Purchase Quantity ' + data.purchase_quantity + ' but you return ' + value, 'red')
                                                                            }
                                                                        }else {
                                                                            setProductQuantities((prev) => ({
                                                                                ...prev,
                                                                                [data.id]: value,
                                                                            }));
                                                                        }
                                                                    }}
                                                                />
                                                                <Button
                                                                    size="compact-xs"
                                                                    className={genericClass.invoiceAdd}
                                                                    radius={0}
                                                                    w="30"
                                                                    styles={{
                                                                        root: {
                                                                            height: "26px",
                                                                            borderRadius: 0,
                                                                            borderTopRightRadius: "var(--mantine-radius-sm)",
                                                                            borderBottomRightRadius: "var(--mantine-radius-sm)",
                                                                        },
                                                                    }}
                                                                    onClick={() => {
                                                                        const quantity = productQuantities[data.id];

                                                                        if (quantity && Number(quantity) > 0) {
                                                                            const productToAdd = {
                                                                                id: data.id,
                                                                                display_name: data.item_name ,
                                                                                quantity: Number(quantity),
                                                                                purchase_quantity: data.purchase_quantity ?? null,
                                                                                unit_name: data.unit_name,
                                                                                purchase_price: data.purchase_price,
                                                                                sub_total: Number(quantity) * (data.purchase_price ?? 0),
                                                                            };

                                                                            setPurchaseReturnItems(prevItems => {
                                                                                const existingIndex = prevItems.findIndex(
                                                                                    item => String(item.id) === String(productToAdd.id)
                                                                                );

                                                                                if (existingIndex !== -1) {
                                                                                    const updatedItems = [...prevItems];
                                                                                    updatedItems[existingIndex] = {
                                                                                        ...updatedItems[existingIndex],
                                                                                        ...productToAdd,
                                                                                    };
                                                                                    return updatedItems;
                                                                                } else {
                                                                                    return [...prevItems, productToAdd];
                                                                                }
                                                                            });
                                                                            setProductQuantities({});
                                                                        } else {
                                                                            showNotificationComponent(t('InvalidQuantity'), 'red', null, false, 1000)
                                                                        }
                                                                    }}
                                                                >
                                                                    <Flex direction={`column`} gap={0}>
                                                                        <IconShoppingBag size={12}/>
                                                                    </Flex>
                                                                </Button>
                                                            </Group>
                                                        ),
                                                    },
                                                ]}
                                                loaderSize="xs"
                                                loaderColor="grape"
                                                height={ height + 35}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Box mb="xs">
                                    <Grid className={genericClass.genericBackground} columns={12} justify="space-between" align="center">
                                        <Grid.Col span={12}>
                                            <Box>
                                                <Tooltip
                                                    label={t("EnterSearchAnyKeyword")}
                                                    px={16}
                                                    py={2}
                                                    position="top-end"
                                                    color='var(--theme-primary-color-6)'
                                                    withArrow
                                                    offset={2}
                                                    zIndex={100}
                                                    transitionProps={{
                                                        transition: "pop-bottom-left",
                                                        duration: 1000,
                                                    }}
                                                >
                                                    <TextInput
                                                        leftSection={
                                                            <IconSearch size={16} opacity={0.5}/>
                                                        }
                                                        size="sm"
                                                        placeholder={t("ChooseProduct")}
                                                        onChange={(e) => {
                                                            setSearchValue(e.target.value);
                                                        }}
                                                        value={searchValue}
                                                        id={"SearchKeyword"}
                                                        rightSection={
                                                            searchValue ? (
                                                                <Tooltip
                                                                    label={t("Close")}
                                                                    withArrow
                                                                    bg={`red.5`}
                                                                >
                                                                    <IconX
                                                                        color={`red`}
                                                                        size={16}
                                                                        opacity={0.5}
                                                                        onClick={() => {
                                                                            setSearchValue("");
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            ) : (
                                                                <Tooltip
                                                                    label={t("FieldIsRequired")}
                                                                    withArrow
                                                                    position={"bottom"}
                                                                    c={"red"}
                                                                    bg={`red.1`}
                                                                >
                                                                    <IconInfoCircle size={16} opacity={0.5}/>
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
                                                    <IconRefresh style={{width: "100%", height: "70%"}} stroke={1.5}/>
                                                </ActionIcon>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Box pr={"xs"}>
                                                <Button
                                                    size="sm"
                                                    className={genericClass.invoiceAdd}
                                                    type="submit"
                                                    mt={0}
                                                    mr={"xs"}
                                                    w={"100%"}
                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                >
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
                        />
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

