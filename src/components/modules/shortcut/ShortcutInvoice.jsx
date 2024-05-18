import React from 'react'
import {IconSearch, IconDeviceFloppy, IconRestore, IconPlus} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, Box,Center,Stack} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useWindowScroll} from '@mantine/hooks';
import {useOutletContext} from "react-router-dom";

function ShortcutInvoice(props) {
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const formHeight = mainAreaHeight - 54; //TabList height 104
    return (
        <>
            <Stack
                h={formHeight}
                bg="var(--mantine-color-body)"
                align="center"
            >
                <Center>
                <Tooltip
                    label={t('AltTextNew')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'white'}
                    bg={`red.5`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >

                        <Button
                            size="md"
                            mb={28}
                            pl={'12'}
                            pr={'12'}
                            variant={'light'}
                            color={`red.5`}
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
                </Center>
                <Center>
                <Tooltip
                    label={t('AltTextReset')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'white'}
                    bg={`red.5`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >

                    <Button
                        size="md"
                        mb={28}
                        pl={'12'}
                        pr={'12'}
                        variant={'light'}
                        color={`red`}
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
                </Center>
                <Center>
                <Tooltip
                    label={t('AltTextSave')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'white'}
                    bg={`red.5`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="md"
                        mb={16}
                        pl={'12'}
                        pr={'12'}
                        variant={'filled'}
                        color={`red`}
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
                </Center>

            </Stack>
        </>
    )
}

export default ShortcutInvoice