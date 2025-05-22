import { Box, Switch, Group, Text, Grid } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import { IconCheck, IconX } from "@tabler/icons-react";
export default function WarehouseListTable() {
	const { t } = useTranslation();
    const { mainAreaHeight } = useOutletContext();

	const data = [
		{
			id: 1,
			user_id: 1,
			user_name: "John Doe",
			user_email: "john.doe@example.com",
			user_phone: "1234567890",
			warehouses: [
				{
					id: 1,
					name: "Central Distribution Hub",
					address: "123 Main St",
					enabled: true,
				},
				{
					id: 2,
					name: "North Storage Facility",
					address: "123 Main St",
					enabled: false,
				},
				{
					id: 3,
					name: "South Fulfillment Center",
					address: "123 Main St",
					enabled: true,
				},
			],
		},
		{
			id: 2,
			user_id: 2,
			user_name: "Jane Doe",
			user_email: "jane.doe@example.com",
			user_phone: "1234567890",
			warehouses: [
				{
					id: 1,
					name: "East Coast Depot",
					address: "123 Main St",
					enabled: true,
				},
				{
					id: 2,
					name: "West Coast Storage",
					address: "123 Main St",
					enabled: true,
				},
			],
		},
		{
			id: 3,
			user_id: 3,
			user_name: "Luke Doe",
			user_email: "luke.doe@example.com",
			user_phone: "1234567890",
			warehouses: [
				{
					id: 1,
					name: "Garden City",
					address: "123 Main St",
					enabled: true,
				},
				{
					id: 2,
					name: "North Storage",
					address: "123 Main St",
					enabled: true,
				},
			],
		},
	];

    const form = useForm({
        initialValues: {
            warehouse_id: null,
            warehouse_name: null,
            warehouse_address: null,
        },
    });

	// calculate maximum number of warehouses across all users
	const maxWarehouses = useMemo(() => {
		return Math.max(...data.map((user) => user.warehouses?.length));
	}, [data]);

	// generate dynamic warehouse columns
	const warehouseColumns = useMemo(() => {
		return Array.from({ length: maxWarehouses }, (_, index) => ({
			accessor: `warehouse_${index + 1}`,
			title: t(`Warehouse ${index + 1}`),
			render: (record) => {
				const warehouse = record.warehouses[index];
				if (!warehouse) return "-";

				return (
					<Group gap="xs">
						<Switch
							size="sm"
							checked={warehouse.enabled}
							onChange={(event) => {
								// handle warehouse enable/disable
								console.log(
									`Toggle warehouse ${warehouse.id} to ${event.currentTarget.checked}`
								);
							}}
                            radius="sm"
                            color="red"
                            onLabel="ON" offLabel="OFF"
                            thumbIcon={
                                warehouse.enabled ? (
                                  <IconCheck size={12} color="red" stroke={3} />
                                ) : (
                                  <IconX size={12} color="red" stroke={3} />
                                )
                              }
						/>
						<Text size="sm">{warehouse.name}</Text>
					</Group>
				);
			},
		}));
	}, [maxWarehouses, t]);

	const columns = [
		{
			accessor: "index",
			title: t("S/N"),
			textAlign: "left",
			render: (_, index) => index + 1,
		},
		{ accessor: "user_name", title: t("Name") },
		{ accessor: "user_email", title: t("Email") },
		{ accessor: "user_phone", title: t("Phone") },
		...warehouseColumns,
	];

	return (
		<Grid columns={23} gutter={8}>
			<Grid.Col span={22}>
				<Box h={mainAreaHeight} bg="white" p="xs" className="borderRadiusAll">
                    <DataTable
                        classNames={{
                            root: tableCss.root,
                            table: tableCss.table,
                            header: tableCss.header,
                            footer: tableCss.footer,
                            pagination: tableCss.pagination,
                        }}
                        striped
                        records={data}
                        columns={columns}
                        loaderSize="xs"
                        loaderColor="grape"
                        scrollAreaProps={{ type: "never" }}
                    />
                </Box>
			</Grid.Col>
			<Grid.Col span={1}>
				<Box bg="white" className={"borderRadiusAll"} pt={"16"}>
					<_ShortcutMasterData
						adjustment={0}
						form={form}
						FormSubmit={"WarehouseFormSubmit"}
						Name={"name"}
						inputType="select"
					/>
				</Box>
			</Grid.Col>
		</Grid>
	);
}
