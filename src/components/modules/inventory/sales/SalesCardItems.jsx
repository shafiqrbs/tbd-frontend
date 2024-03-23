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
    IconRestore,IconPhoto,IconMessage,IconEyeEdit,IconRowRemove,IconTrash
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys, useToggle} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {getBrandDropdown, getCategoryDropdown} from "../../../../store/inventory/utilitySlice";
import {getSettingDropdown,getProductUnitDropdown} from "../../../../store/utility/utilitySlice.js";

import {
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData,
    getShowEntityData,
    updateEntityData,

} from "../../../../store/inventory/crudSlice.js";
import CategoryGroupModal from "../category/CategoryGroupModal";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice";
import ProductForm from "../product/ProductForm";
import ProductUpdateForm from "../product/ProductUpdateForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";

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
            <Table.Td>{item.display_name ?item.display_name:''}</Table.Td>
            <Table.Td style={{ textAlign: 'right' }}>{item.mrp && Number(item.mrp).toFixed(2)}</Table.Td>
            <Table.Td>{item.stock ?item.stock:''}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>{item.quantity ?item.quantity:''}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>{item.unit_name ?item.unit_name:''}</Table.Td>
            <Table.Td style={{ textAlign: 'right' }}>{item.sales_price && (Number(item.sales_price)).toFixed(2)}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>{item.percent ? item.percent+' %':''}</Table.Td>
            <Table.Td style={{ textAlign: 'right' }}>{(Number(item.sub_total)).toFixed(2)}</Table.Td>
            {/*<Table.Td style={{ textAlign: 'right' }}>{item.quantity && item.sales_price && props.symbol +' '+ (Number(item.sub_total)).toFixed(2)}</Table.Td>*/}
            <Table.Td>
                <Group>
                    <ActionIcon
                        variant="outline"
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
                        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>

        /*<Grid columns={'32'} gutter={{base: 6}} index={index}>
            <Grid.Col span={4}>{item.product_name ?item.product_name:''}</Grid.Col>
            <Grid.Col span={4}>{item.sales_price ?item.sales_price:''}</Grid.Col>
            <Grid.Col span={4}>200</Grid.Col>
            <Grid.Col span={4}>20</Grid.Col>
            <Grid.Col span={4}>{item.sales_price ?item.sales_price:''}</Grid.Col>
            <Grid.Col span={4}>{item.percent ?item.percent:''}</Grid.Col>
            <Grid.Col span={4}>560.50</Grid.Col>
            <Grid.Col span={4}>
                <Group>
                    <ActionIcon
                        variant="outline"
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
                        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Grid.Col>
        </Grid>*/
    );
}
export default SalesCardItems;
