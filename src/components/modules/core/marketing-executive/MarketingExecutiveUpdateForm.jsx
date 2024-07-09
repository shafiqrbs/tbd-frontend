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
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";

function MarketingExecutiveUpdateForm() {
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



    const { executiveId } = useParams();

    useEffect(() => {
        if (executiveId) {
            dispatch(setEditEntityData(`core/marketing-executive/${executiveId}`))
            dispatch(setFormLoading(true));
        }
    }, [executiveId, dispatch]);

    // useEffect(() => {

    //     const value = {
    //         url: 'inventory/select/group-category',
    //     }

    //     dispatch(getCategoryDropdown(value))
    //     dispatch(setDropdownLoad(false))
    // }, [dropdownLoad]);

    const form = useForm({
        initialValues: {
            name: '',
            mobile: '',
            email: '',
            address: '',
            designation: '', status: true
        },
        validate: {
            name: hasLength({ min: 2, max: 20 }),
            mobile: isNotEmpty(),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            name: entityEditData.name ? entityEditData.name : '',
            mobile: entityEditData.mobile ? entityEditData.mobile : '',
            email: entityEditData.email ? entityEditData.email : '',
            address: entityEditData.address ? entityEditData.address : '',
            designation: entityEditData.designation ? entityEditData.designation : '',
            status: entityEditData.status ? entityEditData.status : ''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData, executiveId])


    useHotkeys([['alt+n', () => {
        document.getElementById('name').focus()
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
                    dispatch(updateEntityData(values))
                        .then(() => {
                            navigate('core/marketing-executive', { replace: true });
                            dispatch(setInsertType('create'));
                        })
                        .catch((error) => {

                        })
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
                                                <Title order={6} pt={'6'}>{t('UpdateExecutive')}</Title>
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
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('Name')}
                                                    label={t('Name')}
                                                    placeholder={t('Name')}
                                                    required={true}
                                                    nextField={'mobile'}
                                                    form={form}
                                                    name={'name'}
                                                    id={'name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <PhoneNumber
                                                    tooltip={t('MobileValidateMessage')}
                                                    label={t('Mobile')}
                                                    placeholder={t('Mobile')}
                                                    required={true}
                                                    nextField={'email'}
                                                    name={'mobile'}
                                                    form={form}
                                                    id={'mobile'} />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('Email')}
                                                    label={t('Email')}
                                                    placeholder={t('Email')}
                                                    required={true}
                                                    nextField={'address'}
                                                    form={form}
                                                    name={'email'}
                                                    id={'email'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('Address')}
                                                    label={t('Address')}
                                                    placeholder={t('Address')}
                                                    required={true}
                                                    nextField={'designation'}
                                                    form={form}
                                                    name={'address'}
                                                    id={'address'}
                                                />
                                            </Box>
                                            <Box mt={'8'}>
                                                <SelectForm
                                                    tooltip={t('Designation')}
                                                    label={t('Designation')}
                                                    placeholder={t('Designation')}
                                                    required={true}
                                                    nextField={'status'}
                                                    name={'designation'}
                                                    form={form}
                                                    dropdownValue={['test1', 'test2']}
                                                    id={'designation'}
                                                    searchable={false}
                                                    value={categoryGroupData}
                                                    changeValue={setCategoryGroupData}
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

export default MarketingExecutiveUpdateForm;
