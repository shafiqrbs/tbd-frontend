import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Stack, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import {
    getCustomerDropdown,
} from "../../../../store/core/utilitySlice";
import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData.js";
import CategoryGroupModal from "../../inventory/category/CategoryGroupModal";
import SwitchForm from "../../../form-builders/SwitchForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";

function VendorForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({ min: 2, max: 20 }),
            name: hasLength({ min: 2, max: 20 }),
            mobile: (value) => (!/^\d+$/.test(value)),
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
                console.log(values);
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
                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('CreateVendor')}</Title>
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
                                                                <Text fz={12} fw={400}>
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
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('CompanyNameValidateMessage')}
                                                    label={t('CompanyName')}
                                                    placeholder={t('CompanyName')}
                                                    required={true}
                                                    nextField={'VendorName'}
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
                                                    nextField={'VendorMobile'}
                                                    mt={8}
                                                />
                                            </Box>
                                            
                                            <Box mt={'xs'}>
                                                <PhoneNumber
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

                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputNumberForm
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
                                            </Box>
                                            <Box mt={'xs'}>
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
                                            </Box>
                                            <Box mt={'xs'}>
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
                                            </Box>
                                            <Box mt={'xs'}>
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
export default VendorForm;
