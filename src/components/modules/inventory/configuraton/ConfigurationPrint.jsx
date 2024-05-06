import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex, Switch,
    Grid, Box, ScrollArea, Group, Text, Title, Modal, Stack, Tooltip, ActionIcon, Checkbox
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconXboxX,
    IconPlus,
    IconUsersGroup

} from "@tabler/icons-react";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import {
    setFormLoading,
    setValidationData,
    getShowEntityData,
    updateEntityData,

} from "../../../../store/inventory/crudSlice.js";
import getSettingBusinessModelDropdownData from "../../../global-hook/dropdown/getSettingBusinessModelDropdownData.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import ImageUploadDropzone from "../../../form-builders/ImageUploadDropzone.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

function ConfigurationForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 132; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [businessModelData, setBusinessModelData] = useState(null);
    const [testModelOpend, setTestModelOpend] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);
    const [checked, setChecked] = useState(false);
    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData)

    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const executiveDropdownData = useSelector((state) => state.utilitySlice.executiveDropdownData)
    let businessModelDropdown = getSettingBusinessModelDropdownData();
    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    let locationDropdown = locationDropdownData && locationDropdownData.length > 0 ? locationDropdownData.map((type, index) => { return ({ 'label': type.name, 'value': String(type.id) }) }) : []
    let executiveDropdown = executiveDropdownData && executiveDropdownData.length > 0 ? executiveDropdownData.map((type, index) => { return ({ 'label': type.name, 'value': String(type.id) }) }) : []
    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, []);

    const form = useForm({
        initialValues: {
            business_model_id: '',
            vat_percent: '',
            ait_percent: '',
            address: '',
            invoice_comment: ''
        },
        validate: {
            business_model_id: isNotEmpty(),
            vat_percent: (value) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            ait_percent: (value) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
        }
    });


    useEffect(() => {
        if (validation) {
            validationMessage.business_model_id && (form.setFieldError('business_model_id', true));
            validationMessage.vat_percent && (form.setFieldError('vat_percent', true));
            validationMessage.ait_percent && (form.setFieldError('ait_percent', true));
            validationMessage.address && (form.setFieldError('address', true));
            validationMessage.invoice_comment && (form.setFieldError('invoice_comment', true));
            dispatch(setValidationData(false))
            setTimeout(() => {
                // setSaveCreateLoading(false)
            }, 700)
        }

        if (validationMessage.message === 'success') {
            notifications.show({
                color: 'teal',
                title: t('UpdateSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                // setSaveCreateLoading(false)
            }, 700)
        }
    }, [validation, validationMessage]);

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])

    useEffect(() => {

        form.setValues({
            business_model_id: showEntityData.business_model_id ? showEntityData.business_model_id : '',
            vat_percent: showEntityData.vat_percent ? showEntityData.vat_percent : '',
            ait_percent: showEntityData.ait_percent ? showEntityData.ait_percent : '',
            address: showEntityData.address ? showEntityData.address : '',
            invoice_comment: showEntityData.invoice_comment ? showEntityData.invoice_comment : '',
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [dispatch, setFormData])

    // console.log(form.values)

    useHotkeys([['alt+n', () => {
        document.getElementById('BusinessModel').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('VendorFormSubmit').click()
    }]], []);


    return (
        <>
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
                        labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            const value = {
                                url: 'core/customer',
                                data: values
                            }
                            dispatch(storeEntityData(value))
                        },
                    });
                })}>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={7} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box bg={"white"} >
                                    <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Grid>
                                            <Grid.Col h={54}>
                                                <Title order={6} mt={'xs'} pl={'6'}>{t('Core')}</Title>
                                            </Grid.Col>

                                        </Grid>
                                    </Box>
                                    <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                {
                                                    Object.keys(form.errors).length > 0 && validationMessage != 0 &&
                                                    <Alert variant="light" color="red" radius="md" title={
                                                        <List withPadding size="sm">
                                                            {validationMessage.name && <List.Item>{t('NameValidateMessage')}</List.Item>}
                                                            {validationMessage.mobile && <List.Item>{t('MobileValidateMessage')}</List.Item>}
                                                            {validationMessage.alternative_mobile && <List.Item>{t('AlternativeMobile')}</List.Item>}
                                                        </List>
                                                    }></Alert>
                                                }
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('NameValidateMessage')}
                                                        label={t('Name')}
                                                        placeholder={t('CustomerName')}
                                                        required={true}
                                                        nextField={'CustomerGroup'}
                                                        name={'name'}
                                                        form={form}
                                                        mt={0}
                                                        id={'CustomerName'}
                                                    />
                                                </Box>

                                                <Box mt={'xs'} mb={'xs'}>
                                                    <TextAreaForm
                                                        tooltip={t('Address')}
                                                        label={t('Address')}
                                                        placeholder={t('Address')}
                                                        required={false}
                                                        nextField={'Status'}
                                                        name={'address'}
                                                        form={form}
                                                        mt={8}
                                                        id={'Address'}
                                                    />
                                                </Box>

                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box bg={"white"} >
                                    <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Grid>
                                            <Grid.Col h={54}>
                                                <Title order={6} mt={'xs'} pl={'6'}>{t('Print')}</Title>
                                            </Grid.Col>

                                        </Grid>
                                    </Box>
                                    <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                {
                                                    Object.keys(form.errors).length > 0 && validationMessage != 0 &&
                                                    <Alert variant="light" color="red" radius="md" title={
                                                        <List withPadding size="sm">
                                                            {validationMessage.name && <List.Item>{t('NameValidateMessage')}</List.Item>}
                                                            {validationMessage.mobile && <List.Item>{t('MobileValidateMessage')}</List.Item>}
                                                            {validationMessage.alternative_mobile && <List.Item>{t('AlternativeMobile')}</List.Item>}
                                                        </List>
                                                    }></Alert>
                                                }
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PrintLogo')}
                                                                label=''
                                                                nextField={'printWithOutstanding'}
                                                                name={'print_logo'}
                                                                form={form}
                                                                color="red"
                                                                id={'printLogo'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('PrintLogo')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PrintWithOutstanding')}
                                                                label=''
                                                                nextField={'posPrint'}
                                                                name={'print_with_outstanding'}
                                                                form={form}
                                                                color="red"
                                                                id={'printWithOutstanding'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PrintWithOutstanding')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('POSPrint')}
                                                                label=''
                                                                nextField={'printHeader'}
                                                                name={'pos_print'}
                                                                form={form}
                                                                color="red"
                                                                id={'posPrint'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('POSPrint')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PrintHeader')}
                                                                label=''
                                                                nextField={'printInvoiceTitle'}
                                                                name={'print_header'}
                                                                form={form}
                                                                color="red"
                                                                id={'printHeader'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PrintHeader')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PrintInvoiceTitle')}
                                                                label=''
                                                                nextField={'printFooter'}
                                                                name={'print_invoice_title'}
                                                                form={form}
                                                                color="red"
                                                                id={'printInvoiceTitle'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PrintInvoiceTitle')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PrintFooter')}
                                                                label=''
                                                                nextField={'printPowered'}
                                                                name={'print_footer'}
                                                                form={form}
                                                                color="red"
                                                                id={'printFooter'}
                                                                position={'left'}
                                                                defaultChecked={0}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PrintFooter')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PrintPowered')}
                                                                label=''
                                                                nextField={'PrintFooterText'}
                                                                name={'print_powered'}
                                                                form={form}
                                                                color="red"
                                                                id={'printPowered'}
                                                                position={'left'}
                                                                defaultChecked={0}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PrintPowered')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'} >
                                                    <TextAreaForm
                                                        tooltip={t('PrintFooterText')}
                                                        label={t('PrintFooterText')}
                                                        placeholder={t('PrintFooterText')}
                                                        required={false}
                                                        nextField={'logo'}
                                                        name={'address'}
                                                        form={form}
                                                        mt={8}
                                                        id={'PrintFooterText'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <ImageUploadDropzone
                                                        label={t('Logo')}
                                                        id={'Logo'}
                                                        name={'logo'}
                                                        form={form}
                                                        required={false}
                                                        placeholder={t('DropLogoHere')}
                                                        nextField={'RemoveImage'}

                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('RemoveImage')}
                                                                label=''
                                                                nextField={'InvoiceWidth'}
                                                                name={'remove_image'}
                                                                form={form}
                                                                color="red"
                                                                id={'RemoveImage'}
                                                                position={'left'}
                                                                defaultChecked={0}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('RemoveImage')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('InvoiceWidth')}
                                                        label={t('InvoiceWidth')}
                                                        placeholder={t('InvoiceWidth')}
                                                        required={false}
                                                        nextField={'InvoiceHeight'}
                                                        name={'invoice_width'}
                                                        form={form}
                                                        mt={0}
                                                        id={'InvoiceWidth'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('InvoiceHeight')}
                                                        label={t('InvoiceHeight')}
                                                        placeholder={t('InvoiceHeight')}
                                                        required={false}
                                                        nextField={'bodyFontSize'}
                                                        name={'invoice_height'}
                                                        form={form}
                                                        mt={0}
                                                        id={'InvoiceHeight'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <SelectForm
                                                        tooltip={t('BodyFontSize')}
                                                        label={t('BodyFontSize')}
                                                        placeholder={t('ChooseFontSize')}
                                                        required={false}
                                                        nextField={'bodyBorderColor'}
                                                        name={'body_font_size'}
                                                        form={form}
                                                        dropdownValue={["Family", "Local"]}
                                                        mt={8}
                                                        id={'BodyFontSize'}
                                                        searchable={false}
                                                        value={customerGroupData}
                                                        changeValue={setCustomerGroupData}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('BodyBorderColor')}
                                                        label={t('BodyBorderColor')}
                                                        placeholder={t('BodyBorderColor')}
                                                        required={false}
                                                        nextField={'bodyBorderWidth'}
                                                        name={'body_border_color'}
                                                        form={form}
                                                        mt={0}
                                                        id={'bodyBorderColor'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('BodyBorderWidth')}
                                                        label={t('BodyBorderWidth')}
                                                        placeholder={t('BodyBorderWidth')}
                                                        required={false}
                                                        nextField={'marginLeft'}
                                                        name={'body_border_width'}
                                                        form={form}
                                                        mt={0}
                                                        id={'bodyBorderWidth'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('MarginLeft')}
                                                        label={t('MarginLeft')}
                                                        placeholder={t('MarginLeft')}
                                                        required={false}
                                                        nextField={'marginTop'}
                                                        name={'margin_left'}
                                                        form={form}
                                                        mt={0}
                                                        id={'marginLeft'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'} mb={'xs'}>
                                                    <InputForm
                                                        tooltip={t('MarginTop')}
                                                        label={t('marginTop')}
                                                        placeholder={t('marginTop')}
                                                        required={false}
                                                        nextField={''}
                                                        name={'margin_top'}
                                                        form={form}
                                                        mt={0}
                                                        id={'marginTop'}
                                                    />
                                                </Box>
                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box bg={"white"} >
                                    <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Grid>
                                            <Grid.Col span={6} h={54}>
                                                <Title order={6} mt={'xs'} pl={'6'}>{t('Configuration')}</Title>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Stack right align="flex-end">
                                                    <>
                                                        {
                                                            !saveCreateLoading && isOnline &&
                                                            <Button
                                                                size="xs"
                                                                color={`red.6`}
                                                                type="submit"
                                                                mt={4}
                                                                id="EntityFormSubmit"
                                                                leftSection={<IconDeviceFloppy size={16} />}
                                                            >

                                                                <Flex direction={`column`} gap={0}>
                                                                    <Text fz={12} fw={400}>
                                                                        {t("CreateAndSave")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>
                                                        }
                                                    </></Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                        <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                            <Box>
                                                {
                                                    Object.keys(form.errors).length > 0 && validationMessage != 0 &&
                                                    <Alert variant="light" color="red" radius="md" title={
                                                        <List withPadding size="sm">
                                                            {validationMessage.name && <List.Item>{t('NameValidateMessage')}</List.Item>}
                                                            {validationMessage.mobile && <List.Item>{t('MobileValidateMessage')}</List.Item>}
                                                            {validationMessage.alternative_mobile && <List.Item>{t('AlternativeMobile')}</List.Item>}
                                                        </List>
                                                    }></Alert>
                                                }
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('NameValidateMessage')}
                                                        label={t('Name')}
                                                        placeholder={t('CustomerName')}
                                                        required={true}
                                                        nextField={'CustomerGroup'}
                                                        name={'name'}
                                                        form={form}
                                                        mt={0}
                                                        id={'CustomerName'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'} >
                                                    <TextAreaForm
                                                        tooltip={t('Address')}
                                                        label={t('Address')}
                                                        placeholder={t('Address')}
                                                        required={false}
                                                        nextField={'Status'}
                                                        name={'address'}
                                                        form={form}
                                                        mt={8}
                                                        id={'Address'}
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
    );
}
export default ConfigurationForm;
