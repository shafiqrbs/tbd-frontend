import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getShowEntityData } from "../../../../store/inventory/crudSlice.js";
import DomainFormView from "./VoucherFrom.jsx";
import CategoryUpdateForm from "../../inventory/category/CategoryUpdateForm";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import VoucherForm from "./VoucherFrom.jsx";
import VoucherUpdateFrom from "./VoucherUpdateFrom.jsx";
import CoreHeaderNavbar from "../../core/CoreHeaderNavbar";
import UserTable from "../../core/user/UserTable";
import UserForm from "../../core/user/UserForm";
import UserUpdateForm from "../../core/user/UserUpdateForm";
import VoucherTable from "./VoucherTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
function VoucherIndex() {
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
                            pageTitle={t('ManageVoucher')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <VoucherForm />
                        </Box>
                    </Box>
                </>
            }
        </>
    );
}

export default VoucherIndex;
