import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
    Modal, Button, Flex, Progress, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Checkbox, Group, Menu, ActionIcon, rem, Table, Card,
    SimpleGrid,
    ScrollArea, Stack,
    Center
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
    IconMoneybag,
    IconDeviceFloppy,
    IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import classes from '../../../../assets/css/FeaturesCards.module.css';

const elements = [
    { transactionNumber: '85165465', createdDate: '10/06/24', createBy: 'Foysal', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '49864566', createdDate: '10/06/24', createBy: 'Mahmud', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '48465465', createdDate: '10/06/24', createBy: 'Hasan', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '49865153', createdDate: '10/06/24', createBy: 'Rafi', approvedby: 'Foysal', discount: 20, receive: 60 },
    { transactionNumber: '49865153', createdDate: '10/06/24', createBy: 'Rafi', approvedby: 'Foysal', discount: 20, receive: 60 },
]


function InvoiceBatchModalTransaction(props) {
    const theme = useMantineTheme();

    // useEffect(() => {
    //     console.log(props.batchViewModal);
    // }, []);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 190; //TabList height 104
    const tableHeight = mainAreaHeight - 150; //TabList height 104
    const navigate = useNavigate();
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);


    return (
        <>
            <Box>
                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                    <Box p={0} >
                        {elements.map((elements, index) => (
                            <Card shadow="md" radius="md" className={classes.card} mb={'4'} p={'xs'}>
                                <SimpleGrid spacing={4}>
                                    <Grid columns={24}>
                                        <Grid.Col span={10}>
                                            <Grid gutter={0}>
                                                <Grid.Col span={5}>
                                                    <Text fz="sm" fw={600} >{t('Transaction No')}</Text>
                                                </Grid.Col>
                                                <Grid.Col span={1}>
                                                    <Text fz={'sm'} fw={700}>:</Text>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <Text fz="sm" fw={300} >{elements.transactionNumber}</Text>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid gutter={{ base: 2 }}>
                                                <Grid.Col span={5}>
                                                    <Text fz="sm" fw={600}  >{t('Discount')}</Text>
                                                </Grid.Col>
                                                <Grid.Col span={1}>
                                                    <Text fz={'sm'} fw={700}>:</Text>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
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
                                                <Grid.Col span={4} >
                                                    <Text fz="sm" fw={300}  >{elements.receive}</Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={10}>
                                            <Grid gutter={{ base: 2 }}>
                                                <Grid.Col span={5}>
                                                    <Text fz="sm" fw={600}  >{t('CreatedDate')}</Text>
                                                </Grid.Col>
                                                <Grid.Col span={1}>
                                                    <Text fz={'sm'} fw={700}>:</Text>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
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
                                                <Grid.Col span={4}>
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
                                                <Grid.Col span={4}>
                                                    <Text fz="sm" fw={300}  >{elements.approvedby}</Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={2}>
                                            <Flex justify={'center'} align={'center'} direction={'column'} h={'100%'}>
                                                <Box>
                                                    <ActionIcon color='red.5' variant='transparent' >
                                                        <IconTrash size={40} />
                                                    </ActionIcon>
                                                </Box>
                                            </Flex>
                                        </Grid.Col>
                                    </Grid>
                                </SimpleGrid>
                            </Card>
                        )
                        )}
                    </Box>
                </ScrollArea >
            </Box >
        </>
    );
}

export default InvoiceBatchModalTransaction;