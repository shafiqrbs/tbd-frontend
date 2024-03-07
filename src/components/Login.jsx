import {
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Box, Tooltip,
    Center,
    Image, Alert, Loader
} from '@mantine/core';
import LoginPage from './../assets/css/LoginPage.module.css';
import {useViewportSize, getHotkeyHandler, useHotkeys} from '@mantine/hooks'
import {IconInfoCircle, IconLogin} from '@tabler/icons-react';
import {isNotEmpty, useForm} from '@mantine/form';
import {Navigate, useNavigate} from 'react-router-dom'
import Logo from '../assets/images/tbd-logo.png'
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";

export default function Login() {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate()
    const {height, width} = useViewportSize()
    const icon = <IconInfoCircle />;

    const [spinner, setSpinner] = useState(false);
    const [errorMessage,setErrorMessage] = useState('')

    const user = localStorage.getItem("user");

    if(user){
        return <Navigate replace to="/"/>;
    }

    const form = useForm({
        initialValues: {username: '', password: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            username: isNotEmpty(),
            password: isNotEmpty(),
        },
    });

    function login(data) {
        setSpinner(true);
        axios({
            method: 'POST',
            url: `${import.meta.env.VITE_API_GATEWAY_URL+'user-login'}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY
            },
            data : data
        })
            .then(res => {
                setTimeout(()=>{
                    if (res.data.status === 200){
                        localStorage.setItem("user", JSON.stringify(res.data.data));
                        setErrorMessage('')
                        setSpinner(false);
                        navigate('/')
                    }
                    setErrorMessage(res.data.message)
                    setSpinner(false);
                },500)
            })
            .catch(function (error) {
                setTimeout(() => {
                    setSpinner(false);
                    console.log(error)
                },500)
            })
    }

    useHotkeys([['alt+n', () => {
        document.getElementById('Username').focus()
    }]], []);

    return (
        <Box
            component='form'
            className={LoginPage.wrapper}
            h={height}
            onSubmit={form.onSubmit((values) => login(values))}
        >
            <Paper className={LoginPage.form} radius={0} p={10} h={height} ml={`auto`} maw={350}>
                <Center>
                    <Image src={Logo}/>
                </Center>

                {
                    errorMessage &&
                    <Alert variant="light" color="red" radius="md" title={errorMessage} icon={icon}></Alert>
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
                    transitionProps={{transition: 'pop-bottom-left', duration: 500}}
                >
                    <TextInput
                        withAsterisk
                        label={t('Username')}
                        placeholder={t('Username')}
                        size='xs'
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
                    transitionProps={{transition: 'pop-bottom-left', duration: 500}}
                >
                    <PasswordInput
                        withAsterisk
                        label={t('Password')}
                        placeholder={t('Password')}
                        mt="md"
                        size="xs"
                        {...form.getInputProps('password')}
                        id={"Password"}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById("LoginSubmit").click();
                            }],
                        ])}
                    />

                </Tooltip>


                <Button type='submit' id={"LoginSubmit"} fullWidth mt="xl" size="xs" leftSection={<IconLogin/>}>
                    {
                        spinner ? <Loader color="red" type="dots" size={30} /> : 'Login'
                    }
                </Button>
            </Paper>
        </Box>
    );
}