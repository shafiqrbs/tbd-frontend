import React, { useCallback, useEffect, useRef, useState, } from "react";
import { Box, Button, Grid, Space, Center, ScrollArea, Text, Flex, Group, Stack } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { IconReceipt } from "@tabler/icons-react";
import { ReactToPrint } from "react-to-print";
import classes from './InvoiceDomain359Normal.module.css'
import barCode from '../../../../../assets/images/frame.png';
import { useNavigate, useOutletContext } from "react-router-dom";

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
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight; //TabList height 104;
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
                        <ScrollArea h={height - 36} type='never'>
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} id={"printElement"} ref={printRef}>
                                <div className={classes['invoice-body']}>
                                    <Box bg={'#E9ECEF'} p={10}>
                                        <Box >
                                            <Grid columns={24} gutter={0} >
                                                <Grid.Col span={8} >
                                                    <Box mt={'2'} ml={'2'}>
                                                        {/* <Space h="40"></Space> */}
                                                        <img src={imageSrc} alt="" className={classes['invoice-header-img']} />
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={16} >
                                                    <Group justify="space-between" gap="0">
                                                        <Flex h={80} justify="center"
                                                            ml={'48'}
                                                            align="flex-start"
                                                            direction="row" pt={6}>
                                                            <Text fw={'800'} fz={'19'} mr={'sm'} mb={'xs'}>
                                                                {t('Invoice')}
                                                            </Text>
                                                        </Flex>
                                                        <Stack justify="center" gap={0}>
                                                            <Flex justify={'flex-end'} mt={'0'}>
                                                                <Text fw={'600'} fz={'16'} mr={'sm'}>
                                                                    {configData.domain.name}
                                                                </Text>
                                                            </Flex>
                                                            <Stack justify="flex-end" gap={0} mt={'4'}>
                                                                <Group justify="flex-start" gap={0}>
                                                                    <p className={classes['invoice-text-title']}
                                                                    >
                                                                        {t('Email')}
                                                                    </p>
                                                                    <p className={classes['invoice-text']}
                                                                    >
                                                                        :
                                                                    </p>
                                                                    <p className={classes['padding-left']}
                                                                    >
                                                                        {configData.domain.email}
                                                                    </p>
                                                                </Group>
                                                                <Group justify="flex-start" gap={0}>
                                                                    <p className={classes['invoice-text-title']}
                                                                    >
                                                                        {t('Mobile')}
                                                                    </p>
                                                                    <p className={classes['invoice-text']}
                                                                    >
                                                                        :
                                                                    </p>
                                                                    <p className={classes['padding-left']}
                                                                    >
                                                                        {configData.domain.mobile}
                                                                    </p>
                                                                </Group>
                                                            </Stack>
                                                        </Stack>
                                                    </Group>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                    </Box>
                                    <main className={classes['invoice-body-main']}>
                                        <Box className={classes['invoice-body-details']}>
                                            <Group justify="space-between" gap="0">
                                                <Box pt={'12'}>
                                                    <Flex h={120} justify={'flex-start'} direction={'column'}>
                                                        <Stack justify="center" gap={0}>
                                                            <Stack justify="flex-end" gap={0} >
                                                                <Group justify="flex-start" gap={0}>
                                                                    <p className={classes['invoice-text-title-two']}
                                                                    >
                                                                        {t('Customer')}
                                                                    </p>
                                                                    <p className={classes['invoice-text']}
                                                                    >
                                                                        :
                                                                    </p>
                                                                    <p className={classes['padding-left']}
                                                                    >
                                                                        {invoicePrintData && invoicePrintData.customer_name && invoicePrintData.customer_name}
                                                                    </p>
                                                                </Group>
                                                                <Group justify="flex-start" gap={0}>
                                                                    <p className={classes['invoice-text-title-two']}
                                                                    >
                                                                        {t('Mobile')}
                                                                    </p>
                                                                    <p className={classes['invoice-text']}
                                                                    >
                                                                        :
                                                                    </p>
                                                                    <p className={classes['padding-left']}
                                                                    >
                                                                        {invoicePrintData && invoicePrintData.customer_mobile && invoicePrintData.customer_mobile}
                                                                    </p>
                                                                </Group>
                                                                <Group justify="flex-start" gap={0}>
                                                                    <p className={classes['invoice-text-title-two']}
                                                                    >
                                                                        {t('Address')}
                                                                    </p>
                                                                    <p className={classes['invoice-text']}
                                                                    >
                                                                        :
                                                                    </p>
                                                                    <p className={classes['padding-left']}
                                                                    >{invoicePrintData && invoicePrintData.customer_address && invoicePrintData.customer_address}
                                                                    </p>
                                                                </Group>
                                                            </Stack>
                                                        </Stack>
                                                    </Flex>
                                                </Box>
                                                <Box>
                                                    <Group justify="center" gap="xs">
                                                        <Stack align="flex-start"
                                                            justify="center"
                                                            gap="0">
                                                            <Text h={18} fw={'300'} fz={'12'}
                                                            >
                                                                {t('Invoice')}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {t('Created')}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {t('CreatedBy')}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {t('SalesBy')}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {t('Mode')}
                                                            </Text>
                                                            <Text fw={'300'} fz={'12'}>
                                                                {t('Process')}
                                                            </Text>
                                                        </Stack>
                                                        <Stack align="center"
                                                            justify="center"
                                                            gap="0">
                                                            <Text h={18} fw={'300'} fz={'12'}
                                                            >
                                                                :
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                :
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                :
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                :
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                :
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                :
                                                            </Text>
                                                        </Stack>
                                                        <Stack align="flex-start"
                                                            justify="center"
                                                            gap="0">
                                                            <Text h={18} fw={'300'} fz={'12'}
                                                            >
                                                                {invoicePrintData && invoicePrintData.invoice && invoicePrintData.invoice}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {invoicePrintData && invoicePrintData.created && invoicePrintData.created}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {invoicePrintData && invoicePrintData.created_by_user_name && invoicePrintData.created_by_user_name}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {invoicePrintData && invoicePrintData.sales_by_username && invoicePrintData.sales_by_username}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {invoicePrintData && invoicePrintData.mode_name && invoicePrintData.mode_name}
                                                            </Text>
                                                            <Text h={18} fw={'300'} fz={'12'}>
                                                                {invoicePrintData && invoicePrintData.process_id && invoicePrintData.process_id}
                                                            </Text>
                                                        </Stack>
                                                    </Group>
                                                </Box>

                                            </Group>
                                        </Box>

                                        <div className={classes['invoice-body-table-section']}>
                                            <table className={classes['invoice-body-table']}>
                                                <thead>
                                                    <tr className={classes['invoice-body-table-tr']}>
                                                        <th className={`${classes['invoice-body-table-th']} ${classes['text-Center']}`}>{t('S/N')}</th>
                                                        <th className={`${classes['invoice-body-table-th']} ${classes['text-left']}`}>{t('Name')}</th>
                                                        <th className={classes['invoice-body-table-th']}>{t('QTY')}</th>
                                                        <th className={`${classes['invoice-body-table-th']} ${classes['text-center']}`}>{t('Unit')}</th>
                                                        <th className={classes['invoice-body-table-th']}>{t('Price')}</th>
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
                                                                <td className={`${classes['invoice-body-table-td']} ${classes['text-center']}`}>{element.uom}</td>
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
            </Box >
        </>
    );
}

export default InvoiceDomain359Normal;
