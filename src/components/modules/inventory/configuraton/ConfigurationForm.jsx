import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Switch,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRestore,
} from "@tabler/icons-react";
import {getHotkeyHandler, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import {
    getCustomerDropdown,
} from "../../../../store/core/utilitySlice";
import {setFetching, storeEntityData} from "../../../../store/core/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import ImageUploadDropzone from "../../../form-builders/ImageUploadDropzone.jsx";

function ConfigurationForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 132; //TabList height 104
    const navigate = useNavigate();

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);

    const [businessModelData, setBusinessModelData] = useState(null);
    const BusinessModelDropdown = ['Model 1','Model 2']

    const [stockFormatData, setStockFormatData] = useState(null);
    const StockFormatDropdown = ['Stock Fotmat 1','Stock Fotmat 2']

    const customerDropdownData = useSelector((state) => state.utilitySlice.customerDropdownData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    let customerDropdown = customerDropdownData && customerDropdownData.length > 0 ?
        customerDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        dispatch(getCustomerDropdown('core/select/customer'))
    }, []);

    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({min: 2, max: 20}),
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => (!/^\d+$/.test(value)),
            // tp_percent: (value) => (value && !/^\d*\.?\d*$/.test(value)),
            // email: (value) => (value && !/^\S+@\S+$/.test(value)),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('CompanyName').focus()
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

                        const value = {
                            url: 'vendor',
                            data: values
                        }

                        dispatch(storeEntityData(value))

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
                            setCustomerData(null)
                            dispatch(setFetching(true))
                        }, 700)
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
                                <Grid.Col span={'auto'}>
                                    <ScrollArea h={height} scrollbarSize={2} type="never">
                                        <Box pb={'md'}>

                                            <SelectForm
                                                tooltip={t('ChooseBusinessModel')}
                                                label={t('BusinessModel')}
                                                placeholder={t('ChooseBusinessModel')}
                                                required={true}
                                                nextField={'VatPercent'}
                                                name={'business_model'}
                                                form={form}
                                                dropdownValue={BusinessModelDropdown}
                                                mt={0}
                                                id={'BusinessModel'}
                                                searchable={true}
                                                value={businessModelData}
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
                                            <ImageUploadDropzone />
                                        </Box>
                                    </ScrollArea>
                                </Grid.Col>
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
                            <Grid columns={24}>
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
                            </Grid>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Box pb={`xs`} pl={`xs`} pr={8}>
                            <Grid>
                                <Grid.Col span={6} h={54}>
                                    <Title order={6} mt={'xs'} pl={'6'}>{t('VendorInformation')}</Title>
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
                                                {/*<LoadingOverlay
                                            visible={saveCreateLoading}
                                            zIndex={1000}
                                            overlayProps={{radius: "xs", blur: 2}}
                                            size={'xs'}
                                            position="center"
                                        />*/}

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
                                <Grid.Col span={'auto'}>
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

                                            <SelectForm
                                                tooltip={t('ChooseCustomer')}
                                                label={t('ChooseCustomer')}
                                                placeholder={t('ChooseCustomer')}
                                                required={false}
                                                nextField={'Address'}
                                                name={'customer_id'}
                                                form={form}
                                                dropdownValue={customerDropdown}
                                                mt={8}
                                                id={'ChooseCustomer'}
                                                searchable={true}
                                                value={customerData}
                                                changeValue={setCustomerData}
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
