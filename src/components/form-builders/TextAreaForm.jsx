import React from "react";
import {
    Tooltip,
    Textarea
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconInfoCircle, IconX} from "@tabler/icons-react";
import {getHotkeyHandler} from "@mantine/hooks";

function TextAreaForm(props) {
    const {label,placeholder,required,nextField,name,form,tooltip,mt,id} = props
    const {t, i18n} = useTranslation();
    return (
        <>
            {
                form &&
                <Tooltip
                    label={tooltip}
                    opened={ (name in form.errors) && !!form.errors[name]}
                    px={20}
                    py={3}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={0}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                <Textarea
                    id={id}
                    size="sm"
                    label={label}
                    placeholder={placeholder}
                    withAsterisk={required}
                    mt={mt}
                    {...form.getInputProps(name && name)}
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
                                <IconX color={`red`} size={16} opacity={0.5} onClick={()=>{
                                    form.setFieldValue(name, '');
                                }}/>
                            </Tooltip>
                            :
                            <Tooltip
                                label={tooltip}
                                withArrow
                                bg={`blue.5`}
                            >
                                <IconInfoCircle size={16} opacity={0.5}/>
                            </Tooltip>
                    }
                />
                </Tooltip>

                }
            </>
    );
}

export default TextAreaForm;
