import {useState} from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";
import getProSettingTypeDropdownData from "../../../global-hook/dropdown/getProSettingTypeDropdownData.js";
import SelectForm from "../../../form-builders-filter/SelectForm.jsx";
import React from "react";

function __ProductionSettingFilterForm(props) {

    const {t, i18} = useTranslation();
    const settingTypeDropdown = getProSettingTypeDropdownData()

    useHotkeys([['alt+n', () => {
        document.getElementById('ParentName').focus()
    }]], []);

    const [settingTypeData, setSettingTypeData] = useState(null);

    return (
        <>
            <InputForm
                label={t("Invoce")}
                placeHolder={t("Invoce")}
                nextField={"setting_type"}
                id={"invoice"}
                name={"invoice"}
                module={props.module}
            />

        </>
    );
}

export default __ProductionSettingFilterForm;
