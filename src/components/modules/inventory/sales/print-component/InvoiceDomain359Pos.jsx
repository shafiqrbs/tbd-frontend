import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Grid, Table, Text } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { IconReceipt } from "@tabler/icons-react";
import { ReactToPrint } from "react-to-print";
import classes from './InvoiceDomain359Pos.module.css'
import { useNavigate } from "react-router-dom";

function InvoiceDomain359Pos(props) {

    let invoicePrintData;
    if (props.mode === 'insert') {
        invoicePrintData = useSelector((state) => state.inventoryCrudSlice.entityNewData.data);
    } else {
        invoicePrintData = useSelector((state) => state.inventoryCrudSlice.entityUpdateData.data);
    }

    const { t, i18n } = useTranslation();
    const printRef = useRef()
    const [isPrinting, setIsPrinting] = useState(false);
    const navigate = useNavigate()

    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const imageSrc = `${import.meta.env.VITE_IMAGE_GATEWAY_URL}uploads/inventory/logo/${configData.path}`;

    const handleBeforePrint = useCallback(() => {
        setIsPrinting(true);
    }, []);

    const handleAfterPrint = useCallback(() => {
        props.mode === 'insert'
            ? (setIsPrinting(false),
                props.setOpenInvoiceDrawerForPrint(false))
            : (setIsPrinting(false),
                navigate('/inventory/sales'))
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && isPrinting) {
                handleAfterPrint();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPrinting, handleAfterPrint]);

    const reactToPrintContent = useCallback(() => {
        return printRef.current;
    }, []);

    const reactToPrintTrigger = useCallback(() => {
        return (
            <Button
                fullWidth
                variant="filled"
                leftSection={<IconReceipt size={14} />}
                color="red.5"
            >
                {t('Print')}
            </Button>
        );
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
            <Box>
                <Grid columns={8} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} id={"printElement"} ref={printRef}>
                            <div className={classes['pos-body']}>
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
                                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('Invoice')} :  {invoicePrintData && invoicePrintData.invoice && invoicePrintData.invoice}</p>
                                            <p className={classes['invoice-text']}>{t('Created')} : {invoicePrintData && invoicePrintData.created && invoicePrintData.created}</p>
                                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('CreatedBy')} : {invoicePrintData && invoicePrintData.created_by_user_name && invoicePrintData.created_by_user_name}</p>
                                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('SalesBy')} : {invoicePrintData && invoicePrintData.sales_by_username && invoicePrintData.sales_by_username}</p>
                                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('Mode')} : {invoicePrintData && invoicePrintData.mode_name && invoicePrintData.mode_name}</p><p className={`${classes['invoice-text']} ${classes['text-width']}`}>{t('Process')} : {invoicePrintData && invoicePrintData.process_id && invoicePrintData.process_id}</p>
                                        </div>
                                    </div>
                                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('BillTo')}</span></h3>
                                    <div className={classes['main-address']}>
                                        <p className={classes['invoice-text']}>{t('Customer')} : {invoicePrintData && invoicePrintData.customer_name && invoicePrintData.customer_name}</p>
                                        <p className={classes['invoice-text']}>{t('Mobile')} : {invoicePrintData && invoicePrintData.customer_mobile && invoicePrintData.customer_mobile}</p>
                                        <p className={classes['invoice-text']}>{t('Address')} : {invoicePrintData && invoicePrintData.customer_address && invoicePrintData.customer_address}</p>
                                        <p className={classes['invoice-text']}>{t('Balance')} : {invoicePrintData && invoicePrintData.balance ? Number(invoicePrintData.balance).toFixed(2) : 0.00}</p>
                                    </div>
                                    <h3 className={classes['main-title']}></h3>
                                    <table style={{ width: '78mm' }}>
                                        <tr>
                                            <th className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '30mm' }}>{t('Name')}</th>
                                            <th className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '6mm' }}>{t('QTY')}</th>
                                            <th className={`${classes['invoice-text']} ${classes['text-center']}`} style={{ width: '6mm' }}>{t('Unit')}</th>
                                            <th className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '16mm' }}>{t('Price')}</th>
                                            <th className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '22mm' }}>{t('Total')}</th>
                                        </tr>
                                    </table>
                                    <h3 className={classes['table-title']}></h3>

                                    <table style={{ width: '78mm' }}>
                                        <tbody>
                                            {invoicePrintData && invoicePrintData.sales_items && invoicePrintData.sales_items.map((element, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '30mm' }}>
                                                            {element.item_name}
                                                            {/* {element.sku && (
                                                <>
                                                    <br />
                                                    {t('Sku')} {element.sku}
                                                </>
                                            )} */}
                                                        </td>
                                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '6mm' }}>
                                                            {element.quantity}
                                                        </td>
                                                        <td className={`${classes['invoice-text']} ${classes['text-center']}`} style={{ width: '6mm' }}>
                                                            {element.uom}
                                                        </td>
                                                        <td className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '16mm' }}>
                                                            {element.sales_price}
                                                        </td>
                                                        <td className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '22mm' }}>
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
                                                {invoicePrintData && invoicePrintData.sub_total && Number(invoicePrintData.sub_total).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className={classes['footer-items']}>
                                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Discount')}</p>
                                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                                {invoicePrintData && invoicePrintData.discount && Number(invoicePrintData.discount).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className={classes['footer-items']}>
                                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Total')}</p>
                                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                                {invoicePrintData && invoicePrintData.total && Number(invoicePrintData.total).toFixed(2)}
                                            </p>
                                        </div>
                                        <h3 className={classes['table-title']}></h3>
                                        <div className={classes['footer-items']}>
                                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Receive')}</p>
                                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>
                                                {invoicePrintData && invoicePrintData.payment && Number(invoicePrintData.payment).toFixed(2)}
                                            </p>
                                        </div>
                                        <h3 className={classes['table-title']}></h3>
                                        <div className={classes['footer-items']}>
                                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>{t('Due')}</p>
                                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{invoicePrintData && invoicePrintData.total && (Number(invoicePrintData.total) - Number(invoicePrintData.payment)).toFixed(2)}</p>
                                        </div>
                                        {/* <div className={`${classes['footer-items']} ${classes['margin-footer-botom']}`}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Grand Total</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].grand_total}</p>
                        </div> */}
                                        <p className={`${classes['footer-company']} ${classes['invoice-text']}`}>&copy; {data2[0].company_name}</p>
                                    </footer>
                                </main>
                            </div>
                        </Box>

                        <ReactToPrint
                            content={reactToPrintContent}
                            documentTitle="Invoice"
                            onBeforePrint={handleBeforePrint}
                            onAfterPrint={handleAfterPrint}
                            removeAfterPrint
                            trigger={reactToPrintTrigger}
                        />

                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default InvoiceDomain359Pos;
