import React, { useEffect, useState } from "react";
import {
    Box, Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import {
    setCustomerFilterData,
    setEntityNewData,
    setInsertType,
    setSearchKeyword,
    editEntityData,
    setFormLoading
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { useNavigate, useParams } from "react-router-dom";
import ProductionSettingTable from "./ProductionSettingTable.jsx";
import ProductionSettingForm from "./ProductionSettingForm.jsx";
import ProductionSettingUpdateForm from "./ProductionSettingUpdateForm.jsx";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";

function ProductionSettingIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const adjustment = 0;

    const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()
    const navigate = useNavigate()

    const { settingsId } = useParams();


    useEffect(() => {
        if (settingsId) {
            dispatch(setInsertType('update'));
            dispatch(editEntityData(`/production/setting/${settingsId}`));
            dispatch(setFormLoading(true));
        } else if (!settingsId) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            dispatch(setEntityNewData([]));
            // dispatch(setCustomerFilterData({
            //     ...masterDataFilterData,
            //     ['name']: '',
            //     ['mobile']: ''
            // }));
            navigate('/production/setting', { replace: true });
        }
    }, [settingsId, dispatch, navigate]);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <ProductionHeaderNavbar

                                pageTitle={t('inventorySetting')}
                                roles={t('Roles')}
                                allowZeroPercentage=''
                                currencySymbol=''
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={15} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <ProductionSettingTable />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create'
                                                ? <ProductionSettingForm saveId={'EntityFormSubmit'} />
                                                : <ProductionSettingUpdateForm saveId={'EntityFormSubmit'} />
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

export default ProductionSettingIndex;
