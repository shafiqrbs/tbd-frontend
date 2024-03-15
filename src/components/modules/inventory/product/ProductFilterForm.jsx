import React from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";

function ProductFilterForm(props) {
    const {t, i18n} = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('Name').focus()
    }]], []);

    return (
        <>
            <InputForm
                label={t("Name")}
                placeholder={t("Name")}
                nextField={"alternative_name"}
                id={'Name'}
                name={'name'}
                module={props.module}
            />

            <InputForm
                label={t("AlternativeProductName")}
                placeholder={t("AlternativeProductName")}
                nextField={"sku"}
                id={'alternative_name'}
                name={'alternative_name'}
                module={props.module}
            />

            <InputForm
                label={t("ProductSku")}
                placeholder={t("ProductSku")}
                nextField={"sales_price"}
                id={'sku'}
                name={'sku'}
                module={props.module}
            />

            <InputForm
                label={t("SalesPrice")}
                placeholder={t("SalesPrice")}
                id={'sales_price'}
                name={'sales_price'}
                module={props.module}
            />

        </>
    );
}

export default ProductFilterForm;
