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
    const height = mainAreaHeight - 130; //TabList height 104
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
    useEffect(() => {
        // dispatch(getShowEntityData('inventory/config'))
    }, []);

    const form = useForm({
        initialValues: {
            business_model_id: '',
            address: '',
            sku_wearhouse: '',
            sku_category: '',
            vat_percent: '',
            is_vat_enabled: '',
            ait_percent: '',
            is_ait_enabled: '',
            production_type: '',
            invoice_comment: '',
            logo: '',
            remove_image: '',
            invoice_print_logo: '',
            print_outstanding: '',
            pos_print: '',
            is_print_header: '',
            is_invoice_title: '',
            is_print_footer: '',
            is_powered: '',
            print_footer_text: '',
            body_font_size: '',
            invoice_height: '',
            invoice_width: '',
            border_color: '',
            border_width: '',
            print_left_margin: '',
            print_top_margin: '',
            custom_invoice: '',
            bonus_from_stock: '',
            is_unit_price: '',
            zero_stock: '',
            stock_item: '',
            custom_invoice_print: '',
            is_stock_history: '',
            condition_sales: '',
            store_ledger: '',
            is_marketing_executive: '',
            //fuel_station: '',
            tlo_commission: '',
            sales_return: '',
            sr_commission: '',
            due_sales_without_customer: ''

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
                        // dispatch(storeEntityData(value))
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
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never" >
                                        <Box>
                                            {
                                                Object.keys(form.errors).length > 0 && validationMessage != 0 &&
                                                <Alert variant="light" color="red" radius="md" title={
                                                    <List withPadding size="sm">
                                                        {validationMessage.business_model_id && <List.Item>{t('ValidateMessage')}</List.Item>}
                                                        {validationMessage.vat_percent && <List.Item>{t('ValidateMessage')}</List.Item>}
                                                        {validationMessage.ait_percent && <List.Item>{t('ValidateMessage')}</List.Item>}
                                                        {validationMessage.address && <List.Item>{t('ValidateMessage')}</List.Item>}
                                                        {validationMessage.invoice_comment && <List.Item>{t('ValidateMessage')}</List.Item>}
                                                    </List>
                                                }></Alert>
                                            }
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('BusinessModel')}
                                                    label={t('BusinessModel')}
                                                    placeholder={t('ChooseBusinessModel')}
                                                    required={false}
                                                    nextField={'address'}
                                                    name={'business_model_id'}
                                                    form={form}
                                                    dropdownValue={["Family", "Local"]}
                                                    mt={8}
                                                    id={'business_model_id'}
                                                    searchable={false}
                                                    value={customerGroupData}
                                                    changeValue={setCustomerGroupData}
                                                />
                                            </Box>


                                            <Box mt={'xs'} >
                                                <TextAreaForm
                                                    tooltip={t('Address')}
                                                    label={t('Address')}
                                                    placeholder={t('Address')}
                                                    required={false}
                                                    nextField={'sku_wearhouse'}
                                                    name={'address'}
                                                    form={form}
                                                    mt={8}
                                                    id={'address'}
                                                />
                                            </Box>

                                            <Box mt={'xs'}>
                                                <Text fz="sm">{t("StockFormat")}</Text>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Warehouse')}
                                                            label=''
                                                            nextField={'sku_category'}
                                                            name={'sku_wearhouse'}
                                                            form={form}
                                                            color="red"
                                                            id={'sku_wearhouse'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('Warehouse')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Category')}
                                                            label=''
                                                            nextField={'vat_percent'}
                                                            name={'sku_category'}
                                                            form={form}
                                                            color="red"
                                                            id={'sku_category'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('Category')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'md'} mb={'md'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('VatPercent')}
                                                            label={t('VatPercent')}
                                                            placeholder={t('VatPercent')}
                                                            required={false}
                                                            nextField={'is_vat_enabled'}
                                                            name={'vat_percent'}
                                                            form={form}
                                                            mt={0}
                                                            id={'vat_percent'}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} mt={'lg'}>
                                                        <Box mt={'xs'}>
                                                            <Grid columns={6} gutter={{ base: 1 }}>
                                                                <Grid.Col span={2}>
                                                                    <SwitchForm
                                                                        tooltip={t('VatEnabled')}
                                                                        label=''
                                                                        nextField={'ait_percent'}
                                                                        name={'is_vat_enabled'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'is_vat_enabled'}
                                                                        position={'left'}
                                                                        defaultChecked={0}
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('VatEnabled')}
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'md'} mb={'md'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('AITPercent')}
                                                            label={t('AITPercent')}
                                                            placeholder={t('AITPercent')}
                                                            required={false}
                                                            nextField={'is_ait_enabled'}
                                                            name={'ait_percent'}
                                                            form={form}
                                                            mt={0}
                                                            id={'ait_percent'}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} mt={'lg'}>
                                                        <Box mt={'xs'}>
                                                            <Grid columns={6} gutter={{ base: 1 }}>
                                                                <Grid.Col span={2}>
                                                                    <SwitchForm
                                                                        tooltip={t('AitEnabled')}
                                                                        label=''
                                                                        nextField={'production_type'}
                                                                        name={'is_ait_enabled'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'is_ait_enabled'}
                                                                        position={'left'}
                                                                        defaultChecked={0}
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('AITEnabled')}
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'md'} mb={'md'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6}>
                                                        <InputForm
                                                            tooltip={t('ZakatPercent')}
                                                            label={t('ZakatPercent')}
                                                            placeholder={t('ZakatPercent')}
                                                            required={false}
                                                            name={'ait_percent'}
                                                            form={form}
                                                            mt={0}
                                                            id={'ait_percent'}
                                                            nextField={'is_ait_enabled'}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} mt={'lg'}>
                                                        <Box mt={'xs'}>
                                                            <Grid columns={6} gutter={{ base: 1 }}>
                                                                <Grid.Col span={2}>
                                                                    <SwitchForm
                                                                        tooltip={t('ZakatEnabled')}
                                                                        label=''
                                                                        nextField={'production_type'}
                                                                        name={'is_zakat_enabled'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'is_zakat_enabled'}
                                                                        position={'left'}
                                                                        defaultChecked={0}
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('ZakatEnabled')}</Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box mt={'xs'} >
                                                <TextAreaForm
                                                    tooltip={t('InvoiceComment')}
                                                    label={t('InvoiceComment')}
                                                    placeholder={t('InvoiceComment')}
                                                    required={false}
                                                    nextField={'remove_image'}
                                                    name={'invoice_comment'}
                                                    form={form}
                                                    mt={8}
                                                    id={'invoice_comment'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <ImageUploadDropzone
                                                    label={t('Logo')}
                                                    id={'logo'}
                                                    name={'logo'}
                                                    form={form}
                                                    required={false}
                                                    placeholder={t('DropLogoHere')}
                                                    nextField={'remove_image'}

                                                />
                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('RemoveImage')}
                                                            label=''
                                                            nextField={'invoice_print_logo'}
                                                            name={'remove_image'}
                                                            form={form}
                                                            color="red"
                                                            id={'remove_image'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('RemoveImage')}</Grid.Col>
                                                </Grid>
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
                                        <Box pl={'xs'} pt={'xs'}>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('PrintLogo')}
                                                            label=''
                                                            nextField={'print_outstanding'}
                                                            name={'invoice_print_logo'}
                                                            form={form}
                                                            color="red"
                                                            id={'invoice_print_logo'}
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
                                                            nextField={'pos_print'}
                                                            name={'print_outstanding'}
                                                            form={form}
                                                            color="red"
                                                            id={'print_outstanding'}
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
                                                            tooltip={t('PosPrint')}
                                                            label=''
                                                            nextField={'is_print_header'}
                                                            name={'pos_print'}
                                                            form={form}
                                                            color="red"
                                                            id={'pos_print'}
                                                            position={'left'}
                                                            defaultChecked={1}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PosPrint')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('PrintHeader')}
                                                            label=''
                                                            nextField={'is_invoice_title'}
                                                            name={'is_print_header'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_print_header'}
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
                                                            nextField={'is_print_footer'}
                                                            name={'is_invoice_title'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_invoice_title'}
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
                                                            nextField={'is_powered'}
                                                            name={'is_print_footer'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_print_footer'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('PrintFooter')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 4 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('PrintPowered')}
                                                            label=''
                                                            nextField={'print_footer_text'}
                                                            name={'is_powered'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_powered'}
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
                                                    placeholder={t('EnterPrintFooterText')}
                                                    required={false}
                                                    nextField={'body_font_size'}
                                                    name={'print_footer_text'}
                                                    form={form}
                                                    mt={8}
                                                    id={'print_footer_text'}
                                                />
                                            </Box>
                                            <Grid columns={12} gutter={{ base: 8 }}>
                                                <Grid.Col span={6}>

                                                    <Box mt={'xs'}>
                                                        <SelectForm
                                                            tooltip={t('BodyFontSize')}
                                                            label={t('BodyFontSize')}
                                                            placeholder={t('ChooseFontSize')}
                                                            required={false}
                                                            nextField={'invoice_height'}
                                                            name={'body_font_size'}
                                                            form={form}
                                                            dropdownValue={["Family", "Local"]}
                                                            mt={8}
                                                            id={'body_font_size'}
                                                            searchable={false}
                                                            value={customerGroupData}
                                                            changeValue={setCustomerGroupData}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('InvoiceHeight')}
                                                            label={t('InvoiceHeight')}
                                                            placeholder={t('InvoiceHeight')}
                                                            required={false}
                                                            nextField={'invoice_width'}
                                                            name={'invoice_height'}
                                                            form={form}
                                                            mt={0}
                                                            id={'invoice_height'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} gutter={{ base: 8 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('InvoiceWidth')}
                                                            label={t('InvoiceWidth')}
                                                            placeholder={t('InvoiceWidth')}
                                                            required={false}
                                                            nextField={'border_color'}
                                                            name={'invoice_width'}
                                                            form={form}
                                                            mt={0}
                                                            id={'invoice_width'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('BodyBorderColor')}
                                                            label={t('BodyBorderColor')}
                                                            placeholder={t('BodyBorderColor')}
                                                            required={false}
                                                            nextField={'border_width'}
                                                            name={'border_color'}
                                                            form={form}
                                                            mt={0}
                                                            id={'border_color'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} gutter={{ base: 8 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('BodyBorderWidth')}
                                                            label={t('BodyBorderWidth')}
                                                            placeholder={t('BodyBorderWidth')}
                                                            required={false}
                                                            nextField={'print_left_margin'}
                                                            name={'border_width'}
                                                            form={form}
                                                            mt={0}
                                                            id={'border_width'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('MarginLeft')}
                                                            label={t('MarginLeft')}
                                                            placeholder={t('MarginLeft')}
                                                            required={false}
                                                            nextField={'print_top_margin'}
                                                            name={'print_left_margin'}
                                                            form={form}
                                                            mt={0}
                                                            id={'print_left_margin'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} gutter={{ base: 8 }} mb={'xs'}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'} >
                                                        <InputForm
                                                            tooltip={t('MarginTop')}
                                                            label={t('MarginTop')}
                                                            placeholder={t('MarginTop')}
                                                            required={false}
                                                            nextField={'custom_invoice'}
                                                            name={'print_top_margin'}
                                                            form={form}
                                                            mt={0}
                                                            id={'print_top_margin'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>

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
                                                                    {t("UpdateAndSave")}
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
                                        <Box pt={'xs'} pl={'xs'}>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('CustomInvoice')}
                                                            label=''
                                                            nextField={'bonus_from_stock'}
                                                            name={'custom_invoice'}
                                                            form={form}
                                                            color="red"
                                                            id={'custom_invoice'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('CustomInvoice')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('BonusFromStock')}
                                                            label=''
                                                            nextField={'is_unit_price'}
                                                            name={'bonus_from_stock'}
                                                            form={form}
                                                            color="red"
                                                            id={'bonus_from_stock'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('BonusFromStock')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('IsUnitPrice')}
                                                            label=''
                                                            nextField={'is_description'}
                                                            name={'is_unit_price'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_unit_price'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('IsUnitPrice')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('IsDescription')}
                                                            label=''
                                                            nextField={'zero_stock'}
                                                            name={'is_description'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_description'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('IsDescription')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ZeroStockAllowed')}
                                                            label=''
                                                            nextField={'stock_item'}
                                                            name={'zero_stock'}
                                                            form={form}
                                                            color="red"
                                                            id={'zero_stock'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('ZeroStockAllowed')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StockItem')}
                                                            label=''
                                                            nextField={'custom_invoice_print'}
                                                            name={'stock_item'}
                                                            form={form}
                                                            color="red"
                                                            id={'stock_item'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('StockItem')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('CustomInvoicePrint')}
                                                            label=''
                                                            nextField={'is_stock_history'}
                                                            name={'custom_invoice_print'}
                                                            form={form}
                                                            color="red"
                                                            id={'custom_invoice_print'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('CustomInvoicePrint')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StockHistory')}
                                                            label=''
                                                            nextField={'condition_sales'}
                                                            name={'is_stock_history'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_stock_history'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('StockHistory')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ConditionSales')}
                                                            label=''
                                                            nextField={'store_ledger'}
                                                            name={'condition_sales'}
                                                            form={form}
                                                            color="red"
                                                            id={'condition_sales'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('ConditionSales')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StoreLedger')}
                                                            label=''
                                                            nextField={'is_marketing_executive'}
                                                            name={'store_ledger'}
                                                            form={form}
                                                            color="red"
                                                            id={'store_ledger'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('StoreLedger')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('MarketingExecutive')}
                                                            label=''
                                                            nextField={'fuel_station'}
                                                            name={'is_marketing_executive'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_marketing_executive'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('MarketingExecutive')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            {/*<Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('FuelStation')}
                                                            label=''
                                                            nextField={'tlo_commission'}
                                                            name={'fuel_station'}
                                                            form={form}
                                                            color="red"
                                                            id={'fuel_station'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('FuelStation')}</Grid.Col>
                                                </Grid>
                                            </Box>*/}
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('TloCommision')}
                                                            label=''
                                                            nextField={'sales_return'}
                                                            name={'tlo_commission'}
                                                            form={form}
                                                            color="red"
                                                            id={'tlo_commission'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('TloCommision')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('SalesReturn')}
                                                            label=''
                                                            nextField={'sr_commission'}
                                                            name={'sales_return'}
                                                            form={form}
                                                            color="red"
                                                            id={'sales_return'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('SalesReturn')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('SRCommision')}
                                                            label=''
                                                            nextField={'due_sales_without_customer'}
                                                            name={'sr_commission'}
                                                            form={form}
                                                            color="red"
                                                            id={'sr_commission'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('SRCommision')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('DueSalesWithoutCustomer')}
                                                            label=''
                                                            nextField={'EntityFormSubmit'}
                                                            name={'due_sales_without_customer'}
                                                            form={form}
                                                            color="red"
                                                            id={'due_sales_without_customer'}
                                                            position={'left'}
                                                            defaultChecked={0}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'} >{t('DueSalesWithoutCustomer')}</Grid.Col>
                                                </Grid>
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
    );
}
export default ConfigurationForm;
