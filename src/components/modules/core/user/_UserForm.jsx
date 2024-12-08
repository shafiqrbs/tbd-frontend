import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Text, Title, Flex, Stack, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconUsersGroup,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch } from "react-redux";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
    setEditEntityData,
    setFetching, setInsertType,
    storeEntityData, updateEntityData,
} from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm";
import getCoreSettingEmployeeGroupDropdownData
    from "../../../global-hook/dropdown/core/getCoreSettingEmployeeGroupDropdownData.js";
import CustomerGroupDrawer from "../customer/CustomerGroupDrawer.jsx";
import userDataStoreIntoLocalStorage from "../../../global-hook/local-storage/userDataStoreIntoLocalStorage.js";

function _UserForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [employeeGroupData, setEmployeeGroupData] = useState(null);

    const form = useForm({
        initialValues: {
            name: '', username: '', email: '', password: '', confirm_password: '', mobile: '', employee_group_id: '',
        },
        validate: {
            employee_group_id: (value) => {
                if (!value) return t('ChooseEmployeeGroup');
            },
            name: (value) => {
                if (!value) return t('NameRequiredMessage');
                if (value.length < 2) return t('NameLengthMessage');
                return null;
            },
            username: (value) => {
                if (!value) return t('UserNameRequiredMessage');
                if (value.length < 2 || value.length > 20) return t('NameLengthMessage');
                if (/[A-Z]/.test(value)) return t('NoUppercaseAllowedMessage');
                return null;
            },
            email: (value) => {
                if (!value) return t('EnterEmail');

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return t('EmailValidationInvalid');

                return null;
            },
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
                return null;
            },
            password: (value) => {
                if (!value) return t('PasswordRequiredMessage');
                if ((value.length < 6)) return t('PasswordValidateMessage');
                return null;
            },
            confirm_password: (value, values) => {
                if (values.password && value !== values.password) return t('PasswordNotMatch');
                return null;
            }
        }
    });

    const [groupDrawer, setGroupDrawer] = useState(false)

    useHotkeys([['alt+n', () => {
        !groupDrawer && document.getElementById('employee_group_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        !groupDrawer && document.getElementById('EntityFormSubmit').click()
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
                    onConfirm: async () => {

                        const value = {
                            url: 'core/user',
                            data: values
                        }

                        const resultAction = await dispatch(storeEntityData(value));

                        if (storeEntityData.rejected.match(resultAction)) {
                            const fieldErrors = resultAction.payload.errors;

                            // Check if there are field validation errors and dynamically set them
                            if (fieldErrors) {
                                const errorObject = {};
                                Object.keys(fieldErrors).forEach(key => {
                                    errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                                });
                                // Display the errors using your form's `setErrors` function dynamically
                                form.setErrors(errorObject);
                            }
                        } else if (storeEntityData.fulfilled.match(resultAction)) {
                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 700,
                                style: { backgroundColor: 'lightgray' },
                            });
                            
                            setTimeout(() => {
                                userDataStoreIntoLocalStorage()
                                form.reset()
                                dispatch(setFetching(true))
                            }, 700)
                        }
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
                                            <Box>
                                                <Grid gutter={{base: 2}}>
                                                    <Grid.Col span={11}>
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={form.errors.employee_group_id ? form.errors.employee_group_id : t('EmployeeGroup')}
                                                                label={t('EmployeeGroup')}
                                                                placeholder={t('ChooseEmployeeGroup')}
                                                                required={true}
                                                                nextField={'name'}
                                                                name={'employee_group_id'}
                                                                form={form}
                                                                dropdownValue={getCoreSettingEmployeeGroupDropdownData()}
                                                                mt={8}
                                                                id={'employee_group_id'}
                                                                searchable={false}
                                                                changeValue={setEmployeeGroupData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{crossAxis: '-110', mainAxis: '5'}}
                                                                withArrow
                                                                transitionProps={{duration: 200}}
                                                                label={t('QuickCustomerGroup')}
                                                            >
                                                                <ActionIcon variant="outline" bg={'white'}
                                                                            size={'lg'} color="red.5" mt={'1'}
                                                                            aria-label="Settings" onClick={() => {
                                                                    setGroupDrawer(true)
                                                                }}>
                                                                    <IconUsersGroup
                                                                        style={{width: '100%', height: '70%'}}
                                                                        stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={form.errors.name ? form.errors.name : t('UserNameValidateMessage')}
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
                                                    tooltip={form.errors.email ? form.errors.email : t('RequiredAndInvalidEmail')}
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
                                                    tooltip={form.errors.password ? form.errors.password : t('RequiredPassword')}
                                                    form={form}
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
                                                    tooltip={form.errors.confirm_password ? form.errors.confirm_password : t('ConfirmPasswordValidateMessage')}
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
            {groupDrawer &&
                <CustomerGroupDrawer groupDrawer={groupDrawer} setGroupDrawer={setGroupDrawer} saveId={'EntityDrawerSubmit'} />
            }
        </Box>
    )
}
export default _UserForm;
