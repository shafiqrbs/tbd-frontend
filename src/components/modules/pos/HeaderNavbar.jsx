import React from "react";
import {Box, Group, ActionIcon, Text, Badge, Flex, Center, ScrollArea} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconChevronRight, IconChevronLeft} from "@tabler/icons-react";
import {useScroll} from "./bakery/utils/ScrollOperations";
import {storeEntityData} from "../../../store/core/crudSlice.js";
import {useDispatch} from "react-redux";
import {showNotificationComponent} from "../../core-component/showNotificationComponent.jsx";

function HeaderNavbar({tables, tableId, setTableId, tableCustomerMap, setCustomerObject, invoiceMode}) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {scrollRef, showLeftArrow, showRightArrow, handleScroll, scroll} = useScroll();

    const HandleParticularClick = async (invoice) => {
        const newTableId = tableId === invoice.id ? null : invoice.id;
        setTableId(newTableId);
        setCustomerObject(tableCustomerMap[invoice.id] || {});

        // Determine valueId dynamically
        const valueId = {
            table: invoice.table_id,
            customer: invoice.customer_id,
            user: invoice.user_id,
        }[invoiceMode] || '';

        // Prepare request data
        const data = {
            url: 'inventory/pos/inline-update',
            data: {
                invoice_id: invoice.id,
                field_name: invoiceMode,
                value: valueId,
            },
        };

        // Dispatch and handle response
        try {
            const resultAction = await dispatch(storeEntityData(data));

            if (resultAction.payload?.status !== 200) {
                showNotificationComponent(resultAction.payload?.message || 'Error updating invoice', 'red', '', true);
            }
        } catch (error) {
            showNotificationComponent('Request failed. Please try again.', 'red', '', true);
            console.error('Error updating invoice:', error);
        }
    };

    return (
        <Box style={{position: "relative"}}>
            {/* ✅ Scrollable Area Wrapper */}
            <ScrollArea type="never" mt={"4"} pl={"sm"} pr={"sm"} viewportRef={scrollRef}
                        onScrollPositionChange={handleScroll}>
                <Group justify="flex-start" gap="xs" wrap="nowrap">
                    {tables.map((table) => {
                        const customer = tableCustomerMap[table.id] || {};
                        return (
                            <Box key={table.id} onClick={() => HandleParticularClick(table)}
                                 style={{position: "relative", width: "140px", cursor: "pointer"}}>

                                {/* ✅ Badge for Status (Same Styling) */}
                                <Badge
                                    mt={"14"}
                                    size="xs"
                                    w={104}
                                    h={22}
                                    color={tableId == table.id ? 'red.8' : 'green.8'}
                                    style={{
                                        position: "absolute",
                                        top: "-14px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        zIndex: 1,
                                        borderRadius: "100px",
                                    }}
                                >
                                    <Text c={"#FFFFFF"} fw={600}
                                          fz={"sm"}>{tableId == table.id ? 'Reserved' : 'Free'}</Text>
                                </Badge>

                                {/* ✅ Table Component (Same Design, Optimized for Performance) */}
                                <Flex
                                    bg={table.id === tableId ? "gray.8" : "white"}
                                    mt={"9"}
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    style={{
                                        height: "100px",
                                        width: "140px",
                                        borderRadius: "8px",
                                        border: "1px solid #BFC5C8",
                                    }}
                                >
                                    {/* ✅ Table Name */}
                                    <Center>
                                        <Text mt={"-20"} fz="md" fw={900} c={table.id === tableId ? "white" : "black"}>
                                            {table.value}
                                        </Text>
                                    </Center>

                                    {/* ✅ Time Display (Same Format & Styling) */}
                                    <Flex gap={0} h={24} w={92} justify={"center"} align={"center"}
                                          bg={table.id === tableId ? "white" : "green.0"} style={{borderRadius: "1px"}}>
                                        <Text fz="sm"
                                              fw={400}>{table.status ? table.elapsedTime : table.time}</Text>
                                    </Flex>

                                    {/* ✅ Customer Name or Mobile (Same Styling) */}
                                    <Center>
                                        <Text mt={8} mb={-28} fz="sm" fw={800} c={"red.6"}>
                                            {customer.mobile || customer.name || ""}
                                        </Text>
                                    </Center>
                                </Flex>
                            </Box>
                        );
                    })}
                </Group>
            </ScrollArea>

            {/* ✅ Scroll Buttons (Show When Required) */}
            {tables.length > 5 && showLeftArrow && (
                <ActionIcon
                    variant="filled"
                    color="gray"
                    radius="xl"
                    size="lg"
                    h={48}
                    w={48}
                    style={{
                        position: "absolute",
                        left: 5,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                    onClick={() => scroll("left")}
                >
                    <IconChevronLeft size={26}/>
                </ActionIcon>
            )}

            {tables.length > 5 && showRightArrow && (
                <ActionIcon
                    variant="filled"
                    color="gray"
                    radius="xl"
                    size="lg"
                    h={48}
                    w={48}
                    style={{
                        position: "absolute",
                        right: 5,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                    onClick={() => scroll("right")}
                >
                    <IconChevronRight size={26}/>
                </ActionIcon>
            )}
        </Box>
    );
}

export default HeaderNavbar;
