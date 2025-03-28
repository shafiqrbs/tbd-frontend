import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function WarehouseFilterForm(props) {
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
                id={'Name'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={t("Mobile")}
                placeholder = {t("Mobile")}
                nextField = {"location"}
                id={'mobile'}
                name={'mobile'}
                module={props.module}
            />

            <InputForm
                label={t("Location")}
                placeholder = {t("Location")}
                nextField = {"submit"}
                id={'location'}
                name={'location'}
                module={props.module}
            />
        </>
    );
}

export default WarehouseFilterForm;
