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
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { editEntityData, setDropdownLoad, setEntityNewData, setFormLoading, setInsertType, setSearchKeyword } from "../../../../store/inventory/crudSlice.js";
import { getCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";
import NavigationGeneral from "../common/NavigationGeneral.jsx";

function  ProductIndex() {
    const { t, i18n } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const {configData,fetchData} = getConfigData()
    const dispatch = useDispatch()

    const navigate = useNavigate();
    const { id } = useParams()

    useEffect(() => {
        id ? ((
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`inventory/product/${id}`)),
            dispatch(setFormLoading(true))
        )) : ((
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData([])),
            navigate('/inventory/product', { replace: true })
        ))
    }, [id, dispatch, navigate])

    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)

    let categoryDropdown = categoryDropdownData && categoryDropdownData.length > 0
        ? categoryDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []

    useEffect(() => {
        const value = {
            url: 'inventory/select/category',
            param: {
                // type: 'parent'
                type: 'all'
            }
        }
        dispatch(getCategoryDropdown(value))
        dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);



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
                                            <Grid.Col span={1}>
                                                <NavigationGeneral module={"product"} />
                                            </Grid.Col>
                                            <Grid.Col span={14}>
                                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                                    <ProductTable categoryDropdown={categoryDropdown}/>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={9}>
                                                <ProductForm categoryDropdown={categoryDropdown} />
                                            </Grid.Col>
                                        </Grid>
                                        :
                                        <Box>
                                            <ProductUpdateForm categoryDropdown={categoryDropdown} />
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
