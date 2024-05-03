import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function CategoryGroupFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('Name').focus()
    }]], []);


    return (
        <>
            <InputForm
                label={"Name"}
                placeholder = {"Name"}
                nextField = {"submit"}
                id={'Name'}
                name={'name'}
                module={props.module}
            />
        </>
    );
}

export default CategoryGroupFilterForm;
