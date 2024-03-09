import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function UserFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('NameFilter').focus()
    }]], []);


    return (
        <>
            <InputForm
                label={t("Name")}
                placeholder = {t("Name")}
                nextField = {"MobileFilter"}
                id={'NameFilter'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={t("Mobile")}
                placeholder = {t("Mobile")}
                nextField = {"EmailFilter"}
                id={'MobileFilter'}
                name={'mobile'}
                module={props.module}
            />

            <InputForm
                label={t("Email")}
                placeholder = {t("Email")}
                nextField = {"submit"}
                id={'EmailFilter'}
                name={'email'}
                module={props.module}
            />
        </>
    );
}

export default UserFilterForm;
