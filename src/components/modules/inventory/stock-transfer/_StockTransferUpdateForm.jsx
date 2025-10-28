import {
    Box,
    Grid,
    Text,
    Tooltip,
    ActionIcon,
    Group,
    Button,
    Flex,
} from "@mantine/core";

import {useForm} from "@mantine/form";
import {
    IconDotsVertical,
    IconRefresh,
    IconDeviceFloppy, IconSortAscendingNumbers,
} from "@tabler/icons-react";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import genericClass from "../../../../assets/css/Generic.module.css";
import __StockTransferSubmitForm from "./__StockTransferSubmitForm.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";
import {showEntityData} from "../../../../store/core/crudSlice.js";
import Navigation from "../common/Navigation.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import InputButtonForm from "../../../form-builders/InputButtonForm.jsx";
import {useParams} from "react-router-dom";

export default function _StockTransferUpdateForm({domainConfigData, isWarehouse}) {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const form = useForm({
        initialValues: {},
    });
    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);
    const [stockTransferItems, setStockTransferItems] = useState([]);
    const [allItems, setAllItems] = useState([])
    const [filteredItemsByWarehouse, setFilteredItemsByWarehouse] = useState([]);
    const [filteredItemsDropdownData, setFilteredItemsDropdownData] = useState([]);
    const [product, setProduct] = useState(null);
    const [productPurchaseItemData, setProductPurchaseItemData] = useState(null);
    const [productPurchaseItemDropdown, setProductPurchaseItemDropdown] = useState([]);
    const [isWarehouseDropdownDisable, setIsWarehouseDropdownDisable] = useState(false)

    // When warehouse changes
    useEffect(() => {
        if (form.values.warehouse_id || warehouseData) {
            const selected = allItems.find(
                (w) => w.warehouse_id.toString() === warehouseData
            );
            const transformed = selected?.items?.map((i) => ({
                label: `${i.stock_item_name} [${i.total_quantity}]`,
                value: String(i.id),
            }));
            setFilteredItemsByWarehouse(selected ? selected.items : []);
            setFilteredItemsDropdownData(transformed)
            setIsWarehouseDropdownDisable(true)
        }
    }, [form.values.warehouse_id, warehouseData]);

    // When items changes
    useEffect(() => {
        if (form.values.stock_item_id) {
            const selected = filteredItemsByWarehouse.find(
                (w) => w.stock_item_id.toString() === form.values.stock_item_id
            );
            if (selected.is_purchase_item) {
                const pi = selected.purchase_items.map((pItem) => ({
                    label: "Expire: " + pItem.expired_date + " (stock #" + pItem.remain_quantity + ")",
                    value: String(pItem.id),
                }));
                setProductPurchaseItemDropdown(pi);
            } else {
                setProductPurchaseItemDropdown([])
            }
        }
    }, [form.values.stock_item_id]);

    // Load issue data from API
    useEffect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    }, [dispatch]);


    const handleFormSubmit = () => {
        if (!warehouseData) {
            form.setFieldError("warehouse_id", true);
            return
        }
        if (!form.values.stock_item_id) {
            form.setFieldError("stock_item_id", true);
        }
        if (productPurchaseItemDropdown && productPurchaseItemDropdown.length > 0 && !form.values.purchase_item_id) {
            form.setFieldError("purchase_item_id", true);
        }

        if (!form.values.quantity) {
            form.setFieldError("quantity", true);
        }

        const selectedWarehouseProduct = allItems.find(
            (w) => w.warehouse_id.toString() === warehouseData
        );
        const selectedStockItem = selectedWarehouseProduct?.items.find((p) => p.stock_item_id.toString() === form.values.stock_item_id);
        let selectedPurchaseItem = null
        if (productPurchaseItemDropdown && productPurchaseItemDropdown.length > 0 && productPurchaseItemData) {
            selectedPurchaseItem = selectedStockItem.purchase_items.find((p) => p.id.toString() === productPurchaseItemData);

            if (selectedPurchaseItem.remain_quantity <= form.values.quantity) {
                form.setFieldError("quantity", true);
                showNotificationComponent("Quantity must be less than or equal purchase item quantity", "red", null, false, 1000);
                return;
            }
        } else {
            if (selectedStockItem.total_quantity <= form.values.quantity) {
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
                    form_warehouse_id: warehouseData,
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

    // for update
    const [editedData, setEditedData] = useState(null);

    // --- Fetch vendors list AND the existing purchase return (edit) ---
    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch the existing purchase return to edit
                const returnRes = await dispatch(
                    showEntityData(`inventory/stock/transfer/${id}`)
                ).unwrap();

                if (returnRes?.data?.status === 200) {
                    const returnData = returnRes.data.data;
                    setEditedData(returnData);

                    setWarehouseData(String(returnData.from_warehouse_id))
                    const mappedItems = (returnData.stock_transfer_items || []).map((it) => ({
                        id: it.id, // depends on API shape
                        stock_item_id: it.stock_item_id,
                        stock_quantity: it.stock_quantity,
                        display_name: it.name,
                        quantity: Number(it.quantity),
                        unit_name: it.uom,
                        form_warehouse_id: warehouseData,
                        purchase_item_id: it.purchase_item_id,
                    }));

                    setStockTransferItems(mappedItems)
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [dispatch, id, t]);


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
                                                nextField={"stock_item_id"}
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
                                                nextField={(productPurchaseItemDropdown && productPurchaseItemDropdown.length > 0) ? "purchase_item_id" : "quantity"}
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

                                        </Box>
                                        <Box
                                            p={"xs"}
                                            mt={"8"}
                                            className={genericClass.genericHighlightedBox}
                                            ml={"-xs"}
                                            mr={-8}
                                        >
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
                            formWarehouseData={warehouseData}
                            editedData={editedData}
                        />
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
