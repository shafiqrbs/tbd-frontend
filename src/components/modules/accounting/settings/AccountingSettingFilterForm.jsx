import {useState} from "react";
import {useTranslation} from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import {useHotkeys} from "@mantine/hooks";
import getProSettingTypeDropdownData from "../../../global-hook/dropdown/getProSettingTypeDropdownData.js";
import SelectForm from "../../../form-builders-filter/SelectForm.jsx";
import React from "react";

function AccountingSettingFilterForm(props) {

    const {t, i18} = useTranslation();
    const settingTypeDropdown = getProSettingTypeDropdownData()

    useHotkeys([['alt+n', () => {
        document.getElementById('ParentName').focus()
    }]], []);

    const [settingTypeData, setSettingTypeData] = useState(null);

    return (
        <>
            <InputForm
                label={t("Name")}
                placeHolder={t("Name")}
                nextField={"setting_type"}
                id={"name"}
                name={"name"}
                module={props.module}
            />

            <SelectForm
                label={t('SettingType')}
                placeholder={t('SettingType')}
                mt={1}
                clearable={true}
                searchable={true}
                required={false}
                nextField={'submit'}
                name={'setting_type_id'}
                dropdownValue={settingTypeDropdown}
                id={'setting_type'}
                value={settingTypeData}
                changeValue={setSettingTypeData}
                comboboxProps={true}
                allowDeselect={false}
                module={props.module}
            />
        </>
    );
}

export default AccountingSettingFilterForm;
