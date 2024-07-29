import React from "react";
import {
    Box,
    Grid, Progress,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar.jsx";
import ProductManagementForm from "./ProductManagementForm.jsx";

function ProductManagementIndex() {
    const { t, i18n } = useTranslation();

    const progress = getLoadingProgress()

    return (

        <>
            {progress !== 100 && <Progress color="red" size={"xs"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <InventoryHeaderNavbar
                        pageTitle={t('ProductManagement')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24}>
                                <ProductManagementForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default ProductManagementIndex;
