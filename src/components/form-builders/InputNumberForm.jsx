import React from "react";
import {
    Tooltip,
    TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconInfoCircle, IconX} from "@tabler/icons-react";
import {getHotkeyHandler} from "@mantine/hooks";

function InputNumberForm(props) {

    const {label, placeholder, required, nextField, name, form, tooltip, mt, id, disabled,closeIcon} = props

    const {t, i18n} = useTranslation();

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
                    <TextInput
                        type='number'
                        id={id}
                        size="sm"
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        disabled={disabled}
                        autoComplete="off"
                        {...form.getInputProps(name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                nextField === 'EntityFormSubmit'? document.getElementById(nextField).click() : document.getElementById(nextField).focus()
                            }],
                        ])}
                        leftSection={props.leftSection}
                        rightSection={
                            form.values[name] && closeIcon ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.1`}
                                    c={'red.3'}
                                >
                                    <IconX color={`red.5`} size={16} opacity={0.5} onClick={() => {
                                        form.setFieldValue(name, '');
                                    }}/>
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
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    { props.rightIcon ?  props.rightIcon : <IconInfoCircle size={16} opacity={0.5}/> }
                                </Tooltip>
                        }
                        withAsterisk={required}
                    />
                </Tooltip>
            }
        </>
    );
}

export default InputNumberForm;
