import React, { useEffect } from "react";
import {
    Box, Grid, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { editEntityData, setSearchKeyword } from "../../../../store/core/crudSlice";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import DomainTable from "./DomainTable";
import DomainHeaderNavbar from "../DomainHeaderNavbar";
import DomainUpdateForm from "./DomainUpdateFrom";
import { useNavigate, useParams } from "react-router-dom";
import { setFormLoading } from "../../../../store/generic/crudSlice.js";
import DomainForm from './DomainFrom.jsx'
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import _Shortcut from "../common/_Shortcut";
import _Navigation from "../common/_Navigation";

function DomainIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const {configData,fetchData} = useConfigData()

    const { id } = useParams();
    const navigate = useNavigate();

    localStorage.setItem('config-data', JSON.stringify(configData));

    useEffect(() => {
        if (id) {
            dispatch(setInsertType('update'));
            dispatch(editEntityData(`domain/global/${id}`));
            dispatch(setFormLoading(true));
        } else if (!id) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            navigate('/domain');
        }
    }, [id, dispatch, navigate]);

    return (
        <>
            {progress !== 100 &&
                <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    <DomainHeaderNavbar
                        pageTitle={t('ManageDomain')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={1}>
                                <_Navigation id={id} module={"b2b_dashboard"}/>
                            </Grid.Col>
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <DomainTable configData={configData} />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                {
                                    insertType === 'create'
                                        ? <DomainForm />
                                        : <DomainUpdateForm />
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            }
        </>
    );
}

export default DomainIndex;
