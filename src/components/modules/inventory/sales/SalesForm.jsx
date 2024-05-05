import React, {useEffect, useRef, useState} from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, List, ThemeIcon, Popover, Flex, Modal, Table,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy,
    IconUserCog,
    IconStackPush,
    IconPrinter,
    IconReceipt,
    IconPercentage,
    IconCurrencyTaka,
    IconMessage,
    IconEyeEdit,
    IconDeviceMobile,
    IconHelpCircle,
    IconCircleCheck, IconUserCircle, IconRefreshDot, IconDiscountOff, IconCurrency, IconPlusMinus, IconCheck,
    IconUser, IconEdit,

} from "@tabler/icons-react";
import {useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";

import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";

import {
    getShowEntityData, storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import { getTransactionModeData } from "../../../../store/accounting/utilitySlice.js";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData.js";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import getUserDropdownData from "../../../global-hook/dropdown/getUserDropdownData";
import InputForm from "../../../form-builders/InputForm";
import { setFetching, storeEntityDataWithFile } from "../../../../store/accounting/crudSlice.js";
import { notifications } from "@mantine/notifications";
import {ReactToPrint} from "react-to-print";

function SalesForm(props) {

    const { currencySymbol } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const transactionModeData = useSelector((state) => state.accountingUtilitySlice.transactionModeData)

    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
        dispatch(getTransactionModeData('accounting/transaction-mode-data'))
    }, []);

    const [salesSubTotalAmount, setSalesSubTotalAmount] = useState(0);
    const [salesProfitAmount, setSalesProfitAmount] = useState(0);
    const [salesVatAmount, setSalesVatAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(props.salesSubTotalAmount);
    const [hoveredModeId, setHoveredModeId] = useState(false);

    const formHeight = mainAreaHeight - 268; //TabList height 104
    const [viewCustomerModel, setCustomerViewModel] = useState(false);


    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)
    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);


    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    }, [loadCardProducts])

    const [customerData, setCustomerData] = useState(null);
    const [salesByUser, setSalesByUser] = useState(null);
    const [orderProcess, setOrderProcess] = useState(null);
    //  console.log(storeDataIntoLocalStorage);

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
            customer_id: isNotEmpty(),
            transaction_mode_id: isNotEmpty(),
            sales_by: isNotEmpty(),
            order_process: isNotEmpty()
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
        if (form.values.receive_amount) {
            const text = salesTotalAmount < form.values.receive_amount ? 'Return' : 'Due';
            setReturnOrDueText(text);
            returnOrDueAmount = salesTotalAmount - form.values.receive_amount;
            setSalesDueAmount(returnOrDueAmount);
        }
    }, [form.values.discount, discountType, form.values.receive_amount, salesSubTotalAmount, salesTotalAmount]);


    const [profitShow, setProfitShow] = useState(false);


    useHotkeys([['alt+n', () => {
        document.getElementById('customer_id').focus()
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
    const [opened, { open, close }] = useDisclosure(false);
    const [salesViewData, setSalesViewData] = useState({})
    /*const indexData = useSelector((state) => state.crudSlice.indexEntityData)

    useEffect(() => {
        setSalesViewData(indexData.data && indexData.data[0] && indexData.data[0])
    }, [indexData.data])*/
    const printRef = useRef()
    const height = mainAreaHeight - 314; //TabList height 104
    const rows = salesViewData && salesViewData.sales_items && salesViewData.sales_items.map((element, index) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{index + 1}</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.item_name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.quantity}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sales_price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sub_total}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Modal opened={opened} onClose={close} title="Authentication">
                <Box>
                    <Grid columns={8} gutter={{ base: 8 }}>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} ref={printRef}>
                                <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                    {t('Invoice')}: {salesViewData && salesViewData.invoice && salesViewData.invoice}
                                </Box>
                                <Box className={'borderRadiusAll'} fz={'sm'}  >
                                    <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                        <Grid gutter={{ base: 4 }}>
                                            <Grid.Col span={'6'}>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Customer</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.customer_id && salesViewData.customer_id}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Mobile</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.customerMobile && salesViewData.customerMobile}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Address</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.customer_address && salesViewData.customer_address}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Balance</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.balance ? Number(salesViewData.balance).toFixed(2) : 0.00}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Grid.Col>
                                            <Grid.Col span={'6'}>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Created</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.created && salesViewData.created}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Created By</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.createdByName && salesViewData.createdByName}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Sales By</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.salesByUser && salesViewData.salesByUser}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Mode</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.mode_name && salesViewData.mode_name}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={15} gutter={{ base: 4 }}>
                                                    <Grid.Col span={6} ><Text fz="sm" lh="xs">Process</Text></Grid.Col>
                                                    <Grid.Col span={9} >
                                                        <Text fz="sm" lh="xs">
                                                            {salesViewData && salesViewData.process && salesViewData.process}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <ScrollArea h={height} scrollbarSize={2} type="never" >
                                        <Box>
                                            <Table stickyHeader >
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                        <Table.Th fz="xs" ta="left" w={'300'}>{t('Name')}</Table.Th>
                                                        <Table.Th fz="xs" ta="center" w={'60'}>{t('QTY')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'80'}>{t('Price')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>{t('SalesPrice')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>{rows}</Table.Tbody>
                                                <Table.Tfoot>
                                                    <Table.Tr>
                                                        <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>
                                                            {salesViewData && salesViewData.sub_total && Number(salesViewData.sub_total).toFixed(2)}
                                                        </Table.Th>
                                                    </Table.Tr>
                                                    <Table.Tr>
                                                        <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>
                                                            {salesViewData && salesViewData.discount && Number(salesViewData.discount).toFixed(2)}
                                                        </Table.Th>
                                                    </Table.Tr>
                                                    <Table.Tr>
                                                        <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>
                                                            {salesViewData && salesViewData.total && Number(salesViewData.total).toFixed(2)}
                                                        </Table.Th>
                                                    </Table.Tr>
                                                    <Table.Tr>
                                                        <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                                        <Table.Th ta="right" fz="xs" w={'100'}>
                                                            {salesViewData && salesViewData.payment && Number(salesViewData.payment).toFixed(2)}
                                                        </Table.Th>
                                                    </Table.Tr>
                                                </Table.Tfoot>
                                            </Table>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                            <Box>
                                <Button.Group fullWidth>

                                    <Button
                                        fullWidth
                                        variant="filled"
                                        leftSection={<IconPrinter size={14} />}
                                        color="green.5"
                                    >
                                        <ReactToPrint
                                            trigger={() => {
                                                return <a href="#">Print</a>;
                                            }}
                                            content={() => printRef.current}
                                        />
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        leftSection={<IconReceipt size={14} />}
                                        color="red.5"
                                    >
                                        Pos
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        leftSection={<IconEdit size={14} />}
                                        color="cyan.5"
                                    >
                                        Edit
                                    </Button>
                                </Button.Group>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Modal>
            <form onSubmit={form.onSubmit((values) => {
                /*setSalesViewData(formValue);
                open()
                console.log(form.values)*/
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
                        "unit_id": 2,
                        "purchase_price": product.purchase_price,
                        "sub_total": product.sub_total
                    }
                });

                const formValue = {}
                formValue['customer_id'] = form.values.customer_id;
                formValue['sub_total'] = salesSubTotalAmount;
                formValue['transaction_mode_id'] = form.values.transaction_mode_id;
                formValue['discount_type'] = discountType;
                formValue['discount'] = salesDiscountAmount;
                formValue['discount_calculation'] = discountType === 'Percent' ? form.values.discount : 0;
                formValue['vat'] = 0;
                formValue['total'] = salesTotalAmount;
                formValue['payment'] = form.values.receive_amount;
                formValue['sales_by_id'] = form.values.sales_by;
                formValue['created_by_id'] = Number(createdBy['id']);
                formValue['process'] = form.values.order_process;
                formValue['narration'] = form.values.narration;
                formValue['items'] = transformedArray ? transformedArray : [];

                console.log(formValue)
                setSalesViewData(formValue);
                open()


                /*const data = {
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
                }, 700)*/

            })}>
                <Box>
                    <Grid columns={48}>
                        <Box className={'borderRadiusAll'} >
                            <Box>
                                <Box pl={'xs'} pr={'xs'} pb={'xs'} className={'boxBackground'}>
                                    <Grid gutter={{ base: 6 }}>
                                        <Grid.Col span={11} pt={'4'} >
                                            <Box pt={'6'}>
                                                <SelectForm
                                                    tooltip={t('CustomerValidateMessage')}
                                                    label=''
                                                    placeholder={t('Customer')}
                                                    required={false}
                                                    nextField={'receive_amount'}
                                                    name={'customer_id'}
                                                    form={form}
                                                    dropdownValue={getCustomerDropdownData()}
                                                    id={'customer_id'}
                                                    mt={1}
                                                    searchable={false}
                                                    value={customerData}
                                                    changeValue={setCustomerData}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Box pt={7}>
                                                <Popover width={'450'} trapFocus position="bottom" withArrow shadow="xl">
                                                    <Popover.Target>
                                                        <Tooltip
                                                            multiline
                                                            w={420}
                                                            withArrow
                                                            transitionProps={{ duration: 200 }}
                                                            label={t('InstantCustomerCreate')}
                                                        >

                                                            <ActionIcon fullWidth variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings">
                                                                <IconUser style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Popover.Target>
                                                    <Popover.Dropdown>
                                                        <Box mt={'xs'}>
                                                            <InputForm
                                                                tooltip={t('SalesPriceValidateMessage')}
                                                                label={t('Name')}
                                                                placeholder={t('CustomerName')}
                                                                required={true}
                                                                nextField={'EntityFormSubmit'}
                                                                form={form}
                                                                name={'customer_name'}
                                                                id={'customer_name'}
                                                                leftSection={<IconUserCircle size={16} opacity={0.5} />}
                                                                rightIcon={''}
                                                            />
                                                        </Box>
                                                        <Box mt={'xs'}>
                                                            <InputNumberForm
                                                                tooltip={t('MobileValidateMessage')}
                                                                label={t('MobileNo')}
                                                                placeholder={t('MobileNo')}
                                                                required={true}
                                                                nextField={'EntityFormSubmit'}
                                                                form={form}
                                                                name={'mobile_no'}
                                                                id={'mobile_no'}
                                                                leftSection={<IconDeviceMobile size={16} opacity={0.5} />}
                                                                rightIcon={''}
                                                            />
                                                        </Box>
                                                        <Box mt={'xs'}>
                                                            <Grid columns={12} gutter={{ base: 1 }} >
                                                                <Grid.Col span={6}>&nbsp;</Grid.Col>
                                                                <Grid.Col span={2}>
                                                                    <Button
                                                                        variant="transparent"
                                                                        size="sm"
                                                                        color={`red.4`}
                                                                        type="submit"
                                                                        mt={0}
                                                                        mr={'xs'}
                                                                        fullWidth
                                                                        id="EntityCustomerFormSubmit"
                                                                    >
                                                                        <IconRefreshDot style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                    </Button>
                                                                </Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <Button
                                                                        size="sm"
                                                                        color={`red.5`}
                                                                        type="submit"
                                                                        mt={0}
                                                                        mr={'xs'}
                                                                        fullWidth
                                                                        id="EntityCustomerFormSubmit"
                                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                                    >
                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={12} fw={400}>
                                                                                {t("Add Customer")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                    </Popover.Dropdown>
                                                </Popover>
                                            </Box>
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
                                                    <ActionIcon bg={'white'} variant="outline"
                                                        color={'red'} >
                                                        <IconMessage size={18} stroke={1.5} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="filled"
                                                        color={'red'}
                                                        onClick={setCustomerViewModel}
                                                    >
                                                        <IconEyeEdit
                                                            size={18}
                                                            stroke={1.5}
                                                        />
                                                    </ActionIcon>

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
                                                                        <Center fz={'xs'} className={'textColor'} >{mode.authorised}</Center>
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
                                        <Grid.Col span={2}><Center fz={'xs'} mt={'8'}
                                            c={'red'}>{currencySymbol} {profitShow && salesProfitAmount}</Center></Grid.Col>
                                        <Grid.Col span={7}><Center fz={'md'} mt={'4'} c={'red'}
                                            fw={'800'}>{returnOrDueText} {currencySymbol} {salesDueAmount.toFixed(2)}</Center></Grid.Col>
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
                                </Box>
                                <Box>
                                    <Box p={'xs'} pb={'0'} pt={'0'}>
                                        <SelectForm
                                            tooltip={t('SalesByValidateMessage')}
                                            label=''
                                            placeholder={t('SalesBy')}
                                            required={true}
                                            name={'sales_by'}
                                            form={form}
                                            dropdownValue={getUserDropdownData()}
                                            id={'sales_by'}
                                            nextField={'order_process'}
                                            searchable={false}
                                            value={salesByUser}
                                            changeValue={setSalesByUser}
                                        />
                                    </Box>
                                    <Box p={'xs'} >
                                        <SelectForm
                                            tooltip={t('ProductUnitValidateMessage')}
                                            label=''
                                            placeholder={t('OrderProcess')}
                                            required={true}
                                            name={'order_process'}
                                            form={form}
                                            dropdownValue={['Order', 'Process']}
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
        </>

    );
}

export default SalesForm;
