import React, {useEffect} from "react";
import {
    Box,
    Grid, Progress,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import _ConfigurationForm from "./_ConfigurationForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";
import {getShowEntityData} from "../../../../store/production/crudSlice.js";
import {useDispatch} from "react-redux";

function ConfigurationIndex() {
    const { t, i18n } = useTranslation();
    const progress = getLoadingProgress()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getShowEntityData('production/config'))
    }, []);

    return (

        <>
            {progress !== 100 && <Progress color="red" size={"sm"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <ProductionHeaderNavbar
                        pageTitle={t('ConfigurationInformationFormDetails')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24}>
                                <_ConfigurationForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default ConfigurationIndex;
