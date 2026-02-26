import { Box, Paper, Text, Group } from "@mantine/core";

export default function MetricCard({ label, value, icon, color, subValue }) {
    return (
        <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" wrap="nowrap">
                <Box>
                    <Text size="sm" c="dimmed" mb={4}>{label}</Text>
                    <Text size="lg" fw={600}>{value}</Text>
                    {subValue && (
                        <Text size="xs" c="dimmed" mt={4}>{subValue}</Text>
                    )}
                </Box>
                <Box c={`${color}.6`}>
                    {icon}
                </Box>
            </Group>
        </Paper>
    );
}
