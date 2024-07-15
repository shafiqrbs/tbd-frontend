import React, { useRef } from 'react';
import { Button, Center, ScrollArea } from '@mantine/core';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../../../../assets/images/logo.png';

export function SalesDomainOne(props) {
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

    return (
        <>
            <Center >
                <Button mt={'lg'} mb={0} onClick={handlePrint}>Print</Button>
            </Center>
            <div >
                <div className='print-body' ref={componentRef}>
                    <header className="pos-print-header">
                        <div className="pos-print-header">
                            <img src={logo} alt="" className="pos-print-logo" />
                            <h3 className="pos-print-title">Medicine Demo</h3>
                            <p className="pos-print-address">Right Brain Solution, Gausul Azam Avenue , Uttara , Dhaka</p>
                            <h3 className="invoice">
                                Invoice : 1956325879
                            </h3>
                            <div className="header-details">
                                <div className="header-description">
                                    <p className="description-details">Date : 15-07-2024 12:16 PM</p>
                                    <p className="description-details">Sales By : RightBrain Solution</p>
                                </div>
                                <div className="header-description">
                                    <p className="description-details">
                                        Pay Mode : Cash
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="pos-print-main">
                        <hr className="hr" />
                        <table style={{ width: '80mm' }} className='print-table'>
                            <tr className='table-tr'>
                                <th className='table-td table-th' style={{ width: '40mm' }}>Item Name</th>
                                <th className='table-td table-th table-amount' style={{ width: '10mm' }}>Unit</th>
                                <th className='table-td table-th table-quantity' style={{ width: '10mm' }}>Qty</th>
                                <th className='table-td table-th table-amount' style={{ width: '20mm' }}>Price</th>
                            </tr>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className='table-td table-tdp'>{item.product}</td>
                                    <td className='table-td table-tdp table-amount'>{item.price}</td>
                                    <td className='table-td table-tdp table-quantity'>{item.quantity}</td>
                                    <td className='table-td table-tdp table-amount'>{item.total}</td>
                                </tr>
                            ))}

                        </table>
                        <hr className="hr" />
                        <table style={{ width: '80mm' }}>
                            <tr className='table-tr'>
                                <td className='table-td table-tdp' style={{ width: '50mm' }}>Sub Total</td>
                                <td className='table-td table-tdp table-quantity' style={{ width: '10mm' }}>TK</td>
                                <td className='table-td table-tdp table-amount' style={{ width: '20mm' }}>2930</td>
                            </tr>
                            <tr className='table-tr'>
                                <td className='table-td table-tdp ' style={{ width: '50mm' }}>Discount</td>
                                <td className='table-td table-tdp table-quantity' style={{ width: '10mm' }}>TK</td>
                                <td className='table-td table-tdp table-amount' style={{ width: '20mm' }}>50</td>
                            </tr>
                        </table>
                        <hr className="hr" />
                        <table style={{ width: '80mm' }}>
                            <tr className='table-tr'>
                                <td className='table-td table-tdp' style={{ width: '50mm' }}>NetPayable</td>
                                <td className='table-td table-tdp table-quantity' style={{ width: '10mm' }}>TK</td>
                                <td className='table-td table-tdp table-amount' style={{ width: '20mm' }}>2930</td>
                            </tr>
                            <tr className='table-tr'>
                                <td className='table-td table-tdp' style={{ width: '50mm' }}>Paid</td>
                                <td className='table-td table-tdp table-quantity' style={{ width: '10mm' }}>TK</td>
                                <td className='table-td table-tdp table-amount' style={{ width: '20mm' }}>2930</td>
                            </tr>
                        </table>
                    </main>
                    <footer>
                        <div className="print-footer">
                            <h3 className="footer-title">*Medicines Once Sold are not taken Back*</h3>
                            <p className="footer-description">Development by RightBrain Solution LTD.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}