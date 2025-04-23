import React from "react";
import {useParams} from "react-router-dom";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import UserDiscountTable from "./UserDiscountTable";
import DiscountHeaderNavbar from "../DiscountHeaderNavbar";
import _DiscountShortcut from "../common/_DiscountShortcut";





export default function UserDiscountIndex() {
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
                    <DiscountHeaderNavbar
                        pageTitle={t("UserDiscount")}
                        pageDescription={t("UserDiscountDescription")}
                        roles={t("Roles")}
                        allowZeroPercentage=""
                        currencySymbol=""
                    />
                    <Box p={"8"}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={1}>
                                <_DiscountShortcut id={id}/>
                            </Grid.Col>
                            <Grid.Col span={23}>
                                <UserDiscountTable id={id}/>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            )}
        </>
    );
}
