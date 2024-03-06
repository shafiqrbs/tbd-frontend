import React from "react";
import {Box, Grid, Title} from "@mantine/core";
import {useSelector} from "react-redux";
import UserTable from "./UserTable.jsx";
import UserForm from "./UserForm.jsx";
import UserUpdateForm from "./UserUpdateForm.jsx";
import {useTranslation} from 'react-i18next';

function UserIndex() {
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const {t, i18n} = useTranslation();
    return (
        <Box>
            <Box pl={`md`} pr={8} pb={'8'} pt={'6'} bg={'gray.1'}>
                <Grid>
                    <Grid.Col span={12} >
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
                        insertType === 'create'?<UserForm/>:<UserUpdateForm />
                    }
                </Grid.Col>
            </Grid>
            </Box>
        </Box>
    );
}

export default UserIndex;
