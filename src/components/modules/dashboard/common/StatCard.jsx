import { Box, Paper, Text, Group, Flex } from "@mantine/core";

export default function StatCard({ icon, label, value, color }) {
    return (
        <Paper p="lg" radius="md" withBorder bg={`${color}.0`} h="100%">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text size="sm" c="dimmed" mb={4}>{label}</Text>
                    <Text size="xl" fw={600} c={`${color}.7`}>{value}</Text>
                </Box>
                <Box c={`${color}.6`}>{icon}</Box>
            </Flex>
        </Paper>
    );
}
