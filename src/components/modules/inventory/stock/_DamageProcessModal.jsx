import React, { useEffect, useState } from "react";
import {
    Modal,
    Table,
    NumberInput,
    Button,
    Group,
    ScrollArea,
    Text,
    Stack,
    Loader,
    Center
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { showInstantEntityData } from "../../../../store/inventory/crudSlice.js";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";

function _DamageProcessModal({
                                 opened,
                                 damageModalClose,
                                 damageItemData,
                                 setDamageItemData,
                                 fetchStockTableData
                             }) {
    const dispatch = useDispatch();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemNatureType, setItemNatureType] = useState("");

    /* -----------------------------
       MODAL CLOSE
    ------------------------------*/
    const modalClose = () => {
        setDamageItemData(null);
        setItems([]);
        damageModalClose();
    };

    /* -----------------------------
       FETCH PURCHASE ITEMS
    ------------------------------*/
    const fetchData = async () => {
        if (!damageItemData?.id) return;

        setLoading(true);

        try {
            const resultAction = await dispatch(
                showInstantEntityData(
                    `inventory/purchase/items-for-damage/${damageItemData.id}`
                )
            );

            if (showInstantEntityData.fulfilled.match(resultAction)) {
                const res = resultAction.payload.data;

                if (res.status === 200) {
                    const prepared = res.data.map((item) => ({
                        ...item,
                        damage_quantity: 0
                    }));

                    setItems(prepared);
                }
            }
        } catch (error) {
            showNotificationComponent(
                "Data fetch failed",
                "red",
                "",
                true,
                1000,
                true
            );
        }

        setLoading(false);
    };

    /* -----------------------------
       DETERMINE ITEM TYPE
    ------------------------------*/
    useEffect(() => {
        const nature = damageItemData?.product_nature;

        if (["raw-materials", "stockable"].includes(nature)) {
            setItemNatureType("Stockable");
            fetchData();
        }

        if (
            ["post-production", "mid-production", "pre-production"].includes(nature)
        ) {
            setItemNatureType("Production");

            if (damageItemData) {
                setItems([
                    {
                        id: damageItemData.id,
                        name: damageItemData.name,
                        quantity: damageItemData.quantity,
                        purchase_price: damageItemData.purchase_price || 0,
                        damage_quantity: 0
                    }
                ]);
            }
        }
    }, [damageItemData]);

    /* -----------------------------
       QTY CHANGE
    ------------------------------*/
    const handleQtyChange = (id, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, damage_quantity: parseFloat(value) || 0 }
                    : item
            )
        );
    };

    /* -----------------------------
       VALIDATION
    ------------------------------*/
    const isInvalidQty = (item) => {
        if (itemNatureType === "Stockable") {
            return item.damage_quantity > item.remaining_quantity;
        }

        if (itemNatureType === "Production") {
            return item.damage_quantity > item.quantity;
        }

        return false;
    };

    /* -----------------------------
       SUBTOTAL
    ------------------------------*/
    const calculateSubTotal = (item) =>
        item.damage_quantity * item.purchase_price;

    /* -----------------------------
       SUBMIT ENABLE
    ------------------------------*/
    const hasDamageQty = items.some(item => item.damage_quantity > 0);

    const isSubmitEnabled =
        items.length > 0 && hasDamageQty && items.every((item) => !isInvalidQty(item));

    /* -----------------------------
       SUBMIT
    ------------------------------*/
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const validItems = items.filter(item => item.damage_quantity > 0);

            const payload =
                itemNatureType === "Stockable"
                    ? {
                        item_nature_type:itemNatureType,
                        data: validItems.map((item) => ({
                            purchase_item_id: item.id,
                            damage_quantity: item.damage_quantity,
                            subtotal: calculateSubTotal(item)
                        }))
                    }
                    : {
                        item_nature_type:itemNatureType,
                        data: validItems.map((item) => ({
                            stock_item_id: damageItemData.id,
                            damage_quantity: item.damage_quantity,
                            subtotal: calculateSubTotal(item)
                        }))
                    };

            const value = {
                url: `inventory/purchase/manual/damage-process/${damageItemData.id}`,
                data: payload
            };

            console.log(value)

            /*const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.fulfilled.match(resultAction)) {
                const res = resultAction.payload?.data;

                if (res?.status === 200) {
                    showNotificationComponent(
                        "Damage processed successfully",
                        "green",
                        "",
                        true,
                        1000,
                        true
                    );
                    fetchStockTableData()
                    modalClose();
                }
            }*/
        } catch (error) {
            showNotificationComponent("Process failed", "red", "", true, 1000, true);
        }

        setLoading(false);
    };

    /* -----------------------------
       TABLE ROWS
    ------------------------------*/
    const rows = items.map((item, index) => {
        const subTotal = calculateSubTotal(item);

        return (
            <Table.Tr
                key={item.id}
                style={{
                    backgroundColor: isInvalidQty(item) ? "#ffe3e3" : ""
                }}
            >
                <Table.Td>{index + 1}</Table.Td>

                {itemNatureType === "Stockable" && (
                    <>
                        <Table.Td>{item.created_date}</Table.Td>
                        <Table.Td>{item.invoice}</Table.Td>
                    </>
                )}

                <Table.Td>{item.name}</Table.Td>

                <Table.Td>
                    {itemNatureType === "Stockable"
                        ? item.remaining_quantity
                        : item.quantity}
                </Table.Td>

                <Table.Td>
                    <NumberInput
                        size="xs"
                        min={0}
                        step={0.01}
                        decimalScale={2}
                        value={item.damage_quantity}
                        onChange={(value) => handleQtyChange(item.id, value)}
                    />
                </Table.Td>

                <Table.Td>{item.purchase_price.toFixed(2)}</Table.Td>
                <Table.Td>{subTotal.toFixed(2)}</Table.Td>
            </Table.Tr>
        );
    });

    /* -----------------------------
       UI
    ------------------------------*/
    return (
        <Modal
            opened={opened}
            onClose={modalClose}
            size="75%"
            title={
                <>
                    Damage Process :: <strong>{damageItemData?.name}</strong> (
                    {itemNatureType} item)
                </>
            }
        >
            <Stack>
                {loading && items.length === 0 ? (
                    <Center>
                        <Loader />
                    </Center>
                ) : (
                    <ScrollArea>
                        <Table striped highlightOnHover withTableBorder withColumnBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>S/N</Table.Th>

                                    {itemNatureType === "Stockable" && (
                                        <>
                                            <Table.Th>Created Date</Table.Th>
                                            <Table.Th>Invoice</Table.Th>
                                        </>
                                    )}

                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Remaining Qty</Table.Th>
                                    <Table.Th>Damage Qty</Table.Th>
                                    <Table.Th>Price</Table.Th>
                                    <Table.Th>Sub Total</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {rows.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={8}>
                                            <Text ta="center">No data found</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}

                <Group justify="flex-end">
                    <Button
                        color="green"
                        disabled={!isSubmitEnabled || loading}
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

export default _DamageProcessModal;
