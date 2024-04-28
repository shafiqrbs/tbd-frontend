import React from "react";
import { Tooltip, Switch, rem, useMantineTheme } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconX, IconCheck } from "@tabler/icons-react";
function SwitchForm(props) {
    const { label, nextField, name, form, tooltip, mt, id, position, defaultChecked, checked } = props
    const theme = useMantineTheme();
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
                    bg={`red.4`}
                    c={'white'}
                    withArrow
                    offset={2}
                    zIndex={0}
                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                >
                    <Switch
                        checked={checked}
                        defaultChecked={defaultChecked}
                        labelPosition={position}
                        mt={mt}
                        color="red"
                        label={label}
                        size="md"
                        thumbIcon={
                            checked ? (
                                <IconCheck
                                    style={{ width: rem(12), height: rem(12) }}
                                    color={theme.colors.teal[6]}
                                    stroke={3}
                                />
                            ) : (
                                <IconCheck
                                    style={{ width: rem(12), height: rem(12) }}
                                    color={theme.colors.red[6]}
                                    stroke={3}
                                />
                            )
                        }
                        radius="xs"
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
