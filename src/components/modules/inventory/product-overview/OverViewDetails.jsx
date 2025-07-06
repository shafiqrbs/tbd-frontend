import React from 'react';
import {
    Box, Grid, useMantineTheme, Text,
    Title, Stack, Card,
    Chip, Image,
    ScrollArea, Flex,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import barcode from '../../../../assets/images/frame.png';

function OverViewDetails(props) {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104

    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData);

    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []


    return (
        <>
            <Box h={height + 100}>
                <Box >
                    <Box bg={'#f0f1f9'}>
                        <Box pb={6} pt={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }} >
                                <Grid.Col span={8} >
                                    <Box h={160} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                        <Stack>
                                            <Text fw={900} pl={'sm'} fz={'md'}>{t('ProductDetails')}</Text>
                                            <Grid columns={24} gutter={0} pl={'12'}>
                                                <Grid.Col span={14}>
                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={4}>
                                                            <Text fz="xs" fw={600} >{t('ProductName')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} pl={0} >{showEntityData?.product_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'6'}>
                                                        <Grid.Col span={4}>
                                                            <Text fz="xs" fw={600} >{t('AlternateName')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} pl={0}>{showEntityData?.alternative_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={4}>
                                                            <Text pt={2} fz="xs" fw={600} >{t('Status')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} pt={2}>:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600}>
                                                                {showEntityData?.status === 1 ? (
                                                                    <Chip checked={true} color='var(--theme-primary-color-6)' size="xs" radius="xs">
                                                                        {t('Active')}
                                                                    </Chip>
                                                                ) : (
                                                                    <Chip checked={false} color="gray.1" size="xs" radius="xs">
                                                                        {t('Disable')}
                                                                    </Chip>
                                                                )}
                                                            </Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Grid.Col>
                                                <Grid.Col span={10}>
                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={4}>
                                                            <Text fz="xs" fw={600} >{t('Category')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} >{showEntityData?.category_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={4}>
                                                            <Text pt={2} fz="xs" fw={600} >{t('ID')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} pt={2} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} pt={2} >{showEntityData?.id}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={4}>
                                                            <Text fz="xs" fw={600} >{t('ProductType')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600}>:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600}>{showEntityData?.product_type}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Grid.Col>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={8} >
                                    <Box h={160} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                        <Stack>
                                            <Text fw={900} pl={'sm'} fz={'md'}>{t('StockInformation')}</Text>
                                            <Grid columns={24} gutter={0} >
                                                <Grid.Col span={12} pl={'12'}>
                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={5}>
                                                            <Text fz="xs" fw={600} >{t('PurchasePrice')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600}  >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={5}>
                                                            <Text fz="xs" fw={600} >{showEntityData?.purchase_price}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'6'} >
                                                        <Grid.Col span={5}>
                                                            <Text fz="xs" fw={600} >{t('SalesPrice')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600}   >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={6}>
                                                            <Text fz="xs" fw={600}  >{showEntityData?.sales_price}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'} >
                                                        <Grid.Col span={5}>
                                                            <Text pt={2} fz="xs" fw={600}   >{t('MinimumQuantity')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} pt={2} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={6}>
                                                            <Text fz="xs" fw={600} pt={2} >{showEntityData?.min_quantity}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Grid.Col>
                                                <Grid.Col span={12}>
                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={5}>
                                                            <Text fz="xs" fw={600} >{t('Unit')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={6}>
                                                            <Text fz="xs" fw={600} >{showEntityData?.unit_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>

                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={5}>
                                                            <Text pt={2} fz="xs" fw={600} >{t('RemainingStock')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} pt={2} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={6}>
                                                            <Text fz="xs" fw={600} pt={2} >{showEntityData?.stock_quantity}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Grid.Col>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={8} >
                                    <Box bg={'white'} className={' borderRadiusAll '}>
                                        <Box className='' pl={`xs`} pr={8} pt={'xs'} h={160}>
                                            <Grid columns={12} gutter={0}>
                                                <Grid.Col span={6}>
                                                    <Stack>
                                                        <Text fw={900} pl={'sm'} fz={'md'}>{t('AdditionalInformation')}</Text>
                                                        <Grid columns={24} gutter={0} >
                                                            <Grid.Col span={24} pl={'12'}>
                                                                <Grid columns={12} gutter={0}>
                                                                    <Grid.Col span={3}>
                                                                        <Text fz="xs" fw={600} >{t('SKU')}</Text>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={1}>
                                                                        <Text fz="xs" fw={600} >:</Text>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={8}>
                                                                        <Text fz="xs" fw={600} >{showEntityData?.sku ? showEntityData?.sku : (t('NotAvailable'))}</Text>
                                                                    </Grid.Col>
                                                                </Grid>
                                                                <Grid columns={12} gutter={0} pt={'6'}>
                                                                    <Grid.Col span={3}>
                                                                        <Text fz="xs" fw={600}  >{t('Barcode')}</Text>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={1}>
                                                                        <Text fz="xs" fw={600} >:</Text>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={8}>
                                                                        <Text fz="xs" fw={600} >{showEntityData?.barcode ? showEntityData?.barcode : t('NotAvailable')}</Text>
                                                                    </Grid.Col>
                                                                </Grid>
                                                                <Grid columns={12} gutter={0} pt={'4'}>

                                                                </Grid>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Stack>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Image mt={'lg'} src={barcode} h={100} fit='contain' />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>

                                    </Box>
                                </Grid.Col>
                            </Grid>
                        </Box>

                    </Box >
                </Box >
                <Box >
                    <Box>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={8} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Title order={6} pl={'6'}>{t('Unit')}</Title>
                                    </Box>
                                    <Box mb={0} bg={'gray.1'} h={height - 146}>
                                        <Box p={'md'} className="boxBackground borderRadiusAll" h={height - 146}>
                                            <ScrollArea h={height - 176} type='never'>
                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('UnitName')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.unit_name && showEntityData?.unit_name}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('UnitSymbol')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.unit_symbol && showEntityData?.unit_symbol}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('ConversionRate')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.conversion_rate && showEntityData?.conversion_rate}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('BaseUnit')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.base_unit && showEntityData?.base_unit}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('FractionalQuantityAllowed')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.fractional_quantity_allowed && showEntityData?.fractional_quantity_allowed}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('SmallestSaleableUnit')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.smallest_saleable_unit && showEntityData?.smallest_saleable_unit}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={10} align={'left'} fw={'600'} fz={'14'}>{t('UnitDescription')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'13'}>{showEntityData && showEntityData?.unit_description && showEntityData?.unit_description}</Grid.Col>
                                                </Grid>

                                            </ScrollArea>

                                        </Box>
                                    </Box>
                                </Box>

                            </Grid.Col>
                            <Grid.Col span={8} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Title order={6} pl={'6'}>{t('Gallery')}</Title>
                                    </Box>
                                    <Box mb={0} bg={'gray.1'} h={height - 146}>
                                        <Box p={2} className="boxBackground borderRadiusAll" h={height - 146}>
                                            <ScrollArea h={height - 176} type='never'>
                                                <Card padding="xs">
                                                    <Card.Section p={'xs'}>
                                                        <Image
                                                            src={showEntityData && showEntityData?.feature_image}
                                                            height={200}
                                                            fit="cover"
                                                            width="100%"
                                                            fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                                                showEntityData && showEntityData?.product_name
                                                            )}`}
                                                        />
                                                    </Card.Section>
                                                    <Grid columns={12} gutter={4}>
                                                        <Grid.Col span={6} p={2}>
                                                            <Image
                                                                src={showEntityData && showEntityData?.path_one }
                                                                height={140}
                                                                width="100%"
                                                                fit="cover"
                                                                fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                                                    showEntityData && showEntityData?.product_name
                                                                )}`}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} p={2}>
                                                            <Image
                                                                src={showEntityData && showEntityData?.path_two}
                                                                height={140}
                                                                width="100%"
                                                                fit="cover"
                                                                fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                                                    showEntityData && showEntityData?.product_name
                                                                )}`}
                                                            />
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={4} pt={'xs'}>
                                                        <Grid.Col span={6} p={2}>
                                                            <Image
                                                                src={showEntityData && showEntityData?.path_three}
                                                                height={140}
                                                                width="100%"
                                                                fit="cover"
                                                                fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                                                    showEntityData && showEntityData?.product_name
                                                                )}`}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} p={2}>
                                                            <Image
                                                                src={showEntityData && showEntityData?.path_four}
                                                                height={140}
                                                                width="100%"
                                                                fit="cover"
                                                                fallbackSrc={`https://placehold.co/120x80?text=${encodeURIComponent(
                                                                    showEntityData && showEntityData?.product_name
                                                                )}`}
                                                            />
                                                        </Grid.Col>

                                                    </Grid>
                                                </Card>
                                            </ScrollArea>
                                        </Box>
                                    </Box>

                                </Box>
                            </Grid.Col>
                            <Grid.Col span={8} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Title order={6} pl={'6'}>{t('StockHistory')}</Title>
                                    </Box>
                                    <Box mb={0} bg={'gray.1'} h={height - 146}>
                                        <Box p={'md'} className="boxBackground borderRadiusAll" h={height - 146}>
                                            <ScrollArea h={height - 176} type='never'>
                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('Date')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.date && showEntityData?.date}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('TransactionType')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.transaction_type && showEntityData?.transaction_type}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('QuantityIn')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.quantity_in && showEntityData?.quantity_in}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('QuantityOut')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.quantity_out && showEntityData?.quantity_out}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('Balance')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.balance && showEntityData?.balance}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('ReferenceNumber')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.reference_number && showEntityData?.reference_number}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('SupplierCustomer')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.supplier_or_customer && showEntityData?.supplier_or_customer}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('Location')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.location && showEntityData?.location}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('Remarks')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.remarks && showEntityData?.remarks}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('CostPerUnit')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.cost_per_unit && showEntityData?.cost_per_unit}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('TotalCost')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.total_cost && showEntityData?.total_cost}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('BatchLotNumber')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.batch_lot_number && showEntityData?.batch_lot_number}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('ExpiryDate')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.expiry_date && showEntityData?.expiry_date}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('SerialNumber')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.serial_number && showEntityData?.serial_number}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('UserOperator')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.user_or_operator && showEntityData?.user_or_operator}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('ReorderLevel')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.reorder_level && showEntityData?.reorder_level}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('ReasonForAdjustment')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.reason_for_adjustment && showEntityData?.reason_for_adjustment}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('SupplierInvoiceNumber')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.supplier_invoice_number && showEntityData?.supplier_invoice_number}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('OrderNumber')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.order_number && showEntityData?.order_number}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('TransportShippingInformation')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.transport_shipping_information && showEntityData?.transport_shipping_information}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('ConditionOfGoods')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.condition_of_goods && showEntityData?.condition_of_goods}</Grid.Col>
                                                </Grid>

                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('WarehouseStorageBin')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}>{showEntityData && showEntityData?.warehouse_storage_bin && showEntityData?.warehouse_storage_bin}</Grid.Col>
                                                </Grid>
                                                <Grid columns={24}>
                                                    <Grid.Col span={9} align={'left'} fw={'600'} fz={'14'}>{t('Currency')}</Grid.Col>
                                                    <Grid.Col span={1}>:</Grid.Col>
                                                    <Grid.Col span={'14'}></Grid.Col>
                                                </Grid>

                                            </ScrollArea>

                                        </Box>
                                    </Box>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            </Box >
        </>
    );
}

export default OverViewDetails;