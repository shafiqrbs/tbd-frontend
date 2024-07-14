import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import TransactionModeForm from "./TransactionModeFrom.jsx";
import TransactionModeUpdateFrom from "./TransactionModeUpdateFrom.jsx";
import TransactionModeTable from "./TransactionModeTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { setFormLoading } from "../../../../store/accounting/crudSlice.js";
function TransactionModeIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const configData = getConfigData()
    const progress = getLoadingProgress()

    const { transactionModeId } = useParams();
    const navigate = useNavigate();



    useEffect(() => {
        if (transactionModeId) {
            dispatch(setInsertType('update'));
            // dispatch(editEntityData(`accounting/transaction-mode/${transactionModeId}`));
            dispatch(setFormLoading(true));
        } else if (!transactionModeId) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            navigate('/accounting/transaction-mode', { replace: true });
        }
    }, [transactionModeId, dispatch, navigate]);

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageTransactionMode')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={15} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <TransactionModeTable />
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    {
                                        insertType === 'create'
                                            ? <TransactionModeForm />
                                            : <TransactionModeUpdateFrom />
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

export default TransactionModeIndex;
