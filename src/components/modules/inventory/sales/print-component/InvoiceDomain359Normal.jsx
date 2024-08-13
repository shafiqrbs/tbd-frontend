import React, { useCallback, useEffect, useRef, useState, } from "react";
import { Box, Button, Grid, Space, Center } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { IconReceipt } from "@tabler/icons-react";
import { ReactToPrint } from "react-to-print";
import classes from './InvoiceDomain359Normal.module.css'
import barCode from '../../../../../assets/images/frame.png';
import { useNavigate } from "react-router-dom";

function InvoiceDomain359Normal(props) {

    let invoicePrintData;
    if (props.mode === 'insert') {
        invoicePrintData = useSelector((state) => state.inventoryCrudSlice.entityNewData.data);
    } else {
        invoicePrintData = useSelector((state) => state.inventoryCrudSlice.entityUpdateData.data);
    }

    const { t, i18n } = useTranslation();
    const printRef = useRef();
    const navigate = useNavigate();
    const [isPrinting, setIsPrinting] = useState(false);


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
                            <div className={classes['invoice-body']}>
                                <Grid columns={24} bg={'#E9ECEF'} p={10}>
                                    <Grid.Col span={12} >
                                        <img src={imageSrc} alt="" className={classes['invoice-header-img']} />
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
                                                    {invoicePrintData && invoicePrintData.invoice && invoicePrintData.invoice}
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} pr={'sm'}>
                                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('Created')}</Grid.Col>
                                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                                    {invoicePrintData && invoicePrintData.created_date && invoicePrintData.created_date}
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} pr={'sm'}>
                                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('CreatedBy')}</Grid.Col>
                                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                                    {invoicePrintData && invoicePrintData.created_by_user_name && invoicePrintData.created_by_user_name}
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} pr={'sm'}>
                                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('SalesBy')}</Grid.Col>
                                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                                    {invoicePrintData && invoicePrintData.sales_by_username && invoicePrintData.sales_by_username}
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} pr={'sm'}>
                                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('Mode')}</Grid.Col>
                                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                                    {invoicePrintData && invoicePrintData.mode_name && invoicePrintData.mode_name}
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={12} pr={'sm'}>
                                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>{t('Process')}</Grid.Col>
                                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>
                                                    {invoicePrintData && invoicePrintData.process_name && invoicePrintData.process_name}
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
                                                {invoicePrintData && invoicePrintData.customer_name && invoicePrintData.customer_name}
                                            </Grid.Col>
                                        </Grid>
                                        <Grid columns={24}>
                                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'} >{t('Mobile')}</Grid.Col>
                                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>
                                                {invoicePrintData && invoicePrintData.customer_mobile && invoicePrintData.customer_mobile}
                                            </Grid.Col>
                                        </Grid>
                                        <Grid columns={24}>
                                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>{t('Address')}</Grid.Col>
                                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>
                                                {invoicePrintData && invoicePrintData.customer_address && invoicePrintData.customer_address}
                                            </Grid.Col>
                                        </Grid>

                                        <Grid columns={24}>
                                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>{t('Balance')}</Grid.Col>
                                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}> {invoicePrintData && invoicePrintData.balance ? Number(invoicePrintData.balance).toFixed(2) : 0.00}</Grid.Col>
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
                                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-Center']}`}>{t('S/N')}</th>
                                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-left']}`}>{t('Name')}</th>
                                                    <th className={classes['invoice-body-table-th']}>{t('QTY')}</th>
                                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>{t('Price')}</th>
                                                    <th className={classes['invoice-body-table-th']}>{t('SalesPrice')}</th>
                                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>{t('SubTotal')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoicePrintData && invoicePrintData.sales_items && invoicePrintData.sales_items.map((element, index) => (
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
                                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-center']}`}>{element.sales_price}</td>
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
                                                    <p className={classes['invoice-footer-text-two']}>{invoicePrintData && invoicePrintData.sub_total && Number(invoicePrintData.sub_total).toFixed(2)}
                                                    </p>
                                                    <p className={classes['invoice-footer-text-two']}>
                                                        {invoicePrintData && invoicePrintData.discount && Number(invoicePrintData.discount).toFixed(2)}
                                                    </p>
                                                    <p className={classes['invoice-footer-text-two']}>
                                                        {invoicePrintData && invoicePrintData.total && Number(invoicePrintData.total).toFixed(2)}
                                                    </p>
                                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>
                                                        {invoicePrintData && invoicePrintData.payment && Number(invoicePrintData.payment).toFixed(2)}
                                                    </p>
                                                    <p className={classes['invoice-footer-text-two']}>
                                                        {invoicePrintData && invoicePrintData.total && (Number(invoicePrintData.total) - Number(invoicePrintData.payment)).toFixed(2)}
                                                    </p>
                                                    {/* <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>{data2[0].coupon_discount}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </footer>
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

export default InvoiceDomain359Normal;
