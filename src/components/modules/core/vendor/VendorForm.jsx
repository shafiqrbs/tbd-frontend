import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Text, Title, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";

import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";

function VendorForm(props) {
    const { customerDropDownData } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', email: '', customer_id: '', address: ''
        },
        validate: {
            company_name: hasLength({ min: 2, max: 20 }),
            name: hasLength({ min: 2, max: 20 }),
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
                return null;
            },
            email: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return true;
                }
                return null;
            },
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('company_name').focus()
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
                            url: 'core/vendor',
                            data: values
                        }

                        dispatch(storeEntityData(value))

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
                            setCustomerData(null)
                            dispatch(setFetching(true))
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
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('CreateVendor')}</Title>
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
                                                                    {t("CreateAndSave")}
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
                                            <Box mt={8}>
                                                <InputForm
                                                    tooltip={t('CompanyNameValidateMessage')}
                                                    label={t('CompanyName')}
                                                    placeholder={t('CompanyName')}
                                                    required={true}
                                                    nextField={'name'}
                                                    form={form}
                                                    name={'company_name'}
                                                    mt={0}
                                                    id={'company_name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('VendorNameValidateMessage')}
                                                    label={t('VendorName')}
                                                    placeholder={t('VendorName')}
                                                    required={true}
                                                    name={'name'}
                                                    id={'name'}
                                                    nextField={'mobile'}
                                                    mt={8}
                                                />
                                            </Box>

                                            <Box mt={'xs'}>
                                                <PhoneNumber
                                                    form={form}
                                                    tooltip={form.errors.mobile ? form.errors.mobile : t('MobileValidateMessage')}
                                                    label={t('VendorMobile')}
                                                    placeholder={t('VendorMobile')}
                                                    required={true}
                                                    name={'mobile'}
                                                    id={'mobile'}
                                                    nextField={'email'}
                                                    mt={8}
                                                />

                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('InvalidEmail')}
                                                    label={t('Email')}
                                                    placeholder={t('Email')}
                                                    required={false}
                                                    name={'email'}
                                                    id={'email'}
                                                    nextField={'customer_id'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseCustomer')}
                                                    label={t('ChooseCustomer')}
                                                    placeholder={t('ChooseCustomer')}
                                                    required={false}
                                                    nextField={'address'}
                                                    name={'customer_id'}
                                                    form={form}
                                                    dropdownValue={customerDropDownData}
                                                    mt={8}
                                                    id={'customer_id'}
                                                    searchable={true}
                                                    value={customerData}
                                                    changeValue={setCustomerData}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
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
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form >
        </Box >

    );
}
export default VendorForm;
