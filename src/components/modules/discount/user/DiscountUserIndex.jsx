import React, {useEffect, useState} from "react";
import {Box, Grid, Progress, TextInput} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    editEntityData,
    setEntityNewData,
    setFormLoading,
    setInsertType,
    setSearchKeyword,
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import { useNavigate, useParams } from "react-router-dom";
import DiscountHeaderNavbar from "../DiscountHeaderNavbar";
import _DiscountUserTable from "./_DiscountUserTable";
import {getHotkeyHandler} from "@mantine/hooks";
import _Shortcut from "../common/_DiscountSearch";
import _DiscountShortcut from "../common/_DiscountShortcut";



function DiscountUserIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType);
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData);
    const { id } = useParams();
    const navigate = useNavigate();
    const progress = getLoadingProgress();



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
                    <DiscountHeaderNavbar
                        pageTitle={t("ManageUser")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={1}>
                                <_DiscountShortcut/>
                            </Grid.Col>
                            <Grid.Col span={23}>
                                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                    <_DiscountUserTable />
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default DiscountUserIndex;
