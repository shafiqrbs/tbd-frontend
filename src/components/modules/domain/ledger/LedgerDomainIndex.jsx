import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setFormLoading, setSearchKeyword } from "../../../../store/core/crudSlice";
import { setInsertType } from "../../../../store/generic/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";

import { useNavigate, useParams } from "react-router-dom";
import { editEntityData, setEntityNewData } from "../../../../store/accounting/crudSlice.js";

import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData.js";

import DomainHeaderNavbar from "../DomainHeaderNavbar";
import LedgerDomainTable from "./LedgerDomainTable";
import LedgerDomainForm from "./LedgerDomainForm";
import LedgerDomainUpdateFrom from "./LedgerDomainUpdateFrom";
import _Navigation from "../common/_Navigation";


function LedgerDomainIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const {configData} = getConfigData()
    const progress = getLoadingProgress()

    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        id ? (
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`accounting/account-head/${id}`)),
            dispatch(setFormLoading(true))
        ) : (
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData({
                ['parent_name']: '',
                ['name']: '',
                ['code']: ''
            })),
            navigate('/accounting/ledger')
        );
    }, [id, dispatch, navigate])

    const accountDropdown = getSettingMotherAccountDropdownData()




    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <DomainHeaderNavbar
                            pageTitle={t('ManageLedger')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={1} >
                                    <_Navigation module={"ledger"} />
                                </Grid.Col>
                                <Grid.Col span={14} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <LedgerDomainTable />
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    {
                                        insertType === 'create' ? <LedgerDomainForm accountDropdown={accountDropdown} /> : <LedgerDomainUpdateFrom accountDropdown={accountDropdown} />
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

export default LedgerDomainIndex;
