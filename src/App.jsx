import {useEffect, useState} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import routes from './routes'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import CustomerDashboard from "./components/modules/master-data/customer/DashBoard";
import './lang/i18next';

import Provider from "react-redux/es/components/Provider";
import store, {persistor} from "./store";
import { PersistGate } from 'redux-persist/integration/react'
import CustomerIndex from "./components/modules/core/customer/CustomerIndex";
import AppRoute from "./AppRoute";

function App() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
        <MantineProvider withNormalizeCSS withGlobalStyles>
            <ModalsProvider>
                <AppRoute/>
            </ModalsProvider>
        </MantineProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
