import React, { useEffect, useState } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import _InhouseTable from "./_InhouseTable.jsx";
import _InhouseForm from "./_InhouseForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";
import { editEntityData } from "../../../../store/production/crudSlice.js";
import ProductionNavigation from "../common/ProductionNavigation.jsx";

function InhouseIndex(props) {
    const params = useParams();
    const id = props.batchId ? props.batchId : params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const progress = getLoadingProgress();

    const editedData = useSelector(
        (state) => state.productionCrudSlice.entityEditData
    );
    const dataStatus = useSelector(
        (state) => state.productionCrudSlice.dataStatus
    );

    const [batchData, setBatchData] = useState(null);
    const [reloadBatchItemTable, setReloadBatchItemTable] = useState(false);

    useEffect(() => {
        const fetchOrCreateBatch = async () => {
            try {
                if (!id) {
                    // create batch
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_GATEWAY_URL}production/batch`,
                        { mode: "in-house" },
                        {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "X-Api-Key": import.meta.env.VITE_API_KEY,
                                "X-Api-User": JSON.parse(localStorage.getItem("user")).id,
                            },
                        }
                    );

                    if (res.data.status === 200) {
                        navigate(`/production/batch/${res.data.data.id}`);
                        setReloadBatchItemTable(false);
                    }
                } else {
                    // fetch existing batch
                    dispatch(editEntityData(`production/batch/${id}`));
                    setReloadBatchItemTable(false);
                }
            } catch (error) {
                console.error(error);
                alert(error.message || "Error loading batch");
            }
        };

        fetchOrCreateBatch();
    }, [id, reloadBatchItemTable, dispatch, navigate]);

    useEffect(() => {
        if (dataStatus === 200) {
            setBatchData(editedData);
        }
    }, [dataStatus, editedData]);

    return (
        <>
            {progress !== 100 && (
                <Progress
                    color="var(--theme-primary-color-6)"
                    size="sm"
                    striped
                    animated
                    value={progress}
                    transitionDuration={200}
                />
            )}

            {progress === 100 && (
                <Box>
                    {!props.batchId && (
                        <ProductionHeaderNavbar
                            pageTitle={t("ProductionBatch - ") + (batchData?.invoice ?? "")}
                            roles={t("Roles")}
                        />
                    )}

                    <Box p="8" bg="white">
                        <Grid columns={24} gutter={{ base: 8 }}>
                            {!props.batchId && (
                                <Grid.Col span={1}>
                                    <ProductionNavigation module="new-batch" />
                                </Grid.Col>
                            )}

                            <Grid.Col span={props.batchId ? 24 : 23}>
                                <Box p="xs" className="borderRadiusAll">
                                    <_InhouseTable
                                        setReloadBatchItemTable={setReloadBatchItemTable}
                                    />

                                    <Box mt="md">
                                        {batchData && <_InhouseForm batchData={batchData} />}
                                    </Box>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default InhouseIndex;
