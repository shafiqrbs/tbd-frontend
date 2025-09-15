import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {Button, Flex, Grid, Group, Box, ScrollArea, Text, Title, Stack, LoadingOverlay, rem} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {IconCheck, IconDeviceFloppy, IconRestore} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch} from "react-redux";
import {isNotEmpty, useForm} from "@mantine/form";
import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import {showInstantEntityData, updateEntityData} from "../../../../store/inventory/crudSlice.js";
import getSettingBusinessModelDropdownData from "../../../global-hook/dropdown/getSettingBusinessModelDropdownData.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import ImageUploadDropzone from "../../../form-builders/ImageUploadDropzone.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import getCountryDropdownData from "../../../global-hook/dropdown/getCountryDropdownData.js";
import getCurrencyDropdownData from "../../../global-hook/dropdown/getCurrencyDropdownData.js";
import {showEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import getSettingPosInvoiceModeDropdownData
    from "../../../global-hook/dropdown/getSettingPosInvoiceModeDropdownData.js";
import {modals} from "@mantine/modals";
import {deleteEntityData} from "../../../../store/inventory/crudSlice";
import {notifications} from "@mantine/notifications";
import getDomainConfig from "../../../global-hook/config-data/getDomainConfig";

function ConfigurationForm() {
    const {id} = useParams()
    const [configData, setConfigData] = useState(null);
    const [formLoad, setFormLoad] = useState(true);
    const dispatch = useDispatch();
    const [countryId, setCountryId] = useState(configData?.country_id?.toString() || '');
    const [businessModelId, setBusinessModelId] = useState(configData?.business_model_id?.toString() || '');
    const [posInvoiceModeId, setPosInvoiceModeId] = useState(configData?.pos_invoice_mode_id?.toString() || '');
    const [currencyId, setCurrencyId] = useState(configData?.currency_id?.toString() || '');
    const posInvoiceModeDropdown = getSettingPosInvoiceModeDropdownData()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFormLoad(true);
                const result = await dispatch(showEntityData("inventory/config/" + id)).unwrap();
                if (result.data.status === 200) {
                    setConfigData(result.data.data); // Update state with fetched data
                    form.setValues(result.data.data); // Populate form fields

                    // Update state variables with fetched values
                    setCountryId(result.data.data.country_id?.toString() || '');
                    setBusinessModelId(result.data.data.domain?.business_model_id?.toString() || '');
                    setPosInvoiceModeId(result.data.data.pos_invoice_mode_id?.toString() || '');
                    setCurrencyId(result.data.data.currency_id?.toString() || '');
                }
            } catch (error) {
                showNotificationComponent(t('FailedToFetchData'), 'red', null, false, 1000)
            } finally {
                setFormLoad(false);
            }
        };

        fetchData();
    }, [dispatch, id]);
    console.log(configData)
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const businessModelDropdown = getSettingBusinessModelDropdownData()
    const countryDropdown = getCountryDropdownData()
    const currencyDropdown = getCurrencyDropdownData()
    const [configFetching,setConfigFetching] = useState(true)
    const [setFormData, setFormDataForUpdate] = useState(false);

    const [files, setFiles] = useState([]);

    // Form initialization
    const form = useForm({
        initialValues: {
            business_model_id: '',
            pos_invoice_mode_id: '',
            country_id: '',
            currency_id: '',
            address: '',
            sku_warehouse: false,
            sku_category: false,
            vat_enable: false,
            sd_enable: false,
            hs_code_enable: false,
            zakat_enable: false,
            zakat_percent: 0,
            sd_percent: 0,
            ait_percent: 0,
            ait_enable: false,
            production_type: '',
            invoice_comment: '',
            logo: '',
            remove_image: false,
            invoice_print_logo: false,
            print_outstanding: false,
            pos_print: false,
            is_print_header: false,
            is_invoice_title: false,
            is_print_footer: false,
            is_powered: false,
            print_footer_text: '',
            body_font_size: 0,
            invoice_height: 0,
            invoice_width: 0,
            border_color: '',
            border_width: 0,
            print_left_margin: 0,
            print_top_margin: 0,
            custom_invoice: false,
            bonus_from_stock: false,
            is_unit_price: false,
            zero_stock: false,
            stock_item: false,
            custom_invoice_print: false,
            is_stock_history: false,
            condition_sales: false,
            store_ledger: false,
            is_marketing_executive: false,
            tlo_commission: false,
            sales_return: false,
            sr_commission: false,
            due_sales_without_customer: false,
            is_description: false,
            is_zero_receive_allow: false,
            is_purchase_by_purchase_price: false,
            is_pos: false,
            is_pay_first: false,
            is_sales_auto_approved: false,
            is_purchase_auto_approved: false,
            is_active_sms: false,
            is_kitchen: false
        },
        validate: {
            business_model_id: isNotEmpty(),
            country_id: isNotEmpty(),
            currency_id: isNotEmpty(),
        }
    });

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])

    const [loading, { toggle }] = useDisclosure();
    useHotkeys([['alt+n', () => {
        document.getElementById('BusinessModel').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            setSaveCreateLoading(true);

            !posInvoiceModeId && (form.values['pos_invoice_mode_id'] = null);

            if (files) {
                form.values['logo'] = files[0]
            }

            const booleanFields = [
                'sku_warehouse', 'sku_category', 'vat_enable', 'zakat_enable', 'remove_image',
                'invoice_print_logo', 'print_outstanding', 'pos_print', 'is_print_header',
                'is_invoice_title', 'is_print_footer', 'is_powered', 'custom_invoice',
                'bonus_from_stock', 'is_unit_price', 'is_description', 'zero_stock',
                'stock_item', 'custom_invoice_print', 'is_stock_history', 'condition_sales',
                'store_ledger', 'is_marketing_executive', 'tlo_commission', 'sales_return',
                'sr_commission', 'due_sales_without_customer', 'is_zero_receive_allow',
                'is_purchase_by_purchase_price','is_pos','hs_code_enable','sd_enable','ait_enable',
                'is_pay_first','is_sales_auto_approved','is_purchase_auto_approved','is_active_sms', 'is_kitchen'
            ];

            // Convert Boolean values to 1 or 0 dynamically
            booleanFields.forEach((field) => {
                form.values[field] = values[field] === true || values[field] == 1 ? 1 : 0;
            });


            const value = {
                url: 'inventory/config-update/' + id,
                data: values
            };
            const result = await dispatch(updateEntityData(value)).unwrap();
            if (result.data.message === 'success') {
                showNotificationComponent(t('UpdateSuccessfully'), 'teal', null, false, 1000)
                const resultAction = await dispatch(showInstantEntityData('inventory/config'));
                if (showInstantEntityData.fulfilled.match(resultAction)) {
                    if (resultAction.payload.data.status === 200) {
                        localStorage.setItem('config-data', JSON.stringify(resultAction.payload.data.data));
                    }
                }
            }
        } catch (error) {
            showNotificationComponent(t('FailedToUpdateData'), 'red', null, false, 1000)
        } finally {
            setSaveCreateLoading(false);
        }
    };


    return (
        <Box style={{ position: 'relative' }}>
        <LoadingOverlay 
            visible={formLoad} 
            overlayProps={{ radius: "sm", blur: 2 }} 
            zIndex={1000} loaderProps={{color : "red"}} />             
            {
                configData && (
                    <form onSubmit={form.onSubmit(handleSubmit)}>

                        <Grid columns={24} gutter={{base: 8}}>
                            <Grid.Col span={7}>
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                                    <Box bg={"white"}>
                                        <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'}
                                             className={'boxBackground borderRadiusAll'}>
                                            <Grid>
                                                <Grid.Col>
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
                                                            nextField={'sku_warehouse'}
                                                            name={'address'}
                                                            form={form}
                                                            mt={8}
                                                            id={'address'}
                                                        />
                                                    </Box>
                                                    <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
                                                        <Title order={6} pt={'4'}>{t('StockFormat')}</Title>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('Warehouse')}
                                                                    label=''
                                                                    nextField={'sku_category'}
                                                                    name={'sku_warehouse'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'sku_warehouse'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.sku_warehouse}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('Warehouse')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('Category')}
                                                                    label=''
                                                                    nextField={'vat_percent'}
                                                                    name={'sku_category'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'sku_category'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.sku_category}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Category')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
                                                        <Title order={6} pt={'4'}>{t('VatManagement')}</Title>
                                                    </Box>
                                                    <Box mt={'md'} mb={'md'}>
                                                        <Grid gutter={{base: 6}}>
                                                            <Grid.Col span={6}>&nbsp;</Grid.Col>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('VatEnabled')}
                                                                    label=''
                                                                    nextField={'vat_percent'}
                                                                    name={'hs_code_enable'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'hs_code_enable'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.hs_code_enable}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('HSCodeEnabled')}
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                    <Box mt={'md'} mb={'md'}>
                                                        <Grid gutter={{base: 6}}>
                                                            <Grid.Col span={6}>
                                                                <InputForm
                                                                    tooltip={t('VatPercent')}
                                                                    label={t('VatPercent')}
                                                                    placeholder={t('VatPercent')}
                                                                    required={false}
                                                                    name={'vat_percent'}
                                                                    form={form}
                                                                    mt={0}
                                                                    id={'vat_percent'}
                                                                    nextField={'vat_enable'}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} mt={'lg'}>
                                                                <Box mt={'xs'}>
                                                                    <Grid columns={6} gutter={{base: 1}}>
                                                                        <Grid.Col span={2}>
                                                                            <SwitchForm
                                                                                tooltip={t('VatEnabled')}
                                                                                label=''
                                                                                nextField={'sd_percent'}
                                                                                name={'vat_enable'}
                                                                                form={form}
                                                                                color='var(--theme-primary-color-6)'
                                                                                id={'vat_enable'}
                                                                                position={'left'}
                                                                                defaultChecked={configData.vat_enable}
                                                                            />
                                                                        </Grid.Col>
                                                                        <Grid.Col span={4} fz={'sm'}
                                                                                  pt={'1'}>{t('VatEnabled')}</Grid.Col>
                                                                    </Grid>
                                                                </Box>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'md'} mb={'md'}>
                                                        <Grid gutter={{base: 6}}>
                                                            <Grid.Col span={6}>
                                                                <InputForm
                                                                    tooltip={t('SdPercent')}
                                                                    label={t('SdPercent')}
                                                                    placeholder={t('SdPercent')}
                                                                    required={false}
                                                                    name={'sd_percent'}
                                                                    form={form}
                                                                    mt={0}
                                                                    id={'sd_percent'}
                                                                    nextField={'sd_enable'}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} mt={'lg'}>
                                                                <Box mt={'xs'}>
                                                                    <Grid columns={6} gutter={{base: 1}}>
                                                                        <Grid.Col span={2}>
                                                                            <SwitchForm
                                                                                tooltip={t('SdEnabled')}
                                                                                label=''
                                                                                nextField={'ait_percent'}
                                                                                name={'sd_enable'}
                                                                                form={form}
                                                                                color='var(--theme-primary-color-6)'
                                                                                id={'sd_enable'}
                                                                                position={'left'}
                                                                                defaultChecked={configData.sd_enable}
                                                                            />
                                                                        </Grid.Col>
                                                                        <Grid.Col span={4} fz={'sm'}
                                                                                  pt={'1'}>{t('SDEnabled')}</Grid.Col>
                                                                    </Grid>
                                                                </Box>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'md'} mb={'md'}>
                                                        <Grid gutter={{base: 6}}>
                                                            <Grid.Col span={6}>
                                                                <InputForm
                                                                    tooltip={t('AitPercent')}
                                                                    label={t('AitPercent')}
                                                                    placeholder={t('AitPercent')}
                                                                    required={false}
                                                                    name={'ait_percent'}
                                                                    form={form}
                                                                    mt={0}
                                                                    id={'ait_percent'}
                                                                    nextField={'ait_enable'}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} mt={'lg'}>
                                                                <Box mt={'xs'}>
                                                                    <Grid columns={6} gutter={{base: 1}}>
                                                                        <Grid.Col span={2}>
                                                                            <SwitchForm
                                                                                tooltip={t('AitEnabled')}
                                                                                label=''
                                                                                nextField={'zakat_percent'}
                                                                                name={'ait_enable'}
                                                                                form={form}
                                                                                color='var(--theme-primary-color-6)'
                                                                                id={'ait_enable'}
                                                                                position={'left'}
                                                                                defaultChecked={configData.ait_enable}
                                                                            />
                                                                        </Grid.Col>
                                                                        <Grid.Col span={4} fz={'sm'}
                                                                                  pt={'1'}>{t('AITEnabled')}</Grid.Col>
                                                                    </Grid>
                                                                </Box>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'md'} mb={'md'}>
                                                        <Grid gutter={{base: 6}}>
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
                                                                    <Grid columns={6} gutter={{base: 1}}>
                                                                        <Grid.Col span={2}>
                                                                            <SwitchForm
                                                                                tooltip={t('ZakatEnabled')}
                                                                                label=''
                                                                                nextField={'invoice_comment'}
                                                                                name={'zakat_enable'}
                                                                                form={form}
                                                                                color='var(--theme-primary-color-6)'
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
                                                    <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
                                                        <Title order={6} pt={'4'}>{t('CompanyLogo')}</Title>
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('RemoveImage')}
                                                                    label=''
                                                                    nextField={'invoice_print_logo'}
                                                                    name={'remove_image'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'remove_image'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.remove_image}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('RemoveImage')}</Grid.Col>
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
                                                <Grid.Col>
                                                    <Title order={6} pt={'4'}>{t('ManagePos&Print')}</Title>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box pl={'xs'} pt={'xs'}>
                                                    <Box mt={'xs'}>
                                                        <Box mt={'xs'}>
                                                            <SelectForm
                                                                tooltip={t('PosInvoiceMode')}
                                                                label={t('PosInvoiceMode')}
                                                                placeholder={t('ChoosePosInvoiceMode')}
                                                                required={false}
                                                                nextField={'print_footer_text'}
                                                                name={'pos_invoice_mode_id'}
                                                                form={form}
                                                                dropdownValue={posInvoiceModeDropdown}
                                                                mt={8}
                                                                id={'pos_invoice_mode_id'}
                                                                searchable={false}
                                                                value={posInvoiceModeId}
                                                                changeValue={setPosInvoiceModeId}
                                                                clearable={true}
                                                                allowDeselect={true}
                                                            />
                                                        </Box>
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PosPrint')}
                                                                    label=''
                                                                    nextField={'is_print_header'}
                                                                    name={'pos_print'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'pos_print'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.pos_print}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('PosPrint')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PosPayFirst')}
                                                                    label=''
                                                                    id={'is_pay_first'}
                                                                    name={'is_pay_first'}
                                                                    nextField={'is_pos'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_pay_first}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PosPayFirst')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PosEnable')}
                                                                    label=''
                                                                    id={'is_pos'}
                                                                    name={'is_pos'}
                                                                    nextField={'is_kitchen'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_pos}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PosEnable')}</Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('KitchenEnable')}
                                                                    label=''
                                                                    id={'is_kitchen'}
                                                                    name={'is_kitchen'}
                                                                    nextField={'custom_invoice'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_kitchen}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('KitchenEnable')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
                                                        <Title order={6} pt={'4'}>{t('PrintSetup')}</Title>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('CustomInvoicePrint')}
                                                                    label=''
                                                                    nextField={'is_stock_history'}
                                                                    name={'custom_invoice_print'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PrintLogo')}
                                                                    label=''
                                                                    nextField={'print_outstanding'}
                                                                    name={'invoice_print_logo'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'invoice_print_logo'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.invoice_print_logo}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PrintLogo')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PrintWithOutstanding')}
                                                                    label=''
                                                                    nextField={'pos_print'}
                                                                    name={'print_outstanding'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PrintHeader')}
                                                                    label=''
                                                                    nextField={'is_invoice_title'}
                                                                    name={'is_print_header'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_print_header'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_print_header}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PrintHeader')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PrintInvoiceTitle')}
                                                                    label=''
                                                                    nextField={'is_print_footer'}
                                                                    name={'is_invoice_title'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PrintFooter')}
                                                                    label=''
                                                                    nextField={'is_powered'}
                                                                    name={'is_print_footer'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_print_footer'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_print_footer}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PrintFooter')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 4}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PrintPowered')}
                                                                    label=''
                                                                    nextField={'pos_invoice_mode_id'}
                                                                    name={'is_powered'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_powered'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_powered}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PrintPowered')}</Grid.Col>
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
                                                    <Grid columns={12} gutter={{base: 8}}>
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
                                                    <Grid columns={12} gutter={{base: 8}}>
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
                                                    <Grid columns={12} gutter={{base: 8}}>
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
                                                    <Grid columns={12} gutter={{base: 8}} mb={'xs'}>
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
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'}
                                             className={'boxBackground borderRadiusAll'}>
                                            <Grid>
                                                <Grid.Col span={6}>
                                                    <Title order={6} pt={'6'}>{t('ManageConfiguration')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Stack right align="flex-end">
                                                        <>
                                                            {!saveCreateLoading && isOnline &&(
                                                            <Group>
                                                                <Button
                                                                    size="xs"
                                                                    className={"btnPrimaryBg"}
                                                                    type="submit"
                                                                    id="EntityFormSubmit"
                                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                                >

                                                                    <Flex direction={`column`} gap={0}>
                                                                        <Text fz={14} fw={400}>
                                                                            {t("Save")}
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                                <Button
                                                                    size="xs"
                                                                    className={"btnPrimaryBgOutline"}
                                                                    onClick={() => {
                                                                        modals.openConfirmModal({
                                                                            title: (
                                                                                <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                                            ),
                                                                            children: (
                                                                                <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                            ),
                                                                            labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                                            confirmProps: {color: 'red.6'},
                                                                            onCancel: () => console.log('Cancel'),
                                                                            onConfirm: () => {
                                                                                dispatch(showEntityData('domain/restore/' + configData.domain_id))
                                                                                setConfigFetching(true)
                                                                                notifications.show({
                                                                                    color: 'teal',
                                                                                    title: t('Restore'),
                                                                                    icon: <IconCheck
                                                                                        style={{width: rem(18), height: rem(18)}}/>,
                                                                                    loading: false,
                                                                                    autoClose: 700,
                                                                                    style: {backgroundColor: 'lightgray'},
                                                                                });
                                                                            },
                                                                        });
                                                                    }}
                                                                    id="EntityFormSubmit"
                                                                    leftSection={<IconRestore size={16}/>}
                                                                >

                                                                    <Flex direction={`column`} gap={0}>
                                                                        <Text fz={14} fw={400}>
                                                                            {t("Restore")}
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </Group>
                                                            )}
                                                        </>
                                                    </Stack>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                            <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                                <Box pt={'xs'} pl={'xs'}>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('CustomInvoice')}
                                                                    label=''
                                                                    nextField={'bonus_from_stock'}
                                                                    name={'custom_invoice'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('SalesAutoApproved')}
                                                                    label=''
                                                                    id={'is_sales_auto_approved'}
                                                                    name={'is_sales_auto_approved'}
                                                                    nextField={'is_purchase_auto_approved'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_sales_auto_approved}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('SalesAutoApproved')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'} mb={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('DueSalesWithoutCustomer')}
                                                                    label=''
                                                                    nextField={'is_zero_receive_allow'}
                                                                    name={'due_sales_without_customer'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'due_sales_without_customer'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.due_sales_without_customer}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('DueSalesWithoutCustomer')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('SalesReturn')}
                                                                    label=''
                                                                    nextField={'sr_commission'}
                                                                    name={'sales_return'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'sales_return'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.sales_return}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('SalesReturn')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PurchaseAutoApproved')}
                                                                    label=''
                                                                    id={'is_purchase_auto_approved'}
                                                                    name={'is_purchase_auto_approved'}
                                                                    nextField={'is_pay_first'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_purchase_auto_approved}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PurchaseAutoApproved')}</Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('IsUnitPrice')}
                                                                    label=''
                                                                    nextField={'is_description'}
                                                                    name={'is_unit_price'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_unit_price'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_unit_price}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('IsUnitPrice')}</Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                    <Box mt={'xs'} mb={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('ZeroReceiveAllow')}
                                                                    label=''
                                                                    nextField={'is_purchase_by_purchase_price'}
                                                                    name={'is_zero_receive_allow'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('PurchaseByPurchasePrice')}
                                                                    label=''
                                                                    nextField={'is_active_sms'}
                                                                    name={'is_purchase_by_purchase_price'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_purchase_by_purchase_price'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_purchase_by_purchase_price}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('PurchaseByPurchasePrice')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
                                                        <Title order={6} pt={'4'}>{t('ManageProduct')}</Title>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('IsDescription')}
                                                                    label=''
                                                                    nextField={'zero_stock'}
                                                                    name={'is_description'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('ZeroStockAllowed')}
                                                                    label=''
                                                                    nextField={'stock_item'}
                                                                    name={'zero_stock'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('StockItem')}
                                                                    label=''
                                                                    nextField={'custom_invoice_print'}
                                                                    name={'stock_item'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'stock_item'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.stock_item}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('StockItem')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('BonusFromStock')}
                                                                    label=''
                                                                    nextField={'is_unit_price'}
                                                                    name={'bonus_from_stock'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('StockHistory')}
                                                                    label=''
                                                                    nextField={'condition_sales'}
                                                                    name={'is_stock_history'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_stock_history'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_stock_history}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('StockHistory')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box pt={'8'} pb={'12'} mt={'8'} ta="center" bg={'gray.2'}>
                                                        <Title order={6} pt={'4'}>{t('ManageOthers')}</Title>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('ConditionSales')}
                                                                    label=''
                                                                    nextField={'store_ledger'}
                                                                    name={'condition_sales'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('StoreLedger')}
                                                                    label=''
                                                                    nextField={'is_marketing_executive'}
                                                                    name={'store_ledger'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'store_ledger'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.store_ledger}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('StoreLedger')}</Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('MarketingExecutive')}
                                                                    label=''
                                                                    nextField={'fuel_station'}
                                                                    name={'is_marketing_executive'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
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
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('TloCommision')}
                                                                    label=''
                                                                    nextField={'sales_return'}
                                                                    name={'tlo_commission'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'tlo_commission'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.tlo_commission}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('TloCommision')}</Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('SRCommision')}
                                                                    label=''
                                                                    nextField={'due_sales_without_customer'}
                                                                    name={'sr_commission'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'sr_commission'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.sr_commission}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('SRCommision')}</Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                    <Box mt={'xs'} mb={'xs'}>
                                                        <Grid gutter={{base: 1}}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('isActiveSms')}
                                                                    label=''
                                                                    nextField={'EntityFormSubmit'}
                                                                    name={'is_active_sms'}
                                                                    form={form}
                                                                    color='var(--theme-primary-color-6)'
                                                                    id={'is_active_sms'}
                                                                    position={'left'}
                                                                    defaultChecked={configData.is_active_sms}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={6} fz={'sm'}
                                                                      pt={'1'}>{t('isActiveSms')}</Grid.Col>
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
                )
            }
        </Box>
    );
}

export default ConfigurationForm;
