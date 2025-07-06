import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
	setEntityNewData,
	setInsertType,
	setSearchKeyword,
	editEntityData,
	setFormLoading,
} from "../../../../store/core/crudSlice.js";

import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

import CoreHeaderNavbar from "../CoreHeaderNavbar.jsx";
import Navigation from "../common/Navigation.jsx";
import WarehouseListTable from "./WarehouseListTable.jsx";

function WarehouseListIndex() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { insertType } = useSelector((state) => state.crudSlice);
	const progress = getLoadingProgress();
	const { configData = {} } = getConfigData();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			dispatch(setInsertType("update"));
			dispatch(editEntityData(`/core/warehouse-list/${id}`));
			dispatch(setFormLoading(true));
		} else {
			dispatch(setInsertType("create"));
			dispatch(setSearchKeyword(""));
			dispatch(setEntityNewData([]));

			if (window.location.pathname !== "/core/warehouse-list") {
				navigate("/core/warehouse-list");
			}
		}
	}, [id]);

	return (
		<>
			{progress < 100 && (
				<Progress
					color='var(--theme-primary-color-6)'
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			)}

			{progress === 100 && configData && (
				<Box>
					<CoreHeaderNavbar pageTitle={t("Warehouse")} roles={t("Roles")} />
					<Box p="8">
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<Navigation module={"warehouse"} />
							</Grid.Col>
							<Grid.Col span={23}>
								<Box className="borderRadiusAll">
									<WarehouseListTable />
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}

export default WarehouseListIndex;
