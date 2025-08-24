import React, {useEffect, useMemo, useState} from "react";
import { Box, Progress, rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editEntityData } from "../../../../store/inventory/crudSlice.js";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import _UpdatePurchaseInvoice from "./_UpdatePurchaseInvoice.jsx"

function PurchaseEdit() {
  let { id } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const progress = getLoadingProgress();
  // Safe parsing of config data from localStorage
  const domainConfigData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("domain-config-data")) || {};
    } catch {
      return {};
    }
  }, []);

  const dataStatus = useSelector(
    (state) => state.inventoryCrudSlice.dataStatus
  );
  const editedData = useSelector(
    (state) => state.inventoryCrudSlice.entityEditData
  );
  const [entityEditData, setEntityEditData] = useState({});
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    if (!entityEditData.id) {
      dispatch(editEntityData(`inventory/purchase/edit/${id}`));
    }

    if (dataStatus === 200) {
      setEntityEditData(editedData);
    }
    if (dataStatus === 404 && !hasNotified) {
      notifications.show({
        color: "teal",
        title: t("InvalidRequest"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 1000,
        style: { backgroundColor: "lightgray" },
      });
      setTimeout(() => {
        navigate("/inventory/purchase");
      }, 1000);
      setHasNotified(true);
    }
  }, [dataStatus, entityEditData.id]);


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
        <Box>
          {domainConfigData && (
            <>
              <_SalesPurchaseHeaderNavbar
                pageTitle={t("PurchaseInvoice")}
                roles={t("Roles")}
                allowZeroPercentage={domainConfigData?.inventory_config?.zero_stock}
                currencySymbol={domainConfigData?.inventory_config?.currency?.symbol}
              />
              <Box p={"8"}>
                {/*{domainConfigData?.inventory_config?.business_model?.slug === "general" && (*/}
                  <_UpdatePurchaseInvoice
                      domainConfigData={domainConfigData}
                      editedData={editedData}
                  />
                {/*)}*/}
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}

export default PurchaseEdit;
