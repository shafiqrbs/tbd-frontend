import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
    Modal, Button, Flex, Progress, Box, Grid, useMantineTheme, Text,
    Title, Tooltip, Checkbox, Group, Menu, ActionIcon, rem, Table
} from '@mantine/core';
// import SampleModal from './SampleModal';

import { useTranslation } from 'react-i18next';
import { useEffect, } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconInfoCircle,
    IconDotsVertical,
    IconTrashX
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { DataTable } from 'mantine-datatable';
import tableCss from '../../../../assets/css/Table.module.css';
import { getIndexEntityData, setFetching, setSalesFilterData } from "../../../../store/inventory/crudSlice.js";
import InvoiceBatchModalTable from './InvoiceBatchModalTable.jsx';
import InvoiceBatchModalTransaction from './InvoiceBatchModalTransaction.jsx';
import InvoiceBatchModalNested from './InvoiceBatchModalNested.jsx';

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



    return (
        <>

            <Modal opened={props.batchViewModal} onClose={closeModel} title={t('InvoiceBatchInformation')} fullScreen overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
                opacity: 0.9,
                blur: 3,
            }}>
                <Box>
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={7} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Title order={6} pl={'6'}>{t('Item')}</Title>
                                </Box>
                                <Box h={height}>
                                    <Box bg={'white'}  >
                                        <InvoiceBatchModalTable />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={8} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Title order={6} pl={'6'}>{t('Transaction')}</Title>
                                </Box>
                                <Box className={'borderRadiusAll'} h={height}>
                                    <InvoiceBatchModalTransaction />
                                </Box>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={9} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box h={40} pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Title order={6} pl={'6'}>{t('Invoice')}</Title>
                                </Box>
                                <Box className={'borderRadiusAll'} h={height}>
                                    <InvoiceBatchModalNested />
                                </Box>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Modal >
        </>
    );
}

export default InvoiceBatchModal;