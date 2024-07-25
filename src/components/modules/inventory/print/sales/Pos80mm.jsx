import React, { useRef } from 'react';
import { Button, Center, ScrollArea } from '@mantine/core';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../../../assets/images/logo.png';
import classes from './Pos80mm.module.css'

export function Pos80mm(props) {
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
            <Center>
                <Button mt={'lg'} mb={0} onClick={handlePrint}>Print</Button>
            </Center>
            <div className={classes['pos-body']} ref={componentRef}>
                <header className={classes['body-head']}>
                    <div className={classes['pos-head']}>
                        <img src={logo} alt="logo" className={classes['head-img']} />
                        <h3 className={classes['head-title']}>{data2[0].company_name}</h3>
                        <p className={classes['head-email']}>{data2[0].email}</p>
                        <p className={classes['head-phone']}>Phone : {data2[0].mobile}</p>
                        <p className={classes['head-address']}>Address : {data2[0].address}</p>
                    </div>
                </header>
                <main className={classes['body-main']}>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>Retail Invoice</span></h3>
                    <div className={classes['main-invoice']}>
                        <div className={classes['invoice-details']}>
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>Order Id : {data2[0].order_id}</p>
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>Payment Method : {data2[0].payment_method}</p>
                            <p className={`${classes['invoice-text']} ${classes['text-width']}`}>Sales By : {data2[0].sales_by}</p>
                        </div>
                        <div className={classes['invoice-details']}>
                            <p className={classes['invoice-text']}>Date : {data2[0].date} {data2[0].time}</p>
                        </div>
                    </div>
                    <h3 className={classes['main-title']}><span className={classes['main-title-span']}>Bill to</span></h3>
                    <div className={classes['main-address']}>
                        <p className={classes['invoice-text']}>Name : {data2[0].name}</p>
                        <p className={classes['invoice-text']}>Address : {data2[0].address}</p>
                        <p className={classes['invoice-text']}>Email : {data2[0].customer_email}</p>
                        <p className={classes['invoice-text']}>Phone : {data2[0].customer_phone}</p>
                    </div>
                    <h3 className={classes['main-title']}></h3>
                    <table style={{ width: '78mm' }}>
                        <tr>
                            <th className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '35mm' }}>Product Name</th>
                            <th className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '5mm' }}>Qty</th>
                            <th className={`${classes['invoice-text']} ${classes['text-center']}`} style={{ width: '10mm' }}>Price</th>
                            <th className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '10mm' }}>Tax</th>
                            <th className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '20mm' }}>Total</th>
                        </tr>
                    </table>
                    <h3 className={classes['table-title']}></h3>

                    <table style={{ width: '78mm' }}>
                        <tbody>
                            {data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '35mm' }}>
                                            {item.product_name} <br /> SKU: {item.sku}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-left']}`} style={{ width: '5mm' }}>
                                            {item.qty}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-center']}`} style={{ width: '10mm' }}>
                                            {item.price}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '10mm' }}>
                                            {item.tax}
                                        </td>
                                        <td className={`${classes['invoice-text']} ${classes['text-right']}`} style={{ width: '20mm' }}>
                                            {item.total}
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
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Sub Total</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].total}</p>
                        </div>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Shipping Cost</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].shipping_cost}</p>
                        </div>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Total Tax</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].total_tax}</p>
                        </div>
                        <h3 className={classes['table-title']}></h3>
                        <div className={classes['footer-items']}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Coupon Discount</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].coupon_discount}</p>
                        </div>
                        <h3 className={classes['table-title']}></h3>
                        <div className={`${classes['footer-items']} ${classes['margin-footer-botom']}`}>
                            <p className={`${classes['footer-name']} ${classes['invoice-text']}`}>Grand Total</p>
                            <p className={`${classes['footer-details']} ${classes['invoice-text']}`}>{data2[0].grand_total}</p>
                        </div>
                        <p className={`${classes['footer-company']} ${classes['invoice-text']}`}>&copy; {data2[0].company_name}</p>
                    </footer>
                </main>
            </div>
        </>
    )
}