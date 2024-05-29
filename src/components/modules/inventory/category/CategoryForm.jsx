import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack, Tooltip, ActionIcon, Popover
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus, IconUserCog, IconCategoryPlus,
    IconCategory,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { getCustomerDropdown } from "../../../../store/core/utilitySlice";
import { setDropdownLoad, setFetching, storeEntityData } from "../../../../store/inventory/crudSlice.js";
import { getGroupCategoryDropdown } from "../../../../store/inventory/utilitySlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import CategoryGroupModal from "./CategoryGroupModal.jsx";


function CategoryForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);
    const [categoryGroupData, setCategoryGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const groupCategoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.groupCategoryDropdown)
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let groupCategoryDropdown = groupCategoryDropdownData && groupCategoryDropdownData.length > 0 ?
        groupCategoryDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/group-category',
        }
        dispatch(getGroupCategoryDropdown(value))
        dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);

    const form = useForm({
        initialValues: {
            parent: '', name: '', status: true
        },
        validate: {
            parent: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('category_group').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <>
            <Box>
                <form onSubmit={form.onSubmit((values) => {
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
                                data: form.values
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
                                form.reset()
                                setCategoryGroupData(null)
                                setSaveCreateLoading(false)
                                dispatch(setFetching(true))
                            }, 700)
                        },
                    });
                })}>
                    <Grid columns={9} gutter={{ base: 8 }}>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box bg={"white"} >
                                    <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Grid>
                                            <Grid.Col span={8} h={54}>
                                                <Title order={6} mt={'xs'} pl={'6'}>{t('CreateProductCategory')}</Title>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Stack right align="flex-end">
                                                    <>
                                                        {
                                                            !saveCreateLoading && isOnline &&
                                                            <Button
                                                                size="xs"
                                                                color={`red.6`}
                                                                type="submit"
                                                                mt={4}
                                                                id="EntityFormSubmit"
                                                                leftSection={<IconDeviceFloppy size={16} />}
                                                            >

                                                                <Flex direction={`column`} gap={0}>
                                                                    <Text fz={12} fw={400}>
                                                                        {t("CreateAndSave")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>
                                                        }
                                                    </></Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box pl={`md`} pr={'md'} mt={'xs'} className={'borderRadiusAll'}>
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={11} >
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('ChooseCategoryGroup')}
                                                                label={t('CategoryGroup')}
                                                                placeholder={t('ChooseCategoryGroup')}
                                                                required={true}
                                                                nextField={'name'}
                                                                name={'parent'}
                                                                form={form}
                                                                dropdownValue={groupCategoryDropdown}
                                                                id={'category_group'}
                                                                searchable={false}
                                                                value={categoryGroupData}
                                                                changeValue={setCategoryGroupData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                multiline
                                                                ta={'center'}
                                                                bg={'orange.8'}
                                                                offset={{ crossAxis: '-95', mainAxis: '5' }}
                                                                withArrow
                                                                transitionProps={{ duration: 200 }}
                                                                label={t('CreateCategoryGroup')}
                                                            >
                                                                <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings">

                                                                    <IconCategory style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('CategoryNameValidateMessage')}
                                                    label={t('CategoryName')}
                                                    placeholder={t('CategoryName')}
                                                    required={true}
                                                    nextField={'status'}
                                                    form={form}
                                                    name={'name'}
                                                    id={'name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Status')}
                                                            label=''
                                                            nextField={'CategoryFormSubmit'}
                                                            name={'status'}
                                                            form={form}
                                                            color="red"
                                                            id={'status'}
                                                            position={'left'}
                                                            defaultChecked={1}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Status')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={1} >
                            <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                <Shortcut
                                    form={form}
                                    FormSubmit={'EntityFormSubmit'}
                                    Name={'name'}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </>

    );
}

export default CategoryForm;
