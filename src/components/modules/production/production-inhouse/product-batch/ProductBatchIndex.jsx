import React from "react";
import { Progress, Box, Grid, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import AccountingHeaderNavbar from "../../../accounting/AccountingHeaderNavbar";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress";
import ProductBatchTable from "./ProductBatchTable";
import Navigation from "../../../accounting/common/Navigation";
import { useOutletContext } from "react-router-dom";

export default function ProductBatchIndex() {
	const { t } = useTranslation();
	const progress = getLoadingProgress();
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-primary-color-6)"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
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
										<ProductBatchTable />
									</Box>
								</ScrollArea>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}
