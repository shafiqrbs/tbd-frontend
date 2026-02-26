import { Paper, Text, Stack, ScrollArea } from "@mantine/core";
import { IconCurrencyTaka, IconDiscount, IconReceipt, IconClock } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import MetricCard from "./MetricCard";

export default function TodaysOverviewCard({ dailyData, cardHeight }) {
    const { t } = useTranslation();

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Text size="lg" fw={700} mb="md">{t("TodaysOverview")}</Text>
            <ScrollArea scrollbarSize={4} scrollbars="y" type="hover" h={cardHeight}>
                <Stack gap="md">
                    {/* =============== average invoice value ================ */}
                    <MetricCard
                        label={t("AverageInvoiceValue")}
                        value={`৳ ${dailyData.totalInvoices > 0 ? (dailyData.totalSales / dailyData.totalInvoices).toFixed(2) : '0.00'}`}
                        icon={<IconReceipt size={20} />}
                        color="blue"
                    />

                    {/* =============== average discount per invoice ================ */}
                    <MetricCard
                        label={t("AverageDiscountPerInvoice")}
                        value={`৳ ${dailyData.totalInvoices > 0 ? (dailyData.totalDiscount / dailyData.totalInvoices).toFixed(2) : '0.00'}`}
                        icon={<IconDiscount size={20} />}
                        color="orange"
                    />

                    {/* =============== collection rate ================ */}
                    <MetricCard
                        label={t("CollectionRate")}
                        value={`${dailyData.totalSales > 0
                            ? ((dailyData.totalPayment / dailyData.totalSales) * 100).toFixed(2)
                            : '0.00'}%`}
                        icon={<IconCurrencyTaka size={20} />}
                        color="green"
                    />

                    {/* =============== most popular payment method ================ */}
                    <MetricCard
                        label={t("MostUsedPaymentMethod")}
                        value={dailyData.transactionModes.length > 0
                            ? dailyData.transactionModes[ 0 ].name
                            : t("NA")}
                        icon={<IconReceipt size={20} />}
                        color="grape"
                        subValue={dailyData.transactionModes.length > 0
                            ? `${dailyData.transactionModes[ 0 ].count} ${t("Transactions")}`
                            : null}
                    />

                    {/* =============== last updated time ================ */}
                    <MetricCard
                        label={t("LastUpdated")}
                        value={new Date().toLocaleTimeString()}
                        icon={<IconClock size={20} />}
                        color="gray"
                        subValue={new Date().toLocaleDateString()}
                    />

                    {/* =============== top product ================ */}
                    <MetricCard
                        label={t("BestSellingProduct")}
                        value={dailyData.topProducts.length > 0 ? dailyData.topProducts[ 0 ].name : t("NA")}
                        icon={<IconReceipt size={20} />}
                        color="teal"
                        subValue={dailyData.topProducts.length > 0 ? `${dailyData.topProducts[ 0 ].totalQuantity} ${t("UnitsSold")}` : null}
                    />
                </Stack>
            </ScrollArea>

        </Paper>
    );
}
