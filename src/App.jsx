import { useNavigate} from 'react-router-dom'
import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import './lang/i18next';

import Provider from "react-redux/es/components/Provider";
import store, {persistor} from "./store";
import { PersistGate } from 'redux-persist/integration/react'
import AppRoute from "./AppRoute";

function App() {

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
