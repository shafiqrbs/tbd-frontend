import React, {useEffect, useRef, useState} from "react";
import {
    Box, Button,
    Grid, Progress, ScrollArea, Table, Text, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import {IconEdit, IconPrinter, IconReceipt} from "@tabler/icons-react";
import {ReactToPrint} from "react-to-print";
import {useOutletContext} from "react-router-dom";

function _InvoiceForDomain359(props) {
    const {invoicePrintData} = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 314; //TabList height 104

    const insertType = useSelector((state) => state.crudSlice.insertType)
    const printRef = useRef()
    const [salesViewData, setSalesViewData] = useState({})
    const data = [
        {
            index: 0,
            item_name: 'Ball Pen',
            quantity: 10,
            price: 10,
            sales_price: 10,
            sub_total: 100
        },
        {
            index: 1,
            item_name: 'Pencil',
            quantity: 20,
            price: 5,
            sales_price: 5,
            sub_total: 100
        },

    ]

    console.log(invoicePrintData)

    const rows = salesViewData && salesViewData.sales_items && salesViewData.sales_items.map((element, index) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{index + 1} 1</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.item_name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.quantity}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sales_price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sub_total}</Table.Td>
        </Table.Tr>
    ));
    const row2 = data.map((elements) => (
        <Table.Tr key={elements.index}>
            <Table.Td>{elements.item_name}</Table.Td>
            <Table.Td>{elements.quantity}</Table.Td>
            <Table.Td>{elements.price}</Table.Td>
            <Table.Td>{elements.sales_price}</Table.Td>
            <Table.Td>{elements.sub_total}</Table.Td>
        </Table.Tr>
    ));


    return (
        <>
            <Box style={{ display: "none" }}>
                <Grid columns={8} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} id={"printElement"} ref={printRef}>
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                {t('Invoice')}: {salesViewData && salesViewData.invoice && salesViewData.invoice} Test
                            </Box>
                            <Box className={'borderRadiusAll'} fz={'sm'}  >
                                <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                    <Grid gutter={{ base: 4 }}>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Customer</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.customer_id && salesViewData.customer_id} Foysal Mahmud Hasan
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mobile</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.customerMobile && salesViewData.customerMobile} 01521334751
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Address</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.customer_address && salesViewData.customer_address}Ibrahimpur, Kafrul, Dhaka
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Balance</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.balance ? Number(salesViewData.balance).toFixed(2) : 0.00}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.created && salesViewData.created} 05/05/2024
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created By</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.createdByName && salesViewData.createdByName} Foysal Mahmud
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Sales By</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.salesByUser && salesViewData.salesByUser} Foysal Mahmud
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mode</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.mode_name && salesViewData.mode_name} Bkash
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Process</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {salesViewData && salesViewData.process && salesViewData.process} Paid
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <ScrollArea h={height} scrollbarSize={2} type="never" >
                                    <Box>
                                        <Table stickyHeader >
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                    <Table.Th fz="xs" ta="left" w={'300'}>{t('Name')}</Table.Th>
                                                    <Table.Th fz="xs" ta="center" w={'60'}>{t('QTY')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'80'}>{t('Price')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>{t('SalesPrice')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>{rows}</Table.Tbody>
                                            <Table.Tfoot>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('SubTotal')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.sub_total && Number(salesViewData.sub_total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.discount && Number(salesViewData.discount).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.total && Number(salesViewData.total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {salesViewData && salesViewData.payment && Number(salesViewData.payment).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                        <Box>
                            <Button.Group fullWidth>

                                <Button
                                    fullWidth
                                    variant="filled"
                                    leftSection={<IconPrinter size={14} />}
                                    color="green.5"
                                >
                                    <ReactToPrint
                                        trigger={() => {
                                            return <a href="#">Print</a>;
                                        }}
                                        content={() => printRef.current}
                                    />
                                </Button>
                                <Button
                                    fullWidth
                                    variant="filled"
                                    leftSection={<IconReceipt size={14} />}
                                    color="red.5"
                                    onClick={()=>{

                                        /*const printWindow = window.open('', '_blank');
                                        printWindow.document.write('<html><head><title>Print</title></head><body>');
                                        printWindow.document.write(printRef.current.innerHTML);
                                        printWindow.document.write('</body></html>');
                                        printWindow.document.close(); // necessary for some browsers
                                        printWindow.onload = function() {
                                            printWindow.print();
                                            printWindow.onafterprint = function() {
                                                printWindow.close();
                                            }
                                        }*/

                                        /*let printContents = document.getElementById("printElement").innerHTML;

                                        let newTab = window.open("", "_blank");

                                        newTab.document.write('<html><head><title>Print</title></head><body>');
                                        newTab.document.write(printContents);
                                        newTab.document.write('</body></html>');
                                        newTab.document.close();

                                        newTab.onload=function(){
                                            newTab.focus();
                                            newTab.print();
                                            newTab.onafterprint = function () {
                                                newTab.close();
                                            }
                                        }*/
                                        /*let printContents = document.getElementById("printElement").innerHTML;
                                        let newTab = window.open("", "_blank");

                                        newTab.document.write(printContents);
                                        newTab.document.close(); // for some browsers to render the content
                                        newTab.window.onload = function() {
                                            newTab.print();
                                        };*/

                                        /*let printContents = document.getElementById("printElement").innerHTML;
                                        let originalContents = document.body.innerHTML;
                                        document.body.innerHTML = printContents;
                                        window.print();
                                        document.body.innerHTML = originalContents;*/

                                        /*let printContents = document.getElementById("printElement").innerHTML;
                                        // let printContents = document.getElementById('printElement").innerHTML;
                                        let newWin = window.open("", "_blank");
                                        newWin.document.write('<html><head><title>Print</title></head><body>' + printContents + '</body></html>');
                                        newWin.document.close();
                                        newWin.onload=function(){
                                            newWin.focus();
                                            newWin.print();
                                            newWin.onafterprint = function () {
                                                newWin.close();
                                            }
                                        }*/

                                        /*// Open the content in a new tab
                                        var printWindow = window.open('', '_blank');

// Get the content from an element by its ID
                                        var contentToPrint = document.getElementById("printElement").innerHTML;

// Populate the new tab with content
                                        printWindow.document.write("<html><head><title>Print Content</title></head><body>");
                                        printWindow.document.write(contentToPrint);
                                        printWindow.document.write("</body></html>");

// Close the document writing
                                        printWindow.document.close();

// Wait for a moment before printing (optional)
                                        setTimeout(function() {
                                            // Print the content
                                            printWindow.print();

                                            // Close the new tab after printing is initiated
                                            setTimeout(function() {
                                                printWindow.close();
                                            }, 10); // Adjust the timeout value as needed
                                        }, 100); // Adjust the timeout value as needed*/


                                        /*var printWindow = window.open('', '_blank');
                                        printWindow.document.write("<html><head><title>Print Content</title></head><body>");
                                        printWindow.document.write("<h1>Your content goes here</h1>");
                                        printWindow.document.write("</body></html>");
                                        printWindow.document.close();

                                        setTimeout(function() {
                                            printWindow.print();
                                            setTimeout(function() {
                                                printWindow.close();
                                            }, 10);
                                        }, 100);*/

                                        /*window.print();
                                        setTimeout(function () {
                                            window.open('', '_blank', '');
                                            window.close();
                                        }, 2000);*/
                                    }}
                                >
                                    Pos
                                </Button>
                                <Button
                                    fullWidth
                                    variant="filled"
                                    leftSection={<IconEdit size={14} />}
                                    color="cyan.5"
                                >
                                    Edit
                                </Button>
                            </Button.Group>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default _InvoiceForDomain359;
