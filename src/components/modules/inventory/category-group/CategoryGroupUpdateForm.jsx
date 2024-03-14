import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button, rem, Grid, Box, ScrollArea, Group, Text, Title, Flex,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck, IconPencilBolt
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

function CategoryGroupUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104

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
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CategoryGroupInformation')}</Title>
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

export default CategoryGroupUpdateForm;
