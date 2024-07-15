import React, { useRef } from 'react';
import { Button, Center, ScrollArea } from '@mantine/core';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../../../assets/images/logo.png';


export function Pos80mm(props) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const data = [
        {
            description: 'Shower Room Assemble',
            sku: '862556256',
            width: '1000',
            length: '5000',
            height: '1000',
            total: '6000',
        },
        {
            description: 'Shower Room Assemble',
            sku: '862556256',
            width: '1000',
            length: '5000',
            height: '1000',
            total: '6000',
        },
        {
            description: 'Shower Room Assemble',
            sku: '862556256',
            width: '1000',
            length: '5000',
            height: '1000',
            total: '6000',
        },

    ];
    return (

        <>

            <Center >
                <Button mt={'lg'} mb={0} onClick={handlePrint}>Print</Button>
            </Center>
            <div class="pos-body" ref={componentRef}>
                <header class="body-head">
                    <div class="pos-head">
                        <img src={logo} alt="logo" class="head-img" />
                        <h3 class="head-title">Right Brain Solution</h3>
                        <p class="head-email">info@lazycoders.com</p>
                        <p class="head-phone">Phone : +8801521334751</p>
                        <p class="head-address">Address : 29 Gausul Azam Avenue, Uttara, Dhaka</p>
                    </div>
                </header>
                <main class="body-main">
                    <h3 class="main-title"><span class="main-title-span">Retail Invoice</span></h3>
                    <div class="main-invoice">
                        <div class="invoice-details">
                            <p class="invoice-text text-width">Order Id : 9876465456-874654621</p>
                            <p class="invoice-text text-width">Payment Method : Cash</p>
                            <p class="invoice-text text-width">Sales By : Foysal Mahmud Hasan</p>
                        </div>
                        <div class="invoice-details">
                            <p class="invoice-text">Date : 15 July 2024 02:54:47 PM</p>
                        </div>
                    </div>
                    <h3 class="main-title"><span class="main-title-span">Bill to</span></h3>
                    <div class="main-address">
                        <p class="invoice-text">Name : Alan Lewis</p>
                        <p class="invoice-text">Address : Mirpur,Dhaka, Bangladesh Dhaka, Bangladesh, Asia, Earth</p>
                        <p class="invoice-text">Email : foysalmahmud.rbs@gmail.com</p>
                        <p class="invoice-text">Phone : +8801521334751</p>
                    </div>
                    <h3 class="main-title"></h3>
                    <table style={{ width: '78mm' }}>
                        <tr>
                            <th class="invoice-text text-left" style={{ width: '35mm' }}>Product Name</th>
                            <th class="invoice-text text-left" style={{ width: '5mm' }}>Qty</th>
                            <th class="invoice-text text-center" style={{ width: '10mm' }}>Unit Price</th>
                            <th class="invoice-text text-right" style={{ width: '10mm' }}>Tax</th>
                            <th class="invoice-text text-right" style={{ width: '18mm' }}>Total</th>
                        </tr>
                    </table>
                    <h3 class="table-title"></h3>

                    <table style={{ width: '78mm' }}>
                        <tbody>
                            {data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="invoice-text text-left" style={{ width: '35mm' }}>
                                            {item.description} <br /> SKU: {item.sku}
                                        </td>
                                        <td className="invoice-text text-left" style={{ width: '5mm' }}>
                                            {item.width}
                                        </td>
                                        <td className="invoice-text text-center" style={{ width: '10mm' }}>
                                            {item.length}
                                        </td>
                                        <td className="invoice-text text-right" style={{ width: '10mm' }}>
                                            {item.height}
                                        </td>
                                        <td className="invoice-text text-right" style={{ width: '20mm' }}>
                                            {item.total}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5">
                                            <h3 className="table-title"></h3>
                                        </td>
                                    </tr>
                                </React.Fragment>

                            ))}

                        </tbody>
                    </table>


                    <footer class="body-footer">
                        <div class="footer-items margin-footer">
                            <p class="footer-name invoice-text">Sub Total</p>
                            <p class="footer-details invoice-text">24000</p>
                        </div>
                        <div class="footer-items">
                            <p class="footer-name invoice-text">Shipping Cost</p>
                            <p class="footer-details invoice-text">0</p>
                        </div>
                        <div class="footer-items">
                            <p class="footer-name invoice-text">Total Tax</p>
                            <p class="footer-details invoice-text">0</p>
                        </div>
                        <h3 class="table-title"></h3>
                        <div class="footer-items">
                            <p class="footer-name invoice-text">Coupon Discount</p>
                            <p class="footer-details invoice-text">0</p>
                        </div>
                        <h3 class="table-title"></h3>
                        <div class="footer-items margin-footer-botom">
                            <p class="footer-name invoice-text">Grand Total</p>
                            <p class="footer-details invoice-text">24000</p>
                        </div>
                        <p class="footer-company invoice-text">&copy; Right Brain Solution Ltd.</p>
                    </footer>
                </main>
            </div>
        </>

    )
}