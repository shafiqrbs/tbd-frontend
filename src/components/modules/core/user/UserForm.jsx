import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRestore,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import {hasLength, isEmail, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {
    setFetching,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut.jsx";

function UserForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 104; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

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

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('UserFormSubmit').click()
    }]], []);


    return (

        <Box bg={"white"} mt={`md`} mr={'xs'}>
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
                <Box  pb={`xs`} pl={`xs`} pr={8} >
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CustomerInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>
                                <Tooltip
                                    label={t("Refresh")}
                                    color={`red.6`}
                                    withArrow
                                    offset={2}
                                    position={"bottom"}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <Button bg={`white`} size="md" ml={1} mr={1} variant="light" color={`gray.7`}
                                            onClick={(e)=>{
                                                form.reset()
                                            }}
                                    >
                                        <IconRestore size={24}/>
                                    </Button>
                                </Tooltip>
                                <>
                                    <Button
                                        size="md"
                                        color={`indigo.7`}
                                        type="submit"
                                        id="UserFormSubmit"
                                        leftSection={<IconDeviceFloppy size={24}/>}
                                    >
                                        <LoadingOverlay
                                            visible={saveCreateLoading}
                                            zIndex={1000}
                                            overlayProps={{radius: "xs", blur: 2}}
                                            size={'xs'}
                                            position="center"
                                        />

                                        <Flex direction={`column`} gap={0}>
                                            <Text   fz={14} fw={400}>
                                                {t("CreateAndSave")}
                                            </Text>
                                        </Flex>
                                    </Button>
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box h={1} bg={`gray.3`}></Box>
                <Grid>
                    <Grid.Col span={10} >
                        <ScrollArea h={height} scrollbarSize={2}>
                            <Box p={`md`} pb={'md'} >

                                <LoadingOverlay visible={formLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />


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

                            </Box>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Shortcut
                            form={form}
                            FormSubmit={'UserFormSubmit'}
                            Name={'Name'}
                        />
                    </Grid.Col>
                </Grid>
            </form>
        </Box>
    )
}
export default UserForm;
