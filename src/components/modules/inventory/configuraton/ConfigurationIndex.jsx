import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";


import {
    setInsertType,
    setSearchKeyword,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";

import ConfigurationForm from "./ConfigurationForm";
import {setValidationMessage} from "../../../../store/inventory/crudSlice.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

function ConfigurationIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)

    const progress = getLoadingProgress()
    const configData = getConfigData()

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
        dispatch(setValidationMessage(''))
        dispatch(setVendorFilterData({
            ...vendorFilterData,
            ['name']: '',
            ['mobile']:'',
            ['company_name']:''
        }))
    }, [])

    return (
        <>
            {progress !== 100 &&
            <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
            <Box>
                <Box pl={`xs`} pr={8} pb={'8'} pt={'6'} bg={'gray.1'}>
                    <Grid>
                        <Grid.Col span={12}>
                            <Title order={6} pl={'md'} fz={'18'} c={'indigo.4'}>{t('ConfigurationInformationFormDetails')}</Title>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box pr={'12'} pl={'12'}>
                   <ConfigurationForm />
                </Box>
            </Box>
            }
        </>
    );
}

export default ConfigurationIndex;
