import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import HeadGroupForm from "./HeadGroupForm";
import HeadGroupUpdateFrom from "./HeadGroupUpdateFrom";
import HeadGroupTable from "./HeadGroupTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { editEntityData, setEntityNewData, setFormLoading, setInsertType } from "../../../../store/accounting/crudSlice.js";
function HeadGroupIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const configData = getConfigData()
    const progress = getLoadingProgress()

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        id ? (
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`accounting/account-head/${id}`)),
            dispatch(setFormLoading(true))
        ) : (
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData([])),
            navigate('/accounting/head-group')
        );
    }, [id, dispatch, navigate])

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageAccountHeadGroup')}
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
                                        insertType === 'create' ? <HeadGroupForm /> : <HeadGroupUpdateFrom />
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
