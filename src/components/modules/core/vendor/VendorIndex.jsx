import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";

import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";
import VendorUpdateForm from "./VendorUpdateForm.jsx";
import {
    setCustomerFilterData,
    setInsertType,
    setSearchKeyword,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";

function VendorIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const insertType = useSelector((state) => state.crudSlice.insertType)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)

    const progress = getLoadingProgress()

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
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
                    <Box pl={`md`} pr={8} pb={'8'} pt={'6'} bg={'gray.1'}>
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={6} pl={'md'} fz={'18'} c={'indigo.4'}>{t('VendorInformation')}</Title>
                            </Grid.Col>
                        </Grid>
                    </Box>
                    <Box pr={'12'} pl={'12'}>
                        <Grid>
                            <Grid.Col span={8}>
                                <VendorTable/>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                {
                                    insertType === 'create' ? <VendorForm/> : <VendorUpdateForm/>
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            }
        </>
    );
}

export default VendorIndex;
