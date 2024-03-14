import React from 'react'
import {IconSearch, IconDeviceFloppy, IconRestore, IconPlus} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, Box} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useWindowScroll} from '@mantine/hooks';

function Shortcut(props) {
    const {t, i18n} = useTranslation();

    return (
        <>
            <Box mr={8} mt={'20'}>
                <Tooltip
                    label={t('AltTextNew')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="md"
                        mb={28}
                        pl={'12'}
                        pr={'12'}
                        variant={'light'}
                        color={`indigo`}
                        radius="xl"
                        onClick={(e) => {
                            // props.inputType === 'select' ?
                            // document.getElementById(props.Name).click() :
                            document.getElementById(props.Name).focus()
                        }}
                    >
                        <Flex direction={`column`} align={'center'}>
                            <IconPlus size={16}/>
                        </Flex>
                    </Button>
                </Tooltip>
                <Tooltip
                    label={t('AltTextReset')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="md"
                        mb={28}
                        pl={'12'}
                        pr={'12'}
                        variant={'light'}
                        color={`indigo`}
                        radius="xl"
                        onClick={(e) => {
                            props.form.reset()
                        }}
                    >
                        <Flex direction={`column`} align={'center'}>
                            <IconRestore size={16}/>
                        </Flex>
                    </Button>
                </Tooltip>
                <Tooltip
                    label={t('AltTextSave')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="md"
                        mb={16}
                        pl={'12'}
                        pr={'12'}
                        variant={'filled'}
                        color={`indigo`}
                        radius="xl"
                        onClick={(e) => {
                            document.getElementById(props.FormSubmit).click()
                        }}
                    >
                        <Flex direction={`column`} align={'center'}>
                            <IconDeviceFloppy size={16}/>
                        </Flex>
                    </Button>
                </Tooltip>

            </Box>

        </>
    )
}

export default Shortcut