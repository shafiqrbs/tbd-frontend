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
    IconDeviceFloppy, IconPlusMinus, IconUsersGroup,IconPercentage
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/inventory/crudSlice.js";

import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";

function CustomerUpdateForm(props) {
    const { locationDropdown, customerGroupDropdownData, executiveDropdown } = props
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
    const navigate = useNavigate()

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)


    const form = useForm({
        initialValues: {
            name: entityEditData?.name || '',
            customer_group_id: entityEditData?.customer_group_id || '',
            credit_limit: entityEditData?.credit_Limit || '',
            reference_id: entityEditData?.reference_id || '',
            mobile: entityEditData?.mobile || '',
            alternative_mobile: entityEditData?.alternative_mobile || '',
            email: entityEditData?.email || '',
            location_id: entityEditData?.location_id || '',
            marketing_id: entityEditData?.marketing_id || '',
            address: entityEditData?.address || '',
            discount_percent : entityEditData?.discount_percent || '',
        },
        validate: {
            name: hasLength({ min: 2, max: 50 }),
            customer_group_id : isNotEmpty(),
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
            },
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
            discount_percent : (value) => {
                if (value) {
                    const validFormat = /^(?:[0-9]|[1-9][0-9])(\.\d{1,2})?$/.test(value);
                    if (!validFormat) {
                        return true;
                    }
                }
                return null;
            }
        }
    });
    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {
        if (entityEditData) {
            form.setValues({
                name: entityEditData?.name || '',
                customer_group_id: entityEditData?.customer_group_id || '',
                credit_limit: entityEditData?.credit_Limit || '',
                reference_id: entityEditData?.reference_id || '',
                mobile: entityEditData?.mobile || '',
                alternative_mobile: entityEditData?.alternative_mobile || '',
                email: entityEditData?.email || '',
                location_id: entityEditData?.location_id || '',
                marketing_id: entityEditData?.marketing_id || '',
                discount_percent: entityEditData?.discount_percent || '',
                address: entityEditData?.address || '',
            })
        }
        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch])

    useHotkeys([['alt+n', () => {
        document.getElementById('customer_group_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        handleFormReset();
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const handleFormReset = () => {
        if (entityEditData && Object.keys(entityEditData).length > 0) {
            const originalValues = {
                name: entityEditData?.name || '',
                customer_group_id: entityEditData?.customer_group_id || '',
                credit_limit: entityEditData?.credit_Limit || '',
                reference_id: entityEditData?.reference_id || '',
                mobile: entityEditData?.mobile || '',
                alternative_mobile: entityEditData?.alternative_mobile || '',
                email: entityEditData?.email || '',
                location_id: entityEditData?.location_id || '',
                marketing_id: entityEditData?.marketing_id || '',
                discount_percent: entityEditData?.discount_percent || '',
                address: entityEditData?.address || '',
            };
            form.setValues(originalValues);
        }
    };



    return (

        <Box>
            <form onSubmit={form.onSubmit((values) => {
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
                            customerDataStoreIntoLocalStorage()
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
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
                                                            className={'btnPrimaryBg'}
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
                                                    <Grid.Col span={12} >
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('ChooseCustomerGroup')}
                                                                label={t('CustomerGroup')}
                                                                placeholder={t('ChooseCustomerGroup')}
                                                                required={true}
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
                                                                tooltip={form.errors.mobile ? form.errors.mobile : t('MobileValidateMessage')}
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
                                                                tooltip={form.errors.alternative_mobile ? form.errors.alternative_mobile : t('MobileValidateMessage')}
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
                                                    nextField={'discount_percent'}
                                                    name={'email'}
                                                    form={form}
                                                    mt={8}
                                                    id={'email'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    type={'number'}
                                                    leftSection={(
                                                        <IconPercentage size={16} opacity={0.5} />
                                                    )}
                                                    tooltip={t('DiscountPercentValidateMessage')}
                                                    label={t('DiscountPercent')}
                                                    placeholder={t('DiscountPercent')}
                                                    required={false}
                                                    nextField={'credit_limit'}
                                                    name={'discount_percent'}
                                                    form={form}
                                                    mt={8}
                                                    id={'discount_percent'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6} >
                                                        <Box >
                                                            <InputForm
                                                                type={'number'}
                                                                leftSection={(
                                                                    <IconPlusMinus size={16} opacity={0.5} />
                                                                )}
                                                                tooltip={t('CreditLimitValidationMessage')}
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
                                                                tooltip={t('OLDReferenceNoValidateMessage')}
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
                                                    tooltip={t('AddressValidateMessage')}
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
                                handleFormReset={handleFormReset}
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

        </Box>
    )
}

export default CustomerUpdateForm;