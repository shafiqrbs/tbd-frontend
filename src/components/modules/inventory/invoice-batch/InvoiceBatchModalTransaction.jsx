import {Flex, Box, Grid, useMantineTheme, Text, ActionIcon, Card,
    SimpleGrid,
    ScrollArea
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import {IconTrash} from '@tabler/icons-react';
import classes from '../../../../assets/css/FeaturesCards.module.css';


function InvoiceBatchModalTransaction(props) {
    const theme = useMantineTheme();
    const {batchTransactions} = props
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 190; //TabList height 104


    return (
        <>
            <Box>
                <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                    <Box p={0} >
                        {batchTransactions.map((elements, index) => (
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
                                                    <Text fz="sm" fw={300} >{elements.invoice}</Text>
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
                                                    <Text fz="sm" fw={300}  >{elements.received}</Text>
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
                                                    <Text fz="sm" fw={300}  >{elements.created_at}</Text>
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
                                                    <Text fz="sm" fw={300}  >{elements.created_by_id}</Text>
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
                                                    <Text fz="sm" fw={300}  >{elements.approved_by_id}</Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
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