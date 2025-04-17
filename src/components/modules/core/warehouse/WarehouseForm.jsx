import React, { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";

import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";


function WarehouseForm({ adjustment }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; // TabList height 100
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: '', location: '', contract_person: '', mobile: '', email: '', address: ''
        },
        validate: {
            name: isNotEmpty(),
            location: isNotEmpty(),
            contract_person: isNotEmpty(),
            mobile: (value) => (/^\+?[1-9]\d{1,14}$/).test(value) ? null : t("InvalidMobile"),
            email: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return t("InvalidEmail");
                }
                return null;
            },
        }
    });

    // Enhanced Hotkeys Logic
    useHotkeys([
        ['alt+n', (event) => { event.preventDefault(); document.querySelector('#name')?.focus() }],
        ['alt+r', (event) => { event.preventDefault(); form.reset() }],
        ['alt+s', (event) => { event.preventDefault(); document.querySelector('#WarehouseFormSubmit')?.click() }],
    ]);

    // Optimized & Memoized Submit Function
    const handleSubmit = useCallback((values) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t('Submit'), cancel: t('Cancel') },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                const requestData = { url: 'core/warehouse', data: form.values };
                const resultAction = await dispatch(storeEntityData(requestData));

                // Handle API errors
                if (storeEntityData.rejected.match(resultAction)) {
                    const fieldErrors = resultAction.payload?.errors || {};
                    form.setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]])));
                } else {
                    notifications.show({
                        color: 'teal',
                        title: t('CreateSuccessfully'),
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 700,
                        style: { backgroundColor: 'lightgray' },
                    });

                    setTimeout(() => {
                        form.reset();
                        dispatch(setFetching(true));
                    }, 700);
                }
            },
        });
    }, [form, dispatch, t]);

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box mb={0}>
                    <Grid columns={9} gutter={{ base: 6 }}>
                        <Grid.Col span={8}>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={8}>
                                            <Title order={6} pt={'6'}>{t('CreateWarehouse')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Stack right align="flex-end">
                                                {!saveCreateLoading && isOnline && (
                                                    <Button
                                                        size="xs"
                                                        className={'btnPrimaryBg'}
                                                        type="submit"
                                                        id="WarehouseFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <Text fz={14} fw={400}>{t("CreateAndSave")}</Text>
                                                        </Flex>
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('EnterName')}
                                                label={t('Name')}
                                                placeholder={t('Name')}
                                                required
                                                nextField={'location'}
                                                form={form}
                                                name={'name'}
                                                id={'name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('EnterLocation')}
                                                label={t('Location')}
                                                placeholder={t('Location')}
                                                required
                                                nextField={'contract_person'}
                                                form={form}
                                                name={'location'}
                                                id={'location'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('EnterName')}
                                                label={t('ContractPerson')}
                                                placeholder={t('ContractPerson')}
                                                required
                                                nextField={'mobile'}
                                                form={form}
                                                name={'contract_person'}
                                                id={'contract_person'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <PhoneNumber
                                                tooltip={t("EnterMobile")}
                                                label={t('Mobile')}
                                                placeholder={t('Mobile')}
                                                required
                                                nextField={'email'}
                                                form={form}
                                                name={'mobile'}
                                                id={'mobile'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('EnterEmail')}
                                                label={t('Email')}
                                                placeholder={t('Email')}
                                                nextField={'address'}
                                                form={form}
                                                name={'email'}
                                                id={'email'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('EnterAddress')}
                                                label={t('Address')}
                                                placeholder={t('Address')}
                                                nextField={'WarehouseFormSubmit'}
                                                form={form}
                                                name={'address'}
                                                id={'address'}
                                            />
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                <_ShortcutMasterData
                                    adjustment={adjustment}
                                    form={form}
                                    FormSubmit={'WarehouseFormSubmit'}
                                    Name={'name'}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

export default WarehouseForm;

