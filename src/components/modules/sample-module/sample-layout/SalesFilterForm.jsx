import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function SalesFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('Name').focus()
    }]], []);


    return (
        <>
            <InputForm
                label={t("Name")}
                placeholder = {t("Name")}
                nextField = {"Mobile"}
                id={'Name'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={t("Mobile")}
                placeholder = {t("Mobile")}
                nextField = {"CompanyNameFilter"}
                id={'Mobile'}
                name={'mobile'}
                module={props.module}
            />

            <InputForm
                label={t("CompanyName")}
                placeholder = {t("CompanyName")}
                nextField = {"submit"}
                id={'CompanyNameFilter'}
                name={'company_name'}
                module={props.module}
            />
        </>
    );
}

export default SalesFilterForm;
