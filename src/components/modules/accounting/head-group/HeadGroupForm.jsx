import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Alert, List, Stack, SimpleGrid, Image, Tooltip
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
    setEntityNewData,
    setFetching,
    setValidationData,
    storeEntityData,
    storeEntityDataWithFile
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm";
import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData";
import useAccountHeadDropdownData from "../../../global-hook/dropdown/account/getAccountHeadAllDropdownData.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

function HeadGroupForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [motherData, setMotherData] = useState(null);

    const accountDropdown = getSettingMotherAccountDropdownData()

    const [reloadTrigger, setReloadTrigger] = useState(false);
    const accountHeadDropdownData = useAccountHeadDropdownData(reloadTrigger, 'account-head');



    const form = useForm({
        initialValues: {
            parent_id: '', name: '', code: '', status: true, head_group : 'account-head'
        },
        validate: {
            parent_id: isNotEmpty(),
            name: isNotEmpty(),
            code : isNotEmpty()
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('parent_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                dispatch(setValidationData(false))
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: async () => {
                        setSaveCreateLoading(true)

                        const data = {
                            url: "accounting/account-head",
                            data: form.values
                        };

                        try {
                            const action = await dispatch(storeEntityData(data));
                            const payload = action.payload;

                            if (payload?.status === 200 && payload?.data?.data?.id) {
                                showNotificationComponent(t("Account head created successfully"), "green");
                            } else {
                                showNotificationComponent(t("Something went wrong"), "red");
                            }
                        } catch (error) {
                            console.error("Error updating domain status", error);
                            showNotificationComponent(t("Request failed"), "red");
                        } finally {
                            form.reset()
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
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
                                            <Title order={6} pt={'6'}>{t('CreateHeadGroup')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            className={'btnPrimaryBg'}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}>
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("CreateAndSave")}
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
                                                            tooltip={t('ChooseMotherAccount')}
                                                            label={t('MotherAccount')}
                                                            placeholder={t('ChooseMotherAccount')}
                                                            required={true}
                                                            nextField={'name'}
                                                            name={'parent_id'}
                                                            form={form}
                                                            dropdownValue={accountHeadDropdownData}
                                                            id={'parent_id'}
                                                            searchable={false}
                                                            value={motherData}
                                                            changeValue={setMotherData}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('NameValidateMessage')}
                                                            label={t('Name')}
                                                            placeholder={t('Name')}
                                                            required={true}
                                                            nextField={'code'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
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
                                                    <Box mt={'xs'} >
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
export default HeadGroupForm;
