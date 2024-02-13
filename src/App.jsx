import {useEffect, useState} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import routes from './routes'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import './lang/i18next';

function App() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        {
            token ? navigate('/') : navigate('/login')
        }
    }, [])
    return (

        <MantineProvider withNormalizeCSS withGlobalStyles>
            <ModalsProvider>
                <Routes>
                    <Route path='/login' element={<Login/>}/>

                    <Route path="/" element={<Layout/>}>
                        <Route path="/sample/">
                            <Route path="" element={<SampleDashboard/>}/>
                        </Route>

                    </Route>
                </Routes>
            </ModalsProvider>
        </MantineProvider>

    )
}

export default App
