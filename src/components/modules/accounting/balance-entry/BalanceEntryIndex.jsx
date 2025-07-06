import React, { useContext } from "react";
import { Box, Grid, Progress, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import Navigation from "../common/Navigation";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import BalanceBarChart from "./BalanceBarChart";
import { useOutletContext } from "react-router-dom";

const data = [
	{
		month: "April",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "May",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "June",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "July",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "August",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "September",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "October",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "November",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "December",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "January",
		debit: "",
		credit: "",
		closing_balance: "",
	},
	{
		month: "February",
		debit: "",
		credit: "13,705.00",
		closing_balance: "13,705.00 Cr",
		highlight: true,
	},
	{
		month: "March",
		debit: "",
		credit: "",
		closing_balance: "",
	},
];

function BalanceEntryIndex() {
	const { t } = useTranslation();
	const progress = getLoadingProgress();
    const { mainAreaHeight } = useOutletContext();

	const groups = [
		{
			id: "particulars",
			title: <b>Particulars</b>,
			columns: [{ accessor: "month", title: "", footer: <b>Grand Total</b> }],
		},
		{
			id: "transaction",
			title: <b>Transaction</b>,
			textAlign: "center",
			style: {
				borderRight: "1px solid #d7d7d7",
				borderBottom: "1px solid #d7d7d7",
			},
			columns: [
				{
					accessor: "debit",
					title: "Debit",
					textAlign: "center",
                    width: 350,
				},
				{
					accessor: "credit",
					title: "Credit",
					textAlign: "center",
					footer: <b>13,705.00</b>,
                    width: 350,
				},
			],
		},
		{
			id: "closing-balance",
			textAlign: "right",
			title: <b>Closing Balance</b>,
			columns: [
				{
					accessor: "closing_balance",
					title: "",
					textAlign: "right",
					width: 200,
					footer: <b>13,705.00</b>,
				},
			],
		},
	];

	return (
		<>
			{progress !== 100 && (
				<Progress
					color='var(--theme-primary-color-6)'
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			)}
			{progress === 100 && (
				<Box>
					<AccountingHeaderNavbar
						pageTitle={t("BalanceEntry")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<Navigation module={""} />
							</Grid.Col>
							<Grid.Col span={23}>
								<ScrollArea h={mainAreaHeight}>
									<Box bg="white" className={"borderRadiusAll"} p="xs">
										<DataTable
											classNames={{
												root: tableCss.root,
												table: tableCss.table,
												header: tableCss.header,
												footer: tableCss.footer,
											}}
											styles={{
												tableLayout: "fixed",
											}}
											withTableBorder
											withColumnBorders
											withRowBorders={false}
											striped
											highlightOnHover
											groups={groups}
											records={data}
											className={tableCss.balanceEntryTable}
											rowClassName={(record) =>
												record.highlight ? "highlight-row" : ""
											}
										/>
									</Box>
									{/* -------------- balance bar chart -------------- */}
									<BalanceBarChart />
								</ScrollArea>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}

export default BalanceEntryIndex;
