import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,Switch,
    Grid, Box, ScrollArea, Group, Text, Title
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import ImageUploadDropzone from "../../../form-builders/ImageUploadDropzone.jsx";
import {getSettingDropdown} from "../../../../store/utility/utilitySlice.js";
import {
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData,
    getShowEntityData,
    updateEntityData,

} from "../../../../store/inventory/crudSlice.js";

function ConfigurationForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 132; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [businessModelData, setBusinessModelData] = useState(null);

    const businessModelDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown)
    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData)

    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    let businessModelDropdown = businessModelDropdownData && businessModelDropdownData.length > 0 ?
        businessModelDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        const value = {
            url : 'utility/select/setting',
            param : {
                'dropdown-type' : 'business-model'
            }
        }
        dispatch(getSettingDropdown(value))
        dispatch(getShowEntityData('inventory/config'))
    }, []);

    const form = useForm({
        initialValues: {
            business_model_id:'',
            vat_percent:'',
            ait_percent:'',
            address:'',
            invoice_comment:''
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

        if (validationMessage.message ==='success'){
            notifications.show({
                color: 'teal',
                title: t('UpdateSuccessfully'),
                icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                loading: false,
                autoClose: 700,
                style: {backgroundColor: 'lightgray'},
            });

            setTimeout(() => {
                // setSaveCreateLoading(false)
            }, 700)
        }
    }, [validation,validationMessage]);

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])

    useEffect(() => {

        form.setValues({
            business_model_id: showEntityData.business_model_id?showEntityData.business_model_id:'',
            vat_percent: showEntityData.vat_percent?showEntityData.vat_percent:'',
            ait_percent: showEntityData.ait_percent?showEntityData.ait_percent:'',
            address: showEntityData.address?showEntityData.address:'',
            invoice_comment: showEntityData.invoice_comment?showEntityData.invoice_comment:'',
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
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
                // dispatch(setValidationData(false))
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a
                            modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        // setSaveCreateLoading(true)
                        const value = {
                            url: 'inventory/config-update',
                            data: values
                        }

                        dispatch(updateEntityData(value))

                    },
                });
            })}>
                <Grid>
                    <Grid.Col span={4}>
                        <Box pb={`xs`} pl={`xs`} pr={8}>
                            <Grid>
                                <Grid.Col span={12} h={54}>
                                    <Title order={6} mt={'xs'} pl={'6'}>{t('ConfigurationInformation')}</Title>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Box  h={1} bg={`gray.3`}></Box>
                        <Box m={'md'}>
                            <Grid columns={24}>

                            </Grid>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Box pb={`xs`} pl={`xs`} pr={8}>
                            <Grid>
                                <Grid.Col span={12} h={54}>
                                    <Title order={6} mt={'xs'} pl={'6'}>{t('SetupInformation')}</Title>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Box  h={1} bg={`gray.3`}></Box>
                        <Box m={'md'}>
                            {/*<Grid columns={24}>
                                <Grid.Col span={'auto'}>
                                    <ScrollArea h={height} scrollbarSize={2} type="never">
                                        <Box pb={'md'}>

                                            <SwitchForm
                                                tooltip={t('PrintSetup')}
                                                label={t('PrintSetup')}
                                                nextField={'CustomInvoice'}
                                                name={'print_setup'}
                                                form={form}
                                                mt={12}
                                                id={'PrintSetup'}
                                                position={'right'}
                                                // defaultChecked={!!(formLoading && entityEditData.status === 1)}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('CustomInvoice')}
                                                label={t('CustomInvoice')}
                                                nextField={'BonusFromStock'}
                                                name={'custom_invoice'}
                                                form={form}
                                                mt={12}
                                                id={'CustomInvoice'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('BonusFromStock')}
                                                label={t('BonusFromStock')}
                                                nextField={'IsDescription'}
                                                name={'bonus_from_stock'}
                                                form={form}
                                                mt={12}
                                                id={'BonusFromStock'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('IsDescription')}
                                                label={t('IsDescription')}
                                                nextField={'ZeroStockAllowed'}
                                                name={'is_description'}
                                                form={form}
                                                mt={12}
                                                id={'IsDescription'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('ZeroStockAllowed')}
                                                label={t('ZeroStockAllowed')}
                                                nextField={'StockItem'}
                                                name={'zero_stock_allowed'}
                                                form={form}
                                                mt={12}
                                                id={'ZeroStockAllowed'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('StockItem')}
                                                label={t('StockItem')}
                                                nextField={'CustomInvoicePrint'}
                                                name={'stock_item'}
                                                form={form}
                                                mt={12}
                                                id={'StockItem'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('CustomInvoicePrint')}
                                                label={t('CustomInvoicePrint')}
                                                nextField={'StockHistory'}
                                                name={'custom_invoice_print'}
                                                form={form}
                                                mt={12}
                                                id={'CustomInvoicePrint'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('StockHistory')}
                                                label={t('StockHistory')}
                                                nextField={'ConditionSales'}
                                                name={'stock_history'}
                                                form={form}
                                                mt={12}
                                                id={'StockHistory'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('ConditionSales')}
                                                label={t('ConditionSales')}
                                                nextField={'StoreLedger'}
                                                name={'condition_sales'}
                                                form={form}
                                                mt={12}
                                                id={'ConditionSales'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('StoreLedger')}
                                                label={t('StoreLedger')}
                                                nextField={'MarketingExecutive'}
                                                name={'store_ledger'}
                                                form={form}
                                                mt={12}
                                                id={'StoreLedger'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('MarketingExecutive')}
                                                label={t('MarketingExecutive')}
                                                nextField={'FuelStation'}
                                                name={'marketing_executive'}
                                                form={form}
                                                mt={12}
                                                id={'MarketingExecutive'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('FuelStation')}
                                                label={t('FuelStation')}
                                                nextField={'TLOCommission'}
                                                name={'fuel_station'}
                                                form={form}
                                                mt={12}
                                                id={'FuelStation'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('TLOCommission')}
                                                label={t('TLOCommission')}
                                                nextField={'SalesReturn'}
                                                name={'tlo_commission'}
                                                form={form}
                                                mt={12}
                                                id={'TLOCommission'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('SalesReturn')}
                                                label={t('SalesReturn')}
                                                nextField={'SRCommission'}
                                                name={'sales_return'}
                                                form={form}
                                                mt={12}
                                                id={'SalesReturn'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                            <SwitchForm
                                                tooltip={t('SRCommission')}
                                                label={t('SRCommission')}
                                                nextField={'SRCommission'}
                                                name={'sr_commission'}
                                                form={form}
                                                mt={12}
                                                id={'SRCommission'}
                                                position={'right'}
                                                defaultChecked={1}
                                            />

                                        </Box>
                                    </ScrollArea>
                                </Grid.Col>
                            </Grid>*/}
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Box pb={`xs`} pl={`xs`} pr={8}>
                            <Grid>
                                <Grid.Col span={6} h={54}>
                                    <Title order={6} mt={'xs'} pl={'6'}>{t('ConfigurationInformation')}</Title>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Group mr={'md'} pos={`absolute`} right={0}  gap={0}>
                                        <>
                                            {!saveCreateLoading &&
                                            <Button
                                                size="xs"
                                                color={`indigo.6`}
                                                type="submit"
                                                mt={4}
                                                mr={'xs'}
                                                id="VendorFormSubmit"
                                                leftSection={<IconDeviceFloppy size={16}/>}
                                            >

                                                <Flex direction={`column`} gap={0}>
                                                    <Text fz={12} fw={400}>
                                                        {t("CreateAndSave")}
                                                    </Text>
                                                </Flex>
                                            </Button>
                                            }
                                        </>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                        </Box>
                        <Box  h={1} bg={`gray.3`}></Box>
                        <Box m={'md'}>
                            <Grid columns={24}>
                                {/*<Grid.Col span={'auto'}>
                                    <ScrollArea h={height} scrollbarSize={2} type="never">
                                        <Box pb={'md'}>
                                            <InputForm
                                                tooltip={t('CompanyNameValidateMessage')}
                                                label={t('CompanyName')}
                                                placeholder={t('CompanyName')}
                                                required={true}
                                                nextField={'VendorName'}
                                                form={form}
                                                name={'company_name'}
                                                mt={0}
                                                id={'CompanyName'}
                                            />

                                            <InputForm
                                                form={form}
                                                tooltip={t('VendorNameValidateMessage')}
                                                label={t('VendorName')}
                                                placeholder={t('VendorName')}
                                                required={true}
                                                name={'name'}
                                                id={'VendorName'}
                                                nextField={'VendorMobile'}
                                                mt={8}
                                            />

                                            <InputForm
                                                form={form}
                                                tooltip={t('MobileValidateMessage')}
                                                label={t('VendorMobile')}
                                                placeholder={t('VendorMobile')}
                                                required={true}
                                                name={'mobile'}
                                                id={'VendorMobile'}
                                                nextField={'TPPercent'}
                                                mt={8}
                                            />

                                            <InputForm
                                                tooltip={t('TPPercentValidateMessage')}
                                                label={t('TPPercent')}
                                                placeholder={t('TPPercent')}
                                                required={false}
                                                nextField={'Email'}
                                                name={'tp_percent'}
                                                form={form}
                                                mt={8}
                                                id={'TPPercent'}
                                            />

                                            <InputForm
                                                form={form}
                                                tooltip={t('RequiredAndInvalidEmail')}
                                                label={t('Email')}
                                                placeholder={t('Email')}
                                                required={false}
                                                name={'email'}
                                                id={'Email'}
                                                nextField={'ChooseCustomer'}
                                                mt={8}
                                            />



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
                                    </ScrollArea>
                                </Grid.Col>*/}
                                <Grid.Col span={'auto'}>
                                    <ScrollArea h={height} scrollbarSize={2} type="never">
                                        <Box pb={'md'}>
                                            <SelectForm
                                                tooltip={t('ChooseBusinessModel')}
                                                label={t('BusinessModel')}
                                                placeholder={t('ChooseBusinessModel')}
                                                required={true}
                                                nextField={'VatPercent'}
                                                name={'business_model_id'}
                                                form={form}
                                                dropdownValue={businessModelDropdown}
                                                mt={0}
                                                id={'BusinessModel'}
                                                searchable={true}
                                                value={businessModelData ? String(businessModelData) : (showEntityData.business_model_id ? String(showEntityData.business_model_id) : null)}
                                                changeValue={setBusinessModelData}
                                            />
                                            <InputForm
                                                tooltip={t('VatPercentValidateMessage')}
                                                label={t('VatPercent')}
                                                placeholder={t('VatPercent')}
                                                form={form}
                                                required={false}
                                                name={'vat_percent'}
                                                id={'VatPercent'}
                                                nextField={'AITPercent'}
                                                mt={8}
                                            />

                                            <InputForm
                                                tooltip={t('AITPercentValidateMessage')}
                                                label={t('AITPercent')}
                                                placeholder={t('AITPercent')}
                                                required={false}
                                                name={'ait_percent'}
                                                form={form}
                                                mt={8}
                                                id={'AITPercent'}
                                                nextField={'Address'}
                                            />

                                            <TextAreaForm
                                                form={form}
                                                tooltip={t('AddressValidateMessage')}
                                                label={t('Address')}
                                                placeholder={t('Address')}
                                                required={false}
                                                name={'address'}
                                                id={'Address'}
                                                nextField={'InvoiceComment'}
                                                mt={8}
                                            />

                                            <TextAreaForm
                                                tooltip={t('InvoiceCommentValidateMessage')}
                                                label={t('InvoiceComment')}
                                                placeholder={t('InvoiceComment')}
                                                required={false}
                                                nextField={'InvoiceComment'}
                                                name={'invoice_comment'}
                                                form={form}
                                                mt={8}
                                                id={'InvoiceComment'}
                                            />
                                            {/*<ImageUploadDropzone />*/}
                                        </Box>
                                    </ScrollArea>
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Shortcut
                                        form={form}
                                        FormSubmit={'VendorFormSubmit'}
                                        Name={'CompanyName'}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>

    );
}
export default ConfigurationForm;
