import React from "react";
import {useParams} from "react-router-dom";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_DiscountSearch.jsx";
import DiscountHeaderNavbar from "../DiscountHeaderNavbar";
import _DiscountShortcut from "../common/_DiscountShortcut";


export default function DiscountDashboard() {
    const {id} = useParams();
    const {t} = useTranslation();
    const progress = getLoadingProgress();

    return (
        <>
            {progress !== 100 && (
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress}/>
            )}
            {progress === 100 && (
                <>
                    <DiscountHeaderNavbar
                        pageTitle={t("B2BCategory")}
                        pageDescription={t("B2BCategoryDescription")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <_DiscountShortcut/>
                            </Grid.Col>
                            
                        </Grid>
                    </Box>
                </>
            )}
        </>
    );
}
