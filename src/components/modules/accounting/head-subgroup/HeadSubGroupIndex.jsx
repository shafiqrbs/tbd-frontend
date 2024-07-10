import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import { setInsertType } from "../../../../store/generic/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import HeadGroupTable from "./HeadSubGroupTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import HeadSubGroupForm from "./HeadSubGroupForm";
import HeadSubGroupUpdateFrom from "./HeadSubGroupUpdateFrom";
import { useNavigate, useParams } from "react-router-dom";
import { editEntityData, setEntityNewData, setFormLoading } from "../../../../store/accounting/crudSlice.js";
function HeadGroupIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const configData = getConfigData()
    const progress = getLoadingProgress()
    const { headSubGroupId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        headSubGroupId ? (
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`accounting/head-subgroup/${headSubGroupId}`)),
            dispatch(setFormLoading(true))
        ) : (
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData({
                ['parent_name']: '',
                ['name']: '',
                ['code']: ''
            })),
            navigate('/accounting/head-subgroup', { replace: true })
        );
    }, [headSubGroupId, dispatch, navigate])

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageAccountSubHeadGroup')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={15} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <HeadGroupTable />
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    {
                                        insertType === 'create' ? <HeadSubGroupForm /> : <HeadSubGroupUpdateFrom />
                                    }
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Box>
                </>
            }
        </>
    );
}

export default HeadGroupIndex;
