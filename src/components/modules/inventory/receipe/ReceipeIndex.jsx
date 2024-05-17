import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Progress,
    Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import ReceipeTable from "./ReceipeTable.jsx";
import ReceipeForm from "./ReceipeForm.jsx";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar";

function ReceipeIndex() {
    const { t, i18n } = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()


    return (
        <>

            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <InventoryHeaderNavbar
                        pageTitle={t('Production')}
                        roles={t('Roles')}
                        allowZeroPercentage={''}
                        currencySymbol={''}
                    />
                    <Box p={'8'} >
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                    <ReceipeTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9} >
                                <ReceipeForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default ReceipeIndex;
