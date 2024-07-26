import React, { useEffect, useRef } from 'react';
import { Paper, Group, Stack, Image, Text, Table, Grid, Box, Title, Space, Center, Button } from '@mantine/core';
import logo from '../../../../../assets/images/logo.png';
import barCode from '../../../../../assets/images/frame.png';
import { useReactToPrint } from 'react-to-print';
import classes from './InvoiceBatchPrintA4.module.css';
import { useTranslation } from 'react-i18next';

export function InvoiceBatchPrintA4(props) {

    console.log("lioaded")

    const { invoiceBatchData, setPrintA4 } = props;
    const componentRef = useRef();
    const { t, i18n } = useTranslation();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        console.log("count")
        handlePrint()
        setPrintA4(false)
    })

    const data = [
        {
            item_name: 'Shower Room Assemble',
            sku: 'Bhd019237493847',
            quantity: '100',
            qty: '1000',
            price: '5000',
            sales_price: '1000',
            sub_total: '6000',
        },
        {
            item_name: 'Shower Room Assemble',
            sku: 'Bhd019237493847',
            quantity: '100',
            qty: '1000',
            price: '5000',
            sales_price: '1000',
            sub_total: '6000',
        },
        {
            item_name: 'Shower Room Assemble',
            sku: 'Bhd019237493847',
            quantity: '100',
            qty: '1000',
            price: '5000',
            sales_price: '1000',
            sub_total: '6000',
        },
    ];
    const data2 = [
        {
            company_name: "Right Brain Solution Ltd.",
            email: 'info@lazycoders.com',
            mobile: '+8801521334751',
            order_id: '12345678914654',
            payment_method: 'Cash',
            name: 'Lan Lewis',
            address: 'Rando, Avenel, Victoria - 123123, Australia',
            customer_email: 'alanjohnlewis88@gmail.com',
            customer_phone: '+880152134752',
            sales_by: 'Foysal Mahmud Hasan',
            total: '20001',
            shipping_cost: '1000',
            service_fee: '100',
            total_tax: '1000',
            coupon_discount: '2000',
            grand_total: '20947298',
            date: '15-07-2024',
            time: '12:16 PM'

        }
    ]
    return (
        <>
            <div className={classes['invoice-body']} ref={componentRef}>
                <Grid columns={24} bg={'#E9ECEF'} p={10}>
                    <Grid.Col span={12} >
                        <img src={logo} alt="" className={classes['invoice-header-img']} />
                        <Box >
                            <Grid columns={24} >
                                <Grid.Col span={'24'} mt={'md'} align={'left'} fw={'800'} fz={'19'}>{data2[0].company_name}</Grid.Col>
                            </Grid>
                            <Grid columns={24} mt={'md'}>
                                <Grid.Col span={'6'} align={'left'} fw={'300'} fz={'14'}>{t('Email')}</Grid.Col>
                                <Grid.Col span={'2'} align={'center'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'12'} align={'left'} fw={'300'} fz={'14'}>{data2[0].email}</Grid.Col>
                            </Grid>
                            <Grid columns={24}>
                                <Grid.Col span={'6'} align={'left'} fw={'300'} fz={'14'}>{t('Mobile')}</Grid.Col>
                                <Grid.Col span={'2'} align={'center'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'12'} align={'left'} fw={'300'} fz={'14'}>{data2[0].mobile}</Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={2}>
                    </Grid.Col>
                    <Grid.Col span={10}>
                        <Box>
                            <Grid columns={12}  >
                                <Grid.Col span={'auto'} align={'right'} fw={'800'} fz={'19'} mr={'sm'}>{t('Invoice')}</Grid.Col>
                            </Grid>
                            <Grid columns={12} mt={'100'} pr={'sm'}>
                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('Invoice')}</Grid.Col>
                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                    {invoiceBatchData && invoiceBatchData.invoice && invoiceBatchData.invoice}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={12} pr={'sm'}>
                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('Created')}</Grid.Col>
                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                    {invoiceBatchData && invoiceBatchData.created && invoiceBatchData.created}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={12} pr={'sm'}>
                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('CreatedBy')}</Grid.Col>
                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                    {invoiceBatchData && invoiceBatchData.created_by_name && invoiceBatchData.created_by_name}
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
                <main className={classes['invoice-body-main']}>
                    <Box className={classes['invoice-body-details']}>
                        <Grid columns={24}>
                            <Grid.Col span={'3'} align={'left'} fw={'600'} fz={'14'}>{t('BillTo')}</Grid.Col>
                            <Grid.Col span={'auto'}></Grid.Col>
                        </Grid>

                        <Space h={'xs'} />
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>{t('Customer')}</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>
                                {invoiceBatchData && invoiceBatchData.customer_name && invoiceBatchData.customer_name}
                            </Grid.Col>
                        </Grid>
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'} >{t('Mobile')}</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>
                                {invoiceBatchData && invoiceBatchData.customer_mobile && invoiceBatchData.customer_mobile}
                            </Grid.Col>
                        </Grid>
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>{t('Address')}</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>
                                {invoiceBatchData && invoiceBatchData.customer_address && invoiceBatchData.customer_address}
                            </Grid.Col>
                        </Grid>

                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>{t('Balance')}</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>{invoiceBatchData && invoiceBatchData.balance ? Number(invoiceBatchData.balance).toFixed(2) : 0.00}</Grid.Col>
                        </Grid>
                        {/* <Space h={'lg'} />
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'600'} fz={'14'}>{t('SalesBy')}</Grid.Col>
                            <Grid.Col span={'auto'}></Grid.Col>
                        </Grid>
                        <Grid columns={24}>
                            <Grid.Col span={'6'} align={'left'} fw={'300'} fz={'14'}>{data2[0].sales_by}</Grid.Col>
                            <Grid.Col span={'auto'}></Grid.Col>
                        </Grid> */}
                    </Box>

                    <div className={classes['invoice-body-table-section']}>
                        <table className={classes['invoice-body-table']}>
                            <thead>
                                <tr className={classes['invoice-body-table-tr']}>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-center']}`}>{t('S/N')}</th>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-left']}`}>{t('Name')}</th>
                                    <th className={classes['invoice-body-table-th']}>{t('QTY')}</th>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>{t('Price')}</th>
                                    <th className={classes['invoice-body-table-th']}>{t('SalesPrice')}</th>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>{t('SubTotal')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceBatchData && invoiceBatchData.invoice_batch_items && invoiceBatchData.invoice_batch_items.map((element, index) => (
                                    <React.Fragment key={index}>

                                        <tr className={classes['invoice-body-table-tr']}>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-center']}`}>{index + 1}</td>
                                            <td className={classes['invoice-body-table-td']}>
                                                {element.item_name}
                                                {element.sku && (
                                                    <>
                                                        <br />
                                                        {t('Sku')} {element.sku}
                                                    </>
                                                )}
                                            </td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-center']}`}>{element.quantity}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-right']}`}>{element.price}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-right']}`}>{element.sales_price}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-right']}`}>{element.sub_total}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
                <footer className={classes['invoice-footer']}>
                    <div className={classes['invoice-footer-contents']}>
                        <div className={classes['invoice-footer-one']}>
                            <Center>
                                <img src={barCode} alt="" className={classes['invoice-footer-img']} />
                            </Center>
                        </div>
                        <div className={classes['footer-right-section']}>
                            <div className={classes['footer-name-section']}>
                                <div className={classes['invoice-footer-two-left']}>
                                    <p className={classes['invoice-footer-text-two']}>{t('SubTotal')}</p>
                                    <p className={classes['invoice-footer-text-two']}>{t('Discount')}</p>
                                    <p className={classes['invoice-footer-text-two']}>{t('Total')}</p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>{t('Receive')}</p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>{t('Due')}</p>
                                    {/* <p className={classes['invoice-footer-text-two']}>Grand Total</p> */}
                                </div>
                            </div>
                            <div className={classes['footer-data-section']}>
                                <div className={classes['invoice-footer-two-right']}>
                                    <p className={classes['invoice-footer-text-two']}>{invoiceBatchData && invoiceBatchData.sub_total && Number(invoiceBatchData.sub_total).toFixed(2)}
                                    </p>
                                    <p className={classes['invoice-footer-text-two']}>
                                        {invoiceBatchData && invoiceBatchData.discount && Number(invoiceBatchData.discount).toFixed(2)}
                                    </p>
                                    <p className={classes['invoice-footer-text-two']}>
                                        {invoiceBatchData && invoiceBatchData.total && Number(invoiceBatchData.total).toFixed(2)}
                                    </p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>
                                        {invoiceBatchData && invoiceBatchData.payment && Number(invoiceBatchData.payment).toFixed(2)}
                                    </p>
                                    <p className={classes['invoice-footer-text-two']}>
                                        {invoiceBatchData && invoiceBatchData.total && (Number(invoiceBatchData.total) - Number(invoiceBatchData.payment)).toFixed(2)}
                                    </p>
                                    {/* <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>{data2[0].coupon_discount}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}