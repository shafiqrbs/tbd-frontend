import React from "react";
import {
    PasswordInput,
    Tooltip,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getHotkeyHandler } from "@mantine/hooks";

function PasswordInputForm(props) {
    const { label, placeholder, required, nextField, name, form, tooltip, mt, id, value } = props
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
                    zIndex={0}
                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                >
                    <PasswordInput
                        id={id}
                        size="sm"
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        {...form.getInputProps(name && name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById(nextField).focus()
                            }],
                        ])}
                        autoComplete={'off'}
                        /*rightSection={
                             form.values[name] ?
                                <Tooltip
                                    label={t("Close")}
                                    withArrow
                                    bg={`red.5`}
                                >
                                    <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
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
                        }*/
                        withAsterisk={required}
                        inputWrapperOrder={['label', 'input', 'description']}
                    />
                </Tooltip>

            }
        </>
    );
}

export default PasswordInputForm;
