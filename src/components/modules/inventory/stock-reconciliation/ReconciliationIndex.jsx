import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import ReconciliationForm from "./ReconciliationForm";
import ReconciliationTable from "./ReconciliationTable";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import { Progress, Box, Grid } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  setInsertType,
  editEntityData,
  setFormLoading,
} from "../../../../store/inventory/crudSlice";
import ReconciliationUpdateForm from "./ReconciliationUpdateForm";

export default function ReconciliationIndex() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const { id } = useParams();
  const { configData } = useConfigData();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const insertType = useSelector((state) => state.crudSlice.insertType);

  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`inventory/stock-reconciliation/${id}`));
      dispatch(setFormLoading(true));
    } else if (!id) {
      dispatch(setInsertType("create"));
      navigate("/inventory/stock-reconciliation", { replace: true });
    }
  }, [id, dispatch, navigate]);
  return (
    <>
      {progress !== 100 && (
        <Progress
          color='var(--theme-primary-color-6)'
          size={"sm"}
          striped
          animated
          value={progress}
          transitionDuration={200}
        />
      )}
      {progress === 100 && (
        <>
          {configData && (
            <>
              <InventoryHeaderNavbar
                pageTitle={t("ManageStockReconciliation")}
                roles={t("Roles")}
                allowZeroPercentage={configData.zero_stock}
                currencySymbol={configData?.currency?.symbol}
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={15}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <ReconciliationTable />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    {insertType === "create" ? (
                      <ReconciliationForm />
                    ) : (
                      <ReconciliationUpdateForm />
                    )}
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}
