import React, {useEffect, useState} from "react";
import {json, useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex, Tabs, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title, Select, Table,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,IconUserCog,IconStackPush,IconPrinter,IconReceipt,IconPercentage,IconCurrencyTaka,
    IconRestore,IconPhoto,IconMessage,IconEyeEdit,IconRowRemove,IconTrash,IconX
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";

function SalesCardItems(props) {
    const {item,index,setLoadCardProducts} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 200; //TabList height 104
    const formHeight = mainAreaHeight - 380; //TabList height 104
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <Table.Tr key={index}>
            <Table.Td><Button fz={'xs'} variant="default" size="xs" radius="xs">{index+1}.</Button></Table.Td>
            <Table.Td fz={'xs'}>{item.display_name ?item.display_name:''}</Table.Td>
            <Table.Td fz={'xs'} style={{ textAlign: 'right' }}>{item.mrp && Number(item.mrp).toFixed(2)}</Table.Td>
            <Table.Td fz={'xs'} >{item.stock ?item.stock:''}</Table.Td>
            <Table.Td fz={'xs'} style={{ textAlign: 'center' }}>{item.quantity ?item.quantity:''}</Table.Td>
            <Table.Td fz={'xs'} style={{ textAlign: 'center' }}>{item.unit_name ?item.unit_name:''}</Table.Td>
            <Table.Td fz={'xs'} style={{ textAlign: 'right' }}>{item.sales_price && (Number(item.sales_price)).toFixed(2)}</Table.Td>
            <Table.Td fz={'xs'} style={{ textAlign: 'center' }}>{item.percent ? item.percent+' %':''}</Table.Td>
            <Table.Td fz={'xs'} fw={'800'} style={{ textAlign: 'right' }}>{(Number(item.sub_total)).toFixed(2)}</Table.Td>
            {/*<Table.Td style={{ textAlign: 'right' }}>{item.quantity && item.sales_price && props.symbol +' '+ (Number(item.sub_total)).toFixed(2)}</Table.Td>*/}
            <Table.Td>
                <Center>
                    <ActionIcon
                        variant="transparent"
                        color="red"
                        size="sm"
                        aria-label="Settings"
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t('AreYouSureYouWantToDeleteThisItem'),
                                children: (
                                    <Text size="sm">
                                        {t('DeleteDetails')}
                                    </Text>
                                ),
                                labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                onCancel: () => console.log('Cancel'),
                                confirmProps: { color: 'red' },
                                onConfirm: () => {
                                    const dataString = localStorage.getItem('temp-sales-products');
                                    let data = dataString ? JSON.parse(dataString) : [];

                                    data = data.filter(d => d.product_id !== item.product_id);

                                    const updatedDataString = JSON.stringify(data);

                                    localStorage.setItem('temp-sales-products', updatedDataString);
                                    setLoadCardProducts(true)
                                },
                            });
                        }}
                    >
                        <IconX  style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                </Center>
            </Table.Td>
        </Table.Tr>
    );
}
export default SalesCardItems;
