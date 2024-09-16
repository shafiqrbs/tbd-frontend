import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
    Box,
    Grid, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import {
    setCustomerFilterData,
    setEntityNewData,
    setInsertType,
    setSearchKeyword,
    editEntityData,
    setFormLoading
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import HeaderNavbar from "../HeaderNavbar.jsx";
import PosTable from "./PosTable.jsx";
import classes from './PosTable.module.css'
import PosSales from "./PosSales.jsx";

function PosIndex() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130;
    const progress = getLoadingProgress();

    const [tables, setTables] = useState([
        {'id' : 1, 'time' : '08:01:49 PM' },
        {'id' : 2, 'time' : '08:01:49 PM' },
        {'id' : 3, 'time' : '08:01:49 PM' },
        {'id' : 4, 'time' : '08:01:49 PM' },
        {'id' : 5, 'time' : '08:01:49 PM' },
        {'id' : 6, 'time' : '08:01:49 PM' },
        {'id' : 7, 'time' : '08:01:49 PM' },
        {'id' : 8, 'time' : '08:01:49 PM' },
        {'id' : 9, 'time' : '08:01:49 PM' },
        {'id' : 10, 'time' : '08:01:49 PM' },
        {'id' : 11, 'time' : '08:01:49 PM' },
        {'id' : 12, 'time' : '08:01:49 PM' },
        {'id' : 13, 'time' : '08:01:49 PM' },
        {'id' : 14, 'time' : '08:01:49 PM' },
        {'id' : 15, 'time' : '08:01:49 PM' },
        {'id' : 16, 'time' : '08:01:49 PM' },
        {'id' : 17, 'time' : '08:01:49 PM' },
        {'id' : 18, 'time' : '08:01:49 PM' },
        
    ]);

    useEffect(() => {
        if (id) {
            dispatch(setInsertType('update'));
        } else if (!id) {
            dispatch(setInsertType('create'))
            
            ;
            navigate('/pos/pos-index', { replace: true });
        }
    }, [id, dispatch, navigate]);



    return (
        <>
            {progress !== 100 && <Progress color="red" size={"sm"} striped animated value={progress} />}
            {progress === 100 &&
                <>
        <Box h={height + 4} mt={6} ml={6} mr={6} style={{  borderRadius: '4px' }} c={'#EAECED'} className={classes['body']}>

                    <HeaderNavbar
                        pageTitle={t('ManageCustomer')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                        tables={tables}
                        setTables={setTables}
                    />
                    <Box pl={'4'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={16} >
                                <PosTable />
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Box bg="white" w={'100%'} h={height} style={{ borderRadius: 8 }}>
                                    <PosSales />
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box></Box>
                </>
            }
        </>
    );
}

export default PosIndex;