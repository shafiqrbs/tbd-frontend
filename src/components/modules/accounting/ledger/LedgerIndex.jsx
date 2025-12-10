import React, {useEffect} from "react";
import {Box, Grid, Progress} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {setFormLoading, setSearchKeyword} from "../../../../store/core/crudSlice";
import {setInsertType} from "../../../../store/generic/crudSlice";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import LedgerForm from "./LedgerForm";
import LedgerTable from "./LedgerTable";
import {useNavigate, useParams} from "react-router-dom";
import {editEntityData, setEntityNewData} from "../../../../store/accounting/crudSlice.js";
import LedgerUpdateFrom from "./LedgerUpdateFrom";
import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData.js";
import Navigation from "../common/Navigation.jsx";

function LedgerIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const progress = getLoadingProgress()

    const {id} = useParams();
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
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress}
                          transitionDuration={200}/>}
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
                            <Grid columns={24} gutter={{base: 8}}>
                                <Grid.Col span={1}>
                                    <Navigation module={"ledger"}/>
                                </Grid.Col>
                                <Grid.Col span={14}>
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                        <LedgerTable/>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    {
                                        insertType === 'create' ? <LedgerForm accountDropdown={accountDropdown}/> :
                                            <LedgerUpdateFrom accountDropdown={accountDropdown}/>
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
