import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack,
    ActionIcon, Drawer
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import {
    IconCheck,
    IconDeviceFloppy,
    IconX,
} from "@tabler/icons-react";
import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import { setDropdownLoad, setEntityNewData } from "../../../../store/inventory/crudSlice.js";


function CategoryGroupDrawer(props) {
    const { groupDrawer, setGroupDrawer, saveId } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(true);
    const dispatch = useDispatch();

    useEffect(() => {
        saveId && effectRan.current && (
            setTimeout(() => {
                document.getElementById('drawer_name').focus()
            }, 100),
            effectRan.current = false
        )
    });

    const categoryGroupForm = useForm({
        initialValues: {
            name: '', status: true
        },
        validate: {
            name: hasLength({ min: 2, max: 20 })
        }
    });

    const closeModel = () => {
        setGroupDrawer(false)
    }



    return (
        <>
            <Drawer.Root opened={groupDrawer} position="right" onClose={closeModel} size={'30%'}  >
                <Drawer.Overlay />
                <Drawer.Content>
                    <ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={'gray.1'}>
                        <Flex
                            mih={40}
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <ActionIcon
                                mr={'sm'}
                                radius="xl"
                                color="red.6" size="md"
                                onClick={closeModel}
                            >
                                <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                            </ActionIcon>
                        </Flex>
                        <Box ml={2} mr={2} mb={0}>
                            <form onSubmit={categoryGroupForm.onSubmit((values) => {
                                modals.openConfirmModal({
                                    title: (
                                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                    ),
                                    children: (
                                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                    ),
                                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                                    onCancel: () => console.log('Cancel'),
                                    onConfirm: () => {
                                        setSaveCreateLoading(true)
                                        const value = {
                                            url: 'inventory/category-group',
                                            data: categoryGroupForm.values
                                        }
                                        dispatch(storeEntityData(value))
                                        notifications.show({
                                            color: 'teal',
                                            title: t('CreateSuccessfully'),
                                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                            loading: false,
                                            autoClose: 700,
                                            style: { backgroundColor: 'lightgray' },
                                        });

                                        setTimeout(() => {
                                            categoryGroupForm.reset()
                                            dispatch(setEntityNewData([]))
                                            dispatch(setDropdownLoad(true))
                                            setGroupDrawer(false)
                                        }, 700)
                                    },
                                });
                            })}>
                                <Box mb={0}>
                                    <Grid columns={9} gutter={{ base: 6 }} >
                                        <Grid.Col span={9} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box bg={"white"} >
                                                    <Box pl={`xs`} pr={8} pt={'4'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                                        <Grid>
                                                            <Grid.Col span={8} >
                                                                <Title order={6} pt={'6'}>{t('CreateProductCategoryGroup')}</Title>
                                                            </Grid.Col>
                                                            <Grid.Col span={4}>

                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                                        <ScrollArea h={height - 82} scrollbarSize={2} scrollbars="y" type="never">
                                                            <Box mt={'8'}>
                                                                <InputForm
                                                                    tooltip={t('CategoryGroupNameValidateMessage')}
                                                                    label={t('CategoryGroup')}
                                                                    placeholder={t('CategoryGroup')}
                                                                    required={true}
                                                                    nextField={'drawer_status'}
                                                                    form={categoryGroupForm}
                                                                    name={'name'}
                                                                    mt={8}
                                                                    id={'drawer_name'}
                                                                />
                                                            </Box>

                                                            <Box mt={'xs'}>
                                                                <SwitchForm
                                                                    tooltip={t('Status')}
                                                                    label={t('Status')}
                                                                    nextField={saveId}
                                                                    name={'status'}
                                                                    form={categoryGroupForm}
                                                                    mt={12}
                                                                    id={'drawer_status'}
                                                                    position={'left'}
                                                                    defaultChecked={1}
                                                                />
                                                            </Box>

                                                        </ScrollArea>
                                                    </Box>
                                                    <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
                                                        <Group justify="space-between">
                                                            <Flex
                                                                gap="md"
                                                                justify="center"
                                                                align="center"
                                                                direction="row"
                                                                wrap="wrap"
                                                            >
                                                                <ActionIcon
                                                                    variant="transparent"
                                                                    size="sm"
                                                                    color="red.6"
                                                                    onClick={closeModel}
                                                                    ml={'4'}
                                                                >
                                                                    <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Flex>

                                                            <Group gap={8}>
                                                                <Stack align="flex-start">
                                                                    <>
                                                                        {
                                                                            !saveCreateLoading && isOnline &&
                                                                            <Button
                                                                                size="xs"
                                                                                color={`green.8`}
                                                                                type="submit"
                                                                                id={saveId}
                                                                                leftSection={<IconDeviceFloppy size={16} />}
                                                                            >

                                                                                <Flex direction={`column`} gap={0}>
                                                                                    <Text fz={14} fw={400}>
                                                                                        {t("CreateAndSave")}
                                                                                    </Text>
                                                                                </Flex>
                                                                            </Button>
                                                                        }
                                                                    </>
                                                                </Stack>
                                                            </Group>
                                                        </Group>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </form>
                        </Box>
                    </ScrollArea>

                </Drawer.Content>
            </Drawer.Root >
        </>

    );
}

export default CategoryGroupDrawer;
