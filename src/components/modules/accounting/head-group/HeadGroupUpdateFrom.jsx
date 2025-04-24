import React, { useEffect, useState } from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {IconDeviceFloppy} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
    setEditEntityData,
    setFetching,
    setFormLoading,
    setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

function HeadGroupUpdateFrom() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const [motherData, setMotherData] = useState(null);
    const accountDropdown = getSettingMotherAccountDropdownData()

    const form = useForm({
        initialValues: {
            mother_account_id:'', name:'', code: '', head_group : 'head'
        },
        validate: {
            mother_account_id: isNotEmpty(),
            name: isNotEmpty(),
            code : isNotEmpty()
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    const handleReset = () => {
        form.setValues({
            mother_account_id: entityEditData.mother_account_id ? entityEditData.mother_account_id : '',
            name: entityEditData.name ? entityEditData.name : '',
            code: entityEditData.code ? entityEditData.code : '',
            head_group : entityEditData.head_group ? entityEditData.head_group : 'head',
        })
    }

    useEffect(() => {
        form.setValues({
            mother_account_id: entityEditData.mother_account_id ? entityEditData.mother_account_id : '',
            name: entityEditData.name ? entityEditData.name : '',
            code: entityEditData.code ? entityEditData.code : '',
            head_group : entityEditData.head_group ? entityEditData.head_group : 'head',
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])

    useHotkeys([['alt+n', () => {
        document.getElementById('mother_account_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        handleReset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    return (
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
                        setSaveCreateLoading(true)
                        const value = {
                            url: 'accounting/account-head/' + entityEditData.id,
                            data: form.values
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
                            showNotificationComponent(t("UpdateSuccessfully"), "green");


                            setTimeout(() => {
                                form.reset()
                                dispatch(setInsertType('create'))
                                dispatch(setEditEntityData([]))
                                dispatch(setFetching(true))
                                setSaveCreateLoading(false)
                                navigate('/accounting/head-group', { replace: true })
                            }, 700);
                        }
                    },
                });
            })}>

                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={'white'}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('UpdateAccountHeadGroup')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            calssName={'btnPrimaryBg'}
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
                                    <Grid columns={24}>
                                        <Grid.Col span={'auto'} >
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box >
                                                    <Box mt={'8'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseHeadGroup')}
                                                            label={t('HeadGroup')}
                                                            placeholder={t('ChooseHeadGroup')}
                                                            required={true}
                                                            nextField={'name'}
                                                            name={'mother_account_id'}
                                                            form={form}
                                                            dropdownValue={accountDropdown}
                                                            id={'mother_account_id'}
                                                            searchable={false}
                                                            value={motherData ? String(motherData) : (entityEditData.mother_account_id ? String(entityEditData.mother_account_id) : null)}
                                                            changeValue={setMotherData}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('SubGroupNameValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('Name')}
                                                            required={true}
                                                            nextField={'code'}
                                                            name={'name'}
                                                            form={form}
                                                            id={'name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('AccountCodeValidateMessage')}
                                                            label={t('AccountCode')}
                                                            placeholder={t('AccountCode')}
                                                            required={true}
                                                            name={'code'}
                                                            form={form}
                                                            id={'code'}
                                                            nextField={'status'}
                                                        />
                                                    </Box>
                                                </Box>
                                            </ScrollArea>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>

                        </Box>


                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'method_id'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>

    );
}
export default HeadGroupUpdateFrom;
