import React, { useEffect, useState } from "react";
import { Box, Grid, Progress, Title } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import UserTable from "./UserTable.jsx";
import UserForm from "./UserForm.jsx";
import UserUpdateForm from "./UserUpdateForm.jsx";
import { useTranslation } from 'react-i18next';
import {
    editEntityData,
    setEntityNewData,
    setFormLoading,
    setInsertType,
    setSearchKeyword,
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";


function UserIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData)

    const { userId } = useParams();
    const navigate = useNavigate();
    const progress = getLoadingProgress()

    useEffect(() => {
        userId ? (
            (
                dispatch(setInsertType('update')),
                dispatch(editEntityData(`core/user/${userId}`)),
                dispatch(setFormLoading(true)))
        ) : (
            (
                dispatch(setInsertType('create')),
                dispatch(setSearchKeyword('')),
                dispatch(setEntityNewData({
                    ...userFilterData,
                    name: '',
                    mobile: '',
                    email: ''
                })),
                navigate('/core/user', { replace: true }))
        );
    }, [userId, dispatch, navigate]);


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
                                    insertType === 'create'
                                        ? <UserForm />
                                        : <UserUpdateForm />
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
