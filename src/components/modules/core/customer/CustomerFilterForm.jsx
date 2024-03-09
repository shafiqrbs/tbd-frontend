import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function CustomerFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('Name').focus()
    }]], []);


    return (
        <>
            <InputForm
                label={"Name"}
                placeholder = {"Name"}
                nextField = {"mobile"}
                id={'Name'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={"Mobile"}
                placeholder = {"Mobile"}
                nextField = {"submit"}
                id={'mobile'}
                name={'mobile'}
                module={props.module}
            />
        </>
    );
}

export default CustomerFilterForm;
