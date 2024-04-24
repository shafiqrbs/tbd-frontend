import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getShowEntityData } from "../../../../store/inventory/crudSlice.js";
import DomainFormView from "./TransactionModeFrom.jsx";
import CategoryUpdateForm from "../../inventory/category/CategoryUpdateForm";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import TransactionModeForm from "./TransactionModeFrom.jsx";
import TransactionModeUpdateFrom from "./TransactionModeUpdateFrom.jsx";
import CoreHeaderNavbar from "../../core/CoreHeaderNavbar";
import UserTable from "../../core/user/UserTable";
import UserForm from "../../core/user/UserForm";
import UserUpdateForm from "../../core/user/UserUpdateForm";
import TransactionModeTable from "./TransactionModeTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
function TransactionModeIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const configData = getConfigData()
    const progress = getLoadingProgress()

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageTransactionMode')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={15} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <TransactionModeTable />
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    {
                                        insertType === 'create' ? <TransactionModeForm /> : <TransactionModeUpdateFrom />
                                    }
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Box>
                </>
            }
        </>
    );
}

export default TransactionModeIndex;
