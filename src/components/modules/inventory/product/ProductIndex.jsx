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
import { useNavigate, useParams } from "react-router-dom";
import { editEntityData, setEntityNewData, setFormLoading, setInsertType, setSearchKeyword } from "../../../../store/inventory/crudSlice.js";

function ProductIndex() {
    const { t, i18n } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()
    const dispatch = useDispatch()

    const navigate = useNavigate();
    const { productId } = useParams()

    useEffect(() => {
        productId ? ((
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`inventory/product/${productId}`)),
            dispatch(setFormLoading(true))
        )) : ((
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData([])),
            navigate('/inventory/product', { replace: true })
        ))
    }, [productId, dispatch, navigate])


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
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
                                {
                                    insertType === 'create' ?
                                        <Grid columns={24} gutter={{ base: 8 }}>
                                            <Grid.Col span={15}>
                                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                                    <ProductTable />
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={9}>
                                                <ProductForm />
                                            </Grid.Col>
                                        </Grid>
                                        :
                                        <Box>
                                            <ProductUpdateForm />
                                        </Box>
                                }
                            </Box>
                        </>
                    }
                </Box>
            }
        </>
    );
}

export default ProductIndex;
