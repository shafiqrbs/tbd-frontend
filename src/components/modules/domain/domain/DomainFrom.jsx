import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Group, Text, Title, Stack, Checkbox,Tooltip
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { setFetching, setValidationData, storeEntityData } from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getSettingBusinessModelDropdownData from "../../../global-hook/dropdown/getSettingBusinessModelDropdownData.js";
import getSettingModulesDropdownData from "../../../global-hook/dropdown/getSettingModulesDropdownData.js";

function DomainForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const businessModelDropdown = getSettingBusinessModelDropdownData()
    const modulesData = getSettingModulesDropdownData()

    const [businessModelId, setBusinessModelId] = useState(null)
    const [moduleChecked, setModuleChecked] = useState([])
    const controlledModuleCheckBox = (type, value) => {
        if (type) {
            setModuleChecked(prevChecked => [...prevChecked, value]);
        } else {
            setModuleChecked(prevChecked =>
                prevChecked.filter(checkedValue => checkedValue !== value)
            );
        }
    };

    const form = useForm({
        initialValues: {
            business_model_id:'',company_name: '', mobile: '', alternative_mobile: '', name: '', username: '', address: '', email: ''
        },
        validate: {
            business_model_id: isNotEmpty(),
            company_name: hasLength({ min: 2, max: 20 }),
            name: hasLength({ min: 2, max: 20 }),
            username: hasLength({ min: 2, max: 20 }),
            mobile: (value) => {
                const isNotEmpty = !    !value.trim().length;
                const isDigitsOnly = /^\d+$/.test(value.trim());
                if (isNotEmpty && isDigitsOnly) {
                    return false;
                } else {
                    return true;
                }
            },
            alternative_mobile: (value) => {
                if (value) {
                    const isNotEmpty = !!value.trim().length;
                    const isDigitsOnly = /^\d+$/.test(value.trim());

                    if (isNotEmpty && isDigitsOnly) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            },
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('company_name').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
            <Grid columns={9} gutter={{ base: 8 }}>
                <Grid.Col span={8} >
                    <form onSubmit={form.onSubmit((values) => {
                        form.values['modules'] = moduleChecked
                        dispatch(setValidationData(false))
                        modals.openConfirmModal({
                            centered: true,
                            title: (
                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                            ),
                            children: (
                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                            ),
                            labels: { confirm: 'Submit', cancel: 'Cancel' }, confirmProps: { color: 'red.5' },
                            onCancel: () => console.log('Cancel'),
                            onConfirm: () => {
                                const value = {
                                    url: 'domain/global',
                                    data: values
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
                                    setBusinessModelId(null)
                                    setModuleChecked([])
                                    dispatch(setFetching(true))
                                }, 700)
                            },
                        });
                    })}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >

                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}  >
                                    <Grid>
                                        <Grid.Col span={6} >
                                            <Title order={6} pt={'6'}>{t('CreateNewDomain')}</Title>
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
                                                <Box pb={'md'}>
                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('BusinessModel')}
                                                            label={t('BusinessModel')}
                                                            placeholder={t('ChooseBusinessModel')}
                                                            required={true}
                                                            nextField={'company_name'}
                                                            name={'business_model_id'}
                                                            form={form}
                                                            dropdownValue={businessModelDropdown}
                                                            mt={8}
                                                            id={'business_model_id'}
                                                            searchable={false}
                                                            value={businessModelId}
                                                            changeValue={setBusinessModelId}
                                                            clearable={false}
                                                            allowDeselect={false}
                                                        />
                                                    </Box>
                                                    <Box mt={'8'}>
                                                        <InputForm
                                                            tooltip={t('CompanyStoreNameValidateMessage')}
                                                            label={t('CompanyStoreName')}
                                                            placeholder={t('CompanyStoreName')}
                                                            required={true}
                                                            nextField={'mobile'}
                                                            name={'company_name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'company_name'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
                                                            tooltip={t('MobileValidateMessage')}
                                                            label={t('Mobile')}
                                                            placeholder={t('Mobile')}
                                                            required={true}
                                                            nextField={'alternative_mobile'}
                                                            name={'mobile'}
                                                            form={form}
                                                            id={'mobile'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
                                                            tooltip={t('AlternativeMobileValidateMessage')}
                                                            label={t('AlternativeMobile')}
                                                            placeholder={t('AlternativeMobile')}
                                                            required={false}
                                                            nextField={'email'}
                                                            name={'alternative_mobile'}
                                                            form={form}
                                                            mt={8}
                                                            id={'alternative_mobile'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('InvalidEmail')}
                                                            label={t('Email')}
                                                            placeholder={t('Email')}
                                                            required={false}
                                                            nextField={'name'}
                                                            name={'email'}
                                                            form={form}
                                                            mt={8}
                                                            id={'email'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('ClientNameValidateMessage')}
                                                            label={t('ClientName')}
                                                            placeholder={t('ClientName')}
                                                            required={true}
                                                            nextField={'username'}
                                                            name={'name'}
                                                            form={form}
                                                            id={'name'}
                                                            mt={8}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>

                                                        <InputForm
                                                            tooltip={t('DomainUserValidateMessage')}
                                                            label={t('DomainUser')}
                                                            placeholder={t('DomainUser')}
                                                            required={true}
                                                            nextField={'address'}
                                                            name={'username'}
                                                            form={form}
                                                            mt={8}
                                                            id={'username'}
                                                        />
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <TextAreaForm
                                                            tooltip={t('Address')}
                                                            label={t('Address')}
                                                            placeholder={t('Address')}
                                                            required={false}
                                                            nextField={'isNotEmpty'}
                                                            name={'address'}
                                                            form={form}
                                                            mt={8}
                                                            id={'address'}
                                                        />
                                                    </Box>

                                                        <Box mt={'8'}>
                                                            <Checkbox.Group
                                                                label={t('Modules')}
                                                                description={t('selectModulesForAccess')}
                                                                value={moduleChecked}
                                                                onChange={setModuleChecked}
                                                            >
                                                                <Group mt="xs">
                                                                    {
                                                                        modulesData.map((module, index) => (
                                                                            <Tooltip key={index} mt={'8'} label={module.name}>
                                                                                <Checkbox
                                                                                    value={module.slug}
                                                                                    label={module.name}
                                                                                />
                                                                            </Tooltip>
                                                                        ))
                                                                    }
                                                                </Group>
                                                            </Checkbox.Group>
                                                        </Box>
                                                </Box>
                                            </ScrollArea>
                                        </Grid.Col>
                                    </Grid>
                                </Box>

                            </Box>
                        </Box>
                    </form>
                </Grid.Col>
                <Grid.Col span={1} >
                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                        <Shortcut
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'company_name'}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Box>

    );
}
export default DomainForm;
