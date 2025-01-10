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
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";

function WarehouseUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [categoryGroupData, setCategoryGroupData] = useState(null);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)
    const [formLoad, setFormLoad] = useState('');
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            name: '', location: '', contract_person: '',mobile : '' , email : '' , address :''
        },
        validate: {
            name: isNotEmpty(),
            location: isNotEmpty(),
            contract_person: isNotEmpty(),
            mobile: isNotEmpty(),
            email: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return true;
                }
                return null;
            },
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        form.setValues({
            name: entityEditData.name ? entityEditData.name : '',
            location: entityEditData.location ? entityEditData.location : '',
            email: entityEditData.email ? entityEditData.email : '',
            contract_person: entityEditData.contract_person ? entityEditData.contract_person : '',
            mobile: entityEditData.mobile ? entityEditData.mobile : '',
            address: entityEditData.address ? entityEditData.address : ''
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])


    useHotkeys([['alt+n', () => {
        document.getElementById('name').click()
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
                        onConfirm: async () => {
                            // setSaveCreateLoading(true)
                            const value = {
                                url: 'core/warehouse/' + entityEditData.id,
                                data: values
                            }

                            const resultAction = await dispatch(updateEntityData(value));

                            if (updateEntityData.rejected.match(resultAction)) {
                                const fieldErrors = resultAction.payload.errors;

                                // Check if there are field validation errors and dynamically set them
                                if (fieldErrors) {
                                    const errorObject = {};
                                    Object.keys(fieldErrors).forEach(key => {
                                        errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                                    });
                                    // Display the errors using your form's `setErrors` function dynamically
                                    form.setErrors(errorObject);
                                }
                            } else if (updateEntityData.fulfilled.match(resultAction)) {
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
                                    navigate('/core/warehouse', {replace: true})
                                }, 700)
                            }
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
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('Name')}
                                                        label={t('Name')}
                                                        placeholder={t('Name')}
                                                        required={true}
                                                        nextField={'location'}
                                                        form={form}
                                                        name={'name'}
                                                        id={'name'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('Location')}
                                                        label={t('Location')}
                                                        placeholder={t('Location')}
                                                        required={true}
                                                        nextField={'contract_person'}
                                                        form={form}
                                                        name={'location'}
                                                        id={'location'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('ContractPerson')}
                                                        label={t('ContractPerson')}
                                                        placeholder={t('ContractPerson')}
                                                        required={true}
                                                        nextField={'mobile'}
                                                        form={form}
                                                        name={'contract_person'}
                                                        id={'contract_person'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <PhoneNumber
                                                        tooltip={form.errors.mobile ? form.errors.mobile : t('MobileValidateMessage')}
                                                        label={t('Mobile')}
                                                        placeholder={t('Mobile')}
                                                        required={true}
                                                        nextField={'email'}
                                                        form={form}
                                                        name={'mobile'}
                                                        id={'mobile'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('Email')}
                                                        label={t('Email')}
                                                        placeholder={t('Email')}
                                                        required={false}
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
                                                        required={false}
                                                        nextField={'WarehouseFormSubmit'}
                                                        form={form}
                                                        name={'address'}
                                                        id={'address'}
                                                    />
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

export default WarehouseUpdateForm;
