import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack, Tooltip, ActionIcon, Popover
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus, IconUserCog, IconCategoryPlus,
    IconCategory,
    IconFirstAidKit,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, storeEntityData } from "../../../../store/core/crudSlice.js";

import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";


function WarehouseForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const { adjustment } = props

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

    useHotkeys([['alt+n', () => {
        document.getElementById('name').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('WarehouseFormSubmit').click()
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
                        labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: async () => {
                            // setSaveCreateLoading(true)
                            const value = {
                                url: 'core/warehouse',
                                data: form.values
                            }
                            const resultAction = await dispatch(storeEntityData(value));

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
                                notifications.show({
                                    color: 'teal',
                                    title: t('CreateSuccessfully'),
                                    icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                    loading: false,
                                    autoClose: 700,
                                    style: {backgroundColor: 'lightgray'},
                                });

                                setTimeout(() => {
                                    form.reset()
                                    dispatch(setFetching(true))
                                }, 700)
                            }
                        },
                    });
                })}>
                    <Box mb={0}>

                        <Grid columns={9} gutter={{ base: 6 }} >
                            <Grid.Col span={8} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box bg={"white"} >
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                            <Grid>
                                                <Grid.Col span={8} >
                                                    <Title order={6} pt={'6'}>{t('CreateWarehouse')}</Title>
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
                                                                    id="WarehouseFormSubmit"
                                                                    leftSection={<IconDeviceFloppy size={16} />}
                                                                >

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
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
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
                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={1} >
                                <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                    <_ShortcutMasterData
                                        adjustment={adjustment}
                                        form={form}
                                        FormSubmit={'WarehouseFormSubmit'}
                                        Name={'name'}
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

export default WarehouseForm;
