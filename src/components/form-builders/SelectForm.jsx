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
        changeValue
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
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={0}
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
                        clearable
                        searchable={searchable}
                        {...form.getInputProps(name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById(nextField).focus();
                            }],
                        ])}
                        value={value}
                        onChange={(e) => {
                            changeValue(e)
                            form.setFieldValue(name, e)
                        }}
                        withAsterisk={required}
                    />
                </Tooltip>
            }
        </>
    );
}

export default SelectForm;
