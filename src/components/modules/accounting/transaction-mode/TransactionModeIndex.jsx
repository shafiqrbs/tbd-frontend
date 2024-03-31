import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title,Group,Burger,Menu,rem,ActionIcon
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {getShowEntityData} from "../../../../store/inventory/crudSlice.js";
import TransactionModeHeaderNavbar from "./TransactionModeHeaderNavbar.jsx";
import DomainFormView from "./TransactionModeFrom.jsx";
import CategoryUpdateForm from "../../inventory/category/CategoryUpdateForm";
import {setInsertType} from "../../../../store/inventory/crudSlice";
import {setSearchKeyword} from "../../../../store/core/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import TransactionModeForm from "./TransactionModeFrom.jsx";
function TransactionModeIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const configData = getConfigData()
    const progress = getLoadingProgress()

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
                    <TransactionModeHeaderNavbar
                        pageTitle = {t('TransactionMode')}
                        roles = {t('roles')}
                    />
                    <Box p={'8'}>
                        {
                            insertType === 'create' ?  <TransactionModeForm/> : <CategoryUpdateForm/>
                        }
                    </Box>
                </Box>
            }
        </>
    );
}

export default TransactionModeIndex;
