import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button, rem, Grid, Box, ScrollArea, Group, Text, Title, Flex, Stack, LoadingOverlay,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck, IconDeviceFloppy, IconPencilBolt
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/inventory/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import {storeEntityData} from "../../../../store/inventory/crudSlice";

function CategoryGroupUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);

    const entityEditData = useSelector((state) => state.inventoryCrudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const form = useForm({
        initialValues: {
            name: '', status: true
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
        }
    });

    useEffect(() => {
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            name: entityEditData.name ? entityEditData.name : '',
            status: entityEditData.status ? entityEditData.status : ''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData])


    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
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

            <Grid columns={9} gutter={{base:8}}>
                <Grid.Col span={8} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <Box bg={"white"} >
                            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                <Grid>
                                    <Grid.Col span={6} h={54}>
                                        <Title order={6} mt={'xs'} pl={'6'}>{t('UpdateCategoryGroup')}</Title>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Stack right  align="flex-end">
                                            <>
                                                {
                                                    !saveCreateLoading && isOnline &&
                                                    <Button
                                                        size="xs"
                                                        color={`red.6`}
                                                        type="submit"
                                                        mt={4}
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={16}/>}
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
                            <Box pl={`xs`} pr={'xs'} mt={'xs'}  className={'borderRadiusAll'}>
                                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                    <Box>
                                        <LoadingOverlay visible={formLoading} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('CategoryGroupNameValidateMessage')}
                                                label={t('CategoryGroupName')}
                                                placeholder={t('CategoryGroupName')}
                                                required={true}
                                                nextField={'status'}
                                                form={form}
                                                name={'name'}
                                                mt={8}
                                                id={'name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{base:1}}>
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
                                                <Grid.Col span={6} fz={'sm'} pt={'6'}>Status</Grid.Col>
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
    )
}

export default CategoryGroupUpdateForm;
