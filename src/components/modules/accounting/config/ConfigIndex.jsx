import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Progress,
    Title,
    Group,
    Burger,
    Menu,
    rem,
    ActionIcon,
    Card,
    Text,
    List,
    ThemeIcon,
    NavLink,
    SimpleGrid,
    useMantineTheme
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import { setInsertType } from "../../../../store/generic/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import HeadGroupForm from "./ConfigForm";
import HeadGroupTable from "./LedgerTable";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import ConfigForm from "./ConfigForm";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {IconCheck, IconCurrencyMonero, IconMoneybag} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {setFetching, storeEntityDataWithFile} from "../../../../store/accounting/crudSlice";
import {notifications} from "@mantine/notifications";
import axios from "axios";
import Navigation from "../common/Navigation.jsx";

function AccountingConfig() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const {configData} = getConfigData()
    const progress = getLoadingProgress()
    const theme = useMantineTheme();

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])
    function AccountingDataProcess(url){
        modals.openConfirmModal({
            title: (
                <Text size="md"> {t("FormConfirmationTitle")}</Text>
            ),
            children: (
                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_GATEWAY_URL}${url}`,{
                    headers : {
                        "Accept" : "application/json",
                        "Content-Type" : "application/json",
                        "X-Api-Key": import.meta.env.VITE_API_KEY,
                        "X-Api-User": JSON.parse(localStorage.getItem('user')).id
                    }
                }
                )
                if(response.data.message === "success"){
                    notifications.show({
                        color: 'teal',
                        title: t('CreateSuccessfully'),
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 700,
                        style: { backgroundColor: 'lightgray' },
                    });
                }
            },
        })
    }

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box>
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageCongifuration')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box p={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }}>
                                <Grid.Col span={1} >
                                    <Navigation module={"settings"}/>
                                </Grid.Col>
                                <Grid.Col span={14} >
                                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                        <Card shadow="md" radius="md" className={classes.card} padding="lg">
                                            <Grid>
                                                <Grid.Col span={12}>
                                                    <Text fz="md" fw={500} className={classes.cardTitle} >{t('AccountingandFinancial')}</Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Box fz="sm" c="dimmed" mt="sm">
                                                <List spacing="ms" size="sm" center>
                                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconCurrencyMonero /></ThemeIcon>}>
                                                        <NavLink pl={'md'} pt={2}  label={t('ResetHead')} component="button" onClick={
                                                            ()=>{AccountingDataProcess('accounting/account-head-reset')}
                                                        } />
                                                    </List.Item>
                                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconCurrencyMonero /></ThemeIcon>}>
                                                        <NavLink pl={'md'} pt={2}  label={t('RegenerateHead')} component="button" onClick={
                                                            ()=>{AccountingDataProcess('accounting/account-head-generate')}
                                                        } />
                                                    </List.Item>
                                                    <List.Item pl={'xs'} icon={<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline" ><IconCurrencyMonero /></ThemeIcon>}>
                                                        <NavLink pl={'md'} pt={2}  label={t('ResetVoucher')} component="button" onClick={
                                                            ()=>{AccountingDataProcess('accounting/account-voucher-reset')}
                                                        } />
                                                    </List.Item>
                                                </List>
                                            </Box>
                                        </Card>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    <ConfigForm />
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Box>
                </>
            }
        </>
    );
}

export default AccountingConfig;
