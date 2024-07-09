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


function MarketingExecutiveForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);
    const [categoryGroupData, setCategoryGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [createCategoryGroupModal, setCategoryGroupModal] = useState(false)

    const { adjustment } = props

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
                    console.log(values)
                    modals.openConfirmModal({
                        title: (
                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            setSaveCreateLoading(true)
                            const value = {
                                url: 'inventory/category-group',
                                data: form.values
                            }
                            dispatch(storeEntityData(value))

                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 700,
                                style: { backgroundColor: 'lightgray' },
                            });

                            setTimeout(() => {
                                form.reset()
                                setCategoryGroupData(null)
                                setSaveCreateLoading(false)
                                dispatch(setFetching(true))
                            }, 700)
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
                                                    <Title order={6} pt={'6'}>{t('CreateExecutive')}</Title>
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
                                                                    id="EntityFormSubmit"
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
                                                                nextField={'CategoryFormSubmit'}
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
                                    <_ShortcutMasterData
                                        adjustment={adjustment}
                                        form={form}
                                        FormSubmit={'EntityFormSubmit'}
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

export default MarketingExecutiveForm;
