import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateInput } from '@mantine/dates';
import {TextInput, Tooltip} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";
import {IconInfoCircle, IconX} from "@tabler/icons-react";
import React from "react";
import {useTranslation} from "react-i18next";


// dayjs.extend(customParseFormat);

function DatePickerForm(props) {
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
        sm,
        lg,
        closeIcon
    } = props
    const { t, i18n } = useTranslation();

    return (
        <>

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
                <DateInput
                    clearable
                    defaultValue={new Date()}
                    size="sm"
                    minDate={new Date()}
                    label={label}
                    placeholder={placeholder}
                    mt={mt}
                    autoComplete="off"
                    {...form.getInputProps(name)}
                    onKeyDown={getHotkeyHandler([
                        ['Enter', (e) => {
                            nextField === 'EntityFormSubmit'?
                                document.getElementById(nextField).click() :
                                document.getElementById(nextField).focus()
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
        </>
    );
}

export default DatePickerForm;