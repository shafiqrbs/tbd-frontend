import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy,
    IconStackPush,
    IconPrinter,
    IconReceipt,
    IconPercentage,
    IconCurrencyTaka,
    IconEyeEdit, IconDiscountOff, IconCurrency, IconPlusMinus, IconCheck, IconCalendar,

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

import { storeEntityData } from "../../../../store/inventory/crudSlice.js";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import { notifications } from "@mantine/notifications";
import _VendorViewModel from "../../core/vendor/_VendorViewModel.jsx";
import _addVendor from "../../popover-form/_addVendor.jsx";
import vendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";
import DatePickerForm from "../../../form-builders/DatePicker.jsx";

function __PurchaseForm(props) {
    const { currencySymbol } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const transactionModeData = JSON.parse(localStorage.getItem('accounting-transaction-mode')) ? JSON.parse(localStorage.getItem('accounting-transaction-mode')) : [];

    const [purchaseSubTotalAmount, setPurchaseSubTotalAmount] = useState(0);
    const [purchaseVatAmount, setPurchaseVatAmount] = useState(0);
    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);
    const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);
    const [purchaseDueAmount, setPurchaseDueAmount] = useState(props.purchaseSubTotalAmount);
    const [hoveredModeId, setHoveredModeId] = useState(false);

    const formHeight = mainAreaHeight - 268; //TabList height 104
    const [viewVendorModel, setVendorViewModel] = useState(false);

    /*START GET VENDOR DATA BY ID FROM LOCAL STORAGE*/
    const [vendorData, setVendorData] = useState(null);
    const [vendorObject, setVendorObject] = useState({});
    useEffect(() => {
        if (vendorData) {
            const coreVendors = JSON.parse(localStorage.getItem('core-vendors') || '[]');
            const foundVendors = coreVendors.find(type => type.id == vendorData);

            if (foundVendors) {
                setVendorObject(foundVendors);
            }
        }
    }, [vendorData]);
    /*END GET VENDOR DATA BY ID FROM LOCAL STORAGE*/


    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)
    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);


    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-purchase-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    }, [loadCardProducts])

    const [orderProcess, setOrderProcess] = useState(null);

    /*START GET VENDOR DROPDOWN FROM LOCAL STORAGE*/
    const [vendorsDropdownData, setVendorsDropdownData] = useState([])
    const [refreshVendorDropdown, setRefreshVendorDropdown] = useState(false)

    useEffect(() => {
        const fetchVendors = async () => {
            await vendorDataStoreIntoLocalStorage()
            let coreVendors = localStorage.getItem('core-vendors');
            coreVendors = coreVendors ? JSON.parse(coreVendors) : []

            if (coreVendors && coreVendors.length > 0) {
                const transformedData = coreVendors.map(type => {
                    return ({'label': type.mobile + ' -- ' + type.name, 'value': String(type.id)})
                });
                setVendorsDropdownData(transformedData);
            }
            setRefreshVendorDropdown(false);
        }
        fetchVendors()
    }, [refreshVendorDropdown])
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/


    const form = useForm({
        initialValues: {
            vendor_id: '',
            transaction_mode_id: '',
            order_process: '',
            narration: '',
            discount: '',
            receive_amount: ''
        },
        validate: {
            vendor_id: isNotEmpty(),
            transaction_mode_id: isNotEmpty(),
            order_process: isNotEmpty()
        }
    });

    /*START FOR TRANSACTION MODE DEFAULT SELECT*/
    useEffect(() => {
        if (transactionModeData && transactionModeData.length > 0) {
            for (let mode of transactionModeData) {
                if (mode.is_selected) {
                    form.setFieldValue('transaction_mode_id', form.values.transaction_mode_id ? form.values.transaction_mode_id : mode.id);
                    break;
                }
            }
        }
    }, [transactionModeData, form]);
    /*END FOR TRANSACTION MODE DEFAULT SELECT*/

    const [returnOrDueText, setReturnOrDueText] = useState('Due');

    useEffect(() => {
        setPurchaseSubTotalAmount(props.purchaseSubTotalAmount);
        setPurchaseDueAmount(props.purchaseSubTotalAmount);
    }, [props.purchaseSubTotalAmount]);

    useEffect(() => {
        const totalAmount = purchaseSubTotalAmount - purchaseDiscountAmount;
        setPurchaseTotalAmount(totalAmount);
        setPurchaseDueAmount(totalAmount);
    }, [purchaseSubTotalAmount, purchaseDiscountAmount]);

    /**
     * Discount calculation with due or return amount
     */
    useEffect(() => {
        let discountAmount = 0;
        if (form.values.discount && Number(form.values.discount) > 0) {
            if (discountType === 'Flat') {
                discountAmount = form.values.discount;
            } else if (discountType === 'Percent') {
                discountAmount = (purchaseSubTotalAmount * form.values.discount) / 100;
            }
        }
        setPurchaseDiscountAmount(discountAmount);

        let returnOrDueAmount = 0;
        let receiveAmount = form.values.receive_amount == '' ? 0 : form.values.receive_amount
        if (receiveAmount >= 0) {
            const text = purchaseTotalAmount < receiveAmount ? 'Return' : 'Due';
            setReturnOrDueText(text);
            returnOrDueAmount = purchaseTotalAmount - receiveAmount;
            setPurchaseDueAmount(returnOrDueAmount);
        }
    }, [form.values.discount, discountType, form.values.receive_amount, purchaseSubTotalAmount, purchaseTotalAmount]);


    useHotkeys([['alt+n', () => {
        document.getElementById('vendor_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const inputGroupCurrency = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {currencySymbol}
        </Text>
    );

    return (
        <>
            <form onSubmit={form.onSubmit((values) => {
                const tempProducts = localStorage.getItem('temp-purchase-products');
                let items = tempProducts ? JSON.parse(tempProducts) : [];
                let createdBy = JSON.parse(localStorage.getItem('user'));
                let transformedArray = items.map(product => {
                    return {
                        "product_id": product.product_id,
                        "quantity": product.quantity,
                        "purchase_price": product.purchase_price,
                        "sales_price": product.sales_price,
                        "sub_total": product.sub_total
                    }
                });

                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };
                const formValue = {}
                formValue['vendor_id'] = form.values.vendor_id;
                formValue['sub_total'] = purchaseSubTotalAmount;
                formValue['transaction_mode_id'] = form.values.transaction_mode_id;
                formValue['discount_type'] = discountType;
                formValue['discount'] = purchaseDiscountAmount;
                formValue['discount_calculation'] = discountType === 'Percent' ? form.values.discount : 0;
                formValue['vat'] = 0;
                formValue['total'] = purchaseTotalAmount;
                formValue['payment'] = form.values.receive_amount;
                formValue['created_by_id'] = Number(createdBy['id']);
                formValue['process'] = form.values.order_process;
                formValue['narration'] = form.values.narration;
                formValue['invoice_date'] = form.values.invoice_date && new Date(form.values.invoice_date).toLocaleDateString("en-CA", options)
                formValue['items'] = transformedArray ? transformedArray : [];

                const data = {
                    url: 'inventory/purchase',
                    data: formValue
                }

                dispatch(storeEntityData(data))
                notifications.show({
                    color: 'teal',
                    title: t('CreateSuccessfully'),
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 700,
                    style: { backgroundColor: 'lightgray' },
                });

                setTimeout(() => {
                    localStorage.removeItem('temp-purchase-products');
                    form.reset()
                    setVendorData(null)
                    setOrderProcess(null)
                    props.setLoadCardProducts(true)
                }, 700)

            })}>
                <Box>
                    <Grid columns={48} >
                        <Box className={'borderRadiusAll'}  >
                            <Box>
                                <Box pl={'xs'} pr={'xs'} pb={'xs'} className={'boxBackground'}>
                                    <Grid gutter={{ base: 6 }}>
                                        <Grid.Col span={11}  >
                                            <Box pt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('PurchaseValidateMessage')}
                                                    label=''
                                                    placeholder={t('Vendor')}
                                                    required={false}
                                                    nextField={'receive_amount'}
                                                    name={'vendor_id'}
                                                    form={form}
                                                    dropdownValue={vendorsDropdownData}
                                                    id={'purchase_vendor_id'}
                                                    mt={1}
                                                    searchable={true}
                                                    value={vendorData}
                                                    changeValue={setVendorData}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <_addVendor
                                                setRefreshVendorDropdown={setRefreshVendorDropdown}
                                                focusField={'purchase_vendor_id'}
                                                fieldPrefix="purchase_"
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box>
                                    <Grid gutter={{ base: 6 }} className={'titleBackground'}>
                                        <Grid.Col span={6}>
                                            <Box pl={'xl'} pb={'6'}>
                                                <Text fz={'md'} order={1} fw={'800'}>1200000</Text>
                                                <Text fz={'xs'} c="dimmed" >{t('Outstanding')}</Text>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={6} >
                                            <Text mt={'8'} mr={'xl'} style={{ textAlign: 'right', float: 'right' }}>
                                                <Group>
                                                    <Tooltip
                                                        multiline
                                                        bg={'orange.8'}
                                                        position="top"
                                                        withArrow
                                                        transitionProps={{ duration: 200 }}
                                                        label={vendorData ? t('VendorDetails') : t('ChooseVendor')}
                                                    >
                                                        <ActionIcon
                                                            variant="filled"
                                                            color={'red'}
                                                            disabled={!vendorData}
                                                            onClick={setVendorViewModel}
                                                        >
                                                            <IconEyeEdit
                                                                size={18}
                                                                stroke={1.5}
                                                            />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Text>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                            <Box p={'xs'}>
                                <Grid gutter={{ base: 4 }}>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}>{currencySymbol} {purchaseSubTotalAmount && Number(purchaseSubTotalAmount).toFixed(2)}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}> {currencySymbol} {purchaseDiscountAmount && Number(purchaseDiscountAmount).toFixed(2)}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}>  {currencySymbol} {purchaseVatAmount.toFixed(2)}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}>{currencySymbol} {purchaseTotalAmount.toFixed(2)}</Center>
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{ base: 4 }}>
                                    <Grid.Col span={3}>
                                        <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{ base: 4 }}>
                                    <Grid.Col span={3}>
                                        <Center fz={'xs'} c="dimmed" >{t('SubTotal')}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'xs'} c="dimmed" >{t('Discount')}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'xs'} c="dimmed">{t('VAT')}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'xs'} c="dimmed">{t('Total')}</Center>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <ScrollArea h={formHeight} scrollbarSize={2} type="never" bg={'gray.1'}>
                                <Box pl={'xs'} pt={'xs'} pr={'xs'} bg={`white`}>
                                    <Tooltip
                                        label={t('ChooseTransactionMode')}
                                        opened={form.errors.transaction_mode_id === true}
                                        px={16}
                                        py={2}
                                        position="top-end"
                                        color="red"
                                        withArrow
                                        offset={2}
                                        zIndex={0}
                                        transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                                    >

                                        <Grid columns={'16'} gutter="6">

                                            {
                                                (transactionModeData && transactionModeData.length > 0) && transactionModeData.map((mode, index) => {
                                                    return (
                                                        <Grid.Col span={4}>
                                                            <Box bg={'gray.1'} h={'82'}>
                                                                <input
                                                                    type="radio"
                                                                    name="transaction_mode_id"
                                                                    id={'transaction_mode_id_' + mode.id}
                                                                    className="input-hidden"
                                                                    value={mode.id}
                                                                    onChange={(e) => {
                                                                        form.setFieldValue('transaction_mode_id', e.currentTarget.value)
                                                                        form.setFieldError('transaction_mode_id', null)
                                                                    }}
                                                                    defaultChecked={mode.is_selected ? true : false}
                                                                />
                                                                <Tooltip
                                                                    label={mode.name}
                                                                    opened={hoveredModeId === mode.id}
                                                                    position="top"
                                                                    offset={35}
                                                                    withArrow
                                                                    arrowSize={8}
                                                                >
                                                                    <label
                                                                        htmlFor={'transaction_mode_id_' + mode.id}
                                                                        onMouseEnter={() => {
                                                                            setHoveredModeId(mode.id)
                                                                        }}
                                                                        onMouseLeave={() => {
                                                                            setHoveredModeId(null)
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={mode.path}
                                                                            alt={mode.method_name}
                                                                        />
                                                                        <Center fz={'xs'} className={'textColor'} >{mode.authorized_name}</Center>
                                                                    </label>
                                                                </Tooltip>
                                                            </Box>
                                                        </Grid.Col>
                                                    );
                                                })}

                                        </Grid>
                                    </Tooltip>

                                </Box>

                                <Box p={'xs'} className={'boxBackground'} mt={'4'} pt={'xs'} mb={'xs'} pb={'xs'} >
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={2}>

                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <DatePickerForm
                                                tooltip={t('InvoiceDateValidateMessage')}
                                                label=''
                                                placeholder={t('InvoiceDate')}
                                                required={false}
                                                nextField={'discount'}
                                                form={form}
                                                name={'invoice_date'}
                                                id={'invoice_date'}
                                                leftSection={<IconCalendar size={16} opacity={0.5} />}
                                                rightSection={<IconCalendar size={16} opacity={0.5} />}
                                                rightSectionWidth={30}
                                                closeIcon={true}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}><Center fz={'md'} mt={'4'} c={'red'}
                                            fw={'800'}>{returnOrDueText} {currencySymbol} {purchaseDueAmount.toFixed(2)}</Center></Grid.Col>
                                    </Grid>
                                    <Box mt={'xs'} h={1} bg={`red.3`}></Box>
                                    <Grid gutter={{ base: 6 }} mt={'xs'}>
                                        <Grid.Col span={4}>
                                            <Button
                                                fullWidth
                                                onClick={() => setDiscountType()}
                                                variant="filled"
                                                fz={'xs'}
                                                leftSection={
                                                    discountType === 'Flat' ? <IconCurrencyTaka size={14} /> :
                                                        <IconPercentage size={14} />
                                                } color="red.4">
                                                {discountType}
                                            </Button>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputButtonForm
                                                tooltip={t('DiscountValidateMessage')}
                                                label=''
                                                placeholder={t('Discount')}
                                                required={false}
                                                nextField={'receive_amount'}
                                                form={form}
                                                name={'discount'}
                                                id={'discount'}
                                                leftSection={<IconDiscountOff size={16} opacity={0.5} />}
                                                rightSection={inputGroupCurrency}
                                                rightSectionWidth={30}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputNumberForm
                                                type="number"
                                                tooltip={t('ReceiveAmountValidateMessage')}
                                                label=''
                                                placeholder={t('Amount')}
                                                required={false}
                                                nextField={'order_process'}
                                                form={form}
                                                name={'receive_amount'}
                                                id={'receive_amount'}
                                                rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                leftSection={<IconPlusMinus size={16} opacity={0.5} />}
                                                closeIcon={true}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box>
                                    <Box p={'xs'} >
                                        <SelectForm
                                            tooltip={t('ChooseOrderProcess')}
                                            label=''
                                            placeholder={t('OrderProcess')}
                                            required={true}
                                            name={'order_process'}
                                            form={form}
                                            dropdownValue={localStorage.getItem('order-process') ? JSON.parse(localStorage.getItem('order-process')) : []}
                                            id={'order_process'}
                                            nextField={'narration'}
                                            searchable={false}
                                            value={orderProcess}
                                            changeValue={setOrderProcess}
                                        />
                                    </Box>
                                    <Box p={'xs'} pt={'0'}>
                                        <TextAreaForm
                                            tooltip={t('Narration')}
                                            label=''
                                            placeholder={t('Narration')}
                                            required={false}
                                            nextField={'Status'}
                                            name={'narration'}
                                            form={form}
                                            mt={8}
                                            id={'narration'}
                                        />
                                    </Box>
                                </Box>

                            </ScrollArea>
                            <Box>
                                <Button.Group fullWidth>
                                    <Button fullWidth variant="filled" leftSection={<IconPrinter size={14} />}
                                        color="green.5">Print</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconReceipt size={14} />}
                                        color="red.5">Pos</Button>
                                    <Button type={'submit'} fullWidth variant="filled" leftSection={<IconDeviceFloppy size={14} />}
                                        color="cyan.5">Save</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconStackPush size={14} />}
                                        color="orange.5">Hold</Button>
                                </Button.Group>
                            </Box>
                        </Box>


                    </Grid>
                </Box>
            </form>


            {viewVendorModel && vendorData &&
                <_VendorViewModel
                    vendorViewModel={viewVendorModel}
                    setVendorViewModel={setVendorViewModel}
                    vendorObject={vendorObject}
                />
            }
        </>

    );
}

export default __PurchaseForm;
