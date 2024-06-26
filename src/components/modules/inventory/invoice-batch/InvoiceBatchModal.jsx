import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
    Modal, Button, Flex, Progress, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Checkbox, Group, Menu, ActionIcon, rem, Table, Stack,
    SimpleGrid,
} from '@mantine/core';
// import SampleModal from './SampleModal';

import { useTranslation } from 'react-i18next';
import { useEffect, } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconInfoCircle,
    IconDotsVertical,
    IconTrashX, IconEyeEdit, IconMessage, IconTallymark1
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { DataTable } from 'mantine-datatable';
import tableCss from '../../../../assets/css/Table.module.css';
import { getIndexEntityData, setFetching, setSalesFilterData } from "../../../../store/inventory/crudSlice.js";
import InvoiceBatchModalTable from './InvoiceBatchModalTable.jsx';
import InvoiceBatchModalTransaction from './InvoiceBatchModalTransaction.jsx';
import InvoiceBatchModalInvoice from './InvoiceBatchModalInvoice.jsx';

function InvoiceBatchModal(props) {
    const theme = useMantineTheme();
    const closeModel = () => {
        props.setBatchViewModal(false)
    }

    useEffect(() => {
        console.log(props.batchViewModal);
    }, []);
    const { currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const tableHeight = mainAreaHeight - 150; //TabList height 104
    const navigate = useNavigate();


    const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false)



    return (
        <>
            <Modal.Root bg={'black'} opened={props.batchViewModal} onClose={closeModel}
                styles={{
                    body: {
                        backgroundColor: '#f0f1f9',
                        padding: 2,
                    },
                    // header: {
                    //     backgroundColor: '#f0f1f9',
                    // },

                }}
                fullScreen overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
                    opacity: 0.9,
                    blur: 3,
                }}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header  >
                        <Modal.Title>{t('InvoiceBatchInformation')}</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Box h={height + 130} bg={''}>
                            <Box >
                                <Box bg={'#f0f1f9'} className={''} >
                                    <Box pl={'xs'} pr={'xs'} pb={'xs'} pt={'xs'}>
                                        <Grid columns={24} gutter={{ base: 8 }} >
                                            <Grid.Col span={7} >
                                                <Box h={110} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                                    <Flex spacing={0} direction={'column'} >
                                                        <Text fw={900} pl={'6'} fz={'md'}>{t('CustomerDetails')}</Text>
                                                        <Stack
                                                            h={60}
                                                            bg="var(--mantine-color-body)"
                                                            align="stretch"
                                                            justify="center"
                                                            gap="2"
                                                            mt={4}
                                                        >
                                                            <Grid gutter={{ base: 0 }} pl={6}>
                                                                <Grid.Col span={2}>
                                                                    <Text fz="xs" fw={600} >{t('Name')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz={'xs'} fw={700}>:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={9}>
                                                                    <Text fz="xs" fw={300} >Foysal Mahmud Hasan</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                            <Grid gutter={{ base: 0 }} pl={6}>
                                                                <Grid.Col span={2}>
                                                                    <Text fz="xs" fw={600} >{t('Mobile')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz={'xs'} fw={700}>:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={9}>
                                                                    <Text fz="xs" fw={300} >+8801521334751</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                            <Grid gutter={{ base: 0 }} pl={6}>
                                                                <Grid.Col span={2}>
                                                                    <Text fz="xs" fw={600} >{t('Address')}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={1}>
                                                                    <Text fz={'xs'} fw={700}>:</Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={9}>
                                                                    <Text fz="xs" fw={300} >494/1/B, North Ibrahimpur, Kafrul, Mirpur, Dhaka, Bangladesh</Text>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Stack>
                                                    </Flex>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={8} >
                                                <Box h={110} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                                    <Flex spacing={0} direction={'column'} >
                                                        <Text fw={900} pl={'6'} fz={'md'}>{t('Outstanding')}</Text>
                                                        <Stack
                                                            h={60}
                                                            bg="var(--mantine-color-body)"
                                                            align="stretch"
                                                            justify="center"
                                                            gap="2"
                                                            mt={4}
                                                        >
                                                            <Grid columns={12}>
                                                                <Grid.Col span={10}>
                                                                    <Grid gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('TotalBalance')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >100000</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                    <Grid gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('TotalSales')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >100000</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                    <Grid gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('TotalReceive')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >100000</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                </Grid.Col>
                                                                <Grid.Col span={2}>
                                                                    <Box mt={'8'} mr={6} style={{ textAlign: 'right', float: 'right' }}>
                                                                        <Group>
                                                                            <Tooltip
                                                                                multiline
                                                                                bg={'orange.8'}
                                                                                position="top"
                                                                                ta={'center'}
                                                                                withArrow
                                                                                transitionProps={{ duration: 200 }}
                                                                                label={'Hello'}
                                                                            >
                                                                                <ActionIcon
                                                                                    bg={'white'}
                                                                                    variant="outline"
                                                                                    color={'green'}
                                                                                    disabled={false}
                                                                                    onClick={(e) => {
                                                                                        if (isSMSActive) {
                                                                                            notifications.show({
                                                                                                withCloseButton: true,
                                                                                                autoClose: 1000,
                                                                                                title: t('smsSendSuccessfully'),
                                                                                                message: t('smsSendSuccessfully'),
                                                                                                icon: <IconTallymark1 />,
                                                                                                className: 'my-notification-class',
                                                                                                style: {},
                                                                                                loading: true,
                                                                                            })
                                                                                        } else {
                                                                                            setIsShowSMSPackageModel(true)
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <IconMessage size={18} stroke={1.5} />
                                                                                </ActionIcon>
                                                                            </Tooltip>
                                                                            <Tooltip
                                                                                multiline
                                                                                bg={'orange.8'}
                                                                                position="top"
                                                                                withArrow
                                                                                offset={{ crossAxis: '-45', mainAxis: '5' }}
                                                                                ta={'center'}
                                                                                transitionProps={{ duration: 200 }}
                                                                                label={'Hello'}
                                                                            >
                                                                                <ActionIcon
                                                                                    variant="outline"
                                                                                    color={'green'}
                                                                                    disabled={false}
                                                                                // onClick={console.log('ok')}
                                                                                >
                                                                                    <IconEyeEdit
                                                                                        size={18}
                                                                                        stroke={1.5}
                                                                                    />
                                                                                </ActionIcon>
                                                                            </Tooltip>

                                                                        </Group>
                                                                    </Box>
                                                                </Grid.Col>
                                                            </Grid>

                                                        </Stack>
                                                    </Flex>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={9} >
                                                <Box h={110} bg={'white'} pl={`xs`} pr={8} pt={'xs'} className={' borderRadiusAll'} >
                                                    <Flex spacing={0} direction={'column'} >
                                                        <Text fw={900} pl={'6'} fz={'md'}>{t('BatchDetails')}</Text>
                                                        <Stack
                                                            h={60}
                                                            bg="var(--mantine-color-body)"
                                                            align="stretch"
                                                            justify="center"
                                                            gap="2"
                                                            mt={'4'}
                                                        >
                                                            <Grid columns={12} gutter={0}>
                                                                <Grid.Col span={6}>
                                                                    <Grid columns={12} gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('TotalAmount')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >18654651654654656546</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                    <Grid columns={12} gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('Discount')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >100%</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                </Grid.Col>
                                                                <Grid.Col span={6}>
                                                                    <Grid gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('Receive')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >946546546</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                    <Grid gutter={{ base: 0 }} pl={6}>
                                                                        <Grid.Col span={3}>
                                                                            <Text fz="xs" fw={600} >{t('Balance')}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={1}>
                                                                            <Text fz={'xs'} fw={700}>:</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={8}>
                                                                            <Text fz="xs" fw={300} >465486465465654655</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                </Grid.Col>
                                                            </Grid>


                                                        </Stack>
                                                    </Flex>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>

                                </Box>
                            </Box>
                            <Box >
                                <Box pl={'xs'} pr={'xs'}>
                                    <Grid columns={24} gutter={{ base: 8 }}>
                                        <Grid.Col span={7} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                                    <Title order={6} pl={'6'}>{t('Invoices')}</Title>
                                                </Box>
                                                <Box className={'borderRadiusAll'} h={height - 90}>
                                                    <InvoiceBatchModalInvoice />
                                                </Box>
                                            </Box>

                                        </Grid.Col>
                                        <Grid.Col span={8} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                                    <Title order={6} pl={'6'}>{t('BatchItems')}</Title>
                                                </Box>
                                                <Box bg={'white'} h={height - 90} >
                                                    <InvoiceBatchModalTable />
                                                </Box>

                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={9} >
                                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                                    <Title order={6} pl={'6'}>{t('Transactions')}</Title>
                                                </Box>
                                                <Box className={'borderRadiusAll'} h={height - 90}>
                                                    <InvoiceBatchModalTransaction />
                                                </Box>
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root >
        </>
    );
}

export default InvoiceBatchModal;