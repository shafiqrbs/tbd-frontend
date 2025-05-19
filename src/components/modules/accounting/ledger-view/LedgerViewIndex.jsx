import React from "react";
import LedgerTabsItems from "../common/LedgerTabsItems";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import Navigation from "../common/Navigation";
import { useLocation } from "react-router-dom";

export default function LedgerViewIndex() {
	const { t } = useTranslation();
	const progress = getLoadingProgress();
	const location = useLocation();

	const navItems = location.state?.headSubGroup
		? ["Ledger"]
		: [
				"Ledger",
				"Bank Transfer",
				"Profit & Loss",
				"Balance Sheet",
				"Journal",
				"Ledger View",
				"Income Statement",
				"Month End Closing",
				"Year End Closing",
		  ];

	return (
		<>
			{progress !== 100 && (
				<Progress color="red" size={"sm"} striped animated value={progress} />
			)}
			{progress === 100 && (
				<>
					<AccountingHeaderNavbar
						pageTitle={t("ManageLedgerView")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p={"8"}>
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<Navigation module={"config"} />
							</Grid.Col>
							<Grid.Col span={23}>
								<LedgerTabsItems navItems={navItems} />
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
