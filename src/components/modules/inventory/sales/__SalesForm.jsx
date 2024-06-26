import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
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
    IconMessage,
    IconEyeEdit, IconDiscountOff, IconCurrency, IconPlusMinus, IconCheck, IconTallymark1,IconCalendar

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

import {getSalesDetails, storeEntityData,} from "../../../../store/inventory/crudSlice.js";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import { notifications } from "@mantine/notifications";
import _InvoiceForDomain359 from "./print-component/_InvoiceForDomain359.jsx";
import _SmsPurchaseModel from "./modal/_SmsPurchaseModel.jsx";
import _CustomerViewModel from "./modal/_CustomerViewModel.jsx";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import _addCustomer from "../../popover-form/_addCustomer.jsx";
import DatePickerForm from "../../../form-builders/DatePicker";

function __SalesForm(props) {

    const { currencySymbol, domainId, isSMSActive, isZeroReceiveAllow } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const entityNewData = useSelector((state) => state.inventoryCrudSlice.entityNewData);


    const transactionModeData = JSON.parse(localStorage.getItem('accounting-transaction-mode')) ? JSON.parse(localStorage.getItem('accounting-transaction-mode')) : [];

    const [salesSubTotalAmount, setSalesSubTotalAmount] = useState(0);
    const [salesProfitAmount, setSalesProfitAmount] = useState(0);
    const [salesVatAmount, setSalesVatAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(props.salesSubTotalAmount);
    const [hoveredModeId, setHoveredModeId] = useState(false);
    const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false)

    const formHeight = mainAreaHeight - 268; //TabList height 104
    const [customerViewModel, setCustomerViewModel] = useState(false);


    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)
    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);
    const [invoicePrintData, setInvoicePrintData] = useState(null)
    const [invoicePrintForSave, setInvoicePrintForSave] = useState(false)

    const [lastClicked, setLastClicked] = useState(null);

    const handleClick = (event) => {
        setLastClicked(event.currentTarget.name);
    };


    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    }, [loadCardProducts])

    const [customerData, setCustomerData] = useState(null);
    const [salesByUser, setSalesByUser] = useState(null);
    const [orderProcess, setOrderProcess] = useState(null);

    const form = useForm({
        initialValues: {
            customer_id: '',
            transaction_mode_id: '',
            sales_by: '',
            order_process: '',
            narration: '',
            discount: '',
            receive_amount: ''
        },
        validate: {
            transaction_mode_id: isNotEmpty(),
        }
    });

    const [returnOrDueText, setReturnOrDueText] = useState('Due');

    useEffect(() => {
        setSalesSubTotalAmount(props.salesSubTotalAmount);
        setSalesDueAmount(props.salesSubTotalAmount);
    }, [props.salesSubTotalAmount]);

    useEffect(() => {
        const totalAmount = salesSubTotalAmount - salesDiscountAmount;
        setSalesTotalAmount(totalAmount);
        setSalesDueAmount(totalAmount);
        setSalesProfitAmount(totalAmount - props.totalPurchaseAmount)
    }, [salesSubTotalAmount, salesDiscountAmount]);

    useEffect(() => {
        let discountAmount = 0;
        if (form.values.discount && Number(form.values.discount) > 0) {
            if (discountType === 'Flat') {
                discountAmount = form.values.discount;
            } else if (discountType === 'Percent') {
                discountAmount = (salesSubTotalAmount * form.values.discount) / 100;
            }
        }
        setSalesDiscountAmount(discountAmount);

        let returnOrDueAmount = 0;
        let receiveAmount = form.values.receive_amount == '' ? 0 : form.values.receive_amount
        if (receiveAmount >= 0) {
            const text = salesTotalAmount < receiveAmount ? 'Return' : 'Due';
            setReturnOrDueText(text);
            returnOrDueAmount = salesTotalAmount - receiveAmount;
            setSalesDueAmount(returnOrDueAmount);
        }
    }, [form.values.discount, discountType, form.values.receive_amount, salesSubTotalAmount, salesTotalAmount]);


    const [profitShow, setProfitShow] = useState(false);

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false)
    const [customersDropdownData, setCustomersDropdownData] = useState([])
    const [defaultCustomerId, setDefaultCustomerId] = useState(null)

    useEffect(() => {
        const fetchCustomers = async () => {
            await customerDataStoreIntoLocalStorage();
            let coreCustomers = localStorage.getItem('core-customers');
            coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : []
            let defaultId = defaultCustomerId;
            if (coreCustomers && coreCustomers.length > 0) {
                const transformedData = coreCustomers.map(type => {
                    if (type.name === 'Default') {
                        defaultId = type.id;
                    }
                    return ({ 'label': type.mobile + ' -- ' + type.name, 'value': String(type.id) })
                });

                setCustomersDropdownData(transformedData);
                setDefaultCustomerId(defaultId);
            }
            setRefreshCustomerDropdown(false);
        };

        fetchCustomers();
    }, [refreshCustomerDropdown]);
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

    /*START GET SALES BY / USERS DROPDOWN FROM LOCAL STORAGE*/
    const [salesByDropdownData, setSalesByDropdownData] = useState([])
    useEffect(() => {
        let coreUsers = localStorage.getItem('core-users') ? JSON.parse(localStorage.getItem('core-users')) : [];
        if (coreUsers && coreUsers.length > 0) {
            const transformedData = coreUsers.map(type => {
                return ({ 'label': type.username + ' - ' + type.email, 'value': String(type.id) })
            });
            setSalesByDropdownData(transformedData);
        }
    }, [])
    /*END GET SALES BY / USERS DROPDOWN FROM LOCAL STORAGE*/

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

    /*START FOR SUBMIT Disabled*/
    const isDefaultCustomer = !customerData || customerData == defaultCustomerId;
    const isDisabled = isDefaultCustomer && (isZeroReceiveAllow ? false : salesDueAmount > 0);
    /*END FOR SUBMIT Disabled*/

    /*START GET CUSTOMER DATA FROM LOCAL STORAGE*/
    const [customerObject, setCustomerObject] = useState({});
    useEffect(() => {
        if (customerData && (customerData != defaultCustomerId)) {
            const coreCustomers = JSON.parse(localStorage.getItem('core-customers') || '[]');
            const foundCustomer = coreCustomers.find(type => type.id == customerData);

            if (foundCustomer) {
                setCustomerObject(foundCustomer);
            }
        }
    }, [customerData]);
    /*END GET CUSTOMER DATA FROM LOCAL STORAGE*/

    useHotkeys([['alt+n', () => {
        // document.getElementById('customer_id').focus()
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

    useEffect(() => {
        if (entityNewData?.data?.id && (lastClicked === 'print' || lastClicked==='pos')){
            setTimeout(() => {
                dispatch(getSalesDetails('inventory/sales/'+entityNewData?.data?.id))
            }, 400);
        }
    }, [entityNewData, dispatch, lastClicked]);

    useEffect(() => {
        if (entityNewData?.data?.id && (lastClicked === 'print' || lastClicked==='pos')){
            setTimeout(() => {
                setInvoicePrintForSave(true)
            }, 500);
        }
    }, [entityNewData, lastClicked]);

    useEffect(() => {
        setTimeout(() => {
            if (invoicePrintForSave) {
                let printContents = document.getElementById('printElement').innerHTML;
                let originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload()
            }
        },500)
    }, [invoicePrintForSave]);

    return (
        <>
            {
                domainId == '359' && invoicePrintForSave &&
                <_InvoiceForDomain359
                    setInvoicePrintForSave={setInvoicePrintForSave}
                />
            }

            <form onSubmit={form.onSubmit((values) => {
                const tempProducts = localStorage.getItem('temp-sales-products');
                let items = tempProducts ? JSON.parse(tempProducts) : [];
                let createdBy = JSON.parse(localStorage.getItem('user'));

                let transformedArray = items.map(product => {
                    return {
                        "product_id": product.product_id,
                        "item_name": product.display_name,
                        "sales_price": product.sales_price,
                        "price": product.price,
                        "percent": product.percent,
                        "quantity": product.quantity,
                        "uom": product.unit_name,
                        "unit_id": product.unit_id,
                        "purchase_price": product.purchase_price,
                        "sub_total": product.sub_total
                    }
                });

                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };
                const formValue = {}
                formValue['customer_id'] = form.values.customer_id ? form.values.customer_id : defaultCustomerId;
                formValue['sub_total'] = salesSubTotalAmount;
                formValue['transaction_mode_id'] = form.values.transaction_mode_id;
                formValue['discount_type'] = discountType;
                formValue['discount'] = salesDiscountAmount;
                formValue['discount_calculation'] = discountType === 'Percent' ? form.values.discount : 0;
                formValue['vat'] = 0;
                formValue['total'] = salesTotalAmount;
                /*formValue['payment'] = form.values.receive_amount ? (customerData && customerData !=defaultCustomerId ? form.values.receive_amount:isZeroReceiveAllow ? salesTotalAmount:form.values.receive_amount) :(isZeroReceiveAllow && (!form.values.customer_id || form.values.customer_id == defaultCustomerId) ?salesTotalAmount:0);*/
                formValue['sales_by_id'] = form.values.sales_by;
                formValue['created_by_id'] = Number(createdBy['id']);
                formValue['process'] = form.values.order_process;
                formValue['narration'] = form.values.narration;
                formValue['invoice_date'] = form.values.invoice_date && new Date(form.values.invoice_date).toLocaleDateString("en-CA", options)
                ;
                formValue['items'] = transformedArray ? transformedArray : [];

                const hasReceiveAmount = form.values.receive_amount;
                const isDefaultCustomer = !form.values.customer_id || form.values.customer_id == defaultCustomerId;
                formValue['payment'] = hasReceiveAmount
                    ? (customerData && customerData != defaultCustomerId
                        ? form.values.receive_amount
                        : isZeroReceiveAllow
                            ? salesTotalAmount
                            : form.values.receive_amount)
                    : (isZeroReceiveAllow && isDefaultCustomer
                        ? salesTotalAmount
                        : 0);

                if (items && items.length > 0) {
                    const data = {
                        url: 'inventory/sales',
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
                        localStorage.removeItem('temp-sales-products');
                        form.reset()
                        setCustomerData(null)
                        setSalesByUser(null)
                        setOrderProcess(null)
                        props.setLoadCardProducts(true)
                    }, 500)
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
                    <Grid columns={48}>
                        <Box className={'borderRadiusAll'} >
                            <Box>
                                <Box pl={'xs'} pr={'xs'} pb={'xs'} className={'boxBackground'}>
                                    <Grid gutter={{ base: 6 }} pt={'3'} pb={'2'} >
                                        <Grid.Col span={11}>
                                            <Box pt={'6'}>
                                                <SelectForm
                                                    tooltip={t('CustomerValidateMessage')}
                                                    label=''
                                                    placeholder={t('Customer')}
                                                    required={false}
                                                    nextField={'receive_amount'}
                                                    name={'customer_id'}
                                                    form={form}
                                                    dropdownValue={customersDropdownData}
                                                    id={'customer_id'}
                                                    mt={1}
                                                    searchable={true}
                                                    value={customerData}
                                                    changeValue={setCustomerData}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <_addCustomer
                                                setRefreshCustomerDropdown={setRefreshCustomerDropdown}
                                                focusField={'customer_id'}
                                                fieldPrefix="sales_"
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box>
                                    <Grid gutter={{ base: 6 }} bg={'red.1'} pb={'3'} pt={'3'} >
                                        <Grid.Col span={6}>
                                            <Box pl={'md'}>
                                                <Text fz={'md'} order={1} fw={'800'}>
                                                    {currencySymbol + " "}
                                                    {(customerData && customerObject && customerData != defaultCustomerId ? Number(customerObject.balance).toFixed(2) : "0.00")}
                                                </Text>
                                                <Text fz={'xs'} c="dimmed" >{t('Outstanding')}</Text>
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Box mt={'8'} mr={'12'} style={{ textAlign: 'right', float: 'right' }}>
                                                <Group>
                                                    <Tooltip
                                                        multiline
                                                        bg={'orange.8'}
                                                        position="top"
                                                        ta={'center'}
                                                        withArrow
                                                        transitionProps={{ duration: 200 }}
                                                        label={customerData && customerData != defaultCustomerId ? (isSMSActive ? t('SendSms') : t('PleasePurchaseAsmsPackage')) : t('ChooseCustomer')}
                                                    >
                                                        <ActionIcon
                                                            bg={'white'}
                                                            variant="outline"
                                                            color={'red'}
                                                            disabled={!customerData || customerData == defaultCustomerId}
                                                            onClick={(e) => {
                                                                if (isSMSActive) {
                                                                    notifications.show({
                                                                        withCloseButton: true,
                                                                        autoClose: 1000,
                                                                        title: t('smsSendSuccessfully'),
                                                                        message: t('smsSendSuccessfully'),
                                                                        icon: <IconTallymark1 />,
                                                                        className: 'my-notification-class',
                                                                        style: {},
                                                                        loading: true,
                                                                    })
                                                                } else {
                                                                    setIsShowSMSPackageModel(true)
                                                                }
                                                            }}
                                                        >
                                                            <IconMessage size={18} stroke={1.5} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip
                                                        multiline
                                                        bg={'orange.8'}
                                                        position="top"
                                                        withArrow
                                                        offset={{ crossAxis: '-45', mainAxis: '5' }}
                                                        ta={'center'}
                                                        transitionProps={{ duration: 200 }}
                                                        label={customerData && customerData != defaultCustomerId ? t('CustomerDetails') : t('ChooseCustomer')}
                                                    >
                                                        <ActionIcon
                                                            variant="filled"
                                                            color={'red'}
                                                            disabled={!customerData || customerData == defaultCustomerId}
                                                            onClick={setCustomerViewModel}
                                                        >
                                                            <IconEyeEdit
                                                                size={18}
                                                                stroke={1.5}
                                                            />
                                                        </ActionIcon>
                                                    </Tooltip>

                                                </Group>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                            <Box p={'xs'}>
                                <Grid gutter={{ base: 4 }}>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}>{currencySymbol} {salesSubTotalAmount.toFixed(2)}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}> {currencySymbol} {salesDiscountAmount && Number(salesDiscountAmount).toFixed(2)}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}>  {currencySymbol} {salesVatAmount.toFixed(2)}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Center fz={'md'}
                                            fw={'800'}>{currencySymbol} {salesTotalAmount.toFixed(2)}</Center>
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
                                                                bg={'orange.8'}
                                                                offset={12}
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
                                                                        src={isOnline ? mode.path : '/images/transaction-mode-offline.jpg'}
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
                                </Box>

                                <Box p={'xs'} className={'boxBackground'} mt={'4'} pt={'xs'} mb={'xs'} pb={'xs'} >
                                    <Grid gutter={{ base: 2 }}>

                                        <Grid.Col span={2}>
                                            <Switch
                                                fullWidth
                                                size="lg"
                                                w={'100%'}
                                                color={'red.3'}
                                                mt={'2'}
                                                ml={'6'}
                                                onLabel={t('Profit')}
                                                offLabel={t('Hide')}
                                                radius="xs"
                                                onChange={(event) => setProfitShow(event.currentTarget.checked)}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={2}>
                                            <Center fz={'md'} mt={'4'}
                                                c={'black.5'}>{currencySymbol} {profitShow && salesProfitAmount}</Center>
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
                                        <Grid.Col span={4}>
                                            <Box fz={'xl'} pr={'8'} mt={'4'} c={'red'} style={{ textAlign: 'right', float: 'right' }} fw={'800'}>
                                                {returnOrDueText} {currencySymbol} {salesDueAmount.toFixed(2)}
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                    <Box mt={'xs'} h={1} bg={`red.3`}></Box>

                                    <Tooltip label={t('MustBeNeedReceiveAmountWithoutCustomer')} opened={isDisabled} position="bottom-end" withArrow>
                                        <Grid gutter={{ base: 2 }} mt={'xs'}>
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
                                                    nextField={'sales_by'}
                                                    form={form}
                                                    name={'receive_amount'}
                                                    id={'receive_amount'}
                                                    rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                    leftSection={<IconPlusMinus size={16} opacity={0.5} />}
                                                    closeIcon={true}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Tooltip>
                                </Box>
                                <Box>
                                    <Box p={'xs'} pb={'0'} pt={'0'}>
                                        <SelectForm
                                            tooltip={t('ChooseSalesBy')}
                                            label=''
                                            placeholder={t('SalesBy')}
                                            required={false}
                                            name={'sales_by'}
                                            form={form}
                                            dropdownValue={salesByDropdownData}
                                            id={'sales_by'}
                                            nextField={'order_process'}
                                            searchable={false}
                                            value={salesByUser}
                                            changeValue={setSalesByUser}
                                        />
                                    </Box>
                                    <Box p={'xs'} >
                                        <SelectForm
                                            tooltip={t('ChooseOrderProcess')}
                                            label=''
                                            placeholder={t('OrderProcess')}
                                            required={false}
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

                                    <Button
                                        fullWidth
                                        variant="filled"
                                        leftSection={<IconStackPush size={14} />}
                                        color="orange.5"
                                    >
                                        Hold
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        type={'submit'}
                                        onClick={handleClick}
                                        name="print"
                                        leftSection={<IconPrinter size={14} />}
                                        color="green.5"
                                        disabled={isDisabled}
                                        style={{
                                            transition: "all 0.3s ease",
                                            backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        Print
                                    </Button>
                                    <Button
                                        fullWidth
                                        type={'submit'}
                                        onClick={handleClick}
                                        name="pos"
                                        variant="filled"
                                        leftSection={<IconReceipt size={14} />}
                                        color="red.5"
                                        disabled={isDisabled}
                                        style={{
                                            transition: "all 0.3s ease",
                                            backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        Pos
                                    </Button>
                                    <Button
                                        fullWidth
                                        type={'submit'}
                                        onClick={handleClick}
                                        name="save"
                                        variant="filled"
                                        leftSection={<IconDeviceFloppy size={14} />}
                                        color="cyan.5"
                                        disabled={isDisabled}
                                        style={{
                                            transition: "all 0.3s ease",
                                            backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Button.Group>
                            </Box>
                        </Box>
                    </Grid>
                </Box>
            </form>

            {isShowSMSPackageModel &&
                <_SmsPurchaseModel
                    isShowSMSPackageModel={isShowSMSPackageModel}
                    setIsShowSMSPackageModel={setIsShowSMSPackageModel}
                />
            }
            {customerViewModel && customerData &&
                <_CustomerViewModel
                    customerViewModel={customerViewModel}
                    setCustomerViewModel={setCustomerViewModel}
                    customerObject={customerObject}
                />
            }
        </>

    );
}

export default __SalesForm;
