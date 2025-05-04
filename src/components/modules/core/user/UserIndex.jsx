import React, {useEffect} from "react";
import {Box, Grid, Progress} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import _UserTable from "./_UserTable.jsx";
import _UserForm from "./_UserForm.jsx";
import _UserUpdateForm from "./_UserUpdateForm.jsx";
import {useTranslation} from "react-i18next";
import {
    editEntityData,
    setEntityNewData,
    setFormLoading,
    setInsertType,
    setSearchKeyword,
} from "../../../../store/core/crudSlice.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import {useNavigate, useParams} from "react-router-dom";
import Navigation from "../common/Navigation.jsx";

function UserIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType);
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData);

    const {id} = useParams();
    const navigate = useNavigate();
    const progress = getLoadingProgress();

    useEffect(() => {
        id
            ? (dispatch(setInsertType("update")),
                dispatch(editEntityData(`core/user/${id}`)),
                dispatch(setFormLoading(true)))
            : (dispatch(setInsertType("create")),
                dispatch(setSearchKeyword("")),
                dispatch(
                    setEntityNewData({
                        ...userFilterData,
                        name: "",
                        mobile: "",
                        email: "",
                    })
                ),
                navigate("/core/user", {replace: true}));
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
                <Box>
                    <CoreHeaderNavbar
                        pageTitle={t("ManageUser")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <Navigation module={"user"}/>
                            </Grid.Col>
                            {insertType === "create" && (
                                <Grid.Col span={14}>
                                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                        <_UserTable/>
                                    </Box>
                                </Grid.Col>
                            )}
                            <Grid.Col span={insertType === "create" ? 9 : 23}>
                                {insertType === "create" ? <_UserForm/> : <_UserUpdateForm/>}
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default UserIndex;
