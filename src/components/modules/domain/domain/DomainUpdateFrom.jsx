import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, List, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import {
    getExecutiveDropdown, getLocationDropdown,
} from "../../../../store/core/utilitySlice";
import { setEntityNewData, setFetching, setValidationData, storeEntityData } from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import DomainTable from "./DomainTable";
import InputNumberForm from "../../../form-builders/InputNumberForm";

function DomainUpdateForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const validationMessage = useSelector((state) => state.crudSlice.validationMessage)
    const validation = useSelector((state) => state.crudSlice.validation)
    const entityNewData = useSelector((state) => state.crudSlice.entityNewData)

    useEffect(() => {
        const valueForLocation = {
            url: 'core/select/location',
            param: {
                term: ''
            }
        }
        dispatch(getLocationDropdown(valueForLocation))

        const valueForExecutive = {
            url: 'core/select/executive',
            param: {
                term: ''
            }
        }
        dispatch(getExecutiveDropdown(valueForExecutive))
    }, []);

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
                dispatch(setEntityNewData([]))
                dispatch(setFetching(true))
            }, 700)
        }
    }, [validation, validationMessage, form]);

    useHotkeys([['alt+n', () => {
        document.getElementById('CustomerName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('DomainFormSubmit').click()
    }]], []);


    return (
        <Box>
            <Grid columns={9} gutter={{ base: 8 }}>
                <Grid.Col span={8} >
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
                                    form.reset()
                                    dispatch(setInsertType('create'))
                                    dispatch(setEditEntityData([]))
                                    dispatch(setFetching(true))
                                    setSaveCreateLoading(false)
                                    navigate('/domain/domain-index', { replace: true });
                                }, 700)
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >

                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}  >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('UpdateDomain')}</Title>
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
                                    <Grid columns={24}>
                                        <Grid.Col span={'auto'} >
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box pb={'md'}>
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

                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('CompanyStoreNameValidateMessage')}
                                                            label={t('CompanyStoreName')}
                                                            placeholder={t('CompanyStoreName')}
                                                            required={true}
                                                            nextField={'mobile'}
                                                            name={'company_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'company_name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
                                                            tooltip={t('MobileValidateMessage')}
                                                            label={t('Mobile')}
                                                            placeholder={t('Mobile')}
                                                            required={true}
                                                            nextField={'alternative_mobile'}
                                                            name={'mobile'}
                                                            form={form}
                                                            mt={16}
                                                            id={'mobile'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
                                                            tooltip={t('AlternativeMobileValidateMessage')}
                                                            label={t('AlternativeMobile')}
                                                            placeholder={t('AlternativeMobile')}
                                                            required={false}
                                                            nextField={'email'}
                                                            name={'alternative_mobile'}
                                                            form={form}
                                                            mt={'md'}
                                                            id={'alternative_mobile'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('InvalidEmail')}
                                                            label={t('Email')}
                                                            placeholder={t('Email')}
                                                            required={false}
                                                            nextField={'name'}
                                                            name={'email'}
                                                            form={form}
                                                            mt={'md'}
                                                            id={'email'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('ClientNameValidateMessage')}
                                                            label={t('ClientName')}
                                                            placeholder={t('ClientName')}
                                                            required={true}
                                                            nextField={'username'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={8}
                                                            id={'name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>

                                                        <InputForm
                                                            tooltip={t('DomainUserValidateMessage')}
                                                            label={t('DomainUser')}
                                                            placeholder={t('DomainUser')}
                                                            required={true}
                                                            nextField={'address'}
                                                            name={'username'}
                                                            form={form}
                                                            mt={8}
                                                            id={'username'}
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
                                                            id={'address'}
                                                        />
                                                    </Box>

                                                </Box>
                                            </ScrollArea>
                                        </Grid.Col>
                                    </Grid>
                                </Box>

                            </Box>
                        </Box>
                    </form>
                </Grid.Col>
                <Grid.Col span={1} >
                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                        <Shortcut
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'CompanyName'}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box >

    );
}
export default DomainUpdateForm;
