import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import classes from './PurchasePrintPos.module.css'
import { useTranslation } from 'react-i18next';
import { Grid } from '@mantine/core';

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

    return (
        <>
            <div className={classes['pos-body']} ref={componentRef}>
                <header className={classes['body-head']}>
                <div className={classes['pos-head']}>
                        <img src={imageSrc} alt="logo" className={classes['head-img']} />
                        <h3 className={classes['head-title']}>{configData.domain.name}</h3>
                        <Grid columns={24} gutter={0} className={`${classes['head-phone']} ${classes['text-width-two']}`} mt={'xs'}>
                            <Grid.Col span={6}>
                                {t('Email')}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                :
                            </Grid.Col>
                            <Grid.Col span={16}>
                                {configData?.domain?.email}
                            </Grid.Col>
                        </Grid>
                        <Grid columns={24} gutter={0} className={`${classes['head-phone']} ${classes['text-width-two']}`}>
                            <Grid.Col span={6}>
                                {t('Mobile')}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                :
                            </Grid.Col>
                            <Grid.Col span={16}>
                                {configData?.domain?.mobile}
                            </Grid.Col>
                        </Grid>
                        <Grid columns={24} gutter={0} className={`${classes['head-phone']} ${classes['text-width-two']}`} mb={'xs'}>
                            <Grid.Col span={6}>
                                {t('Address')}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                :
                            </Grid.Col>
                            <Grid.Col span={16}>
                                {configData?.address}
                            </Grid.Col>
                        </Grid>

                    </div>
                </header>
                <main className={classes['body-main']}>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('RetailInvoice')}</span></h3>
                    <div className={classes['invoice-details']}>
                            <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                <Grid.Col span={6}>
                                    {t('Invoice')}
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    :
                                </Grid.Col>
                                <Grid.Col span={16}>
                                    {purchaseViewData && purchaseViewData.invoice && purchaseViewData.invoice}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                <Grid.Col span={6}>
                                    {t('Created')}
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    :
                                </Grid.Col>
                                <Grid.Col span={16}>
                                    {purchaseViewData && purchaseViewData.created && purchaseViewData.created}
                                </Grid.Col>
                            </Grid>
                            <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                <Grid.Col span={6}>
                                    {t('CreatedBy')}
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    :
                                </Grid.Col>
                                <Grid.Col span={16}>
                                    {purchaseViewData && purchaseViewData.createdByName && purchaseViewData.createdByName}
                                </Grid.Col>
                            </Grid>
                        </div>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('BillTo')}</span></h3>
                    <div className={classes['main-address']}>
                        <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                            <Grid.Col span={6}>
                                {t('Vendor')}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                :
                            </Grid.Col>
                            <Grid.Col span={16}>
                                {purchaseViewData && purchaseViewData.customerName && purchaseViewData.customerName}
                            </Grid.Col>
                        </Grid>
                        <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                            <Grid.Col span={6}>
                                {t('Mobile')}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                :
                            </Grid.Col>
                            <Grid.Col span={16}>
                                {purchaseViewData && purchaseViewData.customerMobile && purchaseViewData.customerMobile}
                            </Grid.Col>
                        </Grid>
                        <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                            <Grid.Col span={6}>
                                {t('Address')}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                :
                            </Grid.Col>
                            <Grid.Col span={16}>
                                {purchaseViewData && purchaseViewData.customer_address && purchaseViewData.customer_address}
                            </Grid.Col>
                        </Grid>
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
                        <p className={`${classes['footer-company']} ${classes['invoice-text']}`}>&copy; {configData.domain.name}</p>
                    </footer>
                </main>
            </div>
        </>
    )
}