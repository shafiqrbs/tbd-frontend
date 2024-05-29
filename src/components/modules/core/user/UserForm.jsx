import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Flex, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRestore,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
    setFetching,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";

function UserForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const form = useForm({
        initialValues: {
            name: '', username: '', email: '', password: '', confirm_password: '', mobile: ''
        },
        validate: {
            name: hasLength({ min: 2, max: 20 }),
            username: hasLength({ min: 2, max: 20 }),
            email: isEmail(),
            mobile: isNotEmpty(),
            password: isNotEmpty(),
            confirm_password: (value, values) =>
                value !== values.password
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('Name').focus()
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
                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('CreateUser')}</Title>
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
                                            <LoadingOverlay visible={formLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('NameValidateMessage')}
                                                    label={t('Name')}
                                                    placeholder={t('Name')}
                                                    required={true}
                                                    nextField={'UserName'}
                                                    form={form}
                                                    name={'name'}
                                                    mt={0}
                                                    id={'Name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t('UserNameValidateMessage')}
                                                    label={t('UserName')}
                                                    placeholder={t('UserName')}
                                                    required={true}
                                                    name={'username'}
                                                    id={'UserName'}
                                                    nextField={'Email'}
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
                                                    id={'Email'}
                                                    nextField={'Mobile'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('MobileValidateMessage')}
                                                    label={t('Mobile')}
                                                    placeholder={t('Mobile')}
                                                    required={true}
                                                    nextField={'Password'}
                                                    name={'mobile'}
                                                    form={form}
                                                    mt={8}
                                                    id={'Mobile'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>

                                                <PasswordInputForm
                                                    form={form}
                                                    tooltip={t('RequiredPassword')}
                                                    label={t('Password')}
                                                    placeholder={t('Password')}
                                                    required={true}
                                                    name={'password'}
                                                    id={'Password'}
                                                    nextField={'ConfirmPassword'}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>

                                                <PasswordInputForm
                                                    form={form}
                                                    tooltip={t('ConfirmPassword')}
                                                    label={t('ConfirmPassword')}
                                                    placeholder={t('ConfirmPassword')}
                                                    required={true}
                                                    name={'confirm_password'}
                                                    id={'ConfirmPassword'}
                                                    nextField={'UserFormSubmit'}
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
