import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Card,
    Text,
    Group,
    Loader,
    Tabs,
    Table,
    ScrollArea,
    Divider,
    rem,
    useMantineTheme,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "../../../../store/core/crudSlice.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { useMediaQuery } from '@mantine/hooks';

function __AmendmentViewModel(props) {
    const {
        amendmentViewId,
        amendmentViewModal,
        setAmendmentViewModal,
        setAmendmentViewId,
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleModal = () => setAmendmentViewModal(!amendmentViewModal);

    useEffect(() => {
        if (!amendmentViewId) return;

        (async () => {
            setLoading(true);
            const value = {
                url: "production/production-item-amendments",
                param: {
                    pro_item_id: amendmentViewId.id,
                    page: 1,
                    offset: 20,
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));
                if (getIndexEntityData.fulfilled.match(resultAction)) {
                    if (resultAction.payload.status === 200) {
                        setHistory(resultAction.payload.data || []);
                    } else {
                        showNotificationComponent(resultAction.payload.error, "red");
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [amendmentViewId, dispatch]);

    if (loading) return <Loader size="lg" mt="xl" />;

    if (!history.length)
        return (
            <Modal
                opened={amendmentViewModal}
                onClose={handleModal}
                title={t("AmendmentHistory")}
                centered
            >
                <Text>No history found</Text>
            </Modal>
        );

    // Sort by newest first
    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
    );

    const tabItems = sortedHistory.map((item, index) => ({
        value: `${item.created_date}-${item.id}`,
        label: `${item.created_date}`,
        data: item,
    }));

    const defaultTab = tabItems[0]?.value;

    return (
        <Modal
            size={"70%"}
            opened={amendmentViewModal}
            onClose={handleModal}
            title={t("AmendmentHistory")}
            centered
            radius="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Tabs
                defaultValue={defaultTab}
                orientation={isMobile ? "horizontal" : "vertical"}
                keepMounted={false}
                variant="pills"
                radius="md"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "stretch",
                        gap: rem(12),
                    }}
                >
                    {/* Left: Tab list */}
                    <ScrollArea
                        h={isMobile ? "auto" : "80vh"}
                        w={isMobile ? "100%" : 260}
                        scrollbarSize={6}
                        type="auto"
                        offsetScrollbars
                    >
                        <Tabs.List
                            style={{
                                display: "flex",
                                flexDirection: isMobile ? "row" : "column",
                                borderRight: isMobile ? "none" : "1px solid var(--mantine-color-gray-3)",
                                borderBottom: isMobile ? "1px solid var(--mantine-color-gray-3)" : "none",
                                padding: rem(6),
                            }}
                        >
                            {tabItems.map((tab) => (
                                <Tabs.Tab
                                    key={tab.value}
                                    value={tab.value}
                                    style={{
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                        whiteSpace: "normal",
                                        padding: rem(10),
                                        borderRadius: rem(6),
                                        marginBottom: isMobile ? 0 : rem(6),
                                        marginRight: isMobile ? rem(6) : 0,
                                        transition: "all 0.2s ease",
                                    }}
                                    className="hover:bg-gray-1 data-[active=true]:bg-blue-1 data-[active=true]:border-blue-5"
                                >
                                    <Text fw={600} size="sm">{tab.label}</Text>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </ScrollArea>

                    {/* Right: Tab Panels */}
                    <div style={{ flex: 1 }}>
                        <ScrollArea h="80vh" style={{ paddingLeft: isMobile ? 0 : rem(12) }}>
                            {tabItems.map((tab) => {
                                const entry = tab.data;
                                const items = entry.content?.item || [];
                                const utilities = entry.content?.field?.Utility || [];

                                return (
                                    <Tabs.Panel key={tab.value} value={tab.value}>
                                        <Card shadow="sm" withBorder radius="md" mb="md">
                                            <Group justify="space-between" mb="xs" wrap="wrap">
                                                <Text fw={600}>
                                                    Production Item: {amendmentViewId?.product_name || ""}
                                                </Text>
                                                <Text fw={600}>
                                                    Quantity: {amendmentViewId?.quantity || ""}
                                                </Text>
                                                <Text fw={600}>
                                                    Amount: {amendmentViewId?.sub_total || ""}
                                                </Text>
                                                <Text fw={500} color="dimmed">
                                                    Created by: {entry.created_by_name}
                                                </Text>
                                            </Group>

                                            {entry.comment && (
                                                <Text size="sm" color="dimmed" mb="sm">
                                                    💬 {entry.comment}
                                                </Text>
                                            )}

                                            {/* Material Items */}
                                            <Divider label="Material Items" labelPosition="center" my="sm" />
                                            <ScrollArea type="auto" offsetScrollbars>
                                                <Table striped highlightOnHover withTableBorder withColumnBorders fz="sm">
                                                    <Table.Thead>
                                                        <Table.Tr>
                                                            <Table.Th>Product Name</Table.Th>
                                                            <Table.Th>Quantity</Table.Th>
                                                            <Table.Th>Unit</Table.Th>
                                                            <Table.Th>Price</Table.Th>
                                                            <Table.Th>Sub Total</Table.Th>
                                                            <Table.Th>Wastage %</Table.Th>
                                                            <Table.Th>Wastage Qty</Table.Th>
                                                            <Table.Th>Wastage Amount</Table.Th>
                                                        </Table.Tr>
                                                    </Table.Thead>
                                                    <Table.Tbody>
                                                        {items.map((item) => (
                                                            <Table.Tr key={item.id}>
                                                                <Table.Td>{item.product_name}</Table.Td>
                                                                <Table.Td>{item.quantity}</Table.Td>
                                                                <Table.Td>{item.unit_name}</Table.Td>
                                                                <Table.Td>{item.price}</Table.Td>
                                                                <Table.Td>{item.sub_total}</Table.Td>
                                                                <Table.Td>{item.wastage_percent ?? "-"}</Table.Td>
                                                                <Table.Td>{item.wastage_quantity ?? "-"}</Table.Td>
                                                                <Table.Td>{item.wastage_amount ?? "-"}</Table.Td>
                                                            </Table.Tr>
                                                        ))}
                                                    </Table.Tbody>
                                                </Table>
                                            </ScrollArea>

                                            {/* Utility Details */}
                                            <Divider label="Utility Details" labelPosition="center" my="sm" />
                                            <Table striped highlightOnHover withTableBorder withColumnBorders fz="sm">
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>Name</Table.Th>
                                                        <Table.Th>Type</Table.Th>
                                                        <Table.Th>Amount</Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>
                                                    {utilities.map((f) => (
                                                        <Table.Tr key={f.id}>
                                                            <Table.Td>{f.name}</Table.Td>
                                                            <Table.Td>{f.type_name}</Table.Td>
                                                            <Table.Td>{f.amount ?? "-"}</Table.Td>
                                                        </Table.Tr>
                                                    ))}
                                                </Table.Tbody>
                                            </Table>
                                        </Card>
                                    </Tabs.Panel>
                                );
                            })}
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </Modal>
    );
}

export default __AmendmentViewModel;
