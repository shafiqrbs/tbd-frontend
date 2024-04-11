import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title,Group,Burger,Menu,rem,ActionIcon
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {getShowEntityData} from "../../../../store/inventory/crudSlice.js";
import DomainHeaderNavbar from "./DomainHeaderNavbar";
import DomainFormView from "./DomainFrom";
import CategoryUpdateForm from "../../inventory/category/CategoryUpdateForm";
import {setInsertType} from "../../../../store/inventory/crudSlice";
import {setSearchKeyword} from "../../../../store/core/crudSlice";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import CoreHeaderNavbar from "../../core/CoreHeaderNavbar";
import UserTable from "../../core/user/UserTable";
import UserForm from "../../core/user/UserForm";
import UserUpdateForm from "../../core/user/UserUpdateForm";
import DomainTable from "./DomainTable";
function DomainIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

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
                    <CoreHeaderNavbar
                    pageTitle = {t('ManageCustomer')}
                    roles = {t('roles')}
                    allowZeroPercentage = ''
                    currencySymbol = ''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={15} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <DomainTable/>
                            </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                            {
                                insertType === 'create' ?  <DomainFormView/> : <CategoryUpdateForm/>
                            }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            }
        </>
    );
}

export default DomainIndex;
