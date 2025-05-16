import React from "react";
import { BarChart } from "@mantine/charts";
import { Box } from "@mantine/core";

export const data = [
    { month: "Apr", Balance: 0, },
	{ month: "May", Balance: 0, },
	{ month: "Jun", Balance: 0, },
    { month: "Jul", Balance: 0, },
    { month: "Aug", Balance: 0, },
    { month: "Sep", Balance: 0, },
    { month: "Oct", Balance: 0, },
    { month: "Nov", Balance: 0, },
    { month: "Dec", Balance: 0, },
	{ month: "Jan", Balance: 0, },
	{ month: "Feb", Balance: 20000, color: "red" },
	{ month: "Mar", Balance: 0, },
];

export default function BalanceBarChart() {
	return (
		<Box mb={20} bg="white" py="28" px="4">
			<BarChart
				h={300}
				data={data}
				dataKey="month"
				data-hidden
				series={[{ name: "Balance", color: "blue" }]}
			/>
		</Box>
	);
}
