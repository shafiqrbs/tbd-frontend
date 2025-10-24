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
    IconInfoCircle, IconSortAscendingNumbers,
} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {useOutletContext, useParams} from "react-router-dom";
import React, {useEffect, useState, useMemo} from "react";
import genericClass from "../../../../assets/css/Generic.module.css";
import __StockTransferSubmitForm from "./__StockTransferSubmitForm.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";
import {showEntityData} from "../../../../store/core/crudSlice.js";
import Navigation from "../common/Navigation.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import SelectFormForSalesPurchaseProduct from "../../../form-builders/SelectFormForSalesPurchaseProduct.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm.jsx";

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

export default function _StockTransferForm({domainConfigData,isWarehouse}) {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 360;
    const form = useForm({
        initialValues: {},
    });
    let warehouseDropdownData = getCoreWarehouseDropdownData();


    // const [warehouseDropdownData, setWarehouseDataDropdown] = useState([]);
    const [warehouseData, setWarehouseData] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const [stockTransferItems, setStockTransferItems] = useState([]);
    const [warehousesIssueData, setWarehousesIssueData] = useState({});

    // Cache user data & core products using memo
    const userData = useMemo(() => getUserData(), []);
    const coreProducts = useMemo(() => getCoreProducts(), []);
    const debouncedSearchValue = useDebouncedValue(searchValue, 250);

    const [allItems , setAllItems] = useState([])
    const [filteredItemsByWarehouse, setFilteredItemsByWarehouse] = useState([]);
    const [filteredItemsDropdownData, setFilteredItemsDropdownData] = useState([]);
    const [product, setProduct] = useState(null);
    const [productPurchaseItemData, setProductPurchaseItemData] = useState(null);
    const [productPurchaseItemDropdown, setProductPurchaseItemDropdown] = useState([]);
    const [isWarehouseDropdownDisable,setIsWarehouseDropdownDisable] = useState(false)
    // When warehouse changes
    useEffect(() => {
        if (form.values.warehouse_id){
            const selected = allItems.find(
                (w) => w.warehouse_id.toString() === form.values.warehouse_id
            );
            const transformed = selected?.items?.map((i) => ({
                label: `${i.stock_item_name} [${i.total_quantity}]`,
                value: String(i.id),
            }));
            setFilteredItemsByWarehouse(selected ? selected.items : []);
            setFilteredItemsDropdownData(transformed)
            setIsWarehouseDropdownDisable(true)
        }
    }, [form.values.warehouse_id]);

    // When items changes
    useEffect(() => {
        if (form.values.stock_item_id){
            const selected = filteredItemsByWarehouse.find(
                (w) => w.stock_item_id.toString() === form.values.stock_item_id
            );
            if (selected.is_purchase_item){
                const pi = selected.purchase_items.map((pItem) => ({
                    label: "Expire: "+pItem.expired_date+" (stock #"+pItem.remain_quantity+")",
                    value: String(pItem.id),
                }));
                setProductPurchaseItemDropdown(pi);
            } else {
                setProductPurchaseItemDropdown([])
            }
        }
    }, [form.values.stock_item_id]);

    // console.log(filteredItemsByWarehouse,filteredItemsDropdownData)
    // Load issue data from API
    useEffect(() => {
        const fetchData = async () => {
            // if (id) {
                try {
                    const result = await dispatch(showEntityData(`inventory/stock/transfer/items`)).unwrap();
                    if (result.data.status === 200) {
                        setAllItems(result.data.items)
                    } else {
                        showNotificationComponent(t("FailedToFetchData"), "red", null, false, 1000);
                    }
                } catch (error) {
                    console.error("Fetch issue data error:", error);
                }
            // }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {

    }, [form.values.quantity]);



    const handleFormSubmit = () => {
        if (!form.values.warehouse_id){
            form.setFieldError("warehouse_id", true);
            return
        }
        if (!form.values.stock_item_id){
            form.setFieldError("stock_item_id", true);
        }
        if (productPurchaseItemDropdown && productPurchaseItemDropdown.length >0 && !form.values.purchase_item_id){
            form.setFieldError("purchase_item_id", true);
        }

        if (!form.values.quantity){
            form.setFieldError("quantity", true);
        }

        const selectedWarehouseProduct = allItems.find(
            (w) => w.warehouse_id.toString() === form.values.warehouse_id
        );
        const selectedStockItem = selectedWarehouseProduct?.items.find((p) => p.stock_item_id.toString() === form.values.stock_item_id);
        let selectedPurchaseItem = null
        if (productPurchaseItemDropdown && productPurchaseItemDropdown.length > 0 && productPurchaseItemData){
            selectedPurchaseItem = selectedStockItem.purchase_items.find((p) => p.id.toString() === productPurchaseItemData);

            if (selectedPurchaseItem.remain_quantity <= form.values.quantity ){
                form.setFieldError("quantity", true);
                showNotificationComponent("Quantity must be less than or equal purchase item quantity", "red", null, false, 1000);
                return;
            }
        } else {
            if (selectedStockItem.total_quantity <= form.values.quantity ){
                form.setFieldError("quantity", true);
                showNotificationComponent("Quantity must be less than or equal stock item quantity", "red", null, false, 1000);
                return;
            }
        }

        if (form.values.quantity && form.values.quantity > 0) {
            // Update state-based product list
            setStockTransferItems((prevItems) => {
                const updatedItems = [...prevItems];

                const productToAdd = {
                    id: selectedStockItem.id,
                    stock_item_id: selectedStockItem.stock_item_id,
                    display_name: selectedStockItem.stock_item_name,
                    quantity: Number(form.values.quantity),
                    stock_quantity: (productPurchaseItemDropdown && selectedPurchaseItem) ? selectedPurchaseItem.remain_quantity : selectedStockItem.total_quantity,
                    unit_name: selectedStockItem.uom,
                    purchase_price: selectedStockItem.purchase_price,
                    sales_price: selectedStockItem.sales_price,
                    form_warehouse_id: form.values.warehouse_id,
                    purchase_item_id: productPurchaseItemData,
                    sub_total: (Number(form.values.quantity) * (selectedStockItem.purchase_price ? selectedStockItem.purchase_price : 0)),
                };

                const existingIndex = updatedItems.findIndex(
                    (item) => String(item.stock_item_id) === String(selectedStockItem.stock_item_id)
                );

                if (existingIndex !== -1) {
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        ...productToAdd,
                    };
                } else {
                    updatedItems.push(productToAdd);
                }
                return updatedItems;
            });
            showNotificationComponent(t("ProductAddedSuccessfully"), 'green')
            setProduct(null)
            setProductPurchaseItemData(null)
            setProductPurchaseItemDropdown([])
            form.setFieldValue("quantity", null)
            const nextElement = document.getElementById("stock_item_id");
            if (nextElement) {
                nextElement.focus();
            }
        }
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
                                                    {t("StockTransfer")}
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
                                                    tooltip={t("Warehouse")}
                                                    label={""}
                                                    placeholder={t("Warehouse")}
                                                    required={true}
                                                    nextField={ "stock_item_id" }
                                                    name={"warehouse_id"}
                                                    form={form}
                                                    dropdownValue={warehouseDropdownData}
                                                    id={"warehouse_id"}
                                                    searchable={true}
                                                    value={warehouseData}
                                                    changeValue={(val) => setWarehouseData(val)}
                                                    comboboxProps={{withinPortal: false}}
                                                    disabled={isWarehouseDropdownDisable}
                                                />
                                            </Box>
                                            <Box mt={"4"}>
                                                <SelectForm
                                                    tooltip={t("ChooseProduct")}
                                                    label={""}
                                                    placeholder={t("ChooseProduct")}
                                                    required={true}
                                                    nextField={ (productPurchaseItemDropdown && productPurchaseItemDropdown.length > 0) ? "purchase_item_id" : "quantity"}
                                                    name={"stock_item_id"}
                                                    form={form}
                                                    dropdownValue={filteredItemsDropdownData}
                                                    id={"stock_item_id"}
                                                    searchable={true}
                                                    value={product}
                                                    changeValue={(val) => setProduct(val)}
                                                    comboboxProps={{withinPortal: false}}
                                                />
                                            </Box>

                                        {
                                            (productPurchaseItemDropdown && productPurchaseItemDropdown.length > 0) &&
                                            <Box mt={"4"}>
                                                <SelectForm
                                                    tooltip={t("ChoosePurchaseItem")}
                                                    label={""}
                                                    placeholder={t("ChoosePurchaseItem")}
                                                    required={true}
                                                    nextField={"quantity"}
                                                    name={"purchase_item_id"}
                                                    form={form}
                                                    dropdownValue={productPurchaseItemDropdown}
                                                    id={"purchase_item_id"}
                                                    searchable={true}
                                                    value={productPurchaseItemData}
                                                    changeValue={(val) => setProductPurchaseItemData(val)}
                                                    comboboxProps={{withinPortal: false}}
                                                />
                                            </Box>
                                        }


                                        <Box mt={"4"}>
                                            <Grid columns={24} gutter={{base: 1}}>
                                                <Grid.Col span={10} fz="sm" mt={8}>
                                                    {t("Quantity")}
                                                </Grid.Col>
                                                <Grid.Col span={14}>
                                                    <InputButtonForm
                                                        type="number"
                                                        tooltip={t("PercentValidateMessage")}
                                                        label=""
                                                        placeholder={t("Quantity")}
                                                        required={true}
                                                        nextField={"EntityFormSubmit"}
                                                        form={form}
                                                        name={"quantity"}
                                                        id={"quantity"}
                                                        leftSection={
                                                            <IconSortAscendingNumbers
                                                                size={16}
                                                                opacity={0.5}
                                                            />
                                                        }
                                                        rightSectionWidth={50}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>

                                        <Box mt={"xs"}>
                                            {/*<DataTable
                                                classNames={{
                                                    root: tableCss.root,
                                                    table: tableCss.table,
                                                    header: tableCss.header,
                                                    footer: tableCss.footer,
                                                    pagination: tableCss.pagination,
                                                }}
                                                records={filteredTableProducts}
                                                columns={[
                                                    {
                                                        accessor: isWarehouse ? "item_name" : "display_name",
                                                        title: t("Product"),
                                                        render: (data, index) => (
                                                            <Text fz={11} fw={400}>
                                                                {index + 1}. {isWarehouse ? data.item_name : data.display_name}
                                                            </Text>
                                                        ),
                                                    },
                                                    {
                                                        accessor: isWarehouse ? "closing_quantity" : "quantity",
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
                                                                        {isWarehouse ? data.closing_quantity : data.quantity}
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
                                                                        {isWarehouse ? data.uom : data.unit_name}
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
                                                                                stock_item_id: isWarehouse ? data.stock_item_id : data.stock_id,
                                                                                display_name: isWarehouse ? data.item_name : data.display_name,
                                                                                quantity: Number(quantity),
                                                                                unit_name: isWarehouse ? data.uom : data.unit_name,
                                                                                purchase_price: data.purchase_price,
                                                                                sales_price: data.sales_price,
                                                                                stock_quantity: isWarehouse ? data.stock_quantity : data.quantity,
                                                                                warehouse_id: isWarehouse ? data.warehouse_id : null,
                                                                                sub_total: (Number(quantity) * (data.purchase_price ? data.purchase_price:0)),
                                                                            };

                                                                            setStockTransferItems(prevItems => {
                                                                                const existingIndex = prevItems.findIndex(
                                                                                    item => String(item.stock_item_id) === String(productToAdd.stock_item_id)
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
                                                height={isWarehouse ? height + 90 : height + 135}
                                            />*/}

                                        </Box>
                                        <Box
                                            p={"xs"}
                                            mt={"8"}
                                            className={genericClass.genericHighlightedBox}
                                            ml={"-xs"}
                                            mr={-8}
                                        >
                                            {/*<Grid gutter={{base: 6}}>
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
                                            </Grid>*/}
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
                                                    id="EntityFormSubmit"
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
                        <__StockTransferSubmitForm
                            stockTransferItems={stockTransferItems}
                            setStockTransferItems={setStockTransferItems}
                            warehousesIssueData={warehousesIssueData}
                            formWarehouseData={warehouseData}
                        />
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
