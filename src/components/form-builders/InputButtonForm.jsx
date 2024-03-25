import React from "react";
import {
    Tooltip,
    TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconInfoCircle, IconUserCircle, IconX} from "@tabler/icons-react";
import {getHotkeyHandler} from "@mantine/hooks";

function InputButtonForm(props) {

    const {label, placeholder, required, nextField, name, form, tooltip, mt, id, disabled} = props

    const {t, i18n} = useTranslation();

    return (
        <>
            {
                form &&
                    <TextInput
                        type={props.type}
                        id={id}
                        size="sm"
                        placeholder={placeholder}
                        mt={mt}
                        disabled={disabled}
                        autoComplete="off"
                        {...form.getInputProps(name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                nextField === 'EntityFormSubmit'?
                                document.getElementById(nextField).click() :
                                    document.getElementById(nextField).focus()
                            }],
                        ])}
                        rightSection={props.rightSection}
                        rightSectionWidth={props.rightSectionWidth}
                        leftSection={props.leftSection}
                        withAsterisk={required}
                    />

            }
        </>
    );
}

export default InputButtonForm;
