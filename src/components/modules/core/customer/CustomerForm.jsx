import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, List,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import {setEntityNewData, setFetching, setValidationData, storeEntityData} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import CustomerGroupModel from "./CustomerGroupModal.jsx";
import getLocationDropdownData from "../../../global-hook/dropdown/getLocationDropdownData.js";
import getExecutiveDropdownData from "../../../global-hook/dropdown/getExecutiveDropdownData.js";

function CustomerForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 80; //TabList height 104
    const [opened, {open, close}] = useDisclosure(false);

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
            location_id: '',
            marketing_id: '',
            name: '',
            mobile: '',
            customer_group: '',
            credit_limit: '',
            reference_id: '',
            alternative_mobile: '',
            address: '',
            email: ''
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
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

        if (entityNewData.message ==='success'){
            notifications.show({
                color: 'teal',
                title: t('CreateSuccessfully'),
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: 'lightgray'},
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
        }, [validation,validationMessage,form]);

    useHotkeys([['alt+n', () => {
        document.getElementById('CustomerName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('CustomerFormSubmit').click()
    }]], []);


    return (
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
                dispatch(setValidationData(false))
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a
                            modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
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
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CreateNewCustomer')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>

                                <>
                                    {
                                        !saveCreateLoading && isOnline &&
                                        <Button
                                            size="xs"
                                            color={`indigo.6`}
                                            type="submit"
                                            mt={4}
                                            id="CustomerFormSubmit"
                                            leftSection={<IconDeviceFloppy size={16}/>}
                                        >

                                            <Flex direction={`column`} gap={0}>
                                                <Text fz={12} fw={400}>
                                                    {t("CreateAndSave")}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    }
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box h={1} bg={`gray.3`}></Box>
                <Box pl={`xs`} pr={'xs'} mt={'xs'}>
                    <Grid columns={24}>
                        <Grid.Col span={'auto'}>
                            <ScrollArea h={height} scrollbarSize={2} type="never">
                                <Box pl={'xs'} pb={'md'}>
                                    {
                                        Object.keys(form.errors).length > 0 && validationMessage !=0 &&
                                        <Alert variant="light" color="red" radius="md" title={
                                            <List withPadding size="sm">
                                                {validationMessage.name && <List.Item>{t('NameValidateMessage')}</List.Item>}
                                                {validationMessage.mobile && <List.Item>{t('MobileValidateMessage')}</List.Item>}
                                                {validationMessage.alternative_mobile && <List.Item>{t('AlternativeMobile')}</List.Item>}
                                            </List>
                                        }></Alert>
                                    }

                                    <InputForm
                                        tooltip={t('NameValidateMessage')}
                                        label={t('Name')}
                                        placeholder={t('CustomerName')}
                                        required={true}
                                        nextField={'CustomerGroup'}
                                        name={'name'}
                                        form={form}
                                        mt={0}
                                        id={'CustomerName'}
                                    />


                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={10}>
                                            <SelectForm
                                                tooltip={t('CustomerGroup')}
                                                label={t('CustomerGroup')}
                                                placeholder={t('ChooseCustomerGroup')}
                                                required={false}
                                                nextField={'CreditLimit'}
                                                name={'customer_group'}
                                                form={form}
                                                dropdownValue={["Family", "Local"]}
                                                mt={8}
                                                id={'CustomerGroup'}
                                                searchable={false}
                                                value={customerGroupData}
                                                changeValue={setCustomerGroupData}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'}
                                                                   onClick={open}><IconPlus size={12}
                                                                                            opacity={0.5}/></Button></Grid.Col>
                                        {opened &&
                                            <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                        }
                                    </Grid>

                                    <InputForm
                                        tooltip={t('CreditLimitValidateMessage')}
                                        label={t('CreditLimit')}
                                        placeholder={t('CreditLimit')}
                                        required={false}
                                        nextField={'OLDReferenceNo'}
                                        name={'credit_limit'}
                                        form={form}
                                        mt={8}
                                        id={'CreditLimit'}
                                    />

                                    <InputForm
                                        tooltip={t('OLDReferenceNo')}
                                        label={t('OLDReferenceNo')}
                                        placeholder={t('OLDReferenceNo')}
                                        required={false}
                                        nextField={'Mobile'}
                                        name={'reference_id'}
                                        form={form}
                                        mt={8}
                                        id={'OLDReferenceNo'}
                                    />

                                    <InputForm
                                        tooltip={t('MobileValidateMessage')}
                                        label={t('Mobile')}
                                        placeholder={t('Mobile')}
                                        required={true}
                                        nextField={'AlternativeMobile'}
                                        name={'mobile'}
                                        form={form}
                                        mt={8}
                                        id={'Mobile'}
                                    />

                                    <InputForm
                                        tooltip={t('MobileValidateMessage')}
                                        label={t('AlternativeMobile')}
                                        placeholder={t('AlternativeMobile')}
                                        required={false}
                                        nextField={'Email'}
                                        name={'alternative_mobile'}
                                        form={form}
                                        mt={8}
                                        id={'AlternativeMobile'}
                                    />

                                    <InputForm
                                        tooltip={t('InvalidEmail')}
                                        label={t('Email')}
                                        placeholder={t('Email')}
                                        required={false}
                                        nextField={'Location'}
                                        name={'email'}
                                        form={form}
                                        mt={8}
                                        id={'Email'}
                                    />

                                    <SelectForm
                                        tooltip={t('Location')}
                                        label={t('Location')}
                                        placeholder={t('ChooseLocation')}
                                        required={false}
                                        nextField={'MarketingExecutive'}
                                        name={'location_id'}
                                        form={form}
                                        dropdownValue={locationDropdown}
                                        mt={8}
                                        id={'Location'}
                                        searchable={true}
                                        value={locationData}
                                        changeValue={setLocationData}
                                    />


                                    <SelectForm
                                        tooltip={t('MarketingExecutive')}
                                        label={t('MarketingExecutive')}
                                        placeholder={t('ChooseMarketingExecutive')}
                                        required={false}
                                        nextField={'Address'}
                                        name={'marketing_id'}
                                        form={form}
                                        dropdownValue={executiveDropdown}
                                        mt={8}
                                        id={'MarketingExecutive'}
                                        searchable={true}
                                        value={marketingExeData}
                                        changeValue={setMarketingExeData}
                                    />


                                    <TextAreaForm
                                        tooltip={t('Address')}
                                        label={t('Address')}
                                        placeholder={t('Address')}
                                        required={false}
                                        nextField={'Status'}
                                        name={'address'}
                                        form={form}
                                        mt={8}
                                        id={'Address'}
                                    />

                                </Box>
                            </ScrollArea>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Shortcut
                                form={form}
                                FormSubmit={'CustomerFormSubmit'}
                                Name={'CustomerName'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

export default CustomerForm;
