import React from "react";
import {useParams} from "react-router-dom";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _Shortcut from "../common/_Shortcut.jsx";
import ProductTable from "./ProductTable.jsx";
import B2BHeaderNavbar from "../B2BHeaderNavbar";

export default function ProductIndex() {
    const {id} = useParams();
    const {t} = useTranslation();
    const progress = getLoadingProgress();
    return (
        <>
            {progress !== 100 && (
                <Progress color="red" size={"sm"} striped animated value={progress}/>
            )}
            {progress === 100 && (
                <>
                    <B2BHeaderNavbar
                        pageTitle={t("B2BProduct")}
                        pageDescription={t("B2BProductDescription")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <_Shortcut id={id}/>
                            </Grid.Col>
                            <Grid.Col span={23}>
                                <ProductTable id={id}/>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            )}
        </>
    );
}
