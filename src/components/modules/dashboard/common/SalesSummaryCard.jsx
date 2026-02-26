import { Grid, Paper, ScrollArea, Text } from "@mantine/core";
import { IconCurrencyTaka, IconDiscount, IconReceipt } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

const STAT_ITEMS = [
    { icon: IconCurrencyTaka, labelKey: "TotalSales", valueKey: "totalSales", format: "currency", color: "blue" },
    { icon: IconDiscount, labelKey: "Discount", valueKey: "totalDiscount", format: "currency", color: "orange" },
    { icon: IconCurrencyTaka, labelKey: "Receive", valueKey: "totalPayment", format: "currency", color: "green" },
    { icon: IconReceipt, labelKey: "TotalInvoices", valueKey: "totalInvoices", format: "number", color: "grape" },
];

export default function SalesSummaryCard({ dailyData, cardHeight }) {
    const { t } = useTranslation();

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
            <Text size="lg" fw={700} mb="xs">{t("TodaysSalesSummary")}</Text>

            <ScrollArea scrollbarSize={4} scrollbars="y" type="hover" h={cardHeight}>
                <Grid gutter="md">
                    {STAT_ITEMS.map((item) => {
                        const value = item.format === "currency" ? `৳ ${dailyData[ item?.valueKey ]?.toFixed(2)}` : dailyData[ item.valueKey ];
                        const IconComponent = item.icon;
                        return (
                            <Grid.Col key={item.labelKey} span={6}>
                                <StatCard
                                    icon={<IconComponent size={32} />}
                                    label={t(item.labelKey)}
                                    value={value}
                                    color={item.color}
                                />
                            </Grid.Col>
                        );
                    })}
                </Grid>
            </ScrollArea>
        </Paper>
    );
}
