import React from "react";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";
import _UserWarehouse from "./_UserWarehouse.jsx";
import ProductionNavigation from "../../common/ProductionNavigation.jsx";

export default function IssueWarehouseIndex() {
    const {t, i18n} = useTranslation();
    const progress = getLoadingProgress();

    return (
        <>
            {progress !== 100 && (
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress}/>
            )}
            {progress === 100 && (
                <>
                    <ProductionHeaderNavbar
                        pageTitle={t("UserWarehouse")}
                        roles={t("Roles")}
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <ProductionNavigation module={"production-issue"} type={"production-issue"}/>
                            </Grid.Col>
                            <Grid.Col span={23}>
                                <_UserWarehouse/>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            )}
        </>
    );
}
