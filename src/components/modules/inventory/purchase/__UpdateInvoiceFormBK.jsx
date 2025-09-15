import React, { useEffect, useState } from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
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
    IconEyeEdit, IconDiscountOff, IconCurrency, IconPlusMinus, IconCheck,

} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

import {updateEntityData} from "../../../../store/inventory/crudSlice.js";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import { notifications } from "@mantine/notifications";
import _VendorViewModel from "../../core/vendor/_VendorViewModel.jsx";
import useVendorDataStoreIntoLocalStorage from "../../../global-hook/local-storage/useVendorDataStoreIntoLocalStorage.js";
import _PurchaseDrawerForPrint from './print-drawer/_PurchaseDrawerForPrint.jsx'

function __UpdateInvoiceForm(props) {
    let { id } = useParams();
    const { currencySymbol,editedData,tempCardProducts } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const navigate = useNavigate()
    const transactionModeData = JSON.parse(localStorage.getItem('accounting-transaction-mode')) ? JSON.parse(localStorage.getItem('accounting-transaction-mode')) : [];

    const [purchaseSubTotalAmount, setPurchaseSubTotalAmount] = useState(0);
    const [purchaseVatAmount, setPurchaseVatAmount] = useState(0);
    const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);
    const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);
    const [purchaseDueAmount, setPurchaseDueAmount] = useState(props.purchaseSubTotalAmount);
    const [hoveredModeId, setHoveredModeId] = useState(false);
    const [lastClicked, setLastClicked] = useState(null);

    const handleClick = (event) => {
        setLastClicked(event.currentTarget.name);
    };

    const formHeight = mainAreaHeight - 268; //TabList height 104
    const [viewVendorModel, setVendorViewModel] = useState(false);

    /*START GET VENDOR DATA BY ID FROM LOCAL STORAGE*/
    const [vendorData, setVendorData] = useState(editedData?.vendor_id.toString());

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

    const [discountType, setDiscountType] = useState(editedData.discount_type);
    const [orderProcess, setOrderProcess] = useState(editedData?.process.toString());


    /*START GET VENDOR DROPDOWN FROM LOCAL STORAGE*/
    const [vendorsDropdownData, setVendorsDropdownData] = useState([])
    const [refreshVendorDropdown, setRefreshVendorDropdown] = useState(false)

    useEffect(() => {
        const fetchVendors = async () => {
            await useVendorDataStoreIntoLocalStorage()
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
            vendor_id: editedData?.vendor_id,
            transaction_mode_id: editedData?.transaction_mode_id,
            order_process: editedData?.order_process,
            narration: editedData?.remark,
            discount: discountType === 'Flat' ? editedData?.discount : editedData?.discount_calculation,
            payment: editedData?.payment
        },
        validate: {
            transaction_mode_id: isNotEmpty(),
            vendor_id: isNotEmpty(),
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
        let receiveAmount = form.values.payment == '' ? 0 : form.values.payment
        if (receiveAmount >= 0) {
            const text = purchaseTotalAmount < receiveAmount ? 'Return' : 'Due';
            setReturnOrDueText(text);
            returnOrDueAmount = purchaseTotalAmount - receiveAmount;
            setPurchaseDueAmount(returnOrDueAmount);
        }
    }, [form.values.discount, discountType, form.values.payment, purchaseSubTotalAmount, purchaseTotalAmount]);


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
    const [openInvoiceDrawerForPrint, setOpenInvoiceDrawerForPrint] = useState(false)
    const entityUpdateData = useSelector((state) => state.inventoryCrudSlice.entityUpdateData);

    useEffect(() => {
        if (entityUpdateData?.data?.id && (lastClicked === 'print' || lastClicked === 'pos')) {
            setTimeout(() => {
                setOpenInvoiceDrawerForPrint(true)
            }, 400);
        }
    }, [entityUpdateData, dispatch, lastClicked]);

    return (
        <>

                {
                openInvoiceDrawerForPrint &&
                <_PurchaseDrawerForPrint
                    setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint}
                    openInvoiceDrawerForPrint={openInvoiceDrawerForPrint}
                    printType={lastClicked}
                    mode="update"
                />
            }
            <form onSubmit={form.onSubmit((values) => {
                let createdBy = JSON.parse(localStorage.getItem('user'));
                let transformedArray = tempCardProducts.map(product => {
                    return {
                        "product_id": product.product_id,
                        "quantity": product.quantity,
                        "purchase_price": product.purchase_price,
                        "sales_price": product.sales_price,
                        "sub_total": product.sub_total,
                        "bonus_quantity": product.bonus_quantity,
                        "warehouse_id": product.warehouse_id
                    }
                });

                const formValue = {}
                formValue['vendor_id'] = form.values.vendor_id;
                formValue['sub_total'] = purchaseSubTotalAmount;
                formValue['transaction_mode_id'] = form.values.transaction_mode_id;
                formValue['discount_type'] = discountType;
                formValue['discount'] = purchaseDiscountAmount;
                formValue['discount_calculation'] = discountType === 'Percent' ? form.values.discount : 0;
                formValue['vat'] = 0;
                formValue['total'] = purchaseTotalAmount;
                formValue['payment'] = form.values.payment;
                formValue['created_by_id'] = Number(createdBy['id']);
                formValue['process'] = orderProcess;
                formValue['narration'] = form.values.narration;
                formValue['items'] = transformedArray ? transformedArray : [];

                if (transformedArray && transformedArray.length > 0) {
                    const data = {
                        url: 'inventory/purchase/' + id,
                        data: formValue
                    }
                    dispatch(updateEntityData(data))

                    notifications.show({
                        color: 'teal',
                        title: t('UpdatedSuccessfully'),
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 700,
                        style: { backgroundColor: 'lightgray' },
                    });

                    if (lastClicked === 'save') {
                        navigate('/inventory/purchase')
                    }
                } else {
                    notifications.show({
                        color: 'red',
                        title: t('PleaseChooseItems'),
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 700,
                        style: { backgroundColor: 'lightgray' },
                    });
                }

            })}>
                <Box>
                    <Grid columns={48} >
                        <Box className={'borderRadiusAll'}  >
                            <Box>
                                <Box pl={'xs'} pr={'xs'} pb={'xs'} className={'boxBackground'}>
                                    <Grid gutter={{ base: 6 }}>
                                        <Grid.Col span={12}  >
                                            <Box pt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('PurchaseValidateMessage')}
                                                    label=''
                                                    placeholder={t('Vendor')}
                                                    required={false}
                                                    nextField={'payment'}
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
                                        {/* <Grid.Col span={1}>
                                            <_addVendor
                                                setRefreshVendorDropdown={setRefreshVendorDropdown}
                                                focusField={'purchase_vendor_id'}
                                                fieldPrefix="purchase_"
                                            />
                                        </Grid.Col> */}
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
                                        <Center fz={'xs'} c="dimmed">{t('Vat')}</Center>
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
                                        color='var(--theme-primary-color-6)'
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
                                                                    defaultChecked={editedData?.transaction_mode_id ? editedData?.transaction_mode_id == mode.id : (mode.is_selected ? true : false)}

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
                                        <Grid.Col span={2}>

                                        </Grid.Col>
                                        <Grid.Col span={7}><Center fz={'md'} mt={'4'} c={'red'}
                                            fw={'800'}>{returnOrDueText === 'Due' ? t('Due') : t('Return')} {currencySymbol} {purchaseDueAmount.toFixed(2)}</Center></Grid.Col>
                                    </Grid>
                                    <Box mt={'xs'} h={1} bg={`red.3`}></Box>
                                    <Grid gutter={{ base: 6 }} mt={'xs'}>
                                        <Grid.Col span={4}>
                                            <Button
                                                fullWidth={true}
                                                onClick={() => {
                                                    setDiscountType(discountType === 'Flat' ? 'Percent' : 'Flat')
                                                }}
                                                variant="filled"
                                                fz={'xs'}
                                                leftSection={
                                                    discountType === 'Flat' ? <IconCurrencyTaka size={14} /> :
                                                        <IconPercentage size={14} />
                                                } color="red.4">
                                                {discountType === 'Flat' ? t('Flat') : t('Percent')}
                                            </Button>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <InputButtonForm
                                                tooltip={t('DiscountValidateMessage')}
                                                label=''
                                                placeholder={t('Discount')}
                                                required={false}
                                                nextField={'payment'}
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
                                                name={'payment'}
                                                id={'payment'}
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
                                <Button.Group >
                                    <Button
                                        fullWidth={true}
                                        variant="filled"
                                        leftSection={<IconStackPush size={14} />}
                                        color="orange.5"
                                    >
                                        Hold
                                    </Button>
                                    <Button
                                        fullWidth={true}
                                        type={'submit'}
                                        onClick={handleClick}
                                        variant="filled"
                                        leftSection={<IconPrinter size={14} />}
                                        color="green.5"
                                        // disabled={isDisabled}
                                        name="print"
                                        style={{
                                            transition: "all 0.3s ease",
                                            // backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        {t('Print')}
                                    </Button>
                                    <Button
                                        fullWidth={true}
                                        type={'submit'}
                                        variant="filled"
                                        leftSection={<IconReceipt size={14} />}
                                        color="red.5"
                                        name="pos"
                                        onClick={handleClick}
                                        // disabled={isDisabled}
                                        style={{
                                            transition: "all 0.3s ease",
                                            // backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        {t('Pos')}
                                    </Button>
                                    <Button
                                        fullWidth={true}
                                        type={'submit'}
                                        variant="filled"
                                        leftSection={<IconDeviceFloppy size={14} />}
                                        color="cyan.5"
                                        name="save"
                                        onClick={handleClick}
                                        // disabled={isDisabled}
                                        style={{
                                            transition: "all 0.3s ease",
                                            // backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        {t('Save')}
                                    </Button>
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

export default __UpdateInvoiceForm;
