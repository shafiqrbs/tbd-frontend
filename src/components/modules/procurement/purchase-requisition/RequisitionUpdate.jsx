import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import {Box, Progress, rem} from "@mantine/core";
import ProcurementHeaderNavbar from "../ProcurementHeaderNavbar";
import _GenericRequisitionForm from "./_GenericRequisitionForm";
import _UpdateRequisitionForm from "./_UpdateRequisitionForm.jsx";
import {editEntityData, storeEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {showEntityData} from "../../../../store/core/crudSlice.js";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

export default function RequisitionUpdate() {
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const configData = getConfigData();
  const { id } = useParams()
  const dispatch = useDispatch()

  const dataStatus = useSelector((state) => state.inventoryCrudSlice.dataStatus);
  const editedData = useSelector((state) => state.inventoryCrudSlice.entityEditData);
  const [entityEditData,setEntityEditData] = useState({});
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    if(!entityEditData.id){
      dispatch(editEntityData(`inventory/requisition/${id}`))
    }

    if(dataStatus === 200){
      setEntityEditData(editedData);
    }
    if (dataStatus === 404 && !hasNotified){
      notifications.show({
        color: 'teal',
        title: t('InvalidRequest'),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 1000,
        style: { backgroundColor: 'lightgray' },
      });
      setTimeout(()=>{
        navigate('/inventory/requisition')
      },1000)
      setHasNotified(true);
    }
  },[dataStatus, entityEditData.id]);

  return (
    <>
      {progress !== 100 && (
        <Progress
          color="red"
          size="sm"
          striped
          animated
          value={progress}
          transitionDuration={200}
        />
      )}
      {progress === 100 && (
        <Box>
          {configData && (
            <>
              <ProcurementHeaderNavbar
                pageTitle={t("UpdateRequisition")}
                roles={t("Roles")}
              />
              <Box p={8}>
                {  (
                  <_UpdateRequisitionForm
                    allowZeroPercentage={configData?.zero_stock}
                    currencySymbol={configData?.currency?.symbol}
                    editedData={editedData}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
