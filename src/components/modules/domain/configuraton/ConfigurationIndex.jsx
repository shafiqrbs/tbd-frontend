import React, { useEffect, useState } from "react";
import {
    Box,
    Grid, Progress,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import ConfigurationForm from "./ConfigurationForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import DomainHeaderNavbar from "../DomainHeaderNavbar.jsx";
import { useParams } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

function ConfigurationIndex() {
    const { t, i18n } = useTranslation();

    const {id } = useParams();

    const progress = getLoadingProgress()
    const {configData,fetchData} = getConfigData()
    localStorage.setItem('config-data', JSON.stringify(configData));

    return (

        <>
            {progress !== 100 && <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <DomainHeaderNavbar
                        pageTitle={t('ConfigurationInformationFormDetails')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24}>
                                <ConfigurationForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default ConfigurationIndex;
