import React, {useState} from 'react';
import {
    Box,
    Grid,
    Progress,
} from '@mantine/core';
import {useTranslation} from 'react-i18next';

import {getLoadingProgress} from '../../../global-hook/loading-progress/getLoadingProgress';
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";
import _RecipeItemsTable from "./_RecipeItemsTable.jsx";

function RecipeItemsIndex() {
    const {t, i18} = useTranslation();
    const progress = getLoadingProgress();
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const [fetching, setFetching] = useState(true)
    const [layoutLoading, setLayoutLoading] = useState(false)

    return (
        <>
            {progress !== 100 &&
                <Progress color='red' size={'sm'} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <ProductionHeaderNavbar
                                pageTitle={t('ManageProductionItem')}
                                roles={t('Roles')}
                                allowedZeroPercentage={configData?.zero_stock}
                                currentSymbol={configData?.currency?.symbol}
                                setFetching={setFetching}
                                fetching={fetching}
                                setLayoutLoading={setLayoutLoading}
                                layoutLoading={layoutLoading}
                            />
                            <Box p={'8'}>

                                <Grid columns={24} gutter={{base: 8}}>
                                    <Grid.Col span={24}>
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                            <_RecipeItemsTable
                                                setFetching={setFetching}
                                                fetching={fetching}
                                                setLayoutLoading={setLayoutLoading}
                                                layoutLoading={layoutLoading}/>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </>}
                </Box>}
        </>
    )
}

export default RecipeItemsIndex;