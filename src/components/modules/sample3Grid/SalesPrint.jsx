import React, { useRef, forwardRef } from "react";
import ReactToPrint from "react-to-print";

import {
    rem, Modal, List, ThemeIcon, Box, Grid,
    useMantineTheme, Paper, Flex, Text, Button,
    Title, GridCol, Container, ScrollArea, Table, Image
} from "@mantine/core"
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy,
    IconPrinter
} from "@tabler/icons-react";

import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";


const data = [
    {
        "id": "01",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "35",
        "Quantity": "60",
        "SubTotal": "2,100"
    },
    {
        "id": "02",
        "Name": "Pregaba ER Capsule 82.5mg Opsonin Pharma Limited",
        "SalesPrice": "25",
        "Quantity": "30",
        "SubTotal": "750"
    },
    {
        "id": "03",
        "Name": "Capsule Indomet SR 75 mg",
        "SalesPrice": "4.2",
        "Quantity": "60",
        "SubTotal": "252"
    },
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    }, ,
    {
        "id": "04",
        "Name": "Tablet Tofacent 5 5 mg",
        "SalesPrice": "10",
        "Quantity": "60",
        "SubTotal": "600"
    },
]



function SalesPrint(props, ref) {

    const { t, i18n } = useTranslation();
    const theme = useMantineTheme();
    const { isOnline, mainAreaHeight } =
        useOutletContext();

    const rows = data.map((data) => (
        <Table.Tr key={data.id}>
            <Table.Td style={{ border: '1px solid #ddd' }}>{data.Name}</Table.Td>
            <Table.Td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{data.SalesPrice}</Table.Td>
            <Table.Td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{data.Quantity}</Table.Td>
            <Table.Td style={{ textAlign: 'right', border: '1px solid #ddd' }}>{data.SubTotal}</Table.Td>
        </Table.Tr>
    ));
    const row1 = 1234324;
    const row2 = 2234324;
    const row3 = 3234234;
    const row4 = 4234234;
    const row5 = 5234234;

    return (

        <>
            <div ref={ref}>
                
                <Container  >
                    <Grid bg={'white'}>
                        <Grid.Col span={4} >
                            <Title mt={`xs`} order={2} pt={'xs'} ml={'lg'} c={'red.5'}>{t('RightBrain Solutions')}</Title>
                            <Box h={'md'}></Box>
                            <Box pt={'sm'} ml={'lg'}>

                                <Text>100 Street Address, City, State, Zip</Text>
                                <Text>Website, Email Address</Text>
                                <Text>Phone Number</Text>
                            </Box>
                        </Grid.Col>

                        <Grid.Col span={4} offset={4} style={{ textAlign: 'right' }}>
                            <Title mt={'xs'} order={2} pt={'xs'} mr={'xl'} c={'red.5'}>{t('Invoice')}</Title>

                        </Grid.Col>
                    </Grid>
                </Container>
                <Box h={'md'}></Box>
                <Container   >
                    <Grid bg={'white'} columns={16} style={{ textAlign: 'left' }}>
                        <Grid.Col span={4}  >
                            <Title mt={`sm`} order={2} pt={'sm'} fz={'md'} ml={'lg'} c={'red.5'}>{t('BILL TO')}</Title>
                            <Box pt={'sm'} ml={'lg'}>
                                <Text>Murad Bhai</Text>
                                <Text>Client Company Name</Text>
                                <Text>Address</Text>
                                <Text>Phone, Email</Text>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={4} >
                            <Title fz={'md'} mt={'sm'} order={2} pt={'sm'} pl={'xl'} c={'red.5'}>{t('LOCATION')}</Title>
                            <Box pl={'sm'} pt={'sm'} ml={'lg'} >
                                <Text>Name</Text>
                                <Text>Address</Text>
                                <Text>Phone</Text>
                            </Box>

                        </Grid.Col>
                        <GridCol span={1}>

                        </GridCol>
                        <Grid.Col span={7} mt={'lg'}>
                            <Grid>
                                <GridCol span={7} style={{ textAlign: 'right' }}>
                                    <Box style={{ textAlign: 'right' }} pl={'sm'} mt={'sm'} pt={'sm'} ml={'lg'}>
                                        <Text mt={'xs'} c={'blue.5'} fz={'14'} fw={'bold'}>{t('Invoice No :')}</Text>
                                        <Text mt={'xs'} c={'blue.5'} fz={'14'} fw={'bold'}>{t('Invoice Date :')}</Text>
                                        <Text mt={'xs'} c={'blue.5'} fz={'14'} fw={'bold'}>{t('Due Date :')}</Text>
                                    </Box>
                                </GridCol>
                                <GridCol span={5} style={{ textAlign: 'right' }}>
                                    <Box style={{ textAlign: 'right' }} mt={'sm'} pt={'sm'} mr={'xl'}>
                                        <Text mt={'xs'} c={'blue.5'} fz={'14'} fw={'bold'}>225689/23</Text>
                                        <Text mt={'xs'} c={'blue.5'} fz={'14'} fw={'bold'}>01-05-2023</Text>
                                        <Text mt={'xs'} c={'blue.5'} fz={'14'} fw={'bold'}>31-05-2023</Text>
                                    </Box>
                                </GridCol>
                            </Grid>
                        </Grid.Col>
                    </Grid>

                </Container>
                <Box mt={'xl'} bg={'white'}></Box>

                <Container  >
                    <Box bg={`white`} >
                        <Table withTableBorder={true} withColumnBorders={true}  >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w={'40%'} style={{ border: '1px solid #ddd' }}  >Name</Table.Th>
                                    <Table.Th w={'20%'} style={{ textAlign: 'center', border: '1px solid #ddd' }}>Sales Price</Table.Th>
                                    <Table.Th w={'20%'} style={{ textAlign: 'center', border: '1px solid #ddd' }}>Quantity</Table.Th>
                                    <Table.Th w={'20%'} style={{ textAlign: 'right', border: '1px solid #ddd' }}>Sub-Total</Table.Th>
                                    {/* <Table.Th>Element name</Table.Th>
                            <Table.Th>Symbol</Table.Th>
                            <Table.Th>Atomic mass</Table.Th> */}
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody >{rows}</Table.Tbody>
                            {/*<Table.Caption>Scroll page to see sticky thead</Table.Caption>*/}
                        </Table>
                    </Box>
                </Container>
                <Container >
                    <Grid columns={10} bg={'white'} gutter={0}>
                        <GridCol span={4} mt={'sm'} style={{ display: 'flex', alignItems: 'center' }}>
                            <Box bg={'white'} mt={'xl'} pb={0}>
                                <Title mt={'xl'} ml={'sm'} c={'blue'} order={4}>Thank you for your business</Title>
                                <Title mt={'xl'} pt={'lg'} ml={'sm'} style={{ textAlign: 'left' }} order={6} c={'blue'}>Terms & Conditions</Title>
                                <Grid >
                                    <GridCol span={12} ml={'sm'}>
                                        <Box >
                                            <text style={{ fontSize: 'x-small' }} >Payment Instructions</text>
                                        </Box>
                                        <Box >
                                            <text style={{ fontSize: 'x-small' }}>Terms & Conditions</text>
                                        </Box>
                                    </GridCol>
                                </Grid>
                            </Box>
                        </GridCol>
                        <GridCol span={2}>

                        </GridCol>

                        <GridCol span={2}  >

                            <Box mt={'0'}>
                                <Table withTableBorder={false} withRowBorders={false} >
                                    <Table.Tbody style={{ textAlign: 'right' }}>
                                        <Table.Tr p={'xs'} style={{ borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd', }}>
                                            <Table.Td style={{ fontSize: '14 px', fontWeight: 'bold' }}>
                                                {t('Subtotal')}
                                            </Table.Td>
                                        </Table.Tr >
                                        <Table.Tr p={'xs'} style={{ borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd', }}>
                                            <Table.Td style={{ fontSize: '14 px', fontWeight: 'bold' }}>
                                                {t('Discount')}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr p={'xs'} style={{ borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd', }}>
                                            <Table.Td style={{ fontSize: '14 px', fontWeight: 'bold' }}>
                                                {t('-Discount')}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr p={'xs'} style={{ borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd', }}>
                                            <Table.Td style={{ fontSize: '14 px', fontWeight: 'bold' }}>
                                                {t('Tax')}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr p={'xs'} style={{ borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd', }}>
                                            <Table.Td style={{ fontSize: '14 px', fontWeight: 'bold' }}>
                                                {t('TaxAmount')}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr p={'xs'} style={{ borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd', }}>
                                            <Table.Td style={{ fontSize: '14 px', fontWeight: 'bold' }}>
                                                {t('BalanceDue')}
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            {/* <Text fz={'sm'} mt={'xs'} >{t('Subtotal')}</Text>
                            <Text fz={'sm'} mt={'xs'}>{t('Discount')}</Text>
                            <Text fz={'sm'} mt={'xs'}>{t('-Discount')}</Text>
                            <Text fz={'sm'} mt={'xs'}>{t('Tax')}</Text>
                            <Text fz={'sm'} mt={'xs'}>{t('TaxAmount')}</Text>
                            <Text fz={'sm'} mt={'xs'}>{t('BalanceDue')}</Text> */}
                        </GridCol>
                        <GridCol span={2} style={{ textAlign: 'right' }} >

                            <Box>
                                <Table withTableBorder={false} withColumnBorders={false}>
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Td style={{
                                                borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd',
                                                borderRight: '1px solid #ddd',
                                            }}>
                                                {row1}
                                            </Table.Td>
                                        </Table.Tr >
                                        <Table.Tr>
                                            <Table.Td style={{
                                                borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd',
                                                borderRight: '1px solid #ddd',
                                            }}>
                                                {row1}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td style={{
                                                borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd',
                                                borderRight: '1px solid #ddd',
                                            }}>
                                                {row1}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td style={{
                                                borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd',
                                                borderRight: '1px solid #ddd',
                                            }}>
                                                {row1}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td style={{
                                                borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd',
                                                borderRight: '1px solid #ddd',
                                            }}>
                                                {row1}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td style={{
                                                borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd',
                                                borderRight: '1px solid #ddd',
                                            }}>
                                                {row1}
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Box>

                        </GridCol>

                    </Grid>

                </Container>
                <Container  >
                    <Box mt={'md'}></Box>
                </Container>

            </div >
        </>



    );
}

export default forwardRef(SalesPrint);
