import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import {
    getCustomerDropdown,
} from "../../../../store/core/utilitySlice";
import {setFetching, storeEntityData} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData.js";

function VendorForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);


    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({min: 2, max: 20}),
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => (!/^\d+$/.test(value)),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('CompanyName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('VendorFormSubmit').click()
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

                        const value = {
                            url: 'core/vendor',
                            data: values
                        }

                        dispatch(storeEntityData(value))

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
                            setCustomerData(null)
                            dispatch(setFetching(true))
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
                            <Group mr={'md'} pos={`absolute`} right={0}  gap={0}>
                                <>
                                    {!saveCreateLoading && isOnline &&
                                        <Button
                                        size="xs"
                                        color={`indigo.6`}
                                        type="submit"
                                        mt={4}
                                        mr={'xs'}
                                        id="VendorFormSubmit"
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
                <Box  h={1} bg={`gray.3`}></Box>
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
                                    dropdownValue={getCustomerDropdownData()}
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

    );
}
export default VendorForm;
