import {useState} from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";
import React from "react";

function __RecipeItemFilterForm(props) {

    const {t, i18} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('ParentName').focus()
    }]], []);

    return (
        <>
            <InputForm
                label={t("ProductName")}
                placeHolder={t("ProductName")}
                nextField={"setting_type"}
                id={"name"}
                name={"product_name"}
                module={props.module}
            />
        </>
    );
}

export default __RecipeItemFilterForm;
