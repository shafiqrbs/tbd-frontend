import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { editEntityData, setSearchKeyword } from "../../../../store/core/crudSlice";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import DomainHeaderNavbar from "../DomainHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { setFormLoading } from "../../../../store/generic/crudSlice.js";
import SitemapTable from "./SitemapTable.jsx";
import SitemapForm from "./SitemapForm.jsx";
import SitemapUpdateForm from "./SitemapUpdateForm.jsx";
import _Navigation from "../common/_Navigation";
function SitemapIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()
    const {configData} = getConfigData()

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(setInsertType('update'));
            // dispatch(editEntityData(`domain/sitemap/${id}`));
            dispatch(setFormLoading(true));
        } else if (!id) {
            dispatch(setInsertType('create'));
            dispatch(setSearchKeyword(''));
            navigate('/domain/sitemap');
        }
    }, [id, dispatch, navigate]);


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    <DomainHeaderNavbar
                        pageTitle={t('ManageSitemap')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={1}>
                                <_Navigation module={""} />
                            </Grid.Col>
                            <Grid.Col span={14} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <SitemapTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {
                                    insertType === 'create'
                                        ? <SitemapForm />
                                        : <SitemapUpdateForm />
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            }
        </>
    );
}

export default SitemapIndex;
