import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";

import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";


function CategoryGroupDrawerForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const adjustment = -28;

    const { saveId, setGroupDrawer } = props

    const categoryGroupForm = useForm({
        initialValues: {
            category_group_name: '', category_group_status: true
        },
        validate: {
            category_group_name: hasLength({ min: 2, max: 20 }),
            category_group_status: isNotEmpty(),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('category_group_name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        categoryGroupForm.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById(saveId).click()
    }]], []);


    return (
        <>
            <Box>
                <form onSubmit={categoryGroupForm.onSubmit((values) => {
                    // console.log(values)
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
                            <Grid.Col span={8} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box bg={"white"} >
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                            <Grid>
                                                <Grid.Col span={8} >
                                                    <Title order={6} pt={'6'}>{t('CreateSetting')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <Stack right align="flex-end">
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
                                                        </></Stack>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                            <ScrollArea h={height - (adjustment ? adjustment : 0)} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box mt={'8'}>
                                                    <InputForm
                                                        tooltip={t('CategoryGroupValidateMessage')}
                                                        label={t('CategoryGroup')}
                                                        placeholder={t('CategoryGroup')}
                                                        required={true}
                                                        nextField={'category_group_status'}
                                                        form={categoryGroupForm}
                                                        name={'category_group_name'}
                                                        mt={8}
                                                        id={'category_group_name'}
                                                    />
                                                </Box>

                                                <Box mt={'xs'}>
                                                    <SwitchForm
                                                        tooltip={t('Status')}
                                                        label={t('Status')}
                                                        nextField={saveId}
                                                        name={'category_group_status'}
                                                        form={categoryGroupForm}
                                                        mt={12}
                                                        id={'category_group_status'}
                                                        position={'left'}
                                                        defaultChecked={1}
                                                    />
                                                </Box>

                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={1} >
                                <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                    <_ShortcutMasterData
                                        adjustment={adjustment}
                                        form={categoryGroupForm}
                                        FormSubmit={saveId}
                                        Name={'category_group'}
                                        inputType="select"
                                    />
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </form>
            </Box>
        </>

    );
}

export default CategoryGroupDrawerForm;
