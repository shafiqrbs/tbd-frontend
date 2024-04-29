import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Tooltip, rem,
    LoadingOverlay, Flex
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";


import {
    setInsertType,
    setSearchKeyword,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import { useOutletContext } from "react-router-dom";
import ConfigurationForm from "./ConfigurationForm";
import { setValidationMessage } from "../../../../store/inventory/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "./InventoryHeaderNavbar.jsx";
import { IconRestore, IconDeviceFloppy } from "@tabler/icons-react";

function ConfigurationIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)

    const progress = getLoadingProgress()
    const configData = getConfigData()
    const [activeTab, setActiveTab] = useState("CustomerView");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [isFormSubmit, setFormSubmit] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState([]);
    const { isOnline, mainAreaHeight } = useOutletContext();

    const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
        dispatch(setValidationMessage(''))
        dispatch(setVendorFilterData({
            ...vendorFilterData,
            ['name']: '',
            ['mobile']: '',
            ['company_name']: ''
        }))
    }, [])
    const tabCreateNewRightButtons = (
        <Group mt={4} pos={`absolute`} right={12} gap={0}>
            <Tooltip
                label={t("Refresh")}
                color={`indigo.6`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}>
                <Button variant="transparent" size="md" ml={1} mr={1} color={`gray`}>
                    <IconRestore style={{ width: rem(24) }} />
                </Button>
            </Tooltip>
            <>
                <Button
                    disabled={saveCreateLoading}
                    size="md"
                    color={`indigo.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24} />}
                    onClick={() => {
                        if (activeTab === 'CustomerView') {
                            let validation = true
                            if (!form.values.name) {
                                form.setFieldError('name', true);
                                validation = false
                            }
                            if (!form.values.mobile || isNaN(form.values.mobile)) {
                                form.setFieldError('mobile', true);
                                validation = false
                            }
                            if (form.values.email && !/^\S+@\S+$/.test(form.values.email)) {
                                form.setFieldError('email', true);
                                validation = false
                            }

                            validation &&
                                modals.openConfirmModal({
                                    title: 'Please confirm your action',
                                    children: (
                                        <Text size="sm">
                                            This action is so important that you are required to confirm it with a
                                            modal. Please click
                                            one of these buttons to proceed.
                                        </Text>
                                    ),
                                    labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                    onCancel: () => console.log('Cancel'),
                                    onConfirm: () => {
                                        setSaveCreateLoading(true)
                                        const value = {
                                            url: 'customer',
                                            data: form.values
                                        }
                                        dispatch(createCustomerData(value))
                                        setTimeout(() => {
                                            form.setFieldValue('location_id', '')
                                            form.setFieldValue('marketing_id', '')
                                            form.setFieldValue('customer_group', '')
                                            form.reset()
                                            setSaveCreateLoading(false)
                                            dispatch(setFetching(true))
                                        }, 500)

                                        console.log(form.values)

                                    },
                                });
                        }
                    }}
                >
                    <LoadingOverlay
                        visible={saveCreateLoading}
                        zIndex={1000}
                        overlayProps={{ radius: "xs", blur: 2 }}
                        size={'xs'}
                        position="center"
                    />

                    <Flex direction={`column`} gap={0}>
                        <Text fz={14} fw={400}>
                            {t("CreateAndSave")}
                        </Text>
                    </Flex>
                </Button>
            </>
        </Group>
    );
    const tabCustomerLedgerButtons = (
        <Group mt={4} pos={`absolute`} right={0} gap={0}>
            <Tooltip
                label={t("Refresh")}
                color={`red.6`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
                <Button bg={`white`} size="md" ml={1} mr={1} variant="light" color={`black`}>
                    <IconRestore size={24} />
                </Button>
            </Tooltip>


            <>
                <Button
                    size="md"
                    color={`blue.7`}
                    type="submit"
                    leftSection={<IconDeviceFloppy size={24} />}
                >
                    <LoadingOverlay
                        visible={saveCreateLoading}
                        zIndex={1000}
                        overlayProps={{ radius: "xs", blur: 2 }}
                        size={'xs'}
                        position="center"
                    />

                    <Flex direction={`column`} gap={0}>
                        <Text fz={14} fw={400}>
                            {t("NewReceive")}
                        </Text>
                    </Flex>
                </Button>
            </>
        </Group>
    );

    return (

        <>
            {progress !== 100 && <Progress color="red" size={"xs"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <InventoryHeaderNavbar
                        pageTitle={t('ConfigurationInformationFormDetails')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24}>
                                <ConfigurationForm />
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default ConfigurationIndex;
