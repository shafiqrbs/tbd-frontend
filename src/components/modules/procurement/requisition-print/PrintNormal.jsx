import React, { useEffect, useRef } from 'react';
import { Flex, Group, Stack, Image, Text, Grid, Box, Space, Center } from '@mantine/core';
import barCode from '../../../../assets/images/frame.png';
import { useReactToPrint } from 'react-to-print';
import classes from './PrintNormal.module.css';
import { useTranslation } from 'react-i18next';

export function PrintNormal(props) {


    const { requisitionViewData, setPrintA4 } = props;
    const componentRef = useRef();
    const { t, i18n } = useTranslation();
    const effectRan = useRef(false);
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []
    const imageSrc = `${import.meta.env.VITE_IMAGE_GATEWAY_URL}uploads/inventory/logo/${configData.path}`;

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        !effectRan.current && (
            handlePrint(),
            setPrintA4(false),
            effectRan.current = true
        )
    }, []);

    return (
        <>
            <div className={classes['invoice-body']} ref={componentRef}>
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
                                                <p className={classes['invoice-text']}
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
                                                <p className={classes['invoice-text']}
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
                                                    {requisitionViewData && requisitionViewData.vendor_name && requisitionViewData.vendor_name}
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
                                                    {requisitionViewData && requisitionViewData.vendor_mobile && requisitionViewData.vendor_mobile}
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
                                                >
                                                    {requisitionViewData && requisitionViewData.vendor_address && requisitionViewData.vendor_address}
                                                </p>
                                            </Group>
                                        </Stack>
                                    </Stack>
                                </Flex>
                            </Box>
                            <Box>
                                <Flex h={120} justify={'flex-start'} direction={'column'} pt={'4'}>
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
                                        </Stack>
                                        <Stack align="flex-start"
                                            justify="center"
                                            gap="0">
                                            <Text h={18} fw={'300'} fz={'12'}
                                            >
                                                {requisitionViewData && requisitionViewData.id && requisitionViewData.id}
                                            </Text>
                                            <Text h={18} fw={'300'} fz={'12'}>
                                                {requisitionViewData && requisitionViewData.created && requisitionViewData.created}
                                            </Text>
                                            <Text h={18} fw={'300'} fz={'12'}>
                                                {requisitionViewData && requisitionViewData.createdByUser && requisitionViewData.createdByUser}
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Flex>
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
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>{t('UOM')}</th>
                                    <th className={classes['invoice-body-table-th']}>{t('SalesPrice')}</th>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>{t('SubTotal')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisitionViewData && requisitionViewData.requisition_items && requisitionViewData.requisition_items.map((element, index) => (
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
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-right']}`}>{element.unit_name}</td>
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
                                    <p className={classes['invoice-footer-text-two']}>{requisitionViewData && requisitionViewData.sub_total && Number(requisitionViewData.sub_total).toFixed(2)}
                                    </p>
                                    <p className={classes['invoice-footer-text-two']}>
                                        {requisitionViewData && requisitionViewData.discount && Number(requisitionViewData.discount).toFixed(2)}
                                    </p>
                                    <p className={classes['invoice-footer-text-two']}>
                                        {requisitionViewData && requisitionViewData.total && Number(requisitionViewData.total).toFixed(2)}
                                    </p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>
                                        {requisitionViewData && requisitionViewData.payment && Number(requisitionViewData.payment).toFixed(2)}
                                    </p>
                                    <p className={classes['invoice-footer-text-two']}>
                                        {requisitionViewData && requisitionViewData.total && (Number(requisitionViewData.total) - Number(requisitionViewData.payment)).toFixed(2)}
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