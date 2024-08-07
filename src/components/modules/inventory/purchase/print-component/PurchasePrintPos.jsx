import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import classes from './PurchasePrintPos.module.css'
import { useTranslation } from 'react-i18next';

export function PurchasePrintPos(props) {
    const { purchaseViewData, setPrintPos } = props;
    const componentRef = useRef();
    const effectRan = useRef(false);
    const { t, i18n } = useTranslation();
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const imageSrc = `${import.meta.env.VITE_IMAGE_GATEWAY_URL}uploads/inventory/logo/${configData.path}`;

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
                        <img src={imageSrc} alt="logo" className={classes['head-img']} />
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
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('Invoice')} :  {purchaseViewData && purchaseViewData.invoice && purchaseViewData.invoice}</p>
                            {/* <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('PaymentMethod')} : {data2[0].payment_method}</p> */}
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('CreatedBy')} : {purchaseViewData && purchaseViewData.createdByName && purchaseViewData.createdByName}</p>
                        </div>
                        <div className={classes['invoice-details']}>
                            <p className={classes['invoice-text']}>{t('Created')} : {purchaseViewData && purchaseViewData.created && purchaseViewData.created}</p>
                        </div>
                    </div>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('BillTo')}</span></h3>
                    <div className={classes['main-address']}>
                        <p className={classes['invoice-text']}>{t('Vendor')} : {purchaseViewData && purchaseViewData.customerName && purchaseViewData.customerName}</p>
                        <p className={classes['invoice-text']}>{t('Mobile')} : {purchaseViewData && purchaseViewData.customerMobile && purchaseViewData.customerMobile}</p>
                        <p className={classes['invoice-text']}>{t('Address')} : {purchaseViewData && purchaseViewData.customer_address && purchaseViewData.customer_address}</p>
                        <p className={classes['invoice-text']}>{t('Balance')} : {purchaseViewData && purchaseViewData.balance ? Number(purchaseViewData.balance).toFixed(2) : 0.00}</p>
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
                            {purchaseViewData && purchaseViewData.purchase_items && purchaseViewData.purchase_items.map((element, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '35mm' }}>
                                            {element.item_name}
                                            {/* {element.sku && (
                                                <>
                                                    <br />
                                                    {t('Sku')} {element.sku}
                                                </>
                                            )} */}
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
                                {purchaseViewData && purchaseViewData.sub_total && Number(purchaseViewData.sub_total).toFixed(2)}
                            </p>
                        </div>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Discount')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {purchaseViewData && purchaseViewData.discount && Number(purchaseViewData.discount).toFixed(2)}
                            </p>
                        </div>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Total')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {purchaseViewData && purchaseViewData.total && Number(purchaseViewData.total).toFixed(2)}
                            </p>
                        </div>
                        <h3 className={classes['table-title']}></h3>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Receive')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                {purchaseViewData && purchaseViewData.payment && Number(purchaseViewData.payment).toFixed(2)}
                            </p>
                        </div>
                        <h3 className={classes['table-title']}></h3>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Due')}</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{purchaseViewData && purchaseViewData.total && (Number(purchaseViewData.total) - Number(purchaseViewData.payment)).toFixed(2)}</p>
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