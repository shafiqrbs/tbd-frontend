import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack, Tooltip, ActionIcon,
    NumberInput,
    TextInput
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCategoryPlus,
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus, IconClipboardPlus,
    IconCalendar
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import { getBrandDropdown, getCategoryDropdown } from "../../../../store/inventory/utilitySlice";
import { getSettingDropdown, getProductUnitDropdown } from "../../../../store/utility/utilitySlice.js";

import { setFetching, storeEntityData } from "../../../../store/inventory/crudSlice.js";
import getSettingProductDropdownData from "../../../global-hook/dropdown/getSettingProductDropdownData.js";
import { DateInput, DatePicker } from "@mantine/dates";

function ReceipeForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 130; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [categoryData, setCategoryData] = useState(null);
    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)

    let categoryDropdown = categoryDropdownData && categoryDropdownData.length > 0 ?
        categoryDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/category',
            param: {
                type: 'parent'
            }
        }
        dispatch(getCategoryDropdown(value))
    }, [dropdownLoad]);

    const [brandData, setBrandData] = useState(null);
    const brandDropdownData = useSelector((state) => state.inventoryUtilitySlice.brandDropdownData)
    const dropdownBrandLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let brandDropdown = brandDropdownData && brandDropdownData.length > 0 ?
        brandDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/product-brand',
        }
        dispatch(getBrandDropdown(value))
    }, [dropdownBrandLoad]);

    const [productTypeData, setProductTypeData] = useState(null);
    const productTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown)
    let productTypeDropdown = getSettingProductDropdownData()

    const [productUnitData, setProductUnitData] = useState(null);
    const [value, setValue] = useState(null);
    const productUnitDropdownData = useSelector((state) => state.utilityUtilitySlice.productUnitDropdown)
    let productUnitDropdown = productUnitDropdownData && productUnitDropdownData.length > 0 ?
        productUnitDropdownData.map((type, index) => {
            return ({ 'label': type.name, 'value': String(type.id) })
        }) : []
    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit'
        }
        dispatch(getProductUnitDropdown(value))
    }, []);

    const form = useForm({
        initialValues: {
            product_type_id: '',
            category_id: '',
            unit_id: '',
            name: '',
            alternative_name: '',
            barcode: '',
            sku: '',
            brand_id: '',
            opening_quantity: '',
            sales_price: '',
            purchase_price: '',
            min_quantity: '',
            reorder_quantity: '',
            status: true
        },
        validate: {
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
            sales_price: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('product_type_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);
    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        const value = {
                            url: 'inventory/product',
                            data: values
                        }
                        dispatch(storeEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });
                        setTimeout(() => {
                            form.reset()
                            setCategoryData(null)
                            setBrandData(null)
                            setProductTypeData(null)
                            setProductUnitData(null)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Grid columns={8} gutter={{ base: 8 }}>
                    <Grid.Col span={7} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6} h={54}>
                                            <Title order={6} mt={'xs'} pl={'6'}>{t('ManageProductionMeasurment')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`red.6`}
                                                            type="submit"
                                                            mt={4}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={12} fw={400}>
                                                                    {t("CreateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </></Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} mt={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('WastagePercent')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('WastagePercent')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'md'}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text

                                                                ta="center" fz="sm" fw={300}>
                                                                {t('LicenseDate')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <DateInput
                                                            value={value}
                                                            valueFormat="DD-MM-YYYY "
                                                            onChange={setValue}
                                                            placeholder={t('LicenseDate')}
                                                            rightSection={
                                                                <Tooltip
                                                                    withArrow
                                                                    ta="center"
                                                                    color="rgba(233, 236, 239, 0.98)"
                                                                    multiline
                                                                    w={200}
                                                                    offset={{ crossAxis: '-75', mainAxis: '10' }}
                                                                    transitionProps={{
                                                                        transition: 'POP-BOTTOM-LEFT', duration: 200
                                                                    }}
                                                                    label={t('LicenseDate')}
                                                                    style={{ color: 'black' }}
                                                                >
                                                                    <IconCalendar
                                                                        style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </Tooltip>
                                                            }
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'md'}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm" fw={300}>
                                                                {t('InitiateDate')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <DateInput
                                                            value={value}
                                                            valueFormat="DD-MM-YYYY "
                                                            onChange={setValue}
                                                            placeholder={t('InitiateDate')} rightSection={
                                                                <Tooltip
                                                                    withArrow
                                                                    ta="center"
                                                                    color="rgba(233, 236, 239, 0.98)"
                                                                    multiline
                                                                    w={200}
                                                                    offset={{ crossAxis: '-75', mainAxis: '10' }}
                                                                    transitionProps={{
                                                                        transition: 'POP-BOTTOM-LEFT', duration: 200
                                                                    }}
                                                                    label={t('InititateDate')}
                                                                    style={{ color: 'black' }}
                                                                >
                                                                    <IconCalendar
                                                                        style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </Tooltip>
                                                            }
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'md'}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm" fw={300}>
                                                                {t('IssuedBy')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('IssuedBy')}
                                                            placeholder={t('IssuedBy')}
                                                            required={true}
                                                            nextField={'CustomerGroup'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'CustomerName'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'md'}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm" fw={300}>
                                                                {t('Designation')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('Designation')}
                                                            placeholder={t('Designation')}
                                                            required={true}
                                                            nextField={'CustomerGroup'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'CustomerName'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'md'}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm" fw={300}>
                                                                {t('Remarks')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <InputForm
                                                            tooltip={t('Remarks')}
                                                            placeholder={t('Remarks')}
                                                            required={true}
                                                            nextField={'CustomerGroup'}
                                                            name={'name'}
                                                            form={form}
                                                            mt={0}
                                                            id={'CustomerName'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('Bank Interest & Commission')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('Bank Interest & Commission')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('ElectricityCost')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('ElectricityCost')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('Entertainment')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('Entertainment')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('FactoryRent')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('FactoryRent')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >

                                                            <Text

                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('Insurance')}
                                                            </Text>

                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('Insurance')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('ItemProfit')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('ItemProfit')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('MachineryAndPartsWaste')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('MachineryAndPartsWaste')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('OtherCost')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('OthersCost')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('PackagingAccesories')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('PackagingAccesories')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('SalaryAndWages')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('SalaryAndWages')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('SalesCost')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('SalesCost')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('Telephone')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('Telephone')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'} >
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('TransportCost')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <NumberInput
                                                            p={'0'}
                                                            placeholder={t('TransportCost')}
                                                            id={'price'}
                                                            form={form}
                                                            nextField={''}
                                                            name={'price'}
                                                        />
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'} mb={'sm'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={6}>
                                                        <Flex
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                        >
                                                            <Text
                                                                ta="center" fz="sm"
                                                                fw={300}>
                                                                {t('Total')}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <Box >
                                                        <Flex
                                                            mih={35}
                                                            className="borderRadiusAll"
                                                            justify="center"
                                                            align="center"
                                                            direction="row"

                                                        >
                                                            <Box
                                                            >
                                                                <Text
                                                                    ta="center" fz="sm"
                                                                    fw={300}>
                                                                    {t('1000')}
                                                                </Text>
                                                            </Box>
                                                        </Flex>
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>

                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col >
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid >
            </form >
        </Box >

    );
}

export default ReceipeForm;
