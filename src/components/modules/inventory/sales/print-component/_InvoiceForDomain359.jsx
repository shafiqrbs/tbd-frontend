import React, { useRef,} from "react";
import { Box,Grid, Table, Text} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

function _InvoiceForDomain359(props) {
    const {setInvoicePrintForSave} = props
    const invoicePrintData = useSelector((state) => state.inventoryCrudSlice.salesDetails);
    const { t, i18n } = useTranslation();
    const printRef = useRef()

    window.onafterprint = () => {
        setInvoicePrintForSave(false)
    };

    const rows = invoicePrintData && invoicePrintData.sales_items && invoicePrintData.sales_items.map((element, index) => (
        <Table.Tr key={element.name}>
            <Table.Td fz="xs" width={'20'}>{index + 1}</Table.Td>
            <Table.Td ta="left" fz="xs" width={'300'}>{element.item_name}</Table.Td>
            <Table.Td ta="center" fz="xs" width={'60'}>{element.quantity}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'80'}>{element.price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sales_price}</Table.Td>
            <Table.Td ta="right" fz="xs" width={'100'}>{element.sub_total}</Table.Td>
        </Table.Tr>
    ));


    return (
        <>
            <Box style={{ display: "none" }}>
                <Grid columns={8} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} id={"printElement"} ref={printRef}>
                            <Box h={'36'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'6'} mb={'4'} className={'boxBackground textColor borderRadiusAll'} >
                                {t('Invoice')}: {invoicePrintData && invoicePrintData.invoice && invoicePrintData.invoice}
                            </Box>
                            <Box className={'borderRadiusAll'} fz={'sm'}  >
                                <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                    <Grid gutter={{ base: 4 }}>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Customer</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.customer_name && invoicePrintData.customer_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mobile</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.customer_mobile && invoicePrintData.customer_mobile}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Address</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.customer_address && invoicePrintData.customer_address}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Balance</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.balance ? Number(invoicePrintData.balance).toFixed(2) : 0.00}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={'6'}>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.created_date && invoicePrintData.created_date}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Created By</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.created_by_user_name && invoicePrintData.created_by_user_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Sales By</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.sales_by_username && invoicePrintData.sales_by_username}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Mode</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.mode_name && invoicePrintData.mode_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid columns={15} gutter={{ base: 4 }}>
                                                <Grid.Col span={6} ><Text fz="sm" lh="xs">Process</Text></Grid.Col>
                                                <Grid.Col span={9} >
                                                    <Text fz="sm" lh="xs">
                                                        {invoicePrintData && invoicePrintData.process_name && invoicePrintData.process_name}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
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
                                                        {invoicePrintData && invoicePrintData.sub_total && Number(invoicePrintData.sub_total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Discount')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoicePrintData && invoicePrintData.discount && Number(invoicePrintData.discount).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Total')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoicePrintData && invoicePrintData.total && Number(invoicePrintData.total).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th colspan={'5'} ta="right" fz="xs" w={'100'}>{t('Receive')}</Table.Th>
                                                    <Table.Th ta="right" fz="xs" w={'100'}>
                                                        {invoicePrintData && invoicePrintData.payment && Number(invoicePrintData.payment).toFixed(2)}
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Tfoot>
                                        </Table>
                                    </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
}

export default _InvoiceForDomain359;
