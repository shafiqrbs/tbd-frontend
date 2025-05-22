import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack, rem
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {IconCheck, IconDeviceFloppy} from "@tabler/icons-react";
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
import getAccountHeadMasterDropdownData from "../../../global-hook/dropdown/getAccountHeadMasterDropdownData";
import useAccountHeadDropdownData from "../../../global-hook/dropdown/account/getAccountHeadAllDropdownData";
import {notifications} from "@mantine/notifications";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage";


function HeadDomainForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [motherAccount, setMotherAccount] = useState(null);
    const [parentHead, setParentHead] = useState(null);
    const [headGroup, setHeadGroup] = useState(null);
    const [mode, setMode] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    const motherAccountDropdown = getSettingMotherAccountDropdownData()
//    const accountDropdown = getAccountHeadMasterDropdownData();
    const accountHeadDropdownData = getAccountHeadMasterDropdownData(reloadTrigger);


    const form = useForm({
        initialValues: {
            mother_account_id: '',parent_id: '', name: '', code: '', head_group : '',mode : ''
        },
        validate: {
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
        const data ={
            url: "accounting/account-head-master",
            data: values
        };
        const resultAction = await dispatch(storeEntityData(data));
        if (storeEntityData.rejected.match(resultAction)) {
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
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload ?.status === 200 && resultAction.payload?.data?.data?.id) {
                showNotificationComponent(resultAction.payload?.data?.message, "green");
                form.reset();
                setMotherAccount(null);
                setParentHead(null);
                setHeadGroup(null);
                setMode(null);
                setSaveCreateLoading(false);
                setReloadTrigger(true)
                dispatch(setFetching(true));
            } else {
                showNotificationComponent(resultAction.payload?.data?.message, "red");
            }
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
                                                            required={false}
                                                            nextField={'parent_id'}
                                                            name={'mother_account_id'}
                                                            form={form}
                                                            dropdownValue={motherAccountDropdown}
                                                            id={'mother_account_id'}
                                                            searchable={false}
                                                            value={motherAccount}
                                                            changeValue={setMotherAccount}
                                                        />
                                                    </Box>
                                                    <Box mt={'8'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAccountHead')}
                                                            label={t('AccountHead')}
                                                            placeholder={t('ChooseAccountHead')}
                                                            required={false}
                                                            nextField={'head_group'}
                                                            name={'parent_id'}
                                                            form={form}
                                                            dropdownValue={accountHeadDropdownData}
                                                            id={'parent_id'}
                                                            searchable={true}
                                                            value={parentHead}
                                                            changeValue={setParentHead}
                                                        />

                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAccountHead')}
                                                            label={t('HeadGroup')}
                                                            placeholder={t('HeadGroup')}
                                                            required={true}
                                                            nextField={'name'}
                                                            name={'head_group'}
                                                            form={form}
                                                            dropdownValue={['head', 'sub-head', 'ledger']}
                                                            id={'head_group'}
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
                                                            nextField={'mode'}
                                                            form={form}
                                                            id={'code'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('ChooseAccountHead')}
                                                            label={t('HeadMode')}
                                                            placeholder={t('HeadMode')}
                                                            required={true}
                                                            nextField=''
                                                            name={'mode'}
                                                            form={form}
                                                            dropdownValue={['Debit', 'Credit']}
                                                            id={'mode'}
                                                            defaultValue="Debit"
                                                            allowDeselect={false}
                                                            value={mode}
                                                            changeValue={setMode}
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