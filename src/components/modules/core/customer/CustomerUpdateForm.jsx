import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Group, Text, LoadingOverlay, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconPlus,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/inventory/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import getLocationDropdownData from "../../../global-hook/dropdown/getLocationDropdownData.js";
import getExecutiveDropdownData from "../../../global-hook/dropdown/getExecutiveDropdownData.js";

function CustomerUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

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
            email: '',
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => (!/^\d+$/.test(value)),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            location_id: entityEditData.location_id?entityEditData.location_id:'',
            marketing_id: entityEditData.marketing_id?entityEditData.marketing_id:'',
            name: entityEditData.name?entityEditData.name:'',
            mobile: entityEditData.mobile?entityEditData.mobile:'',
            customer_group:entityEditData.customer_group?entityEditData.customer_group:'',
            credit_limit: entityEditData.credit_limit?entityEditData.credit_limit:'',
            reference_id: entityEditData.reference_id?entityEditData.reference_id:'',
            alternative_mobile: entityEditData.alternative_mobile?entityEditData.alternative_mobile:'',
            address: entityEditData.address?entityEditData.address:'',
            email: entityEditData.email?entityEditData.email:''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData])


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
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'core/customer/' + entityEditData.id,
                            data: values
                        }

                        dispatch(updateEntityData(value))

                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('UpdateCustomer')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>

                                <>
                                    {!saveCreateLoading && isOnline &&
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
                                                {t("EditAndSave")}
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

                                <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>

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
                                            value={customerGroupData ? String(customerGroupData) : (entityEditData.customer_group ? String(entityEditData.customer_group) : null)}
                                            changeValue={setCustomerGroupData}
                                        />

                                    </Grid.Col>
                                    <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'} onClick={open}><IconPlus size={12} opacity={0.5}/></Button></Grid.Col>
                                    {opened &&
                                        <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                    }
                                </Grid>

                                <InputForm
                                    tooltip={t('CreditLimit')}
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
                                    tooltip={t('AlternativeMobile')}
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
                                    value={locationData ? String(locationData) : (entityEditData.location_id ? String(entityEditData.location_id) : null)}
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
                                    value={marketingExeData ? String(marketingExeData) : (entityEditData.marketing_id ? String(entityEditData.marketing_id) : null)}
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
    )
}

export default CustomerUpdateForm;
