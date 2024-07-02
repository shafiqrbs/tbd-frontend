import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconDeviceFloppy,
    IconPrinter,
    IconCheck,

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";



import { getSalesDetails, storeEntityData, } from "../../../../../store/inventory/crudSlice.js";
import { notifications } from "@mantine/notifications";
import customerDataStoreIntoLocalStorage from "../../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import _addCustomer from "../../../popover-form/_addCustomer.jsx";
import _GenericInvoiceForm from "../../sales/_GenericInvoiceForm";

function _FilterSearch(props) {
    const configData = localStorage.getItem('config-data');

    const currencySymbol = configData?.currency?.symbol;
    const domainId = configData?.domain_id;
    const isSMSActive = configData?.is_active_sms;
    const isZeroReceiveAllow = configData?.is_zero_receive_allow;
    const { filterModel, setFilterModel } = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight - 30; //TabList height 104
    const closeModel = () => {
        setFilterModel(false)
    }
    const dispatch = useDispatch();
    const entityNewData = useSelector((state) => state.inventoryCrudSlice.entityNewData);


    const transactionModeData = JSON.parse(localStorage.getItem('accounting-transaction-mode')) ? JSON.parse(localStorage.getItem('accounting-transaction-mode')) : [];

    const [salesSubTotalAmount, setSalesSubTotalAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(0);

    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);
    const [invoicePrintForSave, setInvoicePrintForSave] = useState(false)

    const [lastClicked, setLastClicked] = useState(null);

    const handleClick = (event) => {
        setLastClicked(event.currentTarget.name);
    };


    const [customerData, setCustomerData] = useState(null);
    const [salesByUser, setSalesByUser] = useState(null);
    const [orderProcess, setOrderProcess] = useState(null);

    const form = useForm({
        initialValues: {

        },
        validate: {

        }
    });


    const [defaultCustomerId, setDefaultCustomerId] = useState(null)

    const isDefaultCustomer = !customerData || customerData == defaultCustomerId;
    const isDisabled = isDefaultCustomer && (isZeroReceiveAllow ? false : salesDueAmount > 0);



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
        if (entityNewData?.data?.id && (lastClicked === 'print' || lastClicked === 'pos')) {
            setTimeout(() => {
                dispatch(getSalesDetails('inventory/sales/' + entityNewData?.data?.id))
            }, 400);
        }
    }, [entityNewData, dispatch, lastClicked]);

    useEffect(() => {
        if (entityNewData?.data?.id && (lastClicked === 'print' || lastClicked === 'pos')) {
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
        }, 500)
    }, [invoicePrintForSave]);

    return (
        <>
            <Drawer.Root title={t('AddTransaction')} opened={filterModel} position="right" onClose={closeModel} size={'30%'} >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>{t('AddTransaction')}</Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
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
                        <ScrollArea p={'md'} h={height} scrollbarSize={2} type="never" bg={'gray.1'}>
                            <Box>
                                <Grid columns={48}>
                                    <Box className={'borderRadiusAll'} w={'100%'}>

                                        <ScrollArea bg={'gray.1'}>
                                            <Box p={'xs'} className={'boxBackground'} mt={'4'} pt={'xs'} mb={'xs'} pb={'xs'} >

                                                {/* <Box mt={'xs'} h={1} bg={`red.3`}>&nbsp;</Box> */}

                                            </Box>

                                        </ScrollArea>
                                    </Box>
                                </Grid>
                            </Box>
                        </ScrollArea>
                        <Box className={'boxBackground'} p={'md'}>
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
                                        name="save"
                                        variant="filled"
                                        leftSection={<IconDeviceFloppy size={14} />}
                                        color="green"
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
                    </form>
                </Drawer.Content>
            </Drawer.Root>
        </>

    );
}

export default _FilterSearch;
