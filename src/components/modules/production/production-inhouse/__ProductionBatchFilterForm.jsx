import {useState} from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";
import React from "react";

function __ProductionBatchFilterForm(props) {

    const {t, i18} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('ParentName').focus()
    }]], []);
    return (
        <>
            <InputForm
                label={t("Invoice")}
                placeHolder={t("Invoice")}
                nextField={"submit"}
                id={"invoice"}
                name={"invoice"}
                module={props.module}
            />

        </>
    );
}

export default __ProductionBatchFilterForm;
