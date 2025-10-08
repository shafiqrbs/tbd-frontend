import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress";
import {Box, Progress} from "@mantine/core";
import ProcurementHeaderNavbar from "../ProcurementHeaderNavbar";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {editEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import _UpdateGenericRequisitionForm from "./_UpdateGenericRequisitionForm.jsx";

export default function RequisitionUpdate() {
    const {t} = useTranslation();
    const progress = getLoadingProgress();

    const domainConfigData = JSON.parse(localStorage.getItem("domain-config-data"));
    const configData = domainConfigData.inventory_config;
    const isWarehouse = domainConfigData?.inventory_config.sku_warehouse

    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const dataStatus = useSelector((state) => state.inventoryCrudSlice.dataStatus);
    const editedData = useSelector((state) => state.inventoryCrudSlice.entityEditData);
    const [entityEditData, setEntityEditData] = useState({});
    const [hasNotified, setHasNotified] = useState(false);

    useEffect(() => {
        if (!entityEditData.id) {
            dispatch(editEntityData(`inventory/requisition/${id}`))
        }

        if (dataStatus === 200) {
            setEntityEditData(editedData);
        }
        if (dataStatus === 404 && !hasNotified) {
            showNotificationComponent('Invalid Request', 'red')
            setTimeout(() => {
                navigate('/inventory/requisition')
            }, 1000)
            setHasNotified(true);
        }
    }, [dataStatus, entityEditData.id]);


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
                    {configData && (
                        <>
                            <ProcurementHeaderNavbar
                                pageTitle={t("NewRequisition")}
                                roles={t("Roles")}
                                configData={configData}
                            />
                            <Box p={8}>
                                {(
                                    <_UpdateGenericRequisitionForm
                                        allowZeroPercentage={configData?.zero_stock}
                                        currencySymbol={configData?.currency?.symbol}
                                        editedData={editedData}
                                        isWarehouse={isWarehouse}
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
