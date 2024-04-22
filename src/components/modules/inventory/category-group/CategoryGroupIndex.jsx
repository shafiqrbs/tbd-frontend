import React, {useEffect, useState} from "react";
import {
    Box, Button, Flex, Grid, Progress, rem, ScrollArea, SimpleGrid, Stack, Text, Title, Tooltip
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";

import CategoryGroupTable from "./CategoryGroupTable.jsx";
import CategoryGroupForm from "./CategoryGroupForm.jsx";
import CategoryGroupUpdateForm from "./CategoryGroupUpdateForm.jsx";
import {setSearchKeyword} from "../../../../store/core/crudSlice.js";
import {setInsertType} from "../../../../store/inventory/crudSlice.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar";
import TransactionModeTable from "../../accounting/transaction-mode/TransactionModeTable";
import {setFetching, setValidationData, storeEntityDataWithFile} from "../../../../store/accounting/crudSlice";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconDeviceFloppy} from "@tabler/icons-react";
import SelectForm from "../../../form-builders/SelectForm";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData";
import InputForm from "../../../form-builders/InputForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import Shortcut from "../../shortcut/Shortcut";
import CategoryForm from "../category/CategoryForm";
import CategoryUpdateForm from "../category/CategoryUpdateForm";

function CategoryGroupIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    { configData &&
                        <>
                        <InventoryHeaderNavbar
                            pageTitle = {t('ProductCategoryGroup')}
                            roles = {t('roles')}
                            allowZeroPercentage = {configData.zero_stock}
                            currencySymbol = {configData.currency.symbol}
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{base: 8}}>
                                <Grid.Col span={15} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <CategoryGroupTable/>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                       {
                                           insertType === 'create' ? <CategoryGroupForm/> : <CategoryGroupUpdateForm/>
                                       }
                                </Grid.Col>
                            </Grid>
                        </Box>
                        </>
                    }
                </Box>
            }
        </>
    );
}

export default CategoryGroupIndex;
