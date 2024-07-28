import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {setFetching, storeEntityData} from "../../../../store/production/crudSlice.js";

import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";

function _ProductionSettingForm(props) {
    const {settingTypeDropdown, formSubmitId} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [settingTypeData, setSettingTypeData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const adjustment = 0;

    const settingsForm = useForm({
        initialValues: {
            setting_type_id: '', name: '', status: true
        },
        validate: {
            setting_type_id: isNotEmpty(),
            name: hasLength({min: 2, max: 30}),
        }
    });

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
                    modals.openConfirmModal({
                        title: (
                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: {confirm: t('Submit'), cancel: t('Cancel')}, confirmProps: {color: 'red'},
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            setSaveCreateLoading(true)
                            const value = {
                                url: 'production/setting',
                                data: settingsForm.values
                            }
                            dispatch(storeEntityData(value))

                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                loading: false,
                                autoClose: 700,
                                style: {backgroundColor: 'lightgray'},
                            });

                            setTimeout(() => {
                                settingsForm.reset()
                                setSettingTypeData(null)
                                setSaveCreateLoading(false)
                                dispatch(setFetching(true))
                            }, 700)
                        },
                    });
                })}>
                    <Box mb={0}>

                        <Grid columns={9} gutter={{base: 6}}>
                            <Grid.Col span={8}>
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                    <Box bg={"white"}>
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'}
                                             className={'boxBackground borderRadiusAll'}>
                                            <Grid>
                                                <Grid.Col span={8}>
                                                    <Title order={6} pt={'6'}>{t('CreateSetting')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <Stack right align="flex-end">
                                                        <>
                                                            {
                                                                !saveCreateLoading && isOnline &&
                                                                <Button
                                                                    size="xs"
                                                                    color={`green.8`}
                                                                    type="submit"
                                                                    id={formSubmitId}
                                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                                >

                                                                    <Flex direction={`column`} gap={0}>
                                                                        <Text fz={14} fw={400}>
                                                                            {t("CreateAndSave")}
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
                                            <ScrollArea h={height - (adjustment ? adjustment : 0)} scrollbarSize={2}
                                                        scrollbars="y" type="never">
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
                                                        value={settingTypeData}
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
                                                    <Grid gutter={{base: 1}}>
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
                            <Grid.Col span={1}>
                                <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                    <_ShortcutMasterData
                                        adjustment={adjustment}
                                        form={settingsForm}
                                        FormSubmit={formSubmitId}
                                        Name={'setting_type'}
                                        inputType="select"
                                    />
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </form>
            </Box>
        </>

    );
}

export default _ProductionSettingForm;
