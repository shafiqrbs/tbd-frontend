import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import CouponForm from "./CouponForm";
import CouponTable from "./CouponTable";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import { Progress, Box, Grid } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editEntityData,
  setEntityNewData,
  setFormLoading,
  setInsertType,
  setSearchKeyword,
} from "../../../../store/inventory/crudSlice";

export default function CouponIndex() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const { configData } = getConfigData();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)
  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`inventory/coupon-code/${id}`));
      dispatch(setFormLoading(true));
    } else if (!id) {
      dispatch(setInsertType("create"));
      dispatch(setSearchKeyword(""));
      dispatch(setEntityNewData([]));
      navigate("/inventory/coupon-code", { replace: true });
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
                pageTitle={t("ManageCouponCode")}
                roles={t("Roles")}
                allowZeroPercentage={configData.zero_stock}
                currencySymbol={configData?.currency?.symbol}
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={15}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <CouponTable />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    {insertType === "create" ? (
                      <CouponForm
                      />
                    ) : (
                      <CouponUpdateForm
                      />
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
