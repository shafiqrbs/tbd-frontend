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
import {useOutletContext, useParams} from "react-router-dom";
import React, {useEffect, useState, useMemo} from "react";
import genericClass from "../../../../assets/css/Generic.module.css";
import __PurchaseReturnSubmitForm from "./__PurchaseReturnSubmitForm.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";
import {showEntityData} from "../../../../store/core/crudSlice.js";
import Navigation from "../common/Navigation.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";

// ➤ Debounce hook
function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

// ➤ Helper functions
const getUserData = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
        console.error("Error parsing localStorage user:", e);
        return {};
    }
};

const getCoreProducts = () => {
    try {
        return JSON.parse(localStorage.getItem("core-products") || "[]");
    } catch (e) {
        console.error("Error parsing core-products:", e);
        return [];
    }
};

export default function _PurchaseReturnForm(props) {
    const {domainConfigData} = props;
    const {id} = useParams();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 360;
    const form = useForm({
        initialValues: {},
    });

    const isWarehouse = domainConfigData?.production_config?.is_warehouse;
    const [warehouseDropdownData, setWarehouseDataDropdown] = useState([]);
    const [warehouseData, setWarehouseData] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const [warehouseIssueItems, setWarehouseIssueItems] = useState([]);
    const [warehousesIssueData, setWarehousesIssueData] = useState({});

    // Cache user data & core products using memo
    const userData = useMemo(() => getUserData(), []);
    const coreProducts = useMemo(() => getCoreProducts(), []);
    const debouncedSearchValue = useDebouncedValue(searchValue, 250);

    // Load issue data from API
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const result = await dispatch(showEntityData(`production/issue/${id}`)).unwrap();
                    if (result.data.status === 200) {
                        setWarehousesIssueData(result.data.data);
                        setWarehouseIssueItems(result.data.data.issue_items);
                    } else {
                        showNotificationComponent(t("FailedToFetchData"), "red", null, false, 1000);
                    }
                } catch (error) {
                    console.error("Fetch issue data error:", error);
                }
            }
        };

        fetchData();
    }, [dispatch, id]);

    // Load warehouse dropdown data
    useEffect(() => {
        if (isWarehouse && userData?.user_warehouse?.length > 0) {
            const transformed = userData.user_warehouse.map((wh) => ({
                label: `${wh.warehouse_name} [${wh.warehouse_location}]`,
                value: String(wh.id),
            }));
            setWarehouseDataDropdown(transformed);
            setWarehouseData(userData.user_warehouse[0].id);
        }
    }, [isWarehouse, userData]);

    // ➤ Memoized filtered products
    const filteredProducts = useMemo(() => {
        let filtered = [];

        if (isWarehouse) {
            const warehouseId = warehouseData || userData?.user_warehouse?.[0]?.id;
            const prodItems = userData?.production_item || [];

            filtered = prodItems.filter((product) => product.user_warehouse_id === Number(warehouseId));

            if (debouncedSearchValue) {
                const search = debouncedSearchValue.toLowerCase();
                filtered = filtered.filter((product) =>
                    `${product.item_name} ${product.uom} ${product.closing_quantity}`
                        .toLowerCase()
                        .includes(search)
                );
            }
        } else {
            filtered = coreProducts.filter((product) => product.product_nature === "raw-materials");

            if (debouncedSearchValue) {
                const search = debouncedSearchValue.toLowerCase();
                filtered = filtered.filter((product) =>
                    `${product.name} ${product.unit_name} ${product.quantity}`.toLowerCase().includes(search)
                );
            }
        }

        return filtered;
    }, [isWarehouse, warehouseData, debouncedSearchValue, userData, coreProducts]);

    // ➤ Filter table products by name/display_name (optional)
    const filteredTableProducts = useMemo(() => {
        const lower = debouncedSearchValue.toLowerCase();
        return filteredProducts.filter((product) =>
            (product.display_name || product.item_name || product.name || "").toLowerCase().includes(lower)
        );
    }, [filteredProducts, debouncedSearchValue]);



    // START PURCHASE RETURN

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]); // vendors array from backend


    const [vendorsOptions, setVendorsOptions] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);


    const [purchasesOptions, setPurchasesOptions] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);


    const [itemsOptions, setItemsOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);


    useEffect(() => {
        // fetch structured data with custom header
        fetch(import.meta.env.VITE_API_GATEWAY_URL+'inventory/purchase-return/vendor-wise-purchase-item', {
            method: 'GET',
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data);

                    const vendors = res.data.map((v) => ({
                        value: String(v.vendor_id),
                        label: v.vendor_name,
                    }));
                    console.log(vendors)
                    setVendorsOptions(vendors);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);



    useEffect(() => {
        if (!selectedVendor) {
            setPurchasesOptions([]);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }


        const vendor = data.find((v) => String(v.vendor_id) === String(selectedVendor));
        if (vendor) {
            const purchases = vendor.purchases.map((p) => ({ value: String(p.id), label: `${p.invoice} — ${p.created} — ${p.total}` }));
            setPurchasesOptions(purchases);
            setSelectedPurchase(null);
            setItemsOptions([]);
            setSelectedItem(null);
        }
    }, [selectedVendor, data]);


    useEffect(() => {
        if (!selectedPurchase || !selectedVendor) {
            setItemsOptions([]);
            setSelectedItem(null);
            return;
        }


        const vendor = data.find((v) => String(v.vendor_id) === String(selectedVendor));
        if (!vendor) return;


        const purchase = vendor.purchases.find((p) => String(p.id) === String(selectedPurchase));
        if (purchase) {
            const items = purchase.items.map((it) => ({ value: String(it.id), label: `${it.item_name} — ${it.quantity}` }));
            setItemsOptions(items);
            setSelectedItem(null);
        }
    }, [selectedPurchase, selectedVendor, data]);


    const selectedTableItems = (() => {
        if (!selectedVendor || !selectedPurchase) return [];
        const vendor = data.find((v) => String(v.vendor_id) === String(selectedVendor));
        if (!vendor) return [];
        const purchase = vendor.purchases.find((p) => String(p.id) === String(selectedPurchase));
        return purchase ? purchase.items : [];
    })();

    console.log(selectedTableItems)

    const handleFormSubmit = () => {
        const productsToAdd = selectedTableItems.filter(
            (data) =>
                productQuantities[data.id] &&
                Number(productQuantities[data.id]) > 0
        );

        if (productsToAdd.length === 0) {
            showNotificationComponent(t("WeNotifyYouThat"), 'red')
            return;
        }

        // Update state-based product list
        setWarehouseIssueItems((prevItems) => {
            const updatedItems = [...prevItems];

            productsToAdd.forEach((data) => {
                const quantity = Number(productQuantities[data.id]);

                const productToAdd = {
                    id: data.id,
                    // stock_item_id: isWarehouse ? data.stock_item_id : data.stock_id,
                    display_name: data.item_name ,
                    quantity: Number(quantity),
                    unit_name: data.unit_name,
                    purchase_price: data.purchase_price,
                    // sales_price: data.sales_price,
                    // stock_quantity: isWarehouse ? data.stock_quantity : data.quantity,
                    // warehouse_id: isWarehouse ? data.warehouse_id : null,
                    sub_total: (Number(quantity) * (data.purchase_price ? data.purchase_price:0)),
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
        setProductQuantities({})
        showNotificationComponent(t("ProductAddedSuccessfully"), 'green')
    }


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
                                                    {t("WarehouseIssue")}
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
                                                            onClick={() => {
                                                                setSettingDrawer(true);
                                                            }}
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
                                    <Box
                                        pl={`8`}
                                        pr={8}
                                        mb={"xs"}
                                        className={"boxBackground borderRadiusAll"}
                                    >
                                        <Box mt={"8"}></Box>
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
                                                mt={1}
                                                searchable={true}
                                                value={String(selectedVendor)}
                                                changeValue={setSelectedVendor}
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
                                                value={String(selectedPurchase)}
                                                changeValue={setSelectedPurchase}
                                                disabled={!purchasesOptions.length}
                                            />
                                        </Box>

                                        {/*<Box mt={"4"}>
                                            <SelectForm
                                                tooltip={t("Item")}
                                                label=""
                                                placeholder={t("Item")}
                                                required={false}
                                                nextField={"category_id"}
                                                name={"item_id"}
                                                form={form}
                                                dropdownValue={itemsOptions}
                                                id={"item_id"}
                                                mt={1}
                                                searchable={true}
                                                value={String(selectedItem)}
                                                changeValue={setSelectedItem}
                                                disabled={!itemsOptions.length}
                                            />
                                        </Box>*/}

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
                                                        title: (
                                                            <Group
                                                                justify={"flex-end"}
                                                                spacing="xs"
                                                                noWrap
                                                                pl={"sm"}
                                                                ml={"sm"}
                                                            >
                                                                <Box pl={"4"}>{t("")}</Box>
                                                                <ActionIcon
                                                                    mr={"sm"}
                                                                    radius="xl"
                                                                    variant="transparent"
                                                                    color="grey"
                                                                    size="xs"
                                                                    onClick={() => {
                                                                    }}
                                                                >
                                                                    <IconRefresh
                                                                        style={{width: "100%", height: "100%"}}
                                                                        stroke={1.5}
                                                                    />
                                                                </ActionIcon>
                                                            </Group>
                                                        ),
                                                        textAlign: "right",
                                                        render: (data) => (
                                                            <Group
                                                                wrap="nowrap"
                                                                w="100%"
                                                                gap={0}
                                                                justify="flex-end"
                                                                align="center"
                                                                mx="auto"
                                                            >
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
                                                                            borderTopLeftRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                            borderBottomLeftRadius:
                                                                                "var(--mantine-radius-sm)",
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
                                                                        placeholder: {
                                                                            fontSize: "var(--mantine-font-size-xs)",
                                                                            fontWeight: 300,
                                                                        },
                                                                    }}
                                                                    size="xxs"
                                                                    w="80"
                                                                    type={"number"}
                                                                    tooltip={""}
                                                                    label={""}
                                                                    value={productQuantities[data.id] || ""}
                                                                    onChange={(e) => {
                                                                        const value = e.currentTarget.value;
                                                                        setProductQuantities((prev) => ({
                                                                            ...prev,
                                                                            [data.id]: value,
                                                                        }));
                                                                    }}
                                                                    required={false}
                                                                    nextField={"credit_limit"}
                                                                    name={"quantity"}
                                                                    id={"quantity"}
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
                                                                            borderTopRightRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                            borderBottomRightRadius:
                                                                                "var(--mantine-radius-sm)",
                                                                        },
                                                                    }}

                                                                    onClick={() => {
                                                                        const quantity = productQuantities[data.id];

                                                                        if (quantity && Number(quantity) > 0) {
                                                                            const productToAdd = {
                                                                                id: data.id,
                                                                                // stock_item_id: isWarehouse ? data.stock_item_id : data.stock_id,
                                                                                display_name: data.item_name ,
                                                                                quantity: Number(quantity),
                                                                                unit_name: data.unit_name,
                                                                                purchase_price: data.purchase_price,
                                                                                // sales_price: data.sales_price,
                                                                                // stock_quantity: isWarehouse ? data.stock_quantity : data.quantity,
                                                                                // warehouse_id: isWarehouse ? data.warehouse_id : null,
                                                                                sub_total: (Number(quantity) * (data.purchase_price ? data.purchase_price:0)),
                                                                            };

                                                                            setWarehouseIssueItems(prevItems => {
                                                                                const existingIndex = prevItems.findIndex(
                                                                                    item => String(item.id) === String(productToAdd.id)
                                                                                );

                                                                                if (existingIndex !== -1) {
                                                                                    // Replace the entire product object with updated fields
                                                                                    const updatedItems = [...prevItems];
                                                                                    updatedItems[existingIndex] = {
                                                                                        ...updatedItems[existingIndex],
                                                                                        ...productToAdd, // update all values (including quantity)
                                                                                    };
                                                                                    return updatedItems;
                                                                                } else {
                                                                                    // Add new item
                                                                                    return [...prevItems, productToAdd];
                                                                                }
                                                                            });
                                                                            setProductQuantities({})
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
                                                height={ height + 50}
                                            />

                                        </Box>
                                        <Box
                                            p={"xs"}
                                            mt={"8"}
                                            className={genericClass.genericHighlightedBox}
                                            ml={"-xs"}
                                            mr={-8}
                                        >
                                            <Grid gutter={{base: 6}}>
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
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box mb="xs">
                                    <Grid
                                        className={genericClass.genericBackground}
                                        columns={12}
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Grid.Col span={6}>
                                            <Box pl={"xs"}>
                                                <ActionIcon
                                                    variant="transparent"
                                                    size={"lg"}
                                                    color="grey.6"
                                                    mt={"1"}
                                                    onClick={() => {
                                                    }}
                                                >
                                                    <IconRefresh
                                                        style={{width: "100%", height: "70%"}}
                                                        stroke={1.5}
                                                    />
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
                            warehouseIssueItems={warehouseIssueItems}
                            setWarehouseIssueItems={setWarehouseIssueItems}
                            warehousesIssueData={warehousesIssueData}
                        />
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
