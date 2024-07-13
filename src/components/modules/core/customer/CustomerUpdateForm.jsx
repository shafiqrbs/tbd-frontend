import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Group, Text, LoadingOverlay, Title, Flex, Stack, Alert, List, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconPlus, IconUsersGroup,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/inventory/crudSlice.js";

import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import getLocationDropdownData from "../../../global-hook/dropdown/getLocationDropdownData.js";
import getExecutiveDropdownData from "../../../global-hook/dropdown/getExecutiveDropdownData.js";
import getCoreSettingCustomerGroupDropdownData
    from "../../../global-hook/dropdown/getCoreSettingCustomerGroupDropdownData.js";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import CustomerGroupDrawer from "./CustomerGroupDrawer.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";

function CustomerUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)
    const locationDropdown = getLocationDropdownData();
    const customerGroupDropdownData = getCoreSettingCustomerGroupDropdownData();
    const executiveDropdown = getExecutiveDropdownData();

    const form = useForm({
        initialValues: {
            name: '',
            customer_group_id: '',
            credit_limit: '',
            reference_id: '',
            mobile: '',
            alternative_mobile: '',
            email: '',
            location_id: '',
            marketing_id: '',
            address: '',
        },
        validate: {
            name: hasLength({ min: 2, max: 50 }),
            mobile: (value) => (!/^\d+$/.test(value)),
            email: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return true;
                }
                return null;
            },
            credit_limit: (value) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            alternative_mobile: (value) => {
                if (value && value.trim()) {
                    const isDigitsOnly = /^\d+$/.test(value);
                    if (!isDigitsOnly) {
                        return true;
                    }
                }
                return null;
            },
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {
        if (entityEditData) {
            form.setValues({
                name: entityEditData.name,
                customer_group_id: entityEditData.customer_group_id,
                credit_limit: entityEditData.credit_limit,
                reference_id: entityEditData.reference_id,
                mobile: entityEditData.mobile,
                alternative_mobile: entityEditData.alternative_mobile,
                email: entityEditData.email,
                location_id: entityEditData.location_id,
                marketing_id: entityEditData.marketing_id,
                address: entityEditData.address,
            })
        }
        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch])


    const [groupDrawer, setGroupDrawer] = useState(false)


    useHotkeys([['alt+n', () => {
        !groupDrawer && document.getElementById('customer_group_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        handleFormReset();
    }]], []);

    useHotkeys([['alt+s', () => {
        !groupDrawer && document.getElementById('EntityFormSubmit').click()
    }]], []);

    const handleFormReset = () => {
        if (entityEditData && Object.keys(entityEditData).length > 0) {
            const originalValues = {
                name: entityEditData.name || '',
                customer_group_id: entityEditData.customer_group_id || '',
                credit_limit: entityEditData.credit_limit || '',
                reference_id: entityEditData.reference_id || '',
                mobile: entityEditData.mobile || '',
                alternative_mobile: entityEditData.alternative_mobile || '',
                email: entityEditData.email || '',
                location_id: entityEditData.location_id || '',
                marketing_id: entityEditData.marketing_id || '',
                address: entityEditData.address || '',
            };
            form.setValues(originalValues);
        }
    };



    return (

        <Box>
            <form onSubmit={form.onSubmit((values) => {
                // In the submit handler of both forms
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red.6' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'core/customer/' + entityEditData.id,
                            data: values
                        }
                        dispatch(updateEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                            navigate('/core/customer', { replace: true })
                        }, 700)
                    },
                });
            })}>


                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('UpdateCustomer')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`green.8`}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("UpdateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>
                                            <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'red.6' }} />
                                            <Box>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={11} >
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('CustomerGroup')}
                                                                label={t('CustomerGroup')}
                                                                placeholder={t('ChooseCustomerGroup')}
                                                                required={false}
                                                                nextField={'name'}
                                                                name={'customer_group_id'}
                                                                form={form}
                                                                dropdownValue={customerGroupDropdownData}
                                                                mt={8}
                                                                id={'customer_group_id'}
                                                                searchable={false}
                                                                value={customerGroupData ? String(customerGroupData) : (entityEditData.customer_group_id ? String(entityEditData.customer_group_id) : null)}
                                                                changeValue={setCustomerGroupData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{ crossAxis: '-110', mainAxis: '5' }}
                                                                withArrow
                                                                transitionProps={{ duration: 200 }}
                                                                label={t('QuickCustomerGroup')}
                                                            >
                                                                <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={() => { setGroupDrawer(true) }}>
                                                                    <IconUsersGroup style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>

                                                    </Grid.Col>

                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('NameValidateMessage')}
                                                    label={t('Name')}
                                                    placeholder={t('Name')}
                                                    required={true}
                                                    nextField={'mobile'}
                                                    name={'name'}
                                                    form={form}
                                                    mt={0}
                                                    id={'name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6} >
                                                        <Box>
                                                            <PhoneNumber
                                                                tooltip={t('MobileValidateMessage')}
                                                                label={t('Mobile')}
                                                                placeholder={t('Mobile')}
                                                                required={true}
                                                                nextField={'alternative_mobile'}
                                                                name={'mobile'}
                                                                form={form}
                                                                mt={8}
                                                                id={'mobile'} />

                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Box>
                                                            <PhoneNumber
                                                                tooltip={t('MobileValidateMessage')}
                                                                label={t('AlternativeMobile')}
                                                                placeholder={t('AlternativeMobile')}
                                                                required={false}
                                                                nextField={'email'}
                                                                name={'alternative_mobile'}
                                                                form={form}
                                                                mt={8}
                                                                id={'alternative_mobile'}
                                                            />
                                                        </Box>

                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('InvalidEmail')}
                                                    label={t('Email')}
                                                    placeholder={t('Email')}
                                                    required={false}
                                                    nextField={'credit_limit'}
                                                    name={'email'}
                                                    form={form}
                                                    mt={8}
                                                    id={'email'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6} >
                                                        <Box >
                                                            <InputForm
                                                                tooltip={t('CreditLimit')}
                                                                label={t('CreditLimit')}
                                                                placeholder={t('CreditLimit')}
                                                                required={false}
                                                                nextField={'reference_id'}
                                                                name={'credit_limit'}
                                                                form={form}
                                                                mt={8}
                                                                id={'credit_limit'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Box>
                                                            <InputForm
                                                                tooltip={t('OLDReferenceNo')}
                                                                label={t('OLDReferenceNo')}
                                                                placeholder={t('OLDReferenceNo')}
                                                                required={false}
                                                                nextField={'location_id'}
                                                                name={'reference_id'}
                                                                form={form}
                                                                mt={8}
                                                                id={'reference_id'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('Location')}
                                                    label={t('Location')}
                                                    placeholder={t('ChooseLocation')}
                                                    required={false}
                                                    nextField={'marketing_id'}
                                                    name={'location_id'}
                                                    form={form}
                                                    dropdownValue={locationDropdown}
                                                    mt={8}
                                                    id={'location_id'}
                                                    searchable={true}
                                                    value={locationData ? String(locationData) : (entityEditData.location_id ? String(entityEditData.location_id) : null)}
                                                    changeValue={setLocationData}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('MarketingExecutive')}
                                                    label={t('MarketingExecutive')}
                                                    placeholder={t('ChooseMarketingExecutive')}
                                                    required={false}
                                                    nextField={'address'}
                                                    name={'marketing_id'}
                                                    form={form}
                                                    dropdownValue={executiveDropdown}
                                                    mt={8}
                                                    id={'marketing_id'}
                                                    searchable={true}
                                                    value={marketingExeData ? String(marketingExeData) : (entityEditData.marketing_id ? String(entityEditData.marketing_id) : null)}
                                                    changeValue={setMarketingExeData}
                                                />

                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <TextAreaForm
                                                    tooltip={t('Address')}
                                                    label={t('Address')}
                                                    placeholder={t('Address')}
                                                    required={false}
                                                    nextField={'EntityFormSubmit'}
                                                    name={'address'}
                                                    form={form}
                                                    mt={8}
                                                    id={'address'}
                                                />
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                entityEditData={entityEditData}
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'customer_group_id'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
            {groupDrawer &&
                <CustomerGroupDrawer groupDrawer={groupDrawer} setGroupDrawer={setGroupDrawer} />
            }
        </Box>
    )
}

export default CustomerUpdateForm;