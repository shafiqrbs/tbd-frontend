import { Box, Paper, Text, Stack, Group, Badge, Center, ScrollArea, Flex, Divider } from "@mantine/core";
import { PieChart } from "@mantine/charts";
import { useTranslation } from "react-i18next";
import { getRandomColor } from "../../../../utils";

export default function TransactionModesCard({ dailyData, cardHeight }) {
    const { t } = useTranslation();

    const transactionModesChartData = dailyData.transactionModes.map((mode, index) => {
        return {
            name: mode.name,
            value: Number(mode.amount.toFixed(2)),
            color: getRandomColor(index)
        };
    });

    const tooltipProps = {
        content: ({ _, payload }) => {
            if (!payload || payload.length === 0) return null;
            const data = payload[ 0 ];
            return (
                <Paper p="xs" shadow="md" withBorder>
                    <Stack gap={2}>
                        <Group gap="xs" align="center">
                            <Box
                                w={10}
                                h={10}
                                style={{
                                    borderRadius: '50%',
                                    backgroundColor: data.payload.color
                                }}
                            />
                            <Text size="sm" fw={600}>{data.name}</Text>
                        </Group>
                        <Text size="sm">৳ {data.value}</Text>
                    </Stack>
                </Paper>
            );
        }
    };

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
            <Text size="lg" fw={700} mb="xs">{t("TransactionModes")}</Text>
            <Divider />
            <ScrollArea scrollbarSize={4} scrollbars="y" type="hover" h={cardHeight}>
                {transactionModesChartData.length > 0 ? (
                    <Flex gap={50} align="center" justify="center">
                        <PieChart
                            data={transactionModesChartData}
                            h={250}
                            withLabelsLine
                            labelsPosition="outside"
                            labelsType="value"
                            withTooltip
                            tooltipProps={tooltipProps}
                        />

                        <Stack gap="xs" mt="md">
                            {dailyData.transactionModes.map((mode, index) => (
                                <Group key={index} gap={50} justify="space-between">
                                    <Group gap="xs">
                                        <Box
                                            w={12}
                                            h={12}
                                            style={{
                                                borderRadius: '50%',
                                                backgroundColor: transactionModesChartData[ index ]?.color
                                            }}
                                        />
                                        <Text size="sm">{mode.name}</Text>
                                        <Badge size="sm" variant="light">{mode.count}</Badge>
                                    </Group>
                                    <Text size="sm" fw={600}>৳ {mode.amount.toFixed(2)}</Text>
                                </Group>
                            ))}
                        </Stack>
                    </Flex>
                ) : (
                    <Center h={250}>
                        <Text c="dimmed">{t("NoTransactionDataAvailable")}</Text>
                    </Center>
                )}
            </ScrollArea>

        </Paper>
    );
}
