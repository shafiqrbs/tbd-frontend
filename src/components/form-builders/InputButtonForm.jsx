import React from "react";
import {
    Tooltip,
    TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getHotkeyHandler} from "@mantine/hooks";
import inputCss from "../../assets/css/InputField.module.css";

function InputButtonForm(props) {
    const {label, placeholder, required, nextField, name, form, tooltip, mt, id, disabled} = props

    const {t, i18n} = useTranslation();
    const handleChange = (event) => {
        // Handle form state update
        form?.getInputProps(name).onChange(event);
    
        // Call custom onChange if provided
        if (props.onChange) {
          props.onChange(event);
        }
      };
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
                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                >
                    <TextInput
                        type={props.type}
                        id={id}
                        label={label}
                        classNames={inputCss}
                        size="sm"
                        placeholder={placeholder}
                        mt={mt}
                        disabled={disabled}
                        autoComplete="off"
                        {...form.getInputProps(name)}
                        onChange={handleChange}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                nextField === 'EntityFormSubmit'? document.getElementById(nextField).click() : document.getElementById(nextField).focus()
                            }],
                        ])}
                        rightSection={props.rightSection}
                        rightSectionWidth={34}
                        leftSection={props.leftSection}
                        withAsterisk={required}

                    />
                </Tooltip>
            }
        </>
    );
}

export default InputButtonForm;
