import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Grid, ScrollArea, Space, Stack, Table, Text } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { IconReceipt } from "@tabler/icons-react";
import { ReactToPrint } from "react-to-print";
import classes from './PurchaseInvoiceDomain359Pos.module.css'
import { useNavigate, useOutletContext } from "react-router-dom";

function PurchaseInvoiceDomain359Pos(props) {

    let invoicePrintData;
    if (props.mode === 'insert') {
        invoicePrintData = useSelector((state) => state.inventoryCrudSlice.entityNewData.data);
    } else {
        invoicePrintData = useSelector((state) => state.inventoryCrudSlice.entityUpdateData.data);
    }
    console.log(invoicePrintData)

    const { t, i18n } = useTranslation();
    const printRef = useRef()
    const [isPrinting, setIsPrinting] = useState(false);
    const navigate = useNavigate();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight; //TabList height 104
    const effectRan = useRef(false);

    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const imageSrc = `${import.meta.env.VITE_IMAGE_GATEWAY_URL}uploads/inventory/logo/${configData.path}`;

    const handleBeforePrint = useCallback(() => {
        setIsPrinting(true);
    }, []);

    const handleAfterPrint = useCallback(() => {
        props.mode === 'insert'
            ? (setIsPrinting(false),
                // props.setOpenInvoiceDrawerForPrint(false))
                console.log("printing closed"))
            : (setIsPrinting(false),
                navigate('/inventory/purchase'))
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
                fullWidth={true}
                variant="filled"
                leftSection={<IconReceipt size={14} />}
                color="red.5"
                id="print_button"
            >
                {t('Print')}
            </Button>
        );
    }, []);
    useEffect(() => {
        !effectRan.current && (
            setTimeout(() => {
                document.getElementById('print_button').click()
            }, 500),
            (effectRan.current = true)
        );
        return () => {
            !effectRan.current && clearTimeout(setTimeout);
        };
    }, [])

    return (
        <>
            <Box>
                <Grid columns={8} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <ScrollArea h={height - 36} type='never' ref={printRef}>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} id={"printElement"} >
                                <div className={classes['pos-body']}>
                                    <header className={classes['body-head']}>
                                        <div className={classes['pos-head']}>
                                            <img src={imageSrc} alt="logo" className={classes['head-img']} />
                                            <h3 className={classes['head-title']}>{configData?.domain?.name}</h3>
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
                                            <Grid columns={24} gutter={0} className={`${classes['head-address']} ${classes['text-width-two']}`} mb={'xs'}>
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
                                        <div className={classes['main-invoice']}>
                                            <div className={classes['invoice-details']} >
                                                <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                                    <Grid.Col span={6}>
                                                        {t('Invoice')}
                                                    </Grid.Col>
                                                    <Grid.Col span={2}>
                                                        :
                                                    </Grid.Col>
                                                    <Grid.Col span={16}>
                                                        {invoicePrintData && invoicePrintData.invoice && invoicePrintData.invoice}
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
                                                        {invoicePrintData && invoicePrintData.created && invoicePrintData.created}
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                                    <Grid.Col span={6}>
                                                        {t('SalesBy')}
                                                    </Grid.Col>
                                                    <Grid.Col span={2}>
                                                        :
                                                    </Grid.Col>
                                                    <Grid.Col span={16}>
                                                        {invoicePrintData && invoicePrintData.sales_by_username && invoicePrintData.sales_by_username}
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                                    <Grid.Col span={6}>
                                                        {t('Mode')}
                                                    </Grid.Col>
                                                    <Grid.Col span={2}>
                                                        :
                                                    </Grid.Col>
                                                    <Grid.Col span={16}>
                                                        {invoicePrintData && invoicePrintData.mode_name && invoicePrintData.mode_name}
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                                    <Grid.Col span={6}>
                                                        {t('Process')}
                                                    </Grid.Col>
                                                    <Grid.Col span={2}>
                                                        :
                                                    </Grid.Col>
                                                    <Grid.Col span={16}>
                                                        {invoicePrintData && invoicePrintData.process_id && invoicePrintData.process_id}
                                                    </Grid.Col>
                                                </Grid>
                                            </div>
                                        </div>
                                        <h3 className={classes['main-title']}><span className={classes['main-title-span']}>{t('BillTo')}</span></h3>
                                        <div className={classes['main-address']}>
                                            <Grid columns={24} gutter={0} className={`${classes['invoice-text']} ${classes['text-width-two']}`}>
                                                <Grid.Col span={6}>
                                                    {t('Customer')}
                                                </Grid.Col>
                                                <Grid.Col span={2}>
                                                    :
                                                </Grid.Col>
                                                <Grid.Col span={16}>
                                                    {invoicePrintData && invoicePrintData.customer_name && invoicePrintData.customer_name}
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
                                                    {invoicePrintData && invoicePrintData.customer_mobile && invoicePrintData.customer_mobile}
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
                                                    {invoicePrintData && invoicePrintData.customer_address && invoicePrintData.customer_address}
                                                </Grid.Col>
                                            </Grid>
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
                                            <Text className={`${classes['footer-company']} ${classes['invoice-text']}`} mt={'md'} mb={0}>
                                                {configData?.print_footer_text}
                                            </Text>
                                            <p className={`${classes['footer-company']} ${classes['invoice-text']}`}>&copy; {configData?.domain?.name}</p>
                                        </footer>
                                    </main>
                                </div>
                            </Box>
                        </ScrollArea>
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

export default PurchaseInvoiceDomain359Pos;
