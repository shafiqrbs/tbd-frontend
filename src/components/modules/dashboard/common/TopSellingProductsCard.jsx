import { Box, Paper, Text, Badge } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";

export default function TopSellingProductsCard({ dailyData, cardHeight }) {
    const { t } = useTranslation();

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Text size="lg" fw={700} mb="md">{t("TopSellingProducts")}</Text>

            <Box bg="white" className="borderRadiusAll">
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                    }}
                    records={dailyData.topProducts}
                    columns={[
                        {
                            accessor: "name",
                            title: t("ProductName"),
                            render: (item) => (
                                <Text size="sm">{item.name}</Text>
                            ),
                        },
                        {
                            accessor: "totalQuantity",
                            title: t("Quantity"),
                            textAlign: "center",
                            render: (item) => (
                                <Badge color="blue" variant="light">
                                    {item.totalQuantity}
                                </Badge>
                            ),
                        },
                        {
                            accessor: "totalAmount",
                            title: t("Amount"),
                            textAlign: "right",
                            render: (item) => (
                                <Text size="sm" fw={600}>
                                    ৳ {item.totalAmount.toFixed(2)}
                                </Text>
                            ),
                        },
                    ]}
                    height={cardHeight}
                    noRecordsText={t("NoProductsSoldToday")}
                />
            </Box>
        </Paper>
    );
}
