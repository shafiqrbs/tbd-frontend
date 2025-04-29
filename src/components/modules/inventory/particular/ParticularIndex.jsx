import React, {useEffect, useState} from "react";
import {
    Box, Grid, Progress
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import {
    setEntityNewData,
    setSearchKeyword,
    setFormLoading
} from "../../../../store/inventory/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import { useNavigate, useParams } from "react-router-dom";
import _ParticularTable from "./_ParticularTable.jsx";
import _ParticularForm from "./_ParticularForm.jsx";
import _ParticularUpdateForm from "./_ParticularUpdateForm.jsx";
import getParticularTypeDropdownData from "../../../global-hook/dropdown/inventroy/getParticularTypeDropdownData.js";
import InventoryHeaderNavbar from "../../domain/configuraton/InventoryHeaderNavbar";
import {
    editEntityData,
    setInsertType,
} from "../../../../store/production/crudSlice.js";
import NavigationGeneral from "../common/NavigationGeneral.jsx";


function ParticularIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const progress = getLoadingProgress()
    const navigate = useNavigate()
    const { id } = useParams();

    const insertType = useSelector((state) => state.productionCrudSlice.insertType)
    const settingTypeDropdown = getParticularTypeDropdownData()
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const [particularFetching,setParticularFetching] = useState(true)

    useEffect(() => {
        if (id) {
            dispatch(setInsertType('update'));
            dispatch(editEntityData(`inventory/particular/${id}`));
            dispatch(setFormLoading(true));
        } else if (!id) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            dispatch(setEntityNewData([]));
            navigate('/inventory/particular', { replace: true });
        }
    }, [id, dispatch, navigate]);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t('InventoryParticular')}
                                roles={t('Roles')}
                                allowZeroPercentage=''
                                currencySymbol=''
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={1}>
                                        <NavigationGeneral module={'particular'} />
                                    </Grid.Col>
                                    <Grid.Col span={14}>
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                            <_ParticularTable particularFetching={particularFetching} setParticularFetching={setParticularFetching} />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create'
                                                ? <_ParticularForm
                                                    settingTypeDropdown={settingTypeDropdown}
                                                    formSubmitId={'EntityFormSubmit'}
                                                    setParticularFetching={setParticularFetching}
                                                />
                                                :
                                                <_ParticularUpdateForm
                                                    settingTypeDropdown={settingTypeDropdown}
                                                    formSubmitId={'EntityFormSubmit'}
                                                    setParticularFetching={setParticularFetching} />
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

export default ParticularIndex;
