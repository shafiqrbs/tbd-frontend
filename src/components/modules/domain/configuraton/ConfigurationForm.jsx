import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import { setValidationData, updateEntityData } from "../../../../store/inventory/crudSlice.js";
import getSettingBusinessModelDropdownData from "../../../global-hook/dropdown/getSettingBusinessModelDropdownData.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import ImageUploadDropzone from "../../../form-builders/ImageUploadDropzone.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import getCountryDropdownData from "../../../global-hook/dropdown/getCountryDropdownData.js";
import getCurrencyDropdownData from "../../../global-hook/dropdown/getCurrencyDropdownData.js";

function ConfigurationForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const businessModelDropdown = getSettingBusinessModelDropdownData()
    const countryDropdown = getCountryDropdownData()
    const currencyDropdown = getCurrencyDropdownData()

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const [files, setFiles] = useState([]);

    localStorage.setItem('config-data', JSON.stringify(getConfigData()));

    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const [businessModelId, setBusinessModelId] = useState(configData.business_model_id ? configData.business_model_id.toString() : null)
    const [countryId, setCountryId] = useState(configData.country_id ? configData.country_id.toString() : null)
    const [currencyId, setCurrencyId] = useState(configData.currency_id ? configData.currency_id.toString() : null)

    const form = useForm({
        initialValues: {
            business_model_id: configData.business_model_id ? configData?.business_model_id : '',
            country_id: configData.country_id ? configData?.country_id : '',
            currency_id: configData.currency_id ? configData?.currency_id : '',
            address: configData?.address,
            sku_wearhouse: configData.sku_wearhouse,
            sku_category: configData.sku_category,
            vat_enable: configData.vat_enable,
            vat_percent: configData.vat_percent,
            ait_enable: configData.ait_enable,
            ait_percent: configData.ait_percent,
            zakat_enable: configData.zakat_enable,
            zakat_percent: configData.zakat_percent,
            production_type: configData.production_type,
            invoice_comment: configData.invoice_comment,
            logo: configData.logo,
            remove_image: configData.remove_image,
            invoice_print_logo: configData.invoice_print_logo,
            print_outstanding: configData.print_outstanding,
            pos_print: configData.pos_print,
            is_print_header: configData.is_print_header,
            is_invoice_title: configData.is_invoice_title,
            is_print_footer: configData.is_print_footer,
            is_powered: configData.is_powered,
            print_footer_text: configData.print_footer_text,
            body_font_size: configData.body_font_size,
            invoice_height: configData.invoice_height,
            invoice_width: configData.invoice_width,
            border_color: configData.border_color,
            border_width: configData.border_width,
            print_left_margin: configData.print_left_margin,
            print_top_margin: configData.print_top_margin,
            custom_invoice: configData.custom_invoice,
            bonus_from_stock: configData.bonus_from_stock,
            is_unit_price: configData.is_unit_price,
            zero_stock: configData.zero_stock,
            stock_item: configData.stock_item,
            custom_invoice_print: configData.custom_invoice_print,
            is_stock_history: configData.is_stock_history,
            condition_sales: configData.condition_sales,
            store_ledger: configData.store_ledger,
            is_marketing_executive: configData.is_marketing_executive,
            tlo_commission: configData.tlo_commission,
            sales_return: configData.sales_return,
            sr_commission: configData.sr_commission,
            due_sales_without_customer: configData.due_sales_without_customer,
            is_description: configData.is_description,
            is_zero_receive_allow: configData.is_zero_receive_allow,
            is_purchase_by_purchase_price: configData.is_purchase_by_purchase_price,
            is_active_sms: configData.is_active_sms,

        },
        validate: {
            business_model_id: isNotEmpty(),
            country_id: isNotEmpty(),
            currency_id: isNotEmpty(),
        }
    });


    useEffect(() => {
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
                setSaveCreateLoading(false)
            }, 700)
        }
    }, [validation, validationMessage]);

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])


    useHotkeys([['alt+n', () => {
        document.getElementById('BusinessModel').click()
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
                if (files) {
                    form.values['logo'] = files[0]
                }
                form.values['sku_wearhouse'] = (values.sku_wearhouse === true || values.sku_wearhouse == 1) ? 1 : 0
                form.values['sku_category'] = (values.sku_category === true || values.sku_category == 1) ? 1 : 0
                form.values['vat_enable'] = (values.vat_enable === true || values.vat_enable == 1) ? 1 : 0
                form.values['ait_enable'] = (values.ait_enable === true || values.ait_enable == 1) ? 1 : 0
                form.values['zakat_enable'] = (values.zakat_enable === true || values.zakat_enable == 1) ? 1 : 0
                form.values['remove_image'] = (values.remove_image === true || values.remove_image == 1) ? 1 : 0
                form.values['invoice_print_logo'] = (values.invoice_print_logo === true || values.invoice_print_logo == 1) ? 1 : 0
                form.values['print_outstanding'] = (values.print_outstanding === true || values.print_outstanding == 1) ? 1 : 0
                form.values['pos_print'] = (values.pos_print === true || values.pos_print == 1) ? 1 : 0
                form.values['is_print_header'] = (values.is_print_header === true || values.is_print_header == 1) ? 1 : 0
                form.values['is_invoice_title'] = (values.is_invoice_title === true || values.is_invoice_title == 1) ? 1 : 0
                form.values['is_print_footer'] = (values.is_print_footer === true || values.is_print_footer == 1) ? 1 : 0
                form.values['is_powered'] = (values.is_powered === true || values.is_powered == 1) ? 1 : 0
                form.values['custom_invoice'] = (values.custom_invoice === true || values.custom_invoice == 1) ? 1 : 0
                form.values['bonus_from_stock'] = (values.bonus_from_stock === true || values.bonus_from_stock == 1) ? 1 : 0
                form.values['is_unit_price'] = (values.is_unit_price === true || values.is_unit_price == 1) ? 1 : 0
                form.values['is_description'] = (values.is_description === true || values.is_description == 1) ? 1 : 0
                form.values['zero_stock'] = (values.zero_stock === true || values.zero_stock == 1) ? 1 : 0
                form.values['stock_item'] = (values.stock_item === true || values.stock_item == 1) ? 1 : 0
                form.values['custom_invoice_print'] = (values.custom_invoice_print === true || values.custom_invoice_print == 1) ? 1 : 0
                form.values['is_stock_history'] = (values.is_stock_history === true || values.is_stock_history == 1) ? 1 : 0
                form.values['condition_sales'] = (values.condition_sales === true || values.condition_sales == 1) ? 1 : 0
                form.values['store_ledger'] = (values.store_ledger === true || values.store_ledger == 1) ? 1 : 0
                form.values['is_marketing_executive'] = (values.is_marketing_executive === true || values.is_marketing_executive == 1) ? 1 : 0
                form.values['tlo_commission'] = (values.tlo_commission === true || values.tlo_commission == 1) ? 1 : 0
                form.values['sales_return'] = (values.sales_return === true || values.sales_return == 1) ? 1 : 0
                form.values['sr_commission'] = (values.sr_commission === true || values.sr_commission == 1) ? 1 : 0
                form.values['due_sales_without_customer'] = (values.due_sales_without_customer === true || values.due_sales_without_customer == 1) ? 1 : 0
                form.values['is_zero_receive_allow'] = (values.is_zero_receive_allow === true || values.is_zero_receive_allow == 1) ? 1 : 0
                form.values['is_purchase_by_purchase_price'] = (values.is_purchase_by_purchase_price === true || values.is_purchase_by_purchase_price == 1) ? 1 : 0
                form.values['is_active_sms'] = (values.is_active_sms === true || values.is_active_sms == 1) ? 1 : 0

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
                            url: 'inventory/config-update',
                            data: values
                        }
                        dispatch(updateEntityData(value))
                    },
                });
            })}>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={7}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'}>{t('Core')}</Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('BusinessModel')}
                                                    label={t('BusinessModel')}
                                                    placeholder={t('ChooseBusinessModel')}
                                                    required={true}
                                                    nextField={'country_id'}
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
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseCountry')}
                                                    label={t('Country')}
                                                    placeholder={t('ChooseCountry')}
                                                    required={true}
                                                    nextField={'currency_id'}
                                                    name={'country_id'}
                                                    form={form}
                                                    dropdownValue={countryDropdown}
                                                    mt={8}
                                                    id={'country_id'}
                                                    searchable={true}
                                                    value={countryId}
                                                    changeValue={setCountryId}
                                                    clearable={false}
                                                    allowDeselect={false}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('ChooseCurrency')}
                                                    label={t('Currency')}
                                                    placeholder={t('ChooseCurrency')}
                                                    required={true}
                                                    nextField={'address'}
                                                    name={'currency_id'}
                                                    form={form}
                                                    dropdownValue={currencyDropdown}
                                                    mt={8}
                                                    id={'currency_id'}
                                                    searchable={true}
                                                    value={currencyId}
                                                    changeValue={setCurrencyId}
                                                    clearable={false}
                                                    allowDeselect={false}
                                                />
                                            </Box>


                                            <Box mt={'xs'}>
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
                                                            defaultChecked={configData.sku_wearhouse}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Warehouse')}</Grid.Col>
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
                                                            defaultChecked={configData.sku_category}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Category')}</Grid.Col>
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
                                                            nextField={'vat_enable'}
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
                                                                        name={'vat_enable'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'vat_enable'}
                                                                        position={'left'}
                                                                        defaultChecked={configData.vat_enable}
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
                                                            nextField={'ait_enable'}
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
                                                                        nextField={'zakat_percent'}
                                                                        name={'ait_enable'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'ait_enable'}
                                                                        position={'left'}
                                                                        defaultChecked={configData.ait_enable}
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
                                                            name={'zakat_percent'}
                                                            form={form}
                                                            mt={0}
                                                            id={'zakat_percent'}
                                                            nextField={'zakat_enable'}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} mt={'lg'}>
                                                        <Box mt={'xs'}>
                                                            <Grid columns={6} gutter={{ base: 1 }}>
                                                                <Grid.Col span={2}>
                                                                    <SwitchForm
                                                                        tooltip={t('ZakatEnabled')}
                                                                        label=''
                                                                        nextField={'invoice_comment'}
                                                                        name={'zakat_enable'}
                                                                        form={form}
                                                                        color="red"
                                                                        id={'zakat_enable'}
                                                                        position={'left'}
                                                                        defaultChecked={configData.zakat_enable}
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4} fz={'sm'}
                                                                    pt={'1'}>{t('ZakatEnabled')}</Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box mt={'xs'}>
                                                <TextAreaForm
                                                    tooltip={t('InvoiceComment')}
                                                    label={t('InvoiceComment')}
                                                    placeholder={t('InvoiceComment')}
                                                    required={false}
                                                    nextField={'logo'}
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
                                                    files={files}
                                                    setFiles={setFiles}
                                                    existsFile={import.meta.env.VITE_IMAGE_GATEWAY_URL + 'uploads/inventory/logo/' + configData.path}
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
                                                            defaultChecked={configData.remove_image}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('RemoveImage')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'}
                                    className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'} >{t('Print')}</Title>
                                        </Grid.Col>

                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
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
                                                            defaultChecked={configData.invoice_print_logo}
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
                                                            defaultChecked={configData.print_outstanding}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('PrintWithOutstanding')}</Grid.Col>
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
                                                            defaultChecked={configData.pos_print}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('PosPrint')}</Grid.Col>
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
                                                            defaultChecked={configData.is_print_header}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('PrintHeader')}</Grid.Col>
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
                                                            defaultChecked={configData.is_invoice_title}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('PrintInvoiceTitle')}</Grid.Col>
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
                                                            defaultChecked={configData.is_print_footer}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('PrintFooter')}</Grid.Col>
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
                                                            defaultChecked={configData.is_powered}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('PrintPowered')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
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
                                                        <InputNumberForm
                                                            tooltip={t('BodyFontSize')}
                                                            label={t('BodyFontSize')}
                                                            placeholder={t('BodyFontSize')}
                                                            required={false}
                                                            nextField={'invoice_height'}
                                                            name={'body_font_size'}
                                                            form={form}
                                                            mt={0}
                                                            id={'body_font_size'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
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
                                                        <InputNumberForm
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
                                                        <InputNumberForm
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
                                                        <InputNumberForm
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
                                                    <Box mt={'xs'}>
                                                        <InputNumberForm
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
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('Configuration')}</Title>
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
                                                            defaultChecked={configData.custom_invoice}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('CustomInvoice')}</Grid.Col>
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
                                                            defaultChecked={configData.bonus_from_stock}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('BonusFromStock')}</Grid.Col>
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
                                                            defaultChecked={configData.is_unit_price}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('IsUnitPrice')}</Grid.Col>
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
                                                            defaultChecked={configData.is_description}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('IsDescription')}</Grid.Col>
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
                                                            defaultChecked={configData.zero_stock}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ZeroStockAllowed')}</Grid.Col>
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
                                                            defaultChecked={configData.stock_item}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('StockItem')}</Grid.Col>
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
                                                            defaultChecked={configData.custom_invoice_print}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('CustomInvoicePrint')}</Grid.Col>
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
                                                            defaultChecked={configData.is_stock_history}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('StockHistory')}</Grid.Col>
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
                                                            defaultChecked={configData.condition_sales}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ConditionSales')}</Grid.Col>
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
                                                            defaultChecked={configData.store_ledger}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('StoreLedger')}</Grid.Col>
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
                                                            defaultChecked={configData.is_marketing_executive}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('MarketingExecutive')}</Grid.Col>
                                                </Grid>
                                            </Box>

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
                                                            defaultChecked={configData.tlo_commission}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('TloCommision')}</Grid.Col>
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
                                                            defaultChecked={configData.sales_return}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('SalesReturn')}</Grid.Col>
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
                                                            defaultChecked={configData.sr_commission}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('SRCommision')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('DueSalesWithoutCustomer')}
                                                            label=''
                                                            nextField={'is_zero_receive_allow'}
                                                            name={'due_sales_without_customer'}
                                                            form={form}
                                                            color="red"
                                                            id={'due_sales_without_customer'}
                                                            position={'left'}
                                                            defaultChecked={configData.due_sales_without_customer}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('DueSalesWithoutCustomer')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ZeroReceiveAllow')}
                                                            label=''
                                                            nextField={'is_purchase_by_purchase_price'}
                                                            name={'is_zero_receive_allow'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_zero_receive_allow'}
                                                            position={'left'}
                                                            defaultChecked={configData.is_zero_receive_allow}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ZeroReceiveAllow')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('PurchaseByPurchasePrice')}
                                                            label=''
                                                            nextField={'is_active_sms'}
                                                            name={'is_purchase_by_purchase_price'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_purchase_by_purchase_price'}
                                                            position={'left'}
                                                            defaultChecked={configData.is_purchase_by_purchase_price}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('PurchaseByPurchasePrice')}</Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box mt={'xs'} mb={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('isActiveSms')}
                                                            label=''
                                                            nextField={'EntityFormSubmit'}
                                                            name={'is_active_sms'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_active_sms'}
                                                            position={'left'}
                                                            defaultChecked={configData.is_active_sms}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('isActiveSms')}</Grid.Col>
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
