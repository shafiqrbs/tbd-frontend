import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import genericCss from '../../../../assets/css/Generic.module.css';

import SampleTable from "./SampleTable";
import SampleInvoiceForm from "./SampleInvoiceForm";
import SalesUpdateForm from "./SalesUpdateForm.jsx";
import {
    setCustomerFilterData,
    setInsertType,
    setSearchKeyword,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import {getShowEntityData} from "../../../../store/inventory/crudSlice.js";
import SampleInvoiceItemForm from "./SampleInvoiceItemForm";

function PurchaseIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const insertType = useSelector((state) => state.crudSlice.insertType)
    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });
        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);

    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData)

    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, []);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    <Box pl={`md`} pr={8} pb={'8'} pt={'6'}  className={genericCss.titleBackground} >
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={6} pl={'md'} fz={'18'} c={'black'}>{t('SalesInformation')}</Title>
                            </Grid.Col>
                        </Grid>
                    </Box>
                    <Box pr={'12'} pl={'12'}>
                        {
                            insertType === 'create' && configData.business_model.slug==='general' &&
                            <SampleInvoiceItemForm
                                allowZeroPercentage = {configData.zero_stock}
                                currancySymbol = {configData.currency.symbol}
                            />
                        }
                    </Box>
                </Box>
            }
        </>
    );
}

export default PurchaseIndex;
