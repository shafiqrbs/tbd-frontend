import React, {useEffect, useState} from "react";
import {
    Box, Grid, Progress, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";

import ProductTable from "./ProductTable.jsx";
import ProductForm from "./ProductForm.jsx";
import ProductUpdateForm from "./ProductUpdateForm.jsx";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

function ProductIndex() {
    const {t, i18n} = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    <Box pl={`md`} pr={8} pb={'8'} pt={'6'} bg={'gray.1'}>
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={6} pl={'md'} fz={'18'}
                                       c={'indigo.4'}>{t('ManageProductInformation')}</Title>
                            </Grid.Col>
                        </Grid>
                    </Box>
                    <Box pr={'12'} pl={'12'}>
                        <Grid>
                            <Grid.Col span={8}>
                                <ProductTable/>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                {
                                    insertType === 'create' ? <ProductForm/> : <ProductUpdateForm/>
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            }
        </>
    );
}

export default ProductIndex;
