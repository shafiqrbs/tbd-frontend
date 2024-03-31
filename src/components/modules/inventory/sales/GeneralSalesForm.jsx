import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import genericCss from '../../../../assets/css/Generic.module.css';

import {
    Button, Flex, ActionIcon, TextInput,
    Grid, Box, Tooltip, Group, Text, Popover, Fieldset,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconDeviceFloppy, IconPercentage,
    IconPlus, IconRefreshDot, IconSum, IconUserCircle, IconX,
} from "@tabler/icons-react";
import {getHotkeyHandler, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {isNotEmpty, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications, showNotification} from "@mantine/notifications";

import InputForm from "../../../form-builders/InputForm";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice";
import {getSettingDropdown, getProductUnitDropdown} from "../../../../store/utility/utilitySlice.js";

import SelectServerSideForm from "../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../form-builders/InputNumberForm";
import SalesForm from "./SalesForm";
import {DataTable} from "mantine-datatable";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {storeEntityData} from "../../../../store/inventory/crudSlice.js";
import axios from "axios";
import getLocationDropdownData from "../../../global-hook/dropdown/getLocationDropdownData.js";
import getExecutiveDropdownData from "../../../global-hook/dropdown/getExecutiveDropdownData.js";
import getVendorDropdownData from "../../../global-hook/dropdown/getVendorDropdownData.js";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData.js";
import getTransactionModeDropdownData from "../../../global-hook/dropdown/getTransactionModeDropdownData.js";
import getUserDropdownData from "../../../global-hook/dropdown/getUserDropdownData.js";

function GeneralSalesForm(props) {
    const {currancySymbol, allowZeroPercentage} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 200; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)
    const [focusIntoProductSearch, setFocusIntoProductSearch] = useState(false)

    let salesSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;
    let totalPurchaseAmount = tempCardProducts?.reduce((total, item) => total + (item.purchase_price * item.quantity), 0) || 0;


    const locationDropdown = getLocationDropdownData();
    const executiveDropdown = getExecutiveDropdownData();
    const vendorDropdown = getVendorDropdownData();
    const customerDropdown = getCustomerDropdownData();
    const transactionModeDropdown = getTransactionModeDropdownData();
    const userDropdown = getUserDropdownData();

    // console.log(locationDropdown,executiveDropdown,vendorDropdown,customerDropdown,transactionModeDropdown,userDropdown)

    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
        if (focusIntoProductSearch) {
            document.getElementById('product_id').focus();
            setFocusIntoProductSearch(false)
        }
    }, [loadCardProducts])

    useEffect(() => {
        if (searchValue.length > 0) {
            const storedProducts = localStorage.getItem('user-products');
            const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

            const lowerCaseSearchTerm = searchValue.toLowerCase();
            const fieldsToSearch = ['product_name'];

            const productFilterData = localProducts.filter(product =>
                fieldsToSearch.some(field =>
                    product[field] && String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
                )
            );

            const formattedProductData = productFilterData.map(type => ({
                label: type.product_name, value: String(type.id)
            }));

            setProductDropdown(formattedProductData);
        } else {
            setProductDropdown([]);
        }
    }, [searchValue]);

    function handleAddProductByProductId(values, myCardProducts, localProducts) {
        const addProducts = localProducts.reduce((acc, product) => {
            if (product.id === Number(values.product_id)) {
                acc.push({
                    product_id: product.id,
                    display_name: product.display_name,
                    sales_price: values.sales_price,
                    mrp: values.mrp,
                    percent: values.percent,
                    stock: product.quantity,
                    quantity: values.quantity,
                    unit_name: product.unit_name,
                    purchase_price: product.purchase_price,
                    sub_total: selectProductDetails.sub_total,
                });
            }
            return acc;
        }, myCardProducts);

        updateLocalStorageAndResetForm(addProducts);
    }

    function handleAddProductByBarcode(values, myCardProducts, localProducts) {
        const barcodeExists = localProducts.some(product => product.barcode === values.barcode);

        if (barcodeExists) {
            const addProducts = localProducts.reduce((acc, product) => {
                if (String(product.barcode) === String(values.barcode)) {
                    acc.push(createProductFromValues(product));
                }
                return acc;
            }, myCardProducts);

            updateLocalStorageAndResetForm(addProducts);
        } else {
            notifications.show({
                loading: true,
                color: 'red',
                title: 'Product not found with this barcode',
                message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                autoClose: 1000,
                withCloseButton: true,
            });
        }
    }

    function updateLocalStorageAndResetForm(addProducts) {
        localStorage.setItem('temp-sales-products', JSON.stringify(addProducts));
        setSearchValue('');
        form.reset();
        setLoadCardProducts(true);
    }

    function createProductFromValues(product) {
        return {
            product_id: product.id,
            display_name: product.display_name,
            sales_price: product.sales_price,
            mrp: product.sales_price,
            percent: '',
            stock: product.quantity,
            quantity: 1,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: product.sales_price,
        };
    }

    const [categoryData, setCategoryData] = useState(null);
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)

    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)
    let categoryDropdown = categoryDropdownData && categoryDropdownData.length > 0 ?
        categoryDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
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


    const [productTypeData, setProductTypeData] = useState(null);
    const productTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown)
    let productTypeDropdown = productTypeDropdownData && productTypeDropdownData.length > 0 ?
        productTypeDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        const value = {
            url: 'utility/select/setting',
            param: {
                'dropdown-type': 'product-type'
            }
        }
        dispatch(getSettingDropdown(value))
    }, []);

    const [productUnitData, setProductUnitData] = useState(null);
    const productUnitDropdownData = useSelector((state) => state.utilityUtilitySlice.productUnitDropdown)
    let productUnitDropdown = productUnitDropdownData && productUnitDropdownData.length > 0 ?
        productUnitDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []
    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit'
        }
        dispatch(getProductUnitDropdown(value))
    }, []);

    const form = useForm({
        initialValues: {
            product_id: '', mrp: '', sales_price: '', percent: '', barcode: '', sub_total: '', quantity: ''
        },
        validate: {
            product_id: (value, values) => {
                const isDigitsOnly = /^\d+$/.test(value);
                if (!isDigitsOnly && values.product_id) {
                    return true;
                }
                return null;
            },
            quantity: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            percent: (value, values) => {
                if (value && values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            sales_price: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            }
        }
    });

    const productAddedForm = useForm({
        initialValues: {
            name: '',
            purchase_price: '',
            sales_price: '',
            unit_id: '',
            category_id: '',
            product_type_id: '',
            product_name: '',
            quantity: '',
            status: 1
        },
        validate: {
            name: isNotEmpty()
        }
    });

    const [selectProductDetails, setSelectProductDetails] = useState('')

    useEffect(() => {
        const storedProducts = localStorage.getItem('user-products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const filteredProducts = localProducts.filter(product => product.id === Number(form.values.product_id));

        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];

            setSelectProductDetails(selectedProduct);

            form.setFieldValue('mrp', selectedProduct.sales_price);
            form.setFieldValue('sales_price', selectedProduct.sales_price);
            document.getElementById('quantity').focus();
        } else {
            setSelectProductDetails(null);
            form.setFieldValue('mrp', '');
            form.setFieldValue('sales_price', '');
        }
    }, [form.values.product_id]);


    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const salesPrice = Number(form.values.sales_price);

        if (!isNaN(quantity) && !isNaN(salesPrice) && quantity > 0 && salesPrice >= 0) {
            if (!allowZeroPercentage) {
                showNotification({
                    color: 'pink',
                    title: t('WeNotifyYouThat'),
                    message: t('ZeroQuantityNotAllow'),
                    autoClose: 1500,
                    loading: true,
                    withCloseButton: true,
                    position: 'top-center',
                    style: {backgroundColor: 'mistyrose'},
                });
            } else {
                setSelectProductDetails(prevDetails => ({
                    ...prevDetails,
                    sub_total: quantity * salesPrice,
                    sales_price: salesPrice,
                }));
                form.setFieldValue('sub_total', quantity * salesPrice);
            }
        }
    }, [form.values.quantity, form.values.sales_price]);


    useEffect(() => {
        if (form.values.quantity && form.values.mrp) {
            const discountAmount = (form.values.mrp * form.values.percent) / 100;
            const salesPrice = form.values.mrp - discountAmount;

            form.setFieldValue('sales_price', salesPrice);
            form.setFieldValue('sub_total', salesPrice);
        }
    }, [form.values.percent]);


    useHotkeys([['alt+n', () => {
        document.getElementById('product_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const inputGroupText = (
        <Text style={{textAlign: 'right', width: '100%', paddingRight: 16}}
              color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text style={{textAlign: 'right', width: '100%', paddingRight: 16}}
              color={'gray'}
        >
            {currancySymbol}
        </Text>
    );

    const [productAddFormOpened, setProductAddFormOpened] = useState(false);


    return (
        <Box bg={"white"} mt={`xs`}>
            <Box mt={'xs'}>
                <Grid columns={24}>
                    <Grid.Col span={16}>
                        <form onSubmit={form.onSubmit((values) => {

                            if (!values.barcode && !values.product_id) {
                                form.setFieldError('barcode', true);
                                form.setFieldError('product_id', true);
                                setTimeout(() => {
                                    notifications.show({
                                        loading: true,
                                        color: 'red',
                                        title: 'Loading your data',
                                        message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                                        autoClose: 1000,
                                        withCloseButton: true,
                                    });
                                }, 1000)
                            } else {

                                const cardProducts = localStorage.getItem('temp-sales-products');
                                const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
                                const storedProducts = localStorage.getItem('user-products');
                                const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                                if (values.product_id && !values.barcode) {
                                    if (!allowZeroPercentage) {
                                        showNotification({
                                            color: 'pink',
                                            title: t('WeNotifyYouThat'),
                                            message: t('ZeroQuantityNotAllow'),
                                            autoClose: 1500,
                                            loading: true,
                                            withCloseButton: true,
                                            position: 'top-center',
                                            style: {backgroundColor: 'mistyrose'},
                                        });
                                    } else {
                                        setFocusIntoProductSearch(true)
                                        handleAddProductByProductId(values, myCardProducts, localProducts);
                                    }
                                } else if (!values.product_id && values.barcode) {
                                    setFocusIntoProductSearch(true)
                                    handleAddProductByBarcode(values, myCardProducts, localProducts);
                                }
                            }

                        })}>
                            <Box>
                                <Box pl={`xs`} pr={8} pt={'xs'} className={genericCss.boxBackground}>
                                    <Grid columns={24} gutter={{base: 2}}>
                                        <Grid.Col span={4}>
                                            <InputForm
                                                tooltip={t('BarcodeValidateMessage')}
                                                label=''
                                                placeholder={t('Barcode')}
                                                required={true}
                                                nextField={'EntityFormSubmit'}
                                                form={form}
                                                name={'barcode'}
                                                id={'barcode'}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={20}>
                                            <SelectServerSideForm
                                                tooltip={t('ChooseStockProduct')}
                                                label=''
                                                placeholder={t('ChooseStockProduct')}
                                                required={false}
                                                nextField={'quantity'}
                                                name={'product_id'}
                                                form={form}
                                                mt={8}
                                                id={'product_id'}
                                                searchable={true}
                                                searchValue={searchValue}
                                                setSearchValue={setSearchValue}
                                                dropdownValue={productDropdown}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                    <Box mt={'xs'} pb={'xs'}>
                                        <Grid columns={24} gutter={{base: 2}}>
                                            <Grid.Col span={4}>
                                                <InputButtonForm
                                                    type="number"
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    placeholder={t('MRP')}
                                                    required={true}
                                                    form={form}
                                                    name={'mrp'}
                                                    id={'mrp'}
                                                    rightSection={inputGroupCurrency}
                                                    leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                                    rightSectionWidth={80}
                                                    disabled={true}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputButtonForm
                                                    type="number"
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    placeholder={t('Quantity')}
                                                    required={true}
                                                    nextField={'percent'}
                                                    form={form}
                                                    name={'quantity'}
                                                    id={'quantity'}
                                                    rightSection={inputGroupText}
                                                    leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                                    rightSectionWidth={80}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    placeholder={t('Percent')}
                                                    required={true}
                                                    nextField={form.values.percent ? 'EntityFormSubmit' : 'sales_price'}
                                                    form={form}
                                                    name={'percent'}
                                                    id={'percent'}
                                                    leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                                    rightIcon={<IconUserCircle size={16} opacity={0.5}/>}
                                                    closeIcon={true}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('SalesPriceValidateMessage')}
                                                    label=''
                                                    placeholder={t('SalesPrice')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sales_price'}
                                                    id={'sales_price'}
                                                    disabled={form.values.percent}
                                                    leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                                    rightIcon={<IconUserCircle size={16} opacity={0.5}/>}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('SalesPriceValidateMessage')}
                                                    label=''
                                                    placeholder={t('SubTotal')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sub_total'}
                                                    id={'sub_total'}
                                                    leftSection={<IconDeviceFloppy size={16} opacity={0.5}/>}
                                                    rightIcon={<IconUserCircle size={16} opacity={0.5}/>}
                                                    disabled={selectProductDetails && selectProductDetails.sub_total}
                                                    closeIcon={false}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <>
                                                    {!saveCreateLoading &&
                                                        <Button
                                                            size="sm"
                                                            color={`red.5`}
                                                            type="submit"
                                                            mt={0}
                                                            mr={'xs'}
                                                            w={'100%'}
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16}/>}
                                                        >
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={12} fw={400}>
                                                                    {t("Add")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </>
                                            </Grid.Col>

                                            <Grid.Col span={1} bg={'white'}>
                                                <>
                                                    <Popover
                                                        width={'450'}
                                                        trapFocus
                                                        position="bottom"
                                                        withArrow
                                                        shadow="xl"
                                                        opened={productAddFormOpened}
                                                        onChange={setProductAddFormOpened}
                                                    >
                                                        <Popover.Target>
                                                            <Tooltip
                                                                multiline
                                                                w={420}
                                                                withArrow
                                                                transitionProps={{duration: 200}}
                                                                label="Use this button to save this information in your profile, after that you will be able to access it any time and share it via email."
                                                            >

                                                                <ActionIcon
                                                                    variant="outline"
                                                                    size={'lg'}
                                                                    color="red.5"
                                                                    mt={'1'}
                                                                    aria-label="Settings"
                                                                    onClick={() => setProductAddFormOpened(true)}
                                                                >
                                                                    <IconPlus style={{width: '100%', height: '70%'}}
                                                                              stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Popover.Target>
                                                        <Popover.Dropdown>
                                                            <Fieldset legend="Add Product information" variant="filled">

                                                                <SelectForm
                                                                    tooltip={t('ChooseProductType')}
                                                                    label={t('ProductType')}
                                                                    placeholder={t('ChooseProductType')}
                                                                    required={true}
                                                                    name={'product_type_id'}
                                                                    form={productAddedForm}
                                                                    dropdownValue={productTypeDropdown}
                                                                    mt={0}
                                                                    id={'product_type_id'}
                                                                    nextField={'category_id'}
                                                                    searchable={true}
                                                                    value={productTypeData}
                                                                    changeValue={setProductTypeData}
                                                                    comboboxProps={{withinPortal: false}}
                                                                />

                                                                <SelectForm
                                                                    tooltip={t('ChooseCategory')}
                                                                    label={t('Category')}
                                                                    placeholder={t('ChooseCategory')}
                                                                    required={true}
                                                                    nextField={'name'}
                                                                    name={'category_id'}
                                                                    form={productAddedForm}
                                                                    dropdownValue={categoryDropdown}
                                                                    mt={8}
                                                                    id={'category_id'}
                                                                    searchable={true}
                                                                    value={categoryData}
                                                                    changeValue={setCategoryData}
                                                                    comboboxProps={{withinPortal: false}}
                                                                />

                                                                <InputForm
                                                                    tooltip={t('ProductNameValidateMessage')}
                                                                    label={t('ProductName')}
                                                                    placeholder={t('ProductName')}
                                                                    required={true}
                                                                    nextField={'unit_id'}
                                                                    form={productAddedForm}
                                                                    name={'name'}
                                                                    mt={8}
                                                                    id={'name'}
                                                                />

                                                                <SelectForm
                                                                    tooltip={t('ChooseProductUnit')}
                                                                    label={t('ProductUnit')}
                                                                    placeholder={t('ChooseProductUnit')}
                                                                    required={true}
                                                                    name={'unit_id'}
                                                                    form={productAddedForm}
                                                                    dropdownValue={productUnitDropdown}
                                                                    mt={8}
                                                                    id={'unit_id'}
                                                                    nextField={'sales_price'}
                                                                    searchable={true}
                                                                    value={productUnitData}
                                                                    changeValue={setProductUnitData}
                                                                    comboboxProps={{withinPortal: false}}
                                                                />

                                                                <InputForm
                                                                    tooltip={t('SalesPriceValidateMessage')}
                                                                    label={t('SalesPrice')}
                                                                    placeholder={t('SalesPrice')}
                                                                    required={true}
                                                                    nextField={'purchase_price'}
                                                                    form={productAddedForm}
                                                                    name={'sales_price'}
                                                                    mt={8}
                                                                    id={'sales_price'}
                                                                />

                                                                <InputForm
                                                                    tooltip={t('PurchasePrice')}
                                                                    label={t('PurchasePrice')}
                                                                    placeholder={t('PurchasePrice')}
                                                                    required={true}
                                                                    nextField={'EntityFormSubmit'}
                                                                    form={productAddedForm}
                                                                    name={'purchase_price'}
                                                                    mt={8}
                                                                    id={'purchase_price'}
                                                                />

                                                                <Box mt={'xs'}>
                                                                    <Grid columns={12} gutter={{base: 1}}>
                                                                        <Grid.Col span={6}>&nbsp;</Grid.Col>
                                                                        <Grid.Col span={2}>
                                                                            <Button
                                                                                variant="transparent"
                                                                                size="sm"
                                                                                color={`red.5`}
                                                                                type="submit"
                                                                                mt={0}
                                                                                mr={'xs'}
                                                                                id="EntityFormSubmit"
                                                                            >
                                                                                <IconRefreshDot style={{
                                                                                    width: '100%',
                                                                                    height: '70%'
                                                                                }} stroke={1.5}/>
                                                                            </Button>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={4}>
                                                                            <Button
                                                                                size="sm"
                                                                                color={`red.5`}
                                                                                type="submit"
                                                                                mt={0}
                                                                                mr={'xs'}
                                                                                id="EntityFormSubmit"
                                                                                leftSection={<IconDeviceFloppy
                                                                                    size={16}/>}
                                                                                onClick={() => {
                                                                                    let validation = true
                                                                                    if (!productAddedForm.values.name) {
                                                                                        validation = false
                                                                                        productAddedForm.setFieldError('name', true);
                                                                                    }
                                                                                    if (!productAddedForm.values.purchase_price) {
                                                                                        validation = false
                                                                                        productAddedForm.setFieldError('purchase_price', true);
                                                                                    }
                                                                                    if (!productAddedForm.values.sales_price) {
                                                                                        validation = false
                                                                                        productAddedForm.setFieldError('sales_price', true);
                                                                                    }
                                                                                    if (!productAddedForm.values.unit_id) {
                                                                                        validation = false
                                                                                        productAddedForm.setFieldError('unit_id', true);
                                                                                    }
                                                                                    if (!productAddedForm.values.category_id) {
                                                                                        validation = false
                                                                                        productAddedForm.setFieldError('category_id', true);
                                                                                    }
                                                                                    if (!productAddedForm.values.product_type_id) {
                                                                                        validation = false
                                                                                        productAddedForm.setFieldError('product_type_id', true);
                                                                                    }

                                                                                    productAddedForm.values['product_name'] = 'test';
                                                                                    productAddedForm.values['quantity'] = '100';

                                                                                    if (validation) {
                                                                                        const value = {
                                                                                            url: 'inventory/product',
                                                                                            data: productAddedForm.values
                                                                                        }
                                                                                        dispatch(storeEntityData(value))

                                                                                        /*
                                                                                        /!*const newProduct = {
                                                                                            product_id: 'new-id',
                                                                                            sales_price: 'new-price',
                                                                                            // ... other properties
                                                                                        };
                                                                                        const storedProducts = localStorage.getItem('user-products');
                                                                                        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
                                                                                        localProducts.push(newProduct);
                                                                                        localStorage.setItem('user-products', JSON.stringify(localProducts));*/

                                                                                        productAddedForm.reset()
                                                                                        setCategoryData(null)
                                                                                        setProductTypeData(null)
                                                                                        setProductUnitData(null)
                                                                                        setProductAddFormOpened(false)
                                                                                    }

                                                                                }}
                                                                            >
                                                                                <Flex direction={`column`} gap={0}>
                                                                                    <Text fz={12} fw={400}>
                                                                                        {t("Add")}
                                                                                    </Text>
                                                                                </Flex>
                                                                            </Button>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                </Box>
                                                            </Fieldset>
                                                        </Popover.Dropdown>
                                                    </Popover>
                                                </>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Box>
                        </form>
                        <Box>
                            <Box className={'borderRadiusAll'}>

                                <DataTable
                                    records={tempCardProducts}
                                    columns={[
                                        {
                                            accessor: 'index',
                                            title: 'SL#',
                                            textAlignment: 'right',
                                            render: (item) => (tempCardProducts.indexOf(item) + 1)
                                        },
                                        {
                                            accessor: 'display_name',
                                            title: "Name",
                                            footer: (
                                                <Group spacing="xs">
                                                    <IconSum size="1.25em"/>
                                                    <Text mb={-2}>{tempCardProducts.length} Items</Text>
                                                </Group>
                                            )
                                        },
                                        {
                                            accessor: 'mrp',
                                            title: "MRP",
                                            textAlign: "right",
                                            render: (item) => {
                                                return (
                                                    item.mrp && Number(item.mrp).toFixed(2)
                                                );
                                            }
                                        },

                                        {
                                            accessor: 'stock',
                                            title: t('Stock'),
                                            textAlign: "center"
                                        },
                                        {
                                            accessor: 'quantity',
                                            title: t('Quantity'),
                                            textAlign: "center",
                                            width: '100px',
                                            render: (item) => {
                                                const [editedQuantity, setEditedQuantity] = useState(item.quantity);

                                                const handlQuantityChange = (e) => {
                                                    const editedQuantity = e.currentTarget.value;
                                                    setEditedQuantity(editedQuantity);

                                                    const tempCardProducts = localStorage.getItem('temp-sales-products');
                                                    const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];

                                                    const updatedProducts = cardProducts.map(product => {
                                                        if (product.product_id === item.product_id) {
                                                            return {
                                                                ...product,
                                                                quantity: e.currentTarget.value,
                                                                sub_total: e.currentTarget.value * item.sales_price,
                                                            };
                                                        }
                                                        return product
                                                    });

                                                    localStorage.setItem('temp-sales-products', JSON.stringify(updatedProducts));
                                                    setLoadCardProducts(true)
                                                };

                                                return (
                                                    <>
                                                        <TextInput
                                                            type="number"
                                                            label=""
                                                            size="xs"
                                                            value={editedQuantity}
                                                            onChange={handlQuantityChange}
                                                            onKeyDown={getHotkeyHandler([
                                                                ['Enter', (e) => {
                                                                    document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                                                }],
                                                            ])}
                                                        />
                                                    </>
                                                );
                                            }
                                        },
                                        {
                                            accessor: 'unit_name',
                                            title: t('UOM'),
                                            textAlign: "center"
                                        },
                                        {
                                            accessor: 'sales_price',
                                            title: t('Price'),
                                            textAlign: "right",
                                            width: '100px',
                                            render: (item) => {
                                                const [editedSalesPrice, setEditedSalesPrice] = useState(item.sales_price);

                                                const handleSalesPriceChange = (e) => {
                                                    const newSalesPrice = e.currentTarget.value;
                                                    setEditedSalesPrice(newSalesPrice);
                                                };

                                                useEffect(() => {
                                                    const timeoutId = setTimeout(() => {
                                                        const tempCardProducts = localStorage.getItem('temp-sales-products');
                                                        const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];

                                                        const updatedProducts = cardProducts.map(product => {
                                                            if (product.product_id === item.product_id) {
                                                                return {
                                                                    ...product,
                                                                    sales_price: editedSalesPrice,
                                                                    sub_total: editedSalesPrice * item.quantity,
                                                                };
                                                            }
                                                            return product;
                                                        });

                                                        localStorage.setItem('temp-sales-products', JSON.stringify(updatedProducts));
                                                        setLoadCardProducts(true);
                                                    }, 1000);

                                                    return () => clearTimeout(timeoutId);
                                                }, [editedSalesPrice, item.product_id, item.quantity]);

                                                return (
                                                    item.percent ?
                                                        Number(item.sales_price).toFixed(2)
                                                        :
                                                        <>
                                                            <TextInput
                                                                type="number"
                                                                label=""
                                                                size="xs"
                                                                id={'inline-update-quantity-' + item.product_id}
                                                                value={editedSalesPrice}
                                                                onChange={handleSalesPriceChange}
                                                            />
                                                        </>
                                                );
                                            }
                                        },
                                        {
                                            accessor: 'percent',
                                            title: t('Discount'),
                                            textAlign: "center",
                                            width: '100px',
                                            render: (item) => {
                                                const [editedPercent, setEditedPercent] = useState(item.percent);

                                                const handlePercentChange = (e) => {
                                                    const editedPercent = e.currentTarget.value;
                                                    setEditedPercent(editedPercent);

                                                    const tempCardProducts = localStorage.getItem('temp-sales-products');
                                                    const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];

                                                    if (e.currentTarget.value && e.currentTarget.value >= 0) {
                                                        const updatedProducts = cardProducts.map(product => {
                                                            if (product.product_id === item.product_id) {
                                                                const discountAmount = (item.mrp * editedPercent) / 100;
                                                                const salesPrice = item.mrp - discountAmount;

                                                                return {
                                                                    ...product,
                                                                    percent: editedPercent,
                                                                    sales_price: salesPrice,
                                                                    sub_total: salesPrice * item.quantity,
                                                                };
                                                            }
                                                            return product
                                                        });

                                                        localStorage.setItem('temp-sales-products', JSON.stringify(updatedProducts));
                                                        setLoadCardProducts(true)
                                                    }
                                                };

                                                return (
                                                    item.percent &&
                                                    <>
                                                        <TextInput
                                                            type="number"
                                                            label=""
                                                            size="xs"
                                                            value={editedPercent}
                                                            onChange={handlePercentChange}
                                                            rightSection={
                                                                editedPercent === '' ?
                                                                    <>{item.percent}<IconPercentage size={16}
                                                                                                    opacity={0.5}/></>
                                                                    :
                                                                    <IconPercentage size={16} opacity={0.5}/>
                                                            }
                                                        />
                                                    </>
                                                );
                                            },
                                            footer: (
                                                <Group spacing="xs">
                                                    <Text mb={-2}>SubTotal</Text>
                                                    <IconSum size="1.25em"/>
                                                </Group>
                                            ),
                                        },

                                        {
                                            accessor: 'sub_total',
                                            title: t('SubTotal'),
                                            textAlign: "right",
                                            render: (item) => {
                                                return (
                                                    item.sub_total && Number(item.sub_total).toFixed(2)
                                                );
                                            },
                                            footer: (
                                                <Group spacing="xs">
                                                    <Text fw={'800'}>{
                                                        salesSubTotalAmount.toFixed(2)
                                                    }</Text>
                                                </Group>
                                            ),
                                        },


                                        {
                                            accessor: "action",
                                            title: "Action",
                                            textAlign: "right",
                                            render: (item) => (
                                                <Group gap={4} justify="right" wrap="nowrap">

                                                    <ActionIcon
                                                        size="sm"
                                                        variant="subtle"
                                                        color="red"
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
                                                                confirmProps: {color: 'red'},
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
                                                        <IconX size={16} style={{width: '70%', height: '70%'}}
                                                               stroke={1.5}/>
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]
                                    }
                                    fetching={fetching}
                                    totalRecords={100}
                                    recordsPerPage={10}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height}
                                    scrollAreaProps={{type: 'never'}}
                                />
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8} bg={'white'}>
                        <SalesForm
                            salesSubTotalAmount={salesSubTotalAmount}
                            tempCardProducts={tempCardProducts}
                            totalPurchaseAmount={totalPurchaseAmount}
                        />
                    </Grid.Col>

                </Grid>
            </Box>
        </Box>

    );
}

export default GeneralSalesForm;
