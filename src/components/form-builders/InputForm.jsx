import React from "react";
import {
    Tooltip,
    TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconInfoCircle, IconX} from "@tabler/icons-react";
import {getHotkeyHandler} from "@mantine/hooks";

function InputForm(props) {

    const {label, placeholder, required, nextField, name, form, tooltip, mt, id} = props

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
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={999}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <TextInput
                        id={id}
                        size="sm"
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        autoComplete="off"
                        {...form.getInputProps(name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById(nextField).focus();
                            }],
                        ])}
                        rightSection={
                            form.values[name] ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.5`}
                                >
                                    <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
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
                                    c={'indigo'}
                                    bg={`gray.1`}
                                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                                >
                                    <IconInfoCircle size={16} opacity={0.5}/>
                                </Tooltip>
                        }
                        withAsterisk={required}
                    />
                </Tooltip>
            }
        </>
    );
}

export default InputForm;
