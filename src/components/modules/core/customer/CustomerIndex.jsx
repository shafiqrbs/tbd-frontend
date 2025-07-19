import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Grid, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import CustomerForm from "./CustomerForm.jsx";
import CustomerTable from "./CustomerTable.jsx";
import CustomerUpdateForm from "./CustomerUpdateForm.jsx";
import {
    setCustomerFilterData,
    setEntityNewData,
    setInsertType,
    setSearchKeyword,
    editEntityData,
    setFormLoading
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import getLocationDropdownData from "../../../global-hook/dropdown/getLocationDropdownData.js";
import getExecutiveDropdownData from "../../../global-hook/dropdown/getExecutiveDropdownData.js";
import { setDropdownLoad } from "../../../../store/inventory/crudSlice.js";
import { coreSettingDropdown } from "../../../../store/core/utilitySlice.js";
import Navigation from "../common/Navigation.jsx";

function CustomerIndex() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    const insertType = useSelector((state) => state.crudSlice.insertType)
    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)

    const progress = getLoadingProgress()

    const locationDropdown = getLocationDropdownData();
    const executiveDropdown = getExecutiveDropdownData();

    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)

    const dropdownData = useSelector((state) => state.utilitySlice.customerGroupDropdownData);

    let groupDropdownData = dropdownData && dropdownData.length > 0 ?
        dropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'core/select/setting',
            param: { 'dropdown-type': 'customer-group' }
        }
        dispatch(coreSettingDropdown(value))
        dispatch(setDropdownLoad(false))
    }, []);


    useEffect(() => {
        if (id) {
            dispatch(setInsertType('update'));
            dispatch(editEntityData(`core/customer/${id}`));
            dispatch(setFormLoading(true));
        } else if (!id) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            dispatch(setEntityNewData([]));
            dispatch(setCustomerFilterData({
                ...customerFilterData,
                ['name']: '',
                ['mobile']: ''
            }));
            navigate('/core/customer', { replace: true });
        }
    }, [id, dispatch, navigate]);



    return (
        <>
            {progress !== 100 && <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <CoreHeaderNavbar
                        pageTitle={t('ManageCustomer')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={1} >
                                <Navigation module={"customer"} />
                            </Grid.Col>
                            <Grid.Col span={14} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <CustomerTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {
                                    insertType === 'create'
                                        ? <CustomerForm locationDropdown={locationDropdown} customerGroupDropdownData={groupDropdownData} executiveDropdown={executiveDropdown} />
                                        : <CustomerUpdateForm locationDropdown={locationDropdown} customerGroupDropdownData={groupDropdownData} executiveDropdown={executiveDropdown} />
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default CustomerIndex;