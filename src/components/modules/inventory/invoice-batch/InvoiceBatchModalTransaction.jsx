import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
    Modal, Button, Flex, Progress, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Checkbox, Group, Menu, ActionIcon, rem, Table, Card,
    SimpleGrid,
    ScrollArea
} from '@mantine/core';
// import SampleModal from './SampleModal';

import { useTranslation } from 'react-i18next';
import { useEffect, } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconInfoCircle,
    IconDotsVertical,
    IconTrashX,
    IconMoneybag
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import classes from '../../../../assets/css/FeaturesCards.module.css';

const elements = [
    { transactionNumber: '85165465', createdDate: '10/06/24', createBy: 'Foysal', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '49864566', createdDate: '10/06/24', createBy: 'Foysal', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '48465465', createdDate: '10/06/24', createBy: 'Foysal', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '49865153', createdDate: '10/06/24', createBy: 'Foysal', approvedby: 'Foysal', discount: 20, receive: 60 },
]


function InvoiceBatchModalTransaction(props) {
    const theme = useMantineTheme();

    // useEffect(() => {
    //     console.log(props.batchViewModal);
    // }, []);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const tableHeight = mainAreaHeight - 150; //TabList height 104
    const navigate = useNavigate();

    return (
        <>
            <Box>
                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                    <Box p={0} >
                        {elements.map((elements, index) => (
                            <Card shadow="md" radius="md" className={classes.card} mb={'xs'} p={'xs'}>
                                <SimpleGrid>
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={5}>
                                            <Text fz="sm" fw={600} >{t('TransactionNumber')}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Text fz={'sm'} fw={700}>:</Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text fz="sm" fw={300} >{elements.transactionNumber}</Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={5}>
                                            <Text fz="sm" fw={600}  >{t('CreatedDate')}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Text fz={'sm'} fw={700}>:</Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text fz="sm" fw={300}  >{elements.createdDate}</Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={5}>
                                            <Text fz="sm" fw={600}  >{t('CreatedBy')}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Text fz={'sm'} fw={700}>:</Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text fz="sm" fw={300}  >{elements.createBy}</Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={5}>
                                            <Text fz="sm" fw={600}  >{t('ApprovedBy')}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Text fz={'sm'} fw={700}>:</Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text fz="sm" fw={300}  >{elements.approvedby}</Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 2 }}>
                                        <Grid.Col span={5}>
                                            <Text fz="sm" fw={600}  >{t('Discount')}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Text fz={'sm'} fw={700}>:</Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text fz="sm" fw={300}  >{elements.discount}</Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Grid gutter={{ base: 2 }} >
                                        <Grid.Col span={5}>
                                            <Text fz="sm" fw={600}  >{t('Receive')}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1}>
                                            <Text fz={'sm'} fw={700}>:</Text>
                                        </Grid.Col>
                                        <Grid.Col span={6} >
                                            <Text fz="sm" fw={300}  >{elements.receive}</Text>
                                        </Grid.Col>
                                    </Grid>
                                </SimpleGrid>

                            </Card>
                        )
                        )}

                    </Box>
                </ScrollArea>
            </Box>
        </>
    );
}

export default InvoiceBatchModalTransaction;