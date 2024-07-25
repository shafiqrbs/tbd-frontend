import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Progress,
    Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import _RecipeTable from "./_RecipeTable.jsx";
import _RecipeForm from "./_RecipeForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";

function RecipeIndex() {
    const { t, i18n } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()


    return (
        <>

            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <ProductionHeaderNavbar
                        pageTitle={t('ProductionReceipe')}
                        roles={t('Roles')}
                        allowZeroPercentage={''}
                        currencySymbol={''}
                    />
                    <Box p={'8'} >
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                    <_RecipeTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9} >
                                <_RecipeForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default RecipeIndex;
