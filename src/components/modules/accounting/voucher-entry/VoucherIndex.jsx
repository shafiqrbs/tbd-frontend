import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon,
    Tabs,
    Divider
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setInsertType } from "../../../../store/inventory/crudSlice";
import { setSearchKeyword } from "../../../../store/core/crudSlice";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import VoucherFormIndex from "./VoucherFromIndex.jsx";
import VoucherTableNew from "./VoucherTableNew.jsx";
import AccountingHeaderNavbar from "../AccountingHeaderNavbar";
import { useOutletContext } from "react-router-dom";
import VoucherTableInProgress from "./VoucherTableInProgress.jsx";
import VoucherTableApprove from "./VoucherTableApprove.jsx";
import VoucherTableArchive from "./VoucherTableArchive.jsx";
import { Tooltip } from "recharts";
function VoucherIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const configData = getConfigData();
    const progress = getLoadingProgress();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 500;

    const [activeTab, setActiveTab] = useState('');
    useEffect(() => {
        setActiveTab('');
    }, []);

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])

    const rightButtons = (
        <Group
            pos='absolute'
            right={0}
            gap={0}>
            <Tooltip
                label={t('Tooltip')}
                px={20}
                py={3}
                color={'red.6'}
                offset={2}
                transtionProps={{ transition: 'pop-bottom-left', duration: 500 }}>
                <Button
                    size="sm"
                    variant="filled"
                    color="red.6">
                    {t('NewVoucher')}
                </Button>
            </Tooltip>
        </Group>
    )

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <Box >
                        <AccountingHeaderNavbar
                            pageTitle={t('ManageVoucher')}
                            roles={t('Roles')}
                            allowZeroPercentage=''
                            currencySymbol=''
                        />
                        <Box   >
                            <Box className="" bg={'#f0f1f9'} >
                                <Tabs
                                    height={50}
                                    p={4}
                                    bg={'#f0f1f9'}
                                    defaultValue='VoucherEntry'
                                    color="red.6" variant="pills" radius="sm"
                                    onChange={(value) => setActiveTab(value)}
                                >
                                    <Tabs.List pos={'relative'}>

                                        <Tabs.Tab
                                            m={2}
                                            value='New'
                                        >
                                            {t('New')}
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            m={2}
                                            value='InProgress'
                                        >
                                            {t('InProgress')}
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            m={2}
                                            value='Approve'
                                        >
                                            {t('Approve')}
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            m={2}
                                            value='Archive'
                                        >
                                            {t('Archive')}
                                        </Tabs.Tab>
                                        {activeTab !== 'VoucherEntry' && activeTab !== '' &&
                                            (
                                                <Tabs.Tab
                                                    m={2}
                                                    bg={'red.5'}
                                                    value='VoucherEntry'
                                                    ml="auto"
                                                >
                                                    {t('VoucherEntry')}
                                                </Tabs.Tab>
                                            )}
                                    </Tabs.List>

                                    <Tabs.Panel value="New"  >
                                        <Box >
                                            <VoucherTableNew />
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="InProgress" >
                                        <Box >
                                            <VoucherTableInProgress />
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="Approve" >
                                        <Box >
                                            <VoucherTableApprove />
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="Archive" >
                                        <Box >
                                            <VoucherTableArchive />
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="VoucherEntry" >
                                        <Box bg={'white'} >
                                            <VoucherFormIndex />
                                        </Box>
                                    </Tabs.Panel>


                                </Tabs>

                            </Box>

                        </Box>
                    </Box>
                </>
            }
        </>
    );
}

export default VoucherIndex;
