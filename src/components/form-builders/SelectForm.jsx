import React from "react";
import {
    Tooltip,
    Select
} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";

function SelectForm(props) {
    const {
        label,
        placeholder,
        required,
        nextField,
        name,
        form,
        tooltip,
        mt,
        id,
        dropdownValue,
        searchable,
        value,
        changeValue,
        clearable,
        allowDeselect
    } = props

    return (
        <>
            {
                form &&
                <Tooltip
                    label={tooltip}
                    opened={(name in form.errors) && !!form.errors[name]}
                    px={16}
                    py={2}
                    position="top-end"
                    bg={`red.4`}
                    c={'white'}
                    withArrow
                    offset={2}
                    zIndex={999}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Select
                        id={id}
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        size="sm"
                        data={dropdownValue}
                        autoComplete="off"
                        clearable={clearable === false ? false : true}
                        searchable={searchable}
                        {...form.getInputProps(name)}
                        value={value}
                        onChange={(e) => {
                            changeValue(e)
                            form.setFieldValue(name, e)
                            nextField && document.getElementById(nextField).focus();
                        }}
                        withAsterisk={required}
                        comboboxProps={props.comboboxProps}
                        allowDeselect={allowDeselect === false?false:true}
                    />
                </Tooltip>
            }
        </>
    );
}

export default SelectForm;
