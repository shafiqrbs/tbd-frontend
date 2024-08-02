import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, rem, Grid, Box, ScrollArea, Text, Title, Flex, Stack, Tooltip, ActionIcon, LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck, IconDeviceFloppy,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/inventory/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import CategoryGroupModal from "./CategoryGroupModal.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function CategoryUpdateForm(props) {
    const { groupCategoryDropdown } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [categoryGroupData, setCategoryGroupData] = useState(null);

    const entityEditData = useSelector((state) => state.inventoryCrudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)
    const [formLoad, setFormLoad] = useState('');
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            parent: '', name: '', status: true
        },
        validate: {
            parent: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            parent: entityEditData.parent ? entityEditData.parent : '',
            name: entityEditData.name ? entityEditData.name : '',
            status: entityEditData.status ? entityEditData.status : ''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])


    useHotkeys([['alt+n', () => {
        document.getElementById('category_group').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('CategoryFormSubmit').click()
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
                        labels: { confirm: 'Submit', cancel: 'Cancel' }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            setSaveCreateLoading(true)
                            const value = {
                                url: 'inventory/category-group/' + entityEditData.id,
                                data: values
                            }
                            dispatch(updateEntityData(value))
                            notifications.show({
                                color: 'teal',
                                title: t('UpdateSuccessfully'),
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 700,
                                style: { backgroundColor: 'lightgray' },
                            });

                            setTimeout(() => {
                                form.reset()
                                dispatch(setInsertType('create'))
                                dispatch(setEditEntityData([]))
                                dispatch(setFetching(true))
                                setSaveCreateLoading(false)
                                navigate('/inventory/category', { replace: true })
                            }, 700)
                        },
                    });
                })}>

                    <Grid columns={9} gutter={{ base: 8 }}>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box bg={"white"} >
                                    <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Title order={6} pt={'6'}>{t('UpdateCategory')}</Title>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Stack right align="flex-end">
                                                    <>
                                                        {
                                                            !saveCreateLoading && isOnline &&
                                                            <Button
                                                                size="xs"
                                                                color={`green.8`}
                                                                type="submit"
                                                                id="CategoryFormSubmit"
                                                                leftSection={<IconDeviceFloppy size={16} />}
                                                            >
                                                                <Flex direction={`column`} gap={0}>
                                                                    <Text fz={14} fw={400}>
                                                                        {t("UpdateAndSave")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>
                                                        }
                                                    </></Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
                                                                    id={'parent'}
                                                                    searchable={false}
                                                                    value={categoryGroupData ? String(categoryGroupData) : (entityEditData.parent ? String(entityEditData.parent) : null)}
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
                                                                    <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={open}>
                                                                        <IconCategoryPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            </Box>

                                                        </Grid.Col>
                                                        {opened &&
                                                            <CategoryGroupModal openedModel={opened} open={open} close={close} />
                                                        }
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
                                                                checked={form.values.status}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Status')}</Grid.Col>
                                                    </Grid>
                                                </Box>
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
                                    FormSubmit={'CategoryFormSubmit'}
                                    Name={'name'}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>

        </>
    )
}

export default CategoryUpdateForm;
