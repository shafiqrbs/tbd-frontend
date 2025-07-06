import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

// Redux actions
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import {
	editEntityData,
	setEntityNewData,
	setFormLoading,
	setInsertType,
} from "../../../../store/accounting/crudSlice";

// Components
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import BalanceSheetTable from "./BalanceSheetTable";

// Hook
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import Navigation from "../common/Navigation.jsx";

const leftData = [
	{ particulars: "Opening Stock", amount: "-" },
	{ particulars: "Purchase Accounts", amount: "1,00,000.00" },
	{ particulars: <b>Gross Profit c/o</b>, amount: <b>50,000.00</b> },
	{
		particulars: "",
		amount: (
			<Box
				py={3}
				fw={700}
				style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}
			>
				1,50,000.00
			</Box>
		),
	},
	{ particulars: <b>Nett Profit</b>, amount: <b>50,000.00</b> },
];

const rightData = [
	{ particulars: "Sales Accounts", amount: "1,50,000.00" },
	{ particulars: "Closing Stock", amount: "-" },
	{ particulars: "-", amount: "-" },
	{
		particulars: "",
		amount: (
			<Box
				py={3}
				fw={700}
				style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}
			>
				1,50,000.00
			</Box>
		),
	},
	{ particulars: <b>Gross Profit b/f</b>, amount: <b>50,000.00</b> },
];

function BalanceSheetIndex() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const progress = getLoadingProgress();
	const { id } = useParams();
	const navigate = useNavigate();
	const { mainAreaHeight } = useOutletContext();

	const height = mainAreaHeight - 30;

	useEffect(() => {
		if (id) {
			dispatch(setInsertType("update"));
			dispatch(editEntityData(`accounting/balance-sheet/${id}`));
			dispatch(setFormLoading(true));
		} else {
			dispatch(setSearchKeyword(""));
			dispatch(setEntityNewData([]));
			navigate("/accounting/balance-sheet");
		}
	}, [id, dispatch, navigate]);

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
						pageTitle={t("BalanceSheet")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<Navigation module={""} />
							</Grid.Col>
							<Grid.Col span={11}>
								<BalanceSheetTable data={leftData} totalAmount="1,50,000.00" mainAreaHeight={height} />
							</Grid.Col>
							<Grid.Col span={12}>
								<BalanceSheetTable data={rightData} totalAmount="1,50,000.00" mainAreaHeight={height} />
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}

export default BalanceSheetIndex;
