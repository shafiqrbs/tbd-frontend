import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, rem, Grid, Box, ScrollArea, Text, Title, Flex, Stack, LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck, IconDeviceFloppy
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import {
    setEditEntityData,
    setFormLoading, setInsertType,
    updateEntityData, setFetching
} from "../../../../store/production/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function _ParticularUpdateForm(props) {
    const { settingTypeDropdown, formSubmitId,setParticularFetching } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const navigate = useNavigate();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [settingTypeData, setSettingTypeData] = useState(null);

    const entityEditData = useSelector((state) => state.productionCrudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)
    const [formLoad, setFormLoad] = useState('');

    const settingsForm = useForm({
        initialValues: {
            setting_type_id: entityEditData.setting_type_id,
            name: entityEditData.name,
            status: entityEditData.status
        },
        validate: {
            setting_type_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 30 }),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])

    useEffect(() => {

        settingsForm.setValues({
            setting_type_id: entityEditData.setting_type_id ? entityEditData.setting_type_id : '',
            name: entityEditData.name ? entityEditData.name : '',
            status: entityEditData.status
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch])


    useHotkeys([['alt+n', () => {
        document.getElementById('setting_type').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        settingsForm.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById(formSubmitId).click()
    }]], []);


    return (
        <>
            <Box>
                <form onSubmit={settingsForm.onSubmit((values) => {
                    values['particular_type_id'] = values['setting_type_id']
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
                                url: 'inventory/particular/' + entityEditData.id,
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
                                settingsForm.reset()
                                dispatch(setInsertType('create'))
                                dispatch(setEditEntityData([]))
                                setParticularFetching(true)
                                setSaveCreateLoading(false)
                                navigate('/inventory/particular');
                            }, 700)
                        },
                    });
                })}>

                    <Grid columns={9} gutter={{ base: 8 }}>
                        <Grid.Col span={8}>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                <Box bg={"white"}>
                                    <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'}
                                        className={'boxBackground borderRadiusAll'}>
                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Title order={6} pt={'6'}>{t('UpdateSetting')}</Title>
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
                                                                id={formSubmitId}
                                                                leftSection={<IconDeviceFloppy size={16} />}
                                                            >
                                                                <Flex direction={`column`} gap={0}>
                                                                    <Text fz={14} fw={400}>
                                                                        {t("UpdateAndSave")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>
                                                        }
                                                    </>
                                                </Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                <LoadingOverlay visible={formLoad} zIndex={1000}
                                                    overlayProps={{ radius: "sm", blur: 2 }} />
                                                <Box mt={'8'}>
                                                    <SelectForm
                                                        tooltip={t('SettingType')}
                                                        label={t('SettingType')}
                                                        placeholder={t('SettingType')}
                                                        required={true}
                                                        nextField={'setting_name'}
                                                        name={'setting_type_id'}
                                                        form={settingsForm}
                                                        dropdownValue={settingTypeDropdown}
                                                        id={'setting_type'}
                                                        searchable={false}
                                                        value={settingTypeData ? String(settingTypeData) : (entityEditData.setting_type_id ? String(entityEditData.setting_type_id) : null)}
                                                        changeValue={setSettingTypeData}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('SettingName')}
                                                        label={t('SettingName')}
                                                        placeholder={t('SettingName')}
                                                        required={true}
                                                        nextField={'status'}
                                                        form={settingsForm}
                                                        name={'name'}
                                                        id={'setting_name'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('Status')}
                                                                label=''
                                                                nextField={formSubmitId}
                                                                name={'status'}
                                                                form={settingsForm}
                                                                color="red"
                                                                id={'status'}
                                                                position={'left'}
                                                                checked={settingsForm.values.status == 1 ? true : false}
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
                        <Grid.Col span={1}>
                            <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                <Shortcut
                                    form={settingsForm}
                                    FormSubmit={formSubmitId}
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

export default _ParticularUpdateForm;
