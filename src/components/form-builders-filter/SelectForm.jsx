import React from "react";
import {
    Select
} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import {setProductionSettingFilterData} from "../../store/production/crudSlice.js";

function SelectForm(props) {
    const {
        label,
        placeholder,
        required,
        nextField,
        name,
        mt,
        dropdownValue,
        searchable,
        value,
        changeValue,
        clearable,
        allowDeselect,
        module
    } = props
    const dispatch = useDispatch();
    const productionSettingFilterData = useSelector((state) => state.productionCrudSlice.productionSettingFilterData)

    return (
        <>
            <Select
                label={label}
                placeholder={placeholder}
                mt={mt}
                size="sm"
                data={dropdownValue}
                autoComplete="off"
                clearable={clearable === false ? false : true}
                searchable={searchable}
                value={value}

                onChange={(e) => {
                    if (module === 'production-setting') {
                        changeValue(e)
                        dispatch(setProductionSettingFilterData({ ...productionSettingFilterData, [name]: e }))
                        document.getElementById(nextField).focus();
                    }
                }}

                withAsterisk={required}
                comboboxProps={props.comboboxProps}
                allowDeselect={allowDeselect === false?false:true}
            />
        </>
    );
}

export default SelectForm;
