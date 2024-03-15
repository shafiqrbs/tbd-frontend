import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button, rem, Grid, Box, ScrollArea, Group, Text, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck, IconPencilBolt, IconPlus
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/inventory/crudSlice.js";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import CategoryGroupModal from "./CategoryGroupModal.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function CategoryUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [opened, {open, close}] = useDisclosure(false);
    const [categoryGroupData, setCategoryGroupData] = useState(null);

    const entityEditData = useSelector((state) => state.inventoryCrudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const groupCategoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.groupCategoryDropdown)
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let groupCategoryDropdown = groupCategoryDropdownData && groupCategoryDropdownData.length > 0 ?
        groupCategoryDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {

        const value = {
            url: 'inventory/select/group-category',
        }

        dispatch(getCategoryDropdown(value))
        dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);

    const form = useForm({
        initialValues: {
            parent: '', name: '', status: true
        },
        validate: {
            parent: isNotEmpty(),
            name: hasLength({min: 2, max: 20}),
        }
    });

    useEffect(() => {
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
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData])


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
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
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
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CategoryInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group mr={'md'} pos={`absolute`} right={0} gap={0}>
                                <>
                                    {!saveCreateLoading && isOnline &&
                                        <Button
                                            size="xs"
                                            color={`indigo.6`}
                                            type="submit"
                                            mt={4}
                                            mr={'xs'}
                                            id="CategoryFormSubmit"
                                            leftSection={<IconPencilBolt size={16}/>}
                                        >

                                            <Flex direction={`column`} gap={0}>
                                                <Text fz={12} fw={400}>
                                                    {t("EditAndSave")}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    }
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box h={1} bg={`gray.3`}></Box>
                <Box m={'md'}>
                    <Grid columns={24}>
                        <Grid.Col span={'auto'}>
                            <ScrollArea h={height} scrollbarSize={2} type="never">
                                <Box pb={'md'}>
                                    <Grid gutter={{base: 6}}>
                                        <Grid.Col span={10}>
                                            <SelectForm
                                                tooltip={t('ChooseCategoryGroup')}
                                                label={t('CategoryGroup')}
                                                placeholder={t('ChooseCategoryGroup')}
                                                required={true}
                                                nextField={'name'}
                                                name={'parent'}
                                                form={form}
                                                dropdownValue={groupCategoryDropdown}
                                                mt={8}
                                                id={'category_group'}
                                                searchable={false}
                                                value={categoryGroupData ? String(categoryGroupData) : (entityEditData.parent ? String(entityEditData.parent) : null)}
                                                changeValue={setCategoryGroupData}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={2}>
                                            <Button
                                                mt={32}
                                                color={'gray'}
                                                variant={'outline'}
                                                onClick={open}>
                                                <IconPlus size={12} opacity={0.5}
                                                /></Button>
                                        </Grid.Col>
                                        {opened &&
                                            <CategoryGroupModal openedModel={opened} open={open} close={close}/>
                                        }
                                    </Grid>
                                    <InputForm
                                        tooltip={t('CategoryNameValidateMessage')}
                                        label={t('CategoryName')}
                                        placeholder={t('CategoryName')}
                                        required={true}
                                        nextField={'status'}
                                        form={form}
                                        name={'name'}
                                        mt={8}
                                        id={'name'}
                                    />

                                    <SwitchForm
                                        tooltip={t('Status')}
                                        label={t('Status')}
                                        nextField={'CategoryFormSubmit'}
                                        name={'status'}
                                        form={form}
                                        mt={12}
                                        id={'status'}
                                        position={'left'}
                                        checked={form.values.status}
                                    />

                                </Box>
                            </ScrollArea>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Shortcut
                                form={form}
                                FormSubmit={'CategoryFormSubmit'}
                                Name={'category_group'}
                                inputType={'select'}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box>
    )
}

export default CategoryUpdateForm;
