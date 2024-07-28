import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Text, LoadingOverlay, Title, Flex, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";
function UserUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const navigate = useNavigate();


    const form = useForm({
        initialValues: {
            name: '',
            username: '',
            email: '',
            mobile: ''
        },
        validate: {
            name: hasLength({ min: 2, max: 50 }),
            username: hasLength({ min: 2, max: 20 }),
            email: isEmail(),
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
                if (!/^\d{13}$/.test(value)) return t('MobileValidationDigitCount');
                return null;
            },
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    const handleFormReset = () => {
        if (entityEditData) {
            const originalValues = {
                name: entityEditData.name ? entityEditData.name : '',
                username: entityEditData.username ? entityEditData.username : '',
                email: entityEditData.email ? entityEditData.email : '',
                mobile: entityEditData.mobile ? entityEditData.mobile : ''
            }
            form.setValues(originalValues);
        }
    }

    useEffect(() => {
        if (entityEditData) {
            form.setValues({
                name: entityEditData.name ? entityEditData.name : '',
                username: entityEditData.username ? entityEditData.username : '',
                email: entityEditData.email ? entityEditData.email : '',
                mobile: entityEditData.mobile ? entityEditData.mobile : '',
                password: ''
            })
        }
        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, entityEditData])


    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        handleFormReset()
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
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'core/user/' + entityEditData.id,
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
                            navigate('/core/user', { replace: true })
                        }, 700)
                    },
                });
            })}>

                <Box>

                    <Grid columns={9} gutter={{ base: 8 }}>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box bg={"white"} >
                                    <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Title order={6} pt={'6'}>{t('UpdateUser')}</Title>
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
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'red.6' }} />
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('NameValidateMessage')}
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
                                                        tooltip={t('UserNameValidateMessage')}
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
                                                        tooltip={t('RequiredPassword')}
                                                        label={t('Password')}
                                                        placeholder={t('Password')}
                                                        required={false}
                                                        name={'password'}
                                                        id={'password'}
                                                        nextField={'confirm_password'}
                                                        mt={8}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <PasswordInputForm
                                                        form={form}
                                                        tooltip={t('ConfirmPassword')}
                                                        label={t('ConfirmPassword')}
                                                        placeholder={t('ConfirmPassword')}
                                                        required={false}
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
                                    entityEditData={entityEditData}
                                    form={form}
                                    FormSubmit={'EntityFormSubmit'}
                                    Name={'name'}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    )
}
export default UserUpdateForm;
