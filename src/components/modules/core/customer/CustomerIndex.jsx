import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";

import CustomerForm from "./CustomerForm.jsx";
import CustomerTable from "./CustomerTable.jsx";
import CustomerUpdateForm from "./CustomerUpdateForm.jsx";

function CustomerIndex() {
    const {t, i18n} = useTranslation();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const [value, setValue] = useState(1);
    // const [load, setLOad] = useState(false);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });

        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {progress !==100 && <Progress color="red" size={"xs"}  striped animated value={progress} transitionDuration={200} />}

            {progress === 100 &&
            <Box transitionDuration={200}>
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
            }
        </>

    );
}

export default CustomerIndex;
