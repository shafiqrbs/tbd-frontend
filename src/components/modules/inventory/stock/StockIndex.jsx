import React, { useEffect, useState } from "react";
import {
    Box, Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar";
import StockTable from "./StockTable.jsx";

function StockIndex() {
    const { t, i18n } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />
            }
            {progress === 100 &&
                <>
                    {configData &&
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t('ManageProduct')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={24}>
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                            <StockTable />
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </>
                    }
                </>
            }
        </>
    );
}

export default StockIndex;
