import {
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Box, Tooltip,
    Center,
    Image
  } from '@mantine/core';
import LoginPage from './../assets/css/LoginPage.module.css';
import {useViewportSize, useLocalStorage} from '@mantine/hooks'
import { IconLogin } from '@tabler/icons-react';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import {useNavigate} from 'react-router-dom'
import Logo from '../assets/images/tbd-logo.png'
  
  export default function Login() {
    const navigate = useNavigate()
    const {height, width} = useViewportSize()
    const [token, setToken] = useLocalStorage({
        key: 'token',
        defaultValue: '',
      })
    const form = useForm({
        initialValues: { email: '', password: '' },
    
        // functions will be used to validate values at corresponding key
        validate: {
          email: isEmail(),
          password: isNotEmpty(),
        },
      });

      function login(credentials){
        console.log(credentials)
        setToken('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

        if(localStorage.getItem('token')){
            navigate('/')
        }

      }


    return (
      <Box component='form' className={LoginPage.wrapper} h={height} onSubmit={form.onSubmit((values) => login(values))}>
        <Paper className={LoginPage.form} radius={0} p={10} h={height} ml={`auto`} maw={350}>
          <Center>
            <Image src={Logo} />
          </Center>

          <Tooltip
            label={'Invalied email'}
            px={20}
            py={3}
            opened={!!form.errors.email} 
            position="top-end" 
            color='red' 
            withArrow
            offset={2}
            transitionProps={{ transition: 'pop-bottom-left', duration: 500 }}
          >
            <TextInput withAsterisk label="Email" placeholder="Email" size='xs' {...form.getInputProps('email')} />
                
          </Tooltip>
          <Tooltip
            label={'Password is required'}
            px={20}
            py={3}
            opened={!!form.errors.password} 
            position="top-end" 
            color='red' 
            withArrow
            offset={2}
            transitionProps={{ transition: 'pop-bottom-left', duration: 500 }}
          >
            <PasswordInput withAsterisk label="Password" placeholder="Your password" mt="md" size="xs" {...form.getInputProps('password')} />
                
          </Tooltip>
          <Button type='submit' fullWidth mt="xl" size="xs" leftSection={<IconLogin />}>
            Login
          </Button>
        </Paper>
      </Box>
    );
  }