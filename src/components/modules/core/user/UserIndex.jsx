import React, { useEffect, useState } from "react";
import { Box, Grid, Progress, Title } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import UserTable from "./UserTable.jsx";
import UserForm from "./UserForm.jsx";
import UserUpdateForm from "./UserUpdateForm.jsx";
import { useTranslation } from 'react-i18next';
import {
    setInsertType,
    setSearchKeyword,
    setUserFilterData,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import CustomerTable from "../customer/CustomerTable";
import CustomerForm from "../customer/CustomerForm";
import CustomerUpdateForm from "../customer/CustomerUpdateForm";

function UserIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData)
    const progress = getLoadingProgress()
    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
        dispatch(setUserFilterData({
            ...userFilterData,
            ['name']: '',
            ['mobile']: '',
            ['email']: ''
        }))
    }, [])

    return (
        <>
            {progress !== 100 && <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&

                <Box>
                    <CoreHeaderNavbar
                        pageTitle={t('ManageUser')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <UserTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {
                                    insertType === 'create' ? <UserForm /> : <UserUpdateForm />
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            }
        </>
    );
}

export default UserIndex;
