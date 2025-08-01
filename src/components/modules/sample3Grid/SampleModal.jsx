import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import SampleModalTable from "./SampleModalTable.jsx";
import ModalHeaderNavbar from "./ModalHeaderNavbar.jsx";

function SampleModal() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });
        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {progress !== 100 &&
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    <ModalHeaderNavbar
                        pageTitle={t('Domain Table Sample')}
                        roles={t('roles')}
                    // allowZeroPercentage={.zeconfigDataro_stock}
                    // currancySymbol={configData.currency && configData.currency.symbol}
                    />
                    <Box p={'8'}>
                        {
                            // insertType === 'create' && configData.business_model.slug === 'general' &&
                            <SampleModalTable
                            // allowZeroPercentage={configData.zero_stock}
                            // currancySymbol={configData.currency && configData.currency.symbol}
                            />
                        }
                    </Box>
                </Box>
            }
        </>
    );
}

export default SampleModal;
