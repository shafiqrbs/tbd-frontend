import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import TransferForm from "./TransferForm";
import TransferTable from "./TransferTable";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import { Progress, Box, Grid } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  setInsertType,
  editEntityData,
} from "../../../../store/inventory/crudSlice";
import TransferUpdateForm from "./TransferUpdateForm";

export default function TransferIndex() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const { configData } = getConfigData();
  const { id } = useParams();
  const insertType = useSelector((state) => state.crudSlice.insertType);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`inventory/stock-transfer/${id}`));
      dispatch(setFormLoading(true));
    } else if (!id) {
      dispatch(setInsertType("create"));
      navigate("/inventory/stock-transfer", { replace: true });
    }
  }, [id, dispatch, navigate]);
  return (
    <>
      {progress !== 100 && (
        <Progress
          color="red"
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
                pageTitle={t("ManageStockTransfer")}
                roles={t("Roles")}
                allowZeroPercentage={configData.zero_stock}
                currencySymbol={configData?.currency?.symbol}
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={15}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <TransferTable />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    {insertType === "create" ? (
                      <TransferForm />
                    ) : (
                      <TransferUpdateForm />
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
