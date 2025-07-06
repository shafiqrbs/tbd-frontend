import React, {useEffect, useState, useMemo} from "react";
import {Box, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import {editEntityData} from "../../../../store/inventory/crudSlice.js";
import _UpdateInvoice from "./_UpdateInvoice.jsx";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

function SalesEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const progress = getLoadingProgress();

    // Safe parsing of config data from localStorage
    const domainConfigData = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("domain-config-data")) || {};
        } catch {
            return {};
        }
    }, []);

    const configData = domainConfigData?.inventory_config;

    const dataStatus = useSelector((state) => state.inventoryCrudSlice.dataStatus);
    const editedData = useSelector((state) => state.inventoryCrudSlice.entityEditData);

    const [entityEditData, setEntityEditData] = useState({});
    const [hasNotified, setHasNotified] = useState(false);

    // Initial fetch on mount
    useEffect(() => {
        dispatch(editEntityData(`inventory/sales/edit/${id}`));
    }, [dispatch, id]);

    // React to Redux state changes (e.g. success/error)
    useEffect(() => {
        if (dataStatus === 200) {
            setEntityEditData(editedData);
        }

        if (dataStatus === 404 && !hasNotified) {
            showNotificationComponent(t("InvalidRequest"), "teal");
            setTimeout(() => {
                navigate("/inventory/sales");
            }, 1000);
            setHasNotified(true);
        }
    }, [dataStatus, editedData, t, hasNotified, navigate]);

    // Rendering
    return (
        <>
            {progress !== 100 ? (
                <Progress
                    color='var(--theme-primary-color-6)'
                    size="sm"
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            ) : (
                <Box>
                    {configData && (
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t("SalesInvoice")}
                                roles={t("Roles")}
                                allowZeroPercentage={configData?.zero_stock}
                                currencySymbol={configData?.currency?.symbol}
                            />

                            <Box p={8}>
                                <_UpdateInvoice
                                    domainConfigData={domainConfigData}
                                    entityEditData={entityEditData}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </>
    );
}

export default SalesEdit;

