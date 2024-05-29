import React, { useEffect, useState } from "react";
import {
    Box, Button, Flex, Grid, Progress, rem, Menu
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import CategoryGroupTable from "./CategoryGroupTable.jsx";
import CategoryGroupForm from "./CategoryGroupForm.jsx";
import CategoryGroupUpdateForm from "./CategoryGroupUpdateForm.jsx";
import { setSearchKeyword } from "../../../../store/core/crudSlice.js";
import { setInsertType } from "../../../../store/inventory/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar";



function CategoryGroupIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t('ProductCategoryGroup')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData.currency.symbol}
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={15} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <CategoryGroupTable />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create' ? <CategoryGroupForm /> : <CategoryGroupUpdateForm />
                                        }
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </>
                    }
                </Box>
            }
        </>
    );
}

export default CategoryGroupIndex;
