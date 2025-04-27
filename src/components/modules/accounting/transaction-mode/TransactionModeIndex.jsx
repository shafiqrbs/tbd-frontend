import React, { useEffect } from "react";
import {
    Box,
    Grid, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { editEntityData, setSearchKeyword } from "../../../../store/core/crudSlice";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import TransactionModeForm from "./TransactionModeFrom.jsx";
import TransactionModeUpdateFrom from "./TransactionModeUpdateFrom.jsx";
import TransactionModeTable from "./TransactionModeTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { setFormLoading } from "../../../../store/accounting/crudSlice.js";
import Navigation from "../common/Navigation.jsx";

function TransactionModeIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()

    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (id) {
            dispatch(setInsertType('update'));
            dispatch(setFormLoading(true));
            dispatch(editEntityData('accounting/transaction-mode/' + id))
        } else if (!id) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            navigate('/accounting/transaction-mode', { replace: true });
        }
    }, [id, dispatch, navigate]);

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
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
                                <Navigation module={'transaction-mode'} /> 
                                <Grid.Col span={14} >
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
