import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Redux actions
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import {
    editEntityData,
    setEntityNewData,
    setFormLoading,
    setInsertType
} from "../../../../store/accounting/crudSlice";

// Components


// Hook
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";

import DomainHeaderNavbar from "../DomainHeaderNavbar";
import HeadSubDomainTable from "../head-subgroup/HeadSubDomainTable";
import HeadDomainUpdateFrom from "./HeadDomainUpdateFrom";
import HeadDomainForm from "./HeadDomainForm";
import HeadDomainTable from "./HeadDomainTable";
import _Navigation from "../common/_Navigation";

function HeadDomainIndex() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType);
    const progress = getLoadingProgress();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(setInsertType("update"));
            dispatch(editEntityData(`domain/head/${id}`));
            dispatch(setFormLoading(true));
        } else {
            dispatch(setSearchKeyword(""));
            dispatch(setEntityNewData([]));
             navigate("/domain/head");
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
                    <DomainHeaderNavbar
                        pageTitle={t("ManageAccountHeadGroup")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p="8">
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={1}>
                                <_Navigation module={""} />
                                </Grid.Col>
                            <Grid.Col span={14}>
                                <Box bg="white" p="xs" className="borderRadiusAll">
                                    <HeadDomainTable
                                    />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {insertType === "update" ? (
                                    <HeadDomainUpdateFrom />
                                ) : (
                                    <HeadDomainForm />
                                )}
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default HeadDomainIndex;
