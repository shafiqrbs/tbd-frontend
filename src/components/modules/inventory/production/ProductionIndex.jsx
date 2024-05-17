import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Progress,
    ScrollArea,
    Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getLoadingProgress } from '../../../global-hook/loading-progress/getLoadingProgress';

import InventoryHeaderNavbar from '../configuraton/InventoryHeaderNavbar';

import getConfigData from '../../../global-hook/config-data/getConfigData';
import ProductionTable from './ProductionTable';

function ProductionIndex() {
    const { t, i18 } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress();
    const configData = getConfigData();


    return (
        <>
            {progress !== 100 &&
                <Progress color='red' size={'xs'} striped animated value=
                    {progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t('ManageProductionItem')}
                                roles={t('Roles')}
                                allowedZeroPercentage={configData.zero_stock}
                                currentSymbol={configData.currency.symbol}
                            />
                            <Box p={'8'}>

                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={24}>
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                            {/* <ScrollArea scrollbars='x'>
                                            </ScrollArea> */}
                                            <ProductionTable />

                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </>}
                </Box>}
        </>
    )
}
export default ProductionIndex;