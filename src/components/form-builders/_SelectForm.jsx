import { React, forwardRef } from "react";
import {
    Tooltip,
    Select
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";

function _SelectForm(props, ref) {
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
                    bg={`red.4`}
                    c={'white'}
                    withArrow
                    offset={2}
                    zIndex={0}
                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                >
                    <Select
                        ref={ref}
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
                        value={value}
                        onChange={(e) => {
                            changeValue(e)
                            form.setFieldValue(name, e)
                            document.getElementById(nextField).focus();
                        }}
                        withAsterisk={required}
                        comboboxProps={props.comboboxProps}
                    />
                </Tooltip>
            }
        </>
    );
}

export default forwardRef(_SelectForm);
