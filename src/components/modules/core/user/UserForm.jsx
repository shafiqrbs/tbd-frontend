import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, TextInput, Switch, Group, Text, LoadingOverlay, Modal,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {IconCheck, IconInfoCircle, IconPlus, IconX, IconXboxX} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys} from "@mantine/hooks";
import axios from "axios";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {useDispatch, useSelector} from "react-redux";
import {
    getLocationDropdown,
} from "../../../../store/core/utilitySlice";
import PasswordInput from "../../../form-builders/PasswordInputForm";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import {hasLength, isEmail, isInRange, isNotEmpty, matches, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {setFetching, storeEntityData, updateEntityData} from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";
function UserForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104
    const form = useForm({
        initialValues: {
            name:'', username:'', email:'', password:'',confirm_password:'',mobile:''
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            username: hasLength({min: 2, max: 20}),
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
    return (
        <ScrollArea h={height}  scrollbarSize={2}>
            <Box p={`md`}>
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
                                url: 'user',
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
                                dispatch(setFetching(true))
                            }, 700)
                        },
                    });
                })}>

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

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" id="UserFormSubmit">Submit</Button>
                    </Group>
                </form>

            </Box>
        </ScrollArea>
);
}
export default UserForm;
