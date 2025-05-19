import React, { useState } from "react";
import { Box, Card, Grid, Text } from "@mantine/core";
import { Button, Flex, Stack, Title, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import LedgerItemsTable from "../ledger-view/LedgerItemsTable.jsx";
import Shortcut from "../../shortcut/Shortcut";
import { IconCalendar } from "@tabler/icons-react";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";
import { useForm } from "@mantine/form";
import SelectForm from "../../../form-builders-filter/SelectForm.jsx";

export default function LedgerTabsItems({ navItems }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 104; //TabList height 104
	const inventoryConfigData = localStorage.getItem("config-data")
		? JSON.parse(localStorage.getItem("config-data"))
		: [];
	const [activeTab, setActiveTab] = useState(navItems[0]);
	const [selectedFinancialYear, setSelectedFinancialYear] = useState("");

	const form = useForm({
		initialValues: {
			financial_year: "",
			financial_start_date: "",
			financial_end_date: "",
		},
	});

	const currentYear = new Date().getFullYear();
	const financialYearOptions = Array.from({ length: 5 }, (_, index) => {
		const year = currentYear - index;
		return {
			value: year.toString(),
			label: `${year}-${year + 1}`,
		};
	});

	const handleFinancialYearChange = (value) => {
		setSelectedFinancialYear(value);
		form.setFieldValue("financial_year", value);
		
		// set start and end dates based on financial year
		const year = parseInt(value);
		const startDate = new Date(year, 3, 1); // April 1st
		const endDate = new Date(year + 1, 2, 31); // March 31st next year
		
		form.setFieldValue("financial_start_date", startDate);
		form.setFieldValue("financial_end_date", endDate);
	};

	const renderForm = () => {
		switch (activeTab) {
			case "Ledger":
				return <LedgerItemsTable />;
			case "Trail Balance":
				return <Box>Trail Balance</Box>;
			case "Profit & Loss":
				return <Box>Profit & Loss</Box>;
			case "Balance Sheet":
				return <Box>Balance Sheet</Box>;
			case "Journal":
				return <Box>Journal</Box>;
			case "Ledger View":
				return <Box>Ledger View</Box>;
			case "Income Statement":
				return <Box>Income Statement</Box>;
			case "Month End Closing":
				return <Box>Month End Closing</Box>;
			default:
				return <Box>No data found</Box>;
		}
	};

	return (
		<Box>
			<Grid columns={24} gutter={{ base: 8 }}>
				<Grid.Col span={4}>
					<Card shadow="md" radius="4" className={classes.card} padding="xs">
						<Grid gutter={{ base: 2 }}>
							<Grid.Col span={11}>
								<Text fz="md" fw={500} className={classes.cardTitle}>
									{t("LedgerNavigation")}
								</Text>
							</Grid.Col>
						</Grid>
						<Grid columns={9} gutter={{ base: 1 }}>
							<Grid.Col span={9}>
								<Box bg={"white"}>
									<Box mt={8} pt={"8"}>
										<ScrollArea
											h={height}
											scrollbarSize={2}
											scrollbars="y"
											type="never"
										>
											{navItems.map((item) => (
												<Box
													key={item}
													style={{
														borderRadius: 4,
														cursor: "pointer",
													}}
													className={`${classes["pressable-card"]} border-radius`}
													mih={40}
													mt={"4"}
													variant="default"
													onClick={() => setActiveTab(item)}
													bg={activeTab === item ? "#f8eedf" : "gray.1"}
												>
													<Text
														size={"sm"}
														pt={8}
														pl={8}
														fw={500}
														c={"black"}
													>
														{t(item)}
													</Text>
												</Box>
											))}
										</ScrollArea>
									</Box>
								</Box>
							</Grid.Col>
						</Grid>
					</Card>
				</Grid.Col>
				<Grid.Col span={19}>
					<Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
						<Box bg={"white"}>
							<Box
								pl={`xs`}
								pr={8}
								pt={"8"}
								pb={"10"}
								mb={"4"}
								className={"boxBackground borderRadiusAll"}
							>
								<Grid>
									<Grid.Col span={2}>
										<Title order={6} pt={"8"}>
											{t(activeTab)}
										</Title>
									</Grid.Col>
									<Grid.Col span={10}>
										<Flex gap={10}>
											<Box>
												<SelectForm
													tooltip={t("ChooseFinancialYear")}
													label=""
													placeholder={t("ChooseFinancialYear")}
													required={false}
													nextField={"financial_start_date"}
													name={"financial_year"}
													form={form}
													dropdownValue={financialYearOptions}
													id={"financial_year"}
													searchable={false}
													value={selectedFinancialYear}
													changeValue={handleFinancialYearChange}
													module="file-upload"
													leftSection={
														<IconCalendar size={16} opacity={0.5} />
													}
													rightSectionWidth={30}
												/>
											</Box>
											<Box>
												<DatePickerForm
													tooltip={t("FinancialStartDateTooltip")}
													label=""
													placeholder={t("FinancialStartDate")}
													required={false}
													nextField={"financial_end_date"}
													form={form}
													name={"financial_start_date"}
													id={"financial_start_date"}
													leftSection={
														<IconCalendar size={16} opacity={0.5} />
													}
													rightSectionWidth={30}
													closeIcon={true}
												/>
											</Box>
											<Box>
												<DatePickerForm
													tooltip={t("FinancialEndDateTooltip")}
													label=""
													placeholder={t("FinancialEndDate")}
													required={false}
													nextField={"capital_investment_id"}
													form={form}
													name={"financial_end_date"}
													id={"financial_end_date"}
													leftSection={
														<IconCalendar size={16} opacity={0.5} />
													}
													rightSectionWidth={30}
													closeIcon={true}
												/>
											</Box>
										</Flex>
									</Grid.Col>
								</Grid>
							</Box>
							<Box className={"borderRadiusAll"}>
								{renderForm()}
							</Box>
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={1}>
					<Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
						<Shortcut Name={"name"} inputType="select" />
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
