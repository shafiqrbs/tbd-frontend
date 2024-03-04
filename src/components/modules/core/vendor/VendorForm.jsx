import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,Flex,
    Grid, Box, ScrollArea, Tooltip, TextInput, Switch, Group, Text, LoadingOverlay, Modal, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconInfoCircle,
    IconPlus,
    IconRestore,
    IconSearch,
    IconX,
    IconXboxX
} from "@tabler/icons-react";
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
import CustomerForm from "../customer/CustomerForm";
import Aside from "../../../layout/Aside";
function VendorForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const height = mainAreaHeight - 65; //TabList height 104
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
        document.getElementById('UserName').focus()
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

                        // dispatch(storeEntityData(value))

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
                        <Title order={6} mt={'xs'}>{t('CustomerInformation')}</Title>
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
                                <Button bg={`white`} size="md" ml={1} mr={1} variant="light" color={`gray.7`}>
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
                                            {t("NewReceive")}
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


                            <InputForm
                                tooltip={t('NameValidateMessage')}
                                label={t('Name')}
                                placeholder={t('Name')}
                                required={true}
                                nextField={'UserName'}
                                form={form}
                                name={'name'}
                                mt={0}
                                id={'UserName'}
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
                    <Box mr={8}>
                        <Tooltip
                            label={t('CrtlfText')}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={'indigo'}
                            bg={`gray.1`}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                size="lg"
                                mt={16}
                                mb={16}
                                pl={'16'}
                                pr={'16'}
                                variant={'light'}
                                color={`indigo`}
                                radius="xl"
                            >
                                <Flex direction={`column`} align={'center'}>
                                    <IconSearch size={16}/>
                                    <Text fz={8}>
                                        {t('alt+f')}
                                    </Text>
                                </Flex>
                            </Button>
                        </Tooltip>

                        <Tooltip
                            label={t('CrtlnText')}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={'indigo'}
                            bg={`gray.1`}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                size="lg"
                                mb={16}
                                pl={'16'}
                                pr={'16'}
                                variant={'light'}
                                color={`indigo`}
                                radius="xl"
                            >
                                <Flex direction={`column`} align={'center'}>
                                    <IconPlus size={16}/>
                                    <Text fz={8}>
                                        {t('alt+n')}
                                    </Text>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Tooltip
                            label={t('CrtlrText')}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={'indigo'}
                            bg={`gray.1`}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                size="lg"
                                mb={16}
                                pl={'16'}
                                pr={'16'}
                                variant={'light'}
                                color={`indigo`}
                                radius="xl"
                            >
                                <Flex direction={`column`} align={'center'}>

                                    <IconRestore size={16}/>
                                    <Text fz={8}>
                                        {t('alt+r')}
                                    </Text>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Tooltip
                            label={t('CrtlsText')}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={'indigo'}
                            bg={`gray.1`}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Button
                                size="lg"
                                mb={16}
                                pl={'16'}
                                pr={'16'}
                                variant={'filled'}
                                color={`indigo`}
                                radius="xl"
                            >
                                <Flex direction={`column`} align={'center'}>

                                    <IconDeviceFloppy size={16}/>
                                    <Text fz={8}>
                                        {t('alt+s')}
                                    </Text>
                                </Flex>
                            </Button>
                        </Tooltip>

                    </Box>
                </Grid.Col>
            </Grid>
            </form>
        </Box>

    );
}
export default VendorForm;
