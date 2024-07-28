import React, { useEffect, useRef, useState } from 'react';
import { Button, Center, ScrollArea } from '@mantine/core';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../../../assets/images/logo.png';
import classes from './InvoiceBatchPrintPos.module.css'
import { useTranslation } from 'react-i18next';

export function InvoiceBatchPrintPos(props) {
    const { invoiceBatchData, setPrintPos } = props;
    const componentRef = useRef();
    const effectRan = useRef(false);
    const { t, i18n } = useTranslation();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        !effectRan.current && (
            handlePrint(),
            setPrintPos(false),
            effectRan.current = true
        )
    }, []);

    const data = [
        {
            product_name: 'Shower Room Assemble',
            sku: '862556256',
            qty: '1000',
            price: '5000',
            tax: '1000',
            total: '6000',
        },
        {
            product_name: 'Shower Room Assemble',
            sku: '862556256',
            qty: '1000',
            price: '5000',
            tax: '1000',
            total: '6000',
        },
        {
            product_name: 'Shower Room Assemble',
            sku: '862556256',
            qty: '1000',
            price: '5000',
            tax: '1000',
            total: '60001231',
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
            <div className={classes['pos-body']} ref={componentRef}>
                <header className={classes['body-head']}>
                    <div className={classes['pos-head']}>
                        <img src={logo} alt="logo" className={classes['head-img']} />
                        <h3 className={classes['head-title']}>{data2[0].company_name}</h3>
                        <p className={classes['head-email']}>{data2[0].email}</p>
                        <p className={classes['head-phone']}>{t('Mobile')} : {data2[0].mobile}</p>
                        <p className={classes['head-address']}>{t('Address')} : {data2[0].address}</p>
                    </div>
                </header>
                <main className={classes['body-main']}>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('RetailInvoice')}</span></h3>
                    <div className={classes['main-invoice']}>
                        <div className={classes['invoice-details']}>
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('Invoice')} :  {invoiceBatchData && invoiceBatchData.invoice && invoiceBatchData.invoice}</p>
                            {/* <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('PaymentMethod')} : {data2[0].payment_method}</p> */}
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('CreatedBy')} : {invoiceBatchData && invoiceBatchData.created_by_name && invoiceBatchData.created_by_name}</p>
                        </div>
                        <div className={classes['invoice-details']}>
                            <p className={classes['invoice-text']}>{t('Created')} : {invoiceBatchData && invoiceBatchData.created && invoiceBatchData.created}</p>
                        </div>
                    </div>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('BillTo')}</span></h3>
                    <div className={classes['main-address']}>
                        <p className={classes['invoice-text']}>{t('Customer')} : {invoiceBatchData && invoiceBatchData.customer_name && invoiceBatchData.customer_name}</p>
                        <p className={classes['invoice-text']}>{t('Mobile')} : {invoiceBatchData && invoiceBatchData.customer_mobile && invoiceBatchData.customer_mobile}</p>
                        <p className={classes['invoice-text']}>{t('Address')} : {invoiceBatchData && invoiceBatchData.customer_address && invoiceBatchData.customer_address}</p>
                        <p className={classes['invoice-text']}>{t('Balance')} : {invoiceBatchData && invoiceBatchData.balance ? Number(invoiceBatchData.balance).toFixed(2) : 0.00}</p>
                    </div>
                    <h3 className={classes['main-title']}></h3>
                    <table style={{ width: '78mm' }}>
                        <tr>
                            <th className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '35mm' }}>{t('Name')}</th>
                            <th className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '5mm' }}>{t('QTY')}</th>
                            <th className={`${classes['invoice-text']} ${classes['text-center']}`} style={{ width: '10mm' }}>{t('Price')}</th>
                            <th className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '10mm' }}>{t('SalesPrice')}</th>
                            <th className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '20mm' }}>{t('SubTotal')}</th>
                        </tr>
                    </table>
                    <h3 className={classes['table-title']}></h3>

                    <table style={{ width: '78mm' }}>
                        <tbody>
                            {invoiceBatchData && invoiceBatchData.invoice_batch_items && invoiceBatchData.invoice_batch_items.map((element, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '35mm' }}>
                                            {element.item_name}
                                            {element.sku && (
                                                <>
                                                    <br />
                                                    {t('Sku')} {element.sku}
                                                </>
                                            )}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '5mm' }}>
                                            {element.quantity}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-center']}`} style={{ width: '10mm' }}>
                                            {element.price}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '10mm' }}>
                                            {element.sales_price}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '20mm' }}>
                                            {element.sub_total}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5">
                                            <h3 className={classes['table-title']}></h3>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <footer className={classes['body-footer']}>
                        <div className={`${classes['footer-items']} ${classes['margin-footer']}`}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('SubTotal')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {invoiceBatchData && invoiceBatchData.sub_total && Number(invoiceBatchData.sub_total).toFixed(2)}
                            </p>
                        </div>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Discount')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {invoiceBatchData && invoiceBatchData.discount && Number(invoiceBatchData.discount).toFixed(2)}
                            </p>
                        </div>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Total')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {invoiceBatchData && invoiceBatchData.total && Number(invoiceBatchData.total).toFixed(2)}
                            </p>
                        </div>
                        <h3 className={classes['table-title']}></h3>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Receive')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {invoiceBatchData && invoiceBatchData.payment && Number(invoiceBatchData.payment).toFixed(2)}
                            </p>
                        </div>
                        <h3 className={classes['table-title']}></h3>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Due')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{invoiceBatchData && invoiceBatchData.total && (Number(invoiceBatchData.total) - Number(invoiceBatchData.payment)).toFixed(2)}</p>
                        </div>
                        {/* <div className={`${classes['footer-items']} ${classes['margin-footer-botom']}`}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Grand Total</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].grand_total}</p>
                        </div> */}
                        <p className={`${classes['footer-company']} ${classes['invoice-text']}`}>&copy; {data2[0].company_name}</p>
                    </footer>
                </main>
            </div>
        </>
    )
}