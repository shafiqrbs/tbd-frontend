import React, { useRef } from 'react';
import { Paper, Group, Stack, Image, Text, Table, Grid, Box, Title, Space, Center, Button } from '@mantine/core';
import logo from '../../../../../assets/images/logo.png';
import barCode from '../../../../../assets/images/frame.png';
import { useReactToPrint } from 'react-to-print';
import classes from './InvoiceA4.module.css';

export function InvoiceA4(props) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
            <Center mb={'xs'}>
                <Button mt={'lg'} mb={0} onClick={handlePrint}>Print</Button>
            </Center>
            <div className={classes['invoice-body']} ref={componentRef}>
                <Grid columns={24} bg={'#E9ECEF'} p={10}>
                    <Grid.Col span={12} >
                        <img src={logo} alt="" className={classes['invoice-header-img']} />
                        <Box >
                            <Grid columns={24} >
                                <Grid.Col span={'24'} mt={'md'} align={'left'} fw={'800'} fz={'19'}>{data2[0].company_name}</Grid.Col>
                            </Grid>
                            <Grid columns={24} mt={'md'}>
                                <Grid.Col span={'6'} align={'left'} fw={'300'} fz={'14'}>Email</Grid.Col>
                                <Grid.Col span={'2'} align={'center'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'12'} align={'left'} fw={'300'} fz={'14'}>{data2[0].email}</Grid.Col>
                            </Grid>
                            <Grid columns={24}>
                                <Grid.Col span={'6'} align={'left'} fw={'300'} fz={'14'}>Phone</Grid.Col>
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
                                <Grid.Col span={'auto'} align={'right'} fw={'800'} fz={'19'} mr={'sm'}>Invoice</Grid.Col>
                            </Grid>
                            <Grid columns={12} mt={'100'} pr={'sm'}>
                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>Order Id</Grid.Col>
                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>{data2[0].order_id}</Grid.Col>
                            </Grid>
                            <Grid columns={12} pr={'sm'}>
                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>Payment Method</Grid.Col>
                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>{data2[0].payment_method}</Grid.Col>
                            </Grid>
                            <Grid columns={12} pr={'sm'}>
                                <Grid.Col span={'6'} align={'right'} fw={'300'} fz={'14'}>Date & Time</Grid.Col>
                                <Grid.Col span={'1'} align={'right'} fw={'300'} fz={'14'}>:</Grid.Col>
                                <Grid.Col span={'5'} align={'left'} fw={'300'} fz={'14'}>{data2[0].date} {data2[0].time}</Grid.Col>
                            </Grid>
                        </Box>
                    </Grid.Col>
                </Grid>
                <main className={classes['invoice-body-main']}>
                    <Box className={classes['invoice-body-details']}>
                        <Grid columns={24}>
                            <Grid.Col span={'3'} align={'left'} fw={'600'} fz={'14'}>Bill To</Grid.Col>
                            <Grid.Col span={'auto'}></Grid.Col>
                        </Grid>

                        <Space h={'xs'} />
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>Name</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>{data2[0].name}</Grid.Col>
                        </Grid>
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'} >Address</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>{data2[0].address}</Grid.Col>
                        </Grid>
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>Email</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>{data2[0].customer_email}</Grid.Col>
                        </Grid>

                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'300'} fz={'14'}>Phone</Grid.Col>
                            <Grid.Col span={'1'} align={'left'} fw={'300'} fz={'14'}>:</Grid.Col>
                            <Grid.Col span={'auto'} align={'left'} fw={'300'} fz={'14'}>{data2[0].customer_phone}</Grid.Col>
                        </Grid>
                        <Space h={'lg'} />
                        <Grid columns={24}>
                            <Grid.Col span={'4'} align={'left'} fw={'600'} fz={'14'}>Sales By</Grid.Col>
                            <Grid.Col span={'auto'}></Grid.Col>
                        </Grid>
                        <Grid columns={24}>
                            <Grid.Col span={'6'} align={'left'} fw={'300'} fz={'14'}>{data2[0].sales_by}</Grid.Col>
                            <Grid.Col span={'auto'}></Grid.Col>
                        </Grid>
                    </Box>

                    <div className={classes['invoice-body-table-section']}>
                        <table className={classes['invoice-body-table']}>
                            <thead>
                                <tr className={classes['invoice-body-table-tr']}>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-left']}`}>Product name</th>
                                    <th className={classes['invoice-body-table-th']}>QTY</th>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>Price</th>
                                    <th className={classes['invoice-body-table-th']}>Tax</th>
                                    <th className={`${classes['invoice-body-table-th']} ${classes['text-right']}`}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className={classes['invoice-body-table-tr']}>
                                            <td className={classes['invoice-body-table-td']}> {item.product_name} <br /> SKU: {item.sku}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-center']}`}>{item.qty}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-right']}`}>{item.price}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-center']}`}>{item.tax}</td>
                                            <td className={`${classes['invoice-body-table-td']} ${classes['text-right']}`}>{item.total}</td>
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
                                    <p className={classes['invoice-footer-text-two']}>Sub Total</p>
                                    <p className={classes['invoice-footer-text-two']}>Shipping Cost</p>
                                    <p className={classes['invoice-footer-text-two']}>Service Fee</p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>Total Tax</p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>Coupon Discount</p>
                                    <p className={classes['invoice-footer-text-two']}>Grand Total</p>
                                </div>
                            </div>
                            <div className={classes['footer-data-section']}>
                                <div className={classes['invoice-footer-two-right']}>
                                    <p className={classes['invoice-footer-text-two']}>{data2[0].total}</p>
                                    <p className={classes['invoice-footer-text-two']}>{data2[0].shipping_cost}</p>
                                    <p className={classes['invoice-footer-text-two']}>{data2[0].service_fee}</p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>{data2[0].total_tax}</p>
                                    <p className={`${classes['invoice-footer-text-two']} ${classes['footer-border-bottom']}`}>{data2[0].coupon_discount}</p>
                                    <p className={classes['invoice-footer-text-two']}>{data2[0].grand_total}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}