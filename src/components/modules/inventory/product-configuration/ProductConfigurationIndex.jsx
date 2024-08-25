import React from "react";
import {
    Box,
    Grid, Progress,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar.jsx";
import ProductConfigurationForm from "./ProductConfigurationForm.jsx";

function ProductConfigurationIndex() {
    const { t, i18n } = useTranslation();

    const progress = getLoadingProgress()

    return (

        <>
            {progress !== 100 && <Progress color="red" size={"sm"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <InventoryHeaderNavbar
                        pageTitle={t('ProductConfiguration')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24}>
                                <ProductConfigurationForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default ProductConfigurationIndex;
