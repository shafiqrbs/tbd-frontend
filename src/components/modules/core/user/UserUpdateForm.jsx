import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,IconPencilBolt,
    IconRestore,
} from "@tabler/icons-react";
import { useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isEmail, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut.jsx";
function UserUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const form = useForm({
        initialValues: {
            name:'',
            username:'',
            email:'',
            mobile:''
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            username: hasLength({min: 2, max: 20}),
            email: isEmail(),
            mobile: isNotEmpty()
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch,formLoading])

    useEffect(() => {

        form.setValues({
            name:entityEditData.name?entityEditData.name:'',
            username:entityEditData.username?entityEditData.username:'',
            email:entityEditData.email?entityEditData.email:'',
            mobile:entityEditData.mobile?entityEditData.mobile:''
        })

        dispatch(setFormLoading(false))
        setTimeout(()=>{
            setFormLoad(false)
            setFormDataForUpdate(false)
        },500)

    }, [dispatch,setFormData])


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

        <Box bg={"white"} mt={`xs`}>
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
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'core/user/'+entityEditData.id,
                            data: values
                        }

                        dispatch(updateEntityData(value))

                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('UserInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0}  gap={0}>
                                <>
                                    {!saveCreateLoading && isOnline &&
                                        <Button
                                        size="xs"
                                        color={`indigo.6`}
                                        type="submit"
                                        mt={4}
                                        mr={'xs'}
                                        id="VendorFormSubmit"
                                        leftSection={<IconPencilBolt size={16}/>}
                                    >

                                        <Flex direction={`column`} gap={0}>
                                            <Text fz={12} fw={400}>
                                                {t("EditAndSave")}
                                            </Text>
                                        </Flex>
                                    </Button>
                                    }
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box h={1} bg={`gray.3`}></Box>
                <Box m={'md'}>
                    <Grid columns={24}>
                        <Grid.Col span={'auto'}>
                        <ScrollArea h={height} scrollbarSize={2} type="never">
                            <Box pb={'md'} >

                                <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

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



                            </Box>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Shortcut
                            form={form}
                            UserFormSubmit={'UserFormSubmit'}
                            Name={'Name'}
                        />
                    </Grid.Col>
                </Grid>
                </Box>
            </form>
        </Box>
    )
}
export default UserUpdateForm;
