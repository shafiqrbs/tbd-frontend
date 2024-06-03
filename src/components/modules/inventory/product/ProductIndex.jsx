import React, { useEffect, useState } from "react";
import {
    Box, Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import ProductTable from "./ProductTable.jsx";
import ProductForm from "./ProductForm.jsx";
import ProductUpdateForm from "./ProductUpdateForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar";
import CategoryTable from "../category/CategoryTable";
import CategoryForm from "../category/CategoryForm";
import CategoryUpdateForm from "../category/CategoryUpdateForm";

function ProductIndex() {
    const { t, i18n } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t('ManageProduct')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={15} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <ProductTable />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create' ? <ProductForm /> : <ProductUpdateForm />
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

export default ProductIndex;
