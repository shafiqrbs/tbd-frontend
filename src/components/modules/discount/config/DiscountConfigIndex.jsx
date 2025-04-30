import React from "react";
import {useParams} from "react-router-dom";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_DiscountSearch.jsx";
import ConfigDiscountForm from "./DiscountConfigForm.jsx";
import DiscountHeaderNavbar from "../DiscountHeaderNavbar";
import _DiscountShortcut from "../common/_DiscountShortcut";


export default function DiscountConfigIndex() {
    const {id} = useParams();
    const {t} = useTranslation();
    const progress = getLoadingProgress();

    const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data'))

     console.log(domainConfigData)
    return (
        <>
            {progress !== 100 && (
                <Progress color="red" size={"sm"} striped animated value={progress}/>
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
                            <Grid.Col span={23} >
                                <ConfigDiscountForm domainConfig={domainConfigData}  id={id}/>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            )}
        </>
    );
}
