import React, {useEffect} from "react";
import {
    Box, Grid, Progress
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";

import {
    setEntityNewData,
    setInsertType,
    setSearchKeyword,
    editEntityData,
    setFormLoading
} from "../../../../store/production/crudSlice.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";
import {useNavigate, useParams} from "react-router-dom";
import AccountingSettingTable from "./AccountingSettingTable.jsx";
import AccountingSettingForm from "./AccountingSettingForm.jsx";
import AccountingSettingUpdateForm from "./AccountingSettingUpdateForm.jsx";
import getSettingTypeDropdownData from "../../../global-hook/dropdown/getAccointingSettingTypeDropdownData.js";
import AccountingHeaderNavbar from "../common/AccountingHeaderNavbar";

function AccountingSettingIndex() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const progress = getLoadingProgress()
    const navigate = useNavigate()
    const {id} = useParams();

    const insertType = useSelector((state) => state.accounting.insertType)
    const settingTypeDropdown = getSettingTypeDropdownData()
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []

    useEffect(() => {
        id ? (
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`accounting/setting/${id}`)),
            dispatch(setFormLoading(true))
        ):(
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData([])),
            navigate('/accounting/setting', {replace: true})
        );
    }, [id, dispatch, navigate])


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <AccountingHeaderNavbar
                                pageTitle={t('accountingSetting')}
                                roles={t('Roles')}
                                allowZeroPercentage=''
                                currencySymbol=''
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{base: 8}}>
                                    <Grid.Col span={15}>
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                            <AccountingSettingTable/>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create'
                                                ? <AccountingSettingForm settingTypeDropdown={settingTypeDropdown}
                                                                         formSubmitId={'EntityFormSubmit'}/>
                                                : <AccountingSettingUpdateForm settingTypeDropdown={settingTypeDropdown}
                                                                               formSubmitId={'EntityFormSubmit'}/>
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

export default AccountingSettingIndex;
