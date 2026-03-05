import React, { useEffect, useState } from "react";
import {
    Modal,
    Table,
    NumberInput,
    Badge,
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
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { storeEntityData } from "../../../../store/core/crudSlice.js";

function __SalesReturnProcessModal({
                                       opened,
                                       processModalClose,
                                       processModalId,
                                       setProcessModalId
                                   }) {
    const dispatch = useDispatch();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(""); // status of sales return

    /* -----------------------------
       FETCH DATA FUNCTION
    ------------------------------*/
    const fetchData = async () => {
        if (!processModalId) return;

        setLoading(true);

        try {
            const resultAction = await dispatch(
                showInstantEntityData(`inventory/sales/return/${processModalId}/edit`)
            );

            if (showInstantEntityData.fulfilled.match(resultAction)) {
                const res = resultAction.payload.data;

                if (res.status === 200) {
                    const formatted = res.data.sales_return_items.map((item) => ({
                        id: item.id,
                        name: item.item_name,
                        req_qty: parseFloat(item.request_quantity) || 0,
                        stock_in_qty: parseFloat(item.stock_entry_quantity) || 0,
                        damage_qty: parseFloat(item.damage_entry_quantity) || 0,
                        price: parseFloat(item.price) || 0
                    }));

                    setItems(formatted);
                    setStatus(res.data.process); // set current status
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
       MODAL CLOSE
    ------------------------------*/
    const modalClose = () => {
        setProcessModalId(null);
        processModalClose();
    };

    useEffect(() => {
        fetchData();
    }, [processModalId, dispatch]);

    /* -----------------------------
       INLINE QTY UPDATE
    ------------------------------*/
    const handleQtyChange = (id, field, value) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newValue = parseFloat(value) || 0;
                    return { ...item, [field]: newValue };
                }
                return item;
            })
        );
    };

    /* -----------------------------
       CALCULATIONS
    ------------------------------*/
    const calculateTotalQty = (item) =>
        parseFloat(item.stock_in_qty) + parseFloat(item.damage_qty);

    const calculateSubTotal = (item) => calculateTotalQty(item) * parseFloat(item.price);

    // Submit button only enabled when status = 'Created' AND total <= req_qty
    const isSubmitEnabled =
        status === "Created" &&
        items.length > 0 &&
        items.every(item => calculateTotalQty(item) <= item.req_qty);

    /* -----------------------------
       SUBMIT API CALL
    ------------------------------*/
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = {
                data: items.map((item) => ({
                    id: item.id,
                    stock_entry_quantity: item.stock_in_qty,
                    damage_entry_quantity: item.damage_qty
                }))
            };

            const value = {
                url: `inventory/sales/return/${processModalId}/process`,
                data: payload
            };

            const resultAction = await dispatch(storeEntityData(value));

            if (storeEntityData.rejected.match(resultAction)) {
                showNotificationComponent("Process failed", "red", "", true, 1000, true);
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                showNotificationComponent("Sales return processed successfully", "green", "", true, 1000, true);

                // refetch data after submit
                await fetchData();
            }
        } catch (error) {
            showNotificationComponent("Process failed", "red", "", true, 1000, true);
        }

        setLoading(false);
    };

    /* -----------------------------
       TABLE ROWS
    ------------------------------*/
    const rows = items.map((item, index) => {
        const totalQty = calculateTotalQty(item);
        const subTotal = calculateSubTotal(item);

        return (
            <Table.Tr key={item.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.req_qty.toFixed(2)}</Table.Td>
                <Table.Td>
                    <NumberInput
                        size="xs"
                        min={0}
                        step={0.01}
                        decimalScale={2}
                        value={item.stock_in_qty}
                        disabled={status !== "Created" || loading}
                        onChange={(value) => handleQtyChange(item.id, "stock_in_qty", value)}
                    />
                </Table.Td>
                <Table.Td>
                    <NumberInput
                        size="xs"
                        min={0}
                        step={0.01}
                        decimalScale={2}
                        value={item.damage_qty}
                        disabled={status !== "Created" || loading}
                        onChange={(value) => handleQtyChange(item.id, "damage_qty", value)}
                    />
                </Table.Td>
                <Table.Td>
                    <Badge color={totalQty === item.req_qty ? "green" : "red"}>
                        {totalQty.toFixed(2)}
                    </Badge>
                </Table.Td>
                <Table.Td>{item.price.toFixed(2)}</Table.Td>
                <Table.Td>{subTotal.toFixed(2)}</Table.Td>
            </Table.Tr>
        );
    });

    /* -----------------------------
       COMPONENT UI
    ------------------------------*/
    return (
        <Modal opened={opened} onClose={modalClose} title="Sales Return Process" size="75%" top>
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
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Req. QTY</Table.Th>
                                    <Table.Th>Stock In Qty</Table.Th>
                                    <Table.Th>Damage Qty</Table.Th>
                                    <Table.Th>Total QTY</Table.Th>
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
                    <Button color="green" disabled={!isSubmitEnabled || loading} loading={loading} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

export default __SalesReturnProcessModal;