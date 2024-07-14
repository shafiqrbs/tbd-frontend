import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import DomainFormView from "./DomainFrom";
import CategoryUpdateForm from "../../inventory/category/CategoryUpdateForm";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { editEntityData, setSearchKeyword } from "../../../../store/core/crudSlice";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import DomainTable from "./DomainTable";
import DomainHeaderNavbar from "../DomainHeaderNavbar";
import DomainUpdateFormView from "./DomainUpdateFrom";
import { useNavigate, useParams } from "react-router-dom";
import { setFormLoading } from "../../../../store/generic/crudSlice.js";
function DomainIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const configData = getConfigData()

    const { domainId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (domainId) {
            dispatch(setInsertType('update'));
            // dispatch(editEntityData(`domain/domain-index/${domainId}`));
            dispatch(setFormLoading(true));
        } else if (!domainId) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            navigate('/domain/domain-index', { replace: true });
        }
    }, [domainId, dispatch, navigate]);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
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
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <DomainTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {
                                    insertType === 'create'
                                        ? <DomainFormView />
                                        : <DomainUpdateFormView />
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
