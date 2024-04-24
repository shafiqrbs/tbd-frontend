import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getShowEntityData } from "../../../../store/inventory/crudSlice.js";
import SampleInvoiceItemForm from "./SampleInvoiceItemForm";
import SampleHeaderNavbar from "./SampleHeaderNavbar";
function SampleInvoice() {
    const { t, i18n } = useTranslation();
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
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    <SampleHeaderNavbar
                        pageTitle={t('PageName')}
                        roles={t('Roles')}
                        allowZeroPercentage={configData.zero_stock}
                        currancySymbol={configData.currency.symbol}
                    />
                    <Box p={'8'}>
                        {
                            insertType === 'create' && configData.business_model.slug === 'general' &&
                            <SampleInvoiceItemForm
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData.currency.symbol}
                            />
                        }
                    </Box>

                </Box>
            }
        </>
    );
}

export default SampleInvoice;
