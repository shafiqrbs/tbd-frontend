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
import HeadGroupForm from "./HeadGroupForm";
import HeadGroupUpdateForm from "./HeadGroupUpdateFrom.jsx";
import HeadGroupTable from "./HeadGroupTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";

// Hook
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import Navigation from "../common/Navigation.jsx";

function HeadGroupIndex() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType);
    const progress = getLoadingProgress();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(setInsertType("update"));
            dispatch(editEntityData(`accounting/account-head/${id}`));
            dispatch(setFormLoading(true));
        } else {
            dispatch(setSearchKeyword(""));
            dispatch(setEntityNewData([]));
            navigate("/accounting/head-group");
        }
    }, [id, dispatch, navigate]);

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
                    <AccountingHeaderNavbar
                        pageTitle={t("ManageAccountHeadGroup")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p="8">
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={1}>
                                <Navigation module={""} />
                                </Grid.Col>
                            <Grid.Col span={14}>
                                <Box bg="white" p="xs" className="borderRadiusAll">
                                    <HeadGroupTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {insertType === "update" ? (
                                    <HeadGroupUpdateForm />
                                ) : (
                                    <HeadGroupForm />
                                )}
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default HeadGroupIndex;
