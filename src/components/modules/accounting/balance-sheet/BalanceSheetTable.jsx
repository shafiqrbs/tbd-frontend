import React from "react";
import { DataTable } from "mantine-datatable";
import { Box, Text } from "@mantine/core";
import tableCss from "../../../../assets/css/Table.module.css";

export default function BalanceSheetTable({ data, totalAmount, mainAreaHeight }) {
	return (
		<Box h={mainAreaHeight} bg="white" p="xs">
			<DataTable
				classNames={{
					root: tableCss.root,
					table: tableCss.table,
					header: tableCss.header,
					footer: tableCss.footer,
				}}
				columns={[
					{
						accessor: "particulars",
						title: <Text fw={600}>Particulars</Text>,
						textAlign: "left",
						footer: (
							<Text c="black" fw={700} size="sm">
								Total
							</Text>
						),
					},
					{
						accessor: "amount",
						title: <Text fw={600}>Amount</Text>,
						textAlign: "right",
						width: "150px",
						footer: (
							<Text c="black" fw={700} size="sm">
								{totalAmount}
							</Text>
						),
					},
				]}
				records={data}
				customHeader={
					<Box
						px="xs"
						py={4}
						bg="#f8eedf"
						style={{ borderRadius: 4, borderBottom: "1px solid #f8eedf" }}
					>
						<Text fw={700} size="sm">
							COMPUTER HUB
						</Text>
						<Text size="xs" c="dimmed">
							For 1-Apr-2023
						</Text>
					</Box>
				}
				withTableBorder
				withRowBorders={false}
				striped
				highlightOnHover
				minHeight={220}
			/>
		</Box>
	);
}
