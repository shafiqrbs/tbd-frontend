import React from 'react'
import {IconSearch, IconDeviceFloppy, IconRestore, IconPlus} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, Box} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useWindowScroll} from '@mantine/hooks';

function Shortcut(props) {
    const {t, i18n} = useTranslation();

    return (
        <>
            <Box mr={8}>
                <Tooltip
                    label={t('CrtlfText')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="lg"
                        mt={16}
                        mb={16}
                        pl={'16'}
                        pr={'16'}
                        variant={'light'}
                        color={`indigo`}
                        radius="xl"
                        /*onClick={()=>{
                          document.getElementById('UserSearchKeyword').focus();
                        }}*/
                    >
                        <Flex direction={`column`} align={'center'}>
                            <IconSearch size={16}/>
                            <Text fz={8}>
                                {t('alt+f')}
                            </Text>
                        </Flex>
                    </Button>
                </Tooltip>

                <Tooltip
                    label={t('CrtlnText')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="lg"
                        mb={16}
                        pl={'16'}
                        pr={'16'}
                        variant={'light'}
                        color={`indigo`}
                        radius="xl"
                        onClick={(e) => {
                            document.getElementById(props.Name).focus()
                        }}
                    >
                        <Flex direction={`column`} align={'center'}>
                            <IconPlus size={16}/>
                            <Text fz={8}>
                                {t('alt+n')}
                            </Text>
                        </Flex>
                    </Button>
                </Tooltip>
                <Tooltip
                    label={t('CrtlrText')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="lg"
                        mb={16}
                        pl={'16'}
                        pr={'16'}
                        variant={'light'}
                        color={`indigo`}
                        radius="xl"
                        onClick={(e) => {
                            props.form.reset()
                        }}
                    >
                        <Flex direction={`column`} align={'center'}>

                            <IconRestore size={16}/>
                            <Text fz={8}>
                                {t('alt+r')}
                            </Text>
                        </Flex>
                    </Button>
                </Tooltip>
                <Tooltip
                    label={t('CrtlsText')}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={'indigo'}
                    bg={`gray.1`}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Button
                        size="lg"
                        mb={16}
                        pl={'16'}
                        pr={'16'}
                        variant={'filled'}
                        color={`indigo`}
                        radius="xl"
                        onClick={(e) => {
                            document.getElementById(props.FormSubmit).click()
                        }}
                    >
                        <Flex direction={`column`} align={'center'}>

                            <IconDeviceFloppy size={16}/>
                            <Text fz={8}>
                                {t('alt+s')}
                            </Text>
                        </Flex>
                    </Button>
                </Tooltip>

            </Box>

        </>
    )
}

export default Shortcut