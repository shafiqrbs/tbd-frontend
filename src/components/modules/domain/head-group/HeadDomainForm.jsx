import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {IconDeviceFloppy} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
    setFetching,
    setValidationData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getSettingMotherAccountDropdownData from "../../../global-hook/dropdown/getSettingMotherAccountDropdownData";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";

function HeadDomainForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [headGroup, setHeadGroup] = useState(null);

    const motherAccountDropdown = getSettingMotherAccountDropdownData()

    const form = useForm({
        initialValues: {
            mother_account_id: '', name: '', code: '', head_group : 'head'
        },
        validate: {
            mother_account_id: isNotEmpty(),
            name: isNotEmpty(),
            code : isNotEmpty()
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('mother_account_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const handleSubmit = async (values) => {
        setSaveCreateLoading(true);
        dispatch(setValidationData(false));

        try {
            const action = await dispatch(storeEntityData({
                url: "accounting/account-head",
                data: values
            }));

            if (action.payload?.status === 200) {
                showNotificationComponent(t("Account head created successfully"), "green");
                form.reset();
            } else {
                showNotificationComponent(t("Something went wrong"), "red");
            }
        } catch (error) {
            console.error("Account head creation error:", error);
            showNotificationComponent(t("Request failed"), "red");
        } finally {
            dispatch(setFetching(true));
            setSaveCreateLoading(false);
        }
    };

    const openConfirmationModal = (values) => {
        modals.openConfirmModal({
            title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => handleSubmit(values),
        });
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(openConfirmationModal)}>
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
                                                            name={'mother_account_id'}
                                                            form={form}
                                                            dropdownValue={motherAccountDropdown}
                                                            id={'mother_account_id'}
                                                            searchable={false}
                                                            value={headGroup}
                                                            changeValue={setHeadGroup}
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

export default HeadDomainForm;