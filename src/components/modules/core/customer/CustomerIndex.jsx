import React from "react";
import {
    Box,
    Grid, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";

import CustomerForm from "./CustomerForm.jsx";
import CustomerTable from "./CustomerTable.jsx";
import CustomerUpdateForm from "./CustomerUpdateForm.jsx";

function CustomerIndex() {
    const {t, i18n} = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    return (
        <Box>
            <Box pl={`md`} pr={8} pb={'8'} pt={'6'} bg={'gray.1'}>
                <Grid>
                    <Grid.Col span={12}>
                        <Title order={6} pl={'md'} fz={'18'} c={'indigo.4'}>{t('CustomerInformation')}</Title>
                    </Grid.Col>
                </Grid>
            </Box>
            <Box pr={12} pl={'12'}>
                <Grid>
                    <Grid.Col span={8}>
                        <CustomerTable/>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        {
                            insertType === 'create' ? <CustomerForm/> : <CustomerUpdateForm/>
                        }
                    </Grid.Col>
                </Grid>
            </Box>
        </Box>

    );
}

export default CustomerIndex;
