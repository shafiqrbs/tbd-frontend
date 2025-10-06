import React from "react";
import {useParams} from "react-router-dom";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_Shortcut.jsx";
import B2bDomainStockPriceTable from "./B2bDomainStockPriceTable.jsx";
import B2BHeaderNavbar from "../B2BHeaderNavbar";

export default function B2bDomainStockPriceIndex() {
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
                    <B2BHeaderNavbar
                        pageTitle={t("B2BDomain")}
                        pageDescription={t("B2BDomainDescription")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <_Shortcut id={id} module={"b2b_dashboard"}/>
                            </Grid.Col>
                            <Grid.Col span={23}>
                                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                    <B2bDomainStockPriceTable id={id}/>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            )}
        </>
    );
}
