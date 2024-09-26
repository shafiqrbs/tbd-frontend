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
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setEntityNewData, setFetching, setValidationData, storeEntityData } from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";

function DomainUpdateForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const form = useForm({
        initialValues: {
            company_name: '', mobile: '', alternative_mobile: '', name: '', username: '', address: '', email: ''
        },
        validate: {
            company_name: hasLength({ min: 2, max: 20 }),
            name: hasLength({ min: 2, max: 20 }),
            username: hasLength({ min: 2, max: 20 }),
            mobile: (value) => {
                const isNotEmpty = !    !value.trim().length;
                const isDigitsOnly = /^\d+$/.test(value.trim());
                if (isNotEmpty && isDigitsOnly) {
                    return false;
                } else {
                    return true;
                }
            },
            alternative_mobile: (value) => {
                if (value) {
                    const isNotEmpty = !!value.trim().length;
                    const isDigitsOnly = /^\d+$/.test(value.trim());

                    if (isNotEmpty && isDigitsOnly) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
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
                                // setSaveCreateLoading(true)
                                // const value = {
                                //     url: 'domain/domain-index/' + entityEditData.id,
                                //     data: values
                                // }
                                // dispatch(updateEntityData(value))
                                // notifications.show({
                                //     color: 'teal',
                                //     title: t('UpdateSuccessfully'),
                                //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                //     loading: false,
                                //     autoClose: 700,
                                //     style: { backgroundColor: 'lightgray' },
                                // });

                                // setTimeout(() => {
                                //     form.reset()
                                //     dispatch(setInsertType('create'))
                                //     dispatch(setEditEntityData([]))
                                //     dispatch(setFetching(true))
                                //     setSaveCreateLoading(false)
                                //     navigate('/domain/domain-index', { replace: true });
                                // }, 700)
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
                                                    <Box mt={'8'}>
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
                                                            mt={8}
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
                                                            mt={8}
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
                                                            mt={8}
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
                                                            nextField={'EntityFormSubmit'}
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
                            Name={'company_name'}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box >

    );
}
export default DomainUpdateForm;
