import {
    Paper,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Anchor, Alert, Tooltip, Group, Center, rem, Box, Loader
} from '@mantine/core';
import LoginPage from './../assets/css/LoginPage.module.css';
import classes from './../assets/css/AuthenticationImage.module.css';
import { getHotkeyHandler, useHotkeys } from '@mantine/hooks'
import { IconInfoCircle, IconLogin, IconArrowLeft } from '@tabler/icons-react';
import { isNotEmpty, useForm } from '@mantine/form';
import { Navigate, useNavigate } from 'react-router-dom'
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import useCommonDataStoreIntoLocalStorage from "./global-hook/local-storage/useCommonDataStoreIntoLocalStorage.js";
import useOrderProcessDropdownLocalDataStore from "./global-hook/local-storage/useOrderProcessDropdownLocalDataStore.js";
import {useAuth} from "./context/AuthContext.jsx";
import {jwtDecode} from "jwt-decode";

export default function LoginJwt() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const icon = <IconInfoCircle />;
    const { user, isLoading: authLoading, login: authLogin } = useAuth();

    const [spinner, setSpinner] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const form = useForm({
        initialValues: { username: '', password: '' },
        validate: {
            username: isNotEmpty(),
            password: isNotEmpty(),
        },
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('Username').focus()
    }]], []);

    // Show loading while checking auth status
    if (authLoading) {
        return <div>Loading...</div>;
    }

    // Redirect if already logged in - this must come AFTER all hooks
    if (user) {
        return <Navigate replace to="/" />;
    }

    async function login(data) {
        setSpinner(true);
        try {
            const response = await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_API_GATEWAY_URL + 'login'}`,
                headers: {
                    "Accept": `application/json`,
                    "Content-Type": `application/json`,
                    "Access-Control-Allow-Origin": '*',
                },
                data: data
            });

            if (response.data.status === 200) {
                try {
                    // console.log(response.data.data.token)

                    localStorage.setItem('access-token', JSON.stringify(response.data.data.token));
                    const decoded = jwtDecode(response.data.data.token);
                    // console.log(decoded)
                    // Wait for all data to be stored and get the main config data
                    const [configData, orderProcessData] = await Promise.all([
                        useCommonDataStoreIntoLocalStorage(decoded?.id),
                        useOrderProcessDropdownLocalDataStore(decoded?.id)
                    ]);

                    if (!configData) {
                        throw new Error("Failed to load configuration data");
                    }

                    // Update auth context with user data and config
                    await authLogin(decoded, {
                        configData: configData
                    });

                    setErrorMessage('');
                    setSpinner(false);
                    navigate('/', { replace: true });
                } catch (dataError) {
                    console.error("Error loading user data:", dataError);
                    setErrorMessage('Failed to load user configuration data');
                    setSpinner(false);

                    // Clear any partially stored data
                    localStorage.removeItem("user");
                    localStorage.removeItem("config-data");
                }
            } else {
                setErrorMessage(response.data.message);
                setSpinner(false);
            }
        } catch (error) {
            setSpinner(false);
            setErrorMessage('Login failed. Please try again.');
            console.error("Login error:", error);

            // Clear any partially stored data
            localStorage.removeItem("user");
            localStorage.removeItem("config-data");
        }
    }

    return (
        <div className={classes.wrapper}>
            <Box
                component='form'
                onSubmit={form.onSubmit((values) => login(values))}
            >
                <Paper className={classes.form} radius={0} p={30} >
                    <Title order={2} className={classes.title} ta="center" mt="md" mb={80}>
                        {t('WelcomeBackToPOSH')}
                    </Title>
                    {
                        errorMessage &&
                        <Alert variant="light" color='var(--theme-primary-color-6)' radius="md" title={errorMessage} icon={icon}></Alert>
                    }
                    <Tooltip
                        label={t('UserNameRequired')}
                        px={20}
                        py={3}
                        opened={!!form.errors.username}
                        position="top-end"
                        color='red'
                        withArrow
                        offset={2}
                        transitionProps={{ transition: 'pop-bottom-left', duration: 500 }}
                    >
                        <TextInput
                            withAsterisk
                            label={t('UserName')}
                            placeholder={t('UserName')}
                            size='md'
                            id={"Username"}
                            {...form.getInputProps('username')}
                            onKeyDown={getHotkeyHandler([
                                ['Enter', (e) => {
                                    document.getElementById("Password").focus();
                                }],
                            ])}
                        />
                    </Tooltip>

                    <Tooltip
                        label={t('RequiredPassword')}
                        px={20}
                        py={3}
                        opened={!!form.errors.password}
                        position="top-end"
                        color='red'
                        withArrow
                        offset={2}
                        transitionProps={{ transition: 'pop-bottom-left', duration: 500 }}
                    >
                        <PasswordInput
                            withAsterisk
                            label={t('Password')}
                            placeholder={t('Password')}
                            mt="md"
                            size="md"
                            {...form.getInputProps('password')}
                            id={"Password"}
                            onKeyDown={getHotkeyHandler([
                                ['Enter', (e) => {
                                    document.getElementById("LoginSubmit").click();
                                }],
                            ])}
                        />
                    </Tooltip>
                    <Checkbox label="Keep me logged in" mt="xl" size="md" />
                    <Group justify="space-between" mt="lg" className={LoginPage.controls}>
                        <Anchor c="dimmed" size="sm" className={LoginPage.control}>
                            <Center inline>
                                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                <Box ml={5}>Back to the sign-up page</Box>
                            </Center>
                        </Anchor>
                        <Button fullWidth={true} mt="xl" bg={'red.5'} size="md" type='submit' id={"LoginSubmit"} className={LoginPage.control} rightSection={<IconLogin />}>
                            {
                                spinner ? <Loader color='var(--theme-primary-color-6)' type="dots" size={30} /> : 'Login'
                            }
                        </Button>
                    </Group>
                </Paper>
            </Box>
        </div>
    );
}