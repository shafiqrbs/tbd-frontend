import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Text, Title, Alert, List, Stack, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconUsersGroup
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { setEntityNewData, setFetching, setValidationData, storeEntityData } from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import CustomerGroupModel from "./CustomerGroupModal.jsx";
import getLocationDropdownData from "../../../global-hook/dropdown/getLocationDropdownData.js";
import getExecutiveDropdownData from "../../../global-hook/dropdown/getExecutiveDropdownData.js";
import getCoreSettingCustomerGroupDropdownData
    from "../../../global-hook/dropdown/getCoreSettingCustomerGroupDropdownData.js";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";

function CustomerForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);

    const validationMessage = useSelector((state) => state.crudSlice.validationMessage)
    const validation = useSelector((state) => state.crudSlice.validation)
    const entityNewData = useSelector((state) => state.crudSlice.entityNewData)

    const locationDropdown = getLocationDropdownData();
    const executiveDropdown = getExecutiveDropdownData();

    const form = useForm({
        initialValues: {
            name: '',
            customer_group: '',
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
            name: hasLength({ min: 2, max: 20 }),
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
        if (validation) {
            validationMessage.name && (form.setFieldError('name', true));
            validationMessage.mobile && (form.setFieldError('mobile', true));
            validationMessage.email && (form.setFieldError('email', true));
            validationMessage.credit_limit && (form.setFieldError('credit_limit', true));
            validationMessage.alternative_mobile && (form.setFieldError('alternative_mobile', true));
            dispatch(setValidationData(false))
        }

        if (entityNewData.message === 'success') {
            notifications.show({
                color: 'teal',
                title: t('CreateSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                form.reset()
                setMarketingExeData(null)
                setCustomerGroupData(null)
                setLocationData(null)
                dispatch(setEntityNewData([]))
                dispatch(setFetching(true))
            }, 700)
        }
    }, [validation, validationMessage, form]);

    useHotkeys([['alt+n', () => {
        document.getElementById('customer_group').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                
                dispatch(setValidationData(false))
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        const value = {
                            url: 'core/customer',
                            data: values
                        }
                        dispatch(storeEntityData(value))
                    },
                });
            })}>
                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('CreateCustomer')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`red.6`}
                                                            type="submit"
                                                            mt={4}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("CreateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>
                                            {
                                                Object.keys(form.errors).length > 0 && validationMessage != 0 &&
                                                <Alert variant="light" color="red" radius="md" title={
                                                    <List withPadding size="sm">
                                                        {validationMessage.name && <List.Item>{t('NameValidateMessage')}</List.Item>}
                                                        {validationMessage.mobile && <List.Item>{t('MobileValidateMessage')}</List.Item>}
                                                        {validationMessage.alternative_mobile && <List.Item>{t('AlternativeMobile')}</List.Item>}
                                                    </List>
                                                }></Alert>
                                            }
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
                                                                name={'customer_group'}
                                                                form={form}
                                                                dropdownValue={getCoreSettingCustomerGroupDropdownData()}
                                                                mt={8}
                                                                id={'customer_group'}
                                                                searchable={false}
                                                                value={customerGroupData}
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
                                                                <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={open}>
                                                                    <IconUsersGroup style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>

                                                    </Grid.Col>
                                                    {opened &&
                                                        <CustomerGroupModel openedModel={opened} open={open} close={close} />
                                                    }
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('NameValidateMessage')}
                                                    label={t('Name')}
                                                    placeholder={t('name')}
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
                                                                id={'mobile'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Box>
                                                            <InputForm
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
                                                    nextField={'opening'}
                                                    name={'email'}
                                                    form={form}
                                                    mt={8}
                                                    id={'email'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6} >
                                                        <Box>
                                                            <InputForm
                                                                tooltip={t('OpeningValidateMessage')}
                                                                label={t('Opening')}
                                                                placeholder={t('Opening')}
                                                                required={false}
                                                                nextField={'credit_limit'}
                                                                name={'opening'}
                                                                form={form}
                                                                id={'opening'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Box>
                                                            <InputForm
                                                                tooltip={t('CreditLimitValidateMessage')}
                                                                label={t('CreditLimit')}
                                                                placeholder={t('CreditLimit')}
                                                                required={false}
                                                                nextField={'reference_id'}
                                                                name={'credit_limit'}
                                                                form={form}
                                                                id={'credit_limit'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
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

                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('Location')}
                                                    label={t('Location')}
                                                    placeholder={t('ChooseLocation')}
                                                    required={false}
                                                    nextField={'marketing_id'}
                                                    name={'location_id'}
                                                    id={'location_id'}
                                                    form={form}
                                                    dropdownValue={locationDropdown}
                                                    mt={8}
                                                    searchable={true}
                                                    value={locationData}
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
                                                    value={marketingExeData}
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
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>

            </form>
        </Box>
    );
}

export default CustomerForm;
