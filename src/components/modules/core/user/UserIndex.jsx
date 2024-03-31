import React, {useEffect, useState} from "react";
import {Box, Grid, Progress, Title} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import UserTable from "./UserTable.jsx";
import UserForm from "./UserForm.jsx";
import UserUpdateForm from "./UserUpdateForm.jsx";
import {useTranslation} from 'react-i18next';
import {
    setInsertType,
    setSearchKeyword,
    setUserFilterData,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";

function UserIndex() {
    const {t, i18n} = useTranslation();
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
            ['mobile']:'',
            ['email']:''
        }))
    }, [])

    return (
        <>
            {progress !== 100 && <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&

                <Box>
                    <Box pl={`md`} pr={8} pb={'8'} pt={'6'} bg={'gray.1'}>
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={6} pl={'md'} fz={'18'} c={'indigo.4'}>{t('UserInformation')}</Title>
                            </Grid.Col>
                        </Grid>
                    </Box>
                    <Box pr={'12'} pl={'12'}>
                        <Grid>
                            <Grid.Col span={8}>
                                <UserTable/>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                {
                                    insertType === 'create' ? <UserForm/> : <UserUpdateForm/>
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
