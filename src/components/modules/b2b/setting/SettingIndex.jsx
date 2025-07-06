import React from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_Shortcut.jsx";
import SubDomainSettingForm from "./SubDomainSettingForm.jsx";
import B2BHeaderNavbar from "../B2BHeaderNavbar";

export default function SettingIndex() {
    const {id} = useParams();
    const {t} = useTranslation();
    const progress = getLoadingProgress();

    if (progress !== 100) {
        return <Progress color='var(--theme-primary-color-6)' size="sm" striped animated value={progress}/>;
    }
    return (
        <>
            <B2BHeaderNavbar
                pageTitle={t("B2BSetting")}
                pageDescription={t("B2BSettingDescription")}
                roles={t("Roles")}
                allowZeroPercentage=""
                currencySymbol=""
            />
            <Box p={8}>
                <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={1}>
                        <_Shortcut id={id}/>
                    </Grid.Col>
                    <Grid.Col span={23}>
                        <SubDomainSettingForm id={id}/>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}
