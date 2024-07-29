import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Text, Title, Flex, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch } from "react-redux";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
    setFetching,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";

function UserForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);


    const form = useForm({
        initialValues: {
            name: '', username: '', email: '', password: '', confirm_password: '', mobile: ''
        },
        validate: {
            name: (value) => {
                if (!value) return t('NameRequiredMessage');
                if (value.length < 2 || value.length > 20) return t('NameLengthMessage');
                return null;
            },
            username: (value) => {
                if (!value) return t('NameRequiredMessage');
                if (value.length < 2 || value.length > 20) return t('NameLengthMessage');
                return null;
            },
            email: isEmail(),
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
                if (!/^\d{13}$/.test(value)) return t('MobileValidationDigitCount');
                return null;
            },
            password: (value) => {
                if (!value) return t('PasswordRequiredMessage');
                if ((value.length < 6)) return t('PasswordValidateMessage');
                return null;
            },
            confirm_password: (value, values) => {
                if (values.password && value !== values.password) return t('PasswordSimilarMessage');
                return null;
            }
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
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
                            url: 'core/user',
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
                                            <Title order={6} pt={'6'}>{t('CreateUser')}</Title>
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

                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={form.errors.name ? form.errors.name : t('NameValidateMessage')}
                                                    label={t('Name')}
                                                    placeholder={t('Name')}
                                                    required={true}
                                                    nextField={'username'}
                                                    form={form}
                                                    name={'name'}
                                                    mt={0}
                                                    id={'name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={form.errors.username ? form.errors.username : t('UserNameValidateMessage')}
                                                    label={t('UserName')}
                                                    placeholder={t('UserName')}
                                                    required={true}
                                                    name={'username'}
                                                    id={'username'}
                                                    nextField={'email'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('RequiredAndInvalidEmail')}
                                                    label={t('Email')}
                                                    placeholder={t('Email')}
                                                    required={true}
                                                    name={'email'}
                                                    id={'email'}
                                                    nextField={'mobile'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <PhoneNumber
                                                    tooltip={form.errors.mobile ? form.errors.mobile : t('MobileValidateMessage')}
                                                    label={t('Mobile')}
                                                    placeholder={t('Mobile')}
                                                    required={true}
                                                    nextField={'password'}
                                                    name={'mobile'}
                                                    form={form}
                                                    mt={8}
                                                    id={'mobile'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>

                                                <PasswordInputForm
                                                    form={form}
                                                    tooltip={form.errors.password ? form.errors.password : t('RequiredPassword')}
                                                    label={t('Password')}
                                                    placeholder={t('Password')}
                                                    required={true}
                                                    name={'password'}
                                                    id={'password'}
                                                    nextField={'confirm_password'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>

                                                <PasswordInputForm
                                                    form={form}
                                                    tooltip={form.errors.confirm_password ? form.errors.confirm_password : t('ConfirmPassword')}
                                                    label={t('ConfirmPassword')}
                                                    placeholder={t('ConfirmPassword')}
                                                    required={true}
                                                    name={'confirm_password'}
                                                    id={'confirm_password'}
                                                    nextField={'EntityFormSubmit'}
                                                    mt={8}
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
    )
}
export default UserForm;
