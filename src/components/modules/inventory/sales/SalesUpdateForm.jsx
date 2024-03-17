import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRestore,IconPencilBolt
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import {getCustomerDropdown} from "../../../../store/core/utilitySlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";

function SalesUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [customerData, setCustomerData] = useState(null);

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)


    let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);


    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({min: 2, max: 20}),
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => (!/^\d+$/.test(value)),
            // tp_percent: (value) => (value && !/^\d*\.?\d*$/.test(value)),
            // email: (value) => (value && !/^\S+@\S+$/.test(value)),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            company_name: entityEditData.company_name?entityEditData.company_name:'',
            name: entityEditData.name?entityEditData.name:'',
            mobile: entityEditData.mobile?entityEditData.mobile:'',
            customer_id: entityEditData.customer_id?entityEditData.customer_id:'',
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
        document.getElementById('Name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('UserFormSubmit').click()
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
                            url: 'vendor/' + entityEditData.id,
                            data: values
                        }

                        dispatch(updateEntityData(value))

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
                            <Title order={6} mt={'xs'} pl={'6'}>{t('VendorInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>
                                <>
                                    {!saveCreateLoading &&
                                        <Button
                                        size="xs"
                                        color={`indigo.6`}
                                        type="submit"
                                        mt={4}
                                        mr={'xs'}
                                        id="VendorFormSubmit"
                                        leftSection={<IconPencilBolt size={16}/>}
                                    >
                                        {/*<LoadingOverlay
                                            visible={saveCreateLoading}
                                            zIndex={1000}
                                            overlayProps={{radius: "xs", blur: 2}}
                                            size={'xs'}
                                            position="center"
                                        />*/}

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
                <Box m={'md'}>
                    <Grid columns={24}>
                        <Grid.Col span={'auto'}>
                            <ScrollArea h={height} scrollbarSize={2} type="never">
                                <Box pb={'md'}>
                                    <InputForm
                                        tooltip={t('CompanyNameValidateMessage')}
                                        label={t('CompanyName')}
                                        placeholder={t('CompanyName')}
                                        required={true}
                                        nextField={'VendorName'}
                                        form={form}
                                        name={'company_name'}
                                        mt={0}
                                        id={'CompanyName'}
                                    />

                                    <InputForm
                                        form={form}
                                        tooltip={t('VendorNameValidateMessage')}
                                        label={t('VendorName')}
                                        placeholder={t('VendorName')}
                                        required={true}
                                        name={'name'}
                                        id={'VendorName'}
                                        nextField={'VendorMobile'}
                                        mt={8}
                                    />

                                    <InputForm
                                        form={form}
                                        tooltip={t('MobileValidateMessage')}
                                        label={t('VendorMobile')}
                                        placeholder={t('VendorMobile')}
                                        required={true}
                                        name={'mobile'}
                                        id={'VendorMobile'}
                                        nextField={'TPPercent'}
                                        mt={8}
                                    />

                                    <InputForm
                                        tooltip={t('TPPercentValidateMessage')}
                                        label={t('TPPercent')}
                                        placeholder={t('TPPercent')}
                                        required={false}
                                        nextField={'Email'}
                                        name={'tp_percent'}
                                        form={form}
                                        mt={8}
                                        id={'TPPercent'}
                                    />

                                    <InputForm
                                        form={form}
                                        tooltip={t('RequiredAndInvalidEmail')}
                                        label={t('Email')}
                                        placeholder={t('Email')}
                                        required={false}
                                        name={'email'}
                                        id={'Email'}
                                        nextField={'ChooseCustomer'}
                                        mt={8}
                                    />

                                    <SelectForm
                                        tooltip={t('ChooseCustomer')}
                                        label={t('ChooseCustomer')}
                                        placeholder={t('ChooseCustomer')}
                                        required={false}
                                        nextField={'Address'}
                                        name={'customer_id'}
                                        form={form}
                                        dropdownValue={customerDropdown}
                                        mt={8}
                                        id={'ChooseCustomer'}
                                        searchable={true}
                                        value={customerData}
                                        changeValue={setCustomerData}
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
                                FormSubmit={'VendorFormSubmit'}
                                Name={'CompanyName'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    )
}

export default SalesUpdateForm;
