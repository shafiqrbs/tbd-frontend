import React from "react";
import {
    Tooltip,
    TextInput
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "../../assets/css/InputField.module.css";

function InputForm(props) {

    const { label, placeholder, required, nextField, name, form, tooltip, mt, id, disabled, type, leftSection, rightSection } = props

    const { t, i18n } = useTranslation();

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
                        type={type}
                        id={id}
                        classNames={inputCss}
                        size="sm"
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        disabled={disabled}
                        autoComplete="off"
                        {...form.getInputProps(name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                nextField && (nextField === 'EntityFormSubmit' || nextField === 'cheque_date') ?
                                    document.getElementById(nextField).click() :
                                    document.getElementById(nextField).focus()
                            }],
                        ])}
                        leftSection={leftSection}
                        rightSection={
                            form.values[name] ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.1`}
                                    c={'red.3'}
                                >
                                    <IconX color='var( --theme-remove-color)'  size={16} opacity={0.5} onClick={() => {
                                        form.setFieldValue(name, '');
                                    }} />
                                </Tooltip>
                                :
                                <Tooltip
                                    label={tooltip}
                                    px={16}
                                    py={2}
                                    withArrow
                                    position={"left"}
                                    c={'black'}
                                    bg={`gray.1`}
                                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                >
                                    {rightSection ? rightSection : <IconInfoCircle size={16} opacity={0.5} />}
                                </Tooltip>
                        }
                        withAsterisk={required}
                        inputWrapperOrder={['label', 'input', 'description']}
                    />
                </Tooltip>
            }
        </>
    );
}

export default InputForm;
