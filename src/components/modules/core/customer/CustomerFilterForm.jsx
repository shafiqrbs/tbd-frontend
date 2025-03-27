import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function CustomerFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
    }]], []);


    return (
        <>
            <InputForm
                label={t("Name")}
                placeholder = {t("EnterName")}
                nextField = {"mobile"}
                id={'name'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={t("Mobile")}
                placeholder = {t("EnterMobile")}
                nextField = {"submit"}
                id={'mobile'}
                name={'mobile'}
                module={props.module}
            />
        </>
    );
}

export default CustomerFilterForm;
