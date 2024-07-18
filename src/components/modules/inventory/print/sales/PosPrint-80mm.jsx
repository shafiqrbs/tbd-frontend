import React, { useRef } from 'react';
import { Button, Center, ScrollArea } from '@mantine/core';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../../../assets/images/logo.png';
import classes from './PosPrint80mm.module.css'

export function PosPrint80mm(props) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const data = [
        {
            product: 'Tuava Tayas chocolate Box 500gm',
            price: 580,
            quantity: 5,
            total: 2980,
        },
        {
            product: 'Tuava Tayas chocolate Box 500gm',
            price: 580,
            quantity: 5,
            total: 2980,
        },
        {
            product: 'Tuava Tayas chocolate Box 500gm',
            price: 580,
            quantity: 5,
            total: 2980,
        },
        {
            product: 'Tuava Tayas chocolate Box 500gm',
            price: 580,
            quantity: 5,
            total: 2980,
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
            <div>
                <div className={classes['print-body']} ref={componentRef}>
                    <header className={classes['pos-print-header']}>
                        <div className={classes['pos-print-header']}>
                            <img src={logo} alt="" className={classes['pos-print-logo']} />
                            <h3 className={classes['pos-print-title']}>{data2[0].company_name}</h3>
                            <p className={classes['pos-print-address']}>{data2[0].address}</p>
                            <h3 className={classes['invoice']}>
                                Invoice : {data2[0].order_id}
                            </h3>
                            <div className={classes['header-details']}>
                                <div className={classes['header-description']}>
                                    <p className={classes['description-details']}>Date : {data2[0].date} {data2[0].time}</p>
                                    <p className={classes['description-details']}>Sales By : {data2[0].sales_by}</p>
                                </div>
                                <div className={classes['header-description']}>
                                    <p className={classes['description-details']}>
                                        Pay Mode : {data2[0].payment_method}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className={classes['pos-print-main']}>
                        <hr className={classes['hr']} />
                        <table style={{ width: '80mm' }} className={classes['print-table']}>
                            <tr className={classes['table-tr']}>
                                <th className={`${classes['table-td']} ${classes['table-th']}`} style=  {{ width: '40mm' }}>Item Name</th>
                                <th className={`${classes['table-td']} ${classes['table-th']} ${classes['table-amount']}`} style={{ width: '10mm' }}>Unit</th>
                                <th className={`${classes['table-td']} ${classes['table-th']} ${classes['table-quantity']}`} style={{ width: '10mm' }}>Qty</th>
                                <th className={`${classes['table-td']} ${classes['table-th']} ${classes['table-amount']}`} style={{ width: '20mm' }}>Price</th>
                            </tr>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className={`${classes['table-td']} ${classes['table-tdp']}`}>{item.product}</td>
                                    <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-amount']}`}>{item.price}</td>
                                    <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-quantity']}`}>{item.quantity}</td>
                                    <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-amount']}`}>{item.total}</td>
                                </tr>
                            ))}
                        </table>
                        <hr className={classes['hr']} />
                        <table style={{ width: '80mm' }}>
                            <tr className={classes['table-tr']}>
                                <td className={`${classes['table-td']} ${classes['table-tdp']}`} style={{ width: '50mm' }}>Sub Total</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-quantity']}`} style={{ width: '10mm' }}>TK</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-amount']}`} style={{ width: '20mm' }}>{data2[0].total}</td>
                            </tr>
                            <tr className={classes['table-tr']}>
                                <td className={`${classes['table-td']} ${classes['table-tdp']}`} style={{ width: '50mm' }}>Discount</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-quantity']}`} style={{ width: '10mm' }}>TK</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-amount']}`} style={{ width: '20mm' }}>{data2[0].coupon_discount}</td>
                            </tr>
                        </table>
                        <hr className={classes['hr']} />
                        <table style={{ width: '80mm' }}>
                            <tr className={classes['table-tr']}>
                                <td className={`${classes['table-td']} ${classes['table-tdp']}`} style={{ width: '50mm' }}>NetPayable</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-quantity']}`} style={{ width: '10mm' }}>TK</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-amount']}`} style={{ width: '20mm' }}>{data2[0].grand_total}</td>
                            </tr>
                            <tr className={classes['table-tr']}>
                                <td className={`${classes['table-td']} ${classes['table-tdp']}`} style={{ width: '50mm' }}>Paid</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-quantity']}`} style={{ width: '10mm' }}>TK</td>
                                <td className={`${classes['table-td']} ${classes['table-tdp']} ${classes['table-amount']}`} style={{ width: '20mm' }}>{data2[0].total}</td>
                            </tr>
                        </table>
                    </main>
                    <footer>
                        <div className={classes['print-footer']}>
                            <h3 className={classes['footer-title']}>*Medicines Once Sold are not taken Back*</h3>
                            <p className={classes['footer-description']}>Development by RightBrain Solution LTD.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}