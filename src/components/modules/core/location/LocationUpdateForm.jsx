import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    Button, rem, Grid, Box, ScrollArea, Group, Text, Title, Flex, Stack, Tooltip, ActionIcon, LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck, IconDeviceFloppy, IconPencilBolt, IconPlus
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFormLoading, setInsertType,
    updateEntityData, setFetching, storeEntityData
} from "../../../../store/core/crudSlice.js";


import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function LocationUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [categoryGroupData, setCategoryGroupData] = useState(null);

    const entityEditData = useSelector((state) => state.inventoryCrudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)
    const [formLoad, setFormLoad] = useState('');
    const navigate = useNavigate();


    // useEffect(() => {

    //     const value = {
    //         url: 'inventory/select/group-category',
    //     }

    //     dispatch(getCategoryDropdown(value))
    //     dispatch(setDropdownLoad(false))
    // }, [dropdownLoad]);

    const form = useForm({
        initialValues: {
            location_type: '', location_name: '', status: ''
        },
        validate: {
            location_type: isNotEmpty(),
            location_name: hasLength({ min: 2, max: 20 }),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            location_type: entityEditData.location_type ? entityEditData.location_type : '',
            location_name: entityEditData.location_name ? entityEditData.location_name : '',
            status: entityEditData.status ? entityEditData.status : ''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])


    useHotkeys([['alt+n', () => {
        document.getElementById('location_type').click()
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
                                navigate('/core/location', { replace: true });
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
                                                <Title order={6} pt={'6'}>{t('UpdateLocation')}</Title>
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
                                                                id="EntityFormSubmit"
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
                                                <Box mt={'8'}>
                                                    <SelectForm
                                                        tooltip={t('LocationType')}
                                                        label={t('LocationType')}
                                                        placeholder={t('LocationType')}
                                                        required={true}
                                                        nextField={'location_name'}
                                                        name={'location_type'}
                                                        form={form}
                                                        dropdownValue={['test1', 'test2']}
                                                        id={'location_type'}
                                                        searchable={false}
                                                        value={categoryGroupData}
                                                        changeValue={setCategoryGroupData}
                                                    />
                                                </Box>

                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('LocationName')}
                                                        label={t('LocationName')}
                                                        placeholder={t('LocationName')}
                                                        required={true}
                                                        nextField={'status'}
                                                        form={form}
                                                        name={'location_name'}
                                                        id={'location_name'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('Status')}
                                                                label=''
                                                                nextField={'EntityFormSubmit'}
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

export default LocationUpdateForm;
