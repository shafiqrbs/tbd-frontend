import React from "react";
import {Tooltip, Switch} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";

function SwitchForm(props) {
    const {label, nextField, name, form, tooltip, mt, id, position, defaultChecked,checked} = props
    return (
        <>
            {
                form &&
                <Tooltip
                    label={tooltip}
                    opened={(name in form.errors) && !!form.errors[name]}
                    px={20}
                    py={3}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={0}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Switch
                        checked={checked}
                        defaultChecked={defaultChecked}
                        labelPosition={position}
                        mt={mt}
                        label={label}
                        size="md"
                        radius="sm"
                        id={id}
                        {...form.getInputProps(name)}
                        onKeyDown={getHotkeyHandler([
                            ['Enter', (e) => {
                                document.getElementById(nextField).focus();
                            }],
                        ])}
                    />
                </Tooltip>

            }
        </>
    );
}

export default SwitchForm;
