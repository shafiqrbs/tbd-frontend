import {
    Modal, Button, Flex, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Group, ActionIcon, Stack,
    Chip, Image
} from '@mantine/core';

import { useTranslation } from 'react-i18next';
import React, { useEffect, } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconEyeEdit, IconMessage, IconTallymark1
} from '@tabler/icons-react';
import { useState } from 'react';
import { getShowEntityData } from '../../../../../store/inventory/crudSlice';
import { notifications } from "@mantine/notifications";
import barcode from '../../../../../assets/images/frame.png'

function __OverViewTab(props) {
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104

    const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false);

    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData);


    return (
        <>
            <Box h={height + 100}>
                <Box >
                    <Box bg={'#f0f1f9'}>
                        <Box pb={6} pt={'8'}>
                            <Grid columns={24} gutter={{ base: 8 }} >
                                <Grid.Col span={7} >
                                    <Box h={140} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                        <Stack>
                                            <Text fw={900} pl={'6'} fz={'md'}>{t('ProductDetails')}</Text>
                                            <Grid columns={24} gutter={0} >
                                                <Grid.Col span={14}>
                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={4}>
                                                            <Text ta={'right'} fz="xs" fw={600} >{t('ProductName')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text ta={'right'} fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text ta={'center'} fz="xs" fw={600} >{showEntityData?.product_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'6'}>
                                                        <Grid.Col span={4}>
                                                            <Text ta={'right'} fz="xs" fw={600} >{t('AlternateName')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text ta={'right'} fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} ta={'center'} >{showEntityData?.alternative_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={4}>
                                                            <Text ta={'right'} pt={2} fz="xs" fw={600} >{t('Status')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text ta={'right'} fz="xs" fw={600} pt={2}>:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text ta={'center'} fz="xs" fw={600}>
                                                                {showEntityData?.status === 1 ? (
                                                                    <Chip defaultChecked color="red" size="xs" radius="xs">
                                                                        {t('Active')}
                                                                    </Chip>
                                                                ) : (
                                                                    <Chip defaultChecked={false} size="xs" radius="xs">
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
                                                            <Text fz="xs" fw={600} >{t('Unit')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} >{showEntityData?.unit_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={4}>
                                                            <Text fz="xs" fw={600} >{t('Category')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600}  >{showEntityData?.category_name}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>

                                                    </Grid>
                                                </Grid.Col>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={8} >
                                    <Box h={140} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                        <Stack>
                                            <Text fw={900} pl={'6'} fz={'md'}>{t('StockInformation')}</Text>
                                            <Grid columns={24} gutter={0} >
                                                <Grid.Col span={14}>
                                                    <Grid columns={12} gutter={0}>
                                                        <Grid.Col span={4}>
                                                            <Text ta={'right'} fz="xs" fw={600} >{t('PurchasePrice')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text ta={'right'} fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text ta={'center'} fz="xs" fw={600} >{showEntityData?.purchase_price}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'6'}>
                                                        <Grid.Col span={4}>
                                                            <Text ta={'right'} fz="xs" fw={600} >{t('SalesPrice')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text ta={'right'} fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} ta={'center'} >{showEntityData?.sales_price}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>
                                                        <Grid.Col span={4}>
                                                            <Text pt={2} fz="xs" fw={600} ta={'right'} >{t('MinimumQuantity')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} ta={'right'} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600} ta={'center'} >{showEntityData?.min_quantity}</Text>
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
                                                            <Text fz="xs" fw={600} >{t('Type')}</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Text fz="xs" fw={600} >:</Text>
                                                        </Grid.Col>
                                                        <Grid.Col span={7}>
                                                            <Text fz="xs" fw={600}  >{showEntityData?.product_type}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    <Grid columns={12} gutter={0} pt={'4'}>

                                                    </Grid>
                                                </Grid.Col>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                </Grid.Col>
                                <Grid.Col span={9} >
                                    <Box h={140} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'}  >
                                        <Grid columns={12} gutter={0}>
                                            <Grid.Col span={6}>
                                                <Stack>
                                                    <Text fw={900} pl={'6'} fz={'md'}>{t('AdditionalInformation')}</Text>
                                                    <Grid columns={24} gutter={0} >
                                                        <Grid.Col span={24}>
                                                            <Grid columns={12} gutter={0}>
                                                                <Grid.Col span={4}>
                                                                    <Text ta={'right'} fz="xs" fw={600} >{t('SKU')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text ta={'right'} fz="xs" fw={600} >:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={7}>
                                                                    <Text ta={'center'} fz="xs" fw={600} >{showEntityData?.sku ? showEntityData?.sku : (t('NotAvailable'))}</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                            <Grid columns={12} gutter={0} pt={'6'}>
                                                                <Grid.Col span={4}>
                                                                    <Text ta={'right'} fz="xs" fw={600} >{t('Barcode')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text ta={'right'} fz="xs" fw={600} >:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={7}>
                                                                    <Text fz="xs" fw={600} ta={'center'} >{showEntityData?.barcode ? showEntityData?.barcode : t('NotAvailable')}</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                            <Grid columns={12} gutter={0} pt={'4'}>
                                                                <Grid.Col span={4}>
                                                                    <Text pt={2} fz="xs" fw={600} ta={'right'} >{t('Id')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz="xs" fw={600} ta={'right'} >:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={7}>
                                                                    <Text fz="xs" fw={600} ta={'center'} >{showEntityData?.id}</Text>
                                                                </Grid.Col>
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
                                </Grid.Col>
                            </Grid>
                        </Box>

                    </Box >
                </Box >
                <Box >
                    <Box>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={7} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Title order={6} pl={'6'}>{t('Invoices')}</Title>
                                    </Box>
                                    <Box className={'borderRadiusAll'} h={height - 126}>

                                    </Box>
                                </Box>

                            </Grid.Col>
                            <Grid.Col span={8} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Title order={6} pl={'6'}>{t('BatchItems')}</Title>
                                    </Box>
                                    <Box className={'borderRadiusAll'} h={height - 126} >

                                    </Box>

                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                        <Title order={6} pl={'6'}>{t('Transactions')}</Title>
                                    </Box>
                                    <Box className={'borderRadiusAll'} h={height - 126}>

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

export default __OverViewTab;