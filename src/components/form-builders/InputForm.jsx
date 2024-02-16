import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    rem,
    Tooltip,
    TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconInfoCircle, IconX} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useViewportSize} from "@mantine/hooks";
import {hasLength, useForm} from "@mantine/form";

function InputForm(props) {

    const iconStyle = {width: rem(12), height: rem(12)};
    const {t, i18n} = useTranslation();
    return (
        <>
            <Tooltip
                label={t('NameValidateMessage')}
                opened={true}
                px={20}
                py={3}
                position="top-end"
                color="red"
                withArrow
                offset={2}
                zIndex={0}
            >
                <TextInput
                    size="sm"
                    label={t('Shafiq')}
                    placeholder={t('CustomerName')}
                    withAsterisk
                    rightSection={
                        <Tooltip
                            label={t("NameValidateMessage")}
                            withArrow
                            bg={`blue.5`}
                        >
                            <IconInfoCircle size={16} opacity={0.5}/>
                        </Tooltip>

                    }
                />
            </Tooltip>
        </>
    );
}

export default InputForm;
