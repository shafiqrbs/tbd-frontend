import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function UserFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
    }]], []);


    return (
        <>
            <InputForm
                label={t("Name")}
                placeholder = {t("Name")}
                nextField = {"mobile"}
                id={'name'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={t("Mobile")}
                placeholder = {t("Mobile")}
                nextField = {"email"}
                id={'mobile'}
                name={'mobile'}
                module={props.module}
            />

            <InputForm
                label={t("Email")}
                placeholder = {t("Email")}
                nextField = {"submit"}
                id={'email'}
                name={'email'}
                module={props.module}
            />
        </>
    );
}

export default UserFilterForm;
