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
import CoreHeaderNavbar from "../CoreHeaderNavbar.jsx";
import MasterDataEntryTable from "./MasterDataEntryTable.jsx";
import MasterDataEntryForm from "./MasterDataEntryForm.jsx";
import MasterDataEntryUpdateForm from "./MasterDataEntryUpdateForm.jsx";

function MasterDataEntryIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const adjustment = 0;

    const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()
    const navigate = useNavigate()

    const { masterDataFormId } = useParams();


    useEffect(() => {
        if (masterDataFormId) {
            dispatch(setInsertType('update'));
            dispatch(editEntityData(`/core/master-data/${masterDataFormId}`));
            dispatch(setFormLoading(true));
        } else if (!masterDataFormId) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            dispatch(setEntityNewData([]));
            // dispatch(setCustomerFilterData({
            //     ...masterDataFilterData,
            //     ['name']: '',
            //     ['mobile']: ''
            // }));
            navigate('/core/master-data', { replace: true });
        }
    }, [masterDataFormId, dispatch, navigate]);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <CoreHeaderNavbar
                                pageTitle={t('ProductCategory')}
                                roles={t('Roles')}
                                allowZeroPercentage=''
                                currencySymbol=''
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={15} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <MasterDataEntryTable />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create'
                                                ? <MasterDataEntryForm adjustment={adjustment} />
                                                : <MasterDataEntryUpdateForm />
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

export default MasterDataEntryIndex;
