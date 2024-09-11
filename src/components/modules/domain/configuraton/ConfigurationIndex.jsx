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

function ConfigurationIndex() {
    const { t, i18n } = useTranslation();

    const {id } = useParams();
    console.log(id);

    const progress = getLoadingProgress()

    return (

        <>
            {progress !== 100 && <Progress color="red" size={"sm"} striped animated value={progress} />}
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
