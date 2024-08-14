import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer
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

import SelectForm from "../../../../form-builders/SelectForm";
import TextAreaForm from "../../../../form-builders/TextAreaForm";

import {getSalesDetails, storeEntityData,} from "../../../../../store/inventory/crudSlice.js";
import InputNumberForm from "../../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../../form-builders/InputButtonForm";
import { notifications } from "@mantine/notifications";
import customerDataStoreIntoLocalStorage from "../../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import _addCustomer from "../../../popover-form/_addCustomer.jsx";
import DatePickerForm from "../../../../form-builders/DatePicker";
import _GenericInvoiceForm from "../../sales/_GenericInvoiceForm";
import InvoiceBatchModal from "../InvoiceBatchModal.jsx";

function _AddTransaction(props) {
    const {addTransactionDrawer,setAddTransactionDrawer,invoiceBatchData} = props

    const configData = localStorage.getItem('config-data');
    const currencySymbol = configData?.currency?.symbol;
    const { isOnline, mainAreaHeight } = useOutletContext();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight - 30; //TabList height 104
    const closeModel = () => {
        setAddTransactionDrawer(false)
    }

    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);
    const [provisionMode, setProvisionMode] = useToggle(['Item', 'Invoice']);
    const [batchViewModal, setBatchViewModal] = useState(false);


    const [lastClicked, setLastClicked] = useState(null);

    const handleClick = (event) => {
        setLastClicked(event.currentTarget.name);
    };

    const form = useForm({
        initialValues: {
            invoice_batch_id : invoiceBatchData.id,
            created_by_id : JSON.parse(localStorage.getItem('user')).id,
            sales_by_id : JSON.parse(localStorage.getItem('user')).id,
            customer_id: invoiceBatchData.customer_id,
            provision_discount: '',
            provision_mode: '',
            discount_calculation: '',
            discount_type: '',
            comment: '',
            invoice_date: ''
        },
        validate: {
            discount_calculation: isNotEmpty(),
        }
    });

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

    return (
        <>
            <Drawer.Root title={t('AddTransaction')} opened={addTransactionDrawer} position="right" onClose={closeModel} size={'30%'} >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title><Text fw={'600'} fz={'16'}>
                                {t('AddTransaction')}
                            </Text></Drawer.Title>
                            <Drawer.CloseButton />
                        </Drawer.Header>
                        <form onSubmit={form.onSubmit((values) => {

                            const options = {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            };
                            const formValue = {}
                            formValue['invoice_batch_id'] = form.values.invoice_batch_id ? form.values.invoice_batch_id : null;
                            formValue['created_by_id'] = Number(form.values.created_by_id);
                            formValue['sales_by_id'] = form.values.sales_by_id;
                            formValue['customer_id'] = form.values.customer_id ? form.values.customer_id : null;
                            formValue['provision_discount'] = form.values.provision_discount ? form.values.provision_discount : null;
                            formValue['provision_mode'] = provisionMode;
                            formValue['discount_calculation'] = form.values.discount_calculation ? form.values.discount_calculation : null;
                            formValue['discount_type'] = discountType;
                            formValue['comment'] = form.values.comment;
                            formValue['invoice_date'] = form.values.invoice_date && new Date(form.values.invoice_date).toLocaleDateString("en-CA", options)

                            if (formValue) {
                                const data = {
                                    url: 'inventory/invoice-batch-transaction',
                                    data: formValue
                                }
                                dispatch(storeEntityData(data))

                                notifications.show({
                                    color: 'teal',
                                    title: t('TransactionAddedSuccessfully'),
                                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                    loading: false,
                                    autoClose: 700,
                                    style: { backgroundColor: 'lightgray' },
                                });

                                setTimeout(() => {
                                    form.reset()
                                    setBatchViewModal(true)
                                }, 1000)
                            }

                        })}>
                        <ScrollArea  p={'md'} h={height}  scrollbarSize={2} type="never" bg={'gray.1'}>
                            <Box>
                                <Grid columns={48}>
                                    <Box className={'borderRadiusAll'} w={'100%'}>
                                        <Box h={'42'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'xs'}  className={'boxBackground textColor borderRadiusAll'} >
                                            {t('Invoice')}: {invoiceBatchData && invoiceBatchData.invoice && invoiceBatchData.invoice}
                                        </Box>
                                        <Box className={'borderRadiusAll border-top-none'} fz={'sm'}  >
                                            <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                                <Grid gutter={{ base: 4 }}>
                                                    <Grid.Col span={'6'}>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Customer')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.customer_name && invoiceBatchData.customer_name}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Mobile')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.customer_mobile && invoiceBatchData.customer_mobile}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Address')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.customer_address && invoiceBatchData.customer_address}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Balance')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.balance ? Number(invoiceBatchData.balance).toFixed(2) : 0.00}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Grid.Col>
                                                    <Grid.Col span={'6'}>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Created')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.created && invoiceBatchData.created}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('CreatedBy')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.created_by_name && invoiceBatchData.created_by_name}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>

                                        <Box p={'xs'} bg={'orange.1'}>
                                            <Grid gutter={{ base: 4 }}>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}>{currencySymbol} {Number(props?.invoiceBatchData?.sub_total).toFixed(2)}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}> {currencySymbol} {Number(props?.invoiceBatchData?.discount).toFixed(2)}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}>  {currencySymbol} {Number(props?.invoiceBatchData?.total).toFixed(2)}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}>{currencySymbol} {Number(props?.invoiceBatchData?.received).toFixed(2)}</Center>
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
                                                    <Center fz={'xs'} c="dimmed">{t('Total')}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'xs'} c="dimmed">{t('Received')}</Center>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <ScrollArea  bg={'gray.1'}>
                                            <Box p={'xs'} className={'boxBackground'} mt={'4'} pt={'xs'} mb={'xs'} pb={'xs'} >
                                                <Grid gutter={{ base: 2 }}>
                                                    <Grid.Col span={4}>

                                                    </Grid.Col>
                                                    <Grid.Col span={4}>&nbsp;</Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Box fz={'xl'} pr={'8'} mt={'4'} c={'red'} style={{ textAlign: 'right', float: 'right' }} fw={'800'}>
                                                            <DatePickerForm
                                                                tooltip={t('InvoiceDateValidateMessage')}
                                                                label=''
                                                                placeholder={t('InvoiceDate')}
                                                                required={false}
                                                                nextField={'provision_discount'}
                                                                form={form}
                                                                name={'invoice_date'}
                                                                id={'invoice_date'}
                                                                leftSection={<IconCalendar size={16} opacity={0.5} />}
                                                                rightSection={<IconCalendar size={16} opacity={0.5} />}
                                                                rightSectionWidth={30}
                                                                closeIcon={true}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                                <Box mt={'xs'} h={1} bg={`red.3`}>&nbsp;</Box>
                                                <Grid gutter={{ base: 2 }} mt={'xs'}>
                                                    <Grid.Col span={8}>
                                                        {t('ProvisionDiscount')}
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <InputNumberForm
                                                            type="number"
                                                            tooltip={t('ProvisionDiscountValidateMessage')}
                                                            label=''
                                                            placeholder={t('Amount')}
                                                            required={false}
                                                            nextField={'discount_calculation'}
                                                            form={form}
                                                            name={'provision_discount'}
                                                            id={'provision_discount'}
                                                            rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                            leftSection={<IconPlusMinus size={16} opacity={0.5} />}
                                                            closeIcon={true}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid gutter={{ base: 2 }} mt={'xs'}>
                                                    <Grid.Col span={4}>
                                                        <Button
                                                            fullWidth
                                                            onClick={() => setProvisionMode()}
                                                            variant="filled"
                                                            fz={'xs'}
                                                            color="green.8">
                                                            {provisionMode}
                                                        </Button>
                                                    </Grid.Col>
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
                                                            nextField={'narration'}
                                                            form={form}
                                                            name={'discount_calculation'}
                                                            id={'discount_calculation'}
                                                            leftSection={<IconDiscountOff size={16} opacity={0.5} />}
                                                            rightSection={inputGroupCurrency}
                                                            rightSectionWidth={30}
                                                        />
                                                    </Grid.Col>

                                                </Grid>
                                            </Box>
                                            <Box>

                                                <Box p={'xs'} pt={'0'}>
                                                    <TextAreaForm
                                                        tooltip={t('Narration')}
                                                        label=''
                                                        placeholder={t('Narration')}
                                                        required={false}
                                                        nextField={'entityDataSubmit'}
                                                        name={'comment'}
                                                        form={form}
                                                        mt={8}
                                                        id={'narration'}
                                                    />
                                                </Box>
                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Grid>
                            </Box>
                        </ScrollArea>
                        <Box  className={'boxBackground'} p={'md'}>
                            <Box>
                                <Button.Group fullWidth>

                                    <Button
                                        fullWidth
                                        variant="filled"
                                        type={'submit'}
                                        onClick={handleClick}
                                        name="print"
                                        leftSection={<IconPrinter size={14} />}
                                        color="orange.5"
                                        // disabled={isDisabled}
                                        /*style={{
                                            transition: "all 0.3s ease",
                                            backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}*/
                                    >
                                        Print
                                    </Button>

                                    <Button
                                        fullWidth
                                        type={'submit'}
                                        // onClick={handleClick}
                                        name="save"
                                        variant="filled"
                                        leftSection={<IconDeviceFloppy size={14} />}
                                        color="green"
                                        id="entityDataSubmit"
                                    >
                                        Save
                                    </Button>
                                </Button.Group>
                            </Box>
                        </Box>
                        </form>
                    </Drawer.Content>
            </Drawer.Root>
            {batchViewModal && <InvoiceBatchModal batchViewModal={batchViewModal} setBatchViewModal={setBatchViewModal} invoiceId={invoiceBatchData.id} setAddTransactionDrawer={setAddTransactionDrawer} />}
        </>

    );
}

export default _AddTransaction;
