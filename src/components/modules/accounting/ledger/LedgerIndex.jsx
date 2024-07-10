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
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import LedgerForm from "./LedgerForm";
import LedgerTable from "./LedgerTable";
import { useNavigate, useParams } from "react-router-dom";
import { editEntityData, setEntityNewData } from "../../../../store/accounting/crudSlice.js";
import LedgerUpdateFrom from "./LedgerUpdateFrom";


function LedgerIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const configData = getConfigData()
    const progress = getLoadingProgress()

    const { ledgerId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        ledgerId ? (
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`core/ledger/${ledgerId}`)),
            dispatch(setFormLoading(true))
        ) : (
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData({
                ['parent_name']: '',
                ['name']: '',
                ['code']: ''
            })),
            navigate('/accounting/ledger', { replace: true })
        );
    }, [ledgerId, dispatch, navigate])




    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageLedger')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={15} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <LedgerTable />
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    {
                                        insertType === 'create' ? <LedgerForm /> : <LedgerUpdateFrom />
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

export default LedgerIndex;
