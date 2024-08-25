import React, {useEffect} from "react";
import {
    Box,
    Grid,
    Progress,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import _RecipeTable from "./_RecipeTable.jsx";
import _RecipeForm from "./_RecipeForm.jsx";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import ProductionHeaderNavbar from "../../common/ProductionHeaderNavbar.jsx";
import {storeAndUpdateProductionItem} from "../../../../../store/production/crudSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

function RecipeIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const {id} = useParams();
    const progress = getLoadingProgress()

    const itemProcessUpdate = useSelector((state) => state.productionCrudSlice.itemProcessUpdate)

    useEffect(() => {
        const value = {
            url: 'production/recipe-items',
            data: {
                pro_item_id : id
            }
        }
        dispatch(storeAndUpdateProductionItem(value))
    }, [itemProcessUpdate]);

    return (
        <>

            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <ProductionHeaderNavbar
                        pageTitle={t('ProductionReceipe')}
                        roles={t('Roles')}
                        allowZeroPercentage={''}
                        currencySymbol={''}
                    />
                    <Box p={'8'} >
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                    <_RecipeTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9} >
                                <_RecipeForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default RecipeIndex;
